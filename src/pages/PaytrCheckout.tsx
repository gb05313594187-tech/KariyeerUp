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

  // PayTR iframe URL
  const iframeSrc = useMemo(() => {
    if (!token) return "";
    return `https://www.paytr.com/odeme/guvenli/${encodeURIComponent(token)}`;
  }, [token]);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setErrorMsg("");
        setToken("");

        // ✅ requestId kontrol
        if (!requestId) {
          const msg = "RequestId yok. Ödeme başlatılamadı.";
          console.error("paytr: missing requestId in URL");
          if (!alive) return;
          setErrorMsg(msg);
          toast.error(msg);
          return;
        }

        console.log("paytr requestId:", requestId);

        // ✅ Edge Function invoke (POST + doğru body)
        const { data, error } = await supabase.functions.invoke("paytr-get-token", {
          body: { request_id: requestId },
        });

        console.log("paytr-get-token response:", { data, error });

        // ✅ invoke error (non-2xx / network / function crash)
        if (error) {
          console.error("paytr-get-token invoke error:", error);
          console.error("paytr-get-token data:", data);
          throw error;
        }

        // ✅ token yoksa
        const t = data?.token;
        if (!t) {
          console.error("paytr-get-token bad response:", data);
          throw new Error("Token missing");
        }

        if (!alive) return;
        setToken(String(t));
      } catch (e: any) {
        console.error("paytr: token flow failed:", e);
        const msg = "Ödeme başlatılamadı (token).";
        if (!alive) return;
        setErrorMsg(msg);
        toast.error(msg);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();

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
          <p className="mt-1 text-white/80 text-sm">
            Kart bilgileri platformda saklanmaz.
          </p>
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
            <div className="mb-3 text-sm text-gray-600">
              Güvenli ödeme ekranı yükleniyor...
            </div>

            {/* ✅ iframe */}
            <iframe
              title="PayTR Checkout"
              src={iframeSrc}
              className="w-full rounded-lg border border-gray-200"
              style={{ height: 720 }}
              frameBorder={0}
              allow="payment *"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
              >
                Vazgeç / Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Debug (istersen kaldır) */}
        {!loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700">
            <div className="font-semibold mb-2">Debug</div>
            <div>requestId: {requestId || "(yok)"}</div>
            <div>token: {token ? "(var)" : "(yok)"}</div>
          </div>
        )}
      </div>
    </div>
  );
}
