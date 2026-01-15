// src/pages/PaytrCheckout.tsx
// @ts-nocheck

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ✅ Supabase Edge Function URL
const PAYTR_FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-get-token";

// ✅ Timeout (ms)
const REQUEST_TIMEOUT_MS = 20000;

// ✅ Iframe yüksekliği
const IFRAME_MIN_HEIGHT_PX = 1300;

export default function PaytrCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestId = useMemo(() => searchParams.get("requestId"), [searchParams]);

  // 🔒 Debug sadece URL'de ?debug=1 varsa açılır
  const debugEnabled = useMemo(() => searchParams.get("debug") === "1", [searchParams]);

  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const safeSet = (fn: Function) => {
    if (mountedRef.current) fn();
  };

  const start = async () => {
    try {
      abortRef.current?.abort();
    } catch (_) {}
    abortRef.current = new AbortController();

    safeSet(() => {
      setLoading(true);
      setError(null);
      setIframeUrl(null);
      if (debugEnabled) {
        setDebug({
          at: new Date().toISOString(),
          requestId,
          phase: "start",
          env: {
            hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
            functionUrl: PAYTR_FUNCTION_URL,
          },
        });
      } else {
        setDebug(null);
      }
    });

    try {
      if (!requestId) {
        safeSet(() => {
          setError("Geçersiz ödeme isteği. (requestId yok)");
          setLoading(false);
        });
        return;
      }

      // ✅ Session + access token
      const { data: sess } = await supabase.auth.getSession();
      const access = sess?.session?.access_token;

      if (!access) {
        toast.error("Ödeme için giriş yapmalısın.");
        navigate(
          `/login?returnTo=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }

      const timeoutId = setTimeout(() => {
        try {
          abortRef.current?.abort();
        } catch (_) {}
      }, REQUEST_TIMEOUT_MS);

      const res = await fetch(PAYTR_FUNCTION_URL, {
        method: "POST",
        signal: abortRef.current.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          request_id: requestId,
        }),
      }).finally(() => clearTimeout(timeoutId));

      const json = await res.json().catch(() => ({}));

      if (debugEnabled) {
        safeSet(() => {
          setDebug((d: any) => ({
            ...(d || {}),
            phase: "function_response",
            status: res.status,
            json,
          }));
        });
      }

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.message ||
          (res.status === 401
            ? "Yetkisiz. (Session yok / Authorization yok)"
            : "Function hata döndü. (paytr-get-token)");
        safeSet(() => {
          setError(msg);
          setLoading(false);
        });
        return;
      }

      if (!json?.success) {
        safeSet(() => {
          setError(json?.error || "Ödeme başlatılamadı (success=false).");
          setLoading(false);
        });
        return;
      }

      // ✅ 1) iframe_url varsa direkt kullan
      if (json?.iframe_url) {
        safeSet(() => {
          setIframeUrl(json.iframe_url);
          setLoading(false);
        });
        return;
      }

      // ✅ 2) token varsa üret
      const token =
        json?.token ||
        json?.paytr_token ||
        json?.data?.token ||
        json?.data?.paytr_token;

      if (token) {
        const url = `https://www.paytr.com/odeme/guvenli/${token}`;
        safeSet(() => {
          setIframeUrl(url);
          setLoading(false);
        });
        return;
      }

      safeSet(() => {
        setError("Function token/iframe_url döndürmüyor.");
        setLoading(false);
      });
    } catch (e: any) {
      const isAbort =
        String(e?.name || "").toLowerCase().includes("abort") ||
        String(e || "").toLowerCase().includes("aborted");

      safeSet(() => {
        setError(
          isAbort
            ? `İstek çok uzun sürdü (${REQUEST_TIMEOUT_MS / 1000}s).`
            : "Beklenmeyen bir hata oluştu."
        );
        setLoading(false);
        if (debugEnabled) {
          setDebug((d: any) => ({
            ...(d || {}),
            phase: "catch",
            error: String(e),
          }));
        }
      });
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    start();
    return () => {
      mountedRef.current = false;
      try {
        abortRef.current?.abort();
      } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, debugEnabled]);

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
          <div className="text-sm text-gray-600">
            Ödeme hazırlanıyor… (requestId:{" "}
            <span className="font-mono">{requestId || "-"}</span>)
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

            {/* 🔒 Debug yalnızca ?debug=1 ile görünür */}
            {debugEnabled && (
              <div className="text-xs text-gray-500 border rounded p-3 bg-gray-50 overflow-auto">
                <div className="font-semibold mb-2">Debug</div>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(debug, null, 2)}
                </pre>
              </div>
            )}
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
              className="w-full border rounded"
              style={{ minHeight: `${IFRAME_MIN_HEIGHT_PX}px` }}
              frameBorder={0}
              scrolling="yes"
            />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard’a Dön
            </Button>

            {/* 🔒 Debug yalnızca ?debug=1 ile görünür */}
            {debugEnabled && (
              <div className="text-xs text-gray-500 border rounded p-3 bg-gray-50 overflow-auto">
                <div className="font-semibold mb-2">Debug</div>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(debug, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
