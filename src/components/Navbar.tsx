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
    tr: {
      jobs: "İlanlar",
      mentor: "MentorCircle",
      webinar: "Webinar",
      premium_user: "Bireysel Premium",
      premium_coach: "Koç Premium",
      premium_corporate: "Kurumsal Premium",
      premium_default: "Bireysel Premium",
      dashboard: "Panel",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      feed: "Ana Akış",
      profile: "Profil",
      settings: "Ayarlar",
      logout: "Çıkış",
    },
    en: {
      jobs: "Jobs",
      mentor: "MentorCircle",
      webinar: "Webinars",
      premium_user: "Individual Premium",
      premium_coach: "Coach Premium",
      premium_corporate: "Corporate Premium",
      premium_default: "Individual Premium",
      dashboard: "Dashboard",
      login: "Login",
      register: "Register",
      feed: "Feed",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
    },
    ar: {
      jobs: "وظائف",
      mentor: "دائرة المنقذ",
      webinar: "ندوة عبر الويب",
      premium_user: "بريميوم فردي",
      premium_coach: "بريميوم المدرب",
      premium_corporate: "بريميوم الشركات",
      premium_default: "بريميوم فردي",
      dashboard: "لوحة القيادة",
      login: "تسجيل الدخول",
      register: "سجل الآن",
      feed: "التغذية الرئيسية",
      profile: "ملف شخصي",
      settings: "إعدادات",
      logout: "تسجيل الخروج",
    },
    fr: {
      jobs: "Emplois",
      mentor: "Cercle Mentor",
      webinar: "Webinaire",
      premium_user: "Premium Individuel",
      premium_coach: "Premium Coach",
      premium_corporate: "Premium Entreprise",
      premium_default: "Premium Individuel",
      dashboard: "Tableau de bord",
      login: "Connexion",
      register: "S'inscrire",
      feed: "Flux",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion",
    },
  };

  const t = translations[language || "tr"];

  // ─── ROLE BAZLI PREMİUM LABEL & ICON & PATH ───
  const premiumConfig = useMemo(() => {
    if (role === "corporate") {
      return {
        label: t.premium_corporate,
        icon: Building2,
        path: "/bireysel-premium",
      };
    }
    if (role === "coach") {
      return {
        label: t.premium_coach,
        icon: Star,
        path: "/bireysel-premium",
      };
    }
    // user, admin, veya giriş yapmamış
    return {
      label: t.premium_default,
      icon: Crown,
      path: "/bireysel-premium",
    };
  }, [role, t]);

  const PremiumIcon = premiumConfig.icon;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  const roleLabel = useMemo(() => {
    if (role === "coach") return language === "tr" ? "Koç" : "Coach";
    if (role === "corporate") return language === "tr" ? "Şirket" : "Corporate";
    if (role === "admin") return "Admin";
    return t.dashboard;
  }, [role, language, t]);

  const dashboardLabel = useMemo(() => {
    if (role === "coach") return `${roleLabel} ${t.dashboard}`;
    if (role === "corporate") return `${roleLabel} ${t.dashboard}`;
    return t.dashboard;
  }, [role, roleLabel, t]);

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

  const socialHomePath = "/home";
  const jobsPath = "/jobs";
  const logoPath = "/";

  const displayName = me?.fullName || me?.email?.split("@")?.[0] || "User";

  const handleLogout = useCallback(async () => {
    await auth.logout();
    navigate("/");
  }, [auth, navigate]);

  const mobileBtn =
    "w-full px-4 py-3 rounded-xl border text-left hover:bg-gray-50 transition";
  const mobilePrimary =
    "w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-left hover:bg-red-50 transition flex items-center gap-2";

  const showAuthSkeleton = auth.loading && me === null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={logoPath} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
            K
          </div>
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {me && (
            <Link
              to={jobsPath}
              className={[
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition",
                isActive("/jobs")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <Briefcase className="h-4 w-4 text-red-600" />
              {t.jobs}
            </Link>
          )}

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
            {t.mentor}
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
            {t.webinar}
          </Link>

          {/* ─── ROLE BAZLI PREMİUM BUTONU ─── */}
          <Link to={premiumConfig.path}>
            <Button className="h-10 rounded-xl px-4 bg-red-600 hover:bg-red-700 text-white">
              <PremiumIcon className="h-4 w-4 mr-2" />
              {premiumConfig.label}
            </Button>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dil seçici */}
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

          {/* Notification bell */}
          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {/* Auth durumu */}
          {showAuthSkeleton ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-10 w-28 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-10 w-40 rounded-xl bg-gray-100 animate-pulse" />
            </div>
          ) : !me ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded-xl">
                  {t.login}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                  {t.register}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardPath}>
                <Button
                  className={`rounded-xl bg-red-600 hover:bg-red-700 text-white transition-opacity ${
                    auth.loading ? "opacity-70" : "opacity-100"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {dashboardLabel}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`rounded-xl transition-opacity ${
                      auth.loading ? "opacity-70" : "opacity-100"
                    }`}
                  >
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

                  <DropdownMenuItem onClick={() => navigate(socialHomePath)}>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    {t.feed}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate(jobsPath)}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    {t.jobs}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {dashboardLabel}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate(profilePath)}>
                    <User className="mr-2 h-4 w-4" />
                    {t.profile}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate(settingsPath)}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t.settings}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobil hamburger */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {me && (
              <>
                <button onClick={() => navigate(socialHomePath)} className={mobileBtn}>
                  {t.feed}
                </button>
                <button onClick={() => navigate(jobsPath)} className={mobileBtn}>
                  {t.jobs}
                </button>
              </>
            )}

            <button onClick={() => navigate("/mentor-circle")} className={mobileBtn}>
              {t.mentor}
            </button>
            <button onClick={() => navigate("/webinars")} className={mobileBtn}>
              {t.webinar}
            </button>

            {/* ─── MOBİL PREMİUM BUTONU ─── */}
            <Link
              to={premiumConfig.path}
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              <div className={mobilePrimary}>
                <PremiumIcon className="h-4 w-4" />
                {premiumConfig.label}
              </div>
            </Link>

            <div className="pt-2 border-t space-y-2">
              {!me ? (
                <>
                  <button onClick={() => navigate("/login")} className={mobileBtn}>
                    {t.login}
                  </button>
                  <button onClick={() => navigate("/register")} className={mobilePrimary}>
                    {t.register}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate(dashboardPath)} className={mobileBtn}>
                    {dashboardLabel}
                  </button>
                  <button onClick={() => navigate(profilePath)} className={mobileBtn}>
                    {t.profile}
                  </button>
                  <button onClick={() => navigate(settingsPath)} className={mobileBtn}>
                    {t.settings}
                  </button>
                  <button onClick={handleLogout} className={mobileBtn}>
                    {t.logout}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

export default Navbar;
