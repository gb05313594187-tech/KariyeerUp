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

// ✅ Timeout (ms) - edge function cevap vermezse UI kilitlenmesin
const REQUEST_TIMEOUT_MS = 20000;

// ✅ Auth session get timeout (ms) - supabase bazen takılıyor
const SESSION_TIMEOUT_MS = 20000;

// ✅ Iframe yüksekliği (buton aşağıda kalmasın)
const IFRAME_MIN_HEIGHT_PX = 1300;

function withTimeout<T>(p: Promise<T>, ms: number, label = "timeout"): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export default function PaytrCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestId = useMemo(() => searchParams.get("requestId"), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const safeSet = (fn: Function) => {
    if (mountedRef.current) fn();
  };

  // ✅ Daha stabil access token çekme (getSession_timeout fix)
  const getAccessTokenSafe = async (): Promise<string | null> => {
    try {
      const sessRes = await withTimeout(
        supabase.auth.getSession(),
        SESSION_TIMEOUT_MS,
        "getSession_timeout"
      );

      const access = sessRes?.data?.session?.access_token;
      if (access) return access;

      // Fallback 1: getUser() (session bozulmuş olabilir)
      const u = await withTimeout(supabase.auth.getUser(), SESSION_TIMEOUT_MS, "getUser_timeout");
      if (!u?.data?.user) return null;

      // Fallback 2: getSession tekrar dene
      const sessRes2 = await withTimeout(
        supabase.auth.getSession(),
        SESSION_TIMEOUT_MS,
        "getSession_timeout_2"
      );
      return sessRes2?.data?.session?.access_token || null;
    } catch (e) {
      // burada yakaladığımız şey senin konsoldaki getSession_timeout
      return null;
    }
  };

  const start = async () => {
    // önce eski request varsa iptal et
    try {
      abortRef.current?.abort();
    } catch (_) {}
    abortRef.current = new AbortController();

    safeSet(() => {
      setLoading(true);
      setError(null);
      setIframeUrl(null);
      setDebug({
        at: new Date().toISOString(),
        requestId,
        phase: "start",
        env: {
          hasAnonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
          functionUrl: PAYTR_FUNCTION_URL,
        },
      });
    });

    try {
      if (!requestId) {
        safeSet(() => {
          setError("Geçersiz ödeme isteği. (requestId yok)");
          setLoading(false);
        });
        return;
      }

      // ✅ Session + access token (timeout + fallback)
      const access = await getAccessTokenSafe();

      if (!access) {
        toast.error("Ödeme için giriş yapmalısın. (Session alınamadı)");
        navigate(
          `/login?returnTo=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }

      // ✅ timeout kurgusu (fetch)
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
          Accept: "application/json",
          // ✅ Supabase edge function çağrısı için kritik
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          request_id: requestId, // ✅ edge function bunu bekliyor
          // ✅ token reuse ihtimaline karşı trace
          client_ts: Date.now(),
        }),
      }).finally(() => clearTimeout(timeoutId));

      const json = await res.json().catch(() => ({}));

      safeSet(() => {
        setDebug((d: any) => ({
          ...(d || {}),
          phase: "function_response",
          status: res.status,
          json,
        }));
      });

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.message ||
          (res.status === 401
            ? "Yetkisiz. (Authorization/apikey yok ya da session yok)"
            : "Function hata döndü. (paytr-get-token)");
        safeSet(() => {
          setError(msg);
          setLoading(false);
          setShowDebug(true);
        });
        return;
      }

      if (!json?.success) {
        safeSet(() => {
          setError(json?.error || "Ödeme başlatılamadı (success=false).");
          setLoading(false);
          setShowDebug(true);
        });
        return;
      }

      // ✅ 1) function iframe_url döndürürse direkt kullan
      if (json?.iframe_url) {
        safeSet(() => {
          setIframeUrl(json.iframe_url);
          setLoading(false);
        });
        return;
      }

      // ✅ 2) function token döndürürse iframe_url üret
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
        setShowDebug(true);
      });
    } catch (e: any) {
      const isAbort =
        String(e?.name || "").toLowerCase().includes("abort") ||
        String(e || "").toLowerCase().includes("aborted");

      safeSet(() => {
        setError(
          isAbort
            ? `İstek çok uzun sürdü (${REQUEST_TIMEOUT_MS / 1000}s).`
            : String(e?.message || e || "Beklenmeyen bir hata oluştu.")
        );
        setLoading(false);
        setShowDebug(true);
        setDebug((d: any) => ({
          ...(d || {}),
          phase: "catch",
          error: String(e),
        }));
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
  }, [requestId]);

  // Debug’dan hızlı okunabilir “kanıt” alanları
  const proof = useMemo(() => {
    const j = debug?.json || {};
    return {
      status: debug?.status,
      success: j?.success,
      test_mode: j?.test_mode || j?.sent?.test_mode || j?.paytr?.test_mode,
      merchant_oid: j?.merchant_oid || j?.sent?.merchant_oid,
      token: j?.token || j?.data?.token,
      paytr_status: j?.paytr?.status,
      paytr_reason: j?.paytr?.reason,
    };
  }, [debug]);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Güvenli Ödeme (PayTR)</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDebug((v) => !v)}>
              Debug {showDebug ? "Kapat" : "Aç"}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Geri Dön
            </Button>
          </div>
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
          </div>
        )}

        {/* ✅ Debug: hata olsa da olmasa da açılabilir */}
        {showDebug && (
          <div className="text-xs text-gray-700 border rounded p-3 bg-gray-50 overflow-auto space-y-2">
            <div className="font-semibold">Debug</div>

            {/* hızlı kanıt satırı */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-semibold">status</div>
                <div className="font-mono">{String(proof.status ?? "-")}</div>
              </div>
              <div>
                <div className="font-semibold">test_mode</div>
                <div className="font-mono">{String(proof.test_mode ?? "-")}</div>
              </div>
              <div>
                <div className="font-semibold">merchant_oid</div>
                <div className="font-mono break-all">{String(proof.merchant_oid ?? "-")}</div>
              </div>
              <div>
                <div className="font-semibold">paytr_status</div>
                <div className="font-mono">{String(proof.paytr_status ?? "-")}</div>
              </div>
            </div>

            <pre className="whitespace-pre-wrap">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}
