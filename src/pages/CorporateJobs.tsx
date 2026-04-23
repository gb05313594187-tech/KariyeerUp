// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Briefcase, Users, Sparkles, Brain, Calendar, Video, Send,
  Building2, MapPin, Clock, CheckCircle2, XCircle, Eye,
  ChevronDown, ChevronUp, Loader2, Star, Phone, Mail,
  AlertTriangle, TrendingUp, Zap, UserCheck, FileText,
  ExternalLink, X, ShieldCheck
} from "lucide-react";

/* =========================================================
   TYPES
   ========================================================= */
type Job = {
  post_id: string;
  company_id: string;
  position: string;
  level: string;
  work_type: string;
  location_text: string;
  description: string;
  experience_range: string;
  salary_min: number;
  salary_max: number;
  apply_deadline: string;
};

type Application = {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  cover_note: string;
  applied_at: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  candidate_city: string;
  candidate_avatar: string;
  candidate_bio: string;
  candidate_skills: string[];
  ai_score: number | null;
  ai_explanation: string;
};

/* =========================================================
   TOAST
   ========================================================= */
let tid = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = "success") => {
    const id = ++tid;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  const TC = () => (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-[slideIn_0.3s_ease-out] ${
          t.type === "success" ? "bg-emerald-600 text-white" : t.type === "warning" ? "bg-amber-500 text-white" : "bg-red-600 text-white"
        }`}>
          {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
  return { show, TC };
}

/* =========================================================
   JITSI HELPERS
   ========================================================= */
function generateJitsiRoom(jobId, candidateId) {
  const ts = Date.now();
  const room = `kariyeer-session-${jobId.slice(0,8)}-${candidateId.slice(0,8)}-${ts}`;
  return `https://meet.jit.si/${room}`;
}

/* =========================================================
   MENTORLUK SEANSI DAVET MODALI (InviteModal)
   ========================================================= */
function InviteModal({ app, job, onClose, onSuccess }) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [questions, setQuestions] = useState([
    "Kendinizi ve gelişim hedeflerinizi tanıtın.",
    "Bu vaka/program için neden gelişim desteği almak istiyorsunuz?",
    "En çok geliştirmek istediğiniz yetkinliğiniz nedir?",
  ]);
  const [newQ, setNewQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const generateAIQuestions = async () => {
    setAiLoading(true);
    try {
      const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_KEY) {
        setQuestions([
          "Bu gelişim alanında karşılaşabileceğiniz en büyük zorluk nedir?",
          "Mentorluktan temel beklentiniz nedir?",
          "Son dönemde üzerinde çalıştığınız teknik becerileriniz nelerdir?"
        ]);
        return;
      }
      const prompt = `Sen bir kariyer mentorusun. Aşağıdaki gelişim programı ve katılımcı profili için 5 adet gelişim odaklı görüşme sorusu oluştur.
      Program: ${job.position}. Katılımcı Yetenekleri: ${app.candidate_skills?.join(", ")}. 
      Sadece JSON döndür: ["soru1", "soru2", "soru3", "soru4", "soru5"]`;
      
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5, maxOutputTokens: 400 } }),
      });
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) setQuestions(parsed);
      }
    } catch (e) { console.error("AI hatası:", e); } finally { setAiLoading(false); }
  };

  const handleSend = async () => {
    if (!scheduledAt) return;
    setLoading(true);
    try {
      const meetingLink = generateJitsiRoom(app.job_id, app.candidate_id);
      const { error: intErr } = await supabase.from("interviews").insert({
        job_id: app.job_id,
        candidate_id: app.candidate_id,
        meeting_link: meetingLink,
        interview_questions: questions,
        scheduled_at: new Date(scheduledAt).toISOString(),
        status: "pending",
      });
      if (intErr) throw intErr;
      await supabase.from("job_applications").update({ status: "interview" }).eq("id", app.id);
      
      onSuccess(meetingLink);
      onClose();
    } catch (e) { console.error("Hata:", e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tight">Gelişim Seansı Planla</h2>
            <p className="text-slate-400 text-xs mt-1">{app.candidate_name} → {job.position}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-[11px] text-orange-800 font-bold">
            Bu görüşme bir işe alım mülakatı değildir. Katılımcının gelişimini desteklemek ve vaka değerlendirmesi yapmak amacıyla planlanmaktadır.
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> Seans Tarihi & Saati</label>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Brain size={12} /> Gelişim Odaklı Sorular</label>
              <button onClick={generateAIQuestions} disabled={aiLoading} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer">{aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI ile Üret</button>
            </div>
            {questions.map((q, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[9px] font-black text-slate-300 mt-3 w-5 shrink-0">{i + 1}.</span>
                <input value={q} onChange={e => { const arr = [...questions]; arr[i] = e.target.value; setQuestions(arr); }} className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-orange-500" />
                <button onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 mt-2 cursor-pointer"><X size={14} /></button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Yeni gelişim sorusu ekle..." onKeyDown={e => { if (e.key === "Enter" && newQ.trim()) { setQuestions([...questions, newQ.trim()]); setNewQ(""); } }} className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 shrink-0">
          <button onClick={onClose} className="px-6 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-200 bg-white cursor-pointer">Vazgeç</button>
          <button onClick={handleSend} disabled={loading || !scheduledAt} className="flex-1 bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />} {loading ? "İLETİLİYOR..." : "DAVET GÖNDER"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ANA BİLEŞEN (689 Satır Mantığını Koruyan Tam Yapı)
   ========================================================= */
export default function CorporateJobs() {
  const [me, setMe] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [inviteTarget, setInviteTarget] = useState(null);
  const { show: toast, TC: ToastContainer } = useToast();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) { setLoading(false); return; }
        setMe(user);
        const { data: jobsData } = await supabase.from("jobs").select("*").eq("company_id", user.id).order("apply_deadline", { ascending: false });
        setJobs(jobsData || []);
        if (jobsData?.length > 0) { setSelectedJob(jobsData[0]); fetchApplications(jobsData[0].post_id); }
      }
      setLoading(false);
    };
    init();
  }, []);

  const fetchApplications = async (jobId) => {
    setAppsLoading(true);
    setApplications([]);
    try {
      const { data: apps, error } = await supabase.from("job_applications").select("*").eq("job_id", jobId).order("applied_at", { ascending: false });
      if (error) throw error;
      if (!apps || apps.length === 0) { setAppsLoading(false); return; }
      const candidateIds = apps.map(a => a.candidate_id);
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone, city, avatar_url, bio, cv_data").in("id", candidateIds);
      const { data: matchScores } = await supabase.from("job_candidate_matches").select("candidate_id, fit_score, explanation").eq("job_id", jobId).in("candidate_id", candidateIds);

      const enriched = apps.map(app => {
        const profile = profiles?.find(p => p.id === app.candidate_id) || {};
        const matchData = matchScores?.find(m => m.candidate_id === app.candidate_id);
        const cv = profile.cv_data || {};
        return {
          ...app,
          candidate_name: profile.full_name || "Katılımcı",
          candidate_email: profile.email || "",
          candidate_phone: profile.phone || "",
          candidate_city: profile.city || "",
          candidate_avatar: profile.avatar_url || "",
          candidate_bio: profile.bio || cv.about || "",
          candidate_skills: cv.skills || [],
          ai_score: matchData ? Number(matchData.fit_score) : null,
          ai_explanation: matchData?.explanation || "",
        };
      });
      setApplications(enriched);
    } catch (e) { console.error(e); toast("Veriler yüklenemedi", "error"); } finally { setAppsLoading(false); }
  };

  const selectJob = (job) => { setSelectedJob(job); fetchApplications(job.post_id); };

  const updateStatus = async (appId, status) => {
    const { error } = await supabase.from("job_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", appId);
    if (error) { toast("Hata oluştu", "error"); } 
    else {
      toast(status === "accepted" ? "Gelişim Süreci Tamamlandı! 🎉" : "Durum Güncellendi");
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    }
  };

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === "pending").length;
    const interview = applications.filter(a => a.status === "interview").length;
    const accepted = applications.filter(a => a.status === "accepted").length;
    const avgScore = applications.filter(a => a.ai_score).reduce((sum, a) => sum + a.ai_score, 0) / Math.max(applications.filter(a => a.ai_score).length, 1);
    return { total, pending, interview, accepted, avgScore: Math.round(avgScore) };
  }, [applications]);

  const statusLabel = (s) => ({ pending: "Bekliyor", reviewing: "İnceleniyor", interview: "Gelişim Seansı", accepted: "Tamamlandı", rejected: "Ek Gelişim" }[s] || s);
  const statusColor = (s) => ({ pending: "bg-amber-100 text-amber-700", reviewing: "bg-blue-100 text-blue-700", interview: "bg-purple-100 text-purple-700", accepted: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700" }[s] || "bg-slate-100 text-slate-700");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <ToastContainer />
      {inviteTarget && selectedJob && <InviteModal app={inviteTarget} job={selectedJob} onClose={() => setInviteTarget(null)} onSuccess={() => { toast("Görüşme daveti iletildi! 🎯"); fetchApplications(selectedJob.post_id); }} />}

      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-2xl"><ShieldCheck className="h-6 w-6 text-orange-600" /></div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Assessment <span className="text-orange-600">Suite</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gelişim Takip ve Değerlendirme Paneli</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {selectedJob && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Toplam Katılımcı", value: stats.total, icon: Users, color: "text-blue-600" },
              { label: "İncelenmeyi Bekleyen", value: stats.pending, icon: Clock, color: "text-amber-600" },
              { label: "Gelişim Seansı", value: stats.interview, icon: Video, color: "text-purple-600" },
              { label: "Başarılı Tamamlayan", value: stats.accepted, icon: UserCheck, color: "text-emerald-600" },
              { label: "Ort. Gelişim Skoru", value: stats.avgScore || "-", icon: Brain, color: "text-orange-600" },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2"><kpi.icon size={16} className={kpi.color} /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span></div>
                <p className="text-2xl font-black text-slate-800">{kpi.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          {/* SOL — Program Listesi */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-6">
              <div className="p-5 border-b border-slate-100"><h3 className="font-black text-sm flex items-center gap-2"><Briefcase size={16} className="text-orange-600" /> Programlarım</h3></div>
              <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                {jobs.map(job => (
                  <button key={job.post_id} onClick={() => selectJob(job)} className={`w-full text-left p-4 rounded-xl transition-all ${selectedJob?.post_id === job.post_id ? "bg-orange-50 border-2 border-orange-200" : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"}`}>
                    <p className="font-black text-sm text-slate-800 truncate">{job.position}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{job.level} • {job.work_type}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ — Katılımcılar */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {!selectedJob ? (
               <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100"><p className="font-black text-slate-400 uppercase text-sm">Bir gelişim programı seçin</p></div>
            ) : (
              <div className="space-y-4">
                {appsLoading ? (
                  <div className="text-center py-16"><Loader2 size={32} className="animate-spin text-orange-500 mx-auto" /></div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <img src={app.candidate_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_name)}&background=random`} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-black text-lg text-slate-800">{app.candidate_name}</h3>
                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Mail size={11} /> {app.candidate_email} • <MapPin size={11} /> {app.candidate_city}</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                {app.ai_score !== null && <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white ${app.ai_score >= 70 ? "bg-emerald-500" : "bg-orange-500"}`}>{app.ai_score}</div>}
                                <span className={`text-[9px] font-black uppercase px-3 py-2 rounded-lg ${statusColor(app.status)}`}>{statusLabel(app.status)}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">{app.candidate_skills.map((s, i) => <span key={i} className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase">{s}</span>)}</div>
                            {app.cover_note && <div className="mt-3 p-3 bg-slate-50 rounded-xl italic text-xs text-slate-600">"{app.cover_note}"</div>}
                            <div className="flex gap-2 mt-4">
                               {app.status === "pending" && (
                                 <><button onClick={() => updateStatus(app.id, "reviewing")} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"><Eye size={13} /> İncele</button>
                                   <button onClick={() => updateStatus(app.id, "rejected")} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"><XCircle size={13} /> Reddet</button>
                                 </>
                               )}
                               {(app.status === "pending" || app.status === "reviewing") && (
                                 <button onClick={() => setInviteTarget(app)} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"><Video size={13} /> Seans Planla</button>
                               )}
                               {app.status === "interview" && (
                                 <button onClick={() => updateStatus(app.id, "accepted")} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"><UserCheck size={13} /> Süreci Tamamla</button>
                               )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* FOOTER YASAL NOT */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-200 p-6 rounded-3xl text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">
            BU PANEL KURUMSAL GELİŞİM PROGRAMLARI VE MENTORLUK TAKİBİ İÇİN TASARLANMIŞTIR. 
            KARİYEER.COM BİR ÖZEL İSTİHDAM BÜROSU DEĞİLDİR. SİSTEM ÜZERİNDEKİ VERİLER İSTİHDAM GARANTİSİ VERMEZ.
          </p>
        </div>
      </div>
    </div>
  );
}
