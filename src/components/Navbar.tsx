// src/components/Navbar.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Globe,
  Video,
  User,
  LogOut,
  Settings,
  Home,
  LayoutDashboard,
  Building2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Role = "user" | "coach" | "corporate" | "admin" | null;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const authCtx = useAuth?.();

  // ---- LOGIN DURUMU (LOCALSTORAGE) ----
  const [storageLoggedIn, setStorageLoggedIn] = useState(false);
  const [storageEmail, setStorageEmail] = useState<string | null>(null);

  // ---- ROLE ----
  const [role, setRole] = useState<Role>(null);
  const [loadingRole, setLoadingRole] = useState(false);

  // ✅ 1) İlk kaynak: localStorage (en hızlı + en stabil)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kariyeer_user");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.isLoggedIn) {
        setStorageLoggedIn(true);
        setStorageEmail(parsed.email || null);

        // ✅ localStorage'da role varsa direkt onu kullan
        if (parsed?.role) setRole(parsed.role);
      }
    } catch (e) {
      console.error("localStorage parse error", e);
    }
  }, []);

  // ✅ Context login var mı?
  const contextLoggedIn = Boolean(
    authCtx?.isAuthenticated || authCtx?.supabaseUser || authCtx?.user
  );
  const isLoggedIn = storageLoggedIn || contextLoggedIn;

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case "tr":
        return tr;
      case "en":
        return en;
      case "fr":
        return fr;
      default:
        return tr;
    }
  };

  const mainNavItems = [
    {
      name: getNavText("Koçlar İçin", "For Coaches", "Pour les coachs"),
      path: "/for-coaches",
    },
    {
      name: getNavText(
        "Şirketler İçin",
        "For Companies",
        "Pour les entreprises"
      ),
      path: "/for-companies",
    },
    { name: "MentorCircle", path: "/mentor-circle" },
    { name: "Webinar", path: "/webinars", icon: Video },
  ];

  const cycleLanguage = () => {
    const languages = ["tr", "en", "fr"] as const;
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const getLanguageDisplay = () => {
    switch (language) {
      case "tr":
        return "TR";
      case "en":
        return "EN";
      case "fr":
        return "FR";
      default:
        return "TR";
    }
  };

  const getLanguageFullName = () => {
    switch (language) {
      case "tr":
        return "Türkçe";
      case "en":
        return "English";
      case "fr":
        return "Français";
      default:
        return "Türkçe";
    }
  };

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  const handleLogout = async () => {
    try {
      await authCtx?.logout?.();
    } catch (e) {
      console.error("Logout error:", e);
    }
    localStorage.removeItem("kariyeer_user");
    window.location.href = "/";
  };

  const getUserDisplayName = () => {
    if (authCtx?.user?.fullName) return authCtx.user.fullName;
    if (authCtx?.supabaseUser?.email)
      return authCtx.supabaseUser.email.split("@")[0];
    if (storageEmail) return storageEmail.split("@")[0];
    return getNavText("Kullanıcı", "User", "Utilisateur");
  };

  // ✅ 2) İkinci kaynak: Supabase profiles (varsa role'u günceller)
  useEffect(() => {
    const loadRole = async () => {
      if (!isLoggedIn) {
        setRole(null);
        return;
      }

      setLoadingRole(true);
      try {
        const { data } = await supabase.auth.getUser();
        const u = data?.user;

        // Supabase session yoksa localStorage role ile devam
        if (!u) {
          setLoadingRole(false);
          return;
        }

        const { data: prof, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .single();

        if (!error && prof?.role) {
          setRole(prof.role);

          // ✅ localStorage'ı da güncelle (kalıcı olsun)
          try {
            const raw = localStorage.getItem("kariyeer_user");
            const parsed = raw ? JSON.parse(raw) : {};
            localStorage.setItem(
              "kariyeer_user",
              JSON.stringify({
                ...parsed,
                isLoggedIn: true,
                email: parsed?.email || u.email,
                role: prof.role,
              })
            );
          } catch {}
        } else {
          // fallback: metadata
          const metaRole = u.user_metadata?.role ?? null;
          if (metaRole) setRole(metaRole);
        }
      } catch (e) {
        console.error("loadRole error", e);
      } finally {
        setLoadingRole(false);
      }
    };

    loadRole();
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadRole());
    return () => sub.subscription.unsubscribe();
  }, [isLoggedIn]);

  // ✅ ROLE-BASED ROUTES (ADMIN/CEO navbar’da gösterilmeyecek)
  const safeRole: "user" | "coach" | "corporate" =
    role === "coach" || role === "corporate" ? role : "user";

  const panelRoute =
    safeRole === "coach"
      ? "/coach/dashboard"
      : safeRole === "corporate"
      ? "/corporate/dashboard"
      : "/user/dashboard";

  const settingsRoute =
    safeRole === "coach"
      ? "/coach/settings"
      : safeRole === "corporate"
      ? "/corporate/settings"
      : "/user/settings";

  const profileRoute =
    safeRole === "coach"
      ? "/coach/profile"
      : safeRole === "corporate"
      ? "/corporate/profile"
      : "/user/profile";

  const panelLabel =
    safeRole === "coach"
      ? getNavText("Coach Panel", "Coach Panel", "Coach Panel")
      : safeRole === "corporate"
      ? getNavText("Corporate Panel", "Corporate Panel", "Corporate Panel")
      : getNavText("User Panel", "User Panel", "User Panel");

  const settingsLabel =
    safeRole === "coach"
      ? getNavText("Koç Ayarları", "Coach Settings", "Paramètres Coach")
      : safeRole === "corporate"
      ? getNavText(
          "Şirket Ayarları",
          "Corporate Settings",
          "Paramètres Entreprise"
        )
      : getNavText(
          "Kullanıcı Ayarları",
          "User Settings",
          "Paramètres Utilisateur"
        );

  const PanelIcon = safeRole === "corporate" ? Building2 : LayoutDashboard;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">K</span>
            </div>
            <span className="text-2xl font-bold text-red-600 hidden sm:block">
              Kariyeer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors py-2 whitespace-nowrap flex items-center gap-2 ${
                  location.pathname === item.path
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {/* Dil */}
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleLanguage}
              className="text-gray-600 hover:text-red-600"
            >
              <Globe className="h-4 w-4 mr-2" />
              {getLanguageDisplay()}
            </Button>

            {isLoggedIn && <NotificationBell />}

            {isLoggedIn ? (
              <>
                {/* Ana Sayfa */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => navigate("/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  {getNavText("Ana Sayfa", "Home", "Accueil")}
                </Button>

                {/* Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {getUserDisplayName()}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {getNavText("Hesabım", "My Account", "Mon compte")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* ✅ TEK PANEL */}
                    <DropdownMenuItem
                      onClick={() => navigate(panelRoute)}
                      disabled={loadingRole}
                    >
                      <PanelIcon className="h-4 w-4 mr-2" />
                      {loadingRole
                        ? getNavText(
                            "Yükleniyor...",
                            "Loading...",
                            "Chargement..."
                          )
                        : panelLabel}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* ✅ TEK PROFİL */}
                    <DropdownMenuItem
                      onClick={() => navigate(profileRoute)}
                      disabled={loadingRole}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {getNavText("Profil", "Profile", "Profil")}
                    </DropdownMenuItem>

                    {/* ✅ TEK AYAR */}
                    <DropdownMenuItem
                      onClick={() => navigate(settingsRoute)}
                      disabled={loadingRole}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {settingsLabel}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {getNavText("Çıkış Yap", "Logout", "Se déconnecter")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login/Register */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                  onClick={handleLoginClick}
                >
                  {getNavText("Giriş Yap", "Login", "Connexion")}
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRegisterClick}
                >
                  {getNavText("Kayıt Ol", "Register", "S'inscrire")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-red-600" />
            ) : (
              <Menu className="h-6 w-6 text-red-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    location.pathname === item.path
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={cycleLanguage}
                  className="justify-start text-gray-600 hover:text-red-600"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {getLanguageFullName()}
                </Button>

                {isLoggedIn ? (
                  <>
                    {/* Panel */}
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-start"
                      onClick={() => {
                        navigate(panelRoute);
                        setMobileMenuOpen(false);
                      }}
                      disabled={loadingRole}
                    >
                      <PanelIcon className="h-4 w-4 mr-2" />
                      {loadingRole
                        ? getNavText(
                            "Yükleniyor...",
                            "Loading...",
                            "Chargement..."
                          )
                        : panelLabel}
                    </Button>

                    {/* Profil */}
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-start"
                      onClick={() => {
                        navigate(profileRoute);
                        setMobileMenuOpen(false);
                      }}
                      disabled={loadingRole}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {getNavText("Profil", "Profile", "Profil")}
                    </Button>

                    {/* Ayarlar */}
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-start"
                      onClick={() => {
                        navigate(settingsRoute);
                        setMobileMenuOpen(false);
                      }}
                      disabled={loadingRole}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {settingsLabel}
                    </Button>

                    {/* Home */}
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-start"
                      onClick={() => {
                        navigate("/");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      {getNavText("Ana Sayfa", "Home", "Accueil")}
                    </Button>

                    {/* Logout */}
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 w-full justify-start"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {getNavText("Çıkış Yap", "Logout", "Se déconnecter")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 w-full"
                      onClick={() => {
                        handleLoginClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      {getNavText("Giriş Yap", "Login", "Connexion")}
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white w-full"
                      onClick={() => {
                        handleRegisterClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      {getNavText("Kayıt Ol", "Register", "S'inscrire")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
