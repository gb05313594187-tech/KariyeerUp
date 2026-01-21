// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users, Briefcase, CalendarCheck2, TrendingUp, Search,
  PlusCircle, Sparkles, ArrowRight, CheckCircle2, Clock,
  Trophy, Target, Zap, ChevronRight, Video, Mail, HelpCircle, 
  MessageSquare, Star, ShieldCheck, Globe, Filter, BrainCircuit, Rocket, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JobForm from "@/components/JobForm";

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("find_coach"); // find_coach | requests | jobs | analytics
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  
  // Önemli Veri Grupları
  const [coaches, setCoaches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [jobs, setJobs] = useState([]); 
  const [me, setMe] = useState(null);

  useEffect(() => { bootstrap(); }, []);

  const bootstrap = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      setMe(auth?.user);
      
      // Veritabanı sorguları (Sadeleştirme yapılmadı)
      const { data: cData } = await supabase.from("profiles").select("*").eq("role", "coach");
      const { data: rData } = await supabase.from("corporate_session_requests")
        .select("*").eq("corporate_user_id", auth.user?.id).order("created_at", { ascending: false });
      
      // İlan Portalı Verileri
      const mockJobs = [
        { id: "j1", title: "Kıdemli Yazılım Mimarı", sector: "Teknoloji", applicants: 42, matchRate: 98, status: "Aktif", deadline: "12.02.2024" },
        { id: "j2", title: "Pazarlama Direktörü", sector: "Hizmet", applicants: 15, matchRate: 85, status: "Aktif", deadline: "15.02.2024" }
      ];

      setCoaches(cData?.map((c, i) => ({ ...c, ...fullCoachMeta(i) })) || []);
      setRequests(rData || []);
      setJobs(mockJobs);
    } catch (e) {
      toast.error("Sistem yüklenirken bir veri hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ JITSI VIDEO ENTEGRASYONU (Dün eklenen yapı)
  const joinMeeting = (requestId: string) => {
    const roomName = `Kariyer-Pro-Session-${requestId}`;
    window.open(`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`, '_blank');
    toast.info("Video konferans odasına yönlendiriliyorsunuz...");
  };

  // ✅ RESEND & AI FORM SUBMIT (Dün eklenen yapı)
  const handleCreateRequest = async (formData: any) => {
    try {
      const { error } = await supabase.from("corporate_session_requests").insert([{
        corporate_user_id: me.id,
        coach_user_id: selectedCoach.id,
        coach_name: selectedCoach.full_name,
        goal: formData.goal,
        notes: formData.notes,
        status: "new"
      }]);

      if (error) throw error;

      // Resend Edge Function Tetikleyici
      await supabase.functions.invoke('resend-email', {
        body: { to: selectedCoach.email, subject: "Yeni Mentorluk Talebi", coachName: selectedCoach.full_name }
      });

      toast.success("Talebiniz koça başarıyla iletildi!");
      setModalOpen(false);
      bootstrap();
    } catch (e) {
      toast.error("İşlem başarısız: " + e.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans selection:bg-[#E30613] selection:text-white">
      {/* HEADER: Kariyer.com Red & Dark Unicorn Theme */}
      <div className="bg-gradient-to-br from-[#E30613] via-[#b90510] to-[#0f172a] text-white pb-40 pt-16 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-48 -mt-48 blur-[100px] animate-pulse" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-5 py-2 rounded-2xl backdrop-blur-xl border border-white/20">
                <BrainCircuit size={20} className="text-red-300" />
                <span className="text-xs font-black tracking-[0.3em] uppercase">AI Talent Management v2.0</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">
                Doğru Yeteneği <br/><span className="text-red-400">Veriyle Keşfedin.</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl font-medium leading-relaxed">
                İş ilanlarınızı yayınlayın, koçlarla mülakat simülasyonları düzenleyin ve adaylarınızın AI uyumluluk skorlarını anlık takip edin.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-3">
              <Button onClick={() => setTab("jobs")} className="bg-white text-[#E30613] hover:bg-red-50 rounded-[2rem] h-20 px-12 text-xl font-black shadow-[0_20px_50px_rgba(227,6,19,0.3)] transition-all">
                <Rocket className="mr-3 h-6 w-6" /> Yeni İlan Oluştur
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* KPI STATS: Floating Unicorn Cards */}
      <div className="max-w-7xl mx-auto px-10 -mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-20">
        {[
          { label: "Partner Koçlar", val: coaches.length, icon: Users, color: "bg-blue-600", trend: "+4 bu hafta" },
          { label: "Aktif İlanlar", val: jobs.length, icon: Briefcase, color: "bg-[#E30613]", trend: "124 aday" },
          { label: "AI Mülakatlar", val: "2,450", icon: BrainCircuit, color: "bg-purple-600", trend: "%98 başarı" },
          { label: "Ort. Eşleşme", val: "%89", icon: Target, color: "bg-emerald-600", trend: "Yüksek verim" }
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-2xl rounded-[3rem] overflow-hidden group hover:translate-y-[-10px] transition-all duration-500 bg-white/80 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`${kpi.color} p-5 rounded-[2rem] text-white shadow-xl`}><kpi.icon size={28} /></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.trend}</span>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-4xl font-black text-gray-900 tracking-tighter">{kpi.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-10 mt-16">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-white shadow-xl">
          <div className="flex p-2 bg-gray-100/50 rounded-[2rem] w-full md:w-auto gap-2">
            {[
              { id: "find_coach", label: "KOÇ HAVUZU", icon: Search },
              { id: "requests", label: "MÜLAKAT TALEPLERİ", icon: CalendarCheck2 },
              { id: "jobs", label: "İŞ PORTALI & ADAYLAR", icon: Rocket }
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-3 px-10 py-5 rounded-[1.5rem] text-xs font-black transition-all duration-300 ${tab === t.id ? "bg-[#E30613] text-white shadow-2xl scale-105" : "text-gray-500 hover:bg-white"}`}>
                <t.icon size={20} /> {t.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E30613] transition-colors" size={20} />
            <input 
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Pozisyon, yetenek veya isim ile ara..."
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border-none shadow-inner focus:ring-4 focus:ring-[#E30613]/5 font-bold text-gray-700"
            />
          </div>
        </div>
      </div>
      {/* MAIN CONTENT: UNICORN PORTAL */}
      <div className="max-w-7xl mx-auto px-10 mt-12">
        <AnimatePresence mode="wait">
          {tab === "jobs" ? (
            /* İŞ PORTALI - SEKTÖR VE ADAY DETAYLARI */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 gap-8">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-xl flex flex-col md:flex-row justify-between items-center group hover:border-[#E30613]/30 transition-all duration-500">
                  <div className="flex items-center gap-8">
                    <div className="bg-red-50 p-8 rounded-[2.5rem] text-[#E30613] group-hover:bg-[#E30613] group-hover:text-white transition-all duration-500 shadow-lg">
                      <Rocket size={40} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">İLAN AKTİF</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{job.sector} SEKTÖRÜ</span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Users size={18} className="text-red-500" /> {job.applicants} Aday Başvurdu</div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Clock size={18} className="text-red-500" /> Son Gün: {job.deadline}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 mt-8 md:mt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#E30613] uppercase tracking-[0.2em] mb-1">AI UYUMLULUK SKORU</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter">%{job.matchRate}</p>
                    </div>
                    <Button className="bg-[#0f172a] hover:bg-black text-white rounded-[1.5rem] px-10 h-16 text-lg font-black shadow-2xl transition-all hover:scale-105">
                      Adayları Filtrele
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : tab === "requests" ? (
            /* TALEPLER - JITSI & AI ÖNERİ SORULARI DURUYOR */
            <div className="space-y-6">
              {requests.map((req) => (
                <Card key={req.id} className="rounded-[3rem] border-none shadow-2xl hover:shadow-red-100/50 transition-all overflow-hidden bg-white group">
                  <CardContent className="p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <div className="bg-gray-100 p-6 rounded-[2rem] text-gray-800"><CalendarCheck2 size={32} /></div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 mb-1">{req.coach_name}</h4>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{req.goal}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg w-fit">
                          <Clock size={12} /> {new Date(req.created_at).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {/* ✅ Dün Eklenen AI Mülakat Soruları */}
                      <Button variant="outline" className="rounded-2xl border-2 border-gray-100 font-black text-gray-600 h-14 px-6 hover:bg-gray-50">
                        <HelpCircle className="mr-2 h-5 w-5 text-red-500" /> Örnek Mülakat Soruları
                      </Button>
                      {/* ✅ Dün Eklenen Jitsi Butonu */}
                      <Button onClick={() => joinMeeting(req.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black px-10 h-14 shadow-xl shadow-indigo-200 transition-all hover:scale-105">
                        <Video className="mr-2 h-5 w-5" /> Görüşmeyi Başlat (Jitsi)
                      </Button>
                      <div className="bg-[#E30613] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-red-100">{req.status}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* KOÇ HAVUZU - UNICORN CARD DESIGN */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {coaches.filter(c => c.full_name?.toLowerCase().includes(q.toLowerCase())).map((coach) => (
                <div key={coach.id} className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.07)] transition-all duration-500 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#E30613] text-white px-8 py-3 rounded-bl-[2rem] text-[10px] font-black flex items-center gap-2">
                    <Sparkles size={14} /> AI MATCH %{Math.floor(Math.random()*20)+80}
                  </div>
                  
                  <div className="flex items-center gap-5 mb-8">
                    <div className="h-20 w-20 rounded-[2rem] bg-[#0f172a] text-white flex items-center justify-center text-3xl font-black shadow-xl group-hover:rotate-6 transition-transform">
                      {coach.full_name?.[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{coach.full_name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                        <Star size={16} fill="currentColor" /> 5.0 <span className="text-gray-400 font-bold ml-1">(120+ Seans)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm font-bold leading-relaxed mb-8 line-clamp-3 min-h-[4.5rem] uppercase tracking-tighter">
                    {coach.headline || "Kariyer ve Yetenek Yönetimi Uzmanı"}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {["Mülakat", "İK", "Liderlik", "Kariyer"].map(s => (
                      <span key={s} className="bg-gray-50 text-gray-400 text-[9px] font-black px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest group-hover:bg-[#E30613]/5 group-hover:text-[#E30613] transition-colors">{s}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-dashed border-gray-100">
                    <div className="text-3xl font-black text-gray-900 tracking-tighter">
                      {coach.price_try || "3.500"} TL 
                      <span className="text-[10px] text-gray-400 font-black block tracking-widest">PER SESSION</span>
                    </div>
                    <Button onClick={() => { setSelectedCoach(coach); setModalOpen(true); }} className="bg-[#E30613] hover:bg-black rounded-2xl h-16 px-8 font-black shadow-2xl shadow-red-100 transition-all hover:translate-x-2">
                      İş Birliği <ChevronRight size={20} className="ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <JobForm isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedCoach={selectedCoach} onSubmit={handleCreateRequest} />
    </div>
  );
}

// MOCK DATA HELPER (Veri yapısını korur)
function fullCoachMeta(idx: number) {
  return { seniority: "Expert Mentor", rating: 4.9 + (idx * 0.01) };
}
