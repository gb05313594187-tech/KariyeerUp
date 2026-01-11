// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const startedRef = useRef(0);

  const start = async () => {
    startedRef.current += 1;
    const runId = startedRef.current;

    setLoading(true);
    setError(null);
    setIframeUrl(null);
    setDebug({ phase: "init", requestId, runId, at: new Date().toISOString() });

    // ✅ Watchdog: 8sn sonra hâlâ loading ise ekrana hata bas
    const watchdog = setTimeout(() => {
      // eski run’lar için çalışmasın
      if (startedRef.current !== runId) return;
      setError("İstek çok uzun sürdü (8sn). Edge Function cevap vermiyor olabilir.");
      setDebug((d: any) => ({ ...(d || {}), phase: "watchdog-timeout" }));
      setLoading(false);
    }, 8000);

    try {
      if (!requestId) {
        setError("Geçersiz ödeme isteği. (requestId yok)");
        setDebug((d: any) => ({ ...(d || {}), phase: "no-requestId" }));
        return;
      }

      setDebug((d: any) => ({ ...(d || {}), phase: "getSession" }));

      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess?.session?.access_token;

      if (!accessToken) {
        toast.error("Ödeme için giriş yapmalısın.");
        setError("Giriş gerekli (session yok).");
        setDebug((d: any) => ({ ...(d || {}), phase: "no-session" }));
        navigate(
          `/login?returnTo=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }

      // ✅ 15sn abort
      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 15000);

      setDebug((d: any) => ({ ...(d || {}), phase: "fetch-function" }));

      const res = await fetch(PAYTR_FUNCTION_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ request_id: requestId }),
      }).finally(() => clearTimeout(abortTimer));

      const json = await res.json().catch(() => ({}));

      setDebug((d: any) => ({
        ...(d || {}),
        phase: "function-response",
        httpStatus: res.status,
        json,
      }));

      if (!res.ok) {
        setError(json?.error || json?.message || `Function hata (HTTP ${res.status})`);
        return;
      }

      if (!json?.success) {
        setError(json?.error || "Ödeme başlatılamadı (success=false).");
        return;
      }

      if (json?.iframe_url) {
        setIframeUrl(json.iframe_url);
        return;
      }

      const token =
        json?.token ||
        json?.paytr_token ||
        json?.data?.token ||
        json?.data?.paytr_token;

      if (token) {
        setIframeUrl(`https://www.paytr.com/odeme/guvenli/${token}`);
        return;
      }

      setError("Function token/iframe_url döndürmüyor (response formatı uyumsuz).");
    } catch (e: any) {
      console.error(e);
      if (String(e?.name) === "AbortError") {
        setError("paytr-get-token isteği 15sn timeout oldu.");
        setDebug((d: any) => ({ ...(d || {}), phase: "abort-timeout" }));
      } else {
        setError("Beklenmeyen hata oluştu.");
        setDebug((d: any) => ({ ...(d || {}), phase: "exception", err: String(e) }));
      }
    } finally {
      clearTimeout(watchdog);
      // ✅ eski run’lar state basmasın
      if (startedRef.current === runId) setLoading(false);
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
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Ödeme hazırlanıyor…</div>
            <div className="text-xs text-gray-500 border rounded p-3 bg-gray-50 overflow-auto">
              <div className="font-semibold mb-2">Debug (loading)</div>
              <pre className="whitespace-pre-wrap">
{JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          </div>
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
              <pre className="whitespace-pre-wrap">
{JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!loading && !error && iframeUrl && (
          <div className="space-y-3">
            <div className="text-xs text-gray-600">Token alındı, iframe yükleniyor…</div>

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

            <div className="text-xs text-gray-500 border rounded p-3 bg-gray-50 overflow-auto">
              <div className="font-semibold mb-2">Debug</div>
              <pre className="whitespace-pre-wrap">
{JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
