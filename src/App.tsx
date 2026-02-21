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
import UserLayout from "@/layouts/UserLayout";

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ================= SAYFALAR ================= */

import Home from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Boost from "@/pages/Boost";
import Coaches from "@/pages/Coaches";
import ForCoaches from "@/pages/ForCoaches";
import ForCompanies from "@/pages/ForCompanies";
import MentorCircle from "@/pages/MentorCircle";
import Webinars from "@/pages/Webinars";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CoachSelection from "@/pages/CoachSelection";
import CoachApplication from "@/pages/CoachApplication";
import HowItWorks from "@/pages/Howitworks";

import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Returns from "@/pages/Returns";
import DistanceSales from "@/pages/DistanceSales";
import Terms from "@/pages/Terms";
import Ethics from "@/pages/Ethics";

import CoachPublicProfile from "@/pages/CoachPublicProfile";
import CoachSelfProfile from "@/pages/CoachProfile";
import Sitemap from "@/pages/Sitemap";

import SavedItemsPage from "@/pages/SavedItems";
import MyAssessmentsPage from "@/pages/MyAssessments";
import MyApplicationsPage from "@/pages/MyApplications";
import MyReportsPage from "@/pages/MyReports";
import MyCalendarPage from "@/pages/MyCalendar";
import MyInterviewsPage from "@/pages/MyInterviews";
import MySessionsHubPage from "@/pages/MySessionsHub";

import UserDashboard from "@/pages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import UserSettings from "@/pages/UserSettings";
import UserProfileEdit from "@/pages/UserProfileEdit";

import CorporateDashboard from "@/pages/CorporateDashboard";
import CorporateProfile from "@/pages/CorporateProfile";
import CorporateSettings from "@/pages/CorporateSettings";

import CoachDashboard from "@/pages/CoachDashboard";
import CoachSettings from "@/pages/CoachSettings";
import CoachRequests from "@/pages/CoachRequests";

import AdminDashboard from "@/pages/AdminDashboard";
import AdminProfile from "@/pages/AdminProfile";
import AdminSettings from "@/pages/AdminSettings";
import AdminHireDashboard from "@/pages/AdminHireDashboard";

import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaytrCheckout from "@/pages/PaytrCheckout";

import BireyselPremium from "@/pages/BireyselPremium";

import SessionJoin from "@/pages/SessionJoin";
import SessionRoom from "@/pages/SessionRoom";
import UserSessions from "@/pages/UserSessions";
import CoachSessions from "@/pages/CoachSessions";

import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import SocialHome from "@/pages/Home";
import JobBoard from "@/pages/JobBoard";
import CreateJob from "@/pages/CreateJob";

import InterviewPage from "@/pages/Interview";
import CorporateJobs from "@/pages/CorporateJobs";
import MeetingRoom from "@/pages/MeetingRoom";

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
          {/* FULLSCREEN */}
          <Route path="/meeting/:roomName" element={<MeetingRoom />} />
          <Route path="/interview/:roomName" element={<InterviewPage />} />
          <Route path="/session/:id/room" element={<SessionRoom />} />

          {/* ADMIN PANEL */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="hiring" element={<AdminHireDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* PUBLIC */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<SocialHome />} />
            <Route path="jobs" element={<JobBoard />} />
            <Route path="jobs/new" element={<CreateJob />} />
            <Route path="corporate/jobs" element={<CorporateJobs />} />
            <Route path="boost" element={<Boost />} />
            <Route path="pricing" element={<Pricing />} />
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

            {/* COACH */}
            <Route
              path="coach/dashboard"
              element={
                <ProtectedRoute>
                  <CoachDashboard />
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
