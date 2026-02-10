import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Clock, ArrowLeft, Users, Calendar, Timer } from "lucide-react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function MeetingRoom() {
  const { roomName } = useParams<{ roomName: string }>();
  const navigate = useNavigate();
  const jitsiRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Jitsi script yükle
  useEffect(() => {
    if (document.querySelector('script[src*="external_api"]')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Meeting bilgisini al
  useEffect(() => {
    async function fetchRoom() {
      if (!roomName) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Giriş yapmanız gerekiyor");
        setLoading(false);
        return;
      }

      // meeting_rooms tablosundan ara
      const { data: meetingRoom } = await supabase
        .from("meeting_rooms")
        .select("*")
        .eq("room_name", roomName)
        .single();

      if (meetingRoom) {
        // Erişim kontrolü
        if (user.id !== meetingRoom.host_user_id && user.id !== meetingRoom.participant_user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role !== "admin") {
            setError("Bu toplantıya erişim yetkiniz yok");
            setLoading(false);
            return;
          }
        }
        setRoom(meetingRoom);
        setLoading(false);
        return;
      }

      // session_requests'ten ara (eski kayıtlar için)
      const { data: sessionReq } = await supabase
        .from("app_2dff6511da_session_requests")
        .select("*, coach:app_2dff6511da_coaches!coach_id(full_name, user_id)")
        .or(`meeting_room.eq.${roomName},jitsi_room.eq.${roomName}`)
        .single();

      if (sessionReq) {
        if (user.id !== sessionReq.user_id && user.id !== sessionReq.coach?.user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role !== "admin") {
            setError("Bu toplantıya erişim yetkiniz yok");
            setLoading(false);
            return;
          }
        }
        setRoom({
          room_name: roomName,
          room_url: sessionReq.meeting_url || sessionReq.jitsi_url,
          room_type: "coaching_session",
          host_name: sessionReq.coach?.full_name || "Koç",
          participant_name: sessionReq.full_name || "Danışan",
          host_user_id: sessionReq.coach?.user_id,
          participant_user_id: sessionReq.user_id,
          scheduled_at: sessionReq.selected_date ? `${sessionReq.selected_date}T${sessionReq.selected_time || "00:00"}:00` : null,
          duration_minutes: 45,
          status: "created",
        });
        setLoading(false);
        return;
      }

      setError("Toplantı bulunamadı");
      setLoading(false);
    }
    fetchRoom();
  }, [roomName]);

  // Geri sayım
  useEffect(() => {
    if (!room?.scheduled_at) return;
    const interval = setInterval(() => {
      const diff = new Date(room.scheduled_at).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Başlayabilirsiniz!");
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(h > 0 ? `${h} saat ${m} dk` : `${m} dk ${s} sn`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [room]);

  // Toplantıyı başlat
  const startMeeting = async () => {
    if (!jitsiRef.current || !roomName || !scriptLoaded) return;

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, avatar_url")
      .eq("id", user?.id)
      .single();

    const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
      roomName,
      parentNode: jitsiRef.current,
      width: "100%",
      height: "100%",
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        defaultLanguage: "tr",
        toolbarButtons: [
          "camera", "chat", "desktop", "filmstrip", "fullscreen",
          "hangup", "microphone", "participants-pane", "raisehand",
          "settings", "tileview", "toggle-camera",
        ],
      },
      interfaceConfigOverwrite: {
        APP_NAME: "Kariyeer",
        SHOW_JITSI_WATERMARK: false,
        SHOW_POWERED_BY: false,
        DEFAULT_BACKGROUND: "#1a1a2e",
      },
      userInfo: {
        displayName: profile?.full_name || "Kullanıcı",
        email: profile?.email || "",
      },
    });

    if (profile?.avatar_url) {
      api.executeCommand("avatarUrl", profile.avatar_url);
    }

    // Meeting durumu güncelle
    await supabase
      .from("meeting_rooms")
      .update({ status: "active", started_at: new Date().toISOString() })
      .eq("room_name", roomName);

    api.addEventListener("readyToClose", async () => {
      await supabase
        .from("meeting_rooms")
        .update({ status: "completed", ended_at: new Date().toISOString() })
        .eq("room_name", roomName);
      setInMeeting(false);
      api.dispose();
    });

    apiRef.current = api;
    setInMeeting(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Toplantı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <Card className="p-8 max-w-md text-center">
          <VideoOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erişim Hatası</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
          </Button>
        </Card>
      </div>
    );
  }

  if (inMeeting) {
    return <div ref={jitsiRef} style={{ width: "100%", height: "100vh" }} />;
  }

  const isInterview = room?.room_type === "interview";
  const scheduledDate = room?.scheduled_at ? new Date(room.scheduled_at) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
      <Card className="p-8 max-w-lg w-full text-center space-y-6">
        {/* İkon */}
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <Video className="w-10 h-10 text-indigo-600" />
        </div>

        {/* Başlık */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isInterview ? "🎯 Online Mülakat" : "👨‍💼 Kariyer Koçluğu Seansı"}
          </h1>
          <p className="text-gray-500 mt-1">Kariyeer.com</p>
        </div>

        {/* Bilgiler */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-left">
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">{isInterview ? "Mülakatçı:" : "Koç:"}</span>
            <span className="font-semibold">{room?.host_name || "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">{isInterview ? "Aday:" : "Danışan:"}</span>
            <span className="font-semibold">{room?.participant_name || "—"}</span>
          </div>
          {scheduledDate && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 font-medium">Tarih:</span>
                <span className="font-semibold">
                  {scheduledDate.toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 font-medium">Saat:</span>
                <span className="font-semibold">
                  {scheduledDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Timer className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Süre:</span>
            <span className="font-semibold">{room?.duration_minutes || 45} dakika</span>
          </div>
        </div>

        {/* Geri sayım */}
        {timeLeft && (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 rounded-lg">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-700 font-semibold">{timeLeft}</span>
          </div>
        )}

        {/* Katıl butonu */}
        <Button
          onClick={startMeeting}
          size="lg"
          disabled={!scriptLoaded}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
        >
          <Video className="w-5 h-5 mr-2" />
          {scriptLoaded ? "Görüşmeye Katıl" : "Yükleniyor..."}
        </Button>

        <p className="text-xs text-gray-400">
          Kameranız ve mikrofonunuz izin isteyecektir. Lütfen kabul edin.
        </p>

        {/* Geri dön */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-400">
          <ArrowLeft className="w-4 h-4 mr-1" /> Geri Dön
        </Button>
      </Card>
    </div>
  );
}
