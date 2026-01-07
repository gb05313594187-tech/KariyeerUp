// src/pages/BookSession.tsx
// @ts-nocheck
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ❗ Edge Function URL – Supabase Details ekranından aldığın URL
const FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/reservation-email";

// ✅ PayTR Init Edge Function (iframe_token alma)
// Supabase Dashboard → Edge Functions → paytr-init → Details → Function URL
const PAYTR_INIT_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/paytr-init";

export default function BookSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const coachId = searchParams.get("coachId");

  const [coach, setCoach] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: "",
    timeSlot: "",
    fullName: "",
    email: "",
    note: "",
  });

  // Koç bilgisini Supabase'ten çek
  useEffect(() => {
    const fetchCoach = async () => {
      if (!coachId) return;

      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("id", coachId)
        .single();

      if (!error) {
        setCoach(data);
      } else {
        console.error("Coach fetch error on booking page:", error);
      }
    };

    fetchCoach();
  }, [coachId]);

  // Düzenli, premium saat slotları
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  // utils
  const makeMerchantOid = () => {
    try {
      const a = new Uint32Array(2);
      crypto.getRandomValues(a);
      return `kry_${Date.now()}_${a[0].toString(16)}${a[1].toString(16)}`;
    } catch {
      return `kry_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }
  };

  const toStartsAtISO = (date: string, timeSlot: string) => {
    // date: YYYY-MM-DD, timeSlot: HH:mm (local)
    // ISO string üret (local -> ISO)
    const [y, m, d] = (date || "").split("-").map((x) => Number(x));
    const [hh, mm] = (timeSlot || "").split(":").map((x) => Number(x));
    if (!y || !m || !d) return null;
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
    if (isNaN(dt.getTime())) return null;
    return dt.toISOString();
  };

  // 🔥 PayTR akışı:
  // 1) sessions tablosuna "pending_payment" seans aç
  // 2) payments tablosuna "initiated" ödeme kaydı aç (merchant_oid)
  // 3) paytr-init function -> iframe_token al
  // 4) Payment sayfasına yönlendir (iframe ile ödeme)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!coachId) {
      toast.error("Koç bilgisi bulunamadı. Lütfen tekrar deneyin.");
      return;
    }

    if (!form.date || !form.timeSlot) {
      toast.error("Lütfen bir tarih ve saat seçin.");
      return;
    }

    if (!form.fullName || !form.email) {
      toast.error("Lütfen ad soyad ve e-posta alanlarını doldurun.");
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ Giriş yapan kullanıcı (user_id dolması için şart)
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser?.user?.id;

      if (!userId) {
        toast.error("Seans talebi için giriş yapmalısın.");
        navigate("/login");
        return;
      }

      // Seans zamanı ISO
      const startsAt = toStartsAtISO(form.date, form.timeSlot);

      // Ücret (koç datasından)
      const fee =
        Number(
          coach?.session_fee ??
            coach?.sessionPrice ??
            coach?.price ??
            coach?.fee ??
            0
        ) || 0;

      // 1) sessions tablosuna seans aç
      const { data: createdSession, error: sessionErr } = await supabase
        .from("sessions")
        .insert({
          user_id: userId,
          coach_id: coachId,
          status: "pending_payment",
          session_minutes: 45,
          starts_at: startsAt,
          price_amount: fee,
          currency: "TRY",
          notes: form.note || null,
        })
        .select("*")
        .single();

      if (sessionErr || !createdSession?.id) {
        console.error("Session insert error:", sessionErr);
        toast.error("Seans kaydı oluşturulamadı.");
        return;
      }

      const sessionId = createdSession.id;
      const merchantOid = makeMerchantOid();

      // PayTR payment_amount: kuruş (örn 199.90 TRY => 19990)
      // PayTR genelde integer kuruş ister.
      const paytrPaymentAmount = Math.round((Number(fee || 0) * 100) || 0);

      // 2) payments tablosuna ödeme kaydı aç
      const { data: createdPayment, error: payErr } = await supabase
        .from("payments")
        .insert({
          session_id: sessionId,
          user_id: userId,
          amount: Number(fee || 0),
          currency: "TRY",
          provider: "paytr",
          status: "initiated",
          merchant_oid: merchantOid,
          paytr_payment_amount: paytrPaymentAmount,
          raw: {
            coach_id: coachId,
            user_email: form.email,
            user_full_name: form.fullName,
            selected_date: form.date,
            selected_time: form.timeSlot,
          },
        })
        .select("*")
        .single();

      if (payErr || !createdPayment?.id) {
        console.error("Payment insert error:", payErr);
        toast.error("Ödeme kaydı oluşturulamadı.");
        return;
      }

      const paymentId = createdPayment.id;

      // 3) PayTR iframe_token al (Edge Function)
      // paytr-init function içinde PayTR merchant bilgilerin (merchant_id / merchant_key / merchant_salt)
      // environment variable olarak durmalı.
      let iframeToken: string | null = null;

      try {
        const res = await fetch(PAYTR_INIT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            // bizim internal
            payment_id: paymentId,
            session_id: sessionId,

            // PayTR için gerekli temel alanlar (function içinde hash üretilir)
            merchant_oid: merchantOid,
            user_name: form.fullName,
            user_email: form.email,
            payment_amount: paytrPaymentAmount, // kuruş
            currency: "TL",
            user_ip: null, // function içinde req headers'dan yakalayabilir veya null kalır
            no_installment: 0,
            max_installment: 0,

            // sayfada göstermek için
            coach_name: coach?.full_name || "",
            coach_title: coach?.title || "Kariyer Koçu",
            date: form.date,
            time: form.timeSlot,
            note: form.note || "",
          }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          console.error("paytr-init error:", res.status, json);
          toast.error("PayTR ödeme başlatılamadı (init).");
          return;
        }

        iframeToken =
          json?.iframe_token ||
          json?.token ||
          json?.data?.iframe_token ||
          null;

        if (!iframeToken) {
          console.error("paytr-init response missing iframe_token:", json);
          toast.error("PayTR token alınamadı.");
          return;
        }
      } catch (initErr) {
        console.error("paytr-init fetch error:", initErr);
        toast.error("PayTR bağlantı hatası.");
        return;
      }

      // 4) payments tablosuna token yaz (opsiyonel ama iyi)
      try {
        const { error: upTokErr } = await supabase
          .from("payments")
          .update({ paytr_iframe_token: iframeToken })
          .eq("id", paymentId);

        if (upTokErr) {
          console.error("Payment token update error:", upTokErr);
          // devam
        }
      } catch (e2) {
        console.error("Payment token update catch:", e2);
      }

      // 5) Edge Function ile mail gönder (isteğe bağlı) — “Talep alındı” maili
      // (Ödeme başarılı olunca ayrıca lifecycle event göndereceğiz)
      try {
        const res = await fetch(FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            coach_email: coach?.email || "",
            user_email: form.email,
            coach_name: coach?.full_name || "",
            user_name: form.fullName,
            session_date: form.date,
            time_slot: form.timeSlot,
            note: form.note,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Email function error:", res.status, text);
          // kayıt zaten oluştu, kullanıcıya ekstra hata göstermiyoruz
        }
      } catch (emailErr) {
        console.error("Email function fetch error:", emailErr);
      }

      // 6) Payment sayfasına yönlendir
      // NOT: Route sende farklıysa (PaymentPage.tsx hangi path'e bağlıysa) burayı aynen o path yap.
      toast.success("Ödeme sayfasına yönlendiriliyorsun…");

      navigate(`/payment?merchant_oid=${encodeURIComponent(merchantOid)}`, {
        state: {
          sessionId,
          paymentId,
          merchantOid,
          iframeToken,
          amount: Number(fee || 0),
          currency: "TRY",
          coachId,
          coachName: coach?.full_name || "",
          date: form.date,
          timeSlot: form.timeSlot,
        },
      });
    } catch (err) {
      console.error("Reservation/PayTR init error:", err);
      toast.error("Bir hata oluştu, lütfen tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const specializations = (coach?.specializations || []) as string[];

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* HERO - turuncu/kırmızı gradient */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-400 text-white pt-8 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-4 text-white/90 hover:text-white text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri dön
          </button>

          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            Seans Planla
          </h1>
          <p className="mt-3 text-sm md:text-base text-red-50 max-w-xl">
            Uygun tarih ve saati seç, ödeme tamamlandıktan sonra seansın
            planlanacaktır.
          </p>
        </div>
      </div>

      {/* KOÇ ÖZET KARTI + FORM */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-20 relative z-10">
        {/* Koç bilgisi kartı */}
        {coach && (
          <div className="bg-white rounded-2xl shadow-md border border-red-100 p-4 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              <img
                src={
                  coach.avatar_url ||
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
                }
                alt={coach.full_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                Seans planladığınız koç
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm md:text-base font-bold text-gray-900">
                  {coach.full_name}
                </span>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  {coach.title || "Kariyer Koçu"}
                </span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  {Number(
                    coach?.session_fee ??
                      coach?.sessionPrice ??
                      coach?.price ??
                      coach?.fee ??
                      0
                  ) || 0}{" "}
                  TRY
                </span>
              </div>
              {specializations.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {specializations.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {specializations.length > 3 && (
                    <span className="text-[11px] text-gray-500">
                      +{specializations.length - 3} alan daha
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORM KARTI */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-8"
        >
          {/* TARİH SEÇİMİ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Tarih Seç
            </label>
            <div className="flex items-center gap-3 mt-1">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full max-w-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
          </div>

          {/* SAAT SEÇİMİ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Saat Aralığı
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {timeSlots.map((slot) => (
                <label key={slot} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    className="peer sr-only"
                    required
                    checked={form.timeSlot === slot}
                    onChange={() =>
                      setForm((f) => ({ ...f, timeSlot: slot }))
                    }
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-700 peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-700 hover:border-red-400 transition">
                    <Clock className="w-4 h-4" />
                    {slot}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* İLETİŞİM BİLGİLERİ */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Ad Soyad
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Adınız Soyadınız"
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                placeholder="ornek@mail.com"
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
          </div>

          {/* HEDEF / BEKLENTİ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Hedefiniz / Beklentiniz
            </label>
            <textarea
              name="note"
              placeholder="Örn: kariyer geçişi planlıyorum, mülakatlara hazırlanmak istiyorum..."
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full h-24 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={form.note}
              onChange={(e) =>
                setForm((f) => ({ ...f, note: e.target.value }))
              }
            />
          </div>

          {/* ALT ÇUBUK */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-4 h-4" />
              45 dk seans süresi
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              {isSubmitting ? "Ödeme başlatılıyor..." : "Rezervasyonu Tamamla"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
