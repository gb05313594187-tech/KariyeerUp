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

// ✅ YENİ: Hazırladığımız Onboarding Modal'ı import ediyoruz
import { OnboardingModal } from "@/components/OnboardingModal";

/* ================= SESSION YÜKLEME - SİHİRLİ KOD ================= */
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
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">
          Oturum kontrol ediliyor...
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
import CoachPublicProfile from "@/pages/CoachPublicProfile";

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

/* ================= ANA İÇERİK YÖNETİCİSİ (KRİTİK GÜNCELLEME) ================= */
// Onboarding'in tam sayfa olması için Router'ı ve Layout'u kontrol eden ara katman
function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (isAuthenticated && user && !loading) {
        try {
          const { data, error } = await supabase
            .from('career_profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (!data && !error) {
            setShowOnboarding(true);
          }
        } catch (err) {
          console.error("Profil kontrol hatası:", err);
        }
      }
      setIsCheckingProfile(false);
    };

    checkProfileStatus();
  }, [isAuthenticated, user, loading]);

  // Yükleme sırasında boş ekran veya spinner göster
  if (loading || (isAuthenticated && isCheckingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full"></div>
          <div className="text-slate-400 font-bold tracking-widest text-xs uppercase">Hafıza Senkronize Ediliyor...</div>
        </div>
      </div>
    );
  }

  // ✅ EĞER ONBOARDING GEREKLİYSE: Sadece OnboardingModal'ı render et.
  // Navbar, Footer ve Router'daki sayfalar render edilmez.
  if (showOnboarding && user) {
    return (
      <OnboardingModal 
        isOpen={true} 
        userId={user.id} 
        onComplete={() => setShowOnboarding(false)} 
      />
    );
  }

  // ✅ PROFİL TAMAMSA VEYA GİRİŞ YAPILMAMIŞSA: Normal site akışı
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

        {/* PUBLIC + PROTECTED */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<SocialHome />} />
          <Route path="jobs" element={<JobBoard />} />
          <Route path="jobs/new" element={<CreateJob />} />
          <Route path="boost" element={<Boost />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="mentor-circle" element={<MentorCircle />} />
          <Route path="webinars" element={<Webinars />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="coaches" element={<Coaches />} />
          <Route path="coach/:slug" element={<CoachSelfProfile />} />

          {/* USER */}
          <Route
            path="user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/profile/edit"
            element={
              <ProtectedRoute>
                <UserProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/settings"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />

          {/* CORPORATE */}
          <Route
            path="corporate/dashboard"
            element={
              <ProtectedRoute>
                <CorporateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="corporate/profile"
            element={
              <ProtectedRoute>
                <CorporateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="corporate/settings"
            element={
              <ProtectedRoute>
                <CorporateSettings />
              </ProtectedRoute>
            }
          />

          {/* COACH */}
          <Route
            path="coach/dashboard"
            element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="coach/profile"
            element={
              <ProtectedRoute>
                <CoachSelfProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="coach/settings"
            element={
              <ProtectedRoute>
                <CoachSettings />
              </ProtectedRoute>
            }
          />

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
