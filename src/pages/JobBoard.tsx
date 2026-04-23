// src/pages/JobBoard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Briefcase,
  MapPin,
  Building2,
  Rocket,
  TrendingUp,
  CheckCircle2,
  X,
  Clock,
  DollarSign,
  Search,
  Filter,
  Sparkles,
  Send,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  ShieldAlert
} from "lucide-react";

/* =========================================================
   GÜNCELLENMİŞ ÇEVİRİ SİSTEMİ (Mentorluk & Gelişim Odaklı)
   ========================================================= */
const JOB_TRANSLATIONS = {
  tr: {
    headerTitle1: "Kariyer",
    headerTitle2: "Gelişim Paneli",
    headerSubtitle: "Sektörel vaka analizleri ve mentorluk fırsatlarını keşfet",
    searchPlaceholder: "Uzmanlık alanı veya vaka ara...",
    searchButton: "Ara",
    filters: "Filtreler",
    workType: "Çalışma Modeli",
    level: "Deneyim Seviyesi",
    activeJobs: "Aktif Fırsat",
    all: "Tümü",
    detail: "Detayları Gör",
    close: "Kapat",
    boost: "Öne Çıkar",
    apply: "Mentorluk Al / Başvur",
    applied: "Talep İletildi",
    expired: "Arşivlendi",
    jobDescription: "Program / Vaka Detayları",
    levelLabel: "Seviye",
    workTypeLabel: "Model",
    experienceLabel: "Beklenen Deneyim",
    locationLabel: "Lokasyon",
    salaryRange: "Tahmini Ücret Skalası",
    salaryFrom: " taban",
    salaryUpTo: " tavan",
    deadlineExpired: "Süre doldu",
    lastDay: "Son gün!",
    daysLeft: " gün kaldı",
    loadingJobs: "Yükleniyor...",
    noFilterMatch: "Eşleşen kayıt bulunamadı",
    noActiveJobs: "Aktif program yok",
    tryDifferentKeywords: "Farklı anahtar kelimeler deneyin.",
    newJobsSoon: "Yeni vaka analizleri yakında eklenecek.",
    applyToJob: "Mentorluk & Başvuru Talebi",
    coverNoteLabel: "Mentor Notu (Özgeçmiş Özeti)",
    coverNotePlaceholder: "Bu alandaki yetkinliklerinizi ve mentorluk beklentinizi belirtin...",
    coverNoteWarning: "Bu bir işe yerleştirme hizmeti değildir. Bilgileriniz, ilgili mentor/şirket uzmanına gelişim analizi için iletilir.",
    cancel: "Vazgeç",
    sending: "İLETİLİYOR...",
    applyButton: "TALEBİ GÖNDER",
    premiumBoost: "VİTRİN DESTEĞİ",
    boostBenefit1: "Profil görünürlüğü artar",
    boostBenefit2: "Mentor önceliği",
    boostBenefit3: "30 gün üst sıra",
    amount: "Tutar",
    processing: "İşleniyor...",
    upgradeNow: "Yükselt",
    applicationSuccess: "Talebiniz başarıyla iletildi! 🎉",
    alreadyApplied: "Bu programa zaten başvurdunuz.",
    applicationError: "Hata: ",
    unknownError: "Bilinmeyen hata",
    loginRequired: "Talep göndermek için giriş yapmalısınız.",
    premiumBoostActive: "Boost aktif edildi! 🚀",
  },
  en: {
    headerTitle1: "Career",
    headerTitle2: "Growth Hub",
    headerSubtitle: "Discover sectoral case studies and mentoring opportunities",
    searchPlaceholder: "Search expertise or case...",
    searchButton: "Search",
    filters: "Filters",
    workType: "Work Model",
    level: "Experience Level",
    activeJobs: "Active Opps",
    all: "All",
    detail: "View Detail",
    close: "Close",
    boost: "Boost",
    apply: "Get Mentoring / Apply",
    applied: "Request Sent",
    expired: "Archived",
    jobDescription: "Program / Case Details",
    levelLabel: "Level",
    workTypeLabel: "Model",
    experienceLabel: "Expected Exp",
    locationLabel: "Location",
    salaryRange: "Estimated Scale",
    salaryFrom: " min",
    salaryUpTo: " max",
    deadlineExpired: "Expired",
    lastDay: "Last day!",
    daysLeft: " days left",
    loadingJobs: "Loading...",
    noFilterMatch: "No matching results",
    noActiveJobs: "No active programs",
    tryDifferentKeywords: "Try different keywords.",
    newJobsSoon: "New case studies soon.",
    applyToJob: "Mentoring & App Request",
    coverNoteLabel: "Mentoring Note",
    coverNotePlaceholder: "Explain your competencies and expectations...",
    coverNoteWarning: "This is not a recruitment service. Your info is shared for developmental analysis purposes.",
    cancel: "Cancel",
    sending: "SENDING...",
    applyButton: "SEND REQUEST",
    premiumBoost: "SHOWCASE BOOST",
    boostBenefit1: "Increased visibility",
    boostBenefit2: "Mentor priority",
    boostBenefit3: "Top rank for 30 days",
    amount: "Amount",
    processing: "Processing...",
    upgradeNow: "Upgrade Now",
    applicationSuccess: "Request sent successfully! 🎉",
    alreadyApplied: "You have already applied.",
    applicationError: "Error: ",
    unknownError: "Unknown error",
    loginRequired: "Please login to send request.",
    premiumBoostActive: "Boost activated! 🚀",
  }
};

/* =========================================================
   TOAST SİSTEMİ
   ========================================================= */
let toastIdCounter = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-[slideIn_0.3s_ease-out] ${
            t.type === "success"
              ? "bg-emerald-600 text-white"
              : t.type === "warning"
              ? "bg-amber-500 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {t.type === "success" ? <CheckCircle2 size={16} /> : t.type === "warning" ? <AlertTriangle size={16} /> : <X size={16} />}
          {t.message}
        </div>
      ))}
    </div>
  );
  return { show, ToastContainer };
}

/* =========================================================
   PREMIUM BOOST MODAL
   ========================================================= */
function PremiumBoostModal({ job, onClose, onSuccess, jt }) {
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const { error } = await supabase.rpc("boost_post_to_premium", {
          target_post_id: job.post_id,
        });
        if (!error) {
          onSuccess();
          onClose();
        }
      } catch { /* ignore */ }
      setLoading(false);
    }, 2000);
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-6 text-center border-t-8 border-orange-500">
        <Rocket size={60} className="mx-auto text-orange-500" />
        <h2 className="text-3xl font-black italic">{jt.premiumBoost}</h2>
        <div className="space-y-3 text-left">
          <div className="flex gap-3 font-bold text-gray-600">
            <CheckCircle2 className="text-green-500 shrink-0" /> {jt.boostBenefit1}
          </div>
          <div className="flex gap-3 font-bold text-gray-600">
            <CheckCircle2 className="text-green-500 shrink-0" /> {jt.boostBenefit2}
          </div>
          <div className="flex gap-3 font-bold text-gray-600">
            <CheckCircle2 className="text-green-500 shrink-0" /> {jt.boostBenefit3}
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-3xl flex justify-between items-center border border-gray-100">
          <span className="font-bold text-gray-400">{jt.amount}</span>
          <span className="text-3xl font-black text-gray-900">₺499</span>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-black text-white h-16 rounded-2xl font-black text-lg disabled:opacity-60 cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-xl"
        >
          {loading ? <><Loader2 size={20} className="animate-spin" /> {jt.processing}</> : jt.upgradeNow}
        </button>
        <button onClick={onClose} className="text-gray-400 font-bold text-sm cursor-pointer hover:text-gray-600">
          {jt.cancel}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   BAŞVURU MODALI
   ========================================================= */
function ApplyModal({ job, onClose, onSuccess, userId, jt }) {
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);
  const handleApply = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: job.post_id,
        candidate_id: userId,
        cover_note: coverNote.trim(),
        status: "pending",
      });
      if (error) {
        if (error.code === "23505") { onSuccess("already"); }
        else { throw error; }
      } else { onSuccess("success"); }
      onClose();
    } catch (err) {
      console.error("Hata:", err);
      onSuccess("error", err.message);
    } finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight">{jt.applyToJob}</h2>
              <p className="text-slate-400 text-xs mt-1">{job.position}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert size={20} className="text-orange-500 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-800 font-bold leading-relaxed">{jt.coverNoteWarning}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{jt.coverNoteLabel}</label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder={jt.coverNotePlaceholder}
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>
        <div className="px-8 pb-8 flex gap-3">
          <button onClick={onClose} className="px-6 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
            {jt.cancel}
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl active:scale-[0.98] transition-all tracking-widest disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? <><Loader2 size={20} className="animate-spin" /> {jt.sending}</> : <><Send size={20} /> {jt.applyButton}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const WORK_TYPE_OPTIONS = ["Remote", "Hybrid", "On-site"];
const LEVEL_OPTIONS = ["Junior", "Mid", "Senior", "Executive"];

export default function JobBoard() {
  const { language } = useLanguage();
  const jt = JOB_TRANSLATIONS[language] || JOB_TRANSLATIONS.tr;
  const WORK_TYPE_FILTERS = [jt.all, ...WORK_TYPE_OPTIONS];
  const LEVEL_FILTERS = [jt.all, ...LEVEL_OPTIONS];
  
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState(jt.all);
  const [levelFilter, setLevelFilter] = useState(jt.all);
  const [selectedJobForBoost, setSelectedJobForBoost] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const { show: toast, ToastContainer } = useToast();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (isSupabaseConfigured) {
        const { data: sessionData } = await supabase.auth.getSession();
        const u = sessionData?.session?.user || null;
        setUser(u);
        const { data: jobsData } = await supabase.from("jobs").select("*").order("apply_deadline", { ascending: false });
        setJobs(jobsData || []);
        if (u) {
          const { data: apps } = await supabase.from("job_applications").select("job_id").eq("candidate_id", u.id);
          if (apps) { setAppliedJobs(new Set(apps.map((a) => a.job_id))); }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setActiveSearch(searchQuery.trim()); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredJobs = jobs.filter((job) => {
    const needle = activeSearch.toLowerCase();
    if (needle) {
      const haystack = `${job.position || ""} ${job.description || ""} ${job.location_text || ""} ${job.custom_title || ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (workTypeFilter !== jt.all) {
      if (!(job.work_type || "").toLowerCase().includes(workTypeFilter.toLowerCase())) return false;
    }
    if (levelFilter !== jt.all) {
      if (!(job.level || "").toLowerCase().includes(levelFilter.toLowerCase())) return false;
    }
    return true;
  });

  const handleApplyResult = (result, errorMsg) => {
    if (result === "success") {
      toast(jt.applicationSuccess, "success");
      if (selectedJobForApply) setAppliedJobs((prev) => new Set([...prev, selectedJobForApply.post_id]));
    } else if (result === "already") {
      toast(jt.alreadyApplied, "warning");
      if (selectedJobForApply) setAppliedJobs((prev) => new Set([...prev, selectedJobForApply.post_id]));
    } else {
      toast(jt.applicationError + (errorMsg || jt.unknownError), "error");
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: jt.deadlineExpired, urgent: true };
    if (diff === 0) return { text: jt.lastDay, urgent: true };
    return { text: `${diff}${jt.daysLeft}`, urgent: diff <= 3 };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <ToastContainer />
      {selectedJobForBoost && <PremiumBoostModal job={selectedJobForBoost} jt={jt} onClose={() => setSelectedJobForBoost(null)} onSuccess={() => toast(jt.premiumBoostActive, "success")} />}
      {selectedJobForApply && <ApplyModal job={selectedJobForApply} userId={user?.id} jt={jt} onClose={() => setSelectedJobForApply(null)} onSuccess={handleApplyResult} />}

      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Gelişim Odaklı Mentorluk Sistemi
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            {jt.headerTitle1} <span className="text-orange-600 italic">{jt.headerTitle2}</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg">{jt.headerSubtitle}</p>
          <div className="mt-8 relative max-w-xl flex gap-2">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={jt.searchPlaceholder} className="w-full pl-14 pr-6 h-14 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-600 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-6 space-y-6">
            <h3 className="font-black text-sm flex items-center gap-2 text-slate-800"><Filter size={18} className="text-orange-600" /> {jt.filters}</h3>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{jt.workType}</label>
              <div className="space-y-1.5">{WORK_TYPE_FILTERS.map((wt) => (
                <button key={wt} onClick={() => setWorkTypeFilter(wt)} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${workTypeFilter === wt ? "bg-orange-600 text-white shadow-lg shadow-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>{wt}</button>
              ))}</div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{jt.level}</label>
              <div className="space-y-1.5">{LEVEL_FILTERS.map((lv) => (
                <button key={lv} onClick={() => setLevelFilter(lv)} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${levelFilter === lv ? "bg-orange-600 text-white shadow-lg shadow-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>{lv}</button>
              ))}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-5">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-black text-slate-400 text-sm uppercase tracking-widest">{jt.loadingJobs}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
              <Briefcase size={64} className="mx-auto text-slate-200 mb-4" />
              <h3 className="font-black text-slate-400 text-lg uppercase tracking-wider mb-2">{jt.noFilterMatch}</h3>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isExpanded = expandedJob === job.post_id;
              const hasApplied = appliedJobs.has(job.post_id);
              const deadlineInfo = formatDeadline(job.apply_deadline);
              const expired = new Date(job.apply_deadline) < new Date();
              return (
                <div key={job.post_id} className={`bg-white rounded-3xl border-2 transition-all ${hasApplied ? "border-emerald-200 bg-emerald-50/20" : "border-white hover:border-orange-100 hover:shadow-xl"}`}>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100"><Building2 className="text-slate-300" size={28} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">{job.custom_title || job.position}</h2>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-lg flex items-center gap-1"><MapPin size={12} /> {job.location_text}</span>
                              <span className="text-[10px] font-black uppercase bg-orange-50 text-orange-600 px-3 py-1 rounded-lg flex items-center gap-1"><GraduationCap size={12} /> {job.level}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                           <button onClick={() => setExpandedJob(isExpanded ? null : job.post_id)} className="text-[10px] font-black uppercase text-slate-400 hover:text-orange-600 flex items-center gap-1">{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {jt.detail}</button>
                           <div className="flex gap-2">
                             {hasApplied ? (
                               <span className="bg-emerald-100 text-emerald-700 px-6 h-11 rounded-xl text-xs font-black uppercase flex items-center gap-1.5"><CheckCircle2 size={14} /> {jt.applied}</span>
                             ) : expired ? (
                               <span className="bg-slate-100 text-slate-400 px-6 h-11 rounded-xl text-xs font-black uppercase flex items-center gap-1.5">{jt.expired}</span>
                             ) : (
                               <button onClick={() => setSelectedJobForApply(job)} className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-11 rounded-xl text-xs font-black uppercase italic tracking-widest shadow-lg shadow-orange-100 transition-all active:scale-95">{jt.apply}</button>
                             )}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-8 pb-8 border-t border-slate-50 pt-6">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{jt.jobDescription}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* YASAL ALT NOT */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="bg-slate-200/50 p-6 rounded-2xl text-center">
          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
            Kariyeer.com bir Özel İstihdam Bürosu değildir. Bu sayfa sektörel vaka analizleri, gelişim programları ve bağımsız mentorluk duyuruları için teknolojik altyapı sağlamaktadır. Kariyeer, taraflar arasındaki istihdam ilişkisine taraf olmaz ve garanti vermez.
          </p>
        </div>
      </div>
    </div>
  );
}
