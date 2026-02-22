// src/components/admin/AdminNavbar.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  Video,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <BarChart3 className="h-4 w-4" />,
  },

  // 🔥 EKLENDİ — Hiring aslında AdminDashboard içindeki jobs tab'ına yönlendiriyoruz
  {
    label: "Görüşme & İşe Alım",
    path: "/admin?tab=jobs",
    icon: <Video className="h-4 w-4" />,
  },

  // 🔥 EKLENDİ — Investor Dashboard
  {
    label: "Investor",
    path: "/admin/investor",
    icon: <TrendingUp className="h-4 w-4" />,
  },

  {
    label: "Profil",
    path: "/admin/profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    label: "Ayarlar",
    path: "/admin/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export default function AdminNavbar() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => {
    if (to.includes("?")) {
      return pathname + search === to;
    }
    if (to === "/admin") return pathname === "/admin";
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
          <span className="font-semibold text-gray-900">Admin</span>
        </Link>

        {/* Desktop Menü */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sağ taraf */}
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border hover:bg-gray-50 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış
          </button>

          {/* Mobil menü toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1 shadow-lg">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* Mobil Çıkış */}
          <button
            onClick={() => {
              setMobileOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      )}
    </header>
  );
}
