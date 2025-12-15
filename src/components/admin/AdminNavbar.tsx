// @ts-nocheck
import { Link, useLocation } from "react-router-dom";
import { ADMIN_FEATURES } from "@/config/adminFeatures";

const NavItem = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-red-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
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
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            K
          </div>
          <span className="font-semibold">Admin</span>
        </div>

        {/* Menü */}
        <nav className="flex items-center gap-2">
          {ADMIN_FEATURES.dashboard && (
            <NavItem to="/admin" label="Dashboard" />
          )}

          {ADMIN_FEATURES.profile && (
            <NavItem to="/admin/profile" label="Profil" />
          )}

          {ADMIN_FEATURES.settings && (
            <NavItem to="/admin/settings" label="Ayarlar" />
          )}
        </nav>
      </div>
    </header>
  );
}
