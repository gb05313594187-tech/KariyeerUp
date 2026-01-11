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
    setDebug(null);

    try {
      if (!requestId) {
        setError("Geçersiz ödeme isteği. (requestId yok)");
        setLoading(false);
        return;
      }

      // ✅ login + access token (Edge Function çoğu zaman JWT ister)
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess?.session?.access_token;

      if (!accessToken) {
        toast.error("Ödeme için giriş yapmalısın.");
        navigate(
          `/login?returnTo=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }

      const res = await fetch(PAYTR_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ Supabase function auth headers (çok önemli)
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          // ✅ iki ihtimali de gönder (function hangisini okuyorsa)
          request_id: requestId,
          requestId: requestId,
        }),
      });

      const json = await res.json().catch(() => ({}));
      setDebug({ status: res.status, json });

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.message ||
          `Function hata döndü. (HTTP ${res.status})`;
        setError(msg);
        setLoading(false);
        return;
      }

      if (json?.success === false) {
        setError(json?.error || "Ödeme başlatılamadı (success=false).");
        setLoading(false);
        return;
      }

      // ✅ 1) function direkt iframe_url döndürürse
      if (json?.iframe_url) {
        setIframeUrl(json.iframe_url);
        setLoading(false);
        return;
      }

      // ✅ 2) token döndürürse iframe url üret
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

      // ✅ 3) token/iframe yoksa: function halen test cevap dönüyor olabilir
      setError(
        "Function token/iframe_url döndürmüyor. (Muhtemelen hâlâ test response / fiyat eşleşmesi / request bulunamadı)"
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
              <Button className="flex-1" onClick={() => navigate("/dashboard")}>
                Dashboard’a Dön
              </Button>
            </div>

            <div className="text-xs text-gray-500 border rounded p-3 bg-gray-50 overflow-auto">
              <div className="font-semibold mb-2">Debug</div>
              <div className="text-[11px] mb-2">
                URL: <span className="font-mono">{window.location.href}</span>
              </div>
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
