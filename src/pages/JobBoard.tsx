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
} from "lucide-react";
/* =========================================================
   ÇOK DİLLİ ÇEVİRİ SİSTEMİ (TR / EN / AR / FR)
   ========================================================= */
const JOB_TRANSLATIONS = {
  tr: {
    // Header
    headerTitle1: "Kariyerini",
    headerTitle2: "Yeniden Tanımla",
    headerSubtitle: "AI motoru ile en uygun ilanları keşfet ve hemen başvur",
    searchPlaceholder: "Pozisyon, şirket veya lokasyon ara...",
    searchButton: "Ara",
    // Filters
    filters: "Filtreler",
    workType: "Çalışma Tipi",
    level: "Seviye",
    activeJobs: "Aktif İlan",
    all: "Tümü",
    // Job Card
    detail: "Detay",
    close: "Kapat",
    boost: "Boost",
    apply: "Başvur",
    applied: "Başvuruldu",
    expired: "Süre Doldu",
    jobDescription: "İlan Açıklaması",
    levelLabel: "Seviye",
    workTypeLabel: "Çalışma Tipi",
    experienceLabel: "Deneyim",
    locationLabel: "Lokasyon",
    salaryRange: "Maaş Aralığı",
    salaryFrom: "'den başlayan",
    salaryUpTo: "'ye kadar",
    // Deadline
    deadlineExpired: "Süre doldu",
    lastDay: "Son gün!",
    daysLeft: " gün kaldı",
    // Loading & Empty
    loadingJobs: "İlanlar Yükleniyor...",
    noFilterMatch: "Filtrelerle eşleşen ilan bulunamadı",
    noActiveJobs: "Aktif ilan yok",
    tryDifferentKeywords: "Farklı anahtar kelimeler deneyin.",
    newJobsSoon: "Yeni ilanlar yakında eklenecek.",
    // Apply Modal
    applyToJob: "İlana Başvur",
    coverNoteLabel: "Ön Yazı (Opsiyonel)",
    coverNotePlaceholder: "Neden bu pozisyon için uygun olduğunuzu kısaca açıklayın...",
    coverNoteWarning: "Başvurunuz profilinizdeki bilgilerle (yetenekler, deneyim, eğitim) birlikte iletilecektir. Profilinizi güncel tutmayı unutmayın.",
    cancel: "Vazgeç",
    sending: "GÖNDERİLİYOR...",
    applyButton: "BAŞVUR",
    // Premium Boost Modal
    premiumBoost: "PREMIUM BOOST",
    boostBenefit1: "AI Skoru %500 artar",
    boostBenefit2: "Sponsorlu Rozet",
    boostBenefit3: "30 gün üst sıralarda",
    amount: "Tutar",
    processing: "İşleniyor...",
    upgradeNow: "Şimdi Yükselt",
    // Toast messages
    applicationSuccess: "Başvurunuz başarıyla gönderildi! 🎉",
    alreadyApplied: "Bu ilana zaten başvurdunuz.",
    applicationError: "Başvuru hatası: ",
    unknownError: "Bilinmeyen hata",
    loginRequired: "Başvuru yapabilmek için giriş yapmalısınız.",
    premiumBoostActive: "Premium Boost aktif! 🚀",
  },
  en: {
    headerTitle1: "Redefine",
    headerTitle2: "Your Career",
    headerSubtitle: "Discover the most suitable jobs with AI engine and apply now",
    searchPlaceholder: "Search position, company or location...",
    searchButton: "Search",
    filters: "Filters",
    workType: "Work Type",
    level: "Level",
    activeJobs: "Active Jobs",
    all: "All",
    detail: "Detail",
    close: "Close",
    boost: "Boost",
    apply: "Apply",
    applied: "Applied",
    expired: "Expired",
    jobDescription: "Job Description",
    levelLabel: "Level",
    workTypeLabel: "Work Type",
    experienceLabel: "Experience",
    locationLabel: "Location",
    salaryRange: "Salary Range",
    salaryFrom: " starting",
    salaryUpTo: " max",
    deadlineExpired: "Expired",
    lastDay: "Last day!",
    daysLeft: " days left",
    loadingJobs: "Loading Jobs...",
    noFilterMatch: "No jobs found matching filters",
    noActiveJobs: "No active jobs",
    tryDifferentKeywords: "Try different keywords.",
    newJobsSoon: "New jobs will be added soon.",
    applyToJob: "Apply to Job",
    coverNoteLabel: "Cover Note (Optional)",
    coverNotePlaceholder: "Briefly explain why you are suitable for this position...",
    coverNoteWarning: "Your application will be submitted along with your profile information (skills, experience, education). Make sure to keep your profile up to date.",
    cancel: "Cancel",
    sending: "SENDING...",
    applyButton: "APPLY",
    premiumBoost: "PREMIUM BOOST",
    boostBenefit1: "AI Score increases by 500%",
    boostBenefit2: "Sponsored Badge",
    boostBenefit3: "Top ranked for 30 days",
    amount: "Amount",
    processing: "Processing...",
    upgradeNow: "Upgrade Now",
    applicationSuccess: "Your application has been sent successfully! 🎉",
    alreadyApplied: "You have already applied to this job.",
    applicationError: "Application error: ",
    unknownError: "Unknown error",
    loginRequired: "You must log in to apply.",
    premiumBoostActive: "Premium Boost activated! 🚀",
  },
  ar: {
    headerTitle1: "أعد تعريف",
    headerTitle2: "مسيرتك المهنية",
    headerSubtitle: "اكتشف الوظائف الأنسب بمحرك الذكاء الاصطناعي وقدّم الآن",
    searchPlaceholder: "ابحث عن منصب، شركة أو موقع...",
    searchButton: "بحث",
    filters: "الفلاتر",
    workType: "نوع العمل",
    level: "المستوى",
    activeJobs: "وظائف نشطة",
    all: "الكل",
    detail: "تفاصيل",
    close: "إغلاق",
    boost: "تعزيز",
    apply: "تقديم",
    applied: "تم التقديم",
    expired: "منتهي",
    jobDescription: "وصف الوظيفة",
    levelLabel: "المستوى",
    workTypeLabel: "نوع العمل",
    experienceLabel: "الخبرة",
    locationLabel: "الموقع",
    salaryRange: "نطاق الراتب",
    salaryFrom: " كحد أدنى",
    salaryUpTo: " كحد أقصى",
    deadlineExpired: "انتهت المهلة",
    lastDay: "!آخر يوم",
    daysLeft: " يوم متبقي",
    loadingJobs: "...جارٍ تحميل الوظائف",
    noFilterMatch: "لم يتم العثور على وظائف تطابق الفلاتر",
    noActiveJobs: "لا توجد وظائف نشطة",
    tryDifferentKeywords: "جرّب كلمات مفتاحية مختلفة.",
    newJobsSoon: "سيتم إضافة وظائف جديدة قريباً.",
    applyToJob: "التقدم للوظيفة",
    coverNoteLabel: "رسالة تقديمية (اختياري)",
    coverNotePlaceholder: "اشرح بإيجاز لماذا أنت مناسب لهذا المنصب...",
    coverNoteWarning: "سيتم إرسال طلبك مع معلومات ملفك الشخصي (المهارات، الخبرة، التعليم). تأكد من تحديث ملفك الشخصي.",
    cancel: "إلغاء",
    sending: "...جارٍ الإرسال",
    applyButton: "تقديم",
    premiumBoost: "تعزيز بريميوم",
    boostBenefit1: "يزيد نقاط AI بنسبة 500%",
    boostBenefit2: "شارة مُموَّلة",
    boostBenefit3: "في أعلى الترتيب لمدة 30 يوماً",
    amount: "المبلغ",
    processing: "...جارٍ المعالجة",
    upgradeNow: "ترقية الآن",
    applicationSuccess: "🎉 !تم إرسال طلبك بنجاح",
    alreadyApplied: "لقد تقدمت بالفعل لهذه الوظيفة.",
    applicationError: "خطأ في التقديم: ",
    unknownError: "خطأ غير معروف",
    loginRequired: "يجب تسجيل الدخول للتقديم.",
    premiumBoostActive: "🚀 !تم تفعيل التعزيز البريميوم",
  },
  fr: {
    headerTitle1: "Redéfinissez",
    headerTitle2: "Votre Carrière",
    headerSubtitle: "Découvrez les offres les plus adaptées grâce à l'IA et postulez maintenant",
    searchPlaceholder: "Rechercher un poste, une entreprise ou un lieu...",
    searchButton: "Rechercher",
    filters: "Filtres",
    workType: "Type de travail",
    level: "Niveau",
    activeJobs: "Offres actives",
    all: "Tous",
    detail: "Détail",
    close: "Fermer",
    boost: "Boost",
    apply: "Postuler",
    applied: "Postulé",
    expired: "Expiré",
    jobDescription: "Description du poste",
    levelLabel: "Niveau",
    workTypeLabel: "Type de travail",
    experienceLabel: "Expérience",
    locationLabel: "Localisation",
    salaryRange: "Fourchette salariale",
    salaryFrom: " minimum",
    salaryUpTo: " maximum",
    deadlineExpired: "Expiré",
    lastDay: "Dernier jour !",
    daysLeft: " jours restants",
    loadingJobs: "Chargement des offres...",
    noFilterMatch: "Aucune offre ne correspond aux filtres",
    noActiveJobs: "Aucune offre active",
    tryDifferentKeywords: "Essayez d'autres mots-clés.",
    newJobsSoon: "De nouvelles offres seront bientôt ajoutées.",
    applyToJob: "Postuler à l'offre",
    coverNoteLabel: "Lettre de motivation (Optionnel)",
    coverNotePlaceholder: "Expliquez brièvement pourquoi vous êtes adapté(e) à ce poste...",
    coverNoteWarning: "Votre candidature sera envoyée avec les informations de votre profil (compétences, expérience, formation). N'oubliez pas de tenir votre profil à jour.",
    cancel: "Annuler",
    sending: "ENVOI EN COURS...",
    applyButton: "POSTULER",
    premiumBoost: "PREMIUM BOOST",
    boostBenefit1: "Score IA augmenté de 500%",
    boostBenefit2: "Badge sponsorisé",
    boostBenefit3: "En tête de liste pendant 30 jours",
    amount: "Montant",
    processing: "Traitement...",
    upgradeNow: "Mettre à niveau",
    applicationSuccess: "Votre candidature a été envoyée avec succès ! 🎉",
    alreadyApplied: "Vous avez déjà postulé à cette offre.",
    applicationError: "Erreur de candidature : ",
    unknownError: "Erreur inconnue",
    loginRequired: "Vous devez être connecté(e) pour postuler.",
    premiumBoostActive: "Premium Boost activé ! 🚀",
  },
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
          {t.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : t.type === "warning" ? (
            <AlertTriangle size={16} />
          ) : (
            <X size={16} />
          )}
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
      } catch {
        // ignore
      }
      setLoading(false);
    }, 2000);
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-6 text-center">
        <Rocket size={60} className="mx-auto text-[#E63946]" />
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
        <div className="bg-gray-50 p-6 rounded-3xl flex justify-between items-center">
          <span className="font-bold text-gray-400">{jt.amount}</span>
          <span className="text-3xl font-black">₺499</span>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-black text-white h-16 rounded-2xl font-black text-lg disabled:opacity-60 cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> {jt.processing}
            </>
          ) : (
            jt.upgradeNow
          )}
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 font-bold text-sm cursor-pointer hover:text-gray-600 transition-colors"
        >
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
        if (error.code === "23505") {
          onSuccess("already");
        } else {
          throw error;
        }
      } else {
        onSuccess("success");
      }
      onClose();
    } catch (err) {
      console.error("Başvuru hatası:", err);
      onSuccess("error", err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                {jt.applyToJob}
              </h2>
              <p className="text-slate-400 text-xs mt-1">{job.position}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {/* İlan Özeti */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-wrap gap-3">
            {job.level && (
              <span className="text-[10px] font-black uppercase bg-white px-3 py-1 rounded-lg text-slate-500 flex items-center gap-1">
                <GraduationCap size={12} /> {job.level}
              </span>
            )}
            {job.work_type && (
              <span className="text-[10px] font-black uppercase bg-white px-3 py-1 rounded-lg text-slate-500 flex items-center gap-1">
                <Briefcase size={12} /> {job.work_type}
              </span>
            )}
            {job.location_text && (
              <span className="text-[10px] font-black uppercase bg-white px-3 py-1 rounded-lg text-slate-500 flex items-center gap-1">
                <MapPin size={12} /> {job.location_text}
              </span>
            )}
            {job.experience_range && (
              <span className="text-[10px] font-black uppercase bg-white px-3 py-1 rounded-lg text-slate-500 flex items-center gap-1">
                <Clock size={12} /> {job.experience_range}
              </span>
            )}
          </div>
        </div>
        {/* Form */}
        <div className="px-8 py-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {jt.coverNoteLabel}
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder={jt.coverNotePlaceholder}
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-bold">
              {jt.coverNoteWarning}
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={onClose}
            className="px-6 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            {jt.cancel}
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 bg-[#E63946] hover:bg-[#d32f3d] h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl active:scale-[0.98] transition-all tracking-widest disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> {jt.sending}
              </>
            ) : (
              <>
                <Send size={20} /> {jt.applyButton}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   FİLTRE SEÇENEKLERİ
   ========================================================= */
const WORK_TYPE_OPTIONS = ["Remote", "Hybrid", "On-site"];
const LEVEL_OPTIONS = ["Junior", "Mid", "Senior", "Executive"];
/* =========================================================
   ANA KOMPONENT — JOB BOARD
   ========================================================= */
export default function JobBoard() {
  // ─── DİL DESTEĞİ ───
  const { language } = useLanguage();
  const jt = JOB_TRANSLATIONS[language] || JOB_TRANSLATIONS.tr;
  const WORK_TYPE_FILTERS = [jt.all, ...WORK_TYPE_OPTIONS];
  const LEVEL_FILTERS = [jt.all, ...LEVEL_OPTIONS];
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState(jt.all);
  const [levelFilter, setLevelFilter] = useState(jt.all);
  // Modals
  const [selectedJobForBoost, setSelectedJobForBoost] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const { show: toast, ToastContainer } = useToast();
  // Reset filters when language changes so "All" text stays in sync
  useEffect(() => {
    setWorkTypeFilter(jt.all);
    setLevelFilter(jt.all);
  }, [language, jt.all]);
  /* ----- Auth & Data ----- */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Auth
        if (isSupabaseConfigured) {
          const { data: sessionData } = await supabase.auth.getSession();
          const u = sessionData?.session?.user || null;
          setUser(u);
          // Jobs — jobs tablosundan çek
          const { data: jobsData, error: jobsErr } = await supabase
            .from("jobs")
            .select("*")
            .order("apply_deadline", { ascending: false });
          if (jobsErr) {
            console.error("Jobs fetch error:", jobsErr);
          } else {
            setJobs(jobsData || []);
          }
          // Kullanıcının mevcut başvurularını çek
          if (u) {
            const { data: apps } = await supabase
              .from("job_applications")
              .select("job_id")
              .eq("candidate_id", u.id);
            if (apps) {
              setAppliedJobs(new Set(apps.map((a) => a.job_id)));
            }
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  /* ----- Search Handler ----- */
  const handleSearch = () => {
    setActiveSearch(searchQuery.trim());
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  // Also update activeSearch reactively as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  /* ----- Filtered Jobs ----- */
  const filteredJobs = jobs.filter((job) => {
    const needle = activeSearch.toLowerCase();
    if (needle) {
      const haystack = `${job.position || ""} ${job.description || ""} ${job.location_text || ""} ${job.custom_title || ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (workTypeFilter !== jt.all) {
      const wt = (job.work_type || "").toLowerCase();
      if (!wt.includes(workTypeFilter.toLowerCase())) return false;
    }
    if (levelFilter !== jt.all) {
      const lv = (job.level || "").toLowerCase();
      if (!lv.includes(levelFilter.toLowerCase())) return false;
    }
    return true;
  });
  /* ----- Başvuru Sonucu ----- */
  const handleApplyResult = (result, errorMsg) => {
    if (result === "success") {
      toast(jt.applicationSuccess, "success");
      // Applied jobs set'ine ekle
      if (selectedJobForApply) {
        setAppliedJobs((prev) => new Set([...prev, selectedJobForApply.post_id]));
      }
    } else if (result === "already") {
      toast(jt.alreadyApplied, "warning");
      if (selectedJobForApply) {
        setAppliedJobs((prev) => new Set([...prev, selectedJobForApply.post_id]));
      }
    } else {
      toast(jt.applicationError + (errorMsg || jt.unknownError), "error");
    }
  };
  /* ----- Başvur Butonu Handler ----- */
  const handleApplyClick = (job) => {
    if (!user) {
      toast(jt.loginRequired, "warning");
      return;
    }
    if (appliedJobs.has(job.post_id)) {
      toast(jt.alreadyApplied, "warning");
      return;
    }
    setSelectedJobForApply(job);
  };
  /* ----- Deadline Kontrolü ----- */
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };
  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: jt.deadlineExpired, urgent: true };
    if (diff === 0) return { text: jt.lastDay, urgent: true };
    if (diff <= 3) return { text: `${diff}${jt.daysLeft}`, urgent: true };
    if (diff <= 7) return { text: `${diff}${jt.daysLeft}`, urgent: false };
    const locale = language === "ar" ? "ar-SA" : language === "fr" ? "fr-FR" : language === "en" ? "en-US" : "tr-TR";
    return { text: d.toLocaleDateString(locale), urgent: false };
  };
  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <ToastContainer />
      {/* Modals */}
      {selectedJobForBoost && (
        <PremiumBoostModal
          job={selectedJobForBoost}
          jt={jt}
          onClose={() => setSelectedJobForBoost(null)}
          onSuccess={() => {
            toast(jt.premiumBoostActive, "success");
          }}
        />
      )}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          userId={user?.id}
          jt={jt}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={handleApplyResult}
        />
      )}
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            {jt.headerTitle1}{" "}
            <span className="text-[#E63946] italic">{jt.headerTitle2}</span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg italic">
            {jt.headerSubtitle}
          </p>
          {/* Arama */}
          <div className="mt-8 relative max-w-xl flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={jt.searchPlaceholder}
                className="w-full pl-14 pr-6 h-14 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-[#E63946] transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#E63946] hover:bg-[#d32f3d] text-white font-black px-6 h-14 rounded-2xl text-sm uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-100 shrink-0"
            >
              <Search size={18} />
              {jt.searchButton}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-12 gap-10">
        {/* SOL — FİLTRELER */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-6 space-y-6">
            <h3 className="font-black text-sm flex items-center gap-2 text-slate-800">
              <Filter size={18} className="text-[#E63946]" /> {jt.filters}
            </h3>
            {/* Çalışma Tipi */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {jt.workType}
              </label>
              <div className="space-y-1.5">
                {WORK_TYPE_FILTERS.map((wt) => (
                  <button
                    key={wt}
                    onClick={() => setWorkTypeFilter(wt)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      workTypeFilter === wt
                        ? "bg-[#E63946] text-white shadow-lg shadow-red-100"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {wt}
                  </button>
                ))}
              </div>
            </div>
            {/* Seviye */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {jt.level}
              </label>
              <div className="space-y-1.5">
                {LEVEL_FILTERS.map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setLevelFilter(lv)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      levelFilter === lv
                        ? "bg-[#E63946] text-white shadow-lg shadow-red-100"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>
            {/* İstatistik */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-800">{filteredJobs.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {jt.activeJobs}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* SAĞ — İLAN LİSTESİ */}
        <div className="lg:col-span-9 space-y-5">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-black text-slate-400 text-sm uppercase tracking-widest animate-pulse">
                {jt.loadingJobs}
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
              <Briefcase size={64} className="mx-auto text-slate-200 mb-4" />
              <h3 className="font-black text-slate-400 text-lg uppercase tracking-wider mb-2">
                {activeSearch || workTypeFilter !== jt.all || levelFilter !== jt.all
                  ? jt.noFilterMatch
                  : jt.noActiveJobs}
              </h3>
              <p className="text-slate-400 text-sm">
                {activeSearch ? jt.tryDifferentKeywords : jt.newJobsSoon}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isExpanded = expandedJob === job.post_id;
              const hasApplied = appliedJobs.has(job.post_id);
              const deadlineInfo = formatDeadline(job.apply_deadline);
              const expired = isDeadlinePassed(job.apply_deadline);
              return (
                <div
                  key={job.post_id}
                  className={`bg-white rounded-3xl shadow-sm border-2 overflow-hidden transition-all duration-300 ${
                    hasApplied
                      ? "border-emerald-200 bg-emerald-50/30"
                      : expired
                      ? "border-slate-200 opacity-60"
                      : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  {/* İlan Ana Bilgi */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-5">
                      {/* Company Icon */}
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                        <Building2 className="text-slate-300" size={28} />
                      </div>
                      {/* İlan Detayları */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 leading-tight">
                              {job.custom_title || job.position}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.level && (
                                <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-3 py-1 rounded-lg flex items-center gap-1">
                                  <GraduationCap size={12} /> {job.level}
                                </span>
                              )}
                              {job.work_type && (
                                <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-lg flex items-center gap-1">
                                  <Briefcase size={12} /> {job.work_type}
                                </span>
                              )}
                              {job.location_text && (
                                <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-lg flex items-center gap-1">
                                  <MapPin size={12} /> {job.location_text}
                                </span>
                              )}
                              {job.experience_range && (
                                <span className="text-[10px] font-black uppercase bg-purple-50 text-purple-600 px-3 py-1 rounded-lg flex items-center gap-1">
                                  <Clock size={12} /> {job.experience_range}
                                </span>
                              )}
                              {(job.salary_min || job.salary_max) && (
                                <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg flex items-center gap-1">
                                  <DollarSign size={12} />
                                  {job.salary_min && job.salary_max
                                    ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ₺`
                                    : job.salary_min
                                    ? `${job.salary_min.toLocaleString()} ₺+`
                                    : `${job.salary_max?.toLocaleString()} ₺${jt.salaryUpTo}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Deadline & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                          <div className="flex items-center gap-3">
                            {deadlineInfo && (
                              <span
                                className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg flex items-center gap-1 ${
                                  deadlineInfo.urgent
                                    ? "bg-red-50 text-red-600"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                <Clock size={12} /> {deadlineInfo.text}
                              </span>
                            )}
                            {/* Detay Toggle */}
                            <button
                              onClick={() =>
                                setExpandedJob(isExpanded ? null : job.post_id)
                              }
                              className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp size={14} /> {jt.close}
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={14} /> {jt.detail}
                                </>
                              )}
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {/* Boost — sadece ilan sahibi görsün */}
                            {user?.id === job.company_id && (
                              <button
                                onClick={() => setSelectedJobForBoost(job)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 h-10 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Rocket size={14} /> {jt.boost}
                              </button>
                            )}
                            {/* BAŞVUR BUTONU */}
                            {hasApplied ? (
                              <span className="bg-emerald-100 text-emerald-700 px-6 h-10 rounded-xl text-xs font-black uppercase flex items-center gap-1.5">
                                <CheckCircle2 size={14} /> {jt.applied}
                              </span>
                            ) : expired ? (
                              <span className="bg-slate-100 text-slate-400 px-6 h-10 rounded-xl text-xs font-black uppercase flex items-center gap-1.5">
                                {jt.expired}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApplyClick(job)}
                                className="bg-[#E63946] hover:bg-[#d32f3d] text-white px-6 h-10 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-red-100 cursor-pointer"
                              >
                                <Send size={14} /> {jt.apply}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Genişletilmiş Detay */}
                  {isExpanded && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-slate-100">
                      <div className="pt-6 space-y-4">
                        {job.description && (
                          <div>
                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                              {jt.jobDescription}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                              {job.description}
                            </p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          {job.level && (
                            <div className="bg-slate-50 p-3 rounded-xl">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {jt.levelLabel}
                              </p>
                              <p className="text-sm font-black text-slate-700 mt-1">
                                {job.level}
                              </p>
                            </div>
                          )}
                          {job.work_type && (
                            <div className="bg-slate-50 p-3 rounded-xl">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {jt.workTypeLabel}
                              </p>
                              <p className="text-sm font-black text-slate-700 mt-1">
                                {job.work_type}
                              </p>
                            </div>
                          )}
                          {job.experience_range && (
                            <div className="bg-slate-50 p-3 rounded-xl">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {jt.experienceLabel}
                              </p>
                              <p className="text-sm font-black text-slate-700 mt-1">
                                {job.experience_range}
                              </p>
                            </div>
                          )}
                          {job.location_text && (
                            <div className="bg-slate-50 p-3 rounded-xl">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {jt.locationLabel}
                              </p>
                              <p className="text-sm font-black text-slate-700 mt-1">
                                {job.location_text}
                              </p>
                            </div>
                          )}
                        </div>
                        {(job.salary_min || job.salary_max) && (
                          <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3">
                            <DollarSign size={20} className="text-emerald-600" />
                            <div>
                              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                {jt.salaryRange}
                              </p>
                              <p className="text-lg font-black text-emerald-700">
                                {job.salary_min && job.salary_max
                                  ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ₺`
                                  : job.salary_min
                                  ? `${job.salary_min.toLocaleString()} ₺${jt.salaryFrom}`
                                  : `${job.salary_max?.toLocaleString()} ₺${jt.salaryUpTo}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
