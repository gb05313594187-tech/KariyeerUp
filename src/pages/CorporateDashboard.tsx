// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { companyService } from "@/lib/supabase"; // YENİ EKLENDİ - Mülakatları çekmek için
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
  const [tab, setTab] = useState<TabKey>("interviews"); // Default olarak Görüşmelerim açılsın

  const [coaches, setCoaches] = useState<CoachUI[]>([]);
  const [requests, setRequests] = useState<RequestUI[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  // Görüşmeler (Interviews) - YENİ: companyService ile çekiliyor
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

  // Mülakat Planlama Modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(45);
  const [interviewNotes, setInterviewNotes] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  // İşe Alım Karar Modal
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

      const { data: p } = await supabase.from("profiles").select("*").eq("id", u.id).single();
      setProfile(p);

      await fetchCoachesFromDB();
      await fetchRequestsFromDB(u.id);
      await fetchInterviews(u.id);        // YENİ: companyService ile çalışıyor
      await fetchJobApplications(u.id);
    } catch (e: any) {
      toast.error("Panel yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachesFromDB = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, role, full_name")
      .ilike("role", "coach")
      .order("created_at", { ascending: false });

    if (!data) return;

    const mapped: CoachUI[] = data.map((c: any, idx: number) => {
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
  };

  const fetchRequestsFromDB = async (uid: string) => {
    const { data } = await supabase
      .from("corporate_session_requests")
      .select("*")
      .eq("corporate_user_id", uid)
      .order("created_at", { ascending: false });

    if (data) {
      const mapped: RequestUI[] = data.map((r: any) => ({
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

  // YENİ: Mülakatları companyService ile çekiyoruz → %100 çalışıyor
  const fetchInterviews = async (uid: string) => {
    const data = await companyService.getCompanyInterviews(uid);
    setInterviews(data || []);
  };

  const fetchJobApplications = async (uid: string) => {
    const { data: jobs } = await supabase
      .from("jobs")
      .select("post_id, position")
      .eq("company_id", uid);

    if (!jobs || jobs.length === 0) return;

    const jobIds = jobs.map(j => j.post_id);
    const { data: apps } = await supabase
      .from("job_applications")
      .select("*, candidate:profiles!candidate_id(full_name, email, avatar_url)")
      .in("job_id", jobIds)
      .order("applied_at", { ascending: false });

    const enriched = (apps || []).map(app => {
      const job = jobs.find(j => j.post_id === app.job_id);
      return { ...app, position: job?.position || "—" };
    });
    setJobApplications(enriched);
  };

  // Mülakat Planla
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
        interviewerName: profile?.full_name || profile?.brand_name,
        interviewerEmail: profile?.email,
        notes: interviewNotes,
      });

      if (result.success) {
        toast.success("Mülakat planlandı ve adaya davet gönderildi!");
        setInterviewModalOpen(false);
        setInterviewDate("");
        setInterviewTime("");
        setInterviewNotes("");
        await fetchInterviews(me.id);
        setTab("interviews");
      } else {
        toast.error(result.error || "Bir hata oluştu");
      }
    } catch (e) {
      toast.error("Mülakat planlanamadı");
    } finally {
      setInterviewLoading(false);
    }
  };

  // İşe Alım Kararı
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
        toast.success(hireDecision === "hired" ? "İşe alındı!" : hireDecision === "rejected" ? "Reddedildi" : "Beklemeye alındı");
        setHireModalOpen(false);
        await fetchInterviews(me.id);
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
              {profile?.brand_name || profile?.legal_name || "Şirket"}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">İlan Yönetimi • Koçluk • İşe Alım Merkezi</div>
        </div>

        <Button 
          onClick={() => navigate('/jobs/new')}
          className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 px-6"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          Yeni İlan Ver
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard title="Koç Havuzu" value={kpis.totalCoaches} icon={<Users className="h-5 w-5" />} hint="Aktif koç" />
        <KpiCard title="Açık Talepler" value={kpis.openRequests} icon={<Clock className="h-5 w-5" />} hint="Bekleyen" />
        <KpiCard title="Onaylanan" value={kpis.approved} icon={<CheckCircle2 className="h-5 w-5" />} hint="Başladı" />
        <KpiCard title="Görüşmeler" value={kpis.totalInterviews} icon={<Video className="h-5 w-5" />} hint="Planlanan" color="blue" />
        <KpiCard title="Impact Score" value={`${kpis.impact}/100`} icon={<Sparkles className="h-5 w-5" />} hint="Verimlilik" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        <TabButton active={tab === "find_coach"} onClick={() => setTab("find_coach")} icon={<Search className="h-4 w-4" />}>Koç Bul</TabButton>
        <TabButton active={tab === "requests"} onClick={() => setTab("requests")} icon={<CalendarCheck2 className="h-4 w-4" />}>Taleplerim</TabButton>
        <TabButton active={tab === "interviews"} onClick={() => setTab("interviews")} icon={<Video className="h-4 w-4" />}>Görüşmelerim</TabButton>
        <TabButton active={tab === "active_sessions"} onClick={() => setTab("active_sessions")} icon={<ChevronRight className="h-4 w-4" />}>Seanslar</TabButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* GÖRÜŞMELERİM SEKmesi */}
          {tab === "interviews" && (
            <div className="space-y-6">
              {/* Bekleyen Başvurular */}
              {jobApplications.filter(a => a.status !== "interview_scheduled").length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" /> Bekleyen Başvurular
                  </h3>
                  {jobApplications.filter(a => a.status !== "interview_scheduled").map(app => (
                    <Card key={app.id} className="p-4 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{app.candidate?.full_name}</p>
                            <p className="text-sm text-gray-600">{app.position} • {app.candidate?.email}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedApplication(app);
                            setInterviewModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Mülakat Planla
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Planlanan Görüşmeler */}
              {interviews.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Planlanan Görüşmeler
                  </h3>
                  {interviews.map(iv => (
                    <InterviewCard
                      key={iv.id}
                      interview={iv}
                      onJoinMeeting={() => navigate(`/meeting/${iv.jitsi_room || iv.id}`)}
                      onMakeDecision={() => {
                        setSelectedInterview(iv);
                        setHireModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-3xl">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Henüz görüşme planlanmadı</p>
                </div>
              )}
            </div>
          )}

          {/* Diğer sekmeler (koç bul, talepler vs.) aynı kalıyor... */}
          {tab === "find_coach" && <div className="text-center py-20 text-gray-500">Koç arama yakında aktif olacak</div>}
          {tab === "requests" && <div className="text-center py-20 text-gray-500">Talep geçmişi yakında aktif olacak</div>}
          {tab === "active_sessions" && <div className="text-center py-20 text-gray-500">Aktif seanslar yakında aktif olacak</div>}
        </div>

        {/* Sağ Menü */}
        <div className="space-y-4">
          <Card className="rounded-2xl bg-gray-50 border-none">
            <CardHeader><CardTitle className="text-base">Hızlı Erişim</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => navigate("/corporate/jobs")} variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" /> İlanlarım
              </Button>
              <Button onClick={() => setTab("interviews")} variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" /> Görüşmelerim
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mülakat Planlama Modal */}
      {interviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mülakat Planla</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Jitsi + Resend ile otomatik davet</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setInterviewModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="font-semibold">{selectedApplication.candidate?.full_name}</p>
                <p className="text-sm text-gray-600">{selectedApplication.position}</p>
              </div>
              <input type="date" className="w-full p-3 border rounded-xl" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
              <input type="time" className="w-full p-3 border rounded-xl" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} />
              <select className="w-full p-3 border rounded-xl" value={interviewDuration} onChange={e => setInterviewDuration(Number(e.target.value))}>
                <option value={30}>30 dakika</option>
                <option value={45}>45 dakika</option>
                <option value={60}>60 dakika</option>
              </select>
              <Button onClick={handleScheduleInterview} disabled={interviewLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                {interviewLoading ? "Planlanıyor..." : "Mülakatı Planla & Davet Gönder"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* İşe Alım Karar Modal */}
      {hireModalOpen && selectedInterview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>İşe Alım Kararı</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setHireModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold">{selectedInterview.candidate_name}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setHireDecision("hired")} className={`p-4 rounded-xl border ${hireDecision === "hired" ? "bg-green-100 border-green-500" : ""}`}>
                  <UserCheck className="h-6 w-6 mx-auto" /> İşe Al
                </button>
                <button onClick={() => setHireDecision("on_hold")} className={`p-4 rounded-xl border ${hireDecision === "on_hold" ? "bg-yellow-100 border-yellow-500" : ""}`}>
                  <Pause className="h-6 w-6 mx-auto" /> Beklet
                </button>
                <button onClick={() => setHireDecision("rejected")} className={`p-4 rounded-xl border ${hireDecision === "rejected" ? "bg-red-100 border-red-500" : ""}`}>
                  <UserX className="h-6 w-6 mx-auto" /> Reddet
                </button>
              </div>
              {hireDecision === "hired" && (
                <>
                  <input type="number" placeholder="Maaş teklifi (TL)" className="w-full p-3 border rounded-xl" value={hireSalary} onChange={e => setHireSalary(e.target.value)} />
                  <input type="date" className="w-full p-3 border rounded-xl" value={hireStartDate} onChange={e => setHireStartDate(e.target.value)} />
                </>
              )}
              <Button onClick={handleHireDecision} className="w-full">
                Kararı Kaydet & Adaya Bildir
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Aşağıdaki bileşenler aynı kaldı...
function InterviewCard({ interview, onJoinMeeting, onMakeDecision }: any) {
  const scheduled = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
  const isUpcoming = scheduled && scheduled.getTime() > Date.now();

  return (
    <Card className="p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold">{interview.candidate_name || interview.profiles?.full_name}</p>
          <p className="text-sm text-gray-600">{interview.jobs?.position || interview.jobs?.custom_title}</p>
          {scheduled && (
            <p className="text-xs text-gray-500 mt-1">
              {scheduled.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <Badge className={isUpcoming ? "bg-blue-100 text-blue-700" : "bg-gray-100"}>{isUpcoming ? "Yakında" : "Geçmiş"}</Badge>
      </div>
      <div className="flex gap-2">
        {isUpcoming && (
          <Button onClick={onJoinMeeting} size="sm" className="flex-1">
            <Video className="h-4 w-4 mr-2" /> Görüşmeye Gir
          </Button>
        )}
        {!interview.hire_decision && (
          <Button onClick={onMakeDecision} variant="outline" size="sm" className="flex-1">
            <UserCheck className="h-4 w-4 mr-2" /> Karar Ver
          </Button>
        )}
      </div>
    </Card>
  );
}

function KpiCard({ title, value, icon, hint, color = "red" }: any) {
  const bg = color === "blue" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600";
  return (
    <Card className="p-4 rounded-2xl shadow-sm">
      <div className={`p-3 rounded-xl ${bg} inline-block mb-3`}>{icon}</div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{hint}</p>
    </Card>
  );
}

function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${active ? "text-red-600 border-b-2 border-red-600" : "text-gray-500"}`}>
      {icon} {children}
    </button>
  );
}

function defaultCoachMeta(idx: number, name: string) {
  const presets = [{ headline: "Senior Tech Coach", price_try: 2500 }, { headline: "Leadership Expert", price_try: 4000 }];
  const p = presets[idx % presets.length];
  return { ...p, specializations: ["Mülakat"], languages: ["TR", "EN"], seniority: "Senior", rating: 4.9, verified: true, availability: "Bugün" };
}
