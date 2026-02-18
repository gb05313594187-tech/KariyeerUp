// src/pages/Pricing.tsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Headphones,
  Loader2,
  Target,
  Brain,
  Video,
  Rocket,
  Clock,
  BarChart3,
  Globe,
  DollarSign,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PRICING, initiateBoostPayment } from "@/lib/boostPayment";

/* ════════════════════════════════════════════
   TRANSLATIONS
   ════════════════════════════════════════════ */
const translations = {
  tr: {
    // Hero - User
    userHeroTitle: "Hayalindeki İşe Daha Hızlı Ulaş",
    userHeroSub: "Vakit kaybetme! Doğru şirketlerle eşleş, kişilik envanteriyle öne çık, online mülakatla zaman kazan.",
    userFeatures: [
      { icon: "target", text: "AI ile Doğru Eşleşme" },
      { icon: "brain", text: "Kişilik Envanteri" },
      { icon: "video", text: "Online Mülakat" },
      { icon: "rocket", text: "Öne Çıkan Profil" },
    ],

    // Hero - Corporate
    corpHeroTitle: "Vakit Kaybetmeyin, Doğru Adayla Tanışın",
    corpHeroSub: "İşe alım sürenizi kısaltın. Özgeçmiş yığınlarında kaybolmayın - AI ön eleme yapsın, envanter göndersin, skorlasın. Siz sadece en uygun adaylarla görüşün.",
    corpFeatures: [
      { icon: "clock", text: "Kısalan İşe Alım Süreci" },
      { icon: "target", text: "AI Ön Eleme" },
      { icon: "brain", text: "Otomatik Envanter" },
      { icon: "chart", text: "Akıllı Skorlama" },
      { icon: "video", text: "Tek Tıkla Mülakat" },
    ],

    // Hero - Coach
    coachHeroTitle: "Uzmanlığını Sınırsız Danışana Ulaştır",
    coachHeroSub: "Coğrafi engel yok, dünyanın her yerinden danışanlarla çalış. Uzmanlığını gelire dönüştür.",
    coachFeatures: [
      { icon: "globe", text: "Sınırsız Erişim" },
      { icon: "video", text: "Jitsi Online Seans" },
      { icon: "dollar", text: "Uzmanlığını Gelire Dönüştür" },
      { icon: "star", text: "Öne Çıkan Profil" },
    ],

    // Hero - Genel (giriş yapmamış veya admin)
    defaultHeroTitle: "Kariyerini Boost'la",
    defaultHeroSub: "AI destekli eşleşme sistemiyle öne çıkın, doğru fırsatları yakalayın!",
    defaultFeatures: [
      { icon: "target", text: "AI Eşleşme" },
      { icon: "brain", text: "Kişilik Envanteri" },
      { icon: "video", text: "Online Mülakat" },
      { icon: "rocket", text: "Öne Çıkan Profil" },
    ],

    heroPill: "Premium Boost Paketleri",

    weekly: "Haftalık",
    monthly: "Aylık",
    week: "hafta",
    month: "ay",
    save: "tasarruf",
    bestValue: "En Avantajlı",

    userTitle: "Aday AI Boost",
    userDesc: "Şirketlerin aday listesinde üst sıralarda çıkın",
    userFeats: [
      "Şirketlerin listesinde üst sıralarda görünün",
      "+80 AI öncelik puanı kazanın",
      "Profiliniz şirketlere öne çıkarılır",
      "Daha fazla iş fırsatı keşfedin",
      "Öncelikli bildirimler alın",
    ],

    coachTitle: "Koç Öne Çıkarma",
    coachDesc: "Ana sayfada öne çıkın, daha fazla müşteri kazanın",
    coachFeats: [
      "Ana sayfada öne çıkan koçlar arasında yer alın",
      "Koç listesinde üst sıralarda görünün",
      "Daha fazla müşteri talebi alın",
      "Arama sonuçlarında profiliniz öne çıksın",
      "Öncelikli destek alın",
    ],

    corpTitle: "Şirket AI Boost",
    corpDesc: "Adayların şirket listesinde üst sıralarda çıkın",
    corpFeats: [
      "Adayların listesinde üst sıralarda görünün",
      "+100 AI öncelik puanı kazanın",
      "İlanlarınız adaylara öne çıkarılır",
      "Daha nitelikli aday başvuruları alın",
      "Şirket profiliniz ön plana çıksın",
    ],

    buyNow: "Hemen Boost'la",
    registerCta: "Kayıt Ol ve Başla",
    processing: "İşleniyor...",

    trust1: "PayTR 256-bit SSL güvencesi",
    trust2: "Anında aktivasyon",
    trust3: "7/24 destek",

    faqTitle: "Sıkça Sorulan Sorular",
    faq1Q: "Boost ne zaman aktif olur?",
    faq1A: "Ödeme onaylandıktan hemen sonra boost aktif olur ve profiliniz/ilanlarınız öne çıkarılır.",
    faq2Q: "Haftalık mı aylık mı tercih etmeliyim?",
    faq2A: "Aylık paket %50'ye varan tasarruf sağlar. Uzun vadeli görünürlük için aylık paketi öneriyoruz.",
    faq3Q: "İptal edebilir miyim?",
    faq3A: "Boost süresi dolduğunda otomatik sonlanır. İstediğiniz zaman yeniden satın alabilirsiniz.",

    loginNote: "Boost satın almak için giriş yapın veya kayıt olun.",
    payError: "Ödeme başlatılamadı",
  },
  en: {
    userHeroTitle: "Reach Your Dream Job Faster",
    userHeroSub: "Don't waste time! Match with the right companies, stand out with personality inventory, save time with online interviews.",
    userFeatures: [
      { icon: "target", text: "AI Matching" },
      { icon: "brain", text: "Personality Inventory" },
      { icon: "video", text: "Online Interview" },
      { icon: "rocket", text: "Featured Profile" },
    ],

    corpHeroTitle: "Don't Waste Time, Meet the Right Candidate",
    corpHeroSub: "Shorten your hiring process. Don't get lost in resume piles - let AI pre-screen, send inventory, score. You only interview the best matches.",
    corpFeatures: [
      { icon: "clock", text: "Faster Hiring" },
      { icon: "target", text: "AI Pre-screening" },
      { icon: "brain", text: "Auto Inventory" },
      { icon: "chart", text: "Smart Scoring" },
      { icon: "video", text: "One-Click Interview" },
    ],

    coachHeroTitle: "Reach Unlimited Clients with Your Expertise",
    coachHeroSub: "No geographic barriers, work with clients from all over the world. Turn your expertise into income.",
    coachFeatures: [
      { icon: "globe", text: "Unlimited Access" },
      { icon: "video", text: "Jitsi Online Session" },
      { icon: "dollar", text: "Expertise to Income" },
      { icon: "star", text: "Featured Profile" },
    ],

    defaultHeroTitle: "Boost Your Career",
    defaultHeroSub: "Stand out with AI-powered matching and reach the right opportunities!",
    defaultFeatures: [
      { icon: "target", text: "AI Matching" },
      { icon: "brain", text: "Personality Inventory" },
      { icon: "video", text: "Online Interview" },
      { icon: "rocket", text: "Featured Profile" },
    ],

    heroPill: "Premium Boost Packages",

    weekly: "Weekly",
    monthly: "Monthly",
    week: "week",
    month: "month",
    save: "savings",
    bestValue: "Best Value",

    userTitle: "Candidate AI Boost",
    userDesc: "Appear at the top of companies' candidate lists",
    userFeats: [
      "Appear at the top of company lists",
      "Earn +80 AI priority score",
      "Your profile is highlighted to companies",
      "Discover more job opportunities",
      "Receive priority notifications",
    ],

    coachTitle: "Coach Spotlight",
    coachDesc: "Get featured on the homepage, attract more clients",
    coachFeats: [
      "Appear among featured coaches on the homepage",
      "Rank higher in coach listings",
      "Receive more client requests",
      "Your profile stands out in search results",
      "Priority support",
    ],

    corpTitle: "Company AI Boost",
    corpDesc: "Appear at the top of candidates' company lists",
    corpFeats: [
      "Appear at the top of candidate lists",
      "Earn +100 AI priority score",
      "Your job posts are highlighted to candidates",
      "Receive more qualified applications",
      "Your company profile stands out",
    ],

    buyNow: "Boost Now",
    registerCta: "Register & Start",
    processing: "Processing...",

    trust1: "PayTR 256-bit SSL security",
    trust2: "Instant activation",
    trust3: "24/7 support",

    faqTitle: "Frequently Asked Questions",
    faq1Q: "When does the boost activate?",
    faq1A: "The boost activates immediately after payment confirmation.",
    faq2Q: "Should I choose weekly or monthly?",
    faq2A: "The monthly package offers up to 50% savings. We recommend monthly for long-term visibility.",
    faq3Q: "Can I cancel?",
    faq3A: "The boost automatically expires at the end of the period. You can repurchase anytime.",

    loginNote: "Log in or register to purchase a boost.",
    payError: "Payment could not be initiated",
  },
  ar: {
    userHeroTitle: "الوصول إلى وظيفة أحلامك بشكل أسرع",
    userHeroSub: "لا تضيع الوقت! تطابق مع الشركات المناسبة، تميز بجرد الشخصية، وفر الوقت مع المقابلات عبر الإنترنت.",
    userFeatures: [
      { icon: "target", text: "مطابقة AI" },
      { icon: "brain", text: "جرد الشخصية" },
      { icon: "video", text: "مقابلة أونلاين" },
      { icon: "rocket", text: "ملف مميز" },
    ],

    corpHeroTitle: "لا تضيعوا الوقت، قابلوا المرشح المناسب",
    corpHeroSub: "اختصروا عملية التوظيف. لا تضيعوا في أكوام السير الذاتية - دع AI يفرز، يرسل الجرد، يسجل. أنتم فقط تقابلون الأنسب.",
    corpFeatures: [
      { icon: "clock", text: "توظيف أسرع" },
      { icon: "target", text: "فرز AI" },
      { icon: "brain", text: "جرد تلقائي" },
      { icon: "chart", text: "تسجيل ذكي" },
      { icon: "video", text: "مقابلة بنقرة" },
    ],

    coachHeroTitle: "أوصل خبرتك لعملاء بلا حدود",
    coachHeroSub: "لا حواجز جغرافية، اعمل مع عملاء من جميع أنحاء العالم. حول خبرتك إلى دخل.",
    coachFeatures: [
      { icon: "globe", text: "وصول غير محدود" },
      { icon: "video", text: "جلسة Jitsi" },
      { icon: "dollar", text: "خبرة لدخل" },
      { icon: "star", text: "ملف مميز" },
    ],

    defaultHeroTitle: "عزز مسيرتك المهنية",
    defaultHeroSub: "تميّز بنظام المطابقة الذكي واحصل على الفرص المناسبة!",
    defaultFeatures: [
      { icon: "target", text: "مطابقة AI" },
      { icon: "brain", text: "جرد الشخصية" },
      { icon: "video", text: "مقابلة أونلاين" },
      { icon: "rocket", text: "ملف مميز" },
    ],

    heroPill: "حزم Boost المميزة",

    weekly: "أسبوعي",
    monthly: "شهري",
    week: "أسبوع",
    month: "شهر",
    save: "توفير",
    bestValue: "الأفضل قيمة",

    userTitle: "Boost المرشح الذكي",
    userDesc: "اظهر في أعلى قوائم المرشحين لدى الشركات",
    userFeats: [
      "اظهر في أعلى قوائم الشركات",
      "احصل على +80 نقطة أولوية ذكية",
      "يتم إبراز ملفك للشركات",
      "اكتشف المزيد من فرص العمل",
      "احصل على إشعارات ذات أولوية",
    ],

    coachTitle: "إبراز المدرب",
    coachDesc: "اظهر على الصفحة الرئيسية واجذب المزيد من العملاء",
    coachFeats: [
      "اظهر ضمن المدربين المميزين",
      "احتل مرتبة أعلى في قوائم المدربين",
      "احصل على المزيد من طلبات العملاء",
      "يبرز ملفك في نتائج البحث",
      "دعم ذو أولوية",
    ],

    corpTitle: "Boost الشركة الذكي",
    corpDesc: "اظهر في أعلى قوائم الشركات لدى المرشحين",
    corpFeats: [
      "اظهر في أعلى قوائم المرشحين",
      "احصل على +100 نقطة أولوية ذكية",
      "يتم إبراز إعلاناتك للمرشحين",
      "احصل على طلبات أكثر تأهيلاً",
      "يبرز ملف شركتك",
    ],

    buyNow: "عزّز الآن",
    registerCta: "سجّل وابدأ",
    processing: "جارٍ المعالجة...",

    trust1: "حماية PayTR بتشفير 256-bit SSL",
    trust2: "تفعيل فوري",
    trust3: "دعم 24/7",

    faqTitle: "الأسئلة الشائعة",
    faq1Q: "متى يتم تفعيل Boost؟",
    faq1A: "يتم تفعيل Boost فور تأكيد الدفع.",
    faq2Q: "هل أختار الأسبوعي أم الشهري؟",
    faq2A: "الباقة الشهرية توفر حتى 50%. نوصي بالشهري للظهور طويل المدى.",
    faq3Q: "هل يمكنني الإلغاء؟",
    faq3A: "ينتهي Boost تلقائياً عند انتهاء المدة. يمكنك إعادة الشراء في أي وقت.",

    loginNote: "سجّل الدخول أو أنشئ حساباً لشراء Boost.",
    payError: "تعذر بدء الدفع",
  },
  fr: {
    userHeroTitle: "Atteignez Votre Job de Rêve Plus Vite",
    userHeroSub: "Ne perdez pas de temps ! Matchez avec les bonnes entreprises, démarquez-vous avec l'inventaire de personnalité, gagnez du temps avec les entretiens en ligne.",
    userFeatures: [
      { icon: "target", text: "Matching IA" },
      { icon: "brain", text: "Inventaire Personnalité" },
      { icon: "video", text: "Entretien en Ligne" },
      { icon: "rocket", text: "Profil en Vedette" },
    ],

    corpHeroTitle: "Ne Perdez Plus de Temps, Rencontrez le Bon Candidat",
    corpHeroSub: "Raccourcissez votre processus de recrutement. Ne vous perdez pas dans les CV - laissez l'IA pré-filtrer, envoyer l'inventaire, scorer. Vous n'interviewez que les meilleurs.",
    corpFeatures: [
      { icon: "clock", text: "Recrutement Rapide" },
      { icon: "target", text: "Pré-filtrage IA" },
      { icon: "brain", text: "Inventaire Auto" },
      { icon: "chart", text: "Scoring Intelligent" },
      { icon: "video", text: "Entretien 1-Clic" },
    ],

    coachHeroTitle: "Partagez Votre Expertise Sans Limites",
    coachHeroSub: "Pas de barrières géographiques, travaillez avec des clients du monde entier. Transformez votre expertise en revenus.",
    coachFeatures: [
      { icon: "globe", text: "Accès Illimité" },
      { icon: "video", text: "Session Jitsi" },
      { icon: "dollar", text: "Expertise en Revenus" },
      { icon: "star", text: "Profil en Vedette" },
    ],

    defaultHeroTitle: "Boostez Votre Carrière",
    defaultHeroSub: "Démarquez-vous grâce au matching IA et saisissez les bonnes opportunités !",
    defaultFeatures: [
      { icon: "target", text: "Matching IA" },
      { icon: "brain", text: "Inventaire" },
      { icon: "video", text: "Entretien" },
      { icon: "rocket", text: "Profil Vedette" },
    ],

    heroPill: "Forfaits Boost Premium",

    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    week: "semaine",
    month: "mois",
    save: "d'économie",
    bestValue: "Meilleur rapport",

    userTitle: "Boost IA Candidat",
    userDesc: "Apparaissez en haut des listes des entreprises",
    userFeats: [
      "Apparaissez en haut des listes d'entreprises",
      "Gagnez +80 points de priorité IA",
      "Votre profil est mis en avant",
      "Découvrez plus d'opportunités",
      "Notifications prioritaires",
    ],

    coachTitle: "Coach en Vedette",
    coachDesc: "Soyez mis en avant, attirez plus de clients",
    coachFeats: [
      "Apparaissez parmi les coachs en vedette",
      "Classez-vous plus haut dans les listes",
      "Recevez plus de demandes de clients",
      "Votre profil se démarque dans les résultats",
      "Support prioritaire",
    ],

    corpTitle: "Boost IA Entreprise",
    corpDesc: "Apparaissez en haut des listes des candidats",
    corpFeats: [
      "Apparaissez en haut des listes de candidats",
      "Gagnez +100 points de priorité IA",
      "Vos offres sont mises en avant",
      "Candidatures plus qualifiées",
      "Votre profil entreprise se démarque",
    ],

    buyNow: "Booster Maintenant",
    registerCta: "S'inscrire et Commencer",
    processing: "Traitement...",

    trust1: "Sécurité PayTR SSL 256-bit",
    trust2: "Activation instantanée",
    trust3: "Support 24/7",

    faqTitle: "Questions Fréquentes",
    faq1Q: "Quand le boost est-il activé ?",
    faq1A: "Le boost est activé immédiatement après confirmation du paiement.",
    faq2Q: "Hebdomadaire ou mensuel ?",
    faq2A: "Le forfait mensuel offre jusqu'à 50% d'économie.",
    faq3Q: "Puis-je annuler ?",
    faq3A: "Le boost expire automatiquement. Vous pouvez racheter à tout moment.",

    loginNote: "Connectez-vous ou inscrivez-vous pour acheter un boost.",
    payError: "Le paiement n'a pas pu être initié",
  },
};

/* ════════════════════════════════════════════
   ICON HELPER
   ════════════════════════════════════════════ */
const getIcon = (iconName: string, className: string) => {
  const icons: Record<string, React.ReactNode> = {
    target: <Target className={className} />,
    brain: <Brain className={className} />,
    video: <Video className={className} />,
    rocket: <Rocket className={className} />,
    clock: <Clock className={className} />,
    chart: <BarChart3 className={className} />,
    globe: <Globe className={className} />,
    dollar: <DollarSign className={className} />,
    star: <Star className={className} />,
    users: <Users className={className} />,
  };
  return icons[iconName] || <Sparkles className={className} />;
};

/* ════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════ */
export default function Pricing() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { language } = useLanguage();

  const t = translations[language || "tr"] || translations.tr;

  const authLoading = auth.loading;
  const role = auth?.role || null;
  const isLoggedIn = !!auth?.isAuthenticated;
  const userId = auth?.user?.id;

  /* hangi fiyat seçili: 0 = haftalık, 1 = aylık (default aylık) */
  const [selectedPrices, setSelectedPrices] = useState<Record<string, number>>({
    user_boost: 1,
    coach_boost: 1,
    corporate_boost: 1,
  });
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  /* ── ROL BAZLI HERO İÇERİĞİ ── */
  const getHeroContent = () => {
    if (!isLoggedIn || authLoading) {
      return {
        title: t.defaultHeroTitle,
        subtitle: t.defaultHeroSub,
        features: t.defaultFeatures,
        gradient: "from-red-600 to-orange-600",
      };
    }

    switch (role) {
      case "corporate":
        return {
          title: t.corpHeroTitle,
          subtitle: t.corpHeroSub,
          features: t.corpFeatures,
          gradient: "from-emerald-500 to-teal-500",
        };
      case "coach":
        return {
          title: t.coachHeroTitle,
          subtitle: t.coachHeroSub,
          features: t.coachFeatures,
          gradient: "from-purple-500 to-pink-500",
        };
      case "user":
        return {
          title: t.userHeroTitle,
          subtitle: t.userHeroSub,
          features: t.userFeatures,
          gradient: "from-blue-500 to-cyan-500",
        };
      default:
        return {
          title: t.defaultHeroTitle,
          subtitle: t.defaultHeroSub,
          features: t.defaultFeatures,
          gradient: "from-red-600 to-orange-600",
        };
    }
  };

  const heroContent = getHeroContent();

  /* ── KİM NE GÖRÜR ── */
  const canSeeUser =
    authLoading || !isLoggedIn || role === "user" || role === "admin";
  const canSeeCoach =
    authLoading || !isLoggedIn || role === "coach" || role === "admin";
  const canSeeCorp =
    authLoading || !isLoggedIn || role === "corporate" || role === "admin";

  /* ── KART AYARLARI ── */
  const packageConfigs = [
    {
      key: "user_boost",
      icon: "🚀",
      gradient: "from-blue-500 to-cyan-500",
      ring: "ring-blue-400",
      shadow: "shadow-blue-500/20",
      checkColor: "text-blue-500",
      title: t.userTitle,
      desc: t.userDesc,
      features: t.userFeats,
      visible: canSeeUser,
    },
    {
      key: "coach_boost",
      icon: "⭐",
      gradient: "from-purple-500 to-pink-500",
      ring: "ring-purple-400",
      shadow: "shadow-purple-500/20",
      checkColor: "text-purple-500",
      title: t.coachTitle,
      desc: t.coachDesc,
      features: t.coachFeats,
      visible: canSeeCoach,
    },
    {
      key: "corporate_boost",
      icon: "🏢",
      gradient: "from-emerald-500 to-teal-500",
      ring: "ring-emerald-400",
      shadow: "shadow-emerald-500/20",
      checkColor: "text-emerald-500",
      title: t.corpTitle,
      desc: t.corpDesc,
      features: t.corpFeats,
      visible: canSeeCorp,
    },
  ];

  const visiblePkgs = packageConfigs.filter((p) => p.visible);

  const gridClass =
    visiblePkgs.length === 1
      ? "max-w-xl mx-auto"
      : visiblePkgs.length === 2
        ? "grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  /* ── ÖDEME FONKSİYONU ── */
  const handleBuy = async (pkgKey: string) => {
    if (!isLoggedIn || !userId) {
      navigate("/register");
      return;
    }

    const priceIdx = selectedPrices[pkgKey] ?? 1;
    const price = PRICING[pkgKey].prices[priceIdx];

    setPaymentLoading(pkgKey);

    try {
      const result = await initiateBoostPayment({
        userId,
        packageSlug: price.slug,
      });

      if (result.success && result.iframeUrl) {
        // Yeni sekmede aç
        window.open(result.iframeUrl, "_blank");
        toast.success("Ödeme sayfası açıldı. Lütfen işlemi tamamlayın.");
      } else {
        toast.error(result.error || t.payError);
      }
    } catch (err: any) {
      toast.error(err.message || t.payError);
    } finally {
      setPaymentLoading(null);
    }
  };

  /* ════════════════════ JSX ════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 relative">
      {/* ── BLOB'LAR ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ══════════ HERO ══════════ */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-200 text-red-700 font-semibold text-sm shadow-sm">
            <Sparkles className="w-4 h-4" />
            {t.heroPill}
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${heroContent.gradient}`}>
              {heroContent.title}
            </span>
          </h1>

          <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            {heroContent.subtitle}
          </p>
        </div>

        {/* ══════════ TEŞVİK BARI ══════════ */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {heroContent.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${heroContent.gradient} flex items-center justify-center shadow-sm`}>
                {getIcon(feature.icon, "w-4 h-4 text-white")}
              </div>
              <span className="font-medium text-gray-700 text-sm">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* ── GİRİŞ YAPILMAMIŞ NOTU ── */}
        {!authLoading && !isLoggedIn && (
          <div className="mb-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-200 p-4 text-center text-sm text-gray-700">
            {t.loginNote}
          </div>
        )}

        {/* ══════════ KARTLAR ══════════ */}
        {authLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className={`grid gap-8 ${gridClass}`}>
            {visiblePkgs.map((cfg) => {
              const prices = PRICING[cfg.key].prices;
              const weeklyAmount = prices[0].amount;
              const normalMonthly = weeklyAmount * 4;

              return (
                <Card
                  key={cfg.key}
                  className="relative overflow-hidden shadow-2xl border-0 bg-white"
                >
                  {/* Üst gradient şerit */}
                  <div
                    className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`}
                  />

                  <CardContent className="p-7">
                    {/* ── BAŞLIK ── */}
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${cfg.gradient} text-white font-bold text-sm`}
                    >
                      <span className="text-lg">{cfg.icon}</span>
                      {cfg.title}
                    </span>

                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                      {cfg.desc}
                    </p>

                    {/* ── FİYAT SEÇİCİ (LinkedIn tarzı) ── */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {prices.map((price, idx) => {
                        const isSelected =
                          (selectedPrices[cfg.key] ?? 1) === idx;
                        const isMonthly = price.duration === 30;
                        const savingsPercent = isMonthly
                          ? Math.round(
                              ((normalMonthly - price.amount) /
                                normalMonthly) *
                                100
                            )
                          : 0;

                        return (
                          <div
                            key={price.slug}
                            onClick={() =>
                              setSelectedPrices((p) => ({
                                ...p,
                                [cfg.key]: idx,
                              }))
                            }
                            className={`
                              relative flex flex-col items-center justify-center
                              h-40 rounded-2xl cursor-pointer select-none overflow-hidden
                              transition-all duration-200
                              ${
                                isSelected
                                  ? `ring-2 ${cfg.ring} shadow-lg scale-[1.03]`
                                  : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                              }
                            `}
                          >
                            {/* Seçili gradient arka plan */}
                            {isSelected && (
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient}`}
                              />
                            )}

                            {/* En Avantajlı badge */}
                            {isMonthly && (
                              <span
                                className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-20
                                  ${isSelected ? "bg-white/25 text-white" : "bg-green-100 text-green-700"}`}
                              >
                                {t.bestValue}
                              </span>
                            )}

                            <div className="relative z-10 flex flex-col items-center gap-0.5">
                              <span
                                className={`text-sm font-semibold ${isSelected ? "text-white/80" : "text-gray-500"}`}
                              >
                                {isMonthly ? t.monthly : t.weekly}
                              </span>

                              {/* Üstü çizili normal fiyat */}
                              {isMonthly && (
                                <span
                                  className={`text-xs line-through ${isSelected ? "text-white/50" : "text-gray-400"}`}
                                >
                                  {(normalMonthly / 100).toFixed(0)}₺
                                </span>
                              )}

                              {/* Ana fiyat */}
                              <span
                                className={`text-3xl font-black ${isSelected ? "text-white" : "text-gray-900"}`}
                              >
                                {(price.amount / 100).toFixed(0)}
                                <span className="text-base font-bold">₺</span>
                              </span>

                              <span
                                className={`text-xs ${isSelected ? "text-white/70" : "text-gray-400"}`}
                              >
                                /{isMonthly ? t.month : t.week}
                              </span>

                              {/* Tasarruf yüzdesi */}
                              {isMonthly && savingsPercent > 0 && (
                                <span
                                  className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full
                                    ${isSelected ? "bg-white/25 text-white" : "bg-green-100 text-green-700"}`}
                                >
                                  %{savingsPercent} {t.save}
                                </span>
                              )}
                            </div>

                            {/* Seçim tik */}
                            {isSelected && (
                              <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow z-20" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ── FEATURE LİSTESİ ── */}
                    <div className="mt-6 space-y-2.5">
                      {cfg.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className={`w-5 h-5 ${cfg.checkColor} mt-0.5 shrink-0`}
                          />
                          <span className="text-gray-700 text-sm">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* ── CTA BUTON ── */}
                    <Button
                      onClick={() => handleBuy(cfg.key)}
                      disabled={paymentLoading === cfg.key}
                      className={`mt-7 w-full h-12 text-sm font-bold bg-gradient-to-r ${cfg.gradient} hover:opacity-90 text-white shadow-lg ${cfg.shadow} disabled:opacity-60`}
                    >
                      {paymentLoading === cfg.key ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.processing}
                        </span>
                      ) : (
                        isLoggedIn ? t.buyNow : t.registerCta
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ══════════ GÜVENLİK BARI ══════════ */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: ShieldCheck, text: t.trust1 },
            { icon: Zap, text: t.trust2 },
            { icon: Headphones, text: t.trust3 },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-white/50 text-sm text-gray-700"
            >
              <item.icon className="w-5 h-5 text-red-600 shrink-0" />
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* ══════════ FAQ ══════════ */}
        <div className="mt-12 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl p-8">
          <h3 className="text-xl font-extrabold text-gray-900">
            {t.faqTitle}
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: t.faq1Q, a: t.faq1A },
              { q: t.faq2Q, a: t.faq2A },
              { q: t.faq3Q, a: t.faq3A },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900 text-sm">{faq.q}</p>
                <p className="mt-1 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
