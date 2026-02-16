import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactGA from "react-ga4"; // Eklendi

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('kariyeer_cookie_consent');
    if (!consent) {
      // 2 saniye sonra göster
      setTimeout(() => setShowConsent(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kariyeer_cookie_consent', 'accepted');
    
    // Google Analytics'i aktif et
    ReactGA.set({ consent: "granted" });
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('kariyeer_cookie_consent', 'rejected');
    
    // Google Analytics izinlerini kapat (Yasal uyum)
    ReactGA.set({ consent: "denied" });
    
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="max-w-4xl mx-auto border-red-200 shadow-2xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cookie className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'tr' ? 'Çerez Kullanımı' : 'Cookie Usage'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'tr'
                  ? 'Web sitemizde deneyiminizi iyileştirmek, site kullanımını analiz etmek ve kişiselleştirilmiş içerik sunmak için çerezler kullanıyoruz. Siteyi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.'
                  : 'We use cookies on our website to improve your experience, analyze site usage and provide personalized content. By continuing to use the site, you accept the use of cookies.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAccept}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {language === 'tr' ? 'Kabul Et' : 'Accept'}
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  {language === 'tr' ? 'Reddet' : 'Reject'}
                </Button>
                <Link to="/privacy"> {/* Rotaya uygun güncellendi */}
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    {language === 'tr' ? 'Detaylı Bilgi' : 'More Info'}
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
