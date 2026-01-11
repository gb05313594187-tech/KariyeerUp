// src/pages/PaytrCheckout.tsx
// @ts-nocheck

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Edge Function URL (Supabase)
const PAYTR_FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-get-token";

export default function PaytrCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestId = useMemo(() => searchParams.get("requestId"), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    setIframeUrl(null);

    try {
      if (!requestId) {
        setError("Geçersiz ödeme isteği. (requestId yok)");
        setLoading(false);
        return;
      }

      // login kontrolü (opsiyonel ama kalsın)
      const { data: sess } = await supabase.auth.getSession();
      if (!sess?.session) {
        toast.error("Ödeme için giriş yapmalısın.");
        navigate(
          `/login?returnTo=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }

      // ✅ Function çağrısı
      const res = await fetch(PAYTR_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: requestId, // ✅ function tarafında bu isimle okuyorsun
        }),
      });

      const json = await res.json().catch(() => ({}));
      setDebug({ status: res.status, json });

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.message ||
          "Function hata döndü. (paytr-get-token)";
        setError(msg);
        setLoading(false);
        return;
      }

      if (!json?.success) {
        setError(json?.error || "Ödeme başlatılamadı (success=false).");
        setLoading(false);
        return;
      }

      // ✅ 1) Eğer function direkt iframe_url döndürüyorsa
      if (json?.iframe_url) {
        setIframeUrl(json.iframe_url);
        setLoading(false);
        return;
      }

      // ✅ 2) Eğer function token döndürüyorsa -> iframe_url üret
      const token =
        json?.token ||
        json?.paytr_token ||
        json?.data?.token ||
        json?.data?.paytr_token;

      if (token) {
        const url = `https://www.paytr.com/odeme/guvenli/${token}`;
        setIframeUrl(url);
        setLoading(false);
        return;
      }

      // ✅ 3) Hiçbiri yoksa: senin mevcut function halen test response dönüyor demektir
      setError(
        "Function token/iframe_url döndürmüyor. Şu an test response dönüyor olabilir."
      );
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setError("Beklenmeyen bir hata oluştu.");
      setLoading(false);
    }
  };

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Güvenli Ödeme (PayTR)</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Geri Dön
          </Button>
        </div>

        {loading && (
          <div className="text-sm text-gray-600">Ödeme hazırlanıyor…</div>
        )}

        {!loading && error && (
          <div className="space-y-3">
            <div className="text-sm text-red-600">{error}</div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={start}>
                Tekrar Dene
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard’a Dön
              </Button>
            </div>

            {/* Debug (prod'da istersen kaldırırsın) */}
            <div className="text-xs text-gray-500 border rounded p-3 bg-gray-50 overflow-auto">
              <div className="font-semibold mb-2">Debug</div>
              <pre className="whitespace-pre-wrap">
{JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!loading && !error && iframeUrl && (
          <div className="space-y-3">
            <div className="text-xs text-gray-600">
              Token alındı, iframe yükleniyor…
            </div>

            <iframe
              src={iframeUrl}
              title="PayTR Güvenli Ödeme"
              className="w-full h-[680px] border rounded"
              frameBorder={0}
              scrolling="no"
            />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard’a Dön
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
