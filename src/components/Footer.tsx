// src/components/Footer.tsx
// @ts-nocheck
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* ════════════════════════════════════════════
   TRANSLATIONS
   ════════════════════════════════════════════ */
const translations = {
  tr: {
    slogan: "Türkiye'nin en kapsamlı kariyer koçluğu platformu.",
    address: "Avcılar, İstanbul",
    
    quickAccess: "Hızlı Erişim",
    browseCoaches: "Koçları İncele",
    corporateSolutions: "Kurumsal Çözümler",
    mentorCircle: "MentorCircle",
    webinars: "Webinarlar",
    coachApplication: "Koç Başvurusu",
    
    corporate: "Kurumsal",
    aboutVision: "Hakkımızda & Vizyon",
    contactSupport: "İletişim & Destek",
    privacyPolicy: "Gizlilik Politikası",
    distanceSales: "Mesafeli Satış Sözleşmesi",
    returnsPolicy: "İptal ve İade Koşulları",
    
    mobileApp: "Mobil Uygulamamız",
    sslSecure: "256-Bit SSL Güvenli Ödeme",
    securePayment: "iyzico ile güvenli ödeme",
    
    copyright: "© 2026 Kariyeer.com - Tüm hakları saklıdır.",
  },
  en: {
    slogan: "Turkey's most comprehensive career coaching platform.",
    address: "Avcılar, Istanbul",
    
    quickAccess: "Quick Access",
    browseCoaches: "Browse Coaches",
    corporateSolutions: "Corporate Solutions",
    mentorCircle: "MentorCircle",
    webinars: "Webinars",
    coachApplication: "Coach Application",
    
    corporate: "Corporate",
    aboutVision: "About Us & Vision",
    contactSupport: "Contact & Support",
    privacyPolicy: "Privacy Policy",
    distanceSales: "Distance Sales Agreement",
    returnsPolicy: "Cancellation & Refund Policy",
    
    mobileApp: "Our Mobile App",
    sslSecure: "256-Bit SSL Secure Payment",
    securePayment: "Secure payment with iyzico",
    
    copyright: "© 2026 Kariyeer.com - All rights reserved.",
  },
  ar: {
    slogan: "أشمل منصة للتدريب المهني في تركيا.",
    address: "أفجيلار، إسطنبول",
    
    quickAccess: "الوصول السريع",
    browseCoaches: "تصفح المدربين",
    corporateSolutions: "الحلول المؤسسية",
    mentorCircle: "دائرة الموجهين",
    webinars: "الندوات عبر الإنترنت",
    coachApplication: "طلب التدريب",
    
    corporate: "الشركة",
    aboutVision: "من نحن والرؤية",
    contactSupport: "التواصل والدعم",
    privacyPolicy: "سياسة الخصوصية",
    distanceSales: "اتفاقية البيع عن بُعد",
    returnsPolicy: "سياسة الإلغاء والاسترداد",
    
    mobileApp: "تطبيقنا للهاتف",
    sslSecure: "دفع آمن بتشفير 256-Bit SSL",
    securePayment: "دفع آمن عبر iyzico",
    
    copyright: "© 2026 Kariyeer.com - جميع الحقوق محفوظة.",
  },
  fr: {
    slogan: "La plateforme de coaching carrière la plus complète de Turquie.",
    address: "Avcılar, Istanbul",
    
    quickAccess: "Accès Rapide",
    browseCoaches: "Parcourir les Coachs",
    corporateSolutions: "Solutions Entreprises",
    mentorCircle: "MentorCircle",
    webinars: "Webinaires",
    coachApplication: "Candidature Coach",
    
    corporate: "Entreprise",
    aboutVision: "À Propos & Vision",
    contactSupport: "Contact & Support",
    privacyPolicy: "Politique de Confidentialité",
    distanceSales: "Contrat de Vente à Distance",
    returnsPolicy: "Conditions d'Annulation et Remboursement",
    
    mobileApp: "Notre Application Mobile",
    sslSecure: "Paiement Sécurisé SSL 256-Bit",
    securePayment: "Paiement sécurisé avec iyzico",
    
    copyright: "© 2026 Kariyeer.com - Tous droits réservés.",
  },
};

/* ════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════ */
export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language || "tr"] || translations.tr;

  // Arapça için RTL desteği
  const isRTL = language === "ar";

  return (
    <footer 
      className="bg-gray-900 text-white pt-16 pb-8 mt-auto border-t-4 border-orange-500"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* 1. KOLON */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <span className="font-bold text-2xl">Kariyeer</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {t.slogan}
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span dir="ltr">0531 359 41 87</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span dir="ltr">destek@kariyeer.com</span>
              </div>
            </div>
          </div>

          {/* 2. KOLON */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b-2 border-orange-500 inline-block pb-1">
              {t.quickAccess}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/coaches" className="hover:text-orange-400 transition-colors">
                  {t.browseCoaches}
                </Link>
              </li>
              <li>
                <Link to="/for-companies" className="hover:text-orange-400 transition-colors">
                  {t.corporateSolutions}
                </Link>
              </li>
              <li>
                <Link to="/mentor-circle" className="hover:text-orange-400 transition-colors">
                  {t.mentorCircle}
                </Link>
              </li>
              <li>
                <Link to="/webinars" className="hover:text-orange-400 transition-colors">
                  {t.webinars}
                </Link>
              </li>
              <li>
                <Link to="/coach-application" className="hover:text-orange-400 transition-colors">
                  {t.coachApplication}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. KOLON */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b-2 border-orange-500 inline-block pb-1">
              {t.corporate}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  {t.aboutVision}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  {t.contactSupport}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-orange-400 transition-colors">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/distance-sales" className="hover:text-orange-400 transition-colors">
                  {t.distanceSales}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-orange-400 transition-colors">
                  {t.returnsPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. KOLON */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-white mb-4">{t.mobileApp}</h3>
              <div className="flex flex-col gap-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-10 w-32 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10 w-32 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            {/* SSL + ÖDEME LOGOLARI */}
            <div className="pt-4 border-t border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>{t.sslSecure}</span>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex justify-center">
                <img
                  src="/logos/payment-band.png"
                  alt={t.securePayment}
                  className="h-6 md:h-7 w-auto opacity-90"
                  style={{ filter: "saturate(0.9) contrast(0.95)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* COPYRIGHT - ÇEVİRİLMİŞ */}
        <div className="text-sm text-gray-500 text-center">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
