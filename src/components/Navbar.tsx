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
  Video,
  Zap,
  Home as HomeIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  
  let auth: any = null;
  try {
    auth = useAuth();
  } catch (e) {
    console.warn("! [Navbar] useAuth failed:", e);
  }

  const [mobileOpen, setMobileOpen] = useState(false);
  const me = auth?.user ?? null;
  const role = auth?.role ?? null;
  const isLoggedIn = !!me;

  const translations = {
    tr: { webinar: "Webinar", boost: "Boost", dashboard: "Panel", login: "Giriş Yap", register: "Kayıt Ol", feed: "Ana Akış", profile: "Profil", settings: "Ayarlar", logout: "Çıkış" },
    en: { webinar: "Webinars", boost: "Boost", dashboard: "Dashboard", login: "Login", register: "Register", feed: "Feed", profile: "Profile", settings: "Settings", logout: "Logout" },
    ar: { webinar: "ندوة عبر الويب", boost: "تعزيز", dashboard: "لوحة القيادة", login: "تسجيل الدخول", register: "سجل الآن", feed: "التغذية الرئيسية", profile: "ملف شخصي", settings: "إعدادات", logout: "تسجيل الخروج" },
    fr: { webinar: "Webinaire", boost: "Boost", dashboard: "Tableau de bord", login: "Connexion", register: "S'inscrire", feed: "Flux", profile: "Profil", settings: "Paramètres", logout: "Déconnexion" }
  };
  
  const t = translations[language || "tr"] || translations.tr;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const roleLabel = useMemo(() => {
    if (role === "coach") return language === "tr" ? "Koç" : "Coach";
    if (role === "corporate") return language === "tr" ? "Şirket" : "Corporate";
    if (role === "admin") return "Admin";
    return t.dashboard;
  }, [role, language, t]);

  const dashboardPath = useMemo(() => {
    if (role === "coach") return "/coach/dashboard";
    if (role === "corporate") return "/corporate/dashboard";
    if (role === "admin") return "/admin";
    return "/user/dashboard";
  }, [role]);

  const profilePath = useMemo(() => {
    if (role === "coach") return "/coach/profile";
    if (role === "corporate") return "/corporate/profile";
    return "/user/profile";
  }, [role]);

  const displayName = me?.fullName || me?.email?.split("@")?.[0] || "User";

  const handleLogout = async () => {
    try {
      if (auth?.logout) await auth.logout();
    } catch (e) {
      window.location.href = "/";
    }
  };

  const mobileBtn = "w-full px-4 py-3 rounded-xl border text-left hover:bg-gray-50 transition";
  const mobilePrimary = "w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-left hover:bg-red-700 transition";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">K</div>
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span>
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            to="/webinars" 
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${isActive("/webinars") ? "bg-red-50 text-red-700 border border-red-200" : "text-gray-700 hover:bg-gray-50"}`}
          >
            <Video className="h-4 w-4 text-red-600" />
            {t.webinar}
          </Link>
          <Link to="/boost">
            <Button className="h-10 rounded-xl px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg transition">
              <Zap className="h-4 w-4 mr-2" />
              {t.boost}
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Dil Seçimi */}
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

          {isLoggedIn && <div className="hidden sm:block"><NotificationBell /></div>}

          {!isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"><Button variant="outline" className="rounded-xl">{t.login}</Button></Link>
              <Link to="/register"><Button className="rounded-xl bg-red-600 text-white">{t.register}</Button></Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardPath}>
                <Button className="rounded-xl bg-red-600 text-white">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t.dashboard}
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
                  <DropdownMenuItem onClick={() => navigate("/home")}><HomeIcon className="mr-2 h-4 w-4" />{t.feed}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(profilePath)}><User className="mr-2 h-4 w-4" />{t.profile}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />{t.logout}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Button variant="outline" className="md:hidden rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobil Menü */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-3">
          <button onClick={() => navigate("/home")} className={mobileBtn}>{t.feed}</button>
          <button onClick={() => navigate("/webinars")} className={mobileBtn}>{t.webinar}</button>
          <Link to="/boost" className="block" onClick={() => setMobileOpen(false)}>
            <div className={mobilePrimary}><Zap className="inline h-4 w-4 mr-2" />{t.boost}</div>
          </Link>
          <div className="pt-2 border-t space-y-2">
            {!isLoggedIn ? (
              <>
                <button onClick={() => navigate("/login")} className={mobileBtn}>{t.login}</button>
                <button onClick={() => navigate("/register")} className={mobilePrimary}>{t.register}</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate(dashboardPath)} className={mobileBtn}>{t.dashboard}</button>
                <button onClick={handleLogout} className={mobileBtn + " text-red-600"}>{t.logout}</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
