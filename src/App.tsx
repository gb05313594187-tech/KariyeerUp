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
// ihtiyaca göre diğer sayfaları da ekle

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
              {/* NAVBAR HER ZAMAN AUTH + LANGUAGE İÇİNDE */}
              <Navbar />

              <Routes>
                <Route path="/" element={<Index />} />

                {/* Ana public sayfalar */}
                <Route path="/for-coaches" element={<ForCoaches />} />
                <Route path="/for-companies" element={<ForCompanies />} />
                <Route path="/mentor-circle" element={<MentorCircle />} />
                <Route path="/webinars" element={<Webinars />} />

                {/* Auth sayfaları */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected / kullanıcı sayfaları */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/coach-application"
                  element={<CoachApplication />}
                />
                <Route
                  path="/coach-selection-process"
                  element={<CoachSelectionProcess />}
                />

                {/* 404 vs varsa buraya */}
              </Routes>

              <Footer />
            </BrowserRouter>
          </NotificationProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
