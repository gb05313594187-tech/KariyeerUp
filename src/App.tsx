// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Index from "@/pages/Index";
import ForCoaches from "@/pages/ForCoaches";
import ForCompanies from "@/pages/ForCompanies";
import MentorCircle from "@/pages/MentorCircle";
import Webinars from "@/pages/Webinars";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import CoachApplication from "@/pages/CoachApplication";
import CoachSelectionProcess from "@/pages/CoachSelectionProcess";

// YENİ SAYFALAR
import Profile from "@/pages/Profile";
import Pricing from "@/pages/Pricing";
import HowItWorks from "@/pages/HowItWorks";   // ✅ NASIL ÇALIŞIR SAYFASI

// KOÇ LİSTESİ SAYFASI (/coaches – Supabase’den gelen koçlar)
import Coaches from "@/pages/coaches";

import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <NotificationProvider>
            <BrowserRouter>
              {/* Üstte tek bir Navbar */}
              <Navbar />

              <Routes>
                {/* Ana sayfa */}
                <Route path="/" element={<Index />} />

                {/* Ana public sayfalar */}
                <Route path="/for-coaches" element={<ForCoaches />} />
                <Route path="/for-companies" element={<ForCompanies />} />
                <Route path="/mentor-circle" element={<MentorCircle />} />
                <Route path="/webinars" element={<Webinars />} />

                {/* Nasıl Çalışır? */}
                <Route path="/how-it-works" element={<HowItWorks />} /> {/* ✅ */}

                {/* Koçlarını Bul */}
                <Route path="/coaches" element={<Coaches />} />

                {/* Pricing */}
                <Route path="/pricing" element={<Pricing />} />

                {/* Profil */}
                <Route path="/profile" element={<Profile />} />

                {/* Auth sayfaları */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected / kullanıcı sayfaları */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/coach-application"
                  element={<CoachApplication />}
                />

                {/* Seçim süreci sayfası */}
                <Route
                  path="/selection-process"
                  element={<CoachSelectionProcess />}
                />

                {/* 404 istersen:
                <Route path="*" element={<NotFound />} />
                */}
              </Routes>

              {/* Altta tek bir global footer */}
              <Footer />
            </BrowserRouter>
          </NotificationProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
