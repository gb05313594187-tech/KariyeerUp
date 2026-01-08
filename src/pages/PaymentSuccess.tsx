// src/pages/PaymentSuccess.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Home,
  LogIn,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  XCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const REQUESTS_TABLE = "app_2dff6511da_session_requests";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  // ✅ PayTR akışı: requestId
  // ✅ geriye dönük uyum: bookingId varsa onu da kabul et
  const requestId =
    searchParams.get("requestId") || searchParams.get("bookingId") || "";

  const me = auth?.user ?? null;
  const role = me?.userType ?? null; // client | coach | company | admin | super_admin

  const dashboardPath = useMemo(() => {
    if (role === "coach") return "/coach/dashboard";
    if (role === "company") return "/corporate/dashboard";
    if (role === "admin" || role === "super_admin") return "/admin";
    if (role === "client") return "/user/dashboard";
    return "/login";
  }, [role]);

  const primaryCtaLabel = useMemo(() => {
    if (role === "coach") return "Panele Git";
    if (role === "company") return "Kurumsal Panele Git";
    if (role === "admin" || role === "super_admin") return "Admin Paneline Git";
    return "Randevularıma Git";
  }, [role]);

  // ---------------------------
  // ✅ Payment status from DB
  // ---------------------------
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<any>(null);
  const [polling, setPolling] = useState(false);

  const paymentStatus = useMemo(() => {
    // paid_at varsa paid kabul et
    const p = row?.payment_status;
    const paidAt = row?.paid_at;
    if (p === "paid" || !!paidAt) return "paid";
    if (p === "failed") return "failed";
    // request yoksa bile kullanıcı bu sayfaya düşebilir
    return requestId ? "pending" : "unknown";
  }, [row, requestId]);

  const referenceId = useMemo(() => {
    return requestId || "-";
  }, [requestId]);

  const handlePrimary = () => {
    if (!me) {
      navigate("/login");
      return;
    }

    // Client için opsiyonel: dashboard'a requestId ile gidebilirsin
    if (role === "client") {
      const url = requestId
        ? `${dashboardPath}?requestId=${encodeURIComponent(requestId)}`
        : dashboardPath;
      navigate(url);
      return;
    }

    navigate(dashboardPath);
  };

  const fetchRequest = async () => {
    if (!requestId) {
      setRow(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from(REQUESTS_TABLE)
        .select(
          "id, status, payment_status, paid_at, merchant_oid, payment_amount, currency, coach_id, user_id, selected_date, selected_time, created_at"
        )
        .eq("id", requestId)
        .maybeSingle();

      if (!error) setRow(data || null);
    } catch {
      // sessiz geç
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      await fetchRequest();
      if (!mounted) return;
    };

    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  // ✅ Polling: ödeme sonucu notify ile DB'ye yazılınca burada "paid/failed" yakala
  useEffect(() => {
    if (!requestId) return;

    // paid/failed olduysa polling yapma
    if (paymentStatus === "paid" || paymentStatus === "failed") return;

    let alive = true;
    let t: any = null;

    setPolling(true);

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from(REQUESTS_TABLE)
          .select("id, payment_status, paid_at")
          .eq("id", requestId)
          .maybeSingle();

        if (!alive) return;

        if (!error && data) {
          setRow((prev: any) => ({ ...(prev || {}), ...data }));
        }
      } catch {
        // sessiz
      } finally {
        if (!alive) return;
        t = setTimeout(poll, 2500);
      }
    };

    poll();

    return () => {
      alive = false;
      setPolling(false);
      if (t) clearTimeout(t);
    };
  }, [requestId, paymentStatus]);

  const header = useMemo(() => {
    if (paymentStatus === "paid") {
      return {
        title: "Ödeme Başarılı!",
        desc: "İşleminiz başarıyla tamamlandı.",
        Icon: CheckCircle2,
        ring: "border-t-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      };
    }

    if (paymentStatus === "failed") {
      return {
        title: "Ödeme Başarısız",
        desc: "Ödeme tamamlanamadı. Tekrar deneyebilir veya daha sonra tekrar edebilirsin.",
        Icon: XCircle,
        ring: "border-t-red-500",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      };
    }

    if (paymentStatus === "unknown") {
      return {
        title: "Ödeme Durumu",
        desc: "İşlem referansı bulunamadı.",
        Icon: ShieldCheck,
        ring: "border-t-amber-500",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-700",
      };
    }

    // pending
    return {
      title: "Ödeme Bekleniyor",
      desc: "Ödeme sonucu doğrulanıyor. Bu ekran otomatik güncellenecek.",
      Icon: Clock,
      ring: "border-t-amber-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    };
  }, [paymentStatus]);

  const nextSteps = useMemo(() => {
    if (paymentStatus === "paid") {
      return [
        "Ödeme onaylandı ve sistemde doğrulandı.",
        "Seans talebiniz koça iletildi / onay akışına alındı.",
        "Koç onayladığında panelinden takip edebileceksiniz.",
      ];
    }

    if (paymentStatus === "failed") {
      return [
        "Ödeme başarısız görünüyor.",
        "Tekrar dene butonuyla aynı talep için ödemeyi yeniden başlatabilirsin.",
        "Sorun devam ederse destek ile iletişime geç.",
      ];
    }

    if (paymentStatus === "unknown") {
      return [
        "Bu sayfaya yanlış bir link ile gelmiş olabilirsin.",
        "Dashboard üzerinden seans akışına geri dönüp tekrar deneyebilirsin.",
      ];
    }

    // pending
    return [
      "PayTR ödeme sonucu bildirimle doğrulanıyor.",
      "Bu ekran otomatik güncellenir (sayfayı kapatma).",
      "Uzun sürerse 'Yenile' ile manuel kontrol edebilirsin.",
    ];
  }, [paymentStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md text-center ${header.ring} shadow-xl`}>
        <CardHeader>
          <div
            className={`mx-auto ${header.iconBg} w-20 h-20 rounded-full flex items-center justify-center mb-4`}
          >
            <header.Icon className={`h-10 w-10 ${header.iconColor}`} />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            {header.title}
          </CardTitle>

          <p className="mt-2 text-sm text-gray-600">{header.desc}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Reference */}
          <div className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-700">
            <div className="font-semibold text-gray-900 mb-1">İşlem Referansı</div>
            <div className="font-mono break-all">{referenceId}</div>
            {polling && paymentStatus === "pending" ? (
              <div className="mt-2 text-xs text-amber-700 flex items-center justify-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Doğrulanıyor...
              </div>
            ) : null}
          </div>

          {/* Optional details (çok minimal, akış bozmaz) */}
          {!loading && row?.selected_date && row?.selected_time ? (
            <div className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-700 text-left">
              <div className="font-semibold text-gray-900 mb-1">Seans Özeti</div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tarih</span>
                <span className="font-semibold">{row.selected_date}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-500">Saat</span>
                <span className="font-semibold">{row.selected_time}</span>
              </div>
            </div>
          ) : null}

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">Bundan Sonra Ne Olacak?</p>
            <ul className="space-y-2 text-left list-disc pl-4">
              {nextSteps.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Login warning */}
          {!me && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 text-left">
              Devam etmek için giriş yapmanız gerekiyor.
            </div>
          )}

          {/* Pending state helper */}
          {paymentStatus === "pending" ? (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 text-left">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 mt-0.5 text-slate-700" />
                <div>
                  <div className="font-semibold text-slate-900">Güvenlik notu</div>
                  Ödeme durumu, PayTR bildirimi ile doğrulanır. Bu nedenle birkaç saniye
                  gecikme normaldir.
                </div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => fetchRequest()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    requestId
                      ? navigate(`/paytr-checkout?requestId=${encodeURIComponent(requestId)}`)
                      : navigate("/book-session")
                  }
                >
                  Ödemeye Dön
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          {/* Failed state helper */}
          {paymentStatus === "failed" ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 text-left">
              <div className="font-semibold mb-1">Ödeme başarısız.</div>
              Tekrar dene butonuyla aynı talep için ödemeyi yeniden başlatabilirsin.
              <div className="mt-3">
                <Button
                  className="rounded-xl w-full bg-red-600 hover:bg-red-700"
                  onClick={() =>
                    requestId
                      ? navigate(`/paytr-checkout?requestId=${encodeURIComponent(requestId)}`)
                      : navigate("/book-session")
                  }
                >
                  Tekrar Dene <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-blue-900 hover:bg-blue-800"
            onClick={handlePrimary}
          >
            {me ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                {primaryCtaLabel}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Giriş Yap
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>

          {/* küçük yardımcı link */}
          {me && role === "client" && (
            <Button variant="ghost" className="w-full" onClick={() => navigate("/coaches")}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Diğer Koçları Gör
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
