// src/components/admin/AdminNavbar.tsx
// @ts-nocheck
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${
        active ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            K
          </div>
          <span className="font-semibold">Admin</span>
        </div>

        <nav className="flex items-center gap-2">
          <NavItem to="/admin" label="Dashboard" />
          <NavItem to="/admin/profile" label="Profil" />
          <NavItem to="/admin/settings" label="Ayarlar" />
        </nav>
      </div>
    </header>
  );
}
