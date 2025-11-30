// @ts-nocheck
/* eslint-disable */
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FollowProvider } from "@/contexts/FollowContext";

// SAYFALAR
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoachList from "./pages/CoachList";
import CoachProfile from "./pages/CoachProfile";
import BookingSystem from "./pages/BookingSystem";
import PaymentPage from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MentorCircle from "./pages/MentorCircle";
import ForCompanies from "./pages/ForCompanies";
import Webinars from "./pages/Webinars";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <FollowProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Auth & Panel */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Koçlar */}
                <Route path="/coaches" element={<CoachList />} />
                <Route path="/coach/:id" element={<CoachProfile />} />
                
                {/* İşlemler */}
                <Route path="/booking/:id" element={<BookingSystem />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />

                {/* --- İŞTE EKSİK OLAN SAYFALAR BURADA --- */}
                <Route path="/mentor-circle" element={<MentorCircle />} />
                <Route path="/corporate" element={<ForCompanies />} />
                <Route path="/webinars" element={<Webinars />} />
                {/* -------------------------------------- */}
                
                {/* 404 (En Sonda Olmalı) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
        </FollowProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
