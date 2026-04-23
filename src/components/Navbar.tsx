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
  Video,
  Zap,
  Home as HomeIcon,
  GraduationCap,
  Sparkles
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

  // TERİMLER: İŞKUR mevzuatına takılmamak için 'Eğitim/Gelişim' odaklı güncellendi
  const translations = {
    tr: { webinar: "Eğitimler", boost: "Gelişim Paketi", dashboard: "Gelişim Paneli", login: "Giriş Yap", register: "Kayıt Ol", feed: "Ana Akış", profile: "Profilim", settings: "Ayarlar", logout: "Güvenli Çıkış" },
    en: { webinar: "Webinars", boost: "Growth Boost", dashboard: "Growth Hub", login: "Login", register: "Sign Up", feed: "Feed", profile: "Profile", settings: "Settings", logout: "Logout" },
    ar: { webinar: "ندوة عبر الويب", boost: "باقة التطوير", dashboard: "لوحة التطوير", login: "تسجيل الدخول", register: "سجل الآن", feed: "التغذية الرئيسية", profile: "ملف شخصي", settings: "إعدادات", logout: "تسجيل الخروج" },
    fr: { webinar: "Webinaire", boost: "Boost de Croissance", dashboard: "Hub de Développement", login: "Connexion", register: "S'inscrire", feed: "Flux", profile: "Profil", settings: "Paramètres", logout: "Déconnexion" }
  };
  
  const t = translations[language || "tr"] || translations.tr;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const roleLabel = useMemo(() => {
    if (role === "coach") return language === "tr" ? "Mentor" : "Mentor";
    if (role === "corporate") return language === "tr" ? "Kurumsal Üye" : "Corporate";
    if (role === "admin") return "Yönetici";
    return language === "tr" ? "Danışan" : "Client";
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

  const displayName = me?.fullName || me?.email?.split("@")?.[0] || "Kullanıcı";

  const handleLogout = async () => {
    try {
      if (auth?.logout) await auth.logout();
    } catch (e) {
      window.location.href = "/";
    }
  };

  const mobileBtn = "w-full px-4 py-3 rounded-xl border text-left hover:bg-gray-50 transition font-medium text-slate-600";
  const mobilePrimary = "w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-left hover:brightness-110 transition shadow-md";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">K</div>
          <span className="font-black text-2xl text-slate-800 tracking-tighter italic">Kariyeer</span>
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            to="/webinars" 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive("/webinars") ? "bg-orange-50 text-orange-600 border border-orange-100" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Video className="h-4 w-4" />
            {t.webinar}
          </Link>
          
          <Link 
            to="/home" 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive("/home") ? "bg-orange-50 text-orange-600 border border-orange-100" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <HomeIcon className="h-4 w-4" />
            {t.feed}
          </Link>

          <Link to="/boost">
            <Button className="h-10 rounded-xl px-5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black italic uppercase text-[10px] tracking-widest hover:shadow-xl hover:brightness-110 transition-all border-none">
              <Zap className="h-4 w-4 mr-2" />
              {t.boost}
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Dil Seçimi */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl font-bold text-xs text-slate-500 border border-slate-100 hover:bg-slate-50">
                <Globe className="h-3.5 w-3.5 mr-2" />
                {(language || "tr").toUpperCase()}
                <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => setLanguage("tr")}>TR - Türkçe</DropdownMenuItem>
              <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => setLanguage("en")}>EN - English</DropdownMenuItem>
              <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => setLanguage("ar")}>AR - العربية</DropdownMenuItem>
              <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => setLanguage("fr")}>FR - Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn && <div className="hidden sm:block"><NotificationBell /></div>}

          {!isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" className="rounded-xl font-bold text-slate-600 hover:bg-slate-50">{t.login}</Button></Link>
              <Link to="/register"><Button className="rounded-xl bg-slate-900 text-white font-bold hover:bg-black shadow-lg shadow-slate-200">{t.register}</Button></Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardPath}>
                <Button className="rounded-xl bg-orange-600 text-white font-black italic uppercase text-[10px] tracking-widest h-10 px-5 hover:bg-orange-700 shadow-lg shadow-orange-100">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t.dashboard}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl h-10 border-slate-200 hover:border-orange-200 transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center mr-2">
                      <User className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <span className="font-bold text-sm text-slate-700 max-w-[100px] truncate">{displayName}</span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuLabel className="px-3 py-3">
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{roleLabel}</div>
                    <div className="text-sm font-black text-slate-800 mt-0.5 truncate">{displayName}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold text-slate-600" onClick={() => navigate("/home")}><HomeIcon className="mr-3 h-4 w-4 text-slate-400" />{t.feed}</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold text-slate-600" onClick={() => navigate(profilePath)}><User className="mr-3 h-4 w-4 text-slate-400" />{t.profile}</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold text-slate-600" onClick={() => navigate("/user/settings")}><Settings className="mr-3 h-4 w-4 text-slate-400" />{t.settings}</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer py-2.5 text-red-600 font-black italic uppercase text-[10px] tracking-widest"><LogOut className="mr-3 h-4 w-4" />{t.logout}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Button variant="ghost" className="md:hidden rounded-xl h-10 w-10 p-0 text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobil Menü */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-50 bg-white p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <button onClick={() => navigate("/home")} className={mobileBtn}><HomeIcon className="inline h-4 w-4 mr-3 text-slate-400" />{t.feed}</button>
          <button onClick={() => navigate("/webinars")} className={mobileBtn}><Video className="inline h-4 w-4 mr-3 text-slate-400" />{t.webinar}</button>
          <Link to="/boost" className="block" onClick={() => setMobileOpen(false)}>
            <div className={mobilePrimary}><Zap className="inline h-4 w-4 mr-3" />{t.boost}</div>
          </Link>
          <div className="pt-4 border-t border-slate-50 space-y-3">
            {!isLoggedIn ? (
              <>
                <button onClick={() => navigate("/login")} className={mobileBtn}>{t.login}</button>
                <button onClick={() => navigate("/register")} className={mobilePrimary}>{t.register}</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate(dashboardPath)} className={mobileBtn}><LayoutDashboard className="inline h-4 w-4 mr-3 text-slate-400" />{t.dashboard}</button>
                <button onClick={handleLogout} className={mobileBtn + " text-red-600 font-bold"}><LogOut className="inline h-4 w-4 mr-3" />{t.logout}</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
