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

  const role = auth?.user?.userType ?? null;
  const me = auth?.user ?? null;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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

  const premiumLabel = useMemo(() => {
    return role === "corporate" ? "Kurumsal Premium" : "Bireysel Premium";
  }, [role]);

  const displayName = me?.fullName || me?.email?.split("@")[0] || "Kullanıcı";

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

        {/* CENTER: Direct links */}
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
