// @ts-nocheck
/* eslint-disable */
import { SuccessSection } from './components/SuccessSection';// ... diğer importlar
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FollowProvider } from "@/contexts/FollowContext";
import Navbar from "@/components/Navbar";
function App() { // Veya Dashboard()
  return (
    <div>
      {/* ... Mevcut Navbar, Hero ve diğer bölümler ... */}

      {/* BURAYA TEK SATIR EKLEME: */}
      <SuccessSection /> 

      {/* ... Mevcut Footer bölümü ... */}
    </div>
  );
}

// SADECE BU TEMEL SAYFALAR AÇIK KALSIN (Hata riski yok)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// DİĞER SAYFALARI GEÇİCİ OLARAK KAPATIYORUZ (Hata kaynağını izole etmek için)
// import CoachList from "./pages/CoachList";
// import CoachProfile from "./pages/CoachProfile";
// import BookingSystem from "./pages/BookingSystem";
// import PaymentPage from "./pages/Payment";
// import PaymentSuccess from "./pages/PaymentSuccess";
// import MentorCircle from "./pages/MentorCircle";
// import ForCompanies from "./pages/ForCompanies";
// import Webinars from "./pages/Webinars";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <FollowProvider>
            <Toaster />
            <BrowserRouter>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* <Route path="/coaches" element={<CoachList />} />
                  <Route path="/coach/:id" element={<CoachProfile />} />
                  <Route path="/booking/:id" element={<BookingSystem />} />
                  <Route path="/payment/:id" element={<PaymentPage />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/mentor-circle" element={<MentorCircle />} />
                  <Route path="/corporate" element={<ForCompanies />} />
                  <Route path="/webinars" element={<Webinars />} /> 
                  */}
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </BrowserRouter>
        </FollowProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
