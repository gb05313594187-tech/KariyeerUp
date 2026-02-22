// src/App.tsx
// @ts-nocheck

import { useEffect } from "react";
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

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AdminLayout from "@/layouts/AdminLayout";

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // 🔥 Kritik: Loading bitmeden karar verme
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

import SocialHome from "@/pages/Home";
import JobBoard from "@/pages/JobBoard";
import CreateJob from "@/pages/CreateJob";

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

/* ================= APP ================= */

export default function App() {
  return (
    <AuthProvider>
      <Router>
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
          </Route>

          {/* PUBLIC + USER + CORPORATE + COACH */}
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

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
