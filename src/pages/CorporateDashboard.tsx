// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, companyService } from "@/lib/supabase";
import { scheduleInterview, makeHireDecision } from "@/lib/meeting-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
  ShieldCheck,
  FileSearch
} from "lucide-react";

const COACHES_TABLE = "app_2dff6511da_coaches";

type TabKey = "find_coach" | "requests" | "active_sessions" | "assessments";

export default function CorporateDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<TabKey>("assessments");

  const [coaches, setCoaches] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  // Değerlendirme Seansları
  const [interviews, setInterviews] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);

  // Seans Planlama Modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(45);
  const [interviewNotes, setInterviewNotes] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Gelişim Karar Modal
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
        full_name: c.full_name || "Mentor",
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

  // Gelişim Seansı Planla
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
        toast.success("Değerlendirme seansı planlandı ve katılımcıya davet gönderildi!");
        setInterviewModalOpen(false);
        setInterviewDate("");
        setInterviewTime("");
        setInterviewNotes("");
        await fetchInterviews(me.id);
        setTab("assessments");
      } else {
        toast.error(result.error || "Bir hata oluştu");
      }
    } catch (e) {
      toast.error("Seans planlanamadı");
    } finally {
      setInterviewLoading(false);
    }
  };

  // Gelişim Kararı
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
          hireDecision === "hired" ? "Süreç başarıyla tamamlandı!" : hireDecision === "rejected" ? "Ek gelişim planlandı" : "İnceleme sürüyor"
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
          <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">Kurumsal panel yükleniyor...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-600/20 to-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-600/20 to-amber-500/20 border border-orange-500/30 backdrop-blur-sm mb-3">
                <Building2 className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-300 uppercase tracking-widest">Kurumsal Yönetim</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10 font-bold">
                  {profile?.brand_name || profile?.legal_name || "Şirket"}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Program Yönetimi • Mentorluk •{" "}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Gelişim Merkezi
                </span>
              </h1>
            </div>
            <Button
              onClick={() => navigate("/jobs/new")}
              className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black italic uppercase tracking-widest px-8 h-14 hover:brightness-110 shadow-xl shadow-orange-900/30"
            >
              <FilePlus2 className="h-4 w-4 mr-2" />
              Yeni Program Başlat
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-5 -mt-10 relative z-20">
          {[
            { title: "Uzman Havuzu", value: kpis.totalCoaches, icon: Users, hint: "Aktif Mentor", gradient: "from-orange-500 to-amber-500" },
            { title: "Talepler", value: kpis.openRequests, icon: Clock, hint: "Bekleyen", gradient: "from-amber-500 to-yellow-500" },
            { title: "Onaylanan", value: kpis.approved, icon: CheckCircle2, hint: "Süreç Başladı", gradient: "from-emerald-500 to-teal-500" },
            { title: "Görüşmeler", value: kpis.totalInterviews, icon: Video, hint: "Gelişim Seansı", gradient: "from-blue-500 to-indigo-500" },
            { title: "Başarı Skoru", value: `${kpis.impact}/100`, icon: Sparkles, hint: "Program Verimliliği", gradient: "from-purple-500 to-pink-500" },
          ].map((kpi, i) => (
            <Card key={i} className="rounded-3xl border border-gray-100 bg-white shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="py-6 px-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg mb-4`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{kpi.title}</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{kpi.value}</p>
                <p className="text-[10px] text-orange-500 font-bold mt-1">{kpi.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 rounded-2xl p-1.5 flex gap-1 overflow-x-auto">
          {[
            { key: "assessments", label: "Gelişim Takibi", icon: FileSearch },
            { key: "find_coach", label: "Mentor Bul", icon: Search },
            { key: "requests", label: "Program Talepleri", icon: CalendarCheck2 },
            { key: "active_sessions", label: "Canlı Seanslar", icon: Video },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  active
                    ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                    : "text-slate-500 hover:text-slate-700"
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
            {/* GELİŞİM TAKİBİ */}
            {tab === "assessments" && (
              <div className="space-y-6">
                {/* Bekleyen Katılımcılar */}
                {jobApplications.filter((a) => a.status !== "interview_scheduled").length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-black text-lg flex items-center gap-2 text-slate-800 italic uppercase tracking-tighter">
                      <Mail className="h-5 w-5 text-orange-600" /> İncelenecek Katılımcılar
                    </h3>
                    {jobApplications
                      .filter((a) => a.status !== "interview_scheduled")
                      .map((app) => (
                        <Card key={app.id} className="p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-orange-200 transition-all bg-white group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 transition-colors">
                                <Users className="h-7 w-7 text-slate-400 group-hover:text-orange-600" />
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-lg">{app.candidate?.full_name}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                                  Program: {app.position}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedApplication(app);
                                setInterviewModalOpen(true);
                              }}
                              className="bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6 hover:bg-orange-600 transition-all"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Seans Planla
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}

                {/* Planlanan Görüşmeler */}
                <div className="space-y-4">
                  <h3 className="font-black text-lg flex items-center gap-2 text-slate-800 italic uppercase tracking-tighter">
                    <Calendar className="h-5 w-5 text-orange-600" /> Aktif Gelişim Seansları
                  </h3>
                  {interviews.length > 0 ? (
                    interviews.map((iv) => {
                      const scheduled = iv.scheduled_at ? new Date(iv.scheduled_at) : null;
                      const isUpcoming = scheduled && scheduled.getTime() > Date.now();
                      return (
                        <Card key={iv.id} className="p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all bg-white">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="font-black text-xl text-slate-800">{iv.candidate_name || iv.profiles?.full_name}</p>
                              <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">{iv.jobs?.position || "Genel Değerlendirme"}</p>
                              {scheduled && (
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-2 uppercase">
                                  <Clock size={14} />
                                  {scheduled.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                                  <span className="text-slate-200">|</span>
                                  {scheduled.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              )}
                            </div>
                            <Badge className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ${isUpcoming ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-400"}`}>
                              {isUpcoming ? "YAKLAŞAN" : "ARŞİV"}
                            </Badge>
                          </div>
                          <div className="flex gap-3 mt-4">
                            {isUpcoming && (
                              <Button
                                onClick={() => navigate(`/meeting/${iv.jitsi_room || iv.id}`)}
                                className="flex-1 bg-orange-600 text-white rounded-2xl h-14 font-black uppercase italic tracking-widest shadow-lg shadow-orange-100 hover:bg-orange-700"
                              >
                                <Video className="h-5 w-5 mr-2" /> Seans Odasına Gir
                              </Button>
                            )}
                            {!iv.hire_decision && (
                              <Button
                                onClick={() => { setSelectedInterview(iv); setHireModalOpen(true); }}
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl border-2 border-slate-100 font-black uppercase text-xs tracking-widest hover:bg-slate-50"
                              >
                                <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-500" /> Değerlendir
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                      <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                        <Video className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Aktif seans kaydı yok</p>
                      <p className="text-xs text-slate-400 mt-2">Program yayınlayın ve katılımcılarla gelişim seansları planlayın.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KOÇ BUL */}
            {tab === "find_coach" && (
              <div className="grid gap-6 md:grid-cols-2">
                {coaches.map((c) => (
                  <Card key={c.id} className="p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 bg-white group">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-50 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${c.full_name}&background=random`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-800 truncate">{c.full_name}</p>
                          {c.verified && <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase truncate mt-1 tracking-tighter">{c.headline}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                             <span className="text-[10px] font-black text-yellow-700">{c.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-50 px-2 py-0.5 rounded-lg">
                            {c.price_try > 0 ? `${c.price_try} TL / SEANS` : "ÜCRETSİZ"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* TALEPLER VE AKTİF SEANSLAR PLACEHOLDERLAR */}
            {(tab === "requests" || tab === "active_sessions") && (
               <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                  <Pause className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="font-black text-slate-400 uppercase tracking-widest text-sm italic">Süreçler Hazırlanıyor</p>
               </div>
            )}
          </div>

          {/* SAĞ PANEL */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                  <Sparkles size={18} className="text-orange-600" /> Hızlı Erişim
                </h3>
              </div>
              <CardContent className="p-6 space-y-3">
                <Button onClick={() => navigate("/corporate/jobs")} variant="ghost" className="w-full justify-start rounded-2xl h-14 font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 group">
                  <Briefcase className="h-5 w-5 mr-3 text-slate-300 group-hover:text-orange-500" /> Programlarım
                </Button>
                <Button onClick={() => setTab("assessments")} variant="ghost" className="w-full justify-start rounded-2xl h-14 font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 group">
                  <FileSearch className="h-5 w-5 mr-3 text-slate-300 group-hover:text-orange-500" /> Gelişim Takibi
                </Button>
                <Button onClick={() => navigate("/coaches")} variant="ghost" className="w-full justify-start rounded-2xl h-14 font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 group">
                  <Users className="h-5 w-5 mr-3 text-slate-300 group-hover:text-orange-500" /> Mentor Havuzu
                </Button>
              </CardContent>
            </Card>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 group-hover:scale-105 transition-transform duration-700" />
              <div className="relative z-10 p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 shadow-xl">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter">CORPORATE<br/>PLUS</h3>
                <p className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-widest leading-relaxed">Sınırsız program, AI destekli vaka analizi ve özel gelişim raporları.</p>
                <Button className="mt-8 w-full h-14 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-black/20">
                  Yükselt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER YASAL BANNER */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-slate-200/50 p-6 rounded-3xl text-center border border-slate-200">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
             KARİYEER.COM BİR ÖZEL İSTİHDAM BÜROSU DEĞİLDİR. BU PANEL KURUMSAL GELİŞİM VE MENTORLUK PROGRAMLARININ TAKİBİ İÇİN TASARLANMIŞTIR.
             SİSTEM ÜZERİNDE YAPILAN DEĞERLENDİRMELER KATILIMCI GELİŞİM RAPORU NİTELİĞİNDEDİR.
           </p>
        </div>
      </div>

      {/* Mülakat Planlama Modal */}
      {interviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 p-8 flex flex-row items-center justify-between text-white">
              <div>
                <CardTitle className="font-black text-2xl italic tracking-tighter uppercase">Seans Planla</CardTitle>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Katılımcı Değerlendirmesi</p>
              </div>
              <button onClick={() => setInterviewModalOpen(false)} className="text-white/30 hover:text-white transition-colors"><X size={24} /></button>
            </CardHeader>
            <CardContent className="p-8 space-y-5">
              <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                <p className="font-black text-slate-800">{selectedApplication.candidate?.full_name}</p>
                <p className="text-[10px] font-bold text-orange-600 uppercase mt-1">Program: {selectedApplication.position}</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarih</label>
                    <input type="date" className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold focus:border-orange-500 outline-none" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Saat</label>
                    <input type="time" className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold focus:border-orange-500 outline-none" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} />
                  </div>
                </div>
                <textarea className="w-full p-4 border-2 border-slate-100 rounded-2xl min-h-[100px] font-medium outline-none focus:border-orange-500" placeholder="Seans notları (Gelişim odaklı)..." value={interviewNotes} onChange={(e) => setInterviewNotes(e.target.value)} />
              </div>
              <Button onClick={handleScheduleInterview} disabled={interviewLoading} className="w-full h-16 rounded-2xl bg-orange-600 text-white font-black uppercase italic tracking-widest shadow-xl hover:bg-orange-700 active:scale-95 transition-all">
                {interviewLoading ? "Hazırlanıyor..." : "Seansı Kaydet & Davet Et"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gelişim Karar Modal */}
      {hireModalOpen && selectedInterview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-black text-2xl tracking-tighter uppercase italic">Gelişim Kararı</CardTitle>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Katılımcı Sonuç Raporu</p>
              </div>
              <button onClick={() => setHireModalOpen(false)} className="text-slate-200 hover:text-slate-400 transition-colors"><X size={24} /></button>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                <p className="font-black text-slate-800 text-xl">{selectedInterview.candidate_name}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setHireDecision("hired")} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${hireDecision === "hired" ? "bg-emerald-50 border-emerald-500" : "border-slate-100"}`}>
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                  <p className="text-[9px] font-black uppercase">Tamamladı</p>
                </button>
                <button onClick={() => setHireDecision("on_hold")} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${hireDecision === "on_hold" ? "bg-amber-50 border-amber-500" : "border-slate-100"}`}>
                  <Pause className="h-6 w-6 text-amber-600" />
                  <p className="text-[9px] font-black uppercase">İnceleniyor</p>
                </button>
                <button onClick={() => setHireDecision("rejected")} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${hireDecision === "rejected" ? "bg-red-50 border-red-500" : "border-slate-100"}`}>
                  <UserX className="h-6 w-6 text-red-600" />
                  <p className="text-[9px] font-black uppercase">Eksik Var</p>
                </button>
              </div>
              <textarea className="w-full p-4 border-2 border-slate-100 rounded-2xl min-h-[100px] outline-none focus:border-orange-500" placeholder="Mentor değerlendirme özeti..." value={hireNotes} onChange={(e) => setHireNotes(e.target.value)} />
              <Button onClick={handleHireDecision} disabled={hireLoading} className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black italic uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">
                {hireLoading ? "Kaydediliyor..." : "Kararı Onayla & Katılımcıya Bildir"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
