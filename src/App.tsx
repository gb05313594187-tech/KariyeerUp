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

// AUTH PROVIDER
import { AuthProvider } from "@/contexts/AuthContext";

// LAYOUTS
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
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

// --- YENİ EKLENEN/GÜNCELLENEN SAYFALAR ---
import SavedItemsPage from "@/pages/SavedItems"; // (Artık MyApplications'a entegre ama eski link bozulmasın diye kalsın)
import MyAssessmentsPage from "@/pages/MyAssessments"; // (Artık MyReports'a entegre ama kalsın)
import MyApplicationsPage from "@/pages/MyApplications";
import MyReportsPage from "@/pages/MyReports";
import MyCalendarPage from "@/pages/MyCalendar";
import MyInterviewsPage from "@/pages/MyInterviews";
import MySessionsHubPage from "@/pages/MySessionsHub";

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
import AdminHireDashboard from "@/pages/AdminHireDashboard";

// CHECKOUT / PAYMENT
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaytrCheckout from "@/pages/PaytrCheckout";

// PREMIUM
import BireyselPremium from "@/pages/BireyselPremium";

// SESSION
import SessionJoin from "@/pages/SessionJoin";
import SessionRoom from "@/pages/SessionRoom";
import UserSessions from "@/pages/UserSessions";
import CoachSessions from "@/pages/CoachSessions";

// AUTH EXTRA
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// SOCIAL + JOB BOARD
import SocialHome from "@/pages/Home";
import JobBoard from "@/pages/JobBoard";
import CreateJob from "@/pages/CreateJob";

// INTERVIEW + MEETING
import InterviewPage from "@/pages/Interview";
import CorporateJobs from "@/pages/CorporateJobs";
import MeetingRoom from "@/pages/MeetingRoom";

// ANALYTICS ID
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <Toaster richColors position="top-right" />
        <Routes>
          {/* TAM EKRAN SAYFALAR (Navbar/Footer yok) */}
          <Route path="/meeting/:roomName" element={<MeetingRoom />} />
          <Route path="/interview/:roomName" element={<InterviewPage />} />
          <Route path="/session/:id/room" element={<SessionRoom />} />

          {/* ADMIN PANEL */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hiring" element={<AdminHireDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ANA LAYOUT (Navbar + Footer) */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<SocialHome />} />
            <Route path="jobs" element={<JobBoard />} />
            <Route path="jobs/new" element={<CreateJob />} />
            <Route path="corporate/jobs" element={<CorporateJobs />} />

            {/* ✅ BOOST → PRICING REDIRECT */}
            <Route
              path="boost"
              element={<Navigate to="/pricing" replace />}
            />

            <Route path="sitemap.xml" element={<Sitemap />} />
            <Route path="bireysel-premium" element={<BireyselPremium />} />
            <Route path="pricing" element={<Pricing />} />

            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="paytr/checkout" element={<PaytrCheckout />} />
            <Route path="paytr-checkout" element={<PaytrCheckout />} />

            <Route path="session/:id/join" element={<SessionJoin />} />
            <Route path="dashboard/sessions" element={<UserSessions />} />
            <Route path="coach/sessions" element={<CoachSessions />} />

            <Route
              path="book-session"
              element={<Navigate to="/coaches" replace />}
            />
            <Route path="nasil-calisir" element={<HowItWorks />} />
            <Route path="how-it-works" element={<HowItWorks />} />

            <Route path="coaches" element={<Coaches />} />
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

            {/* USER & YENİ MENÜ ROTALARI */}
            <Route path="user/dashboard" element={<UserDashboard />} />
            <Route path="user/profile" element={<UserProfile />} />
            <Route path="user/profile/edit" element={<UserProfileEdit />} />
            <Route path="user/settings" element={<UserSettings />} />
            
            {/* Eski Rotalar (Geriye uyumluluk için) */}
            <Route path="saved" element={<SavedItemsPage />} />
            <Route path="user/assessments" element={<MyAssessmentsPage />} />

            {/* --- YENİ EKLENEN ROTALAR --- */}
            <Route path="my-applications" element={<MyApplicationsPage />} />
            <Route path="my-reports" element={<MyReportsPage />} />
            <Route path="calendar" element={<MyCalendarPage />} />
            <Route path="my-interviews" element={<MyInterviewsPage />} />
            <Route path="my-sessions-hub" element={<MySessionsHubPage />} />

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

            {/* LEGACY REDIRECTS */}
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
