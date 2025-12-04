// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Index";
import forCoachesPage from "@/pages/forCoaches";
import forCompaniesPage from "@/pages/forCompanies";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forcoaches" element={<CoachesPage />} />
          <Route path="/forcompanies" element={<CompaniesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
