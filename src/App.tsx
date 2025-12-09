// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// SAYFALAR
import Home from "@/pages/Home";                // Ana sayfa
import HowItWorks from "@/pages/HowItWorks";    // Nasıl Çalışır sayfan
import Coaches from "@/pages/Coaches";          // Koçlar için
import ForCompanies from "@/pages/ForCompanies"; // Şirketler için
import MentorCircle from "@/pages/MentorCircle";
import Webinar from "@/pages/Webinar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// LAYOUT
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Üst menü */}
        <Navbar />

        {/* Sayfa içerikleri */}
        <main className="flex-1">
          <Routes>
            {/* Ana sayfa */}
            <Route path="/" element={<Home />} />

            {/* Nasıl Çalışır */}
            <Route path="/nasil-calisir" element={<HowItWorks />} />

            {/* Diğer sayfalar */}
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/for-companies" element={<ForCompanies />} />
            <Route path="/mentor-circle" element={<MentorCircle />} />
            <Route path="/webinar" element={<Webinar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {/* Alt kısım */}
        <Footer />
      </div>
    </Router>
  );
}
