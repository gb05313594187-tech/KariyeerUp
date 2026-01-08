// src/pages/PaytrCheckout.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const REQUESTS_TABLE = "app_2dff6511da_session_requests";

export default function PaytrCheckout() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const requestId = sp.get("requestId") || "";

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");

  const iframeSrc = useMemo(() => {
    if (!token) return "";
    return `https://www.paytr.com/odeme/guvenli/${token}`;
  }, [token]);

  // 1) Token al
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

        const { data: u } = await supabase.auth.getUser();
        if (!u?.user?.id) {
          toast.error("Ödeme için giriş yapmalısın.");
          navigate("/login");
          return;
        }

        const { data, error } = await supabase.functions.invoke("paytr-get-token", {
          body: { request_id: requestId },
        });

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

  // 2) DB polling: notify paid yazınca success'e gönder
  useEffect(() => {
    if (!requestId) return;

    let alive = true;
    let t: any = null;

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from(REQUESTS_TABLE)
          .select("id, status, paid_at, payment_status")
          .eq("id", requestId)
          .maybeSingle();

        if (error) return;

        const pStatus = (data as any)?.payment_status;
        const paidAt = (data as any)?.paid_at;

        if (pStatus === "paid" || !!paidAt) {
          if (!alive) return;
          navigate(`/payment-success?requestId=${requestId}`, { replace: true });
          return;
        }

        if (pStatus === "failed") {
          toast.error("Ödeme başarısız görünüyor. Tekrar deneyebilirsin.");
        }
      } catch {
      } finally {
        if (alive) t = setTimeout(poll, 2500);
      }
    };

    poll();

    return () => {
      alive = false;
      if (t) clearTimeout(t);
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
            Yükleniyor...
          </div>
        ) : !iframeSrc ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Ödeme iframe oluşturulamadı.
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
