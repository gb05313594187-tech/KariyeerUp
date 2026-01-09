// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function PaytrCheckout() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const requestId = sp.get("requestId") || "";

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");
  const [dbg, setDbg] = useState<any>(null);

  const iframeSrc = useMemo(() => {
    if (!token) return "";
    return `https://www.paytr.com/odeme/guvenli/${token}`;
  }, [token]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);

        if (!requestId) {
          toast.error("requestId eksik.");
          navigate("/book-session");
          return;
        }

        // ✅ login şart (401 fix)
        const { data: sess } = await supabase.auth.getSession();
        const access = sess?.session?.access_token;
        if (!access) {
          toast.error("Ödeme için giriş yapmalısın.");
          navigate(`/login?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }

        // ✅ Edge function invoke (auth header otomatik gider)
        const { data, error } = await supabase.functions.invoke("paytr-get-token", {
          body: { request_id: requestId },
        });

        setDbg({ requestId, data, error });

        if (error) {
          console.error("paytr-get-token error:", error);
          toast.error("Ödeme başlatılamadı (token).");
          return;
        }

        if (!data?.token) {
          console.error("paytr-get-token bad response:", data);
          toast.error("Ödeme token alınamadı.");
          return;
        }

        if (!mounted) return;
        setToken(String(data.token));
      } catch (e) {
        console.error(e);
        toast.error("Ödeme sayfası yüklenemedi.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [requestId, navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="border-b border-slate-200 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>

          <h1 className="mt-2 text-3xl font-extrabold">Ödeme</h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Ödeme güvenli şekilde PayTR altyapısında tamamlanır.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-white/90">
            <ShieldCheck className="w-4 h-4" />
            Kart bilgileri platformda saklanmaz.
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            Güvenli ödeme ekranı yükleniyor...
          </div>
        ) : !iframeSrc ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Ödeme iframe oluşturulamadı.
            <div className="mt-3 text-xs text-red-800/80">
              Debug: {JSON.stringify(dbg)}
            </div>
            <div className="mt-4">
              <Button className="rounded-xl" onClick={() => navigate("/user/dashboard")}>
                Dashboard’a dön
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <iframe
              src={iframeSrc}
              title="PayTR"
              className="w-full"
              style={{ height: 760 }}
              frameBorder="0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
