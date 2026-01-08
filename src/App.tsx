// src/App.tsx
// @ts-nocheck
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useSearchParams,
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
   Redirect: /book-session -> /coach/:id (inline booking panel)
   - /book-session?coachId=<uuid>&date=YYYY-MM-DD&time=HH:mm&goal=...&level=...&lang=...
   -> /coach/<coachId>?book=1&date=...&time=...&goal=...&level=...&lang=...
-------------------------------------------------- */
function BookSessionRedirect() {
  const [sp] = useSearchParams();

  const coachId = sp.get("coachId") || "";
  const date = sp.get("date") || "";
  const time = sp.get("time") || "";

  // mevcut query paramlarını taşı (goal, level, lang vs.)
  const out = new URLSearchParams();
  out.set("book", "1");
  if (date) out.set("date", date);
  if (time) out.set("time", time);

  // geri kalan her şeyi aynen geçir
  for (const [k, v] of sp.entries()) {
    if (k === "coachId" || k === "date" || k === "time") continue;
    if (!out.has(k)) out.set(k, v);
  }

  // coachId yoksa koç listesine dön
  if (!coachId) return <Navigate to="/coaches" replace />;

  return <Navigate to={`/coach/${coachId}?${out.toString()}`} replace />;
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

          {/* PUBLIC */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />

            {/* ✅ SITEMAP */}
            <Route path="/sitemap.xml" element={<Sitemap />} />

            {/* ✅ PREMIUM / PRICING */}
            <Route path="/pricing" element={<Pricing />} />

            {/* ✅ BİREYSEL PREMIUM (geri geldi) */}
            <Route path="/bireysel-premium" element={<Pricing />} />

            {/* ✅ CHECKOUT FLOW */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* ✅ PAYTR CHECKOUT */}
            <Route path="/paytr/checkout" element={<PaytrCheckout />} />
            <Route path="/paytr-checkout" element={<PaytrCheckout />} />

            {/* How it works */}
            <Route path="/nasil-calisir" element={<HowItWorks />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            <Route path="/coaches" element={<Coaches />} />

            {/* ✅ COACH PUBLIC PROFILE (takvim burada) */}
            <Route path="/coach/:slugOrId" element={<CoachPublicProfile />} />

            <Route path="/for-coaches" element={<ForCoaches />} />
            <Route path="/for-companies" element={<ForCompanies />} />
            <Route path="/mentor-circle" element={<MentorCircle />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/coach-selection-process" element={<CoachSelection />} />

            {/* ✅ /book-session artık profile içi booking’e yönlendiriyor */}
            <Route path="/book-session" element={<BookSessionRedirect />} />

            <Route path="/coach-application" element={<CoachApplication />} />

            {/* USER */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/profile/edit" element={<UserProfileEdit />} />
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

            {/* LEGAL */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/distance-sales" element={<DistanceSales />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/ethics" element={<Ethics />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* LEGACY redirects */}
            <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
            <Route path="/coach-dashboard" element={<Navigate to="/coach/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
