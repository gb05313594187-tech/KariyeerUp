// @ts-nocheck
/* eslint-disable */
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FollowProvider } from "@/contexts/FollowContext";

// --- TÜM SAYFALARI İÇERİ ALIYORUZ ---
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoachList from "./pages/CoachList";      // Koç Listesi
import CoachProfile from "./pages/CoachProfile"; // Koç Profili
import ForCoaches from "./pages/ForCoaches";    // Koçlar İçin (Başvuru Sayfası)
import BookingSystem from "./pages/BookingSystem";
import PaymentPage from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

// YAN SAYFALAR (BUNLAR EKSİKTİ, GERİ GELDİ)
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
                
                {/* Koçluk Sayfaları */}
                <Route path="/coaches" element={<CoachList />} />
                <Route path="/coach/:id" element={<CoachProfile />} />
                <Route path="/for-coaches" element={<ForCoaches />} /> {/* Koçlar İçin */}
                
                {/* Randevu ve Ödeme */}
                <Route path="/booking/:id" element={<BookingSystem />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />

                {/* --- GERİ GELEN SAYFALAR --- */}
                <Route path="/mentor-circle" element={<MentorCircle />} />
                <Route path="/corporate" element={<ForCompanies />} /> {/* Şirketler İçin */}
                <Route path="/webinars" element={<Webinars />} />
                {/* --------------------------- */}
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
        </FollowProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
