import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactGA from "react-ga4";

const GA_ID = "G-Y6SC2CRG53";

const translations = {
  tr: {
    title: "Çerez Kullanımı",
    description:
      "Web sitemizde deneyiminizi iyileştirmek, site kullanımını analiz etmek ve kişiselleştirilmiş içerik sunmak için çerezler kullanıyoruz. Siteyi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.",
    accept: "Kabul Et",
    reject: "Reddet",
    moreInfo: "Detaylı Bilgi",
  },
  en: {
    title: "Cookie Usage",
    description:
      "We use cookies on our website to improve your experience, analyze site usage and provide personalized content. By continuing to use the site, you accept the use of cookies.",
    accept: "Accept",
    reject: "Reject",
    moreInfo: "More Info",
  },
  ar: {
    title: "استخدام ملفات تعريف الارتباط",
    description:
      "نستخدم ملفات تعريف الارتباط على موقعنا لتحسين تجربتك وتحليل استخدام الموقع وتقديم محتوى مخصص. من خلال الاستمرار في استخدام الموقع، فإنك توافق على استخدام ملفات تعريف الارتباط.",
    accept: "قبول",
    reject: "رفض",
    moreInfo: "مزيد من المعلومات",
  },
  fr: {
    title: "Utilisation des cookies",
    description:
      "Nous utilisons des cookies sur notre site web pour améliorer votre expérience, analyser l'utilisation du site et fournir un contenu personnalisé. En continuant à utiliser le site, vous acceptez l'utilisation des cookies.",
    accept: "Accepter",
    reject: "Refuser",
    moreInfo: "En savoir plus",
  },
};

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();

  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  useEffect(() => {
    const consent = localStorage.getItem("kariyeer_cookie_consent");
    if (!consent) {
      setTimeout(() => setShowConsent(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("kariyeer_cookie_consent", "accepted");

    if (!window.__ga_initialized) {
      ReactGA.initialize(GA_ID);
      window.__ga_initialized = true;
    }
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
    });

    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem("kariyeer_cookie_consent", "rejected");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="max-w-4xl mx-auto border-red-200 shadow-2xl">
        <CardContent className="pt-6">
          <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cookie className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.description}
              </p>
              <div className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : ""}`}>
                <Button
                  onClick={handleAccept}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {t.accept}
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  {t.reject}
                </Button>
                <Link to="/privacy">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {t.moreInfo}
                  </Button>
                </Link>
              </div>
            </div>
            <button
              onClick={handleReject}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
