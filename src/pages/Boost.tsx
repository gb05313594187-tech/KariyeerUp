// src/pages/Boost.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initiateBoostPayment, PRICING } from "@/lib/boostPayment";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sparkles, 
  Crown, 
  Zap, 
  CheckCircle2, 
  Rocket, 
  Brain, 
  Video, 
  Target,
  Clock,
  BarChart3,
  Globe,
  DollarSign,
  Star,
  Users,
  Building2,
  User,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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

    // Genel
    heroPill: "Premium Boost Paketleri",
    
    // Paket başlıkları
    userBoostTitle: "Aday AI Boost",
    coachBoostTitle: "Koç Öne Çıkarma",
    corpBoostTitle: "Şirket AI Boost",

    // Butonlar
    buy: "Hemen Boost'la",
    redirecting: "Yönlendiriliyor...",
    
    // Giriş yapılmamış
    notLoggedIn: "Giriş Yapmanız Gerekiyor",
    loginToContinue: "Boost paketlerinden yararlanmak için giriş yapmalısınız.",
    login: "Giriş Yap",
    
    // Footer
    secured: "Tüm ödemeler PayTR güvencesiyle 256-bit SSL ile korunmaktadır.",

    // Süre etiketleri
    oneTime: "Tek Seferlik",
    days: "Gün",
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
      { icon: "clock", text: "Faster Hiring Process" },
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
      { icon: "dollar", text: "Turn Expertise to Income" },
      { icon: "star", text: "Featured Profile" },
    ],

    heroPill: "Premium Boost Packages",
    
    userBoostTitle: "Candidate AI Boost",
    coachBoostTitle: "Coach Spotlight",
    corpBoostTitle: "Company AI Boost",

    buy: "Boost Now",
    redirecting: "Redirecting...",
    
    notLoggedIn: "Login Required",
    loginToContinue: "You need to be logged in to purchase boost packages.",
    login: "Login",
    
    secured: "All payments are secured with PayTR 256-bit SSL.",

    oneTime: "One Time",
    days: "Days",
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
      { icon: "clock", text: "عملية توظيف أسرع" },
      { icon: "target", text: "فرز AI المسبق" },
      { icon: "brain", text: "جرد تلقائي" },
      { icon: "chart", text: "تسجيل ذكي" },
      { icon: "video", text: "مقابلة بنقرة واحدة" },
    ],

    coachHeroTitle: "أوصل خبرتك لعملاء بلا حدود",
    coachHeroSub: "لا حواجز جغرافية، اعمل مع عملاء من جميع أنحاء العالم. حول خبرتك إلى دخل.",
    coachFeatures: [
      { icon: "globe", text: "وصول غير محدود" },
      { icon: "video", text: "جلسة Jitsi أونلاين" },
      { icon: "dollar", text: "حول الخبرة لدخل" },
      { icon: "star", text: "ملف مميز" },
    ],

    heroPill: "حزم Boost المميزة",
    
    userBoostTitle: "Boost المرشح الذكي",
    coachBoostTitle: "إبراز المدرب",
    corpBoostTitle: "Boost الشركة الذكي",

    buy: "عزز الآن",
    redirecting: "جارٍ التوجيه...",
    
    notLoggedIn: "تسجيل الدخول مطلوب",
    loginToContinue: "يجب تسجيل الدخول لشراء حزم التعزيز.",
    login: "تسجيل الدخول",
    
    secured: "جميع المدفوعات محمية بتشفير PayTR 256-bit SSL.",

    oneTime: "مرة واحدة",
    days: "أيام",
  },
  fr: {
    userHeroTitle: "Atteignez Votre Job de Rêve Plus Vite",
    userHeroSub: "Ne perdez pas de temps ! Matchez avec les bonnes entreprises, démarquez-vous avec l'inventaire de personnalité, gagnez du temps avec les entretiens en ligne.",
    userFeatures: [
      { icon: "target", text: "Matching IA" },
      { icon: "brain", text: "Inventaire de Personnalité" },
      { icon: "video", text: "Entretien en Ligne" },
      { icon: "rocket", text: "Profil en Vedette" },
    ],

    corpHeroTitle: "Ne Perdez Plus de Temps, Rencontrez le Bon Candidat",
    corpHeroSub: "Raccourcissez votre processus de recrutement. Ne vous perdez pas dans les CV - laissez l'IA pré-filtrer, envoyer l'inventaire, scorer. Vous n'interviewez que les meilleurs.",
    corpFeatures: [
      { icon: "clock", text: "Recrutement Plus Rapide" },
      { icon: "target", text: "Pré-filtrage IA" },
      { icon: "brain", text: "Inventaire Auto" },
      { icon: "chart", text: "Scoring Intelligent" },
      { icon: "video", text: "Entretien en Un Clic" },
    ],

    coachHeroTitle: "Partagez Votre Expertise Sans Limites",
    coachHeroSub: "Pas de barrières géographiques, travaillez avec des clients du monde entier. Transformez votre expertise en revenus.",
    coachFeatures: [
      { icon: "globe", text: "Accès Illimité" },
      { icon: "video", text: "Session Jitsi en Ligne" },
      { icon: "dollar", text: "Expertise en Revenus" },
      { icon: "star", text: "Profil en Vedette" },
    ],

    heroPill: "Forfaits Boost Premium",
    
    userBoostTitle: "Boost IA Candidat",
    coachBoostTitle: "Coach en Vedette",
    corpBoostTitle: "Boost IA Entreprise",

    buy: "Booster Maintenant",
    redirecting: "Redirection...",
    
    notLoggedIn: "Connexion Requise",
    loginToContinue: "Vous devez être connecté pour acheter un boost.",
    login: "Se Connecter",
    
    secured: "Tous les paiements sont sécurisés avec PayTR 256-bit SSL.",

    oneTime: "Une Fois",
    days: "Jours",
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
export default function Boost() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const { language } = useLanguage();

  const t = translations[language || "tr"] || translations.tr;

  /* ── ROL BAZLI HERO İÇERİĞİ ── */
  const getHeroContent = () => {
    switch (role) {
      case "corporate":
        return {
          title: t.corpHeroTitle,
          subtitle: t.corpHeroSub,
          features: t.corpFeatures,
          icon: <Building2 className="h-12 w-12 text-white" />,
          gradient: "from-emerald-500 to-teal-500",
        };
      case "coach":
        return {
          title: t.coachHeroTitle,
          subtitle: t.coachHeroSub,
          features: t.coachFeatures,
          icon: <Crown className="h-12 w-12 text-white" />,
          gradient: "from-purple-500 to-pink-500",
        };
      default: // user
        return {
          title: t.userHeroTitle,
          subtitle: t.userHeroSub,
          features: t.userFeatures,
          icon: <User className="h-12 w-12 text-white" />,
          gradient: "from-blue-500 to-cyan-500",
        };
    }
  };

  const heroContent = getHeroContent();

  /* ── GİRİŞ YAPILMAMIŞ ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center p-6">
        {/* Blob'lar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <Card className="relative p-10 text-center max-w-lg shadow-2xl border border-orange-200 bg-white/80 backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">{t.notLoggedIn}</h2>
          <p className="text-gray-600 mb-8">{t.loginToContinue}</p>
          <Button 
            onClick={() => (window.location.href = "/login")} 
            className="h-12 px-8 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold shadow-lg"
          >
            {t.login}
          </Button>
        </Card>
      </div>
    );
  }

  /* ── ÖDEME ── */
  const handlePayment = async (type: keyof typeof PRICING, price: any) => {
    if (!user?.email || !user?.fullName) {
      toast({ 
        title: "Hata", 
        description: "Profilinizde isim ve email eksik.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(`${type}-${price.duration}`);
    
    const result = await initiateBoostPayment({
      userId: user.id,
      email: user.email,
      fullName: user.fullName || user.email.split("@")[0],
      type,
      amount: price.amount,
      durationDays: price.duration,
    });

    if (result.success && result.token) {
      const paytrForm = document.createElement("form");
      paytrForm.action = "https://www.paytr.com/odeme";
      paytrForm.method = "POST";
      paytrForm.target = "_blank";

      const inputs = {
        merchant_id: import.meta.env.VITE_PAYTR_MERCHANT_ID,
        merchant_key: import.meta.env.VITE_PAYTR_MERCHANT_KEY,
        merchant_salt: import.meta.env.VITE_PAYTR_MERCHANT_SALT,
        email: user.email,
        payment_amount: price.amount,
        merchant_oid: result.merchantOid,
        user_name: user.fullName || user.email.split("@")[0],
        user_basket: JSON.stringify([[PRICING[type].name + " - " + price.label, (price.amount / 100).toFixed(2), "1"]]),
        user_ip: "85.34.78.112",
        timeout_limit: "30",
        currency: "TL",
        test_mode: import.meta.env.DEV ? "1" : "0",
        token: result.token,
      };

      Object.entries(inputs).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        paytrForm.appendChild(input);
      });

      document.body.appendChild(paytrForm);
      paytrForm.submit();
      document.body.removeChild(paytrForm);

      toast({ title: "Başarılı", description: "Ödeme sayfasına yönlendiriliyorsunuz..." });
    } else {
      toast({ title: "Hata", description: result.error || "Ödeme başlatılamadı.", variant: "destructive" });
    }
    setLoading(null);
  };

  /* ── ROL BAZLI PAKET ── */
  const getPackageForRole = () => {
    switch (role) {
      case "corporate":
        return {
          type: "corporate_boost" as const,
          title: t.corpBoostTitle,
          icon: Building2,
          gradient: "from-emerald-500 to-teal-500",
          shadow: "shadow-emerald-500/20",
        };
      case "coach":
        return {
          type: "coach_boost" as const,
          title: t.coachBoostTitle,
          icon: Crown,
          gradient: "from-purple-500 to-pink-500",
          shadow: "shadow-purple-500/20",
        };
      default:
        return {
          type: "user_boost" as const,
          title: t.userBoostTitle,
          icon: Zap,
          gradient: "from-blue-500 to-cyan-500",
          shadow: "shadow-blue-500/20",
        };
    }
  };

  const currentPackage = getPackageForRole();
  const prices = PRICING[currentPackage.type]?.prices || [];

  /* ════════════════════ JSX ════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white relative">
      {/* ── BLOB'LAR ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* ══════════ HERO SECTION ══════════ */}
        <div className="text-center mb-12">
          {/* Pill Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-200 text-red-700 font-semibold text-sm shadow-sm mb-6">
            <Sparkles className="w-4 h-4" />
            {t.heroPill}
          </span>

          {/* Hero Icon */}
          <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${heroContent.gradient} flex items-center justify-center shadow-2xl`}>
            {heroContent.icon}
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              {heroContent.title}
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            {heroContent.subtitle}
          </p>
        </div>

        {/* ══════════ TEŞVİK BARI ══════════ */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {heroContent.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${heroContent.gradient} flex items-center justify-center shadow-md`}>
                {getIcon(feature.icon, "w-5 h-5 text-white")}
              </div>
              <span className="font-semibold text-gray-800 text-sm">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════ BOOST PAKETİ KARTI ══════════ */}
        <Card className="relative overflow-hidden border-0 shadow-2xl max-w-2xl mx-auto">
          {/* Üst gradient şerit */}
          <div className={`h-2 bg-gradient-to-r ${currentPackage.gradient}`} />
          
          {/* Arka plan gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentPackage.gradient} opacity-5`} />

          <div className="relative z-10 p-8">
            {/* Paket Başlığı */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentPackage.gradient} flex items-center justify-center shadow-xl`}>
                <currentPackage.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{currentPackage.title}</h2>
                <p className="text-gray-500 text-sm">Profilinizi öne çıkarın</p>
              </div>
            </div>

            {/* Fiyat Seçenekleri */}
            <div className="space-y-4">
              {prices.map((price) => (
                <div 
                  key={price.duration} 
                  className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentPackage.gradient} opacity-20 flex items-center justify-center`}>
                      <Zap className={`w-6 h-6 text-gray-700`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{price.label}</p>
                      <p className="text-gray-500 text-sm">
                        {price.duration === 1 ? t.oneTime : `${price.duration} ${t.days}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-black text-gray-900">
                        {(price.amount / 100).toFixed(0)}
                        <span className="text-lg font-bold text-gray-500">₺</span>
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handlePayment(currentPackage.type, price)}
                      disabled={loading === `${currentPackage.type}-${price.duration}`}
                      className={`h-12 px-6 font-bold bg-gradient-to-r ${currentPackage.gradient} hover:opacity-90 text-white shadow-lg ${currentPackage.shadow} disabled:opacity-60 min-w-[140px]`}
                    >
                      {loading === `${currentPackage.type}-${price.duration}` ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.redirecting}
                        </span>
                      ) : (
                        t.buy
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ══════════ GÜVENLİK FOOTER ══════════ */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm shadow-xl border border-orange-200">
            <CheckCircle2 className="h-6 w-6 text-red-600" />
            <p className="text-gray-700 font-medium">{t.secured}</p>
          </div>
        </div>

      </div>
    </div>
  );
}// src/pages/Boost.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initiateBoostPayment, PRICING } from "@/lib/boostPayment";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Crown, Zap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Boost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const t = {
    tr: {
      title: "Boost & Premium Paketler",
      subtitle: "Profilini veya ilanını öne çıkar, daha fazla görün!",
      jobBoost: "İlanını Boost'la",
      coachBoost: "Koç Profilini Öne Çıkar",
      individualPremium: "Bireysel Premium",
      buy: "Satın Al",
      redirecting: "Yönlendiriliyor...",
      notLoggedIn: "Giriş Yapmanız Gerekiyor",
      loginToContinue: "Boost paketlerinden yararlanmak için giriş yapmalısınız.",
      login: "Giriş Yap",
      secured: "Tüm ödemeler PayTR güvencesiyle 256-bit SSL ile korunmaktadır.",
    },
    en: {
      title: "Boost & Premium Packages",
      subtitle: "Get more visibility for your profile or job post!",
      jobBoost: "Boost Your Job Post",
      coachBoost: "Feature Your Coach Profile",
      individualPremium: "Individual Premium",
      buy: "Buy Now",
      redirecting: "Redirecting...",
      notLoggedIn: "Login Required",
      loginToContinue: "You need to be logged in to purchase boost packages.",
      login: "Login",
      secured: "All payments are secured with PayTR 256-bit SSL.",
    },
    ar: {
      title: "حزم Boost & Premium",
      subtitle: "ارفع ظهور ملفك أو إعلانك!",
      jobBoost: "تعزيز إعلان الوظيفة",
      coachBoost: "إبراز ملف المدرب",
      individualPremium: "بريميوم فردي",
      buy: "اشترِ الآن",
      redirecting: "جارٍ التوجيه...",
      notLoggedIn: "يتطلب تسجيل الدخول",
      loginToContinue: "يجب عليك تسجيل الدخول لشراء حزم التعزيز.",
      login: "تسجيل الدخول",
      secured: "جميع المدفوعات محمية بتشفير PayTR 256-bit SSL.",
    },
    fr: {
      title: "Boost & Premium",
      subtitle: "Mettez en avant votre profil ou votre annonce !",
      jobBoost: "Booster votre annonce",
      coachBoost: "Mettre en avant votre profil coach",
      individualPremium: "Premium Individuel",
      buy: "Acheter",
      redirecting: "Redirection en cours...",
      notLoggedIn: "Connexion requise",
      loginToContinue: "Vous devez être connecté pour acheter un boost.",
      login: "Se connecter",
      secured: "Tous les paiements sont sécurisés avec PayTR 256-bit SSL.",
    },
  }[language || "tr"];

  const me = user;
  if (!me) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center p-6">
        <Card className="p-10 text-center max-w-lg shadow-2xl border border-orange-200">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">{t.notLoggedIn}</h2>
          <p className="text-gray-600 mb-8">{t.loginToContinue}</p>
          <Button onClick={() => (window.location.href = "/login")} className="h-12 px-8 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold">
            {t.login}
          </Button>
        </Card>
      </div>
    );
  }

  const handlePayment = async (type: keyof typeof PRICING, price: any) => {
    if (!me?.email || !me?.fullName) {
      toast({ title: "Hata", description: "Profilinizde isim ve email eksik.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const result = await initiateBoostPayment({
      userId: me.id,
      email: me.email,
      fullName: me.fullName || me.email.split("@")[0],
      type,
      amount: price.amount,
      durationDays: price.duration,
    });

    if (result.success && result.token) {
      const paytrForm = document.createElement("form");
      paytrForm.action = "https://www.paytr.com/odeme";
      paytrForm.method = "POST";
      paytrForm.target = "_blank";

      const inputs = {
        merchant_id: import.meta.env.VITE_PAYTR_MERCHANT_ID,
        merchant_key: import.meta.env.VITE_PAYTR_MERCHANT_KEY,
        merchant_salt: import.meta.env.VITE_PAYTR_MERCHANT_SALT,
        email: me.email,
        payment_amount: price.amount,
        merchant_oid: result.merchantOid,
        user_name: me.fullName || me.email.split("@")[0],
        user_basket: JSON.stringify([[PRICING[type].name + " - " + price.label, (price.amount / 100).toFixed(2), "1"]]),
        user_ip: "85.34.78.112",
        timeout_limit: "30",
        currency: "TL",
        test_mode: import.meta.env.DEV ? "1" : "0",
        token: result.token,
      };

      Object.entries(inputs).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        paytrForm.appendChild(input);
      });

      document.body.appendChild(paytrForm);
      paytrForm.submit();
      document.body.removeChild(paytrForm);

      toast({ title: "Başarılı", description: "Ödeme sayfasına yönlendiriliyorsunuz..." });
    } else {
      toast({ title: "Hata", description: result.error || "Ödeme başlatılamadı.", variant: "destructive" });
    }
    setLoading(false);
  };

  const packages = [
    { type: "job_boost" as const, title: t.jobBoost, icon: Zap, gradient: "from-orange-500 to-red-600" },
    { type: "coach_boost" as const, title: t.coachBoost, icon: Crown, gradient: "from-red-600 to-orange-600" },
    { type: "premium_individual" as const, title: t.individualPremium, icon: Sparkles, gradient: "from-red-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-700 font-medium">{t.subtitle}</p>
        </div>

        {/* Packages */}
        <div className="grid lg:grid-cols-3 gap-10">
          {packages.map(({ type, title, icon: Icon, gradient }) => (
            <Card key={type} className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
              <div className="absolute inset-0 bg-black opacity-10" />
              
              <div className="relative z-10 p-10 text-white">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
                  <Icon size={48} className="drop-shadow-lg" />
                </div>
                
                <h3 className="text-3xl font-black mb-10 drop-shadow-lg">{title}</h3>
                
                <div className="space-y-6">
                  {PRICING[type].prices.map((price) => (
                    <div key={price.duration} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-lg font-bold">{price.label}</p>
                          <p className="text-sm opacity-90">{price.duration === 1 ? "Tek Seferlik" : price.duration + " Gün"}</p>
                        </div>
                        <p className="text-4xl font-black">
                          {(price.amount / 100).toFixed(0)}<span className="text-xl">₺</span>
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handlePayment(type, price)}
                        disabled={loading}
                        className="w-full h-14 text-lg font-bold bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                      >
                        {loading ? t.redirecting : t.buy}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm shadow-xl border border-orange-200">
            <CheckCircle2 className="h-6 w-6 text-red-600" />
            <p className="text-gray-700 font-medium">{t.secured}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
