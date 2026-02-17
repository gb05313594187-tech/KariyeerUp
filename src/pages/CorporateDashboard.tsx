// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { companyService } from "@/lib/supabase";
import { scheduleInterview, makeHireDecision } from "@/lib/meeting-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck2,
  TrendingUp,
  Search,
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
  Star,
  Crown,
} from "lucide-react";

const COACHES_TABLE = "app_2dff6511da_coaches";

type TabKey = "find_coach" | "requests" | "active_sessions" | "interviews";

export default function CorporateDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<TabKey>("interviews");

  const [coaches, setCoaches] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  // Görüşmeler
  const [interviews, setInterviews] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);

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
      await fetchInterviews(u.id);
      await fetchJobApplications(u.id);
    } catch (e: any) {
      toast.error("Panel yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachesFromDB = async () => {
    const { data } = await supabase
      .from(COACHES_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (!data) return;
    setCoaches(
      data.map((c: any) => ({
        id: c.id,
        full_name: c.full_name || "Koç",
        headline: c.title || "",
        specializations: c.specializations || [],
        languages: c.languages ? c.languages.split(",") : ["TR"],
        price_try: Number(c.hourly_rate) || 0,
        rating: Number(c.rating) || 0,
        verified: c.status === "approved",
        avatar_url: c.avatar_url,
      }))
    );
  };

  const fetchRequestsFromDB = async (uid: string) => {
    const { data } = await supabase
      .from("corporate_session_requests")
      .select("*")
      .eq("corporate_user_id", uid)
      .order("created_at", { ascending: false });

    if (data) setRequests(data);
  };

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

    const jobIds = jobs.map((j) => j.post_id);
    const { data: apps } = await supabase
      .from("job_applications")
      .select("*, candidate:profiles!candidate_id(full_name, email, avatar_url)")
      .in("job_id", jobIds)
      .order("applied_at", { ascending: false });

    const enriched = (apps || []).map((app) => {
      const job = jobs.find((j) => j.post_id === app.job_id);
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
        toast.success(
          hireDecision === "hired" ? "İşe alındı!" : hireDecision === "rejected" ? "Reddedildi" : "Beklemeye alındı"
        );
        setHireModalOpen(false);
        await fetchInterviews(me.id);
      }
    } catch (e) {
      toast.error("Karar kaydedilemedi");
    } finally {
      setHireLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const kpis = useMemo(() => {
    const totalCoaches = coaches.length;
    const openRequests = requests.filter((r) => r.status === "new" || r.status === "reviewing").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const totalInterviews = interviews.length;
    const impact = Math.min(92, 49 + approved * 7 + totalInterviews * 5);
    return { totalCoaches, openRequests, approved, totalInterviews, impact };
  }, [coaches, requests, interviews]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Kurumsal panel yükleniyor...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600/20 to-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm mb-3">
                <Building2 className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-300">Kurumsal Panel</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                  {profile?.brand_name || profile?.legal_name || "Şirket"}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">
                İlan Yönetimi • Koçluk •{" "}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  İşe Alım Merkezi
                </span>
              </h1>
            </div>
            <Button
              onClick={() => navigate("/jobs/new")}
              className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-6 hover:brightness-110 shadow-lg shadow-red-900/30"
            >
              <FilePlus2 className="h-4 w-4 mr-2" />
              Yeni İlan Ver
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-5 -mt-6 relative z-20">
          {[
            { title: "Koç Havuzu", value: kpis.totalCoaches, icon: Users, hint: "Aktif koç", gradient: "from-red-500 to-orange-500" },
            { title: "Açık Talepler", value: kpis.openRequests, icon: Clock, hint: "Bekleyen", gradient: "from-amber-500 to-orange-500" },
            { title: "Onaylanan", value: kpis.approved, icon: CheckCircle2, hint: "Başladı", gradient: "from-emerald-500 to-teal-500" },
            { title: "Görüşmeler", value: kpis.totalInterviews, icon: Video, hint: "Planlanan", gradient: "from-blue-500 to-indigo-500" },
            { title: "Impact Score", value: `${kpis.impact}/100`, icon: Sparkles, hint: "Verimlilik", gradient: "from-yellow-500 to-amber-500" },
          ].map((kpi, i) => (
            <Card key={i} className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all">
              <CardContent className="py-5 px-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-md mb-3`}>
                  <kpi.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{kpi.title}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{kpi.value}</p>
                <p className="text-[11px] text-gray-400">{kpi.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-1.5 flex gap-1 overflow-x-auto">
          {[
            { key: "interviews", label: "Görüşmelerim", icon: Video },
            { key: "find_coach", label: "Koç Bul", icon: Search },
            { key: "requests", label: "Taleplerim", icon: CalendarCheck2 },
            { key: "active_sessions", label: "Seanslar", icon: ChevronRight },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* GÖRÜŞMELERİM */}
            {tab === "interviews" && (
              <div className="space-y-6">
                {/* Bekleyen Başvurular */}
                {jobApplications.filter((a) => a.status !== "interview_scheduled").length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-black text-lg flex items-center gap-2 text-gray-900">
                      <Mail className="h-5 w-5 text-orange-500" /> Bekleyen Başvurular
                    </h3>
                    {jobApplications
                      .filter((a) => a.status !== "interview_scheduled")
                      .map((app) => (
                        <Card key={app.id} className="p-4 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-200 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                                <Users className="h-6 w-6 text-red-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{app.candidate?.full_name}</p>
                                <p className="text-sm text-gray-600">
                                  {app.position} • {app.candidate?.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedApplication(app);
                                setInterviewModalOpen(true);
                              }}
                              className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl hover:brightness-110"
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
                    <h3 className="font-black text-lg flex items-center gap-2 text-gray-900">
                      <Calendar className="h-5 w-5 text-orange-500" /> Planlanan Görüşmeler
                    </h3>
                    {interviews.map((iv) => {
                      const scheduled = iv.scheduled_at ? new Date(iv.scheduled_at) : null;
                      const isUpcoming = scheduled && scheduled.getTime() > Date.now();
                      return (
                        <Card key={iv.id} className="p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-200 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-gray-900">{iv.candidate_name || iv.profiles?.full_name}</p>
                              <p className="text-sm text-gray-600">{iv.jobs?.position || iv.jobs?.custom_title}</p>
                              {scheduled && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {scheduled.toLocaleDateString("tr-TR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                            <Badge
                              className={`border ${
                                isUpcoming
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {isUpcoming ? "Yakında" : "Geçmiş"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {isUpcoming && (
                              <Button
                                onClick={() => navigate(`/meeting/${iv.jitsi_room || iv.id}`)}
                                size="sm"
                                className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:brightness-110"
                              >
                                <Video className="h-4 w-4 mr-2" /> Görüşmeye Gir
                              </Button>
                            )}
                            {!iv.hire_decision && (
                              <Button
                                onClick={() => {
                                  setSelectedInterview(iv);
                                  setHireModalOpen(true);
                                }}
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-xl border-orange-200 hover:bg-orange-50"
                              >
                                <UserCheck className="h-4 w-4 mr-2" /> Karar Ver
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                      <Video className="h-10 w-10 text-red-400" />
                    </div>
                    <p className="font-bold text-gray-600">Henüz görüşme planlanmadı</p>
                    <p className="text-sm text-gray-400 mt-1">İlan verin, başvurular gelince mülakat planlayın.</p>
                  </div>
                )}
              </div>
            )}

            {/* KOÇ BUL */}
            {tab === "find_coach" && (
              <div className="space-y-4">
                {coaches.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-10 w-10 text-red-400" />
                    </div>
                    <p className="font-bold text-gray-600">Henüz koç bulunmuyor</p>
                    <Button className="mt-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white" onClick={() => navigate("/coaches")}>
                      Koçları İncele
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {coaches.map((c) => (
                      <Card key={c.id} className="p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                          {c.avatar_url ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-orange-200">
                              <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                              <User className="h-6 w-6 text-red-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{c.full_name}</p>
                            <p className="text-sm text-gray-600">{c.headline}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs font-semibold">{c.rating.toFixed(1)}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600">
                                {c.price_try > 0 ? `${c.price_try} TL/saat` : "Fiyat belirtilmemiş"}
                              </span>
                            </div>
                          </div>
                          {c.verified && <BadgeCheck className="h-5 w-5 text-blue-500" />}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TALEPLERİM */}
            {tab === "requests" && (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                      <CalendarCheck2 className="h-10 w-10 text-red-400" />
                    </div>
                    <p className="font-bold text-gray-600">Henüz koçluk talebi yok</p>
                    <p className="text-sm text-gray-400 mt-1">Koç bulup talep gönderdiğinizde burada listelenecek.</p>
                  </div>
                ) : (
                  requests.map((r) => (
                    <Card key={r.id} className="p-4 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-200 transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{r.coach_name || "Koç"}</p>
                          <p className="text-sm text-gray-600">{r.goal || "—"} • {r.level || "—"}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(r.created_at).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <Badge
                          className={`border ${
                            r.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : r.status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {r.status === "approved" ? "Onaylandı" : r.status === "rejected" ? "Reddedildi" : "Beklemede"}
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* AKTİF SEANSLAR */}
            {tab === "active_sessions" && (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-red-400" />
                </div>
                <p className="font-bold text-gray-600">Aktif Seanslar</p>
                <p className="text-sm text-gray-400 mt-1">Koçluk seansları başladığında burada takip edebilirsiniz.</p>
              </div>
            )}
          </div>

          {/* Sağ Menü */}
          <div className="space-y-4">
            <Card className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-black">Hızlı Erişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate("/corporate/jobs")}
                  variant="outline"
                  className="w-full justify-start rounded-xl border-orange-200 hover:bg-orange-50"
                >
                  <Briefcase className="h-4 w-4 mr-2 text-orange-500" /> İlanlarım
                </Button>
                <Button
                  onClick={() => setTab("interviews")}
                  variant="outline"
                  className="w-full justify-start rounded-xl border-orange-200 hover:bg-orange-50"
                >
                  <Video className="h-4 w-4 mr-2 text-orange-500" /> Görüşmelerim
                </Button>
                <Button
                  onClick={() => navigate("/coaches")}
                  variant="outline"
                  className="w-full justify-start rounded-xl border-orange-200 hover:bg-orange-50"
                >
                  <Users className="h-4 w-4 mr-2 text-orange-500" /> Koçları İncele
                </Button>
              </CardContent>
            </Card>

            {/* Premium CTA */}
            <div className="rounded-2xl overflow-hidden">
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-600/20 to-transparent rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-black text-white">Kurumsal Premium</p>
                  <p className="text-xs text-gray-400 mt-1">Sınırsız ilan, öncelikli eşleşme ve detaylı raporlar.</p>
                  <Button className="mt-3 w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold hover:brightness-110">
                    Planları Gör
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mülakat Planlama Modal */}
      {interviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-3xl border border-gray-200 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-black">Mülakat Planla</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Jitsi + Resend ile otomatik davet</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setInterviewModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="font-bold text-gray-900">{selectedApplication.candidate?.full_name}</p>
                <p className="text-sm text-gray-600">{selectedApplication.position}</p>
              </div>
              <input
                type="date"
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <input
                type="time"
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
              <select
                className="w-full p-3 border border-orange-200 rounded-xl"
                value={interviewDuration}
                onChange={(e) => setInterviewDuration(Number(e.target.value))}
              >
                <option value={30}>30 dakika</option>
                <option value={45}>45 dakika</option>
                <option value={60}>60 dakika</option>
              </select>
              <textarea
                className="w-full p-3 border border-orange-200 rounded-xl min-h-[80px]"
                placeholder="Not (opsiyonel)"
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
              />
              <Button
                onClick={handleScheduleInterview}
                disabled={interviewLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:brightness-110"
              >
                {interviewLoading ? "Planlanıyor..." : "Mülakatı Planla & Davet Gönder"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* İşe Alım Karar Modal */}
      {hireModalOpen && selectedInterview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-3xl border border-gray-200 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-black">İşe Alım Kararı</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setHireModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">{selectedInterview.candidate_name}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setHireDecision("hired")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    hireDecision === "hired"
                      ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-500 shadow-md"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <UserCheck className="h-6 w-6 mx-auto text-emerald-600" />
                  <p className="text-xs font-semibold mt-1">İşe Al</p>
                </button>
                <button
                  onClick={() => setHireDecision("on_hold")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    hireDecision === "on_hold"
                      ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-500 shadow-md"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <Pause className="h-6 w-6 mx-auto text-amber-600" />
                  <p className="text-xs font-semibold mt-1">Beklet</p>
                </button>
                <button
                  onClick={() => setHireDecision("rejected")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    hireDecision === "rejected"
                      ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-500 shadow-md"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <UserX className="h-6 w-6 mx-auto text-red-600" />
                  <p className="text-xs font-semibold mt-1">Reddet</p>
                </button>
              </div>
              {hireDecision === "hired" && (
                <>
                  <input
                    type="number"
                    placeholder="Maaş teklifi (TL)"
                    className="w-full p-3 border border-orange-200 rounded-xl"
                    value={hireSalary}
                    onChange={(e) => setHireSalary(e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-full p-3 border border-orange-200 rounded-xl"
                    value={hireStartDate}
                    onChange={(e) => setHireStartDate(e.target.value)}
                  />
                </>
              )}
              <textarea
                className="w-full p-3 border border-orange-200 rounded-xl min-h-[80px]"
                placeholder="Not (opsiyonel)"
                value={hireNotes}
                onChange={(e) => setHireNotes(e.target.value)}
              />
              <Button
                onClick={handleHireDecision}
                disabled={hireLoading}
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:brightness-110"
              >
                {hireLoading ? "Kaydediliyor..." : "Kararı Kaydet & Adaya Bildir"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
