// src/components/Navbar.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Menu,
  X,
  Globe,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  Sparkles,
  Video,
  Crown,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const auth = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const me = auth?.user ?? null;
  const role = auth?.role ?? null; // ✅ user | coach | corporate | admin

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  /* ---------------- ROLE LABELS ---------------- */
  const roleLabel = useMemo(() => {
    if (role === "coach") return "Koç";
    if (role === "corporate") return "Şirket";
    if (role === "admin") return "Admin";
    if (role === "user") return "Kullanıcı";
    return "Hesap";
  }, [role]);

  const dashboardLabel = useMemo(() => {
    if (role === "coach") return "Koç Paneli";
    if (role === "corporate") return "Kurumsal Panel";
    if (role === "admin") return "Admin Paneli";
    if (role === "user") return "Kullanıcı Paneli";
    return "Dashboard";
  }, [role]);

  const dashboardPath = useMemo(() => {
    if (role === "coach") return "/coach/dashboard";
    if (role === "corporate") return "/corporate/dashboard";
    if (role === "admin") return "/admin";
    if (role === "user") return "/user/dashboard";
    return "/login";
  }, [role]);

  const profilePath = useMemo(() => {
    if (role === "coach") return "/coach/profile";
    if (role === "corporate") return "/corporate/profile";
    if (role === "admin") return "/admin/profile";
    return "/user/profile";
  }, [role]);

  const settingsPath = useMemo(() => {
    if (role === "coach") return "/coach/settings";
    if (role === "corporate") return "/corporate/settings";
    if (role === "admin") return "/admin/settings";
    return "/user/settings";
  }, [role]);

  // ✅ Premium label + hedef
  const premiumLabel = useMemo(() => {
    if (role === "corporate") return "Kurumsal Premium";
    if (role === "coach") return "Koç Premium";
    return "Bireysel Premium";
  }, [role]);

  const premiumTarget = useMemo(() => {
    // login yoksa pricing (pazarlama)
    if (!auth?.isAuthenticated) return "/pricing";
    // admin hepsini görsün
    if (role === "admin") return "/pricing";
    // role’e göre direkt checkout
    if (role === "corporate") return "/checkout?plan=corporate";
    if (role === "coach") return "/checkout?plan=coach";
    return "/checkout?plan=individual";
  }, [auth?.isAuthenticated, role]);

  const displayName =
    me?.fullName || me?.email?.split("@")?.[0] || "Kullanıcı";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
            K
          </div>
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/mentor-circle"
            className={[
              "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition",
              isActive("/mentor-circle")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            <Sparkles className="h-4 w-4 text-red-600" />
            MentorCircle
          </Link>

          <Link
            to="/webinars"
            className={[
              "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition",
              isActive("/webinars")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            <Video className="h-4 w-4 text-red-600" />
            Webinar
          </Link>

          <Button
            onClick={() => navigate(premiumTarget)}
            className="h-10 rounded-xl px-4 bg-red-600 hover:bg-red-700 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Premium
            <span className="ml-2 hidden lg:inline text-white/80">
              {premiumLabel}
            </span>
          </Button>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* LANGUAGE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <Globe className="h-4 w-4 mr-2" />
                {(language || "tr").toUpperCase()}
                <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("tr")}>TR</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>EN</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>AR</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>FR</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {/* AUTH */}
          {!me ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded-xl">
                  Giriş Yap
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                  Kayıt Ol
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardPath}>
                <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {dashboardLabel}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl">
                    <User className="h-4 w-4 mr-2" />
                    {displayName}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-xs text-gray-500">{roleLabel}</div>
                    <div className="text-sm font-semibold">{displayName}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {dashboardLabel}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(profilePath)}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(settingsPath)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Ayarlar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await auth.logout();
                      navigate("/");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <button
              onClick={() => navigate("/mentor-circle")}
              className="w-full px-4 py-3 rounded-xl border text-left"
            >
              MentorCircle
            </button>
            <button
              onClick={() => navigate("/webinars")}
              className="w-full px-4 py-3 rounded-xl border text-left"
            >
              Webinar
            </button>

            <button
              onClick={() => navigate(premiumTarget)}
              className="w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-left"
            >
              Premium — {premiumLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
