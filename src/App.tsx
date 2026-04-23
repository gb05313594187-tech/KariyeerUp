// src/App.tsx
// @ts-nocheck
import { SessionRefresher } from "@/components/SessionRefresher";
import { useEffect, useState } from "react"; 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import ReactGA from "react-ga4";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AdminLayout from "@/layouts/AdminLayout";

/* ================= SESSION YÜKLEME ================= */
function SessionLoader() {
  useEffect(() => {
    supabase.auth.getSession();
    const interval = setInterval(() => {
      supabase.auth.getSession();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return null;
}

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth(); // AuthContext'ten gelen yeni prop ismini kullandım

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mr-3"></div>
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Gelişim Verileri Kontrol Ediliyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ================= SAYFALAR ================= */
import Home from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Boost from "@/pages/Boost";
import MentorCircle from "@/pages/MentorCircle";
import Webinars from "@/pages/Webinars";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import UserDashboard from "@/pages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import UserSettings from "@/pages/UserSettings";
import UserProfileEdit from "@/pages/UserProfileEdit";

import CorporateDashboard from "@/pages/CorporateDashboard";
import CorporateProfile from "@/pages/CorporateProfile";
import CorporateSettings from "@/pages/CorporateSettings";

import CoachDashboard from "@/pages/CoachDashboard";
import CoachSelfProfile from "@/pages/CoachProfile";
import CoachSettings from "@/pages/CoachSettings";

import AdminDashboard from "@/pages/AdminDashboard";
import AdminProfile from "@/pages/AdminProfile";
import AdminSettings from "@/pages/AdminSettings";
import InvestorDashboard from "@/pages/InvestorDashboard";

import SocialHome from "@/pages/Home";
import JobBoard from "@/pages/JobBoard";
import CreateJob from "@/pages/CreateJob";

import Coaches from "@/pages/Coaches";
// Mentor detay sayfası için isimlendirme güncellendi

/* ================= ANALYTICS ================= */
const GA_ID = "G-R39ELRDLKQ";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem("kariyeer_cookie_consent");
    if (consent === "accepted") {
      if (!window.__ga_initialized) {
        ReactGA.initialize(GA_ID);
        window.__ga_initialized = true;
      }
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

/* ================= PUBLIC LAYOUT ================= */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

/* ================= ANA İÇERİK YÖNETİCİSİ ================= */
function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full shadow-xl shadow-orange-100"></div>
      </div>
    );
  }

  return (
    <Router>
      <SessionLoader />
      <SessionRefresher />
      <AnalyticsTracker />
      <Toaster richColors position="top-right" />

      <Routes>
        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="investor" element={<InvestorDashboard />} />
        </Route>

        {/* PUBLIC + PROTECTED (YASAL URL GÜNCELLEMELERİ YAPILDI) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<SocialHome />} />
          
          {/* YASAL GÜNCELLEME: 'jobs' yerine 'programlar' */}
          <Route path="programlar" element={<JobBoard />} />
          <Route path="programlar/yeni" element={<CreateJob />} />
          
          <Route path="boost" element={<Boost />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="mentor-circle" element={<MentorCircle />} />
          <Route path="webinars" element={<Webinars />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* YASAL GÜNCELLEME: 'coaches' yerine 'mentorlar' */}
          <Route path="mentorlar" element={<Coaches />} />
          <Route path="mentor/:slug" element={<CoachSelfProfile />} />

          {/* DANIŞAN (USER) PANELİ */}
          <Route
            path="user/gelisim-paneli"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/profil"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/profil/duzenle"
            element={
              <ProtectedRoute>
                <UserProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/ayarlar"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />

          {/* KURUMSAL (CORPORATE) PANELİ */}
          <Route
            path="kurumsal/yonetim"
            element={
              <ProtectedRoute>
                <CorporateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="kurumsal/profil"
            element={
              <ProtectedRoute>
                <CorporateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="kurumsal/ayarlar"
            element={
              <ProtectedRoute>
                <CorporateSettings />
              </ProtectedRoute>
            }
          />

          {/* MENTOR (COACH) PANELİ */}
          <Route
            path="mentor/yonetim"
            element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="mentor/profil"
            element={
              <ProtectedRoute>
                <CoachSelfProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="mentor/ayarlar"
            element={
              <ProtectedRoute>
                <CoachSettings />
              </ProtectedRoute>
            }
          />

          {/* Geriye dönük uyumluluk veya hatalı linkleri ana sayfaya çek */}
          <Route path="jobs" element={<Navigate to="/programlar" replace />} />
          <Route path="coaches" element={<Navigate to="/mentorlar" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

/* ================= APP ================= */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
