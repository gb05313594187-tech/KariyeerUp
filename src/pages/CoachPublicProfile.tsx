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

// slug -> okunabilir uzmanlık (mülakat-koclugu -> Mülakat, liderlik-kocu -> Liderlik)
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

// Önümüzdeki X günü üret (Bugün, Yarın, vs) → default 14 gün
const getNextDays = (count = 14) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const value = d.toISOString().slice(0, 10); // YYYY-MM-DD
    let label = d.toLocaleDateString("tr-TR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    if (i === 0) label = "Bugün";
    if (i === 1) label = "Yarın";

    days.push({ date: d, value, label });
  }

  return days;
};

// Belirli saat aralığında 30 dk'lık slotlar üret
const generateTimeSlots = (startHour = 10, endHour = 22, intervalMinutes = 30) => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

export default function CoachPublicProfile() {
  // ✅ App.tsx route: /coach/:slugOrId
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Query paramları tek kaynaktan oku (kaybetme)
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const qsId = qs.get("id") || ""; // legacy

  // ✅ Koç ID çözümlemesi:
  // 1) query id varsa onu kullan
  // 2) yoksa route param uuid ise onu id kabul et
  // 3) değilse SEO slug
  const resolvedCoachId = useMemo(() => {
    if (qsId && isUuid(qsId)) return qsId;
    if (slugOrId && isUuid(slugOrId)) return slugOrId;
    return "";
  }, [qsId, slugOrId]);

  const [coachRow, setCoachRow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Takvim state'leri
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // ✅ Supabase'ten koçu çek:
  // - önce slug dene (SEO)
  // - olmazsa id dene (legacy uuid)
  // - query id varsa zaten id ile gider
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        setLoading(true);

        const rawParam = String(slugOrId || "").trim();

        // param yoksa fallback
        if (!rawParam && !resolvedCoachId) {
          setCoachRow(null);
          return;
        }

        let data: any = null;
        let error: any = null;

        // 1) query id veya uuid param → id ile dene
        if (resolvedCoachId) {
          const rId = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("id", resolvedCoachId)
            .single();
          data = rId.data;
          error = rId.error;
        } else {
          // 2) SEO slug → slug ile dene
          const rSlug = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("slug", rawParam)
            .single();
          data = rSlug.data;
          error = rSlug.error;

          // 3) slug bulunamazsa (edge-case) param uuid olabilir → id ile fallback
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

        console.log("CoachPublicProfile Supabase:", {
          resolvedCoachId,
          slugOrId: rawParam,
          data,
          error,
        });

        if (error) {
          console.error("Coach fetch error:", error);
          setCoachRow(null);
        } else {
          setCoachRow(data);

          // ✅ Legacy: /coach/<uuid> ile geldiyse ve DB slug varsa, SEO slug’a redirect
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
    };
  })();

  // ✅ SEO: uzmanlık + başlıklar
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

  // ✅ HEAD güncelle (title/meta/canonical)
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

      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
    } catch (e) {}
  }, [seoTitle, metaDesc, canonicalUrl, c.photo_url]);

  // ✅ seans talebi oluştur (query paramları kaybetme)
  const handleRequestSession = async () => {
    if (!selectedSlot) {
      toast.error("Lütfen önce bir saat seç.");
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;

    if (!userId) {
      toast.error("Seans almak için giriş yapmalısın.");
      const nextQs = new URLSearchParams(location.search);
      navigate(`/login${nextQs.toString() ? `?${nextQs.toString()}` : ""}`);
      return;
    }

    try {
      const coachIdToUse = c?.id || resolvedCoachId || "";

      if (!coachIdToUse) {
        toast.error("Koç bulunamadı. Lütfen geri gidip yeniden deneyin.");
        return;
      }

      const { error } = await supabase
        .from("app_2dff6511da_session_requests")
        .insert({
          coach_id: coachIdToUse,
          user_id: userId,
          selected_date: selectedDate,
          selected_time: selectedSlot,
          status: "pending",
        });

      if (error) {
        console.error("Seans talebi hatası:", error);
        toast.error("Seans talebi oluşturulamadı.");
        return;
      }

      toast.success(
        "Seans talebin iletildi. Koç onayladığında dashboard’ta göreceksin."
      );

      const nextQs = new URLSearchParams(location.search);
      navigate(`/user/dashboard${nextQs.toString() ? `?${nextQs.toString()}` : ""}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Beklenmeyen bir hata oluştu.");
    }
  };

  if (loading && !coachRow) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç profili yükleniyor...
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
             
