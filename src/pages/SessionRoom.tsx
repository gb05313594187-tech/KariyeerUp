// src/pages/SessionRoom.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, ShieldAlert, Video } from "lucide-react";
import { toast } from "sonner";

const SESSIONS_TABLE = "app_2dff6511da_sessions";
const COACHES_TABLE = "app_2dff6511da_coaches";

export default function SessionRoom() {
  const { id } = useParams(); // session id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sessionRow, setSessionRow] = useState<any | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const { data: auth } = await supabase.auth.getUser();
        const user = auth?.user;
        if (!user) {
          toast.error("Bu sayfa için giriş yapmalısın.");
          navigate("/login");
          return;
        }

        if (!id) {
          toast.error("Seans bulunamadı.");
          navigate(-1);
          return;
        }

        const { data: s, error: sErr } = await supabase
          .from(SESSIONS_TABLE)
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (sErr || !s) {
          console.error("session fetch error:", sErr);
          toast.error("Seans bulunamadı.");
          navigate(-1);
          return;
        }

        // Yetki:
        // - kullanıcı ise: s.user_id == auth.uid
        // - koç ise: coaches.user_id == auth.uid AND coaches.id == s.coach_id
        let ok = false;

        if (String(s.user_id) === String(user.id)) ok = true;

        if (!ok) {
          const { data: coach, error: cErr } = await supabase
            .from(COACHES_TABLE)
            .select("id, user_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!cErr && coach?.id && String(coach.id) === String(s.coach_id)) {
            ok = true;
          }
        }

        setSessionRow(s);
        setAllowed(ok);

        if (!ok) {
          toast.error("Bu seansa erişim yetkin yok.");
        }
      } catch (e) {
        console.error(e);
        toast.error("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, navigate]);

  const meetingUrl = useMemo(() => {
    const u = String(sessionRow?.meeting_url || "").trim();
    return u || null;
  }, [sessionRow]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h1 className="text-xl font-bold">Erişim Yok</h1>
          </div>

          <p className="text-sm text-gray-600">
            Bu seans odasına erişim yetkin yok.
          </p>

          <div className="mt-6">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Geri
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!meetingUrl) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-xl font-bold">Seans Linki Hazır Değil</h1>
          <p className="text-sm text-gray-600 mt-2">
            Koç onayı sonrası Jitsi linki oluşur. Bu seans henüz hazırlanmadı.
          </p>
          <div className="mt-6">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Geri
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-white/80" />
            <div>
              <div className="font-extrabold">Seans Odası</div>
              <div className="text-xs text-white/70">
                {new Date(sessionRow?.scheduled_start).toLocaleString("tr-TR")} · {sessionRow?.duration_min || 45} dk
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Geri
            </Button>

            <a href={meetingUrl} target="_blank" rel="noreferrer">
              <Button className="rounded-xl bg-white text-black hover:bg-white/90">
                <ExternalLink className="w-4 h-4 mr-1" />
                Yeni Sekmede Aç
              </Button>
            </a>
          </div>
        </div>

        <Card className="bg-black/30 border-white/10">
          <CardContent className="p-2 md:p-3">
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                title="Jitsi Meeting"
                src={meetingUrl}
                allow="camera; microphone; fullscreen; display-capture"
                className="w-full h-full"
              />
            </div>

            <div className="mt-3 text-xs text-white/70">
              Sorun olursa linki kopyalayıp tarayıcıda açabilirsin:{" "}
              <span className="text-white/90 break-all">{meetingUrl}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-xs text-white/60">
          Seans ID: <span className="text-white/80">{sessionRow?.id}</span>
        </div>
      </div>
    </div>
  );
}
