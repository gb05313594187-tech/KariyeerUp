// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function PaytrCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestId = useMemo(() => searchParams.get("requestId") || "", [searchParams]);

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ✅ UI debug
  const [dbgStatus, setDbgStatus] = useState<string>("");
  const [dbgBody, setDbgBody] = useState<string>("");
  const [dbgHint, setDbgHint] = useState<string>("");

  const iframeSrc = useMemo(() => {
    if (!token) return "";
    return `https://www.paytr.com/odeme/guvenli/${encodeURIComponent(token)}`;
  }, [token]);

  async function manualFetchDebug(fnName: string, reqId: string) {
    const base = import.meta.env.VITE_SUPABASE_URL;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!base || !anon) {
      const msg = `ENV eksik: VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY yok. (base=${String(
        base
      )}, anon=${anon ? "var" : "yok"})`;
      console.error(msg);
      setDbgHint(msg);
      return;
    }

    const url = `${base}/functions/v1/${fnName}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify({ request_id: reqId }),
    });

    const text = await resp.text();
    console.log("paytr-get-token manual status:", resp.status);
    console.log("paytr-get-token manual body:", text);

    setDbgStatus(String(resp.status));
    setDbgBody(text);

    return { status: resp.status, bodyText: text };
  }

  async function getPaytrTokenDebug(reqId: string) {
    const fnName = "paytr-get-token";

    // 1) normal invoke
    const { data, error } = await supabase.functions.invoke(fnName, {
      body: { request_id: reqId },
    });

    console.log("paytr-get-token invoke response:", { data, error });

    if (!error) {
      const t = data?.token;
      if (!t) throw new Error("Token missing in 200 response");
      return String(t);
    }

    // 2) invoke hata verdiyse: manual fetch ile body’yi ekrana bas
    await manualFetchDebug(fnName, reqId);

    throw error;
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setToken("");
        setDbgStatus("");
        setDbgBody("");
        setDbgHint("");

        if (!requestId) {
          const msg = "RequestId yok.";
          console.error("paytr: missing requestId in URL");
          if (!alive) return;
          setErrorMsg(msg);
          toast.error(msg);
          return;
        }

        console.log("paytr requestId:", requestId);

        const t = await getPaytrTokenDebug(requestId);
        if (!alive) return;
        setToken(t);
      } catch (e) {
        console.error("paytr token flow failed:", e);
        if (!alive) return;
        setErrorMsg("Ödeme başlatılamadı (token).");
        toast.error("Ödeme başlatılamadı (token).");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [requestId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-red-500">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 inline-flex items-center gap-2 text-white/90 hover:text-white"
          >
            <span className="text-lg">←</span>
            <span>Geri</span>
          </button>

          <h1 className="text-3xl font-bold text-white">Ödeme</h1>
          <p className="mt-1 text-white/90">
            Ödeme güvenli şekilde PayTR altyapısında tamamlanır.
          </p>
          <p className="mt-1 text-white/80 text-sm">Kart bilgileri platformda saklanmaz.</p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <div className="text-gray-700 font-medium">Yükleniyor...</div>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="text-red-700 font-semibold">Ödeme iframe oluşturulamadı.</div>
            <div className="mt-1 text-red-700/90 text-sm">{errorMsg}</div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Dashboard&apos;a dön
              </button>

              <button
                onClick={() => window.location.reload()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
              >
                Yeniden dene
              </button>
            </div>
          </div>
        )}

        {!loading && !errorMsg && token && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm text-gray-600">Güvenli ödeme ekranı yükleniyor...</div>

            <iframe
              title="PayTR Checkout"
              src={iframeSrc}
              className="w-full rounded-lg border border-gray-200"
              style={{ height: 720 }}
              frameBorder={0}
              allow="payment *"
            />
          </div>
        )}

        {/* Debug */}
        {!loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800">
            <div className="font-semibold mb-2">Debug</div>
            <div>requestId: {requestId || "(yok)"}</div>
            <div>token: {token ? "(var)" : "(yok)"}</div>

            <div className="mt-2 font-semibold">Edge Function Response</div>
            <div>status: {dbgStatus || "(yok)"}</div>
            <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-white p-3 border border-gray-200">
              {dbgBody || "(body yok — invoke hata verdi ama manual fetch body alamadı)"}
            </pre>

            {dbgHint && (
              <div className="mt-2 text-red-700">
                {dbgHint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
