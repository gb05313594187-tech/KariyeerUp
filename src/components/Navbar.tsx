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
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  Briefcase,
  Building2,
  Video,
  Users,
  Sparkles,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

type Role = "user" | "coach" | "corporate" | "admin" | null;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const auth = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const role: Role = auth?.role ?? null;
  const me = auth?.user ?? null;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const dashboardPath = useMemo(() => {
    if (role === "coach") return "/coach/dashboard";
    if (role === "corporate") return "/corporate/dashboard";
    if (role === "admin") return "/admin/dashboard";
    if (role === "user") return "/user/dashboard";
    return "/login";
  }, [role]);

  const productMenu = useMemo(() => {
    // Rol varsa: rol tabanlı ürün menüsü
    if (role === "coach") {
      return [
        { label: "Koç Paneli", to: "/coach/dashboard", icon: LayoutDashboard },
        { label: "Koç Profili", to: "/coach/profile", icon: User },
        { label: "Koç Ayarları", to: "/coach/settings", icon: Settings },
      ];
    }
    if (role === "corporate") {
      return [
        { label: "Kurumsal Panel", to: "/corporate/dashboard", icon: LayoutDashboard },
        { label: "Kurumsal Profil", to: "/corporate/profile", icon: Building2 },
        { label: "Kurumsal Ayarlar", to: "/corporate/settings", icon: Settings },
      ];
    }
    if (role === "admin") {
      return [
        { label: "Admin Panel", to: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Analitik", to: "/advanced-analytics", icon: Sparkles },
        { label: "Yönetim", to: "/admin/panel", icon: Settings },
      ];
    }

    // Login yoksa (veya user): core ürün menüsü
    return [
      { label: "Koç Bul", to: "/coaches", icon: Users },
      { label: "Şirketler için", to: "/for-companies", icon: Building2 },
      { label: "Koç olmak istiyorum", to: "/for-coaches", icon: Briefcase },
      { label: "Nasıl Çalışır?", to: "/how-it-works", icon: Home },
    ];
  }, [role]);

  const discoverMenu = useMemo(() => {
    return [
      { label: "MentorCircle", to: "/mentor-circle", icon: Users },
      { label: "Webinar", to: "/webinars", icon: Video },
    ];
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
            K
          </div>
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span>
        </Link>

        {/* CENTER: Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Ürün Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl">
                Ürün <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel>Ürün</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {productMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    className={isActive(item.to) ? "font-semibold" : ""}
                  >
                    <Icon className="mr-2 h-4 w-4 text-gray-600" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Keşfet Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl">
                Keşfet <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel>Keşfet</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {discoverMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    className={isActive(item.to) ? "font-semibold" : ""}
                  >
                    <Icon className="mr-2 h-4 w-4 text-gray-600" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <Globe className="h-4 w-4 mr-2" />
                {language?.toUpperCase?.() || "TR"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("tr")}>TR</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>EN</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>AR</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>FR</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {/* Auth area */}
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
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl">
                    <User className="h-4 w-4 mr-2" />
                    Hesabım <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {role ? role.toUpperCase() : "HESAP"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>

                  {/* Profil / Ayarlar route'larını senin mevcut yapına göre ayarla */}
                  <DropdownMenuItem
                    onClick={() => {
                      if (role === "coach") navigate("/coach/profile");
                      else if (role === "corporate") navigate("/corporate/profile");
                      else if (role === "admin") navigate("/admin/profile");
                      else navigate("/user/profile");
                    }}
                  >
                    <User className="mr-2 h-4 w-4" /> Profil
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      if (role === "coach") navigate("/coach/settings");
                      else if (role === "corporate") navigate("/corporate/settings");
                      else if (role === "admin") navigate("/admin/settings");
                      else navigate("/user/settings");
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Ayarlar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await auth?.signOut?.();
                        navigate("/");
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Çıkış
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Ürün
            </div>
            <div className="grid gap-2">
              {productMenu.map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className={[
                    "w-full text-left px-4 py-3 rounded-xl border",
                    isActive(item.to)
                      ? "border-red-200 bg-red-50 font-semibold"
                      : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">
              Keşfet
            </div>
            <div className="grid gap-2">
              {discoverMenu.map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className={[
                    "w-full text-left px-4 py-3 rounded-xl border",
                    isActive(item.to)
                      ? "border-red-200 bg-red-50 font-semibold"
                      : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              {!me ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full rounded-xl">
                      Giriş
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white">
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to={dashboardPath}>
                    <Button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={async () => {
                      try {
                        await auth?.signOut?.();
                        navigate("/");
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    Çıkış
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
