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

// Opsiyonel mail function
const FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/reservation-email";

// ✅ DOĞRU route: PaytrCheckout sayfanın route'u bununla aynı olmalı
const PAYTR_ROUTE = "/paytr/checkout";

const REQUESTS_TABLE = "app_2dff6511da_session_requests";
const COACHES_TABLE = "app_2dff6511da_coaches";

// ----------------- Date helpers -----------------
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

function normalizeEmail(v: any) {
  return String(v || "").trim().toLowerCase();
}

function normalizeName(v: any) {
  return String(v || "").trim().replace(/\s+/g, " ");
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function BookSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const coachId = searchParams.get("coachId");
  const prefillDate = searchParams.get("date") || "";
  const prefillTime = searchParams.get("time") || "";

  const today = useMemo(() => startOfDay(new Date()), []);

  const [coach, setCoach] = useState<any | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(true);

  // ✅ Profil (tek kaynak) — submit öncesi hazır olmalı
  const [loadingMe, setLoadingMe] = useState(true);
  const [me, setMe] = useState<{
    userId: string | null;
    accessToken: string | null;
    email: string;
    fullName: string;
  }>({
    userId: null,
    accessToken: null,
    email: "",
    fullName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(new Date()));

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

  // ✅ Auth + profiles prefill (GARANTİ)
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMe(true);

        // Session (token + user)
        const { data: sess } = await supabase.auth.getSession();
        const accessToken = sess?.session?.access_token || null;
        const userId = sess?.session?.user?.id || null;
        const authEmail = normalizeEmail(sess?.session?.user?.email || "");

        if (!userId) {
          // giriş yok -> form boş kalabilir, submit zaten login ister
          if (!mounted) return;
          setMe({ userId: null, accessToken: null, email: "", fullName: "" });
          return;
        }

        // profiles
        const { data: p, error: pErr } = await supabase
          .from("profiles")
          .select("id, display_name, full_name, email")
          .eq("id", userId)
          .maybeSingle();

        if (pErr) console.error("profiles read error:", pErr);

        const profileName = normalizeName(p?.full_name || p?.display_name || "");
        const profileEmail = normalizeEmail(p?.email || "");

        // meta fallback
        const meta = sess?.session?.user?.user_metadata || {};
        const metaName = normalizeName(
          meta.display_name || meta.full_name || meta.fullName || meta.name || ""
        );

        const finalName = profileName || metaName || "";
        const finalEmail = profileEmail || authEmail || "";

        if (!mounted) return;

        setMe({
          userId,
          accessToken,
          email: finalEmail,
          fullName: finalName,
        });

        // Formu doldur (kullanıcı yazdıysa ezme)
        setForm((f) => ({
          ...f,
          fullName: f.fullName || finalName || "",
          email: f.email || finalEmail || "",
        }));
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoadingMe(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  // Coach fetch
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        if (!coachId) return;
        setLoadingCoach(true);

        const { data, error } = await supabase
          .from(COACHES_TABLE)
          .select(
            "id, full_name, email, avatar_url, title, session_fee, specializations, expertise_tags, specialization"
          )
          .eq("id", coachId)
          .maybeSingle();

        if (error || !data) {
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

  // Prefill -> viewMonth sync
  useEffect(() => {
    const d = parseYMD(prefillDate);
    if (d) {
      setSelectedDate(toYMD(d));
      setViewMonth(startOfMonth(d));
    } else {
      setViewMonth(startOfMonth(new Date()));
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

  const calendarCells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  // ✅ submit için: profil okuması bitmiş olsun + email valid olsun
  const safeName = useMemo(() => normalizeName(form.fullName), [form.fullName]);
  const safeEmail = useMemo(() => normalizeEmail(form.email), [form.email]);

  const canSubmit =
    !!coachId &&
    !!selectedDate &&
    !!selectedTime &&
    !loadingMe &&
    !!safeName &&
    !!safeEmail &&
    isValidEmail(safeEmail);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!coachId) return toast.error("Koç bilgisi bulunamadı.");
    if (!selectedDate || !selectedTime) return toast.error("Tarih ve saat seçmelisin.");

    // ✅ login zorunlu
    const { data: sess } = await supabase.auth.getSession();
    const access = sess?.session?.access_token || null;
    const userId = sess?.session?.user?.id || null;
    if (!access || !userId) {
      toast.error("Devam etmek için giriş yapmalısın.");
      navigate(
        `/login?returnTo=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ Tek kaynak: PROFILES -> session_requests.email/full_name buradan doldur
      // (Formu kullanıcı değiştirdiyse yine alacağız ama profil boşsa izin vermeyeceğiz.)
      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("email, full_name, display_name")
        .eq("id", userId)
        .maybeSingle();
      if (pErr) console.error("profiles read error:", pErr);

      const profileEmail = normalizeEmail(p?.email || "");
      const profileName = normalizeName(p?.full_name || p?.display_name || "");

      // form fallback (kullanıcı yazmış olabilir)
      const finalEmail = profileEmail || safeEmail || normalizeEmail(sess?.session?.user?.email || "");
      const finalName = profileName || safeName || "Kullanıcı";

      if (!finalEmail || !isValidEmail(finalEmail)) {
        toast.error("Profil e-postan eksik/geçersiz. profiles tablosunu kontrol et.");
        return;
      }
      if (!finalName) {
        toast.error("Profil ad-soyadın eksik. profiles tablosunu kontrol et.");
        return;
      }

      // ✅ ücret -> kuruş
      const feeTL = Number(coach?.session_fee || 990);
      const payment_amount = Math.max(1, Math.round(feeTL * 100));

      // ✅ önce request oluştur
      const { data: created, error: insErr } = await supabase
        .from(REQUESTS_TABLE)
        .insert({
          coach_id: coachId,
          user_id: userId,

          // ✅ EN KRİTİK: asla NULL bırakma
          full_name: finalName,
          email: finalEmail,

          selected_date: selectedDate,
          selected_time: selectedTime,
          note: String(form.note || "").trim() || null,
          status: "pending",

          // ✅ PayTR alanları
          payment_status: "pending",
          currency: "TL",
          payment_amount,
          merchant_oid: null,
        })
        .select("id")
        .single();

      if (insErr || !created?.id) {
        console.error("Insert error:", insErr);
        toast.error("Seans talebi oluşturulamadı.");
        return;
      }

      const requestId = created.id;

      // ✅ merchant_oid update
      const merchantOid = `REQ${String(requestId).replace(/-/g, "")}`;
      const { error: upErr } = await supabase
        .from(REQUESTS_TABLE)
        .update({ merchant_oid: merchantOid })
        .eq("id", requestId);

      if (upErr) console.error("merchant_oid update error:", upErr);

      // ✅ Sigorta: DB'de email/full_name boş kalmış mı kontrol et ve düzelt
      const { data: checkRow, error: checkErr } = await supabase
        .from(REQUESTS_TABLE)
        .select("id, email, full_name, merchant_oid")
        .eq("id", requestId)
        .maybeSingle();

      if (checkErr) console.error("Post-insert check error:", checkErr);

      const dbEmail = normalizeEmail(checkRow?.email);
      const dbName = normalizeName(checkRow?.full_name);
      const dbOid = String(checkRow?.merchant_oid || "").trim();

      const fixPayload: any = {};
      if (!dbOid) fixPayload.merchant_oid = merchantOid;
      if (!dbEmail || !isValidEmail(dbEmail)) fixPayload.email = finalEmail;
      if (!dbName) fixPayload.full_name = finalName;

      if (Object.keys(fixPayload).length > 0) {
        const { error: fixErr } = await supabase
          .from(REQUESTS_TABLE)
          .update(fixPayload)
          .eq("id", requestId);
        if (fixErr) console.error("Fix payload update error:", fixErr);
      }

      // opsiyonel mail (akışı bozmaz)
      try {
        await fetch(FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({
            coach_email: coach?.email || "",
            user_email: finalEmail,
            coach_name: coach?.full_name || "",
            user_name: finalName,
            session_date: selectedDate,
            time_slot: selectedTime,
            note: form.note,
          }),
        });
      } catch (errMail) {
        console.error("reservation-email error:", errMail);
      }

      // ✅ direkt ödeme
      navigate(`${PAYTR_ROUTE}?requestId=${encodeURIComponent(requestId)}`, {
        replace: true,
      });
      return;
    } catch (err) {
      console.error(err);
      toast.error("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-gray-400" />
                <div className="font-extrabold text-gray-900 capitalize">
                  {monthTR(viewMonth)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={() => setViewMonth((m) => addMonths(m, -1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={() => setViewMonth((m) => addMonths(m, 1))}
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

            <div className="mt-4 text-xs text-gray-500">
              Seçilen tarih:{" "}
              <span className="font-semibold text-gray-900">
                {selectedDate || "-"}
              </span>
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

              <div className="mt-3 text-xs text-gray-500">
                Seçilen saat:{" "}
                <span className="font-semibold text-gray-900">
                  {selectedTime || "-"}
                </span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-7 space-y-6"
          >
            <div>
              <div className="text-sm font-extrabold text-gray-900">
                Bilgilerini gir
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Talep oluşturmak ve ödeme adımına geçmek için giriş yapmış olmalısın.
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Ad Soyad
                </label>
                <input
                  type="text"
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
                  placeholder="ornek@mail.com"
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                {!loadingMe && me.userId && (!me.email || !isValidEmail(me.email)) ? (
                  <div className="mt-2 text-[11px] text-red-600">
                    profiles tablosunda email boş/geçersiz. PayTR için zorunlu.
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Hedefiniz / Beklentiniz
                </label>
                <textarea
                  placeholder="Örn: kariyer geçişi planlıyorum, mülakatlara hazırlanmak istiyorum..."
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full h-28 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700">
              <div className="font-bold text-gray-900 mb-1">Özet</div>
              <div className="flex items-center justify-between gap-3">
                <span>Tarih</span>
                <span className="font-semibold">{selectedDate || "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span>Saat</span>
                <span className="font-semibold">{selectedTime || "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span>Süre</span>
                <span className="font-semibold">45 dk</span>
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
            ) : !me.userId ? (
              <div className="text-[11px] text-gray-500">
                Giriş yapmadın. Ödemeye geçmek için giriş gerekli.
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
