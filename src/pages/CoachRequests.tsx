// src/pages/CoachRequests.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, ArrowLeft, Check, X, RefreshCw, Link2 } from "lucide-react";
import { toast } from "sonner";

const REQUESTS_TABLE = "app_2dff6511da_session_requests";
const COACHES_TABLE = "app_2dff6511da_coaches";
const SESSIONS_TABLE = "app_2dff6511da_sessions";

// Onay mail function (yeni)
const APPROVED_MAIL_FN =
  "https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/session-approved-email";

const JITSI_DOMAIN = (import.meta as any).env?.VITE_JITSI_DOMAIN || "meet.jit.si";

function toISOFromDateTimeTR(selected_date: string, selected_time: string) {
  // selected_date: YYYY-MM-DD, selected_time: "19:00"
  // timestamp'ı local -> ISO olarak kaydetmek istiyorsan bu yaklaşım yeterli.
  // İstersen ileride timezone politikanı netleştirirsin.
  const [y, m, d] = String(selected_date || "").split("-").map((x) => parseInt(x, 10));
  const [hh, mm] = String(selected_time || "").split(":").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return new Date().toISOString();
  const dt = new Date(y, (m - 1), d, hh || 0, mm || 0, 0, 0);
  return dt.toISOString();
}

function makeJitsiRoomName(requestId: string) {
  const clean = String(requestId || "").replace(/-/g, "");
  return `kariyeer-${clean}`; // benzersiz, stabil
}

function makeJitsiUrl(room: string) {
  // basit, dependencies yok
  return `https://${JITSI_DOMAIN}/${encodeURIComponent(room)}`;
}

interface SessionRequestRow {
  id: string;
  coach_id: string;
  user_id: string | null;

  full_name?: string | null;
  email?: string | null;

  selected_date: string;
  selected_time: string;
  status: string | null;
  payment_status?: string | null;

  jitsi_room?: string | null;
  jitsi_url?: string | null;

  created_at: string;
}

export default function CoachRequests() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [coachProfile, setCoachProfile] = useState<any | null>(null);

  const [requests, setRequests] = useState<SessionRequestRow[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [refreshTick, setRefreshTick] = useState(0);

  // 1) Aktif kullanıcının koç kaydını bul
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Auth error:", userError);
          toast.error("Bu sayfa için giriş yapman gerekiyor.");
          navigate("/login");
          return;
        }

        const { data: coach, error: coachError } = await supabase
          .from(COACHES_TABLE)
          .select("id, user_id, full_name, email")
          .eq("user_id", user.id)
          .single();

        if (coachError || !coach) {
          console.error("Coach fetch error:", coachError);
          toast.error("Koç profilin bulunamadı. Önce koç profilini tamamla.");
          navigate("/coach/settings");
          return;
        }

        setCoachId(coach.id);
        setCoachProfile(coach);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Seans talepleri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  // 2) Koç id belli olunca talepleri çek
  useEffect(() => {
    if (!coachId) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from(REQUESTS_TABLE)
          .select("*")
          .eq("coach_id", coachId)
          .order("selected_date", { ascending: true })
          .order("selected_time", { ascending: true });

        if (error) {
          console.error("Requests fetch error:", error);
          toast.error("Seans talepleri alınırken hata oluştu.");
          return;
        }

        setRequests((data || []) as any);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Seans talepleri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [coachId, refreshTick]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" });
    } catch {
      return dateStr;
    }
  };

  const statusBadge = (status: string | null) => {
    const s = status || "pending";
    if (s === "approved") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
          Onaylandı
        </Badge>
      );
    }
    if (s === "rejected") {
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-200 text-[11px]">
          Reddedildi
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px]">
        Beklemede
      </Badge>
    );
  };

  const paymentBadge = (payment_status?: string | null) => {
    const s = String(payment_status || "pending");
    if (s === "paid") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
          Ödeme Alındı
        </Badge>
      );
    }
    if (s === "failed") {
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-200 text-[11px]">
          Ödeme Başarısız
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-50 text-gray-700 border border-gray-200 text-[11px]">
        Ödeme Bekliyor
      </Badge>
    );
  };

  async function callApprovedEmail({
    accessToken,
    coach_email,
    coach_name,
    user_email,
    user_name,
    session_date,
    time_slot,
    meeting_url,
  }: any) {
    try {
      await fetch(APPROVED_MAIL_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: (import.meta as any).env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          coach_email,
          coach_name,
          user_email,
          user_name,
          session_date,
          time_slot,
          meeting_url,
        }),
      });
    } catch (e) {
      console.error("session-approved-email error:", e);
    }
  }

  const handleUpdateStatus = async (reqRow: SessionRequestRow, nextStatus: "approved" | "rejected") => {
    const id = reqRow.id;

    try {
      setUpdatingId(id);

      // ✅ onay için ödeme şartı (istersen kaldırabilirsin ama mantıklı)
      if (nextStatus === "approved" && String(reqRow.payment_status || "") !== "paid") {
        toast.error("Ödeme alınmadan seans onaylanamaz.");
        return;
      }

      // session token (mail function auth header için)
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess?.session?.access_token || null;
      if (!accessToken) {
        toast.error("Oturum bulunamadı. Tekrar giriş yap.");
        navigate("/login");
        return;
      }

      if (nextStatus === "rejected") {
        const { error } = await supabase
          .from(REQUESTS_TABLE)
          .update({
            status: "rejected",
            rejected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) {
          console.error("Reject error:", error);
          toast.error("Durum güncellenemedi.");
          return;
        }

        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
        toast.success("Seans talebi reddedildi.");
        return;
      }

      // ✅ APPROVE: Jitsi oluştur + DB yaz + sessions upsert + mail
      const room = reqRow.jitsi_room || makeJitsiRoomName(id);
      const url = reqRow.jitsi_url || makeJitsiUrl(room);

      // 1) request update
      const approvedAt = new Date().toISOString();
      const { error: upErr } = await supabase
        .from(REQUESTS_TABLE)
        .update({
          status: "approved",
          approved_at: approvedAt,
          meeting_status: "created",
          jitsi_room: room,
          jitsi_url: url,
          updated_at: approvedAt,
        })
        .eq("id", id);

      if (upErr) {
        console.error("Approve update error:", upErr);
        toast.error("Onay işlemi başarısız.");
        return;
      }

      // 2) sessions upsert
      // request'ten zaman üret
      const scheduled_start = toISOFromDateTimeTR(reqRow.selected_date, reqRow.selected_time);

      const { error: sesErr } = await supabase
        .from(SESSIONS_TABLE)
        .upsert(
          {
            request_id: id,
            coach_id: reqRow.coach_id,
            user_id: reqRow.user_id,
            scheduled_start,
            duration_min: 45,
            status: "scheduled",
            meeting_provider: "jitsi",
            meeting_room: room,
            meeting_url: url,
            updated_at: approvedAt,
          },
          { onConflict: "request_id" }
        );

      if (sesErr) {
        console.error("sessions upsert error:", sesErr);
        // request onaylandı ama session oluşmadıysa kullanıcı/koç ekranı eksik kalır — burada uyar
        toast.error("Onaylandı ama seans kaydı oluşamadı (sessions). SQL/RLS kontrol et.");
        return;
      }

      // 3) mail (user + coach)
      await callApprovedEmail({
        accessToken,
        coach_email: coachProfile?.email || "",
        coach_name: coachProfile?.full_name || "Koç",
        user_email: reqRow.email || "",
        user_name: reqRow.full_name || "Kullanıcı",
        session_date: reqRow.selected_date,
        time_slot: reqRow.selected_time,
        meeting_url: url,
      });

      // UI update
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "approved", jitsi_room: room, jitsi_url: url }
            : r
        )
      );

      toast.success("Seans onaylandı. Jitsi linki oluşturuldu ve mail atıldı.");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Durum güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = () => setRefreshTick((t) => t + 1);

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-300 text-gray-700"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Geri
            </Button>
            <h1 className="text-2xl font-bold">Seans Taleplerim</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-gray-300 text-gray-700 flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Danışanların seçtiği gün ve saatler burada listelenir. Ödeme alındıktan sonra
          onayladığında otomatik Jitsi linki oluşur, DB’ye yazılır ve mail ile gönderilir.
        </p>

        {loading && (
          <div className="mt-10 text-center text-gray-500 text-sm">Seans talepleri yükleniyor...</div>
        )}

        {!loading && requests.length === 0 && (
          <div className="mt-10 text-center text-gray-500 text-sm">
            Henüz hiç seans talebi yok.
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="space-y-3 mt-4">
            {requests.map((req) => (
              <Card key={req.id} className="bg-white border border-orange-100 shadow-sm">
                <CardContent className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CalendarDays className="w-5 h-5 text-orange-500" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatDate(req.selected_date)} · {req.selected_time}
                        </span>
                        {statusBadge(req.status)}
                        {paymentBadge(req.payment_status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Talep zamanı:&nbsp;{new Date(req.created_at).toLocaleString("tr-TR")}
                        </span>

                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Danışan:&nbsp;{req.full_name || (req.user_id ? req.user_id.slice(0, 8) + "..." : "Bilinmiyor")}
                        </span>
                      </div>

                      {req.jitsi_url ? (
                        <div className="text-xs flex items-center gap-2 text-gray-600 mt-1">
                          <Link2 className="w-3.5 h-3.5" />
                          <a className="underline" href={req.jitsi_url} target="_blank" rel="noreferrer">
                            Jitsi Linki Hazır
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      disabled={updatingId === req.id || req.status === "approved"}
                      onClick={() => handleUpdateStatus(req, "approved")}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Onayla
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-red-200 text-red-700 text-xs"
                      disabled={updatingId === req.id || req.status === "rejected"}
                      onClick={() => handleUpdateStatus(req, "rejected")}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reddet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
