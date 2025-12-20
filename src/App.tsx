// src/App.tsx
// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// UI / Icons
import { CheckCircle2, Globe2, Star, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

// LAYOUT (Public)
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ✅ Admin Layout
import AdminLayout from "@/layouts/AdminLayout";

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

// ✅ YENİ EKLENEN LEGAL SAYFALAR
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Returns from "@/pages/Returns";
import DistanceSales from "@/pages/DistanceSales";

import Terms from "@/pages/Terms";
import Ethics from "@/pages/Ethics";

import CoachPublicProfile from "@/pages/CoachPublicProfile";
import CoachSelfProfile from "@/pages/CoachProfile";

// USER
import UserDashboard from "@/pages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import UserSettings from "@/pages/UserSettings";

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

// LEGACY
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/Profile";

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
   Nasıl Çalışır
-------------------------------------------------- */
function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
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
            3 basit adımda koçunu bul, seansını planla ve gelişimini ölç.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/register">
              <Button className="bg-white text-red-600 hover:bg-orange-50 px-8 py-6 rounded-xl">
                Hemen Başla
              </Button>
            </a>
            <a href="/coaches">
              <Button
                variant="outline"
                className="border-white/80 text-white hover:bg-white/10 px-8 py-6 rounded-xl"
              >
                Koçları İncele
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------
   APP
-------------------------------------------------- */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/nasil-calisir" element={<HowItWorks />} />
          <Route path="/how-it-works" element={<HowItWorks />} />

          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coach/:id" element={<CoachPublicProfile />} />

          <Route path="/for-coaches" element={<ForCoaches />} />
          <Route path="/for-companies" element={<ForCompanies />} />
          <Route path="/mentor-circle" element={<MentorCircle />} />
          <Route path="/webinars" element={<Webinars />} />

          <Route path="/coach-selection-process" element={<CoachSelection />} />
          <Route path="/book-session" element={<BookSession />} />
          <Route path="/coach-application" element={<CoachApplication />} />

          {/* USER */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/settings" element={<UserSettings />} />

          {/* CORPORATE */}
          <Route path="/corporate/dashboard" element={<CorporateDashboard />} />
          <Route path="/corporate/profile" element={<CorporateProfile />} />
          <Route path="/corporate/settings" element={<CorporateSettings />} />

          {/* COACH */}
          <Route path="/coach/dashboard" element={<CoachDashboard />} />
          <Route path="/coach/profile" element={<CoachSelfProfile />} />
          <Route path="/coach/settings" element={<CoachSettings />} />
          <Route path="/coach/requests" element={<CoachRequests />} />

          {/* LEGAL – EKLENEN ROOTLAR */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/distance-sales" element={<DistanceSales />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/ethics" element={<Ethics />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* LEGACY */}
          <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
          <Route path="/coach-dashboard" element={<Navigate to="/coach/dashboard" replace />} />
          <Route path="/legacy-dashboard" element={<Dashboard />} />
          <Route path="/legacy-profile" element={<ProfilePage />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
