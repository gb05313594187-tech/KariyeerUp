// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// SAYFALAR
import Home from "@/pages/Landing";              // ← ANA SAYFA ARTIK BURADAN GELİYOR
import HowItWorks from "@/pages/HowItWorks";     // Nasıl Çalışır sayfası
import Coaches from "@/pages/Coaches";           // Koçlar
import ForCompanies from "@/pages/ForCompanies"; // Şirketler İçin
import MentorCircle from "@/pages/MentorCircle"; // MentorCircle sayfası
import Webinar from "@/pages/Webinar";           // Webinar sayfası
import Login from "@/pages/Login";               // Giriş
import Register from "@/pages/Register";         // Kayıt

// LAYOUT
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">

        {/* NAVBAR */}
        <Navbar />

        {/* ROUTES */}
        <main className="flex-1">
          <Routes>
            {/* Ana Sayfa */}
            <Route path="/" element={<Home />} />

            {/* Nasıl Çalışır */}
            <Route path="/nasil-calisir" element={<HowItWorks />} />

            {/* Koçlar */}
            <Route path="/coaches" element={<Coaches />} />

            {/* Şirketler için */}
            <Route path="/for-companies" element={<ForCompanies />} />

            {/* MentorCircle */}
            <Route path="/mentor-circle" element={<MentorCircle />} />

            {/* Webinar */}
            <Route path="/webinar" element={<Webinar />} />

            {/* Auth Sayfaları */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </Router>
  );
}
