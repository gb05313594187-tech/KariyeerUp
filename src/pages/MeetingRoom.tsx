// src/pages/MeetingRoom.tsx
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Video, VideoOff, Clock, ArrowLeft, Users, Calendar,
  Timer, Copy, CheckCircle2, Maximize2, Minimize2,
  Mic, MicOff, Camera, CameraOff, PhoneOff
} from "lucide-react";

async function safeGetUser() {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 5000)
    );
    const auth = supabase.auth.getUser();
    const result: any = await Promise.race([auth, timeout]);
    return result?.data?.user || null;
  } catch {
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
  } catch {
    return null;
  }
}

export default function MeetingRoom() {
  const { roomName } = useParams<{ roomName: string }>();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [meetingStartedAt, setMeetingStartedAt] = useState<number | null>(null);

  // ─── 1) Kullanıcı ve oda bilgisi al ───
  useEffect(() => {
    async function init() {
      if (!roomName) {
        setLoading(false);
        return;
      }

      try {
        const user = await safeGetUser();
        if (user) {
          const profile = await safeGetProfile(user.id);
          setUserProfile({ ...user, ...profile });
        }

        // meeting_rooms tablosundan ara
        const { data: meetingRoom } = await supabase
          .from("meeting_rooms")
          .select("*")
          .eq("room_name", roomName)
          .maybeSingle();

        if (meetingRoom) {
          setRoom(meetingRoom);
          setLoading(false);
          return;
        }

        // session_requests (eski tablo)
        try {
          const { data: oldReq } = await supabase
            .from("app_2dff6511da_session_requests")
            .select("*, coach:app_2dff6511da_coaches!coach_id(full_name, user_id)")
            .or(`meeting_room.eq.${roomName},jitsi_room.eq.${roomName}`)
            .maybeSingle();

          if (oldReq) {
            setRoom({
              room_name: roomName,
              room_type: "coaching_session",
              host_name: oldReq.coach?.full_name || "Koç",
              participant_name: oldReq.full_name || "Danışan",
              scheduled_at: oldReq.selected_date
                ? `${oldReq.selected_date}T${oldReq.selected_time || "00:00"}:00`
                : null,
              duration_minutes: 45,
              status: "created",
            });
            setLoading(false);
            return;
          }
        } catch {}

        // interviews tablosundan ara
        try {
          const { data: interview } = await supabase
            .from("interviews")
            .select("*")
            .or(`jitsi_room.eq.${roomName},meeting_link.ilike.%${roomName}%`)
            .maybeSingle();

          if (interview) {
            setRoom({
              room_name: roomName,
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
        } catch {}

        // Bulunamadı — genel oda
        setRoom({
          room_name: roomName,
          room_type: "general",
          status: "created",
          duration_minutes: 45,
        });
        setLoading(false);
      } catch (e) {
        console.error("Init error:", e);
        setRoom({
          room_name: roomName,
          room_type: "general",
          status: "created",
          duration_minutes: 45,
        });
        setLoading(false);
      }
    }
    init();
  }, [roomName]);

  // ─── 2) Geri sayım ───
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
        setTimeLeft(h > 0 ? `${h}sa ${m}dk` : `${m}dk ${s}sn`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [room]);

  // ─── 3) Toplantı süresi sayacı ───
  useEffect(() => {
    if (!meetingStartedAt) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - meetingStartedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [meetingStartedAt]);

  // ─── 4) Toplantıyı başlat ───
  const startMeeting = async () => {
    // DB status güncelle
    try {
      await supabase
        .from("meeting_rooms")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("room_name", roomName);
    } catch {}

    setMeetingStartedAt(Date.now());
    setInMeeting(true);
  };

  // ─── 5) Toplantıyı bitir ───
  const endMeeting = async () => {
    try {
      await supabase
        .from("meeting_rooms")
        .update({ status: "completed", ended_at: new Date().toISOString() })
        .eq("room_name", roomName);
    } catch {}

    setInMeeting(false);
    setMeetingStartedAt(null);
    navigate("/");
  };

  // ─── 6) Tam ekran ───
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomName}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Jitsi iframe URL — auth gerektirmeyen parametreler
  const jitsiRoomName = `kocvaktim-${roomName}`;
  const displayName = encodeURIComponent(userProfile?.full_name || userProfile?.email || "Katılımcı");
  const jitsiUrl = `https://meet.jit.si/${jitsiRoomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableDeepLinking=true&config.defaultLanguage=tr&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_POWERED_BY=false&interfaceConfig.MOBILE_APP_PROMO=false&userInfo.displayName="${displayName}"`;

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mx-auto" />
          <p className="mt-4 text-lg font-medium">Toplantı odası hazırlanıyor</p>
          <p className="text-sm text-white/50 mt-1">{roomName}</p>
        </div>
      </div>
    );
  }

  // ═══ IN MEETING — Profesyonel Video Ekranı ═══
  if (inMeeting) {
    return (
      <div className="h-screen bg-[#0b0e14] flex flex-col overflow-hidden">
        {/* ── Üst Bar ── */}
        <div className="bg-[#12151c] border-b border-white/5 px-4 py-2 flex items-center justify-between shrink-0 z-10">
          {/* Sol: Bilgi */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                {room?.room_type === "interview" ? "Canlı Mülakat" :
                 room?.room_type === "coaching_session" ? "Koçluk Seansı" : "Toplantı"}
              </span>
            </div>

            {(room?.host_name || room?.participant_name) && (
              <div className="hidden md:flex items-center gap-1.5 text-white/40 text-xs">
                <Users className="h-3 w-3" />
                <span>{room.host_name}</span>
                <span>↔</span>
                <span>{room.participant_name}</span>
              </div>
            )}
          </div>

          {/* Orta: Süre */}
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
            <Clock className="h-3.5 w-3.5 text-red-400" />
            <span className="text-white text-sm font-mono font-bold">
              {formatElapsed(elapsed)}
            </span>
          </div>

          {/* Sağ: Aksiyonlar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyLink}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Link kopyala"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Tam ekran"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={endMeeting}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors ml-2"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              Bitir
            </button>
          </div>
        </div>

        {/* ── Video Alanı ── */}
        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            title="Video Görüşme"
          />
        </div>
      </div>
    );
  }

  // ═══ LOBBY — Katılım Öncesi Ekranı ═══
  const isInterview = room?.room_type === "interview";
  const scheduledDate = room?.scheduled_at ? new Date(room.scheduled_at) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4">
      {/* Arka plan efektleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <Card className="p-8 max-w-lg w-full text-center space-y-6 rounded-3xl border-0 shadow-2xl shadow-black/20 relative z-10">
        {/* İkon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
          <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Video className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Başlık */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isInterview ? "Online Mülakat" : "Kariyer Koçluğu Seansı"}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Kariyeer.com • Güvenli Video Görüşme</p>
        </div>

        {/* Bilgiler */}
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-left">
          {room?.host_name && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-gray-400 text-xs">{isInterview ? "Mülakatçı" : "Koç"}</span>
                <p className="font-semibold text-gray-800 -mt-0.5">{room.host_name}</p>
              </div>
            </div>
          )}
          {room?.participant_name && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <span className="text-gray-400 text-xs">{isInterview ? "Aday" : "Danışan"}</span>
                <p className="font-semibold text-gray-800 -mt-0.5">{room.participant_name}</p>
              </div>
            </div>
          )}
          {scheduledDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="text-gray-400 text-xs">Tarih & Saat</span>
                <p className="font-semibold text-gray-800 -mt-0.5">
                  {scheduledDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}
                  {" • "}
                  {scheduledDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Timer className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <span className="text-gray-400 text-xs">Süre</span>
              <p className="font-semibold text-gray-800 -mt-0.5">{room?.duration_minutes || 45} dakika</p>
            </div>
          </div>
        </div>

        {/* Geri sayım */}
        {timeLeft && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="text-indigo-700 font-bold text-sm">{timeLeft}</span>
          </div>
        )}

        {/* Cihaz kontrol ipuçları */}
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Camera className="w-4 h-4" />
            <span className="text-xs">Kamera</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Mic className="w-4 h-4" />
            <span className="text-xs">Mikrofon</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-500">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Hazır</span>
          </div>
        </div>

        {/* Ana buton */}
        <Button
          onClick={startMeeting}
          size="lg"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-7 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Video className="w-5 h-5 mr-2" />
          Görüşmeye Katıl
        </Button>

        <p className="text-xs text-gray-400">
          Tarayıcınız kamera ve mikrofon izni isteyecektir.
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Ana Sayfa
        </Button>
      </Card>
    </div>
  );
}
