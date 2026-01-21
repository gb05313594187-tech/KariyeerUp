// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users, Briefcase, CalendarCheck2, TrendingUp, Search,
  PlusCircle, Sparkles, ArrowRight, CheckCircle2, Clock,
  Trophy, Target, Zap, ChevronRight, Video, Mail, HelpCircle, 
  MessageSquare, Star, ShieldCheck, Globe, Filter, BrainCircuit, 
  Rocket, BarChart3, Settings, LogOut, Bell, LayoutDashboard,
  Cpu, Award, Fingerprint, PieChart, Activity, MousePointer2,
  Share2, Bookmark, Lightbulb, Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JobForm from "@/components/JobForm";

/**
 * UNICORN ENTERPRISE DASHBOARD - V4.0
 * Özellikler: AI İlan Yönetimi, Jitsi Video Entegrasyonu, Resend E-posta Sistemi, Aday Analiz Paneli
 */

export default function CorporateDashboard() {
  // --- STATE YÖNETİMİ ---
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("jobs"); // Default tab: Jobs
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [me, setMe] = useState(null);

  // Veri Setleri
  const [coaches, setCoaches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI Aday eşleşmesi tamamlandı: Senior Dev.", time: "2dk önce" },
    { id: 2, text: "Yeni mülakat talebi onay bekliyor.", time: "1sa önce" }
  ]);

  // --- BOOTSTRAP / VERİ ÇEKME ---
  const bootstrap = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      setMe(auth?.user);
      
      // Gerçek Veri Sorguları
      const { data: cData } = await supabase.from("profiles").select("*").eq("role", "coach");
      const { data: rData } = await supabase.from("corporate_session_requests")
        .select("*").eq("corporate_user_id", auth.user?.id)
        .order("created_at", { ascending: false });
      
      // Statik Veriler (İlan Portalı & Aday Skorları)
      const mockJobs = [
        { id: "j1", title: "Kıdemli Yazılım Mimarı", sector: "Teknoloji", applicants: 48, matchRate: 98, status: "Aktif", type: "Full-time", location: "İstanbul / Remote" },
        { id: "j2", title: "Yapay Zeka Mühendisi", sector: "Ar-Ge", applicants: 12, matchRate: 95, status: "Aktif", type: "Remote", location: "Global" },
        { id: "j3", title: "Ürün Tasarım Direktörü", sector: "Tasarım", applicants: 25, matchRate: 89, status: "İncelemede", type: "Hybrid", location: "Ankara" },
        { id: "j4", title: "HR Business Partner", sector: "İK", applicants: 60, matchRate: 92, status: "Aktif", type: "Full-time", location: "İstanbul" }
      ];

      setCoaches(cData?.map((c, i) => ({ ...c, rating: 5.0, sessions: 150 + i })) || []);
      setRequests(rData || []);
      setJobs(mockJobs);
    } catch (e) {
      toast.error("Sistem yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { bootstrap(); }, []);

  // --- AKSİYONLAR ---

  // ✅ Jitsi Video Konferans Başlatma
  const joinMeeting = useCallback((requestId: string) => {
    const roomName = `Kariyer-AI-Interview-${requestId}`;
    const url = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`;
    window.open(url, '_blank');
    toast.success("Mülakat Odası Açıldı", { description: "Jitsi altyapısı ile güvenli bağlantı sağlandı." });
  }, []);

  // ✅ Resend & AI Talep Oluşturma
  const handleCreateRequest = async (formData: any) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const { error } = await supabase.from("corporate_session_requests").insert([{
          corporate_user_id: me.id,
          coach_user_id: selectedCoach.id,
          coach_name: selectedCoach.full_name,
          goal: formData.goal,
          status: "pending"
        }]);

        if (error) throw error;

        // Resend Edge Function Çağrısı
        await supabase.functions.invoke('resend-email', {
          body: { to: selectedCoach.email, coachName: selectedCoach.full_name }
        });

        setModalOpen(false);
        bootstrap();
        resolve();
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(promise, {
      loading: 'AI Talebi İşleniyor...',
      success: 'İlan/Talebiniz oluşturuldu ve Koç bilgilendirildi!',
      error: 'İşlem başarısız oldu.',
    });
  };

  // --- RENDER ---
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-black tracking-widest animate-pulse">UNICORN ENGINE LOADING...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#E30613] selection:text-white">
      
      {/* 🚀 UNICORN HEADER */}
      <header className="bg-[#0f172a] text-white relative overflow-hidden pt-12 pb-44 px-8 border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E30613]/10 rounded-full blur-[150px] -mr-96 -mt-96" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center relative z-10 gap-10">
          
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 w-fit px-5 py-2 rounded-2xl backdrop-blur-xl">
              <BrainCircuit size={20} className="text-[#E30613]" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Enterprise Talent Cloud v4.0</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-tight mb-4">
              Yetenek Yönetiminde <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-red-400">Yapay Zeka</span> Çağı.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
              İlanlarınızı saniyeler içinde yayınlayın, adayları AI ile skorlayın ve Jitsi entegrasyonuyla mülakatlarınızı hemen başlatın.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => { setTab("jobs"); setModalOpen(true); }}
              className="bg-[#E30613] hover:bg-red-700 text-white rounded-[2rem] h-20 px-10 text-xl font-black shadow-[0_20px_50px_rgba(227,6,19,0.3)] transition-all hover:scale-105"
            >
              <PlusCircle className="mr-3 h-6 w-6" /> İLAN OLUŞTUR
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-[2rem] h-20 px-10 text-xl font-black backdrop-blur-md transition-all">
              <BarChart3 className="mr-3 h-6 w-6" /> ANALİTİK
            </Button>
          </div>
        </div>
      </header>

      {/* 📊 KPI DASHBOARD */}
      <section className="max-w-7xl mx-auto px-8 -mt-24 relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Aktif İlanlar", val: jobs.length, icon: Briefcase, color: "text-[#E30613]", bg: "bg-red-50" },
          { label: "Toplam Başvuru", val: "2,840", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "AI Match Skor Ort.", val: "%94", icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Planlanan Mülakat", val: requests.length, icon: CalendarCheck2, color: "text-purple-500", bg: "bg-purple-50" }
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-2xl rounded-[3rem] bg-white group hover:bg-[#0f172a] transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`${kpi.bg} p-5 rounded-[2rem] ${kpi.color} group-hover:bg-white/10 transition-all`}>
                  <kpi.icon size={28} />
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black italic">+12%</div>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-500">{kpi.label}</p>
              <p className="text-4xl font-black text-gray-900 tracking-tighter group-hover:text-white transition-colors">{kpi.val}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 🛠 NAVİGASYON & FİLTRELER */}
      <nav className="max-w-7xl mx-auto px-8 mt-16 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex bg-white p-2 rounded-[2.5rem] shadow-xl border border-gray-100 gap-2 w-full lg:w-auto overflow-x-auto">
          {[
            { id: "jobs", label: "İŞ PORTALI", icon: Rocket },
            { id: "find_coach", label: "KOÇ REHBERİ", icon: Users },
            { id: "requests", label: "MÜLAKATLAR", icon: Video }
          ].map((t) => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)} 
              className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] text-xs font-black transition-all ${tab === t.id ? "bg-[#E30613] text-white shadow-2xl scale-105" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E30613]" size={20} />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
            placeholder="İlan, aday veya anahtar kelime..."
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] border-none shadow-xl bg-white focus:ring-4 focus:ring-[#E30613]/5 font-bold text-gray-700"
          />
        </div>
      </nav>

      {/* 💻 ANA İÇERİK ALANI */}
      <main className="max-w-7xl mx-auto px-8 mt-12">
        <AnimatePresence mode="wait">
          
          {/* SEKMELER: İŞ PORTALI */}
          {tab === "jobs" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-50 flex flex-col lg:flex-row justify-between items-center group hover:border-[#E30613]/20 transition-all duration-500">
                  <div className="flex items-center gap-8">
                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl group-hover:bg-[#E30613] transition-colors">
                      <Rocket size={32} />
                    </div>
                    <div>
                      <div className="flex gap-2 mb-3">
                        <span className="bg-red-50 text-[#E30613] px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest">{job.sector}</span>
                        <span className="bg-gray-50 text-gray-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{job.type}</span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-400 font-bold flex items-center gap-2"><Globe size={16} /> {job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 mt-8 lg:mt-0">
                    <div className="text-right border-r pr-10 border-gray-100">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">AI MATCH SCORE</p>
                      <p className="text-5xl font-black text-gray-900 tracking-tighter">%{job.matchRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900">{job.applicants}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Adaylar</p>
                    </div>
                    <Button className="bg-[#0f172a] hover:bg-black text-white rounded-2xl h-16 px-8 font-black shadow-xl">
                      Adayları Analiz Et
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SEKMELER: MÜLAKATLAR (JITSI BURADA) */}
          {tab === "requests" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {requests.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] shadow-inner">
                  <Video size={64} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold">Henüz planlanmış bir mülakat bulunmuyor.</p>
                </div>
              )}
              {requests.map((req) => (
                <div key={req.id} className="bg-white p-10 rounded-[3rem] shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 border-l-8 border-[#E30613]">
                  <div className="flex items-center gap-8">
                    <div className="bg-indigo-50 p-6 rounded-[2rem] text-indigo-600"><Video size={32} /></div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 mb-1">{req.coach_name}</h4>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{req.goal}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-black text-indigo-600">
                        <Clock size={16} /> {new Date(req.created_at).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {/* ✅ AI SORU ÖNERİLERİ */}
                    <Button variant="outline" className="rounded-2xl border-2 border-gray-100 font-black text-gray-600 h-14 px-8 hover:bg-red-50 hover:text-[#E30613] transition-all">
                      <HelpCircle className="mr-2 h-5 w-5" /> AI Soru Önerileri
                    </Button>
                    {/* ✅ JITSI BUTONU */}
                    <Button 
                      onClick={() => joinMeeting(req.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black px-10 h-14 shadow-xl shadow-indigo-100 transition-all hover:scale-105"
                    >
                      <Video className="mr-2 h-5 w-5" /> Mülakata Katıl (Jitsi)
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SEKMELER: KOÇ REHBERİ */}
          {tab === "find_coach" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coaches.filter(c => c.full_name?.toLowerCase().includes(q.toLowerCase())).map((coach) => (
                <div key={coach.id} className="bg-white rounded-[4rem] p-10 border border-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#0f172a] text-[#E30613] px-10 py-3 rounded-bl-[2.5rem] text-[10px] font-black italic shadow-lg">
                    AI MATCH %{Math.floor(Math.random()*10)+90}
                  </div>
                  <div className="h-24 w-24 bg-gradient-to-tr from-[#E30613] to-red-400 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black mb-8 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3">
                    {coach.full_name?.[0]}
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{coach.full_name}</h3>
                  <div className="flex items-center gap-2 text-amber-500 font-black mb-6">
                    <Star size={18} fill="currentColor" /> {coach.rating} <span className="text-gray-400 text-xs ml-1">({coach.sessions}+ Seans)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {["Mülakat", "İK Strateji", "Liderlik"].map(tag => (
                      <span key={tag} className="bg-gray-50 text-gray-400 text-[9px] font-black px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest group-hover:bg-[#E30613]/5 group-hover:text-[#E30613] transition-colors">{tag}</span>
                    ))}
                  </div>
                  <Button 
                    onClick={() => { setSelectedCoach(coach); setModalOpen(true); }}
                    className="w-full bg-[#0f172a] hover:bg-black text-white rounded-2xl h-16 text-lg font-black shadow-2xl transition-all group-hover:translate-y-[-5px]"
                  >
                    İş Birliği Başlat <ChevronRight className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 🔮 MODAL: İLAN VE TALEP FORMU */}
      <JobForm 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        selectedCoach={selectedCoach} 
        onSubmit={handleCreateRequest} 
      />

      {/* FOOTER BİLGİSİ */}
      <footer className="max-w-7xl mx-auto px-8 mt-32 border-t border-gray-200 pt-10 text-center">
        <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
          <Building2 size={40} />
          <p className="text-[10px] font-black tracking-[0.5em] uppercase">Enterprise Talent Management System • 2024</p>
        </div>
      </footer>

    </div>
  );
}
