// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Index";
import CoachesPage from "@/pages/Coaches";
import CompaniesPage from "@/pages/Companies";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
