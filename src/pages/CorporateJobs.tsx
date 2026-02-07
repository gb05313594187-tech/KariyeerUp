// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Briefcase, Users, Sparkles, Brain, Calendar, Video, Send,
  Building2, MapPin, Clock, CheckCircle2, XCircle, Eye,
  ChevronDown, ChevronUp, Loader2, Star, Phone, Mail,
  AlertTriangle, TrendingUp, Zap, UserCheck, FileText,
  ExternalLink, X
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
  // enriched
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
  const room = `kariyeer-interview-${jobId.slice(0,8)}-${candidateId.slice(0,8)}-${ts}`;
  return `https://meet.jit.si/${room}`;
}
/* =========================================================
   INTERVIEW INVITE MODAL
   ========================================================= */
function InviteModal({ app, job, onClose, onSuccess }) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [questions, setQuestions] = useState([
    "Kendinizi ve kariyer hedefinizi tanıtın.",
    "Bu pozisyon için neden uygun olduğunuzu düşünüyorsunuz?",
    "En zorlandığınız projeyi anlatın.",
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
          "Bu pozisyonda karşılaşabileceğiniz en büyük zorluk ne olabilir?",
          "Takım içi çatışmaları nasıl yönetirsiniz?",
          "Son 2 yılda en çok geliştirdiğiniz teknik yetkinlik hangisi?",
          "5 yıl sonra kendinizi nerede görüyorsunuz?",
          "Uzaktan çalışma deneyiminiz hakkında bilgi verir misiniz?"
        ]);
        return;
      }
      const prompt = `Sen bir işe alım uzmanısın. Aşağıdaki iş ilanı ve aday profili için 5 adet mülakat sorusu oluştur.
İlan: ${job.position} (${job.level}) - ${job.description?.slice(0, 200)}
Aday Yetenekleri: ${app.candidate_skills?.join(", ") || "Bilinmiyor"}
Aday Hakkında: ${app.candidate_bio?.slice(0, 200) || "Bilinmiyor"}
Sadece JSON dizisi döndür: ["soru1", "soru2", "soru3", "soru4", "soru5"]`;
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 400 },
          }),
        }
      );
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) setQuestions(parsed);
      }
    } catch (e) {
      console.error("AI soru üretimi hatası:", e);
    } finally {
      setAiLoading(false);
    }
  };
  const handleSend = async () => {
    if (!scheduledAt) return;
    setLoading(true);
    try {
      const meetingLink = generateJitsiRoom(app.job_id, app.candidate_id);
      // 1) interviews tablosuna kaydet
      const { error: intErr } = await supabase.from("interviews").insert({
        job_id: app.job_id,
        candidate_id: app.candidate_id,
        meeting_link: meetingLink,
        interview_questions: questions,
        scheduled_at: new Date(scheduledAt).toISOString(),
        status: "pending",
      });
      if (intErr) throw intErr;
      // 2) job_applications durumunu güncelle
      await supabase.from("job_applications").update({ status: "interview" }).eq("id", app.id);
      // 3) Email gönder (Edge Function varsa)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/app_2dff6511da_send_email`;
        
        const emailHtml = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:linear-gradient(135deg,#dc2626,#ea580c);color:white;padding:30px;border-radius:10px 10px 0 0;text-align:center">
              <h1>🎯 Mülakat Davetiniz Var!</h1>
            </div>
            <div style="background:#f9fafb;padding:30px;border-radius:0 0 10px 10px">
              <p>Merhaba <strong>${app.candidate_name}</strong>,</p>
              <p><strong>${job.position}</strong> pozisyonu için mülakata davet edildiniz!</p>
              <div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:15px;margin:20px 0">
                <strong>Tarih:</strong> ${new Date(scheduledAt).toLocaleString("tr-TR")}<br>
                <strong>Görüşme Linki:</strong> <a href="${meetingLink}">${meetingLink}</a>
              </div>
              <a href="${meetingLink}" style="display:inline-block;background:#dc2626;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;margin:20px 0">Görüşmeye Katıl</a>
              <p>İyi günler dileriz,<br><strong>Kariyeer Ekibi</strong></p>
            </div>
          </div>`;
        await fetch(EDGE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            to: app.candidate_email,
            subject: `🎯 ${job.position} - Mülakat Davetiniz`,
            html: emailHtml,
            type: "interview_invite",
          }),
        });
      } catch (emailErr) {
        console.warn("Email gönderilemedi (Edge Function olmayabilir):", emailErr);
      }
      onSuccess(meetingLink);
      onClose();
    } catch (e) {
      console.error("Davet hatası:", e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-white flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tight">Mülakat Daveti</h2>
            <p className="text-slate-400 text-xs mt-1">{app.candidate_name} → {job.position}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Tarih */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={12} /> Mülakat Tarihi & Saati
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {/* Sorular */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Brain size={12} /> Mülakat Soruları
              </label>
              <button
                onClick={generateAIQuestions}
                disabled={aiLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI ile Üret
              </button>
            </div>
            {questions.map((q, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[9px] font-black text-slate-300 mt-3 w-5 shrink-0">{i + 1}.</span>
                <input
                  value={q}
                  onChange={e => {
                    const arr = [...questions];
                    arr[i] = e.target.value;
                    setQuestions(arr);
                  }}
                  className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-red-500"
                />
                <button onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-600 mt-2 cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                value={newQ}
                onChange={e => setNewQ(e.target.value)}
                placeholder="Yeni soru ekle..."
                onKeyDown={e => {
                  if (e.key === "Enter" && newQ.trim()) {
                    setQuestions([...questions, newQ.trim()]);
                    setNewQ("");
                  }
                }}
                className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          {/* Aday Bilgi */}
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aday Bilgileri</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-400">Ad:</span> <strong>{app.candidate_name}</strong></div>
              <div><span className="text-slate-400">Email:</span> <strong>{app.candidate_email}</strong></div>
              <div><span className="text-slate-400">Şehir:</span> <strong>{app.candidate_city || "-"}</strong></div>
              <div><span className="text-slate-400">AI Skoru:</span> <strong className="text-red-600">{app.ai_score ?? "-"}</strong></div>
            </div>
            {app.candidate_skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {app.candidate_skills.map((s, i) => (
                  <span key={i} className="bg-white text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="p-6 border-t flex gap-3 shrink-0">
          <button onClick={onClose}
            className="px-6 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-200 bg-white cursor-pointer">
            Vazgeç
          </button>
          <button onClick={handleSend} disabled={loading || !scheduledAt}
            className="flex-1 bg-red-600 hover:bg-red-700 h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            {loading ? "GÖNDERİLİYOR..." : "DAVET GÖNDER"}
          </button>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   MAIN COMPONENT
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
  // ─── Bootstrap ───
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) { setLoading(false); return; }
        setMe(user);
        // Şirketin ilanlarını çek
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", user.id)
          .order("apply_deadline", { ascending: false });
        setJobs(jobsData || []);
        // Tüm ilanlar için tüm başvuruları çek (eğer hiç ilan yoksa herhangi bir ilan)
        // İlk ilanı otomatik seç
        if (jobsData?.length > 0) {
          setSelectedJob(jobsData[0]);
          await fetchApplications(jobsData[0].post_id);
        }
      } catch (e) {
        console.error("Init error:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  // ─── Başvuruları çek + enrich ───
  const fetchApplications = async (jobId) => {
    setAppsLoading(true);
    setApplications([]);
    try {
      const { data: apps, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_id", jobId)
        .order("applied_at", { ascending: false });
      if (error) throw error;
      if (!apps || apps.length === 0) {
        setAppsLoading(false);
        return;
      }
      // Aday profillerini çek
      const candidateIds = apps.map(a => a.candidate_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, city, avatar_url, bio, cv_data")
        .in("id", candidateIds);
      // AI eşleşme skorlarını çek
      const { data: matchScores } = await supabase
        .from("job_candidate_matches")
        .select("candidate_id, fit_score, explanation")
        .eq("job_id", jobId)
        .in("candidate_id", candidateIds);
      // Enrich
      const enriched = apps.map(app => {
        const profile = profiles?.find(p => p.id === app.candidate_id) || {};
        const matchData = matchScores?.find(m => m.candidate_id === app.candidate_id);
        const cv = profile.cv_data || {};
        return {
          ...app,
          candidate_name: profile.full_name || "Aday",
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
    } catch (e) {
      console.error("Applications fetch error:", e);
      toast("Başvurular yüklenemedi", "error");
    } finally {
      setAppsLoading(false);
    }
  };
  // ─── İlan seç ───
  const selectJob = (job) => {
    setSelectedJob(job);
    fetchApplications(job.post_id);
  };
  // ─── Durum güncelle ───
  const updateStatus = async (appId, status) => {
    const { error } = await supabase.from("job_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", appId);
    if (error) {
      toast("Güncelleme hatası", "error");
    } else {
      toast(status === "accepted" ? "Aday kabul edildi! 🎉" : status === "rejected" ? "Aday reddedildi" : "Durum güncellendi");
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    }
  };
  // ─── Stats ───
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === "pending").length;
    const interview = applications.filter(a => a.status === "interview").length;
    const accepted = applications.filter(a => a.status === "accepted").length;
    const avgScore = applications.filter(a => a.ai_score).reduce((sum, a) => sum + a.ai_score, 0) / Math.max(applications.filter(a => a.ai_score).length, 1);
    return { total, pending, interview, accepted, avgScore: Math.round(avgScore) };
  }, [applications]);
  const statusLabel = (s) => {
    const map = { pending: "Bekliyor", reviewing: "İnceleniyor", interview: "Mülakat", accepted: "Kabul", rejected: "Red" };
    return map[s] || s;
  };
  const statusColor = (s) => {
    const map = {
      pending: "bg-amber-100 text-amber-700",
      reviewing: "bg-blue-100 text-blue-700",
      interview: "bg-purple-100 text-purple-700",
      accepted: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
    };
    return map[s] || "bg-slate-100 text-slate-700";
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <ToastContainer />
      {inviteTarget && selectedJob && (
        <InviteModal
          app={inviteTarget}
          job={selectedJob}
          onClose={() => setInviteTarget(null)}
          onSuccess={(link) => {
            toast("Mülakat daveti gönderildi! 🎯");
            fetchApplications(selectedJob.post_id);
          }}
        />
      )}
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-50 rounded-2xl">
              <Sparkles className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic uppercase">
                Hiring <span className="text-red-600">Suite</span>
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                AI Destekli İşe Alım • Jitsi Mülakat • Akıllı Eşleşme
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI */}
        {selectedJob && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Toplam Başvuru", value: stats.total, icon: Users, color: "text-blue-600" },
              { label: "Bekleyen", value: stats.pending, icon: Clock, color: "text-amber-600" },
              { label: "Mülakat", value: stats.interview, icon: Video, color: "text-purple-600" },
              { label: "Kabul Edilen", value: stats.accepted, icon: UserCheck, color: "text-emerald-600" },
              { label: "Ort. AI Skoru", value: stats.avgScore || "-", icon: Brain, color: "text-red-600" },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon size={16} className={kpi.color} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                </div>
                <p className="text-2xl font-black text-slate-800">{kpi.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-12 gap-8">
          {/* SOL — İlan Listesi */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-black text-sm flex items-center gap-2">
                  <Briefcase size={16} className="text-red-600" /> İlanlarım
                </h3>
              </div>
              <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                {jobs.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-8 font-bold">Henüz ilan yok</p>
                ) : (
                  jobs.map(job => (
                    <button
                      key={job.post_id}
                      onClick={() => selectJob(job)}
                      className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
                        selectedJob?.post_id === job.post_id
                          ? "bg-red-50 border-2 border-red-200"
                          : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                      }`}
                    >
                      <p className="font-black text-sm text-slate-800 truncate">{job.position}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{job.level}</span>
                        <span className="text-[8px] font-bold text-slate-400">•</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{job.work_type}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* SAĞ — Başvurular */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {!selectedJob ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="font-black text-slate-400 uppercase tracking-wider text-sm">Bir ilan seçin</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Seçili İlan Bilgisi */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-black text-slate-800 mb-2">{selectedJob.position}</h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: MapPin, text: selectedJob.location_text },
                      { icon: Clock, text: selectedJob.experience_range },
                      { icon: Briefcase, text: selectedJob.work_type },
                    ].filter(x => x.text).map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-lg flex items-center gap-1 uppercase">
                        <tag.icon size={12} /> {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Başvurular */}
                {appsLoading ? (
                  <div className="text-center py-16">
                    <Loader2 size={32} className="animate-spin text-red-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Başvurular yükleniyor...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="font-black text-slate-400 uppercase tracking-wider text-sm">Henüz başvuru yok</p>
                  </div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                            <img
                              src={app.candidate_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_name)}&size=128&background=f43f5e&color=fff&bold=true`}
                              className="w-full h-full object-cover"
                              alt=""
                              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_name)}&size=128&background=f43f5e&color=fff&bold=true`; }}
                            />
                          </div>
                          {/* Bilgiler */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-black text-lg text-slate-800">{app.candidate_name}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                  {app.candidate_email && (
                                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                      <Mail size={11} /> {app.candidate_email}
                                    </span>
                                  )}
                                  {app.candidate_city && (
                                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                      <MapPin size={11} /> {app.candidate_city}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* AI Score Badge */}
                              <div className="flex items-center gap-2 shrink-0">
                                {app.ai_score !== null && (
                                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${
                                    app.ai_score >= 70 ? "bg-emerald-500" : app.ai_score >= 40 ? "bg-amber-500" : "bg-red-500"
                                  }`}>
                                    <span className="text-white font-black text-lg leading-none">{app.ai_score}</span>
                                    <span className="text-white/80 text-[7px] font-bold uppercase">AI</span>
                                  </div>
                                )}
                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg ${statusColor(app.status)}`}>
                                  {statusLabel(app.status)}
                                </span>
                              </div>
                            </div>
                            {/* Skills */}
                            {app.candidate_skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {app.candidate_skills.slice(0, 8).map((s, i) => (
                                  <span key={i} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">{s}</span>
                                ))}
                                {app.candidate_skills.length > 8 && (
                                  <span className="text-slate-400 text-[9px] font-bold">+{app.candidate_skills.length - 8}</span>
                                )}
                              </div>
                            )}
                            {/* Cover Note */}
                            {app.cover_note && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ön Yazı</p>
                                <p className="text-xs text-slate-600 italic">"{app.cover_note}"</p>
                              </div>
                            )}
                            {/* AI Explanation */}
                            {app.ai_explanation && (
                              <div className="mt-2 p-3 bg-amber-50 rounded-xl">
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                  <Brain size={10} /> AI Analizi
                                </p>
                                <p className="text-xs text-amber-800 italic">"{app.ai_explanation.replace(/^\[(STANDARD|BOOST)\]\s*/i, "")}"</p>
                              </div>
                            )}
                            {/* Tarih */}
                            <p className="text-[9px] text-slate-300 font-bold mt-3 uppercase tracking-widest">
                              Başvuru: {new Date(app.applied_at).toLocaleString("tr-TR")}
                            </p>
                            {/* Aksiyonlar */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {app.status === "pending" && (
                                <>
                                  <button onClick={() => updateStatus(app.id, "reviewing")}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer">
                                    <Eye size={13} /> İncele
                                  </button>
                                  <button onClick={() => updateStatus(app.id, "rejected")}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer">
                                    <XCircle size={13} /> Reddet
                                  </button>
                                </>
                              )}
                              {(app.status === "pending" || app.status === "reviewing") && (
                                <button onClick={() => setInviteTarget(app)}
                                  className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer">
                                  <Video size={13} /> Mülakata Davet Et
                                </button>
                              )}
                              {app.status === "interview" && (
                                <button onClick={() => updateStatus(app.id, "accepted")}
                                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer">
                                  <UserCheck size={13} /> İşe Al
                                </button>
                              )}
                              {app.status === "interview" && (
                                <button onClick={() => updateStatus(app.id, "rejected")}
                                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer">
                                  <XCircle size={13} /> Reddet
                                </button>
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
    </div>
  );
}
