// src/components/admin/AdminNavbar.tsx
// @ts-nocheck
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ADMIN_FEATURES } from "@/config/adminFeatures";

const NavItem = ({ to, label, active }: { to: string; label: string; active: boolean }) => {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        active ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function AdminNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string) => {
    // /admin sayfasında sadece tam eşleşme
    if (to === "/admin") return pathname === "/admin";
    // diğerlerinde prefix
    return pathname.startsWith(to);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            K
          </div>
          <span className="font-semibold">Admin</span>
        </Link>

        {/* Menü */}
        <nav className="flex items-center gap-2">
          {ADMIN_FEATURES.dashboard && (
            <NavItem to="/admin" label="Dashboard" active={isActive("/admin")} />
          )}

          {ADMIN_FEATURES.profile && (
            <NavItem to="/admin/profile" label="Profil" active={isActive("/admin/profile")} />
          )}

          {ADMIN_FEATURES.settings && (
            <NavItem to="/admin/settings" label="Ayarlar" active={isActive("/admin/settings")} />
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg text-sm font-medium border hover:bg-gray-50"
          >
            Çıkış
          </button>
        </div>
      </div>
    </header>
  );
}
