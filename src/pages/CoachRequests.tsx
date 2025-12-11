// src/pages/CoachRequests.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  User,
  ArrowLeft,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface SessionRequest {
  id: string;
  coach_id: string;
  user_id: string | null;
  selected_date: string; // YYYY-MM-DD
  selected_time: string; // "19:00"
  status: string | null;
  created_at: string;
}

export default function CoachRequests() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1) Aktif kullanıcının koç kaydını bul
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // Kullanıcıyı al
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

        // Koç kaydını bul (user_id üzerinden)
        const { data: coach, error: coachError } = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (coachError || !coach) {
          console.error("Coach fetch error:", coachError);
          toast.error("Koç profilin bulunamadı. Önce koç profilini tamamla.");
          navigate("/coach/settings");
          return;
        }

        setCoachId(coach.id);
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
          .from("app_2dff6511da_session_requests")
          .select("*")
          .eq("coach_id", coachId)
          .order("selected_date", { ascending: true })
          .order("selected_time", { ascending: true });

        if (error) {
          console.error("Requests fetch error:", error);
          toast.error("Seans talepleri alınırken hata oluştu.");
          return;
        }

        setRequests(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Seans talepleri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [coachId]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("tr-TR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
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

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      setUpdatingId(id);

      const { error } = await supabase
        .from("app_2dff6511da_session_requests")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Update status error:", error);
        toast.error("Durum güncellenemedi.");
        return;
      }

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );

      toast.success(
        status === "approved"
          ? "Seans talebi onaylandı."
          : "Seans talebi reddedildi."
      );
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Durum güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = () => {
    if (!coachId) return;
    // coachId değişmiş gibi yapıp useEffect'i tekrar tetiklemek için
    setCoachId((prev) => (prev ? `${prev}` : prev));
  };

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
          Danışanların seçtiği gün ve saatler burada listelenir. Talebi onaylayabilir
          veya reddedebilirsin. İleride bu akışa ödeme ve takvim entegrasyonu eklenecek.
        </p>

        {/* İçerik */}
        {loading && (
          <div className="mt-10 text-center text-gray-500 text-sm">
            Seans talepleri yükleniyor...
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="mt-10 text-center text-gray-500 text-sm">
            Henüz hiç seans talebi yok. Danışanlar koç profilinden saat seçtiğinde
            burada görünecek.
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="space-y-3 mt-4">
            {requests.map((req) => (
              <Card
                key={req.id}
                className="bg-white border border-orange-100 shadow-sm"
              >
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
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Talep zamanı:&nbsp;
                          {new Date(req.created_at).toLocaleString("tr-TR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Danışan:{" "}
                          {req.user_id
                            ? req.user_id.slice(0, 8) + "..."
                            : "Giriş yapmamış kullanıcı"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      disabled={updatingId === req.id || req.status === "approved"}
                      onClick={() => handleUpdateStatus(req.id, "approved")}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Onayla
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-red-200 text-red-700 text-xs"
                      disabled={updatingId === req.id || req.status === "rejected"}
                      onClick={() => handleUpdateStatus(req.id, "rejected")}
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
