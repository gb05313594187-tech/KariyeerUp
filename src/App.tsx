// @ts-nocheck
/* eslint-disable */
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FollowProvider } from "@/contexts/FollowContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Footer'ı da ekledik

// SAYFALAR
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
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

// --- İŞTE SADECE BURADA TEK BİR TANE APP VAR ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <FollowProvider>
            <Toaster />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/coaches" element={<CoachList />} />
                    <Route path="/coach/:id" element={<CoachProfile />} />
                    <Route path="/booking/:id" element={<BookingSystem />} />
                    <Route path="/payment/:id" element={<PaymentPage />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/mentor-circle" element={<MentorCircle />} />
                    <Route path="/corporate" element={<ForCompanies />} />
                    <Route path="/webinars" element={<Webinars />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
        </FollowProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
