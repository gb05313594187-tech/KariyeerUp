// src/App.tsx
// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Ortak ikon ve butonlar
import { CheckCircle2, Globe2, Star, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

// SAYFALAR
import Home from "@/pages/Index";
import Coaches from "@/pages/Coaches";
import ForCoaches from "@/pages/ForCoaches";
import ForCompanies from "@/pages/ForCompanies";
import MentorCircle from "@/pages/MentorCircle";
import Webinars from "@/pages/Webinars";
import Login from "@/pages/Login";
import BookSession from "@/pages/BookSession";
import Register from "@/pages/Register";
import CoachSelection from "@/pages/CoachSelection";
import CoachApplication from "@/pages/CoachApplication";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Ethics from "@/pages/Ethics";

// ✅ Public koç profil (müşteriye görünen) - AYRI DOSYA
import CoachPublicProfile from "@/pages/CoachPublicProfile";

// ✅ Koçun kendi profili (koç login olunca) - AYRI DOSYA
import CoachSelfProfile from "@/pages/CoachProfile";

// ✅ Panel sayfaları
import UserDashboard from "@/pages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import UserSettings from "@/pages/UserSettings";

import CorporateDashboard from "@/pages/CorporateDashboard";
import CorporateProfile from "@/pages/CorporateProfile";
import CorporateSettings from "@/pages/CorporateSettings";

import CoachDashboard from "@/pages/CoachDashboard";
import CoachSettings from "@/pages/CoachSettings";
import CoachRequests from "@/pages/CoachRequests";

// Eski sayfalar (geriye dönük uyumluluk)
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/Profile";

// LAYOUT
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* -------------------------------------------------
   Nasıl Çalışır sayfası (kullanıcı tarafı)
-------------------------------------------------- */
function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-400 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="flex h-2 w-2 rounded-full bg-lime-300 animate-pulse" />
            Nasıl Çalışır?
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Kariyer Koçuna Ulaşmanın <br />
            <span className="text-yellow-300">En Kolay Yolu</span>
          </h1>
          <p className="text-base md:text-lg text-orange-50 max-w-2xl mx-auto mb-8">
            3 basit adımda koçunu bul, seansını planla ve gelişimini ölç. Hiçbir
            gereksiz karmaşa yok, sadece odaklı ilerleme.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/register">
              <Button className="bg-white text-red-600 hover:bg-orange-50 font-semibold px-8 py-6 rounded-xl text-sm md:text-base">
                Hemen Başla
              </Button>
            </a>
            <a href="/coaches">
              <Button
                variant="outline"
                className="border-white/80 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl text-sm md:text-base"
              >
                Koçları İncele
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 3 ADIM BLOĞU */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              3 Adımda Kariyeer Deneyimi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Apple gibi sade, net ve odaklı: her adımın ne işe yaradığını tam
              olarak bilerek ilerlersin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Adım 1 */}
            <div className="relative border border-orange-100 rounded-2xl p-6 shadow-sm bg-white">
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
                1
              </div>
              <div className="mt-4 mb-4">
                <CheckCircle2 className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profilini Oluştur</h3>
              <p className="text-gray-600 text-sm">
                Kısa bir kayıt formu ile kariyer hedeflerini, sektörünü ve
                deneyim seviyeni belirt. Sadece birkaç dakikanı alır.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="relative border border-orange-100 rounded-2xl p-6 shadow-sm bg-white">
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold shadow-md">
                2
              </div>
              <div className="mt-4 mb-4">
                <Star className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Koçunu Seç &amp; Seans Planla
              </h3>
              <p className="text-gray-600 text-sm">
                Uzmanlık alanı, fiyat ve değerlendirmelere göre koçunu seç.
                Uygun saatleri gör ve tek tıkla online seans oluştur.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="relative border border-orange-100 rounded-2xl p-6 shadow-sm bg-white">
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold shadow-md">
                3
              </div>
              <div className="mt-4 mb-4">
                <LineChart className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gelişimini Takip Et</h3>
              <p className="text-gray-600 text-sm">
                Her seans sonrası notlarını kaydet, hedeflerini güncelle ve
                ilerlemeni temiz bir dashboard üzerinden takip et.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEDEN GÜVENEBİLİRSİN */}
      <section className="py-16 px-4 bg-[#FFF5F0] border-t border-orange-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Neden Kariyeer&apos;e Güvenebilirsin?
            </h2>
            <p className="text-gray-600 mb-6">
              Amacımız sadece randevu platformu olmak değil; kariyer yolculuğunu
              uçtan uca tasarlayan uzun vadeli bir partner olmak.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>ICF veya ulusal akreditasyona sahip koçlar.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Her seans sonrası gerçek kullanıcı değerlendirmeleri.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Şeffaf fiyatlandırma, gizli ücret yok.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Veri güvenliği ve KVKK uyumlu altyapı.</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="text-3xl font-bold text-gray-900 mb-1">15k+</div>
              <p className="text-xs text-gray-500">Tamamlanan seans</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="text-3xl font-bold text-gray-900 mb-1">4.9</div>
              <p className="text-xs text-gray-500">Ortalama kullanıcı puanı</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
              <p className="text-xs text-gray-500">Onaylı koç &amp; mentor</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="text-3xl font-bold text-gray-900 mb-1">30+</div>
              <p className="text-xs text-gray-500">Farklı sektör</p>
            </div>
          </div>
        </div>
      </section>

      {/* ALT CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <Globe2 className="w-10 h-10 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Hazırsan, biz de hazırız.
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            İster ilk işine başlayacak ol, ister C-level hedefle; senin için
            doğru koç ve doğru hızda bir yol haritası tasarlıyoruz.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/register">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl">
                Hemen Ücretsiz Kayıt Ol
              </Button>
            </a>
            <a href="/coaches">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-800 hover:bg-gray-50 px-8 py-6 rounded-xl"
              >
                Koç Listesini Gör
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------
   Uygulama
-------------------------------------------------- */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Ana Sayfa */}
            <Route path="/" element={<Home />} />

            {/* Nasıl Çalışır */}
            <Route path="/nasil-calisir" element={<HowItWorks />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            {/* Public koç listesi ve koç sayfası */}
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/coach/:id" element={<CoachPublicProfile />} />

            {/* Public sayfalar */}
            <Route path="/for-coaches" element={<ForCoaches />} />
            <Route path="/for-companies" element={<ForCompanies />} />
            <Route path="/mentor-circle" element={<MentorCircle />} />
            <Route path="/webinars" element={<Webinars />} />

            {/* Akışlar */}
            <Route path="/coach-selection-process" element={<CoachSelection />} />
            <Route path="/book-session" element={<BookSession />} />
            <Route path="/coach-application" element={<CoachApplication />} />

            {/* ✅ USER PANEL */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/settings" element={<UserSettings />} />

            {/* ✅ CORPORATE PANEL */}
            <Route path="/corporate/dashboard" element={<CorporateDashboard />} />
            <Route path="/corporate/profile" element={<CorporateProfile />} />
            <Route path="/corporate/settings" element={<CorporateSettings />} />

            {/* ✅ COACH PANEL */}
            <Route path="/coach/dashboard" element={<CoachDashboard />} />
            <Route path="/coach/settings" element={<CoachSettings />} />
            <Route path="/coach/requests" element={<CoachRequests />} />
            <Route path="/coach/profile" element={<CoachSelfProfile />} />

            {/* ✅ Eski path'leri geriye dönük yönlendir */}
            <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
            <Route path="/coach-dashboard" element={<Navigate to="/coach/dashboard" replace />} />

            {/* Eski sayfalar (istersen tamamen kaldırabilirsin) */}
            <Route path="/legacy-dashboard" element={<Dashboard />} />
            <Route path="/legacy-profile" element={<ProfilePage />} />

            {/* Hukuki sayfalar */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/ethics" element={<Ethics />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
