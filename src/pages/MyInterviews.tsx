// src/pages/MyInterviews.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, User, Globe, Clock } from "lucide-react";

export default function MyInterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  
  // Profil Verisi (Sol Sütun İçin)
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // 1. Mülakatları Çek
    async function loadInterviews() {
      const { data } = await supabase
        .from("interviews")
        .select("*, jobs(position, company_id)")
        .eq("candidate_id", user.id)
        .order("scheduled_at", { ascending: true });
      setInterviews(data || []);
    }

    // 2. Profil Çek (Home'daki mantığın aynısı)
    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, title, avatar_url, country, city")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }

    loadInterviews();
    loadProfile();
  }, [user]);

  // Avatar ve İsim Mantığı
  const avatarSrc = profile?.avatar_url || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;
  const displayName = profile?.full_name || user?.fullName || "Kullanıcı";
  const displayTitle = profile?.title || "Aday";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === SOL SÜTUN: SABİT PROFİL === */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border border-gray-200 sticky top-20">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <img src={avatarSrc} className="w-20 h-20 rounded-full border-4 border-gray-50 object-cover" />
              <div>
                <div className="font-bold text-gray-900">{displayName}</div>
                <div className="text-xs text-gray-500">{displayTitle}</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Globe size={12} /> {profile?.city}, {profile?.country}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === ORTA SÜTUN: MÜLAKATLAR === */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Video className="text-red-500" /> Mülakatlarım
          </h2>

          {/* Yaklaşan Mülakatlar */}
          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                <Video className="w-10 h-10 mx-auto text-gray-200 mb-2" />
                <p className="text-gray-500">Planlanmış mülakatınız yok.</p>
              </div>
            ) : (
              interviews.map(inv => (
                <Card key={inv.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{inv.jobs?.position || "Pozisyon"}</h3>
                        <p className="text-sm text-gray-500">Online Görüşme</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {new Date(inv.scheduled_at).toLocaleDateString("tr-TR")}
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          {new Date(inv.scheduled_at).toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    
                    {inv.meeting_link && (
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white gap-2">
                        <Video size={16} /> Görüşmeye Katıl
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* === SAĞ SÜTUN: TAKVİM WIDGET === */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border border-gray-200 sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" /> Takvim
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Basit Takvim Görüntüsü */}
              <div className="bg-gray-50 rounded-lg p-4 text-center text-xs text-gray-500">
                Takvim entegrasyonu aktif.
                <br />
                Tüm mülakatlarınız burada işaretlenir.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
