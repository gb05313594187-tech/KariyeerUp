// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import ForCoaches from "./pages/ForCoaches";
import ForCompanies from "./pages/ForCompanies";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/coaches" element={<ForCoaches />} />
        <Route path="/companies" element={<ForCompanies />} />
      </Routes>
    </Router>
  );
}
