// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { Button } from "./components/ui/button";

// CONTEXT PROVIDER'LAR
// Buradaki yolları proje yapına göre düzenle:
// Örn: ./contexts/LanguageContext veya ./contexts/language-context
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";

// SAYFALAR
import Index from "./pages/Index";
import ForCoaches from "./pages/ForCoaches";
import ForCompanies from "./pages/ForCompanies";
import MentorCircle from "./pages/MentorCircle";
import Webinars from "./pages/Webinars";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#FFF5F2]">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                    K
                  </div>
                  <span className="text-lg font-semibold text-gray-900 tracking-tight">
                    Kariyeer
                  </span>
                </Link>

                {/* Menü */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                  <Link to="/coaches" className="hover:text-red-600">
                    Koçlar için
                  </Link>
                  <Link to="/companies" className="hover:text-red-600">
                    Şirketler için
                  </Link>
                  <Link to="/mentor-circle" className="hover:text-red-600">
                    MentorCircle
                  </Link>
                  <Link to="/webinars" className="hover:text-red-600">
                    Webinar
                  </Link>
                </nav>

                {/* Sağ taraf */}
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" className="text-sm">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-red-600 hover:bg-red-700 text-sm">
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              </div>
            </header>

            {/* SAYFA İÇERİĞİ */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/coaches" element={<ForCoaches />} />
                <Route path="/companies" element={<ForCompanies />} />
                <Route path="/mentor-circle" element={<MentorCircle />} />
                <Route path="/webinars" element={<Webinars />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* FOOTER */}
            <footer className="bg-[#050816] text-gray-300 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                      K
                    </div>
                    <span className="text-lg font-semibold text-white">
                      Kariyeer
                    </span>
                  </div>
                  <p className="text-gray-400">
                    Türkiye&apos;nin en kapsamlı kariyer koçluğu platformu.
                    Hedeflerinize ulaşmanız için yanınızdayız.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Hızlı Erişim</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <Link to="/pricing" className="hover:text-white">
                        Ücretlendirme
                      </Link>
                    </li>
                    <li>
                      <Link to="/mentor-circle" className="hover:text-white">
                        MentorCircle
                      </Link>
                    </li>
                    <li>
                      <Link to="/webinars" className="hover:text-white">
                        Webinarlar
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="hover:text-white">
                        İletişim
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Kurumsal</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <Link to="/about" className="hover:text-white">
                        Hakkımızda
                      </Link>
                    </li>
                    <li>
                      <Link to="/partnership" className="hover:text-white">
                        İş Ortaklıkları
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/kullanim-sozlesmesi"
                        className="hover:text-white"
                      >
                        Kullanım Sözleşmesi
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/kvkk-aydinlatma"
                        className="hover:text-white"
                      >
                        KVKK Aydınlatma
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">İletişim</h4>
                  <p className="text-gray-400">
                    Levent, İstanbul
                    <br />
                    destek@kariyeer.com
                    <br />
                    +90 (850) XXX XX XX
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Kariyeer.com – Tüm hakları
                saklıdır.
              </div>
            </footer>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
