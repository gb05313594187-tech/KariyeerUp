// src/pages/Profile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCircle2, Mail, UserCog, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [coach, setCoach] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1) Auth kullanıcısını al
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      setAuthUser(user);

      // 2) Bu kullanıcıya bağlı koçu bul (coaches tablosunda user_id ile eşleştiriyoruz)
      const { data: coachRow, error: coachError } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!coachError && coachRow) {
        setCoach(coachRow);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-600">
        Profilin yükleniyor...
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-600">
        Profil görmek için giriş yapmalısın.
      </div>
    );
  }

  const displayName =
    coach?.full_name ||
    authUser.user_metadata?.full_name ||
    authUser.email;

  const role =
    authUser.user_metadata?.role ||
    (coach ? "Koç" : "Kullanıcı");

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Koç Profilim
        </h1>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            {/* Başlık satırı */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserCircle2 className="w-10 h-10 text-red-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {authUser.id.slice(0, 8)}…
                  </p>
                </div>
              </div>
              <Badge className="bg-red-50 text-red-700 border-red-100 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <UserCog className="w-3 h-3" />
                {role}
              </Badge>
            </div>

            {/* Email */}
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">E-posta:</span>
                <span>{authUser.email}</span>
              </div>
            </div>

            {/* Koç kaydı bilgisi */}
            {coach ? (
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p className="text-xs text-gray-500">
                  Bu hesap, aşağıdaki koç profiline bağlı:
                </p>
                <div className="rounded-xl bg-[#FFF8F5] border border-orange-100 px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {coach.full_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {coach.title || "Kariyer Koçu"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1"
                    onClick={() => navigate(`/coach/${coach.id}`)}
                  >
                    Herkese Açık Profili Gör
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-xs text-gray-500">
                Bu kullanıcıya bağlı koç kaydı bulunamadı. Koç başvurusu yaptıysan,
                onaylandıktan sonra burada görünecek.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
