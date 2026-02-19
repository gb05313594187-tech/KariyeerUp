// src/layouts/UserLayout.tsx
// @ts-nocheck
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Briefcase,
  Brain,
  Calendar,
  Video,
  Users,
  Globe,
  Bookmark
} from "lucide-react";

export default function UserLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  // Profil verisini çek (Home.tsx'teki mantığın aynısı)
  useEffect(() => {
    if (!user?.id) return;
    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, title, avatar_url, country, city")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data);
    }
    loadProfile();
  }, [user]);

  const avatarSrc =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "anon"}`;

  const displayName = profile?.full_name || user?.fullName || "Kullanıcı";
  const displayTitle = profile?.title || "Kariyer Yolculuğu Üyesi";
  const displayLocation = profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === SOL SÜTUN (SABİT) === */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Profil Kartı */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <img src={avatarSrc} className="w-12 h-12 rounded-xl border border-gray-100 object-cover" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{displayName}</div>
                <div className="text-[11px] text-gray-500 truncate">{displayTitle}</div>
                {displayLocation && (
                  <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                    <Globe className="w-3 h-3" /> <span>{displayLocation}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Menü */}
          <Card className="bg-white border border-gray-200 sticky top-24">
            <CardContent className="p-3 space-y-1 text-sm">
              <MenuItem icon={Briefcase} label="Başvurularım" path="/my-applications" color="text-blue-600" />
              <MenuItem icon={Brain} label="Raporlar" path="/my-reports" color="text-indigo-600" />
              <MenuItem icon={Calendar} label="Takvimim" path="/calendar" color="text-orange-600" />
              <MenuItem icon={Video} label="Mülakatlarım" path="/my-interviews" color="text-red-600" />
              <MenuItem icon={Users} label="Seanslarım" path="/my-sessions-hub" color="text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* === ORTA ALAN (DEĞİŞEN İÇERİK) === */}
        <div className="lg:col-span-9">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

// Yardımcı Menü Bileşeni
function MenuItem({ icon: Icon, label, path, color }: any) {
  const navigate = useNavigate();
  // Aktif sayfa kontrolü (basit)
  const isActive = window.location.pathname === path;
  
  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full text-left px-2 py-2 rounded-lg flex items-center gap-3 transition-colors ${
        isActive ? "bg-gray-100 font-semibold text-gray-900" : "hover:bg-gray-50 text-gray-600"
      }`}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <span>{label}</span>
    </button>
  );
}
