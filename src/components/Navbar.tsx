// src/components/Navbar.tsx
// @ts-nocheck
import { useEffect, useMemo, useState, memo, useCallback } from "react";
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
  Home as HomeIcon,
  Briefcase,
  Building2,
  Star,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

const Navbar = memo(function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const auth = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const me = auth?.user ?? null;
  const role = auth?.role ?? null;

  const translations = {
    tr: { jobs: "İlanlar", mentor: "MentorCircle", webinar: "Webinar", premium_user: "Bireysel Premium", premium_coach: "Koç Premium", premium_corporate: "Kurumsal Premium", premium_default: "Premium", dashboard: "Panel", login: "Giriş Yap", register: "Kayıt Ol", feed: "Ana Akış", profile: "Profil", settings: "Ayarlar", logout: "Çıkış", boost: "Boost" },
    en: { jobs: "Jobs", mentor: "MentorCircle", webinar: "Webinars", premium_user: "Individual Premium", premium_coach: "Coach Premium", premium_corporate: "Corporate Premium", premium_default: "Premium", dashboard: "Dashboard", login: "Login", register: "Register", feed: "Feed", profile: "Profile", settings: "Settings", logout: "Logout", boost: "Boost" },
    ar: { jobs: "وظائف", mentor: "دائرة المنقذ", webinar: "ندوة عبر الويب", premium_user: "بريميوم فردي", premium_coach: "بريميوم المدرب", premium_corporate: "بريميوم الشركات", premium_default: "بريميوم", dashboard: "لوحة القيادة", login: "تسجيل الدخول", register: "سجل الآن", feed: "التغذية الرئيسية", profile: "ملف شخصي", settings: "إعدادات", logout: "تسجيل الخروج", boost: "تعزيز" },
    fr: { jobs: "Emplois", mentor: "Cercle Mentor", webinar: "Webinaire", premium_user: "Premium Individuel", premium_coach: "Premium Coach", premium_corporate: "Premium Entreprise", premium_default: "Premium", dashboard: "Tableau de bord", login: "Connexion", register: "S'inscrire", feed: "Flux", profile: "Profil", settings: "Paramètres", logout: "Déconnexion", boost: "Boost" },
  } as const;

  const t = translations[language as keyof typeof translations] || translations.tr;

  const premiumConfig = useMemo(() => {
    if (!me) return { label: t.premium_default, icon: Crown, path: "/pricing" };
    if (role === "corporate") return { label: t.premium_corporate, icon: Building2, path: "/bireysel-premium" };
    if (role === "coach") return { label: t.premium_coach, icon: Star, path: "/bireysel-premium" };
    return { label: t.premium_user, icon: Crown, path: "/bireysel-premium" };
  }, [role, me, t]);

  const PremiumIcon = premiumConfig.icon;

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = useCallback((path: string) => location.pathname === path || location.pathname.startsWith(path + "/"), [location.pathname]);

  const dashboardLabel = useMemo(() => {
    if (role === "coach") return language === "tr" ? "Koç Paneli" : "Coach Panel";
    if (role === "corporate") return language === "tr" ? "Kurumsal Panel" : "Corporate Panel";
    if (role === "admin") return "Admin";
    return t.dashboard;
  }, [role, language, t]);

  const dashboardPath = useMemo(() => {
    if (role === "coach") return "/coach/dashboard";
    if (role === "corporate") return "/corporate/dashboard";
    if (role === "admin") return "/admin";
    return "/user/dashboard";
  }, [role]);

  const displayName = me?.fullName || me?.email?.split("@")?.[0] || "User";

  const handleLogout = useCallback(async () => {
    await auth.logout();
    navigate("/");
  }, [auth, navigate]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg">K</div>
          <span className="font-extrabold text-xl text-red-600 hidden sm:block">Kariyeer</span>
        </Link>

        {/* Orta kısım - Menü (1024px+) */}
        <nav className="hidden lg:flex items-center gap-1.5 flex-1 justify-center">
          <Link to="/jobs" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isActive("/jobs") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"}`}>
            <Briefcase className="h-4 w-4 inline mr-1.5" />{t.jobs}
          </Link>
          <Link to="/mentor-circle" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isActive("/mentor-circle") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"}`}>
            <Sparkles className="h-4 w-4 inline mr-1.5" />{t.mentor}
          </Link>
          <Link to="/webinars" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isActive("/webinars") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"}`}>
            <Video className="h-4 w-4 inline mr-1.5" />{t.webinar}
          </Link>
        </nav>

        {/* Sağ kısım - Premium + Boost + Diğer */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Premium & Boost - Sadece büyük ekran */}
          <div className="hidden xl:flex items-center gap-2">
            <Link to={premiumConfig.path}>
              <Button size="sm" className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold">
                <PremiumIcon className="h-4 w-4 mr-1.5" />
                {premiumConfig.label}
              </Button>
            </Link>
            <Button size="sm" onClick={() => navigate("/boost")} className="h-9 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold shadow-md">
              <Sparkles className="h-4 w-4 mr-1.5" />
              {t.boost}
            </Button>
          </div>

          {/* Premium sadece orta ekran (1024-1280px) */}
          <div className="hidden lg:flex xl:hidden">
            <Link to={premiumConfig.path}>
              <Button size="sm" className="h-9 px-3 text-xs bg-red-600 hover:bg-red-700">
                <PremiumIcon className="h-3.5 w-3.5 mr-1" />
                Premium
              </Button>
            </Link>
          </div>

          {/* Dil + Bildirim + Kullanıcı */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <Globe className="h-3.5 w-3.5 mr-1" />
                {(language || "tr").toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("tr")}>Türkçe</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {!me ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"><Button variant="outline" size="sm" className="h-9">Giriş</Button></Link>
              <Link to="/register"><Button size="sm" className="h-9 bg-red-600 hover:bg-red-700">Kayıt Ol</Button></Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardPath}>
                <Button size="sm" className="h-9 bg-red-600 hover:bg-red-700">
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
                  {dashboardLabel}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 max-w-32">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/home")}><HomeIcon className="mr-2 h-4 w-4" />Ana Akış</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/jobs")}><Briefcase className="mr-2 h-4 w-4" />İlanlar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(dashboardPath)}><LayoutDashboard className="mr-2 h-4 w-4" />{dashboardLabel}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/user/profile")}><User className="mr-2 h-4 w-4" />Profil</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Çıkış</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="outline" size="sm" className="h-9 md:hidden" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link to={premiumConfig.path} onClick={() => setMobileOpen(false)} className="block">
              <Button className="w-full h-12 text-left justify-start text-lg font-bold bg-red-600 hover:bg-red-700">
                <PremiumIcon className="h-5 w-5 mr-3" />
                {premiumConfig.label}
              </Button>
            </Link>
            <Button onClick={() => { navigate("/boost"); setMobileOpen(false); }} className="w-full h-12 text-left justify-start text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="h-5 w-5 mr-3" />
              {t.boost}
            </Button>
            <div className="pt-2 space-y-1">
              <button onClick={() => { navigate("/home"); setMobileOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl">Ana Akış</button>
              <button onClick={() => { navigate("/jobs"); setMobileOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl">İlanlar</button>
              <button onClick={() => { navigate(dashboardPath); setMobileOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl">{dashboardLabel}</button>
              <button onClick={() => { navigate("/user/profile"); setMobileOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl">Profil</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl text-red-600 font-semibold">Çıkış Yap</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

export default Navbar;
