// src/pages/BireyselPremium.tsx
// @ts-nocheck
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Building2,
  Star,
  Users2,
  BarChart3,
  Globe,
  Briefcase,
  Loader2,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// ─── ROLE BAZLI KONFİGÜRASYON ───
const PLAN_CONFIG = {
  user: {
    tr: {
      badge: "Bireysel Premium",
      title: "Kariyerinde hızlan.\nPremium ile öne geç.",
      subtitle:
        "Daha iyi koçlara eriş, daha hızlı rezervasyon al, daha net bir planla ilerle.",
      cta: "Premium Satın Al",
      ctaSecondary: "Koçları İncele",
      ctaSecondaryPath: "/coaches",
      card1Title: "Premium ayrıcalıklar",
      card1Desc: "Koçluk deneyimini daha hızlı ve daha etkili hale getirir.",
      card2Title: "Güvenli ödeme",
      card2Desc: "Ödeme PayTR altyapısında tamamlanır. Kart bilgisi platformda tutulmaz.",
      card3Title: "Tek tıkla başla",
      card3Desc: "Satın aldıktan sonra premium koçlara anında eriş.",
      featuresTitle: "Neler dahil?",
      price: "199 ₺",
      period: "/ ay",
      priceLabel: "Aylık",
      priceNote: "*Fiyat bilgilendirme amaçlıdır. Ödeme sırasında güncel fiyat geçerlidir.",
    },
    en: {
      badge: "Individual Premium",
      title: "Accelerate your career.\nGo premium.",
      subtitle: "Access better coaches, book faster, and move forward with a clear plan.",
      cta: "Buy Premium",
      ctaSecondary: "Browse Coaches",
      ctaSecondaryPath: "/coaches",
      card1Title: "Premium benefits",
      card1Desc: "Makes your coaching experience faster and more effective.",
      card2Title: "Secure payment",
      card2Desc: "Payment is processed via PayTR. Card info is never stored on platform.",
      card3Title: "Start instantly",
      card3Desc: "Access premium coaches immediately after purchase.",
      featuresTitle: "What's included?",
      price: "199 ₺",
      period: "/ mo",
      priceLabel: "Monthly",
      priceNote: "*Price is informational. Actual price applies at checkout.",
    },
    features: {
      tr: [
        "Premium koçlara erişim",
        "Öncelikli rezervasyon",
        "Gelişmiş profil ve CV optimizasyonu",
        "Seans sonrası aksiyon planı",
        "Öncelikli destek",
      ],
      en: [
        "Access to premium coaches",
        "Priority booking",
        "Advanced profile & CV optimization",
        "Post-session action plan",
        "Priority support",
      ],
    },
    plan: "individual",
    icon: Crown,
    gradient: "from-red-600 to-orange-500",
    cardIcons: [Sparkles, ShieldCheck, Crown],
  },

  coach: {
    tr: {
      badge: "Koç Premium",
      title: "Daha fazla danışana ulaş.\nÖne çıkan koç ol.",
      subtitle: "Profilini öne çıkar, daha fazla danışan eşleşmesi al ve gelirini artır.",
      cta: "Koç Premium Satın Al",
      ctaSecondary: "Nasıl Çalışır?",
      ctaSecondaryPath: "/pricing",
      card1Title: "Öne çıkan profil",
      card1Desc: "Arama sonuçlarında ve ana sayfada öncelikli görünürsün.",
      card2Title: "Daha fazla eşleşme",
      card2Desc: "AI eşleşme algoritmasında premium koçlara öncelik verilir.",
      card3Title: "Gelir analitikleri",
      card3Desc: "Detaylı performans raporları ve gelir takibi.",
      featuresTitle: "Koç Premium ayrıcalıkları",
      price: "299 ₺",
      period: "/ ay",
      priceLabel: "Aylık",
      priceNote: "*Fiyat bilgilendirme amaçlıdır. Ödeme sırasında güncel fiyat geçerlidir.",
    },
    en: {
      badge: "Coach Premium",
      title: "Reach more clients.\nBecome a featured coach.",
      subtitle: "Boost your profile, get more client matches, and grow your income.",
      cta: "Buy Coach Premium",
      ctaSecondary: "How It Works?",
      ctaSecondaryPath: "/pricing",
      card1Title: "Featured profile",
      card1Desc: "Get priority placement in search results and homepage.",
      card2Title: "More matches",
      card2Desc: "AI matching algorithm prioritizes premium coaches.",
      card3Title: "Revenue analytics",
      card3Desc: "Detailed performance reports and income tracking.",
      featuresTitle: "Coach Premium benefits",
      price: "299 ₺",
      period: "/ mo",
      priceLabel: "Monthly",
      priceNote: "*Price is informational. Actual price applies at checkout.",
    },
    features: {
      tr: [
        "Öne Çıkan Koçlar vitrininde görünme",
        "AI eşleşmede öncelik",
        "Premium rozet (Altın)",
        "Detaylı performans raporları",
        "Gelir analitikleri ve tahminleme",
        "Kurumsal iş birliği fırsatlarına erişim",
        "Öncelikli destek",
      ],
      en: [
        "Featured Coaches showcase visibility",
        "Priority in AI matching",
        "Premium badge (Gold)",
        "Detailed performance reports",
        "Revenue analytics & forecasting",
        "Access to corporate collaboration opportunities",
        "Priority support",
      ],
    },
    plan: "coach",
    icon: Star,
    gradient: "from-gray-900 to-gray-700",
    cardIcons: [Star, Users2, BarChart3],
  },

  corporate: {
    tr: {
      badge: "Kurumsal Premium",
      title: "Ekibinizi güçlendirin.\nÖlçeklenebilir koçluk.",
      subtitle: "Çalışanlarınız için profesyonel koçluk programları. Raporlama ve eşleşme tek yerden.",
      cta: "Demo Talep Et",
      ctaSecondary: "Planları İncele",
      ctaSecondaryPath: "/pricing",
      card1Title: "Toplu eşleşme",
      card1Desc: "Rol ve seviye bazlı otomatik koç eşleşmesi.",
      card2Title: "Detaylı raporlama",
      card2Desc: "Ekip bazlı ilerleme raporları, PDF ve e-posta ile.",
      card3Title: "Özel müşteri temsilcisi",
      card3Desc: "SLA kapsamında 24 saat içinde dönüş garantisi.",
      featuresTitle: "Kurumsal Premium ayrıcalıkları",
      price: "Teklif Al",
      period: "",
      priceLabel: "Kurumsal",
      priceNote: "*Fiyat ekip büyüklüğü ve ihtiyaca göre belirlenir. Demo talep edin.",
    },
    en: {
      badge: "Corporate Premium",
      title: "Empower your team.\nScalable coaching.",
      subtitle: "Professional coaching programs for your employees. Reporting and matching in one place.",
      cta: "Request Demo",
      ctaSecondary: "View Plans",
      ctaSecondaryPath: "/pricing",
      card1Title: "Bulk matching",
      card1Desc: "Automatic coach matching by role and level.",
      card2Title: "Detailed reporting",
      card2Desc: "Team-based progress reports via PDF and email.",
      card3Title: "Dedicated account manager",
      card3Desc: "24-hour response guarantee under SLA.",
      featuresTitle: "Corporate Premium benefits",
      price: "Get Quote",
      period: "",
      priceLabel: "Corporate",
      priceNote: "*Pricing depends on team size and needs. Request a demo.",
    },
    features: {
      tr: [
        "Rol ve seviye bazlı ihtiyaç analizi",
        "Doğrulanmış koç havuzundan toplu eşleşme",
        "Seans yönetimi ve takip paneli",
        "İlerleme raporları (PDF / e-posta)",
        "Pilot program ve ilk ölçüm raporu",
        "Özel müşteri temsilcisi",
        "Toplu seans paketleri ve indirimler",
        "Çalışan memnuniyet takibi",
      ],
      en: [
        "Role and level-based needs analysis",
        "Bulk matching from verified coach pool",
        "Session management and tracking panel",
        "Progress reports (PDF / email)",
        "Pilot program and initial measurement report",
        "Dedicated account manager",
        "Bulk session packages and discounts",
        "Employee satisfaction tracking",
      ],
    },
    plan: "corporate",
    icon: Building2,
    gradient: "from-red-700 to-red-500",
    cardIcons: [Target, Zap, Users2],
  },
};

export default function BireyselPremium() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { language } = useLanguage();

  const authed = !!auth?.user;
  const role = auth?.role || "user";
  const lang = (language || "tr") as "tr" | "en";

  // ─── AUTH LOADING GUARD ───
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  // ─── ROLE BAZLI CONFIG SEÇ ───
  const planKey = role === "coach" ? "coach" : role === "corporate" ? "corporate" : "user";
  const config = PLAN_CONFIG[planKey];
  const texts = config[lang] || config.tr;
  const features = config.features[lang] || config.features.tr;
  const PlanIcon = config.icon;
  const CardIcons = config.cardIcons;

  const handleBuy = () => {
    if (!authed) {
      toast.error(
        lang === "tr"
          ? "Satın almak için giriş yapmalısın."
          : "You must log in to purchase."
      );
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (planKey === "corporate") {
      navigate("/corporate/demo-request");
      return;
    }

    navigate(`/paytr/checkout?plan=${config.plan}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className={`bg-gradient-to-r ${config.gradient}`}>
        <div className="max-w-6xl mx-auto px-4 py-14 text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm font-semibold">
            <PlanIcon className="w-4 h-4" />
            {texts.badge}
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight whitespace-pre-line">
            {texts.title}
          </h1>

          <p className="mt-4 max-w-2xl text-white/90 text-lg">{texts.subtitle}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              className="h-12 px-6 rounded-2xl bg-white text-red-700 hover:bg-white/90 font-bold"
              onClick={handleBuy}
            >
              {texts.cta}
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 rounded-2xl border-white/40 text-white hover:bg-white/10"
              onClick={() => navigate(texts.ctaSecondaryPath)}
            >
              {texts.ctaSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: CardIcons[0], title: texts.card1Title, desc: texts.card1Desc },
            { icon: CardIcons[1], title: texts.card2Title, desc: texts.card2Desc },
            { icon: CardIcons[2], title: texts.card3Title, desc: texts.card3Desc },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Icon className="w-5 h-5 text-red-600" />
                  {card.title}
                </div>
                <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* FEATURES + PRICING */}
        <div className="mt-10 rounded-2xl border border-gray-200 p-6">
          <div className="text-lg font-extrabold text-gray-900">{texts.featuresTitle}</div>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {features.map((f: string) => (
              <div key={f} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">{texts.priceLabel}</div>
              <div className="text-3xl font-extrabold text-gray-900">
                {texts.price}{" "}
                {texts.period && (
                  <span className="text-base font-semibold text-gray-500">{texts.period}</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">{texts.priceNote}</div>
            </div>

            <Button
              className="h-12 px-7 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={handleBuy}
            >
              {texts.cta}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
