// src/pages/CoachProfile.tsx
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
      today: "Today",
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
      today: "Aujourd’hui",
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
      today: "اليوم",
      back: "رجوع",
    };
  return {
    loading: "Koç profili yükleniyor...",
    chooseDate: "Tarih seç",
    chooseTime: "Saat seç",
    bookNow: "Hemen Seans Al",
    selectTimeFirst: "Lütfen önce bir saat seç.",
    loginRequired: "Seans almak için giriş yapmalısın.",
    today: "Bugün",
    back: "Geri dön",
  };
};

// 30 dk slotlar
const generateTimeSlots = (startHour = 10, endHour = 22, intervalMinutes = 30) => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

// YYYY-MM-DD
const toYMD = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function buildMonthMatrix(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  const first = new Date(year, month, 1);
  const startDow = first.getDay(); // 0 Sun - 6 Sat
  // TR/EU alışkanlığı için Pazartesi başlangıç istersen değiştirebilirsin.
  // Burada: Pazartesi başlangıç yapıyoruz.
  const mondayBased = (startDow + 6) % 7; // Sun->6, Mon->0...

  const gridStart = new Date(year, month, 1 - mondayBased);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return { days, month, year };
}

export default function CoachProfile() {
  // ✅ Route param adı farklı olsa bile kırılmasın: /coach/:slugOrId  OR /coach/:slug OR /coach/:id
  const params: any = useParams();
  const id = params?.slugOrId || params?.slug || params?.id;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const TT = tMini(language || "tr");

  const [coachRow, setCoachRow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Takvim state
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => toYMD(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // ✅ Koçu slug ile çek (bulamazsa id ile dene)
  useEffect(() => {
    if (!id) return;

    const fetchCoach = async () => {
      setLoading(true);
      try {
        // 1) slug ile dene
        let { data, error } = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .eq("slug", id)
          .single();

        // 2) slug yoksa id ile dene
        if (error || !data) {
          const r2 = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("id", id)
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

    fetchCoach();
  }, [id]);

  // UI map
  const c = useMemo(() => {
    const coach = coachRow;
    if (!coach) return fallbackCoach;

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

  const monthInfo = useMemo(() => buildMonthMatrix(calendarMonth), [calendarMonth]);
  const locale = useMemo(() => localeByLang(language || "tr"), [language]);

  const monthTitle = useMemo(() => {
    return new Date(monthInfo.year, monthInfo.month, 1).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  }, [monthInfo, locale]);

  const dow = useMemo(() => {
    // Pazartesi başlangıç: Mon Tue Wed Thu Fri Sat Sun
    const base = new Date(2024, 0, 1); // Monday
    const labels = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      labels.push(
        d.toLocaleDateString(locale, { weekday: "short" }).replace(".", "")
      );
    }
    return labels;
  }, [locale]);

  const handleBook = async () => {
    if (!selectedSlot) {
      toast.error(TT.selectTimeFirst);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;

    if (!userId) {
      toast.error(TT.loginRequired);
      const qs = new URLSearchParams(searchParams);
      if (!qs.get("lang")) qs.set("lang", (language || "tr") as any);
      navigate(`/login?${qs.toString()}`);
      return;
    }

    // ✅ BookSession sayfasına taşır (senin istediğin takvim orada da var / olacak)
    const qs = new URLSearchParams(searchParams);
    if (!qs.get("lang")) qs.set("lang", (language || "tr") as any);

    qs.set("coachId", String(c.id || coachRow?.id || "")); // DB id
    qs.set("date", selectedDate);
    qs.set("time", selectedSlot);

    navigate(`/book-session?${qs.toString()}`);
  };

  if (loading && !coachRow) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        {TT.loading}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      {/* HERO */}
      <section className="w-full bg-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-10">
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
                <span className="font-semibold">
                  {Number(c.rating || 0).toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({c.reviewCount || 0} değerlendirme)
                </span>
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
                disabled={!selectedSlot}
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

          {/* RIGHT: REAL CALENDAR */}
          <div className="w-full md:w-80">
            <Card className="bg-[#FFF8F5] border-orange-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-800 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-orange-500" />
                    {TT.chooseDate}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-orange-200 bg-white"
                      onClick={() => {
                        const d = new Date(calendarMonth);
                        d.setMonth(d.getMonth() - 1);
                        setCalendarMonth(d);
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-orange-200 bg-white"
                      onClick={() => {
                        const d = new Date(calendarMonth);
                        d.setMonth(d.getMonth() + 1);
                        setCalendarMonth(d);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>

                <div className="mt-2 text-sm font-semibold text-gray-900">
                  {monthTitle}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                {/* DOW */}
                <div className="grid grid-cols-7 gap-1">
                  {dow.map((d) => (
                    <div
                      key={d}
                      className="text-[11px] text-gray-500 font-semibold text-center"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Month grid */}
                <div className="grid grid-cols-7 gap-1">
                  {monthInfo.days.map((d) => {
                    const inMonth = d.getMonth() === monthInfo.month;
                    const past = d < today;
                    const ymd = toYMD(d);
                    const isSelected = selectedDate === ymd;
                    const isToday = isSameDay(d, today);

                    return (
                      <button
                        key={ymd}
                        type="button"
                        disabled={!inMonth || past}
                        onClick={() => {
                          setSelectedDate(ymd);
                          setSelectedSlot(null);
                        }}
                        className={[
                          "h-9 w-full rounded-xl text-[12px] font-semibold transition",
                          inMonth ? "text-gray-800" : "text-gray-300",
                          past ? "opacity-40 cursor-not-allowed" : "hover:bg-orange-50",
                          isSelected ? "bg-red-600 text-white hover:bg-red-600" : "bg-white",
                          isToday && !isSelected ? "ring-2 ring-orange-300" : "",
                          "border border-orange-100",
                        ].join(" ")}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* Time slots */}
                <div className="pt-2">
                  <div className="text-[12px] font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    {TT.chooseTime}
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                    {generateTimeSlots(10, 22, 30).map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={selectedSlot === slot ? "default" : "outline"}
                        size="sm"
                        className={`rounded-full h-8 text-[11px] ${
                          selectedSlot === slot
                            ? "bg-red-600 text-white"
                            : "border-orange-200 text-gray-700 hover:bg-orange-50 bg-white"
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-3 text-[11px] text-gray-600">
                    {selectedSlot ? (
                      <>
                        Seçilen:{" "}
                        <span className="font-semibold">
                          {selectedDate} · {selectedSlot}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">
                        Önce gün, sonra saat seç.
                      </span>
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
                    <p className="text-sm text-gray-600">
                      Bu koç henüz özgeçmişini eklemedi.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PROGRAMS */}
          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {(c.programs || []).length === 0 && (
                <p className="text-sm text-gray-500">
                  Bu koç henüz program paketi eklemedi.
                </p>
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
                <span className="text-gray-500">
                  ({c.reviewCount || 0} değerlendirme)
                </span>
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
                    <p className="text-xs text-gray-500">
                      8 dk · Video · 1.2K görüntülenme
                    </p>
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
