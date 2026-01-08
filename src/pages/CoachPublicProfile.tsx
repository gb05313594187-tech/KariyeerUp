// src/pages/CoachPublicProfile.tsx
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

// Kayıt bulunamazsa fallback koç
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

// Supabase text[] / string / null -> string[]
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

// UUID kontrol
const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(s || "").trim()
  );

// slug -> okunabilir uzmanlık
const extractSpecialtyFromSlug = (slug: string) => {
  const raw = String(slug || "")
    .toLowerCase()
    .replace(/[_]+/g, "-")
    .replace(/[^a-z0-9ğüşöçı\-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

  const parts = raw.split("-").filter(Boolean);

  const keywords = [
    "mulakat",
    "liderlik",
    "kariyer",
    "cv",
    "linkedin",
    "performans",
    "terfi",
    "iletisim",
    "ozguven",
    "job",
    "career",
    "leadership",
    "interview",
  ];

  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (
      p === "koc" ||
      p === "kocu" ||
      p === "koclugu" ||
      p === "coach" ||
      p === "coaching"
    )
      continue;

    if (keywords.includes(p)) return p;
  }

  return "";
};

const capitalizeTr = (s: string) => {
  const x = String(s || "").trim();
  if (!x) return "";
  return x.charAt(0).toLocaleUpperCase("tr-TR") + x.slice(1);
};

const specialtyLabelFromToken = (token: string) => {
  const t = String(token || "").toLowerCase().trim();
  if (!t) return "";
  const map: any = {
    mulakat: "Mülakat",
    liderlik: "Liderlik",
    kariyer: "Kariyer",
    cv: "CV",
    linkedin: "LinkedIn",
    performans: "Performans",
    terfi: "Terfi",
    iletisim: "İletişim",
    ozguven: "Özgüven",
    interview: "Interview",
    leadership: "Leadership",
    career: "Career",
    job: "Job",
  };
  return map[t] || capitalizeTr(t);
};

const buildMetaDescription = (
  coachName: string,
  coachTitle: string,
  tags: string[]
) => {
  const t = (tags || []).slice(0, 4).join(", ");
  const base = `${coachName} – ${coachTitle}. Online koçluk seansı planla.`;
  return t ? `${base} Uzmanlık: ${t}.` : base;
};

/* -------------------------
   ✅ Yeni Takvim Helpers
-------------------------- */
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

const monthLabelTR = (d: Date) =>
  d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

const monthNamesTR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

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

// PayTR checkout route (mevcut)
const PAYTR_ROUTE = "/paytr/checkout";

export default function CoachPublicProfile() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Query paramları kaybetme
  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const qsId = qs.get("id") || ""; // legacy

  const resolvedCoachId = useMemo(() => {
    if (qsId && isUuid(qsId)) return qsId;
    if (slugOrId && isUuid(slugOrId)) return slugOrId;
    return "";
  }, [qsId, slugOrId]);

  const [coachRow, setCoachRow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Yeni takvim state'leri
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>(() => toYMD(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>("");

  // ✅ dolu saatler (DB)
  const [busyTimes, setBusyTimes] = useState<Set<string>>(new Set());
  const [loadingBusy, setLoadingBusy] = useState(false);

  // ✅ Supabase'ten koçu çek
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        setLoading(true);

        const rawParam = String(slugOrId || "").trim();

        if (!rawParam && !resolvedCoachId) {
          setCoachRow(null);
          return;
        }

        let data: any = null;
        let error: any = null;

        if (resolvedCoachId) {
          const rId = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("id", resolvedCoachId)
            .single();
          data = rId.data;
          error = rId.error;
        } else {
          const rSlug = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("slug", rawParam)
            .single();
          data = rSlug.data;
          error = rSlug.error;

          if ((error || !data) && isUuid(rawParam)) {
            const r2 = await supabase
              .from("app_2dff6511da_coaches")
              .select("*")
              .eq("id", rawParam)
              .single();
            data = r2.data;
            error = r2.error;
          }
        }

        if (error) {
          console.error("Coach fetch error:", error);
          setCoachRow(null);
        } else {
          setCoachRow(data);

          // ✅ Legacy uuid → slug redirect
          const paramIsUuid = rawParam && isUuid(rawParam);
          if (paramIsUuid && data?.slug) {
            const nextQs = new URLSearchParams(location.search);
            const qsStr = nextQs.toString();
            const nextUrl = `/coach/${encodeURIComponent(data.slug)}${
              qsStr ? `?${qsStr}` : ""
            }`;
            navigate(nextUrl, { replace: true });
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setCoachRow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [resolvedCoachId, slugOrId, location.search, navigate]);

  // 2) Tablo alanlarını UI formatına çevir
  const c = (() => {
    const coach = coachRow;
    if (!coach) return fallbackCoach;

    return {
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
      id: coach.id,
      slug: coach.slug,
      session_fee: coach.session_fee || coach.fee || coach.price || 0,
      email: coach.email || "",
      full_name: coach.full_name || "",
    };
  })();

  // ✅ takvim görünümünü seçili tarihe senk
  useEffect(() => {
    const d = parseYMD(selectedDate);
    if (!d) return;
    setViewMonth(startOfMonth(d));
  }, [selectedDate]);

  const calendarCells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  // ✅ DB’den dolu saatleri çek
  useEffect(() => {
    const run = async () => {
      const coachIdToUse = c?.id || resolvedCoachId || "";
      if (!coachIdToUse || !selectedDate) return;

      try {
        setLoadingBusy(true);

        // Not: statü alanların değişken olabilir.
        // En güvenlisi: pending + approved + confirmed + paid varsa blokla.
        const { data, error } = await supabase
          .from("app_2dff6511da_session_requests")
          .select("selected_time, status, payment_status")
          .eq("coach_id", coachIdToUse)
          .eq("selected_date", selectedDate);

        if (error) {
          console.error("busy times fetch error:", error);
          setBusyTimes(new Set());
          return;
        }

        const blocked = new Set<string>();
        (data || []).forEach((r: any) => {
          const st = String(r?.status || "").toLowerCase();
          const ps = String(r?.payment_status || "").toLowerCase();
          const t = String(r?.selected_time || "").trim();
          if (!t) return;

          // blok kriteri (konservatif)
          const shouldBlock =
            st === "approved" ||
            st === "confirmed" ||
            st === "pending" ||
            ps === "paid" ||
            ps === "pending";

          if (shouldBlock) blocked.add(t);
        });

        setBusyTimes(blocked);

        // seçili saat dolu olduysa temizle
        if (selectedTime && blocked.has(selectedTime)) {
          setSelectedTime("");
        }
      } finally {
        setLoadingBusy(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c?.id, resolvedCoachId, selectedDate]);

  // ✅ SEO başlıklar (mevcut yapı)
  const primarySpecialty = useMemo(() => {
    const fromSlugToken = specialtyLabelFromToken(
      extractSpecialtyFromSlug(slugOrId || "")
    );
    if (fromSlugToken) return fromSlugToken;

    const firstTag = (c.tags || [])[0] || "";
    const normalized = String(firstTag || "").trim();
    if (!normalized) return "";
    if (normalized.toLowerCase().includes("mülakat")) return "Mülakat";
    if (normalized.toLowerCase().includes("liderlik")) return "Liderlik";
    if (normalized.toLowerCase().includes("kariyer")) return "Kariyer";
    if (normalized.toLowerCase().includes("cv")) return "CV";
    if (normalized.toLowerCase().includes("linkedin")) return "LinkedIn";
    return normalized.split(" ")[0];
  }, [slugOrId, c.tags]);

  const seoTitle = useMemo(() => {
    if (!primarySpecialty) return `${c.name} | ${c.title} | Kariyeer`;
    return `${c.name} | ${primarySpecialty} Koçu | Kariyeer`;
  }, [c.name, c.title, primarySpecialty]);

  const h1Text = useMemo(() => {
    if (!primarySpecialty) return c.name;
    return `${primarySpecialty} Koçluğu – ${c.name}`;
  }, [primarySpecialty, c.name]);

  const metaDesc = useMemo(
    () => buildMetaDescription(c.name, c.title, c.tags || []),
    [c.name, c.title, c.tags]
  );

  const canonicalUrl = useMemo(() => {
    const origin =
      (typeof window !== "undefined" && window.location?.origin) || "";
    const path = `/coach/${encodeURIComponent(slugOrId || "")}`;
    return origin ? `${origin}${path}` : `${path}`;
  }, [slugOrId]);

  useEffect(() => {
    try {
      document.title = seoTitle;

      const ensureMeta = (name: string, attr: "name" | "property" = "name") => {
        const selector =
          attr === "name" ? `meta[name="${name}"]` : `meta[property="${name}"]`;
        let el = document.querySelector(selector) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        return el;
      };

      const descEl = ensureMeta("description", "name");
      descEl.setAttribute("content", metaDesc);

      const ogTitle = ensureMeta("og:title", "property");
      ogTitle.setAttribute("content", seoTitle);
      const ogDesc = ensureMeta("og:description", "property");
      ogDesc.setAttribute("content", metaDesc);
      const ogType = ensureMeta("og:type", "property");
      ogType.setAttribute("content", "profile");
      const ogUrl = ensureMeta("og:url", "property");
      ogUrl.setAttribute("content", canonicalUrl);
      const ogImage = ensureMeta("og:image", "property");
      ogImage.setAttribute("content", c.photo_url || "");

      let link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
    } catch (e) {}
  }, [seoTitle, metaDesc, canonicalUrl, c.photo_url]);

  // ✅ Seans al: artık ödeme akışına gidecek (BookSession mantığı)
  const handleRequestSession = async () => {
    if (!selectedDate) return toast.error("Tarih seç.");
    if (!selectedTime) return toast.error("Saat seç.");

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;

    if (!userId) {
      toast.error("Seans almak için giriş yapmalısın.");
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    try {
      const coachIdToUse = c?.id || resolvedCoachId || "";
      if (!coachIdToUse) return toast.error("Koç bulunamadı.");

      // 1) INSERT request
      const { data: created, error: insErr } = await supabase
        .from("app_2dff6511da_session_requests")
        .insert({
          coach_id: coachIdToUse,
          user_id: userId,
          selected_date: selectedDate,
          selected_time: selectedTime,
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
      if (!requestId) return toast.error("Talep oluştu ama ID alınamadı.");

      // 2) PayTR alanları (merchant_oid vs)
      const fee = Number(c?.session_fee || 0);
      const paymentAmount = Math.max(1, Math.round(fee * 100));
      const merchantOid = String(requestId).replace(/-/g, "");

      const { error: upErr } = await supabase
        .from("app_2dff6511da_session_requests")
        .update({
          currency: "TL",
          payment_amount: paymentAmount,
          merchant_oid: merchantOid,
          payment_status: "pending",
        })
        .eq("id", requestId);

      if (upErr) {
        console.error("Payment fields update error:", upErr);
        toast.error("Ödeme alanları yazılamadı.");
        return;
      }

      // 3) PayTR checkout’a git
      toast.success("Ödemeye yönlendiriliyorsun...");
      const qsPay = new URLSearchParams();
      qsPay.set("requestId", requestId);
      navigate(`${PAYTR_ROUTE}?${qsPay.toString()}`, { replace: true });
    } catch (e) {
      console.error(e);
      toast.error("Beklenmeyen hata oluştu.");
    }
  };

  if (loading && !coachRow) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç profili yükleniyor...
      </div>
    );
  }

  // ✅ yıl seçenekleri
  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return [y, y + 1, y + 2, y + 3];
  }, []);

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
              <h1 className="text-3xl font-bold text-gray-900">{h1Text}</h1>
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

            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                onClick={handleRequestSession}
                disabled={!selectedDate || !selectedTime}
              >
                Hemen Seans Al
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

          {/* ✅ SAĞ KART: Gerçek Takvim */}
          <div className="w-full md:w-80">
            <Card className="bg-[#FFF8F5] border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  Takvimden Seç
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Ay/Yıl kontrol */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="h-9 w-9 rounded-xl border border-orange-200 flex items-center justify-center hover:bg-orange-50"
                    onClick={() => setViewMonth((m) => addMonths(m, -1))}
                    aria-label="Önceki ay"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex-1 flex items-center justify-center gap-2">
                    <select
                      className="h-9 rounded-xl border border-orange-200 bg-white px-2 text-sm"
                      value={viewMonth.getFullYear()}
                      onChange={(e) => {
                        const y = parseInt(e.target.value, 10);
                        const next = new Date(y, viewMonth.getMonth(), 1);
                        setViewMonth(next);
                      }}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>

                    <select
                      className="h-9 rounded-xl border border-orange-200 bg-white px-2 text-sm"
                      value={viewMonth.getMonth()}
                      onChange={(e) => {
                        const m = parseInt(e.target.value, 10);
                        const next = new Date(viewMonth.getFullYear(), m, 1);
                        setViewMonth(next);
                      }}
                    >
                      {monthNamesTR.map((mn, idx) => (
                        <option key={mn} value={idx}>
                          {mn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="h-9 w-9 rounded-xl border border-orange-200 flex items-center justify-center hover:bg-orange-50"
                    onClick={() => setViewMonth((m) => addMonths(m, 1))}
                    aria-label="Sonraki ay"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-semibold text-gray-700 text-center -mt-1">
                  {monthLabelTR(viewMonth)}
                </div>

                {/* Gün isimleri */}
                <div className="grid grid-cols-7 text-[11px] font-bold text-gray-500">
                  {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                    <div key={d} className="py-1 text-center">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Gün grid */}
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
                          "h-10 rounded-xl border text-sm font-semibold transition",
                          cell.inMonth ? "bg-white" : "bg-orange-50",
                          cell.inMonth ? "text-gray-900" : "text-gray-400",
                          disabled
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:border-red-300",
                          isToday ? "border-orange-300" : "border-orange-200",
                          isSelected ? "border-red-600 bg-red-50 text-red-700" : "",
                        ].join(" ")}
                        title={iso}
                      >
                        {cell.date.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* Saatler */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Saat Seç
                      </div>
                    </div>
                    {loadingBusy ? (
                      <div className="text-[11px] text-gray-500">Kontrol ediliyor...</div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isBusy = busyTimes.has(slot);
                      const active = selectedTime === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBusy}
                          onClick={() => setSelectedTime(slot)}
                          className={[
                            "px-3 py-2 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2",
                            isBusy
                              ? "opacity-40 cursor-not-allowed bg-orange-50 border-orange-200 text-gray-500"
                              : "hover:border-red-400 bg-white",
                            active ? "border-red-600 bg-red-50 text-red-700" : "",
                          ].join(" ")}
                          title={isBusy ? "Dolu" : slot}
                        >
                          <Clock className="w-4 h-4" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {/* ✅ chipli açıklamalar kaldırıldı (sen istemiyorsun) */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ALT İÇERİK – TABS (dokunmadım) */}
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

          {/* HAKKINDA */}
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

          {/* ÖZGEÇMİŞ */}
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
                        PDF formatında detaylı eğitim ve iş deneyimlerini
                        inceleyebilirsiniz.
                      </p>
                    </div>
                    <a
                      href={c.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                      Bu koç henüz özgeçmişini eklemedi. Yakında burada
                      görüntüleyebiliyor olacaksınız.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PROGRAM PAKETLERİ */}
          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {(c.programs || []).length === 0 && (
                <p className="text-sm text-gray-500">
                  Bu koç henüz program paketi eklemedi.
                </p>
              )}
            </div>
          </TabsContent>

          {/* YORUMLAR */}
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
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 text-xs"
              >
                Filtrele
              </Button>
            </div>

            <div className="space-y-3">
              {mockReviews.map((rev, idx) => (
                <Card
                  key={idx}
                  className="bg-white border border-orange-100 shadow-sm"
                >
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {rev.name}
                        </p>
                        <p className="text-xs text-gray-500">{rev.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-900">{rev.rating}.0</span>
                        <span className="text-gray-400">· {rev.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{rev.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-gray-500"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Koç Yanıtı Yaz (yakında)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* İÇERİKLER */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="bg-white border border-orange-100 shadow-sm flex flex-col"
                >
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-0 h-7 text-xs text-red-600"
                    >
                      İçeriği Görüntüle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SSS */}
          <TabsContent value="faq">
            <div className="space-y-3">
              {(c.faqs || []).map((item: any, idx: number) => (
                <Card
                  key={idx}
                  className="bg-white border border-orange-100 shadow-sm"
                >
                  <CardContent className="py-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {item.q}
                    </p>
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
