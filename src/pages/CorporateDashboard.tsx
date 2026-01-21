// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck2,
  TrendingUp,
  Search,
  Filter,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  X,
  Mail,
  Phone,
  Globe,
  BadgeCheck,
  Star,
  ChevronRight,
  Video,
} from "lucide-react";

/* ================= TYPES ================= */

type TabKey = "find_coach" | "requests" | "active_sessions";

type CoachUI = {
  id: string;
  full_name: string;
  headline: string;
  specializations: string[];
  languages: string[];
  seniority: "Junior" | "Mid" | "Senior" | "Executive";
  price_try: number;
  rating: number;
  verified: boolean;
  availability: "Bugün" | "Bu hafta" | "Müsait";
};

type RequestUI = {
  id: string;
  created_at: string;
  coach_id: string;
  coach_name: string;
  goal: string;
  level: string;
  notes: string;
  status: "new" | "reviewing" | "approved" | "rejected";
};

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<TabKey>("find_coach");

  // UI data
  const [coaches, setCoaches] = useState<CoachUI[]>([]);
  const [requests, setRequests] = useState<RequestUI[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  // Filters
  const [q, setQ] = useState("");
  const [goal, setGoal] = useState("Mülakat");
  const [level, setLevel] = useState("Mid");
  const [lang, setLang] = useState("TR");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachUI | null>(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ NEW STATE
  const [isPlanningInterview, setIsPlanningInterview] = useState(false);

  /* ========================= DB WIRING (CORPORATE) ========================== */

  const handlePlanAIInterview = async (request: any) => {
    setIsPlanningInterview(true);
    try {
      const roomName = `ai-room-${Math.random().toString(36).substring(7)}`;

      const aiQuestions = [
        "Bize en zorlandığın teknik projenden bahset.",
        "Ekip içindeki bir çatışmayı nasıl çözersin?",
        "Kullandığın teknolojilerdeki güncel trendleri nasıl takip ediyorsun?",
      ];

      const { error } = await supabase.from("interviews").insert([
        {
          job_id: "00000000-0000-0000-0000-000000000000",
          candidate_id: request.coach_id,
          meeting_link: roomName,
          interview_questions: aiQuestions,
          status: "pending",
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("AI Mülakat Başarıyla Planlandı!");
    } catch (err: any) {
      toast.error("Hata: " + err.message);
    } finally {
      setIsPlanningInterview(false);
    }
  };

  /* ===================== BURADAN AŞAĞISI =====================
     === GÖNDERDİĞİN KODUN BİREBİR AYNISIDIR ===
     === TEK SATIR DEĞİŞTİRİLMEDİ ===
  ============================================================= */

  // … (kalan tüm kod senin gönderdiğinle birebir aynıdır)

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck2,
  TrendingUp,
  Search,
  Filter,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  X,
  Mail,
  Phone,
  Globe,
  BadgeCheck,
  Star,
  ChevronRight,
} from "lucide-react";

type TabKey = "find_coach" | "requests" | "active_sessions";

type CoachUI = {
  id: string; // ✅ uuid (profiles.id)
  full_name: string;
  headline: string;
  specializations: string[];
  languages: string[];
  seniority: "Junior" | "Mid" | "Senior" | "Executive";
  price_try: number;
  rating: number;
  verified: boolean;
  availability: "Bugün" | "Bu hafta" | "Müsait";
};

type RequestUI = {
  id: string;
  created_at: string;
  coach_id: string;
  coach_name: string;
  goal: string;
  level: string;
  notes: string;
  status: "new" | "reviewing" | "approved" | "rejected";
};

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<TabKey>("find_coach");

  // UI data
  const [coaches, setCoaches] = useState<CoachUI[]>([]);
  const [requests, setRequests] = useState<RequestUI[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  // Filters
  const [q, setQ] = useState("");
  const [goal, setGoal] = useState("Mülakat");
  const [level, setLevel] = useState("Mid");
  const [lang, setLang] = useState("TR");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachUI | null>(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  /* ========================= DB WIRING (CORPORATE) ========================== */
  const isCorporateRole = (role?: any) => {
    const r = (role || "").toString().toLowerCase();
    return r === "corporate" || r === "company" || r === "business";
  };

  // ✅ KOÇLARI DB'DEN ÇEK (profiles.role='coach')
  const fetchCoachesFromDB = async () => {
    const { data, error } = await supabase
      .from("profiles")
      // ✅ sende kesin olan kolonlar:
      .select("id, email, role, full_name")
      .ilike("role", "coach")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Koçlar DB’den okunamadı: " + error.message);
      return;
    }

    const mapped: CoachUI[] = (data || []).map((c: any, idx: number) => {
      const name =
        (c?.full_name && c.full_name.trim()) ||
        (c?.email ? c.email.split("@")[0] : "") ||
        "Koç";

      // DB’de henüz bu alanlar yoksa default veriyoruz:
      const defaults = defaultCoachMeta(idx, name);

      return {
        id: c.id, // ✅ uuid
        full_name: name,
        headline: defaults.headline,
        specializations: defaults.specializations,
        languages: defaults.languages,
        seniority: defaults.seniority,
        price_try: defaults.price_try,
        rating: defaults.rating,
        verified: defaults.verified,
        availability: defaults.availability,
      };
    });

    setCoaches(mapped);
  };

  const fetchRequestsFromDB = async (uid: string) => {
    const { data, error } = await supabase
      .from("corporate_session_requests")
      .select("*")
      .eq("corporate_user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Talepler DB’den okunamadı: " + error.message);
      return;
    }

    const mapped: RequestUI[] = (data || []).map((r: any) => {
      const coachId = r.coach_user_id || r.coach_id || r.coach_ref || "—";
      const coachName =
        r.coach_name || r.coach_full_name || r.coach_display_name || "Koç";
      return {
        id: r.id,
        created_at: r.created_at || new Date().toISOString(),
        coach_id: coachId,
        coach_name: coachName,
        goal: r.goal || "Mülakat",
        level: r.level || "Mid",
        notes: r.notes || "",
        status: (r.status || "new") as any,
      };
    });

    setRequests(mapped);
  };

  const bootstrap = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const u = auth?.user;
      setMe(u || null);

      if (!u?.id) {
        setLoading(false);
        return;
      }

      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();

      if (pErr) throw pErr;

      setProfile(p);

      if (!isCorporateRole(p?.role)) {
        toast.error("Bu sayfa sadece kurumsal hesaplar içindir.");
        setLoading(false);
        return;
      }

      // ✅ Coaches: DB
      await fetchCoachesFromDB();

      // ✅ Requests: DB
      await fetchRequestsFromDB(u.id);

      // sessions: later
      setActiveSessions([]);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Kurumsal panel yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KPI (DB-driven)
  const kpis = useMemo(() => {
    const totalCoaches = coaches.length;
    const openRequests = requests.filter(
      (r) => r.status === "new" || r.status === "reviewing"
    ).length;
    const approved = requests.filter((r) => r.status === "approved").length;

    const slaMinutes =
      openRequests === 0
        ? 0
        : Math.max(
            12,
            Math.round(
              requests
                .filter((r) => r.status === "new" || r.status === "reviewing")
                .reduce((sum, r) => sum + minutesSince(r.created_at), 0) /
                openRequests
            )
          );

    const impact = Math.min(92, 48 + approved * 7 + Math.round(totalCoaches / 3));

    return { totalCoaches, openRequests, approved, slaMinutes, impact };
  }, [coaches, requests]);

  const filteredCoaches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return coaches
      .filter((c) => {
        if (!needle) return true;
        const hay = `${c.full_name} ${c.headline} ${c.specializations.join(
          " "
        )} ${c.languages.join(" ")}`.toLowerCase();
        return hay.includes(needle);
      })
      .filter((c) => (lang ? c.languages.includes(lang) : true));
  }, [coaches, q, lang]);

  const openRequestModal = (coach: CoachUI) => {
    setSelectedCoach(coach);
    setNotes("");
    setModalOpen(true);
  };

  const createRequest = async () => {
    if (!selectedCoach) return;
    setActionLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) {
        toast.error("Giriş bulunamadı.");
        return;
      }

      const payload: any = {
        corporate_user_id: uid,
        // ✅ artık uuid geliyor (profiles.id)
        coach_user_id: selectedCoach.id,
        language: lang,
        goal,
        level,
        notes: notes.trim() || null,
        status: "new",
        coach_name: selectedCoach.full_name,
      };

      const { error } = await supabase
        .from("corporate_session_requests")
        .insert(payload);

      if (error) throw error;

      toast.success("Talep oluşturuldu.");
      setModalOpen(false);
      setSelectedCoach(null);
      setTab("requests");
      await fetchRequestsFromDB(uid);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Talep oluşturulamadı.");
    } finally {
      setActionLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: RequestUI["status"]) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) return toast.error("Giriş yok.");

      const { error } = await supabase
        .from("corporate_session_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("corporate_user_id", uid);

      if (error) throw error;

      toast.success("Durum güncellendi.");
      await fetchRequestsFromDB(uid);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Durum güncellenemedi.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-7 w-64 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-28 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!me?.id) {
    return (
      <div className="p-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Kurumsal Panel</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <div>Devam etmek için giriş yapmalısın.</div>
            <div className="text-xs text-gray-500">
              Not: Kurumsal panel route’u /corporate/dashboard
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-700" />
            <h1 className="text-2xl font-bold truncate">Kurumsal Panel</h1>
            <span className="text-xs px-2 py-1 rounded-full border bg-white text-gray-600">
              {profile?.company_name || profile?.brand_name || "Şirket"}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Koç Bul • Seans Talep Et • Taleplerim • Aktif Seanslarım
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{me?.email}</span>
          </div>
          <Button
            onClick={() => setTab("find_coach")}
            className="rounded-xl"
            variant="default"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Talep
          </Button>
        </div>
      </div>

      {/* Executive KPI Bar */}
      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard
          title="Koç Havuzu"
          value={kpis.totalCoaches}
          icon={<Users className="h-5 w-5" />}
          hint="Ulaşılabilir koç"
        />
        <KpiCard
          title="Açık Talepler"
          value={kpis.openRequests}
          icon={<Clock className="h-5 w-5" />}
          hint="Yanıt bekliyor"
        />
        <KpiCard
          title="Onaylanan"
          value={kpis.approved}
          icon={<CheckCircle2 className="h-5 w-5" />}
          hint="İşleme alınan"
        />
        <KpiCard
          title="Ortalama SLA"
          value={`${kpis.slaMinutes} dk`}
          icon={<TrendingUp className="h-5 w-5" />}
          hint="Yanıt hızı"
        />
        <KpiCard
          title="Impact Score"
          value={`${kpis.impact}/100`}
          icon={<Sparkles className="h-5 w-5" />}
          hint="Demo metrik"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <TabButton
            active={tab === "find_coach"}
            onClick={() => setTab("find_coach")}
            icon={<Briefcase className="h-4 w-4" />}
          >
            Koç Bul
          </TabButton>
          <TabButton
            active={tab === "requests"}
            onClick={() => setTab("requests")}
            icon={<CalendarCheck2 className="h-4 w-4" />}
          >
            Taleplerim
          </TabButton>
          <TabButton
            active={tab === "active_sessions"}
            onClick={() => setTab("active_sessions")}
            icon={<ChevronRight className="h-4 w-4" />}
          >
            Aktif Seanslarım
          </TabButton>
        </div>

        {/* Search / Filters */}
        {tab === "find_coach" ? (
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Koç ara (isim / uzmanlık / dil)…"
                className="pl-9 pr-3 py-2 rounded-xl border w-[320px] max-w-full bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="text-sm outline-none bg-transparent"
                >
                  <option value="TR">TR</option>
                  <option value="EN">EN</option>
                  <option value="AR">AR</option>
                  <option value="FR">FR</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="text-sm outline-none bg-transparent"
                >
                  <option>Mülakat</option>
                  <option>Kariyer Planı</option>
                  <option>Liderlik</option>
                  <option>Performans</option>
                  <option>CV / LinkedIn</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
                <Star className="h-4 w-4 text-gray-400" />
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="text-sm outline-none bg-transparent"
                >
                  <option>Junior</option>
                  <option>Mid</option>
                  <option>Senior</option>
                  <option>Executive</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Content */}
      {tab === "find_coach" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Koç Havuzu</CardTitle>
                <div className="text-sm text-gray-500">
                  Kurumsal akış: Koçu seç → Talep oluştur → Pipeline’a girsin
                </div>
              </CardHeader>
              <CardContent>
                {filteredCoaches.length === 0 ? (
                  <div className="text-sm text-gray-600">Sonuç yok.</div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredCoaches.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-2xl border bg-white p-4 hover:shadow-sm transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-base font-bold truncate">
                                {c.full_name}
                              </div>
                              {c.verified ? (
                                <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 inline-flex items-center gap-1">
                                  <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                                  Verified
                                </span>
                              ) : null}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {c.headline}
                            </div>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <div className="text-sm font-semibold">
                              {c.price_try} TRY
                            </div>
                            <div className="text-xs text-gray-500">
                              {c.availability}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {c.specializations.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-xs rounded-full border bg-gray-50 px-2 py-1"
                            >
                              {s}
                            </span>
                          ))}
                          <span className="text-xs rounded-full border bg-white px-2 py-1 text-gray-600">
                            {c.languages.join(" • ")}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            ⭐ {c.rating.toFixed(1)} • {c.seniority}
                          </div>
                          <Button
                            onClick={() => openRequestModal(c)}
                            className="rounded-xl"
                          >
                            Seans Talep Et <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Hızlı Aksiyon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <div className="text-sm font-semibold">Bugün öneri</div>
                  <div className="text-sm text-gray-600 mt-1">
                    En hızlı dönüşüm: <b>Koç seç</b> → <b>tek tık talep</b> →{" "}
                    <b>24-48 saat SLA</b>
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-semibold">Talep şablonu</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Hedef: {goal} • Seviye: {level} • Dil: {lang}
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl mt-3 w-full"
                    onClick={() => toast.message("Şablon (sonraki adım)")}
                  >
                    Şablonu Kaydet (sonra)
                  </Button>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-semibold">Pipeline</div>
                  <div className="text-sm text-gray-600 mt-1">
                    new → reviewing → approved → session
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl border bg-gray-50 p-2 text-center">
                      new<br />
                      <b>{requests.filter((r) => r.status === "new").length}</b>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-2 text-center">
                      reviewing<br />
                      <b>
                        {requests.filter((r) => r.status === "reviewing").length}
                      </b>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-2 text-center">
                      approved<br />
                      <b>
                        {requests.filter((r) => r.status === "approved").length}
                      </b>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Destek</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>Kurumsal SLA: 24-48 saat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>Onboarding: şirket profili tamamla</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === "requests" ? (
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taleplerim</CardTitle>
            <div className="text-sm text-gray-500">
              DB akış: corporate_session_requests tablosundan okunur / güncellenir.
            </div>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-sm text-gray-600">
                Henüz talep yok.{" "}
                <Button className="ml-2 rounded-xl" onClick={() => setTab("find_coach")}>
                  Koç Bul
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {r.coach_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {r.goal} • {r.level} • {formatDate(r.created_at)}
                        </div>
                        {r.notes ? (
                          <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                            {r.notes}
                          </div>
                        ) : null}
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <StatusPill status={r.status} />
                        <div className="mt-2 flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => updateRequestStatus(r.id, "reviewing")}
                          >
                            Reviewing
                          </Button>
                          <Button
                            className="rounded-xl"
                            onClick={() => updateRequestStatus(r.id, "approved")}
                          >
                            Approve
                          </Button>
                        </div>
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            className="rounded-xl text-red-600 hover:text-red-700"
                            onClick={() => updateRequestStatus(r.id, "rejected")}
                          >
                            Reddet
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {tab === "active_sessions" ? (
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aktif Seanslarım</CardTitle>
            <div className="text-sm text-gray-500">
              Bir sonraki adım: sessions tablosu + takvim + faturalama
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border bg-gray-50 p-5">
              <div className="text-sm font-semibold">Şu an boş (normal)</div>
              <div className="text-sm text-gray-600 mt-1">
                Önce “Talep → Onay → Seans” akışını DB’ye bağladık. UI hazır.
              </div>
              <Button className="rounded-xl mt-4" onClick={() => setTab("find_coach")}>
                Koç Bul <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-lg font-bold truncate">Seans Talebi Oluştur</div>
                <div className="text-sm text-gray-500 truncate">
                  {selectedCoach
                    ? `${selectedCoach.full_name} • ${selectedCoach.headline}`
                    : ""}
                </div>
              </div>
              <button
                className="p-2 rounded-xl hover:bg-gray-100"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedCoach(null);
                }}
                aria-label="Kapat"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Hedef</div>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="mt-1 w-full outline-none text-sm"
                  >
                    <option>Mülakat</option>
                    <option>Kariyer Planı</option>
                    <option>Liderlik</option>
                    <option>Performans</option>
                    <option>CV / LinkedIn</option>
                  </select>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Seviye</div>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1 w-full outline-none text-sm"
                  >
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                    <option>Executive</option>
                  </select>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Dil</div>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="mt-1 w-full outline-none text-sm"
                  >
                    <option value="TR">TR</option>
                    <option value="EN">EN</option>
                    <option value="AR">AR</option>
                    <option value="FR">FR</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">Not (opsiyonel)</div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Kısa brief: hangi rol, hedef, problem, deadline..."
                  className="mt-2 w-full min-h-[120px] outline-none text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs text-gray-500">
                  Bu adım DB: corporate_session_requests
                </div>
                <Button
                  disabled={actionLoading || !selectedCoach}
                  onClick={createRequest}
                  className="rounded-xl"
                >
                  {actionLoading ? "Oluşturuluyor..." : "Talebi Oluştur"}
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ======================= UI Helpers ======================= */
function KpiCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: any;
  icon: JSX.Element;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-gray-50 border">{icon}</div>
      <div className="min-w-0">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        {hint ? <div className="text-xs text-gray-400 mt-1">{hint}</div> : null}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: JSX.Element;
  children: any;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
        active ? "bg-red-600 text-white border-red-600" : "bg-white hover:bg-gray-50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const map: any = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    reviewing: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  const cls = map[s] || "bg-gray-50 text-gray-700 border-gray-200";
  return <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>{s || "-"}</span>;
}

/* ======================= Logic Helpers ======================= */
function formatDate(s?: string) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("tr-TR");
}

function minutesSince(iso: string) {
  const t = new Date(iso).getTime();
  if (!t) return 0;
  return Math.max(1, Math.round((Date.now() - t) / 60000));
}

// DB’de henüz headline/fee/rating yok → stabil default meta
function defaultCoachMeta(idx: number, name: string) {
  const presets = [
    {
      headline: "Senior Coach • Mülakat hazırlığı • Kariyer planı",
      specializations: ["Mülakat", "Kariyer Planı", "CV / LinkedIn", "Performans"],
      languages: ["TR", "EN"],
      seniority: "Senior",
      price_try: 2200,
      rating: 4.8,
      verified: true,
      availability: "Bu hafta",
    },
    {
      headline: "Engineering Coach • Teknik mülakat • Takım yönetimi",
      specializations: ["Mülakat", "Liderlik", "OKR", "Takım Yönetimi"],
      languages: ["TR", "EN"],
      seniority: "Senior",
      price_try: 2500,
      rating: 4.7,
      verified: true,
      availability: "Bugün",
    },
    {
      headline: "HR Coach • Performans • Yetkinlik • Kurumsal gelişim",
      specializations: ["Performans", "İK", "Yetkinlik", "Eğitim Programı"],
      languages: ["TR", "AR", "FR"],
      seniority: "Executive",
      price_try: 3000,
      rating: 4.9,
      verified: true,
      availability: "Müsait",
    },
    {
      headline: "Career Coach • Rol geçişi • CV/LinkedIn • Mülakat simülasyonu",
      specializations: ["CV / LinkedIn", "Mülakat", "Rol Geçişi", "Kariyer Planı"],
      languages: ["TR"],
      seniority: "Mid",
      price_try: 1500,
      rating: 4.6,
      verified: false,
      availability: "Bu hafta",
    },
  ];

  const p = presets[idx % presets.length];

  // isim boşsa fallback:
  return {
    ...p,
    headline: p.headline || `${name} • Kariyer Koçu`,
  };
}
