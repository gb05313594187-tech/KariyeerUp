// @ts-nocheck
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Video, User, LogOut, Settings, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

import NotificationBell from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, supabaseUser, isAuthenticated, logout } = useAuth();

  const [localUser, setLocalUser] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);

  // localStorage'taki user (login.tsx'te yazılan) 
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kariyeer_user");
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("localStorage okunamadı:", e);
    }
  }, []);

  // Supabase üzerinde aktif user var mı?
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setSessionUser(data.user);
        }
      } catch (e) {
        console.error("supabase.auth.getUser hatası:", e);
      }
    })();
  }, []);

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
      name: getNavText("Şirketler İçin", "For Companies", "Pour les entreprises"),
      path: "/for-companies",
    },
    {
      name: "MentorCircle",
      path: "/mentor-circle",
    },
    {
      name: "Webinar",
      path: "/webinars",
      icon: Video,
    },
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
      await logout?.();
    } catch (e) {
      console.error("Logout error:", e);
    }
    localStorage.removeItem("kariyeer_user");
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (supabaseUser?.email) return supabaseUser.email.split("@")[0];
    if (sessionUser?.email) return sessionUser.email.split("@")[0];
    if (localUser?.email) return localUser.email.split("@")[0];
    return getNavText("Kullanıcı", "User", "Utilisateur");
  };

  // 🔑 Kullanıcının gerçekten login sayılması için
  const isLoggedIn =
    Boolean(isAuthenticated) ||
    Boolean(user) ||
    Boolean(supabaseUser) ||
    Boolean(sessionUser) ||
    Boolean(localUser);

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

          {/* Desktop Right Side */}
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

                {/* Kullanıcı menüsü + Çıkış */}
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
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      {getNavText("Profil", "Profile", "Profil")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <Settings className="h-4 w-4 mr-2" />
                      {getNavText("Panel", "Dashboard", "Tableau de bord")}
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
                {/* Giriş / Kayıt – sadece login değilken */}
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
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </div>
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
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 w-full justify-start"
                      onClick={() => {
                        navigate("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {getNavText("Panel", "Dashboard", "Tableau de bord")}
                    </Button>
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
