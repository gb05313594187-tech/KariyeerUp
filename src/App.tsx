// src/App.tsx
// @ts-nocheck

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "sonner";

// ✅ AUTH PROVIDER
import { AuthProvider } from "@/contexts/AuthContext";

// LAYOUT (Public)
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ✅ Admin Layout
import AdminLayout from "@/layouts/AdminLayout";

// SAYFALAR
import Home from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Coaches from "@/pages/Coaches";
import ForCoaches from "@/pages/ForCoaches";
import ForCompanies from "@/pages/ForCompanies";
import MentorCircle from "@/pages/MentorCircle";
import Webinars from "@/pages/Webinars";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CoachSelection from "@/pages/CoachSelection";
import CoachApplication from "@/pages/CoachApplication";

// ✅ Nasıl Çalışır
import HowItWorks from "@/pages/Howitworks";

// ✅ LEGAL
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Returns from "@/pages/Returns";
import DistanceSales from "@/pages/DistanceSales";
import Terms from "@/pages/Terms";
import Ethics from "@/pages/Ethics";

import CoachPublicProfile from "@/pages/CoachPublicProfile";
import CoachSelfProfile from "@/pages/CoachProfile";

// ✅ SITEMAP
import Sitemap from "@/pages/Sitemap";

// USER
import UserDashboard from "@/pages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import UserSettings from "@/pages/UserSettings";
import UserProfileEdit from "@/pages/UserProfileEdit";

// CORPORATE
import CorporateDashboard from "@/pages/CorporateDashboard";
import CorporateProfile from "@/pages/CorporateProfile";
import CorporateSettings from "@/pages/CorporateSettings";

// COACH
import CoachDashboard from "@/pages/CoachDashboard";
import CoachSettings from "@/pages/CoachSettings";
import CoachRequests from "@/pages/CoachRequests";

// ADMIN
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProfile from "@/pages/AdminProfile";
import AdminSettings from "@/pages/AdminSettings";

// ✅ CHECKOUT / PAYMENT SUCCESS
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";

// ✅ PAYTR
import PaytrCheckout from "@/pages/PaytrCheckout";

// ✅ PREMIUM LANDING
import BireyselPremium from "@/pages/BireyselPremium";

// ✅ NEW: SESSION JOIN (EKLENDİ)
import SessionJoin from "@/pages/SessionJoin";

// ✅ NEW: SESSION ROOM + LISTS (EKLENDİ)
import SessionRoom from "@/pages/SessionRoom";
import UserSessions from "@/pages/UserSessions";
import CoachSessions from "@/pages/CoachSessions";

// ✅ AUTH EXTRA PAGES
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// ✅ NEW: SOCIAL HOME + JOB BOARD (EKLENDİ)
import SocialHome from "@/pages/Home";
import JobBoard from "@/pages/JobBoard";

// ✅ NEW: INTERVIEW PAGE (EKLENDİ)
import InterviewPage from "@/pages/Interview";

/* -------------------------------------------------
   Public Layout
-------------------------------------------------- */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* -------------------------------------------------
   APP
-------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ROOT - Düzenlendi: element={<PublicLayout />} şeklinde olmalı */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />

            {/* ✅ NEW: SOCIAL HOME ROUTE (EKLENDİ) */}
            <Route path="home" element={<SocialHome />} />

            {/* ✅ NEW: JOB BOARD ROUTE (EKLENDİ) */}
            <Route path="jobs" element={<JobBoard />} />

            {/* ✅ NEW: INTERVIEW PAGE ROUTE (EKLENDİ) */}
            <Route path="interview/:roomName" element={<InterviewPage />} />

            {/* SITEMAP */}
            <Route path="sitemap.xml" element={<Sitemap />} />

            {/* PREMIUM */}
            <Route path="bireysel-premium" element={<BireyselPremium />} />

            {/* PRICING */}
            <Route path="pricing" element={<Pricing />} />

            {/* CHECKOUT FLOW */}
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-success" element={<PaymentSuccess />} />

            {/* ✅ NEW: JOIN SESSION ROUTE */}
            <Route path="session/:id/join" element={<SessionJoin />} />

            {/* ✅ NEW: SESSION ROOM ROUTE */}
            <Route path="session/:id/room" element={<SessionRoom />} />

            {/* ✅ NEW: USER SESSIONS LIST (legacy /dashboard) */}
            <Route path="dashboard/sessions" element={<UserSessions />} />

            {/* ✅ NEW: COACH SESSIONS LIST */}
            <Route path="coach/sessions" element={<CoachSessions />} />

            {/* ✅ PAYTR */}
            <Route path="paytr/checkout" element={<PaytrCheckout />} />
            <Route path="paytr-checkout" element={<PaytrCheckout />} />

            {/* BookSession */}
            <Route
              path="book-session"
              element={<Navigate to="/coaches" replace />}
            />

            {/* How it works */}
            <Route path="nasil-calisir" element={<HowItWorks />} />
            <Route path="how-it-works" element={<HowItWorks />} />

            <Route path="coaches" element={<Coaches />} />

            {/* COACH PUBLIC PROFILE */}
            <Route path="coach/:slugOrId" element={<CoachPublicProfile />} />

            <Route path="for-coaches" element={<ForCoaches />} />
            <Route path="for-companies" element={<ForCompanies />} />
            <Route path="mentor-circle" element={<MentorCircle />} />
            <Route path="webinars" element={<Webinars />} />
            <Route
              path="coach-selection-process"
              element={<CoachSelection />}
            />
            <Route path="coach-application" element={<CoachApplication />} />

            {/* USER */}
            <Route path="user/dashboard" element={<UserDashboard />} />
            <Route path="user/profile" element={<UserProfile />} />
            <Route path="user/profile/edit" element={<UserProfileEdit />} />
            <Route path="user/settings" element={<UserSettings />} />

            {/* CORPORATE */}
            <Route
              path="corporate/dashboard"
              element={<CorporateDashboard />}
            />
            <Route path="corporate/profile" element={<CorporateProfile />} />
            <Route
              path="corporate/settings"
              element={<CorporateSettings />}
            />

            {/* COACH */}
            <Route path="coach/dashboard" element={<CoachDashboard />} />
            <Route path="coach/profile" element={<CoachSelfProfile />} />
            <Route path="coach/settings" element={<CoachSettings />} />
            <Route path="coach/requests" element={<CoachRequests />} />

            {/* LEGAL */}
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="returns" element={<Returns />} />
            <Route path="distance-sales" element={<DistanceSales />} />
            <Route path="terms" element={<Terms />} />
            <Route path="ethics" element={<Ethics />} />

            {/* AUTH */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* LEGACY */}
            <Route
              path="dashboard"
              element={<Navigate to="/user/dashboard" replace />}
            />
            <Route
              path="profile"
              element={<Navigate to="/user/profile" replace />}
            />
            <Route
              path="coach-dashboard"
              element={<Navigate to="/coach/dashboard" replace />}
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
