import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltipProvider"; // Küçük harf/büyük harf farkı olabilir, genelde tooltip-provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FollowProvider } from "@/contexts/FollowContext"; // Bunu da ekledik

// SAYFALAR
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoachList from "./pages/CoachList";
import CoachProfile from "./pages/CoachProfile";
import BookingSystem from "./pages/BookingSystem";
import PaymentPage from "./pages/Payment"; // YENİ EKLENDİ
import PaymentSuccess from "./pages/PaymentSuccess"; // YENİ EKLENDİ
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <FollowProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Ana Sayfalar */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Panel */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Koç İşlemleri */}
                <Route path="/coaches" element={<CoachList />} />
                <Route path="/coach/:id" element={<CoachProfile />} />
                
                {/* Randevu ve Ödeme (İŞTE EKSİK OLANLAR BURASIYDI) */}
                <Route path="/booking/:id" element={<BookingSystem />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                
                {/* Hata Sayfası */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FollowProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
