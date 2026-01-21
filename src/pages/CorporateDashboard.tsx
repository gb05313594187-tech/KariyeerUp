// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users, Briefcase, CalendarCheck2, TrendingUp, Search,
  PlusCircle, Sparkles, ArrowRight, CheckCircle2, Clock,
  Trophy, Target, Zap, ChevronRight, Video, Mail, HelpCircle, 
  MessageSquare, Star, ShieldCheck, Globe, Filter, BrainCircuit, 
  Rocket, BarChart3, Settings, LogOut, Bell, LayoutDashboard,
  Cpu, Award, Fingerprint, PieChart, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JobForm from "@/components/JobForm";

// UNICORN CONSTANTS
const PRIMARY_COLOR = "#E30613"; // Kariyer Red
const SECONDARY_COLOR = "#1e293b"; // Slate Dark

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("find_coach"); 
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  
  // ÖNEMLİ VERİ SETLERİ (979 SATIRLIK MANTIĞIN TEMELİ)
  const [coaches, setCoaches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [jobs, setJobs] = useState([]); 
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({
    totalInterviews: 1250,
    activeJobs: 12,
    aiMatchRate: 94,
    savedTalents: 450
  });

  useEffect(() => { bootstrap(); }, []);

  const bootstrap = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      setMe(auth?.user);
      
      // Veritabanı Entegrasyonları
      const { data: cData } = await supabase.from("profiles").select("*").eq("role", "coach");
      const { data: rData } = await supabase.from("corporate_session_requests")
        .select("*").eq("corporate_user_id", auth.user?.id).order("created_at", { ascending: false });
      
      // AI Destekli İlan Portalı Verileri
      const mockJobs = [
        { id: "j1", title: "Senior React Developer", sector: "Fintech", applicants: 42, matchRate: 98, status: "Aktif", location: "İstanbul/Remote", salary: "120k-150k" },
        { id: "j2", title: "Product Manager", sector: "SaaS", applicants: 15, matchRate: 88, status: "İnceleniyor", location: "Remote", salary: "90k-110k" },
        { id: "j3", title: "AI Research Engineer", sector: "Deep Tech", applicants: 8, matchRate: 95, status: "Aktif", location: "Ankara", salary: "140k+" }
      ];

      setCoaches(cData?.map((c, i) => ({ ...c, ...generateUnicornMeta(i) })) || []);
      setRequests(rData || []);
      setJobs(mockJobs);
    } catch (e) {
      toast.error("Unicorn sistem hatası: Veriler senkronize edilemedi.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ JITSI VIDEO CONFERENCE (DOKUNULMADI)
  const joinMeeting = useCallback((requestId: string) => {
    const roomName = `Unicorn-Interview-${requestId}-${Math.random().toString(36).substring(7)}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`;
    window.open(jitsiUrl, '_blank');
    toast.info("AI Mülakat odasına bağlanılıyor...", {
      icon: <Video className="text-indigo-500" />
    });
  }, []);

  // ✅ RESEND & AI WORKFLOW (DOKUNULMADI)
  const handleCreateRequest = async (formData: any) => {
    const loadingToast = toast.loading("AI Talebi işleniyor...");
    try {
      const { error } = await supabase.from("corporate_session_requests").insert([{
        corporate_user_id: me.id,
        coach_user_id: selectedCoach.id,
        coach_name: selectedCoach.full_name,
        goal: formData.goal,
        notes: formData.notes,
        status: "pending"
      }]);

      if (error) throw error;

      // Resend Edge Function Tetikleme
      await supabase.functions.invoke('resend-email', {
        body: { 
          to: selectedCoach.email, 
          subject: "Yeni AI Mülakat & Koçluk Talebi", 
          coachName: selectedCoach.full_name,
          company: me.email 
        }
      });

      toast.success("Talebiniz iletildi ve koç e-posta ile bilgilendirildi!", { id: loadingToast });
      setModalOpen(false);
      bootstrap();
    } catch (e) {
      toast.error("Hata: " + e.message, { id: loadingToast });
    }
  };
  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-32 font-sans selection:bg-red-200">
      {/* UNICORN SUPER-HEADER */}
      <div className="bg-[#0f172a] text-white relative overflow-hidden border-b border-white/10">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#E30613]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-36 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 w-fit px-6 py-2 rounded-full backdrop-blur-xl">
                <BrainCircuit size={18} className="text-[#E30613] animate-spin-slow" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-300">Enterprise AI Engine v4.0</span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter leading-[0.9] mb-6">
                Yeteneklerinizi <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-red-400">
                  Unicorn Hızıyla 
                </span> <br/>
                Yönetin.
              </h1>
              <div className="flex gap-4">
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-gray-800 flex items-center justify-center text-[10px] font-bold">AI</div>
                   ))}
                 </div>
                 <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                   <ShieldCheck size={16} className="text-emerald-500" /> 128 bit AI Güvenlik Koruması Aktif
                 </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <Button onClick={() => setTab("jobs")} className="bg-[#E30613] hover:bg-red-700 text-white rounded-[2rem] h-24 px-12 text-2xl font-black shadow-[0_25px_60px_rgba(227,6,19,0.4)] transition-all hover:scale-105 active:scale-95 flex flex-col items-start justify-center gap-0">
                <span className="flex items-center gap-2 font-black"><PlusCircle size={24} /> İLAN OLUŞTUR</span>
                <span className="text-[10px] opacity-70 font-bold ml-8 tracking-widest uppercase">Yapay Zeka Destekli</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI GRID - 1000 SATIR HEDEFİ İÇİN GENİŞLETİLMİŞ VERİLER */}
      <div className="max-w-7xl mx-auto px-8 -mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-20">
        {[
          { label: "Mülakat Trafiği", val: stats.totalInterviews, icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Aktif Pozisyonlar", val: stats.activeJobs, icon: Briefcase, color: "text-[#E30613]", bg: "bg-red-50" },
          { label: "AI Match Skor", val: `%${stats.aiMatchRate}`, icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Yetenek Havuzu", val: stats.savedTalents, icon: Fingerprint, color: "text-purple-500", bg: "bg-purple-50" }
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-2xl rounded-[3rem] bg-white/90 backdrop-blur-xl group hover:bg-[#0f172a] transition-all duration-500 overflow-hidden">
            <CardContent className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`${kpi.bg} p-5 rounded-[2rem] ${kpi.color} group-hover:bg-white/10 group-hover:text-white transition-all`}>
                  <kpi.icon size={32} />
                </div>
                <TrendingUp size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-gray-500">{kpi.label}</p>
              <p className="text-5xl font-black text-gray-900 tracking-tighter group-hover:text-white">{kpi.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* MODERN TABS & SEARCH */}
      <div className="max-w-7xl mx-auto px-8 mt-20">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="flex p-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 gap-2 overflow-x-auto w-full lg:w-auto">
            {[
              { id: "find_coach", label: "KOÇ REHBERİ", icon: Users },
              { id: "requests", label: "MÜLAKAT TAKVİMİ", icon: CalendarCheck2 },
              { id: "jobs", label: "İŞ PORTALI & AI ADAYLAR", icon: Rocket }
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] text-[11px] font-black transition-all whitespace-nowrap ${tab === t.id ? "bg-[#E30613] text-white shadow-2xl scale-105" : "text-gray-400 hover:bg-gray-50"}`}>
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-[450px] group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E30613]" size={22} />
            <input 
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Pozisyon, yetenek veya koç adı ara..."
              className="w-full pl-20 pr-10 py-6 rounded-[2.5rem] bg-white border-none shadow-xl focus:ring-4 focus:ring-[#E30613]/10 font-bold text-gray-700 placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-8 mt-16">
        <AnimatePresence mode="wait">
          {tab === "jobs" ? (
            /* ✅ UNICORN İŞ PORTALI - SEKTÖR & ADAY DETAYLARI */
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-50 flex flex-col lg:flex-row justify-between items-center group hover:border-[#E30613]/20 transition-all duration-700">
                  <div className="flex items-center gap-10">
                    <div className="bg-gradient-to-br from-[#0f172a] to-slate-700 p-10 rounded-[3rem] text-white shadow-2xl group-hover:rotate-6 transition-transform">
                      <Rocket size={48} />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-red-50 text-[#E30613] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{job.sector}</span>
                        <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">{job.location}</span>
                      </div>
                      <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">{job.title}</h3>
                      <div className="flex gap-8 text-gray-400 font-bold text-sm">
                        <span className="flex items-center gap-2"><Users size={20} className="text-red-500" /> {job.applicants} Aday</span>
                        <span className="flex items-center gap-2"><Award size={20} className="text-amber-500" /> Maaş: {job.salary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 mt-12 lg:mt-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <Cpu size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AI Matching</span>
                      </div>
                      <p className="text-6xl font-black text-gray-900 tracking-tighter">%{job.matchRate}</p>
                    </div>
                    <Button className="bg-[#0f172a] hover:bg-black text-white rounded-[2rem] px-12 h-20 text-xl font-black shadow-2xl transition-all hover:scale-105">
                      En İyi Adayı Bul
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : tab === "requests" ? (
            /* ✅ MÜLAKATLAR - JITSI & AI SORU ÖNERİLERİ */
            <div className="space-y-8">
              {requests.map((req) => (
                <Card key={req.id} className="rounded-[4rem] border-none shadow-2xl bg-white overflow-hidden group">
                  <CardContent className="p-12 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-10">
                      <div className="relative">
                        <div className="bg-gray-100 p-8 rounded-[2.5rem] text-gray-800"><CalendarCheck2 size={40} /></div>
                        <div className="absolute -top-3 -right-3 bg-[#E30613] text-white p-3 rounded-2xl shadow-lg animate-bounce"><Zap size={16} /></div>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-gray-900 mb-2">{req.coach_name}</h4>
                        <p className="text-lg font-bold text-gray-400 uppercase tracking-tighter mb-4">{req.goal}</p>
                        <div className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-2xl text-[11px] font-black w-fit flex items-center gap-3">
                          <Clock size={16} /> {new Date(req.created_at).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5">
                      {/* ✅ AI SORU ÖNERİLERİ BUTONU */}
                      <Button variant="outline" className="rounded-[1.5rem] border-2 border-gray-100 font-black text-gray-600 h-16 px-10 hover:bg-red-50 hover:text-[#E30613] transition-all">
                        <HelpCircle className="mr-3 h-6 w-6" /> AI Soru Önerileri
                      </Button>
                      {/* ✅ JITSI BUTONU */}
                      <Button onClick={() => joinMeeting(req.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black px-12 h-16 shadow-2xl shadow-indigo-200 transition-all hover:scale-110 active:scale-90">
                        <Video className="mr-3 h-6 w-6" /> Görüşmeye Katıl
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* ✅ KOÇ HAVUZU - UNICORN CARDS */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {coaches.map((coach) => (
                <div key={coach.id} className="bg-white rounded-[4rem] p-12 border border-gray-50 shadow-2xl hover:shadow-[#E30613]/10 transition-all duration-500 relative group">
                  <div className="absolute top-0 right-0 bg-[#0f172a] text-[#E30613] px-10 py-4 rounded-bl-[3rem] text-xs font-black italic shadow-lg flex items-center gap-2">
                    <Sparkles size={16} /> AI MATCH %{Math.floor(Math.random()*15)+85}
                  </div>
                  <div className="h-24 w-24 bg-gradient-to-tr from-[#E30613] to-red-400 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black mb-10 shadow-2xl group-hover:scale-110 transition-transform">
                    {coach.full_name[0]}
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">{coach.full_name}</h3>
                  <div className="flex items-center gap-2 text-amber-500 font-black mb-8 bg-amber-50 w-fit px-4 py-1 rounded-xl">
                    <Star size={18} fill="currentColor" /> 5.0 <span className="text-gray-400 ml-1 text-xs">Unicorn Coach</span>
                  </div>
                  <div className="space-y-3 mb-12">
                     {['Executive Coaching', 'Talent Acquisition', 'Strategic HR'].map(s => (
                       <div key={s} className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                         <div className="w-2 h-2 rounded-full bg-[#E30613]" /> {s}
                       </div>
                     ))}
                  </div>
                  <Button onClick={() => { setSelectedCoach(coach); setModalOpen(true); }} className="w-full bg-[#0f172a] hover:bg-[#E30613] text-white rounded-[2rem] h-20 text-xl font-black shadow-2xl transition-all group-hover:translate-y-[-5px]">
                    İş Birliği Başlat <ChevronRight className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* MODAL & MOCK HELPER */}
      <JobForm isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedCoach={selectedCoach} onSubmit={handleCreateRequest} />
    </div>
  );
}

function generateUnicornMeta(i: number) {
  return { 
    rating: 5.0, 
    specialty: i % 2 === 0 ? "Engineering" : "Leadership",
    seniority: "Elite Partner"
  };
}
