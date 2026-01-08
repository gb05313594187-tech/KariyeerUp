// src/pages/BookSession.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * ✅ SADECE BURAYI KONTROL ET
 */
const COACHES_TABLE = "app_2dff6511da_coaches";
const SESSION_TABLE = "app_2dff6511da_session_requests"; // farklıysa değiştir
const PAYTR_CHECKOUT_ROUTE = "/paytr/checkout"; // sende farklıysa değiştir

export default function BookSession() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const coachId = sp.get("coachId") || "";
  const date = sp.get("date") || "";
  const time = sp.get("time") || "";
  const lang = sp.get("lang") || "tr";

  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");

  // ✅ Guard: coachId/date/time yoksa asla kilitleme -> doğru yere gönder
  useEffect(() => {
    const run = async () => {
      // auth check
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        // login yoksa login'e at
        const next = `/book-session?coachId=${encodeURIComponent(
          coachId
        )}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&lang=${encodeURIComponent(
          lang
        )}`;
        navigate(`/login?lang=${encodeURIComponent(lang)}&next=${encodeURIComponent(next)}`);
        return;
      }

      // coachId yoksa: premium sayfasına ya da koç listesine dön
      if (!coachId) {
        toast.error("coachId eksik.");
        navigate("/bireysel-premium", { replace: true });
        return;
      }
      if (!date || !time) {
        toast.error("Tarih/saat eksik.");
        navigate(`/coach/${coachId}?lang=${encodeURIComponent(lang)}`, { replace: true });
        return;
      }

      // coach fetch
      setLoading(true);
      const r = await supabase.from(COACHES_TABLE).select("*").eq("id", coachId).single();
      if (r.error) {
        console.error("Coach fetch error:", r.error);
        toast.error("Koç bilgisi alınamadı.");
        navigate("/coaches", { replace: true });
        return;
      }
      setCoach(r.data);

      // kullanıcı email dolsun
      setEmail(user.email || "");
      setLoading(false);
    };

    run();
  }, [coachId, date, time, lang, navigate]);

  const coachName = useMemo(() => {
    return coach?.full_name || coach?.name || "Koç";
  }, [coach]);

  const handleCreateRequestAndPay = async () => {
    try {
      if (!coachId || !date || !time) {
        toast.error("Koç / tarih / saat eksik.");
        return;
      }

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user?.id) {
        toast.error("Giriş yapmalısın.");
        navigate(`/login?lang=${encodeURIComponent(lang)}`);
        return;
      }

      // ✅ request oluştur
      const payload = {
        coach_id: coachId,
        user_id: user.id,
        selected_date: date,
        selected_time: time,
        status: "pending",
        payment_status: "pending",
        full_name: fullName || null,
        email: email || user.email || null,
        goal: goal || null,
      };

      const ins = await supabase.from(SESSION_TABLE).insert(payload).select("id").single();
      if (ins.error) {
        console.error("Create request error:", ins.error);
        toast.error("Talep oluşturulamadı.");
        return;
      }

      const requestId = ins.data?.id;
      if (!requestId) {
        toast.error("requestId üretilemedi.");
        return;
      }

      toast.success("Talep oluşturuldu. Ödeme adımına geçiliyor...");

      // ✅ PayTR checkout
      navigate(`${PAYTR_CHECKOUT_ROUTE}?requestId=${encodeURIComponent(requestId)}&lang=${encodeURIComponent(lang)}`);
    } catch (e) {
      console.error("Unexpected:", e);
      toast.error("Bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Button
          variant="ghost"
          className="mb-6 text-gray-700"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri dön
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Seans Planla</h1>
          <p className="text-gray-600 mt-1">
            Takvimden günü seçtin, saat aralığını belirledin. Şimdi bilgilerini gir ve ödeme adımına geç.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: Özet */}
          <Card className="bg-white border border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-gray-900">
                Seans Planladığın Koç
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={coach?.avatar_url || coach?.photo_url || "https://placehold.co/80x80"}
                  className="w-14 h-14 rounded-xl object-cover border"
                  alt={coachName}
                />
                <div>
                  <div className="font-semibold text-gray-900">{coachName}</div>
                  <div className="text-sm text-gray-500">{coach?.title || "Kariyer Koçu"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{date}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{time}</span>
              </div>

              <div className="pt-2 text-xs text-gray-500">
                Ödeme sonrası koça bildirim gider ve seans kesinleşir.
              </div>
            </CardContent>
          </Card>

          {/* RIGHT: Form */}
          <Card className="bg-white border border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-gray-900">
                Bilgilerini Gir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ad Soyad</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adınız Soyadınız" />
              </div>

              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" />
              </div>

              <div className="space-y-2">
                <Label>Hedefin / Beklentin</Label>
                <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Örn: mülakat hazırlığı, kariyer geçişi..." />
              </div>

              <Button
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={handleCreateRequestAndPay}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Ödemeye Geç
              </Button>

              <div className="text-xs text-gray-500">
                Devam ederek hizmet koşullarını kabul etmiş olursun.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
