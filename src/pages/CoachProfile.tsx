// src/pages/CoachPublicProfile.tsx
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
  CreditCard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const PAYTR_ROUTE = "/paytr/checkout";

// ✅ DOĞRU function url (markdown link değil, düz string)
const FUNCTION_URL =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/reservation-email";

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
  bio: `10+ yıllık kurumsal deneyime sahip Executive ve Kariyer Koçu.`,
  methodology: `Seanslarda çözüm odaklı koçluk ve aksiyon planı yaklaşımı.`,
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

const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(s || "").trim()
  );

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
    if (["koc", "kocu", "koclugu", "coach", "coaching"].includes(p)) continue;
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

const buildMetaDescription = (coachName: string, coachTitle: string, tags: string[]) => {
  const t = (tags || []).slice(0, 4).join(", ");
  const base = `${coachName} – ${coachTitle}. Online koçluk seansı planla.`;
  return t ? `${base} Uzmanlık: ${t}.` : base;
};

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

const toYMD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function CoachPublicProfile() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const qsId = qs.get("id") || "";

  const resolvedCoachId = useMemo(() => {
    if (qsId && isUuid(qsId)) return qsId;
    if (slugOrId && isUuid(slugOrId)) return slugOrId;
    return "";
  }, [qsId, slugOrId]);

  const [coachRow, setCoachRow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ booking state
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());
  const selectedDate = useMemo(() => toYMD(selectedDay), [selectedDay]);

  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({ fullName: "", email: "", note: "" });

  // ✅ user prefill
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const u = data?.user;
        if (!u || !mounted) return;

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
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ coach fetch
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

          const paramIsUuid = rawParam && isUuid(rawParam);
          if (paramIsUuid && data?.slug) {
            const nextQs = new URLSearchParams(location.search);
            const qsStr = nextQs.toString();
            const nextUrl = `/coach/${encodeURIComponent(data.slug)}${qsStr ? `?${qsStr}` : ""}`;
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

  const c = (() => {
    const coach = coachRow;
    if (!coach) return { ...fallbackCoach, id: resolvedCoachId || "", slug: "" };

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
      programs: coach.programs || [],
      faqs: coach.faqs || [],
      cv_url: coach.cv_url || fallbackCoach.cv_url || null,
      id: coach.id,
      slug: coach.slug,
      email: coach.email || "",
      session_fee: coach.session_fee || 0,
    };
  })();

  // ✅ SEO
  const primarySpecialty = useMemo(() => {
    const fromSlugToken = specialtyLabelFromToken(extractSpecialtyFromSlug(slugOrId || ""));
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

  const metaDesc = useMemo(() => buildMetaDescription(c.name, c.title, c.tags || []), [
    c.name,
    c.title,
    c.tags,
  ]);

  const canonicalUrl = useMemo(() => {
    const origin = (typeof window !== "undefined" && window.location?.origin) || "";
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

      ensureMeta("description", "name").setAttribute("content", metaDesc);
      ensureMeta("og:title", "property").setAttribute("content", seoTitle);
      ensureMeta("og:description", "property").setAttribute("content", metaDesc);
      ensureMeta("og:type", "property").setAttribute("content", "profile");
      ensureMeta("og:url", "property").setAttribute("content", canonicalUrl);
      ensureMeta("og:image", "property").setAttribute("content", c.photo_url || "");

      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
    } catch {}
  }, [seoTitle, metaDesc, canonicalUrl, c.photo_url]);

  // ✅ busy slots fetch (koç dolu saatler)
  useEffect(() => {
    const run = async () => {
      try {
        const coachIdToUse = c?.id || resolvedCoachId || "";
        if (!coachIdToUse || !selectedDate) return;

        const { data, error } = await supabase
          .from("app_2dff6511da_session_requests")
          .select("selected_time,status")
          .eq("coach_id", coachIdToUse)
          .eq("selected_date", selectedDate)
          .in("status", ["pending", "approved", "confirmed", "paid"]); // 🔥 dolu sayılacak statüler

        if (error) {
          console.error("busy slots error:", error);
          setBusySlots([]);
          return;
        }

        const busy = (data || [])
          .map((r: any) => String(r.selected_time || "").trim())
          .filter(Boolean);

        setBusySlots(busy);

        // seçili slot dolu olduysa düşür
        setSelectedSlot((prev) => (prev && busy.includes(prev) ? null : prev));
      } catch (e) {
        setBusySlots([]);
      }
    };

    run();
  }, [c?.id, resolvedCoachId, selectedDate]);

  const openBooking = async () => {
    if (!selectedSlot) {
      toast.error("Lütfen önce gün ve saat seç.");
      return;
    }
    setBookingOpen(true);
  };

  const goToPayment = (requestId: string) => {
    const qs2 = new URLSearchParams();
    qs2.set("requestId", requestId);
    navigate(`${PAYTR_ROUTE}?${qs2.toString()}`, { replace: true });
  };

  const handleCreateAndPay = async () => {
    try {
      if (!selectedSlot) return toast.error("Saat seç.");
      if (!String(form.fullName || "").trim() || !String(form.email || "").trim())
        return toast.error("Ad soyad ve e-posta zorunlu.");

      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        toast.error("Devam etmek için giriş yapmalısın.");
        const back = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?redirect=${back}`);
        return;
      }

      setIsSubmitting(true);

      const coachIdToUse = c?.id || resolvedCoachId || "";
      if (!coachIdToUse) return toast.error("Koç bulunamadı.");

      // 1) insert request
      const { data: created, error: insErr } = await supabase
        .from("app_2dff6511da_session_requests")
        .insert({
          coach_id: coachIdToUse,
          user_id: userId,
          full_name: String(form.fullName || "").trim(),
          email: String(form.email || "").trim(),
          selected_date: selectedDate,
          selected_time: selectedSlot,
          note: String(form.note || "").trim() || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (insErr) {
        console.error("insert error:", insErr);
        toast.error("Seans talebi oluşturulamadı.");
        return;
      }

      const requestId = created?.id;
      if (!requestId) return toast.error("Talep oluştu ama ID alınamadı.");

      // 2) PayTR alanları
      const fee = Number(c?.session_fee || 0);
      const paymentAmount = Math.max(1, Math.round(fee * 100));
      const merchantOid = String(requestId).replace(/-/g, "");

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
        console.error("payment fields update error:", upErr);
        toast.error("Ödeme alanları yazılamadı.");
        return;
      }

      // 3) mail (opsiyonel)
      try {
        await fetch(FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            coach_email: c?.email || "",
            user_email: String(form.email || "").trim(),
            coach_name: c?.name || "",
            user_name: String(form.fullName || "").trim(),
            session_date: selectedDate,
            time_slot: selectedSlot,
            note: form.note,
          }),
        });
      } catch {}

      toast.success("Ödemeye yönlendiriliyorsun...");
      goToPayment(requestId);
    } catch (e) {
      console.error("create&pay error:", e);
      toast.error("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !coachRow) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç profili yükleniyor...
      </div>
    );
  }

  const timeSlots = useMemo(() => generateTimeSlots(10, 22, 30), []);

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      <section className="w-full bg-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-10">
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

            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                onClick={openBooking}
                disabled={!selectedSlot}
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

          {/* ✅ SAĞ KART: yeni takvim */}
          <div className="w-full md:w-[360px]">
            <Card className="bg-[#FFF8F5] border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  Takvimden Seç
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-white border border-orange-100 p-2">
                  <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={(d: any) => {
                      if (!d) return;
                      setSelectedDay(d);
                      setSelectedSlot(null);
                      setBookingOpen(false);
                    }}
                    disabled={(date: Date) => {
                      const today = new Date();
                      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const x = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                      return x.getTime() < t.getTime();
                    }}
                    // ✅ yıl/ay dropdown
                    captionLayout="dropdown"
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 2}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Saat Seç
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isBusy = busySlots.includes(slot);
                      const active = selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBusy}
                          onClick={() => setSelectedSlot(slot)}
                          className={[
                            "h-10 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2",
                            isBusy
                              ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400"
                              : "hover:border-red-400 bg-white border-orange-200 text-gray-800",
                            active ? "border-red-600 bg-red-50 text-red-700" : "",
                          ].join(" ")}
                        >
                          <Clock className="w-4 h-4" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {/* ✅ o “Seçilen saat …” yazısı KALDIRILDI */}
                </div>

                {bookingOpen && (
                  <div className="bg-white border border-orange-100 rounded-2xl p-4 space-y-3">
                    <div className="text-sm font-extrabold text-gray-900">Bilgilerini gir</div>

                    <div className="grid gap-3">
                      <input
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Ad Soyad"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      />
                      <input
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="E-posta"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                      <textarea
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full h-24 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Hedefiniz / Beklentiniz (opsiyonel)"
                        value={form.note}
                        onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                      />
                    </div>

                    <Button
                      type="button"
                      disabled={isSubmitting || !selectedSlot}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md"
                      onClick={handleCreateAndPay}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      {isSubmitting ? "Yönlendiriliyor..." : "Ödemeye Geç"}
                    </Button>
                  </div>
                )}

                {!bookingOpen && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border-orange-200"
                    disabled={!selectedSlot}
                    onClick={() => setBookingOpen(true)}
                  >
                    Devam Et
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {(c.programs || []).length === 0 && (
                <p className="text-sm text-gray-500">Bu koç henüz program paketi eklemedi.</p>
              )}
            </div>
          </TabsContent>

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
                    <p className="text-xs text-gray-500">8 dk · Video · 1.2K görüntülenme</p>
                    <Button variant="ghost" size="sm" className="px-0 h-7 text-xs text-red-600">
                      İçeriği Görüntüle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

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
