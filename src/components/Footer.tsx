// src/components/Footer.tsx
// @ts-nocheck
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* ════════════════════════════════════════════
   TRANSLATIONS (Yasal Statüye Uygun Güncellendi)
   ════════════════════════════════════════════ */
const translations = {
  tr: {
    slogan: "Türkiye'nin lider kariyer mentorluğu ve gelişim platformu.",
    address: "Avcılar, İstanbul",
    
    quickAccess: "Gelişim Merkezi",
    browseCoaches: "Mentorları İncele",
    corporateSolutions: "Kurumsal Programlar",
    mentorCircle: "MentorCircle",
    webinars: "Canlı Eğitimler",
    coachApplication: "Mentor Başvurusu",
    
    corporate: "Yasal & Kurumsal",
    aboutVision: "Hakkımızda & Vizyon",
    contactSupport: "İletişim & Destek",
    privacyPolicy: "Gizlilik Politikası",
    distanceSales: "Mesafeli Satış Sözleşmesi",
    returnsPolicy: "İptal ve İade Koşulları",
    
    mobileApp: "Mobil Uygulamamız",
    sslSecure: "256-Bit SSL Güvenli Ödeme",
    securePayment: "iyzico ile güvenli ödeme",
    
    copyright: "© 2026 Kariyeer.com - Tüm hakları saklıdır.",
    legalNotice: "Kariyeer.com bir teknoloji platformudur ve 4904 sayılı Kanun kapsamında Özel İstihdam Bürosu faaliyeti yürütmemektedir. Platformumuzda sunulan hizmetler eğitim ve kariyer mentorluğu kapsamındadır. İş bulma veya işe yerleştirme garantisi verilmez."
  },
  en: {
    slogan: "Turkey's leading career mentoring and growth platform.",
    address: "Avcılar, Istanbul",
    
    quickAccess: "Growth Hub",
    browseCoaches: "Browse Mentors",
    corporateSolutions: "Corporate Programs",
    mentorCircle: "MentorCircle",
    webinars: "Live Webinars",
    coachApplication: "Mentor Application",
    
    corporate: "Legal & Corporate",
    aboutVision: "About Us & Vision",
    contactSupport: "Contact & Support",
    privacyPolicy: "Privacy Policy",
    distanceSales: "Distance Sales Agreement",
    returnsPolicy: "Cancellation & Refund Policy",
    
    mobileApp: "Our Mobile App",
    sslSecure: "256-Bit SSL Secure Payment",
    securePayment: "Secure payment with iyzico",
    
    copyright: "© 2026 Kariyeer.com - All rights reserved.",
    legalNotice: "Kariyeer.com is a technology platform and does not operate as a Private Employment Agency under Law No. 4904. Services offered are within the scope of education and career mentoring. No employment or job placement guarantee is provided."
  },
  // ... ar ve fr dillerini de benzer şekilde mentorluk odaklı güncelleyebilirsin
};

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language || "tr"] || translations.tr;
  const isRTL = language === "ar";

  return (
    <footer 
      className="bg-gray-900 text-white pt-16 pb-8 mt-auto border-t-4 border-orange-600"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* 1. KOLON */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
                K
              </div>
              <span className="font-black text-2xl tracking-tighter italic">Kariyeer</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              {t.slogan}
            </p>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span dir="ltr">destek@kariyeer.com</span>
              </div>
            </div>
          </div>

          {/* 2. KOLON */}
          <div className="space-y-4">
            <h3 className="font-black text-xs uppercase tracking-widest text-orange-500 border-b border-gray-800 pb-2">
              {t.quickAccess}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 font-bold">
              <li><Link to="/coaches" className="hover:text-white transition-colors">{t.browseCoaches}</Link></li>
              <li><Link to="/for-companies" className="hover:text-white transition-colors">{t.corporateSolutions}</Link></li>
              <li><Link to="/mentor-circle" className="hover:text-white transition-colors">{t.mentorCircle}</Link></li>
              <li><Link to="/webinars" className="hover:text-white transition-colors">{t.webinars}</Link></li>
              <li><Link to="/coach-application" className="hover:text-white transition-colors">{t.coachApplication}</Link></li>
            </ul>
          </div>

          {/* 3. KOLON */}
          <div className="space-y-4">
            <h3 className="font-black text-xs uppercase tracking-widest text-orange-500 border-b border-gray-800 pb-2">
              {t.corporate}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 font-bold">
              <li><Link to="/about" className="hover:text-white transition-colors">{t.aboutVision}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t.contactSupport}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t.privacyPolicy}</Link></li>
              <li><Link to="/distance-sales" className="hover:text-white transition-colors">{t.distanceSales}</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">{t.returnsPolicy}</Link></li>
            </ul>
          </div>

          {/* 4. KOLON */}
          <div className="space-y-6">
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-white mb-4">{t.mobileApp}</h3>
              <div className="flex flex-col gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-9 w-28 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-9 w-28 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t.sslSecure}</span>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 flex justify-center italic font-black text-[10px] text-gray-500 uppercase tracking-tighter">
                Secure with iyzico
              </div>
            </div>
          </div>
        </div>

        {/* YASAL BİLGİLENDİRME BLOĞU - İŞKUR KRİTİK NOKTA */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-orange-600/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-[10px] md:text-[11px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest max-w-4xl">
              {t.legalNotice}
            </p>
          </div>
        </div>

        <div className="text-[10px] font-bold text-gray-600 text-center mt-8 uppercase tracking-widest">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
