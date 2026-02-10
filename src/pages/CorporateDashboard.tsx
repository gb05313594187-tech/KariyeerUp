// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { scheduleInterview, makeHireDecision, getCompanyInterviews } from "@/lib/meeting-api";
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
  Video,
  Calendar,
  UserCheck,
  UserX,
  Pause,
  ExternalLink,
  Send,
} from "lucide-react";

type TabKey = "find_coach" | "requests" | "active_sessions" | "interviews";

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

  // ✅ Yeni: Görüşmeler (Interviews)
  const [interviews, setInterviews] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);

  const [q, setQ] = useState("");
  const [goal, setGoal] = useState("Mülakat");
  const [level, setLevel] = useState("Mid");
  const [lang, setLang] = useState("TR");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachUI | null>(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isPlanningInterview, setIsPlanningInterview] = useState(false);

  // ✅ Yeni: Mülakat Planlama Modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(45);
  const [interviewNotes, setInterviewNotes] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  // ✅ Yeni: İşe Alım Karar Modal
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [hireDecision, setHireDecision] = useState<"hired" | "rejected" | "on_hold">("hired");
  const [hireSalary, setHireSalary] = useState("");
  const [hireStartDate, setHireStartDate] = useState("");
  const [hireNotes, setHireNotes] = useState("");
  const [hireLoading, setHireLoading] = useState(false);

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
      await fetchInterviews(u.id);
      await fetchJobApplications(u.id);
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

  // ✅ Yeni: Mülakatları çek
  const fetchInterviews = async (uid: string) => {
    const { data } = await getCompanyInterviews(uid);
    setInterviews(data || []);
  };

  // ✅ Yeni: İş başvurularını çek
  const fetchJobApplications = async (uid: string) => {
    // Şirketin ilanlarına yapılan başvuruları çek
    const { data: jobs } = await supabase
      .from("jobs")
      .select("post_id, position")
      .eq("company_id", uid);

    if (jobs && jobs.length > 0) {
      const jobIds = jobs.map(j => j.post_id);
      const { data: apps } = await supabase
        .from("job_applications")
        .select("*, candidate:profiles!candidate_id(full_name, email, avatar_url)")
        .in("job_id", jobIds)
        .order("applied_at", { ascending: false });

      // Pozisyon bilgisini ekle
      const enriched = (apps || []).map(app => {
        const job = jobs.find(j => j.post_id === app.job_id);
        return { ...app, position: job?.position || "—" };
      });
      setJobApplications(enriched);
    }
  };

  // ✅ Yeni: Mülakat Planla
  const handleScheduleInterview = async () => {
    if (!selectedApplication || !interviewDate || !interviewTime) {
      toast.error("Tarih ve saat seçin");
      return;
    }
    setInterviewLoading(true);
    try {
      const scheduledAt = new Date(`${interviewDate}T${interviewTime}:00`).toISOString();
      const result = await scheduleInterview({
        jobApplicationId: selectedApplication.id,
        scheduledAt,
        durationMinutes: interviewDuration,
        interviewerName: profile?.full_name,
        interviewerEmail: profile?.email,
        notes: interviewNotes,
      });

      if (result.success) {
        toast.success("Mülakat planlandı! Adaya email gönderildi.");
        setInterviewModalOpen(false);
        setInterviewDate("");
        setInterviewTime("");
        setInterviewNotes("");
        await fetchInterviews(me.id);
        await fetchJobApplications(me.id);
        setTab("interviews");
      } else {
        toast.error(result.error || "Hata oluştu");
      }
    } catch (e) {
      toast.error("Mülakat planlanamadı");
    } finally {
      setInterviewLoading(false);
    }
  };

  // ✅ Yeni: İşe Alım Kararı
  const handleHireDecision = async () => {
    if (!selectedInterview) return;
    setHireLoading(true);
    try {
      const result = await makeHireDecision({
        interviewId: selectedInterview.id,
        decision: hireDecision,
        salaryOffered: hireSalary ? Number(hireSalary) : undefined,
        startDate: hireStartDate || undefined,
        notes: hireNotes,
        notifyCandidate: true,
      });

      if (result.success) {
        const msgs = { hired: "İşe alım onaylandı!", rejected: "Başvuru reddedildi", on_hold: "Beklemede" };
        toast.success(msgs[hireDecision]);
        setHireModalOpen(false);
        await fetchInterviews(me.id);
      } else {
        toast.error(result.error || "Hata oluştu");
      }
    } catch (e) {
      toast.error("Karar kaydedilemedi");
    } finally {
      setHireLoading(false);
    }
  };

  useEffect(() => { bootstrap(); }, []);

  const kpis = useMemo(() => {
    const totalCoaches = coaches.length;
    const openRequests = requests.filter(r => r.status === "new" || r.status === "reviewing").length;
    const approved = requests.filter(r => r.status === "approved").length;
    const totalInterviews = interviews.length;
    const impact = Math.min(92, 49 + approved * 7 + totalInterviews * 5);
    return { totalCoaches, openRequests, approved, totalInterviews, impact };
  }, [coaches, requests, interviews]);

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
      {/* Header */}
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
      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard title="Koç Havuzu" value={kpis.totalCoaches} icon={<Users className="h-5 w-5" />} hint="Aktif koçlar" />
        <KpiCard title="Açık Talepler" value={kpis.openRequests} icon={<Clock className="h-5 w-5" />} hint="Bekleyen" />
        <KpiCard title="Onaylanan" value={kpis.approved} icon={<CheckCircle2 className="h-5 w-5" />} hint="Süreci başlayan" />
        <KpiCard title="Görüşmeler" value={kpis.totalInterviews} icon={<Video className="h-5 w-5" />} hint="Planlanan mülakatlar" color="blue" />
        <KpiCard title="Impact Score" value={`${kpis.impact}/100`} icon={<Sparkles className="h-5 w-5" />} hint="Verimlilik" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        <TabButton active={tab === "find_coach"} onClick={() => setTab("find_coach")} icon={<Search className="h-4 w-4" />}>Koç Bul</TabButton>
        <TabButton active={tab === "requests"} onClick={() => setTab("requests")} icon={<CalendarCheck2 className="h-4 w-4" />}>Taleplerim</TabButton>
        <TabButton active={tab === "interviews"} onClick={() => setTab("interviews")} icon={<Video className="h-4 w-4" />}>Görüşmelerim</TabButton>
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

          {/* ✅ YENİ: Görüşmelerim Sekmesi */}
          {tab === "interviews" && (
            <div className="space-y-4">
              {/* Başvurular - Mülakat Planla */}
              {jobApplications.filter(a => a.status === "pending" || a.status === "reviewing").length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Bekleyen Başvurular
                  </h3>
                  {jobApplications.filter(a => a.status === "pending" || a.status === "reviewing").map(app => (
                    <Card key={app.id} className="rounded-xl border-none shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{app.candidate?.full_name || "Aday"}</p>
                            <p className="text-xs text-gray-500">{app.position} • {app.candidate?.email}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(app.applied_at).toLocaleDateString("tr-TR")} tarihinde başvurdu
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(app);
                            setInterviewModalOpen(true);
                          }}
                          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Mülakat Planla
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Planlanan Mülakatlar */}
              {interviews.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Planlanan Görüşmeler
                  </h3>
                  {interviews.map(iv => (
                    <InterviewCard
                      key={iv.id}
                      interview={iv}
                      onJoinMeeting={() => {
                        if (iv.jitsi_room) {
                          navigate(`/meeting/${iv.jitsi_room}`);
                        } else if (iv.meeting_link) {
                          window.open(iv.meeting_link, "_blank");
                        }
                      }}
                      onMakeDecision={() => {
                        setSelectedInterview(iv);
                        setHireModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                jobApplications.filter(a => a.status === "pending" || a.status === "reviewing").length === 0 && (
                  <div className="p-10 text-center border-2 border-dashed rounded-3xl text-gray-400">
                    <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Henüz görüşme planlanmamış</p>
                    <p className="text-sm mt-1">İlanlarınıza gelen başvurulardan mülakat planlayabilirsiniz.</p>
                  </div>
                )
              )}
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
                <p className="text-xs text-gray-500 mt-1">İlanlarınızı yönetebilirsiniz.</p>
                <Button onClick={() => navigate('/corporate/jobs')} variant="link" className="p-0 h-auto text-red-600 mt-2">İlanlara Git →</Button>
              </div>
              <div className="bg-white p-3 rounded-xl border">
                <p className="font-semibold">Görüşmelerim</p>
                <p className="text-xs text-gray-500 mt-1">Planlanan mülakatlarınızı görün.</p>
                <Button onClick={() => setTab("interviews")} variant="link" className="p-0 h-auto text-blue-600 mt-2">Görüşmelere Git →</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seans Talebi Modal (Mevcut) */}
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

      {/* ✅ YENİ: Mülakat Planlama Modal */}
      {interviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Mülakat Planla
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Jitsi ile online görüşme + Resend ile email davet</p>
              </div>
              <Button variant="ghost" onClick={() => setInterviewModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aday Bilgisi */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedApplication.candidate?.full_name || "Aday"}</p>
                    <p className="text-xs text-gray-600">{selectedApplication.position} • {selectedApplication.candidate?.email}</p>
                  </div>
                </div>
              </div>

              {/* Tarih */}
              <div>
                <label className="text-sm font-medium text-gray-700">Tarih *</label>
                <input
                  type="date"
                  className="w-full mt-1 p-3 rounded-xl border"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Saat */}
              <div>
                <label className="text-sm font-medium text-gray-700">Saat *</label>
                <input
                  type="time"
                  className="w-full mt-1 p-3 rounded-xl border"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </div>

              {/* Süre */}
              <div>
                <label className="text-sm font-medium text-gray-700">Süre (dakika)</label>
                <select
                  className="w-full mt-1 p-3 rounded-xl border"
                  value={interviewDuration}
                  onChange={(e) => setInterviewDuration(Number(e.target.value))}
                >
                  <option value={30}>30 dakika</option>
                  <option value={45}>45 dakika</option>
                  <option value={60}>60 dakika</option>
                  <option value={90}>90 dakika</option>
                </select>
              </div>

              {/* Not */}
              <div>
                <label className="text-sm font-medium text-gray-700">Not (opsiyonel)</label>
                <textarea
                  className="w-full mt-1 p-3 rounded-xl border min-h-[80px]"
                  placeholder="Mülakat hakkında not..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                />
              </div>

              {/* Bilgi */}
              <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700">
                <p>✅ Otomatik Jitsi video link oluşturulacak</p>
                <p>✅ Adaya email ile davet gönderilecek</p>
                <p>✅ 1 saat önce hatırlatma emaili gidecek</p>
              </div>

              <Button
                disabled={interviewLoading || !interviewDate || !interviewTime}
                onClick={handleScheduleInterview}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {interviewLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Planlanıyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Mülakatı Planla & Davet Gönder
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ✅ YENİ: İşe Alım Karar Modal */}
      {hireModalOpen && selectedInterview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>İşe Alım Kararı</CardTitle>
              <Button variant="ghost" onClick={() => setHireModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aday Bilgisi */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold">{selectedInterview.candidate_name || selectedInterview.candidate?.full_name}</p>
                <p className="text-xs text-gray-500">
                  {selectedInterview.candidate_email || selectedInterview.candidate?.email}
                </p>
              </div>

              {/* Karar */}
              <div>
                <label className="text-sm font-medium text-gray-700">Karar *</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => setHireDecision("hired")}
                    className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 transition-colors ${hireDecision === "hired" ? "bg-green-100 border-green-500 text-green-700" : "hover:bg-gray-50"}`}
                  >
                    <UserCheck className="h-5 w-5" />
                    İşe Al
                  </button>
                  <button
                    onClick={() => setHireDecision("on_hold")}
                    className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 transition-colors ${hireDecision === "on_hold" ? "bg-yellow-100 border-yellow-500 text-yellow-700" : "hover:bg-gray-50"}`}
                  >
                    <Pause className="h-5 w-5" />
                    Beklet
                  </button>
                  <button
                    onClick={() => setHireDecision("rejected")}
                    className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 transition-colors ${hireDecision === "rejected" ? "bg-red-100 border-red-500 text-red-700" : "hover:bg-gray-50"}`}
                  >
                    <UserX className="h-5 w-5" />
                    Reddet
                  </button>
                </div>
              </div>

              {/* İşe alındıysa ek bilgiler */}
              {hireDecision === "hired" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Maaş Teklifi (TL)</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-3 rounded-xl border"
                      placeholder="Ör: 45000"
                      value={hireSalary}
                      onChange={(e) => setHireSalary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      className="w-full mt-1 p-3 rounded-xl border"
                      value={hireStartDate}
                      onChange={(e) => setHireStartDate(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Not */}
              <div>
                <label className="text-sm font-medium text-gray-700">Not</label>
                <textarea
                  className="w-full mt-1 p-3 rounded-xl border min-h-[80px]"
                  placeholder="Adaya iletilecek not..."
                  value={hireNotes}
                  onChange={(e) => setHireNotes(e.target.value)}
                />
              </div>

              {/* Bilgi */}
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                <p>✅ Adaya otomatik email bildirimi gönderilecek</p>
                <p>✅ Karar admin paneline kaydedilecek</p>
              </div>

              <Button
                disabled={hireLoading}
                onClick={handleHireDecision}
                className={`w-full rounded-xl ${hireDecision === "hired" ? "bg-green-600 hover:bg-green-700" : hireDecision === "rejected" ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
              >
                {hireLoading ? "Kaydediliyor..." : hireDecision === "hired" ? "✅ İşe Al & Bildir" : hireDecision === "rejected" ? "❌ Reddet & Bildir" : "⏸ Beklete Al"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ✅ YENİ: Interview Card Bileşeni
function InterviewCard({ interview, onJoinMeeting, onMakeDecision }: any) {
  const scheduled = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
  const isUpcoming = scheduled && scheduled.getTime() > Date.now();
  const isPast = scheduled && scheduled.getTime() < Date.now();
  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
    pending: "bg-yellow-50 text-yellow-600",
  };
  const statusLabels: Record<string, string> = {
    scheduled: "Planlandı",
    completed: "Tamamlandı",
    cancelled: "İptal",
    pending: "Bekliyor",
  };

  return (
    <Card className="rounded-xl border-none shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUpcoming ? "bg-blue-100" : "bg-gray-100"}`}>
            <Video className={`h-5 w-5 ${isUpcoming ? "text-blue-600" : "text-gray-400"}`} />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {interview.candidate_name || interview.candidate?.full_name || "Aday"}
            </p>
            <p className="text-xs text-gray-500">
              {interview.job?.position || "Pozisyon"} • {interview.candidate_email || interview.candidate?.email}
            </p>
            {scheduled && (
              <p className="text-xs text-gray-400 mt-1">
                📅 {scheduled.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                {" "}🕐 {scheduled.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                {" "}⏱ {interview.duration_minutes || 45}dk
              </p>
            )}
          </div>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusColors[interview.status] || "bg-gray-50 text-gray-600"}`}>
          {statusLabels[interview.status] || interview.status}
        </span>
      </div>

      {/* Aksiyonlar */}
      <div className="flex gap-2 mt-3">
        {isUpcoming && interview.status === "scheduled" && (
          <Button onClick={onJoinMeeting} size="sm" className="h-8 text-xs rounded-lg bg-blue-600 text-white flex-1">
            <Video className="h-3 w-3 mr-1" /> Görüşmeye Katıl
          </Button>
        )}
        {(interview.status === "scheduled" || interview.status === "completed") && !interview.hire_decision && (
          <Button onClick={onMakeDecision} size="sm" variant="outline" className="h-8 text-xs rounded-lg flex-1">
            <UserCheck className="h-3 w-3 mr-1" /> Karar Ver
          </Button>
        )}
        {interview.hire_decision && (
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            interview.hire_decision === "hired" ? "bg-green-100 text-green-700" :
            interview.hire_decision === "rejected" ? "bg-red-100 text-red-700" :
            "bg-yellow-100 text-yellow-700"
          }`}>
            {interview.hire_decision === "hired" ? "✅ İşe Alındı" :
             interview.hire_decision === "rejected" ? "❌ Reddedildi" : "⏸ Beklemede"}
          </span>
        )}
      </div>

      {/* Email durumu */}
      {interview.email_sent && (
        <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
          <Mail className="h-3 w-3" /> Davet emaili gönderildi
        </p>
      )}
    </Card>
  );
}

function KpiCard({ title, value, icon, hint, color = "red" }: any) {
  const colors = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <Card className="rounded-2xl border-none shadow-sm bg-white p-4 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color] || colors.red}`}>{icon}</div>
      <div><p className="text-xs text-gray-500">{title}</p><p className="text-xl font-bold">{value}</p><p className="text-[10px] text-gray-400">{hint}</p></div>
    </Card>
  );
}

function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${active ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}>
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
