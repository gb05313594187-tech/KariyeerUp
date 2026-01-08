// src/pages/CoachProfile.tsx
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Heart,
  CalendarDays,
  Clock,
  MessageCircle,
  Award,
  Globe2,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

/* ----------------------------- content mocks ----------------------------- */
const mockReviews = [
  {
    name: "Mert Y.",
    role: "Ürün Yöneticisi",
    rating: 5,
    date: "02 Aralık 2025",
    text: "3 aydır birlikte çalışıyoruz. Kariyerimdeki tıkanıklığı aşmamda çok yardımcı oldu, yönüm netleşti.",
  },
  {
    name: "Zeynep A.",
    role: "Yeni Mezun",
    rating: 5,
    date: "28 Kasım 2025",
    text: "Mülakat provaları sayesinde 2 farklı yerden teklif aldım. Çok sistematik ve destekleyici bir yaklaşımı var.",
  },
];

const fallbackCoach = {
  name: "Elif Kara",
  title: "Kariyer Koçu",
  location: "Online",
  rating: 4.9,
  reviewCount: 128,
  totalSessions: 780,
  favoritesCount: 364,
  isOnline: true,
  tags: ["Kariyer", "Liderlik", "Mülakat", "CV", "Yeni Mezun"],
  photo_url:
    "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: `
10+ yıllık kurumsal deneyime sahip Executive ve Kariyer Koçu. 
Unilever, Google, Trendyol gibi şirketlerde liderlik gelişimi, kariyer geçişi ve performans koçluğu alanlarında birebir ve grup çalışmaları yürüttü.
  `,
  methodology: `
Seanslarımda çözüm odaklı koçluk, pozitif psikoloji ve aksiyon planı odaklı çalışma yöntemlerini kullanıyorum.
  `,
  education: ["ICF Onaylı Profesyonel Koçluk Programı (PCC Track)"],
  experience: ["Kıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi"],
  cv_url: null,
};

const toStringArray = (value: any, fallback: string[] = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return fallback;
};

const localeByLang = (lang: string) => {
  const l = (lang || "tr").toLowerCase();
  if (l === "tr") return "tr-TR";
  if (l === "en") return "en-US";
  if (l === "fr") return "fr-FR";
  if (l === "ar") return "ar-TN";
  return "tr-TR";
};

const tMini = (lang: string) => {
  const l = (lang || "tr").toLowerCase();
  if (l === "en")
    return {
      loading: "Loading coach profile...",
      chooseDate: "Pick a date",
      chooseTime: "Pick a time",
      bookNow: "Book now",
      selectTimeFirst: "Please select a time first.",
      loginRequired: "Please login to book a session.",
      back: "Back",
    };
  if (l === "fr")
    return {
      loading: "Chargement du profil...",
      chooseDate: "Choisir une date",
      chooseTime: "Choisir une heure",
      bookNow: "Réserver",
      selectTimeFirst: "Veuillez d’abord choisir une heure.",
      loginRequired: "Veuillez vous connecter pour réserver.",
      back: "Retour",
    };
  if (l === "ar")
    return {
      loading: "جاري تحميل الملف...",
      chooseDate: "اختر التاريخ",
      chooseTime: "اختر الوقت",
      bookNow: "احجز الآن",
      selectTimeFirst: "اختر الوقت أولاً.",
      loginRequired: "سجّل الدخول للحجز.",
      back: "رجوع",
    };
  return {
    loading: "Koç profili yükleniyor...",
    chooseDate: "Tarih seç",
    chooseTime: "Saat seç",
    bookNow: "Hemen Seans Al",
    selectTimeFirst: "Lütfen önce bir saat seç.",
    loginRequired: "Seans almak için giriş yapmalısın.",
    back: "Geri dön",
  };
};

/* ----------------------------- calendar utils ----------------------------- */
const pad2 = (n: number) => String(n).padStart(2, "0");
const toYMD = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

function buildMonthGrid(viewDate: Date) {
  const first = startOfMonth(viewDate);
  // Pazartesi başlangıç
  const dow = (first.getDay() + 6) % 7; // Sun->6, Mon->0...
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - dow);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return { first, days };
}

const generateTimeSlots = (startHour = 10, endHour = 22, intervalMinutes = 30) => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      slots.push(`${pad2(h)}:${pad2(m)}`);
    }
  }
  return slots;
};

const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(s || "").trim()
  );

/* -------------------------------- component ------------------------------ */
export default function CoachProfile() {
  // ✅ param esnek
  const params: any = useParams();
  const slugOrId = params?.slugOrId || params?.slug || params?.id;

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const TT = tMini(language || "tr");
  const locale = useMemo(() => localeByLang(language || "tr"), [language]);

  const [coachRow, setCoachRow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Takvim state (gerçek ay/yıl/gün)
  const [viewDate, setViewDate] = useState<Date>(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>(() => toYMD(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // ✅ Dolu saatler
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // ✅ coach fetch: önce slug, bulamazsa id
  useEffect(() => {
    if (!slugOrId) return;

    const run = async () => {
      setLoading(true);
      try {
        let data: any = null;
        let error: any = null;

        // slug ile dene
        const r1 = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .eq("slug", slugOrId)
          .single();

        data = r1.data;
        error = r1.error;

        // id ile dene
        if ((error || !data) && isUuid(slugOrId)) {
          const r2 = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("id", slugOrId)
            .single();
          data = r2.data;
          error = r2.error;
        }

        if (error) {
          console.error("Coach fetch error:", error);
          setCoachRow(null);
        } else {
          setCoachRow(data);
        }
      } catch (e) {
        console.error("Unexpected fetch error:", e);
        setCoachRow(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [slugOrId]);

  // UI map
  const c = useMemo(() => {
    const coach = coachRow;
    if (!coach) return { ...fallbackCoach, id: null };

    return {
      id: coach.id,
      name: coach.full_name || fallbackCoach.name,
      title: coach.title || "Kariyer Koçu",
      location: coach.location || coach.city || coach.country || "Online",
      rating: coach.rating ?? 5,
      reviewCount: coach.total_reviews ?? 0,
      totalSessions: coach.total_sessions ?? 0,
      favoritesCount: coach.favorites_count ?? 0,
      isOnline: coach.is_online ?? true,
      photo_url: coach.avatar_url || coach.photo_url || fallbackCoach.photo_url,
      tags: toStringArray(coach.specializations, fallbackCoach.tags),
      bio: coach.summary || coach.bio || fallbackCoach.bio,
      methodology: coach.methodology || fallbackCoach.methodology,
      education: toStringArray(coach.education_list, fallbackCoach.education),
      experience: toStringArray(coach.experience_list, fallbackCoach.experience),
      services: coach.services || [],
      programs: coach.programs || [],
      faqs:
        coach.faqs ||
        [
          {
            q: "Seanslar online mı gerçekleşiyor?",
            a: "Evet, tüm seanslar Zoom veya Google Meet üzerinden online olarak gerçekleşmektedir.",
          },
          {
            q: "Seans öncesi nasıl hazırlanmalıyım?",
            a: "Güncel durumunuzu, hedeflerinizi ve zorlandığınız alanları ana başlıklar halinde not almanız yeterlidir.",
          },
        ],
      cv_url: coach.cv_url || fallbackCoach.cv_url || null,
    };
  }, [coachRow]);

  // ✅ booked slots fetch (selectedDate değişince)
  useEffect(() => {
    const run = async () => {
      try {
        const coachId = c?.id;
        if (!coachId || !selectedDate) {
          setBookedSlots(new Set());
          return;
        }

        setLoadingSlots(true);

        const { data, error } = await supabase
          .from("app_2dff6511da_session_requests")
          .select("selected_time,status")
          .eq("coach_id", coachId)
          .eq("selected_date", selectedDate);

        if (error) {
          console.error("Booked slots fetch error:", error);
          setBookedSlots(new Set());
          return;
        }

        const busy = new Set<string>();
        (data || []).forEach((r: any) => {
          const st = String(r?.status || "").toLowerCase();
          const t = String(r?.selected_time || "").trim();
          if (!t) return;

          // dolu sayılacak statüler
          if (["pending", "approved", "confirmed", "paid"].includes(st)) {
            busy.add(t);
          }
        });

        setBookedSlots(busy);
      } finally {
        setLoadingSlots(false);
      }
    };

    run();
    setSelectedSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, c?.id]);

  // header helpers
  const { days } = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const monthLabel = useMemo(
    () => viewDate.toLocaleDateString(locale, { month: "long", year: "numeric" }),
    [viewDate, locale]
  );

  const todayYmd = useMemo(() => toYMD(new Date()), []);
  const isPastDay = (d: Date) => toYMD(d) < todayYmd;
  const inViewMonth = (d: Date) => d.getMonth() === viewDate.getMonth();

  const dowLabels = useMemo(() => {
    // Pazartesi başlangıç
    return ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  }, []);

  // ✅ CTA: artık book-session değil -> requestId üret -> paytr
  const handleBook = async () => {
    if (!selectedSlot) {
      toast.error(TT.selectTimeFirst);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;

    if (!userId) {
      toast.error(TT.loginRequired);
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const coachId = c?.id;
    if (!coachId) {
      toast.error("Koç bulunamadı.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_session_requests")
        .insert({
          coach_id: coachId,
          user_id: userId,
          selected_date: selectedDate,
          selected_time: selectedSlot,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Session request insert error:", error);
        toast.error("Seans talebi oluşturulamadı.");
        return;
      }

      const requestId = data?.id;
      if (!requestId) {
        toast.error("requestId üretilemedi.");
        return;
      }

      navigate(`/paytr/checkout?requestId=${encodeURIComponent(requestId)}`);
    } catch (e) {
      console.error("Unexpected book error:", e);
      toast.error("Beklenmeyen bir hata oluştu.");
    }
  };

  if (loading && !coachRow) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        {TT.loading}
      </div>
    );
  }

  const timeSlots = useMemo(() => generateTimeSlots(10, 22, 30), []);

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      {/* HERO */}
      <section className="w-full bg-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-start gap-10">
          {/* Profil Fotoğrafı */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={c.photo_url}
                alt={c.name}
                className="w-36 h-36 rounded-2xl object-cover shadow-md border border-gray-200"
              />
              {c.isOnline && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white" />
                </span>
              )}
            </div>

            <button className="mt-4 px-4 py-1.5 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
              {c.isOnline ? "• Şu An Uygun" : "• Şu An Meşgul"}
            </button>
          </div>

          {/* Koç Bilgisi */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{c.name}</h1>
              <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs">
                Öne Çıkan Koç
              </Badge>
            </div>

            <p className="text-lg text-gray-700 flex items-center gap-2">
              {c.title}
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <Globe2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{c.location}</span>
            </p>

            {/* Etiketler */}
            <div className="flex flex-wrap gap-2 mt-2">
              {c.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* İstatistikler */}
            <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">{Number(c.rating || 0).toFixed(1)}</span>
                <span className="text-gray-500">({c.reviewCount || 0} değerlendirme)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{c.totalSessions || 0}</span>
                <span className="text-gray-500">seans</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{c.favoritesCount || 0}</span>
                <span className="text-gray-500">favori</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                onClick={handleBook}
                disabled={!selectedDate || !selectedSlot}
              >
                {TT.bookNow}
              </Button>

              <Button
                variant="outline"
                className="px-6 py-3 rounded-xl border-gray-300 text-gray-800 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Favorilere Ekle
              </Button>
            </div>
          </div>

          {/* RIGHT: REAL CALENDAR + BUSY SLOTS */}
          <div className="w-full md:w-80">
            <Card className="bg-[#FFF8F5] border-orange-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  Takvimden Gün ve Saat Seç
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Ay kontrol */}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-orange-200"
                    onClick={() => {
                      const d = new Date(viewDate);
                      d.setMonth(d.getMonth() - 1);
                      setViewDate(startOfMonth(d));
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="text-center text-sm font-semibold text-gray-900 flex-1 capitalize">
                    {monthLabel}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-orange-200"
                    onClick={() => {
                      const d = new Date(viewDate);
                      d.setMonth(d.getMonth() + 1);
                      setViewDate(startOfMonth(d));
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* DOW */}
                <div className="grid grid-cols-7 gap-1 text-[11px] text-gray-500">
                  {dowLabels.map((d) => (
                    <div key={d} className="text-center py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Gün grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((d, idx) => {
                    const ymd = toYMD(d);
                    const disabled = isPastDay(d);
                    const selected = ymd === selectedDate;
                    const muted = !inViewMonth(d);

                    return (
                      <button
                        key={`${ymd}-${idx}`}
                        disabled={disabled}
                        onClick={() => {
                          setSelectedDate(ymd);
                          setSelectedSlot(null);
                        }}
                        className={[
                          "h-9 rounded-xl text-sm border transition",
                          selected
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-800 border-orange-200 hover:bg-orange-50",
                          disabled ? "opacity-40 cursor-not-allowed hover:bg-white" : "",
                          muted ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* Saat seçimi */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {TT.chooseTime}
                    </div>
                    {loadingSlots && (
                      <div className="text-[11px] text-gray-500">yükleniyor...</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {timeSlots.map((slot) => {
                      const busy = bookedSlots.has(slot);
                      const active = selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          disabled={busy}
                          onClick={() => setSelectedSlot(slot)}
                          className={[
                            "h-10 rounded-xl border text-sm flex items-center justify-center gap-2 transition",
                            active
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white text-gray-800 border-orange-200 hover:bg-orange-50",
                            busy ? "opacity-40 cursor-not-allowed hover:bg-white" : "",
                          ].join(" ")}
                        >
                          <Clock className="w-4 h-4" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {/* İstersen bunu tamamen kaldırabilirsin, ama bilgilendirici. */}
                  <div className="mt-3 text-[11px] text-gray-600">
                    {selectedSlot ? (
                      <>
                        Seçilen:{" "}
                        <span className="font-semibold">
                          {selectedDate} · {selectedSlot}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Önce gün, sonra saat seç.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-white border border-orange-100 rounded-full p-1">
            <TabsTrigger value="about">Hakkında</TabsTrigger>
            <TabsTrigger value="cv">Özgeçmiş</TabsTrigger>
            <TabsTrigger value="programs">Program Paketleri</TabsTrigger>
            <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            <TabsTrigger value="content">İçerikler</TabsTrigger>
            <TabsTrigger value="faq">SSS</TabsTrigger>
          </TabsList>

          {/* ABOUT */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-white border border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Koç Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-800">
                <p className="whitespace-pre-line">{c.bio}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white border border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
                    <Award className="w-4 h-4 text-orange-500" />
                    Eğitim & Sertifikalar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-800">
                  {(c.education || []).map((item: string) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-[#FFF8F5] px-3 py-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
                    <Users className="w-4 h-4 text-red-500" />
                    Tecrübe & Geçmiş
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-800">
                  {(c.experience || []).map((item: string) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-[#FFF8F5] px-3 py-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Koçluk Metodolojisi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-800 whitespace-pre-line">
                {c.methodology}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CV */}
          <TabsContent value="cv">
            <div className="space-y-4">
              {c.cv_url ? (
                <Card className="bg-white border border-orange-100 shadow-sm">
                  <CardContent className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Koçun Özgeçmişi (CV)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF formatında detaylı eğitim ve iş deneyimlerini inceleyebilirsiniz.
                      </p>
                    </div>
                    <a href={c.cv_url} target="_blank" rel="noopener noreferrer">
                      <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm">
                        Özgeçmişi Görüntüle / İndir
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white border border-orange-100 shadow-sm">
                  <CardContent className="py-4">
                    <p className="text-sm text-gray-600">Bu koç henüz özgeçmişini eklemedi.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PROGRAMS */}
          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {(c.programs || []).length === 0 && (
                <p className="text-sm text-gray-500">Bu koç henüz program paketi eklemedi.</p>
              )}
            </div>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-gray-900">
                  {Number(c.rating || 0).toFixed(1)} / 5
                </span>
                <span className="text-gray-500">({c.reviewCount || 0} değerlendirme)</span>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 text-xs">
                Filtrele
              </Button>
            </div>

            <div className="space-y-3">
              {mockReviews.map((rev, idx) => (
                <Card key={idx} className="bg-white border border-orange-100 shadow-sm">
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{rev.name}</p>
                        <p className="text-xs text-gray-500">{rev.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-900">{rev.rating}.0</span>
                        <span className="text-gray-400">· {rev.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{rev.text}</p>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-500">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Koç Yanıtı Yaz (yakında)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CONTENT */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white border border-orange-100 shadow-sm flex flex-col">
                  <div className="h-32 rounded-t-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <CardContent className="py-3 space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">
                      Kariyer Yönünü Bulmak İçin 3 Ana Soru
                    </p>
                    <p className="text-xs text-gray-500">8 dk · Video · 1.2K görüntülenme</p>
                    <Button variant="ghost" size="sm" className="px-0 h-7 text-xs text-red-600">
                      İçeriği Görüntüle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="space-y-3">
              {(c.faqs || []).map((item: any, idx: number) => (
                <Card key={idx} className="bg-white border border-orange-100 shadow-sm">
                  <CardContent className="py-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{item.q}</p>
                    <p className="text-xs text-gray-600">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
