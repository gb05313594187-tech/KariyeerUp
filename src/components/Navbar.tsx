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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

// ✅ DEĞİŞİKLİK 1: memo ile sarmalama — gereksiz re-render önleme
const Navbar = memo(function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const auth = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const me = auth?.user ?? null;
  const role = auth?.role ?? null;

  // KORUNAN: Çok dilli çeviriler
  const translations = {
    tr: {
      jobs: "İlanlar",
      mentor: "MentorCircle",
      webinar: "Webinar",
      premium: "Bireysel Premium",
      dashboard: "Panel",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      feed: "Ana Akış",
      profile: "Profil",
      settings: "Ayarlar",
      logout: "Çıkış"
    },
    en: {
      jobs: "Jobs",
      mentor: "MentorCircle",
      webinar: "Webinars",
      premium: "Individual Premium",
      dashboard: "Dashboard",
      login: "Login",
      register: "Register",
      feed: "Feed",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout"
    },
    ar: {
      jobs: "وظائف",
      mentor: "دائرة المنقذ",
      webinar: "ندوة عبر الويب",
      premium: "بريميوم فردي",
      dashboard: "لوحة القيادة",
      login: "تسجيل الدخول",
      register: "سجل الآن",
      feed: "التغذية الرئيسية",
      profile: "ملف شخصي",
      settings: "إعدادات",
      logout: "تسجيل الخروج"
    },
    fr: {
      jobs: "Emplois",
      mentor: "Cercle Mentor",
      webinar: "Webinaire",
      premium: "Premium Individuel",
      dashboard: "Tableau de bord",
      login: "Connexion",
      register: "S'inscrire",
      feed: "Flux",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion"
    }
  };

  const t = translations[language || "tr"];

  // KORUNAN: Route değişiminde menü kapat
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // KORUNAN: isActive kontrolü
  const isActive = useCallback((path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  // KORUNAN: Role bazlı hesaplamalar
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

  const premiumPath = "/bireysel-premium";
  const socialHomePath = "/home";
  const jobsPath = "/jobs";
  const logoPath = "/";

  const displayName = me?.fullName || me?.email?.split("@")?.[0] || "User";

  // ✅ DEĞİŞİKLİK 2: Logout handler memo ile sarmalama
  const handleLogout = useCallback(async () => {
    await auth.logout();
    navigate("/");
  }, [auth, navigate]);

  const mobileBtn =
    "w-full px-4 py-3 rounded-xl border text-left hover:bg-gray-50 transition";
  const mobilePrimary =
    "w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-left hover:bg-red-700 transition";

  // ✅ DEĞİŞİKLİK 3: Loading sırasında SON BİLİNEN DURUMU göster (skeleton yerine)
  // İlk yüklemede (me === null ve loading === true) skeleton göster
  // Sonraki loading'lerde (me zaten var) → mevcut UI'ı koru, skeleton GÖSTERME
  const showAuthSkeleton = auth.loading && me === null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* KORUNAN: Logo */}
        <Link to={logoPath} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
            K
          </div>
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span>
        </Link>

        {/* KORUNAN: Desktop Nav */}
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

          <Link to={premiumPath}>
            <Button className="h-10 rounded-xl px-4 bg-red-600 hover:bg-red-700 text-white">
              <Crown className="h-4 w-4 mr-2" />
              {t.premium}
            </Button>
          </Link>
        </nav>

        {/* KORUNAN: Right side */}
        <div className="flex items-center gap-2">
          {/* KORUNAN: Dil seçici */}
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

          {/* KORUNAN: Notification bell */}
          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {/* ✅ DEĞİŞİKLİK 4: Auth durumu — akıllı skeleton */}
          {showAuthSkeleton ? (
            // Sadece ilk yüklemede skeleton göster
            <div className="hidden md:flex items-center gap-2">
              <div className="h-10 w-28 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-10 w-40 rounded-xl bg-gray-100 animate-pulse" />
            </div>
          ) : !me ? (
            // KORUNAN: Giriş yapmamış kullanıcı
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
            // KORUNAN: Giriş yapmış kullanıcı
            <div className="hidden md:flex items-center gap-2">
              {/* ✅ DEĞİŞİKLİK 5: Loading sırasında butonlara opacity ekle (donma hissi azalır) */}
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

          {/* KORUNAN: Mobil hamburger */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* KORUNAN: Mobil menü */}
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

            <Link to={premiumPath} className="block" onClick={() => setMobileOpen(false)}>
              <div className={mobilePrimary}>{t.premium}</div>
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
