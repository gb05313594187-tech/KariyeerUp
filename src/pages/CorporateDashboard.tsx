// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck2,
  TrendingUp,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  X,
  Mail,
  BadgeCheck,
  ChevronRight,
  FilePlus2,
} from "lucide-react";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<TabKey>("find_coach");

  const [coaches, setCoaches] = useState<CoachUI[]>([]);
  const [requests, setRequests] = useState<RequestUI[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  const [q, setQ] = useState("");
  const [goal, setGoal] = useState("Mülakat");
  const [level, setLevel] = useState("Mid");
  const [lang, setLang] = useState("TR");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachUI | null>(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isPlanningInterview, setIsPlanningInterview] = useState(false);

  const bootstrap = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const u = auth?.user;
      setMe(u || null);
      if (!u?.id) return;

      const { data: p, error: pErr } = await supabase.from("profiles").select("*").eq("id", u.id).single();
      if (pErr) throw pErr;
      setProfile(p);

      await fetchCoachesFromDB();
      await fetchRequestsFromDB(u.id);
    } catch (e: any) {
      toast.error("Panel yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachesFromDB = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, full_name")
      .ilike("role", "coach")
      .order("created_at", { ascending: false });

    if (!error) {
      const mapped: CoachUI[] = (data || []).map((c: any, idx: number) => {
        const name = (c?.full_name && c.full_name.trim()) || (c?.email ? c.email.split("@")[0] : "") || "Koç";
        const defaults = defaultCoachMeta(idx, name);
        return {
          id: c.id,
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
    }
  };

  const fetchRequestsFromDB = async (uid: string) => {
    const { data, error } = await supabase
      .from("corporate_session_requests")
      .select("*")
      .eq("corporate_user_id", uid)
      .order("created_at", { ascending: false });

    if (!error) {
      const mapped: RequestUI[] = (data || []).map((r: any) => ({
        id: r.id,
        created_at: r.created_at || new Date().toISOString(),
        coach_id: r.coach_user_id || "—",
        coach_name: r.coach_name || "Koç",
        goal: r.goal || "Mülakat",
        level: r.level || "Mid",
        notes: r.notes || "",
        status: (r.status || "new") as any,
      }));
      setRequests(mapped);
    }
  };

  useEffect(() => { bootstrap(); }, []);

  const kpis = useMemo(() => {
    const totalCoaches = coaches.length;
    const openRequests = requests.filter(r => r.status === "new" || r.status === "reviewing").length;
    const approved = requests.filter(r => r.status === "approved").length;
    const impact = Math.min(92, 49 + approved * 7);
    return { totalCoaches, openRequests, approved, impact };
  }, [coaches, requests]);

  const filteredCoaches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return coaches.filter(c => {
      const hay = `${c.full_name} ${c.headline}`.toLowerCase();
      return needle ? hay.includes(needle) : true;
    }).filter(c => (lang ? c.languages.includes(lang) : true));
  }, [coaches, q, lang]);

  const openRequestModal = (coach: CoachUI) => {
    setSelectedCoach(coach);
    setModalOpen(true);
  };

  const createRequest = async () => {
    if (!selectedCoach) return;
    setActionLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      const { error } = await supabase.from("corporate_session_requests").insert({
        corporate_user_id: uid,
        coach_user_id: selectedCoach.id,
        goal,
        level,
        notes,
        status: "new",
        coach_name: selectedCoach.full_name,
      });
      if (!error) {
        toast.success("Talep gönderildi.");
        setModalOpen(false);
        fetchRequestsFromDB(uid);
        setTab("requests");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: RequestUI["status"]) => {
    const { error } = await supabase.from("corporate_session_requests").update({ status }).eq("id", id);
    if (!error) {
      toast.success("Güncellendi");
      fetchRequestsFromDB(me.id);
    }
  };

  const handlePlanAIInterview = async (request: RequestUI) => {
    setIsPlanningInterview(true);
    try {
      const roomName = `ai-room-${Math.random().toString(36).substring(7)}`;
      const aiQuestions = ["En zorlandığın projeni anlat.", "Takım çatışmasını nasıl çözersin?", "Teknoloji trendlerini nasıl takip edersin?"];
      const { error } = await supabase.from("interviews").insert([{
        job_id: "00000000-0000-0000-0000-000000000000",
        candidate_id: request.coach_id,
        meeting_link: roomName,
        interview_questions: aiQuestions,
        status: "pending",
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      }]);
      if (!error) toast.success("AI Mülakat planlandı.");
    } finally {
      setIsPlanningInterview(false);
    }
  };

  if (loading) return <div className="p-6 animate-pulse space-y-4"><div className="h-10 bg-gray-200 w-1/4 rounded"/> <div className="h-40 bg-gray-100 rounded-2xl"/></div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header - Sadece İlan Ver Butonu Kaldı */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold">Kurumsal Panel</h1>
            <span className="text-xs px-2 py-1 rounded-full border bg-white">
              {profile?.display_name || "Şirket"}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">İlan Yönetimi & Koçluk Merkezi</div>
        </div>

        <div className="flex items-center gap-2">
          {/* İLAN VER BUTONU - Kesin Yönlendirme */}
          <Button 
            onClick={() => navigate('/jobs/new')}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 px-6"
          >
            <FilePlus2 className="h-4 w-4 mr-2" />
            İlan Ver
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Koç Havuzu" value={kpis.totalCoaches} icon={<Users className="h-5 w-5" />} hint="Aktif koçlar" />
        <KpiCard title="Açık Talepler" value={kpis.openRequests} icon={<Clock className="h-5 w-5" />} hint="Bekleyen" />
        <KpiCard title="Onaylanan" value={kpis.approved} icon={<CheckCircle2 className="h-5 w-5" />} hint="Süreci başlayan" />
        <KpiCard title="Impact Score" value={`${kpis.impact}/100`} icon={<Sparkles className="h-5 w-5" />} hint="Verimlilik" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-1">
        <TabButton active={tab === "find_coach"} onClick={() => setTab("find_coach")} icon={<Search className="h-4 w-4" />}>Koç Bul</TabButton>
        <TabButton active={tab === "requests"} onClick={() => setTab("requests")} icon={<CalendarCheck2 className="h-4 w-4" />}>Taleplerim</TabButton>
        <TabButton active={tab === "active_sessions"} onClick={() => setTab("active_sessions")} icon={<ChevronRight className="h-4 w-4" />}>Seanslarım</TabButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {tab === "find_coach" && (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCoaches.map(c => (
                <CoachCard key={c.id} coach={c} onAction={() => openRequestModal(c)} />
              ))}
            </div>
          )}
          {tab === "requests" && (
            <div className="space-y-3">
              {requests.length === 0 ? <p className="text-gray-500">Henüz talep yok.</p> : 
                requests.map(r => <RequestCard key={r.id} request={r} onStatusUpdate={updateRequestStatus} onAIInterview={handlePlanAIInterview} />)}
            </div>
          )}
          {tab === "active_sessions" && <div className="p-10 text-center border-2 border-dashed rounded-3xl text-gray-400">Aktif seans kaydı bulunamadı.</div>}
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl border-none bg-gray-50">
            <CardHeader><CardTitle className="text-base">Hızlı Menü</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-4">
              <div className="bg-white p-3 rounded-xl border">
                <p className="font-semibold">Aktif İlanlarım</p>
                <p className="text-xs text-gray-500 mt-1">İlanlarınızı `/jobs` sayfasından yönetebilirsiniz.</p>
                <Button onClick={() => navigate('/corporate/jobs')} variant="link" className="p-0 h-auto text-red-600 mt-2">İlanlara Git →</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Seans Talebi</CardTitle>
              <Button variant="ghost" onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea 
                className="w-full p-3 rounded-xl border min-h-[100px]" 
                placeholder="Bu seans ile hedeflerinizi belirtin..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button disabled={actionLoading} onClick={createRequest} className="w-full rounded-xl bg-red-600">
                {actionLoading ? "Gönderiliyor..." : "Talebi Gönder"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, icon, hint }: any) {
  return (
    <Card className="rounded-2xl border-none shadow-sm bg-white p-4 flex items-center gap-4">
      <div className="p-3 bg-red-50 text-red-600 rounded-xl">{icon}</div>
      <div><p className="text-xs text-gray-500">{title}</p><p className="text-xl font-bold">{value}</p><p className="text-[10px] text-gray-400">{hint}</p></div>
    </Card>
  );
}

function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${active ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}>
      {icon} {children}
    </button>
  );
}

function CoachCard({ coach, onAction }: any) {
  return (
    <Card className="rounded-2xl border-none shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-900">{coach.full_name}</h3>
        <BadgeCheck className="h-5 w-5 text-blue-500" />
      </div>
      <p className="text-xs text-gray-500 line-clamp-1">{coach.headline}</p>
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-bold">{coach.price_try}₺</span>
        <Button onClick={onAction} size="sm" className="rounded-lg h-8 bg-gray-900 text-white">Seans İste</Button>
      </div>
    </Card>
  );
}

function RequestCard({ request, onStatusUpdate, onAIInterview }: any) {
  return (
    <Card className="rounded-xl border-none shadow-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div><p className="font-bold text-sm">{request.coach_name}</p><p className="text-xs text-gray-500">{request.goal}</p></div>
        <span className={`text-[10px] px-2 py-1 rounded-full ${request.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{request.status.toUpperCase()}</span>
      </div>
      <div className="flex gap-2">
        {request.status === 'new' && <Button onClick={() => onStatusUpdate(request.id, 'approved')} size="sm" className="h-7 text-[10px] rounded-lg flex-1">Onayla</Button>}
        {request.status === 'approved' && <Button onClick={() => onAIInterview(request)} size="sm" className="h-7 text-[10px] rounded-lg flex-1 bg-red-600 text-white">AI Mülakat Planla</Button>}
        <Button onClick={() => onStatusUpdate(request.id, 'rejected')} size="sm" variant="outline" className="h-7 text-[10px] rounded-lg flex-1 text-red-600">Reddet</Button>
      </div>
    </Card>
  );
}

function defaultCoachMeta(idx: number, name: string) {
  const presets = [{ headline: "Senior Tech Coach", price_try: 2500 }, { headline: "Leadership Expert", price_try: 4000 }];
  const p = presets[idx % presets.length];
  return { ...p, specializations: ["Mülakat"], languages: ["TR", "EN"], seniority: "Senior", rating: 4.9, verified: true, availability: "Müsait" };
}
