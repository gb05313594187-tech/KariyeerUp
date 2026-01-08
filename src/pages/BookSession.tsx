// src/pages/BookSession.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/reservation-email";

// ✅ DOĞRU route
const PAYTR_ROUTE = "/paytr/checkout";

const pad2 = (n: number) => String(n).padStart(2, "0");
const toYMD = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const parseYMD = (s: string) => {
  const [y, m, d] = String(s || "")
    .split("-")
    .map((x) => parseInt(x, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, diff: number) =>
  new Date(d.getFullYear(), d.getMonth() + diff, 1);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBeforeDay = (a: Date, b: Date) =>
  startOfDay(a).getTime() < startOfDay(b).getTime();

function buildMonthGrid(viewMonth: Date) {
  const mondayIndex = (dow: number) => (dow + 6) % 7;
  const first = startOfMonth(viewMonth);
  const lead = mondayIndex(first.getDay());
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - lead);

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === viewMonth.getMonth() });
  }
  return cells;
}

const monthTR = (d: Date) =>
  d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

const monthNameTR = (year: number, monthIdx: number) =>
  new Date(year, monthIdx, 1).toLocaleDateString("tr-TR", { month: "long" });

export default function BookSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const coachId = searchParams.get("coachId");
  const prefillDate = searchParams.get("date") || "";
  const prefillTime = searchParams.get("time") || "";

  const today = useMemo(() => startOfDay(new Date()), []);

  const [coach, setCoach] = useState<any | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(true);

  const [authUser, setAuthUser] = useState<any | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfMonth(new Date())
  );

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = parseYMD(prefillDate);
    return d ? toYMD(d) : toYMD(new Date());
  });

  const [selectedTime, setSelectedTime] = useState<string>(() => prefillTime || "");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    note: "",
  });

  // ✅ Ay/Yıl seçici state (takvim kayma sorununu çözer: direkt seç, grid doğru render)
  const [monthPick, setMonthPick] = useState<number>(() => viewMonth.getMonth()); // 0-11
  const [yearPick, setYearPick] = useState<number>(() => viewMonth.getFullYear());

  useEffect(() => {
    // viewMonth değişince picker'ı senkronla
    setMonthPick(viewMonth.getMonth());
    setYearPick(viewMonth.getFullYear());
  }, [viewMonth]);

  useEffect(() => {
    let mounted = true;

    const loadMeAndPrefill = async () => {
      try {
        setLoadingMe(true);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const u = data?.user || null;
        if (!mounted) return;
        setAuthUser(u);

        if (!u) return;

        try {
          const { data: p } = await supabase
            .from("profiles")
            .select("id, display_name, full_name, email")
            .eq("id", u.id)
            .maybeSingle();

          const meta = u?.user_metadata || {};
          const metaName =
            meta.display_name || meta.full_name || meta.fullName || meta.name || "";

          const name = (p?.display_name || p?.full_name || metaName || "").trim();
          const email = (p?.email || u?.email || "").trim();

          setForm((f) => ({
            ...f,
            fullName: f.fullName || name || "",
            email: f.email || email || "",
          }));
        } catch {}
      } catch (e) {
        console.error("BookSession auth/prefill error:", e);
      } finally {
        if (mounted) setLoadingMe(false);
      }
    };

    loadMeAndPrefill();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        if (!coachId) return;
        setLoadingCoach(true);

        const { data, error } = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .eq("id", coachId)
          .single();

        if (error) {
          console.error("Coach fetch error:", error);
          toast.error("Koç bilgisi alınamadı.");
          return;
        }
        setCoach(data);
      } finally {
        setLoadingCoach(false);
      }
    };

    fetchCoach();
  }, [coachId]);

  useEffect(() => {
    const d = parseYMD(prefillDate);
    if (d) {
      setSelectedDate(toYMD(d));
      setViewMonth(startOfMonth(d));
    } else {
      const now = new Date();
      setViewMonth(startOfMonth(now));
    }
    if (prefillTime) setSelectedTime(prefillTime);
  }, [prefillDate, prefillTime]);

  const specializations = useMemo(() => {
    const raw =
      coach?.specializations ?? coach?.expertise_tags ?? coach?.specialization ?? "";
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string") {
      return raw
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [coach]);

  const timeSlots = [
    "09:00","10:00","11:00","12:00","13:00","14:00",
    "15:00","16:00","17:00","18:00","19:00","20:00",
  ];

  const calendarCells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const canSubmit =
    !!coachId &&
    !!selectedDate &&
    !!selectedTime &&
    !!String(form.fullName || "").trim() &&
    !!String(form.email || "").trim();

  const goToPayment = (payload: { requestId: string }) => {
    const qs = new URLSearchParams();
    qs.set("requestId", payload.requestId);
    navigate(`${PAYTR_ROUTE}?${qs.toString()}`, { replace: true });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!coachId) return toast.error("Koç bilgisi bulunamadı.");
    if (!selectedDate || !selectedTime) return toast.error("Tarih ve saat seç.");
    if (!String(form.fullName || "").trim() || !String(form.email || "").trim())
      return toast.error("Ad soyad ve e-posta zorunlu.");

    try {
      setIsSubmitting(true);

      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;

      if (!userId) {
        toast.error("Seans talebi için giriş yapmalısın.");
        navigate(`/login`);
        return;
      }

      // 1) INSERT
      const { data: created, error: insErr } = await supabase
        .from("app_2dff6511da_session_requests")
        .insert({
          coach_id: coachId,
          user_id: userId,
          full_name: String(form.fullName || "").trim(),
          email: String(form.email || "").trim(),
          selected_date: selectedDate,
          selected_time: selectedTime,
          note: String(form.note || "").trim() || null,
          status: "pending",
          payment_status: "pending",
        })
        .select("id")
        .single();

      if (insErr) {
        console.error("Insert error:", insErr);
        toast.error("Seans talebi oluşturulamadı.");
        return;
      }

      const requestId = created?.id;
      if (!requestId) {
        toast.error("Talep oluşturuldu ama ID alınamadı.");
        return;
      }

      // 2) PayTR için DB alanlarını doldur (kritik)
      const fee = Number(coach?.session_fee || 0);
      const paymentAmount = Math.max(1, Math.round(fee * 100)); // kuruş
      const merchantOid = String(requestId).replace(/-/g, ""); // alfanumerik

      const { error: upErr } = await supabase
        .from("app_2dff6511da_session_requests")
        .update({
          payment_status: "pending",
          currency: "TL",
          payment_amount: paymentAmount,
          merchant_oid: merchantOid,
        })
        .eq("id", requestId);

      if (upErr) {
        console.error("Payment fields update error:", upErr);
        toast.error("Ödeme alanları yazılamadı.");
        return;
      }

      // 3) Mail (opsiyonel)
      try {
        await fetch(FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            coach_email: coach?.email || "",
            user_email: String(form.email || "").trim(),
            coach_name: coach?.full_name || "",
            user_name: String(form.fullName || "").trim(),
            session_date: selectedDate,
            time_slot: selectedTime,
            note: form.note,
          }),
        });
      } catch {}

      // 4) Direkt ödeme
      toast.success("Ödemeye yönlendiriliyorsun...");
      goToPayment({ requestId });
      return;
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error("Bir hata oluştu, tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Yıl aralığı: bu yıl - 2 ... bu yıl + 5 (istersen genişlet)
  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    const arr: number[] = [];
    for (let i = y - 2; i <= y + 5; i++) arr.push(i);
    return arr;
  }, []);

  const jumpToMonth = (yy: number, mm: number) => {
    const next = startOfMonth(new Date(yy, mm, 1));
    setViewMonth(next);
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-400 text-white pt-8 pb-14 px-4">
        <div className="max-w-5xl mx-auto">
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
          <p className="mt-3 text-sm md:text-base text-red-50 max-w-2xl">
            Takvimden günü seç, saat aralığını belirle. Talep oluşturulur ve ödeme
            adımına geçilir.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-red-100 p-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            <img
              src={
                coach?.avatar_url ||
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
              }
              alt={coach?.full_name || "Koç"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              Seans planladığınız koç
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm md:text-base font-bold text-gray-900">
                {loadingCoach ? "Yükleniyor..." : coach?.full_name || "Koç"}
              </span>

              <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                {coach?.title || "Kariyer Koçu"}
              </span>
            </div>

            {specializations.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {specializations.slice(0, 4).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {specializations.length > 4 && (
                  <span className="text-[11px] text-gray-500">
                    +{specializations.length - 4} alan daha
                  </span>
                )}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.message("Favori özelliği burada bağlanacak.")}
          >
            <Heart className="w-4 h-4 mr-1" />
            Favori
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* TAKVİM */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-7">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-gray-400" />
                <div className="font-extrabold text-gray-900 capitalize">
                  {monthTR(viewMonth)}
                </div>
              </div>

              {/* ✅ Yıl + Ay seçici (kayma yerine direkt seçim) */}
              <div className="flex items-center gap-2">
                <select
                  value={yearPick}
                  onChange={(e) => {
                    const yy = Number(e.target.value);
                    setYearPick(yy);
                    jumpToMonth(yy, monthPick);
                  }}
                  className="h-9 rounded-xl border border-gray-200 bg-white px-2 text-sm font-semibold"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <select
                  value={monthPick}
                  onChange={(e) => {
                    const mm = Number(e.target.value);
                    setMonthPick(mm);
                    jumpToMonth(yearPick, mm);
                  }}
                  className="h-9 rounded-xl border border-gray-200 bg-white px-2 text-sm font-semibold capitalize"
                >
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <option key={idx} value={idx}>
                      {monthNameTR(yearPick, idx)}
                    </option>
                  ))}
                </select>

                {/* İstersen kalsın: oklarla ay değişimi */}
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={() =>
                    setViewMonth((m) => addMonths(m, -1))
                  }
                  aria-label="Önceki ay"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={() =>
                    setViewMonth((m) => addMonths(m, 1))
                  }
                  aria-label="Sonraki ay"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 text-xs font-bold text-gray-500">
              {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                <div key={d} className="py-2 text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell, idx) => {
                const iso = toYMD(cell.date);
                const isSelected = selectedDate === iso;
                const disabled = isBeforeDay(cell.date, today);
                const isToday = isSameDay(cell.date, today);

                return (
                  <button
                    key={`${iso}-${idx}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(iso);
                      setSelectedTime("");
                    }}
                    className={[
                      "h-11 rounded-xl border text-sm font-semibold transition",
                      cell.inMonth ? "bg-white" : "bg-gray-50",
                      cell.inMonth ? "text-gray-900" : "text-gray-400",
                      disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-red-300",
                      isToday ? "border-orange-300" : "border-gray-200",
                      isSelected ? "border-red-600 bg-red-50 text-red-700" : "",
                    ].join(" ")}
                    title={iso}
                  >
                    {cell.date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Saat Aralığı
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => {
                  const active = selectedTime === slot;
                  const disabledSlot = !selectedDate;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={disabledSlot}
                      onClick={() => setSelectedTime(slot)}
                      className={[
                        "px-3 py-2 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2",
                        disabledSlot
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : "hover:border-red-400",
                        active
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-800",
                      ].join(" ")}
                    >
                      <Clock className="w-4 h-4" />
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-7 space-y-6"
          >
            <div>
              <div className="text-sm font-extrabold text-gray-900">
                Bilgilerini gir
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Talep oluşturmak ve ödeme adımına geçmek için giriş yapmış
                olmalısın.
              </div>
            </div>

            <div className="grid gap-4">
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Hedefiniz / Beklentiniz
                </label>
                <textarea
                  name="note"
                  placeholder="Örn: kariyer geçişi planlıyorum..."
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full h-28 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              {isSubmitting ? "Yönlendiriliyor..." : "Ödemeye Geç"}
            </Button>

            {loadingMe ? (
              <div className="text-[11px] text-gray-500">
                Profil bilgileri kontrol ediliyor...
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
