// src/pages/MeetingRoom.tsx
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Video, VideoOff, Clock, ArrowLeft, Users, Calendar,
  Timer, ExternalLink, Copy, CheckCircle2
} from "lucide-react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

// Auth'u timeout ile güvenli al
async function safeGetUser() {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("auth_timeout")), 5000)
    );
    const authPromise = supabase.auth.getUser();
    const result = await Promise.race([authPromise, timeoutPromise]);
    return result?.data?.user || null;
  } catch (e) {
    console.warn("Auth timeout, anonim devam ediliyor:", e);
    return null;
  }
}

async function safeGetProfile(userId: string) {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, avatar_url, role")
      .eq("id", userId)
      .single();
    return data;
  } catch (e) {
    return null;
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
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // ─── 1) Jitsi script yükle ───
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      setScriptLoaded(true);
      return;
    }
    const existing = document.querySelector('script[src*="external_api"]');
    if (existing) {
      const check = setInterval(() => {
        if (window.JitsiMeetExternalAPI) {
          setScriptLoaded(true);
          clearInterval(check);
        }
      }, 200);
      setTimeout(() => clearInterval(check), 10000);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.warn("Jitsi script yüklenemedi, fallback kullanılacak");
      setScriptLoaded(false);
    };
    document.head.appendChild(script);
  }, []);

  // ─── 2) Kullanıcı ve oda bilgisi al ───
  useEffect(() => {
    async function init() {
      if (!roomName) {
        setError("Oda adı bulunamadı");
        setLoading(false);
        return;
      }

      try {
        // Auth — timeout safe
        const user = await safeGetUser();
        let profile = null;
        let isAdmin = false;

        if (user) {
          profile = await safeGetProfile(user.id);
          setUserProfile({ ...user, ...profile });
          isAdmin = profile?.role === "admin";
        }

        // ── A) meeting_rooms tablosundan ara ──
        const { data: meetingRoom } = await supabase
          .from("meeting_rooms")
          .select("*")
          .eq("room_name", roomName)
          .maybeSingle();

        if (meetingRoom) {
          // Auth varsa erişim kontrolü yap, yoksa geç
          if (user) {
            const isHost = user.id === meetingRoom.host_user_id;
            const isParticipant = user.id === meetingRoom.participant_user_id;
            if (!isAdmin && !isHost && !isParticipant) {
              // Erişim yok ama yine de Jitsi'yi açabilecek fallback sunuyoruz
              console.warn("Erişim kısıtlı ama fallback sunuluyor");
            }
          }
          setRoom(meetingRoom);
          setLoading(false);
          return;
        }

        // ── B) session_requests (yeni tablo) ──
        try {
          const { data: newReq } = await supabase
            .from("session_requests")
            .select("*")
            .or(`id.eq.${roomName}`)
            .maybeSingle();

          if (newReq) {
            setRoom({
              room_name: roomName,
              room_url: newReq.meeting_url || `https://meet.jit.si/kocvaktim-${roomName}`,
              room_type: "coaching_session",
              host_name: "Koç",
              participant_name: newReq.full_name || "Danışan",
              scheduled_at: newReq.selected_date
                ? `${newReq.selected_date}T${newReq.selected_time || "00:00"}:00`
                : null,
              duration_minutes: 45,
              status: "created",
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("session_requests sorgusu başarısız:", e);
        }

        // ── C) session_requests (eski tablo) ──
        try {
          const { data: oldReq } = await supabase
            .from("app_2dff6511da_session_requests")
            .select("*, coach:app_2dff6511da_coaches!coach_id(full_name, user_id)")
            .or(`meeting_room.eq.${roomName},jitsi_room.eq.${roomName}`)
            .maybeSingle();

          if (oldReq) {
            setRoom({
              room_name: roomName,
              room_url: oldReq.meeting_url || oldReq.jitsi_url || `https://meet.jit.si/kocvaktim-${roomName}`,
              room_type: "coaching_session",
              host_name: oldReq.coach?.full_name || "Koç",
              participant_name: oldReq.full_name || "Danışan",
              host_user_id: oldReq.coach?.user_id,
              participant_user_id: oldReq.user_id,
              scheduled_at: oldReq.selected_date
                ? `${oldReq.selected_date}T${oldReq.selected_time || "00:00"}:00`
                : null,
              duration_minutes: 45,
              status: "created",
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Eski session_requests sorgusu başarısız:", e);
        }

        // ── D) interviews tablosundan ara ──
        try {
          const { data: interview } = await supabase
            .from("interviews")
            .select("*")
            .or(`jitsi_room.eq.${roomName},meeting_link.ilike.%${roomName}%`)
            .maybeSingle();

          if (interview) {
            setRoom({
              room_name: roomName,
              room_url: interview.jitsi_url || interview.meeting_link || `https://meet.jit.si/kocvaktim-${roomName}`,
              room_type: "interview",
              host_name: interview.interviewer_name || "Mülakatçı",
              participant_name: interview.candidate_name || "Aday",
              scheduled_at: interview.scheduled_at,
              duration_minutes: interview.duration_minutes || 45,
              status: interview.status || "created",
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Interviews sorgusu başarısız:", e);
        }

        // ── E) Hiçbir yerde bulunamadı → yine de aç ──
        console.warn("Room DB'de bulunamadı, ad-hoc:", roomName);
        setRoom({
          room_name: roomName,
          room_url: `https://meet.jit.si/kocvaktim-${roomName}`,
          room_type: "general",
          host_name: "",
          participant_name: "",
          status: "created",
          duration_minutes: 45,
        });
        setLoading(false);
      } catch (e: any) {
        console.error("Room init error:", e);
        // Hata olsa bile sayfayı aç
        setRoom({
          room_name: roomName,
          room_url: `https://meet.jit.si/kocvaktim-${roomName}`,
          room_type: "general",
          status: "created",
          duration_minutes: 45,
        });
        setLoading(false);
      }
    }

    init();
  }, [roomName]);

  // ─── 3) Geri sayım ───
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

  // ─── 4) Jitsi embed ile toplantıyı başlat ───
  const startMeeting = async () => {
    if (!roomName) return;

    const jitsiRoomName = `kocvaktim-${roomName}`;

    // Jitsi External API varsa embed olarak aç
    if (scriptLoaded && window.JitsiMeetExternalAPI && jitsiRef.current) {
      try {
        jitsiRef.current.innerHTML = "";

        const displayName = userProfile?.full_name || userProfile?.email || "Katılımcı";
        const email = userProfile?.email || "";

        const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: jitsiRoomName,
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
            MOBILE_APP_PROMO: false,
          },
          userInfo: {
            displayName,
            email,
          },
        });

        if (userProfile?.avatar_url) {
          api.executeCommand("avatarUrl", userProfile.avatar_url);
        }

        // Meeting status güncelle (hata olursa sessizce geç)
        try {
          await supabase
            .from("meeting_rooms")
            .update({ status: "active", started_at: new Date().toISOString() })
            .eq("room_name", roomName);
        } catch (e) {
          console.warn("Meeting status update failed:", e);
        }

        api.addEventListener("videoConferenceJoined", () => {
          console.log("✅ Toplantıya katıldı:", jitsiRoomName);
        });

        api.addEventListener("readyToClose", async () => {
          try {
            await supabase
              .from("meeting_rooms")
              .update({ status: "completed", ended_at: new Date().toISOString() })
              .eq("room_name", roomName);
          } catch (e) {
            console.warn("Meeting end update failed:", e);
          }
          setInMeeting(false);
          api.dispose();
        });

        apiRef.current = api;
        setInMeeting(true);
        return;
      } catch (e) {
        console.error("Jitsi embed hatası:", e);
        // Fallback'e düş
      }
    }

    // Fallback: Yeni sekmede aç
    console.log("Jitsi embed kullanılamıyor, yeni sekmede açılıyor");
    openExternal();
  };

  // ─── Yardımcı fonksiyonlar ───
  const openExternal = () => {
    window.open(`https://meet.jit.si/kocvaktim-${roomName}`, "_blank");
  };

  const copyLink = () => {
    const url = `${window.location.origin}/meeting/${roomName}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endMeeting = async () => {
    if (apiRef.current) {
      try { apiRef.current.dispose(); } catch (e) {}
      apiRef.current = null;
    }
    try {
      if (roomName) {
        await supabase
          .from("meeting_rooms")
          .update({ status: "completed", ended_at: new Date().toISOString() })
          .eq("room_name", roomName);
      }
    } catch (e) {
      console.warn("End meeting update failed:", e);
    }
    setInMeeting(false);
    navigate(-1);
  };

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto" />
          <p className="mt-4 text-lg">Toplantı yükleniyor...</p>
          <p className="text-sm text-white/60 mt-1">{roomName}</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
        <Card className="p-8 max-w-md text-center rounded-2xl">
          <VideoOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erişim Hatası</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={openExternal}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Jitsi'de Aç (Alternatif)
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-lg"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // IN MEETING — Jitsi Embed Tam Ekran
  if (inMeeting) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Üst bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              {room?.room_type === "interview"
                ? "🎯 Mülakat"
                : room?.room_type === "coaching_session"
                ? "🧠 Koçluk Seansı"
                : "📹 Toplantı"}
            </span>
            {(room?.host_name || room?.participant_name) && (
              <span className="text-gray-400 text-xs hidden sm:inline">
                {room.host_name} ↔ {room.participant_name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={copyLink}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white h-8 text-xs"
            >
              {copied ? (
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-400" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              {copied ? "Kopyalandı!" : "Link"}
            </Button>
            <Button
              onClick={openExternal}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white h-8 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" /> Yeni Sekme
            </Button>
            <Button
              onClick={endMeeting}
              size="sm"
              className="bg-red-600 hover:bg-red-700 h-8 text-xs rounded-lg"
            >
              Bitir
            </Button>
          </div>
        </div>
        {/* Jitsi embed alanı */}
        <div ref={jitsiRef} className="flex-1" />
      </div>
    );
  }

  // LOBBY — Toplantıya katılmadan önce bilgi ekranı
  const isInterview = room?.room_type === "interview";
  const scheduledDate = room?.scheduled_at ? new Date(room.scheduled_at) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
      <Card className="p-8 max-w-lg w-full text-center space-y-6 rounded-2xl">
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
          {room?.host_name && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 font-medium">
                {isInterview ? "Mülakatçı:" : "Koç:"}
              </span>
              <span className="font-semibold">{room.host_name}</span>
            </div>
          )}
          {room?.participant_name && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 font-medium">
                {isInterview ? "Aday:" : "Danışan:"}
              </span>
              <span className="font-semibold">{room.participant_name}</span>
            </div>
          )}
          {scheduledDate && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-500 font-medium">Tarih:</span>
                <span className="font-semibold">
                  {scheduledDate.toLocaleDateString("tr-TR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-500 font-medium">Saat:</span>
                <span className="font-semibold">
                  {scheduledDate.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Timer className="w-4 h-4 text-gray-400 shrink-0" />
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

        {/* Butonlar */}
        <div className="space-y-3">
          <Button
            onClick={startMeeting}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6 rounded-xl"
          >
            <Video className="w-5 h-5 mr-2" />
            Görüşmeye Katıl
          </Button>

          <Button
            onClick={openExternal}
            variant="outline"
            className="w-full rounded-xl"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Yeni Sekmede Aç (Alternatif)
          </Button>
        </div>

        {/* Link kopyala */}
        <div className="flex items-center justify-center">
          <Button
            onClick={copyLink}
            variant="ghost"
            size="sm"
            className="text-gray-400 text-xs"
          >
            {copied ? (
              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            {copied ? "Link kopyalandı!" : "Toplantı linkini kopyala"}
          </Button>
        </div>

        <p className="text-xs text-gray-400">
          Kameranız ve mikrofonunuz izin isteyecektir. Lütfen kabul edin.
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Ana Sayfa
        </Button>
      </Card>
    </div>
  );
}
