// src/components/Footer.tsx
// @ts-nocheck
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto border-t-4 border-orange-500">
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
              Türkiye'nin en kapsamlı kariyer koçluğu platformu.
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Avcılar, İstanbul</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>0531 359 41 87</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>destek@kariyeer.com</span>
              </div>
            </div>
          </div>

          {/* 2. KOLON */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b-2 border-orange-500 inline-block pb-1">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/coaches" className="hover:text-orange-400 transition-colors">Koçları İncele</Link></li>
              <li><Link to="/for-companies" className="hover:text-orange-400 transition-colors">Kurumsal Çözümler</Link></li>
              <li><Link to="/mentor-circle" className="hover:text-orange-400 transition-colors">MentorCircle</Link></li>
              <li><Link to="/webinars" className="hover:text-orange-400 transition-colors">Webinarlar</Link></li>
              <li><Link to="/coach-application" className="hover:text-orange-400 transition-colors">Koç Başvurusu</Link></li>
            </ul>
          </div>

          {/* 3. KOLON */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b-2 border-orange-500 inline-block pb-1">
              Kurumsal
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-orange-400 transition-colors">Hakkımızda & Vizyon</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition-colors">İletişim & Destek</Link></li>
              <li><Link to="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/distance-sales" className="hover:text-orange-400 transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link to="/returns" className="hover:text-orange-400 transition-colors">İptal ve İade Koşulları</Link></li>
            </ul>
          </div>

          {/* 4. KOLON */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-white mb-4">Mobil Uygulamamız</h3>
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
                <ShieldCheck className="w-5 h-5" />
                <span>256-Bit SSL Güvenli Ödeme</span>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex justify-center">
                <img
                  src="/logos/payment-band.png"
                  alt="iyzico ile güvenli ödeme"
                  className="h-6 md:h-7 w-auto opacity-90"
                  style={{ filter: "saturate(0.9) contrast(0.95)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="text-sm text-gray-500 text-center">
          <p>&copy; 2025 Kariyeer.com - Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
