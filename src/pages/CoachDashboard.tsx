// src/pages/CoachDashboard.tsx
// @ts-nocheck
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  User,
  Wallet,
  TrendingUp,
  Star,
  Filter,
  MessageCircle,
  Video,
  Download,
  Check,
  XCircle,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SESSION_TABLE = "app_2dff6511da_session_requests";
const COACHES_TABLE = "app_2dff6511da_coaches";

// Grafik için örnek veri (şimdilik mock, sonra Supabase'e bağlarız)
const earningsData = [
  { month: "Tem", amount: 8200 },
  { month: "Ağu", amount: 10400 },
  { month: "Eyl", amount: 9500 },
  { month: "Eki", amount: 11200 },
  { month: "Kas", amount: 13400 },
  { month: "Ara", amount: 14800 },
];

// Status badge görünümü
const renderStatusBadge = (status: string) => {
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
    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
      Beklemede
    </Badge>
  );
};

// Tarihi TR formatına çevir
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// today / week filtresi için yardımcı
const isToday = (dateStr: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};

const isThisWeek = (dateStr: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  const diff = d.getTime() - t.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);
  return diffDays >= -1 && diffDays <= 7; // küçük esneklik
};

export default function CoachDashboard() {
  const [sessionFilter, setSessionFilter] = useState<"all" | "today" | "week">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState<any | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1) Giriş yapan kullanıcı → koç kaydı → o koça gelen seans talepleri
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Auth user
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth?.user?.id;

        if (!userId) {
          setCoach(null);
          setRequests([]);
          setLoading(false);
          return;
        }

        // Bu user_id'ye bağlı koç kaydını bul
        const { data: coachRow, error: coachErr } = await supabase
          .from(COACHES_TABLE)
          .select("*")
          .eq("user_id", userId)
          .single();

        if (coachErr || !coachRow) {
          console.error("Coach not found for user:", coachErr);
          setCoach(null);
          setRequests([]);
          setLoading(false);
          return;
        }

        setCoach(coachRow);

        // Bu koça gelen seans talepleri
        const { data: reqs, error: reqErr } = await supabase
          .from(SESSION_TABLE)
          .select("*")
          .eq("coach_id", coachRow.id)
          .order("created_at", { ascending: false });

        if (reqErr) {
          console.error("Session requests error:", reqErr);
          setRequests([]);
        } else {
          setRequests(reqs || []);
        }
      } catch (err) {
        console.error("CoachDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2) Onayla / Reddet
  const updateStatus = async (id: string, nextStatus: "approved" | "rejected") => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from(SESSION_TABLE)
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) {
        console.error("Update status error:", error);
        toast.error("Durum güncellenemedi.");
        return;
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
      );

      if (nextStatus === "approved") {
        toast.success("Seans talebini onayladınız.");
      } else {
        toast("Seans talebini reddettiniz.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Bir hata oluştu.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved")
    .length;

  // Filtrelenmiş istekler (Tümü / Bugün / Bu Hafta)
  const filteredRequests = requests.filter((req) => {
    const dStr = req.selected_date || req.session_date;
    if (sessionFilter === "today") return isToday(dStr);
    if (sessionFilter === "week") return isThisWeek(dStr);
    return true;
  });

  // Gelecek / Geçmiş ayrımı (tarih ve status'e göre)
  const today = new Date();
  const upcomingRequests = filteredRequests.filter((req) => {
    const dStr = req.selected_date || req.session_date;
    if (!dStr) return false;
    const d = new Date(dStr);
    return d >= today || req.status === "pending";
  });

  const pastRequests = filteredRequests.filter((req) => {
    const dStr = req.selected_date || req.session_date;
    if (!dStr) return false;
    const d = new Date(dStr);
    return d < today && req.status === "approved";
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Koç paneli yükleniyor...
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300 px-4 text-center">
        Koç profiliniz bulunamadı. Lütfen önce koç başvurusu yapın veya
        <span className="font-semibold mx-1">/coach/settings</span>
        sayfasından profilinizi tamamlayın.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO TOP BAR */}
      <section className="border-b border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-xl font-semibold">
              {coach.full_name
                ? coach.full_name
                    .split(" ")
                    .map((p: string) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "KO"}
            </div>
            <div>
              <p className="text-xs text-slate-400">Koç Kontrol Paneli</p>
              <h1 className="text-xl font-semibold tracking-tight">
                Hoş geldin, {coach.full_name || "Koç"}
              </h1>
              <p className="text-xs text-slate-400">
                {pendingCount} bekleyen seans talebin, {approvedCount} onaylı
                seansın var.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="border-white/20">
              <Video className="w-3 h-3 mr-2" />
              Tanıtım Videosu Ekle
            </Button>
            <Button
              size="sm"
              className="bg-indigo-500 hover:bg-indigo-400 rounded-full"
            >
              <CalendarDays className="w-3 h-3 mr-2" />
              Takvimimi Düzenle
            </Button>
          </div>
        </div>
      </section>

      {/* ANA İÇERİK */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ÜST ÖZET KARTLARI */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Bekleyen Talepler</p>
              <p className="text-2xl font-semibold">{pendingCount}</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Toplam istek:{" "}
                {requests.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Onaylı Seans</p>
              <p className="text-2xl font-semibold">{approvedCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                (Geçmiş + gelecek onaylı seanslar)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Toplam Talep</p>
              <p className="text-2xl font-semibold">{requests.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hemen Seans Al üzerinden
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Ortalama Puan</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <p className="text-2xl font-semibold">
                  {coach.rating ? coach.rating.toFixed(1) : "4.9"}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                (Puan alanı Supabase’e bağlanabilir)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* GRAFİK + KAZANÇ ÖZETİ (şimdilik mock) */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="bg-slate-900/80 border-white/10 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Aylık Kazanç Trendi (örnek)
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" className="h-7 border-white/20">
                  Son 6 Ay
                </Button>
                <Button variant="ghost" size="xs" className="h-7 text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Rapor Al
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={earningsData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                En Çok Tercih Edilen Hizmetler (mock)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                {
                  name: "Kariyer Yolu ve Hedef Belirleme",
                  count: 46,
                  revenue: 43700,
                },
                {
                  name: "Mülakat Provası & CV Revizyonu",
                  count: 32,
                  revenue: 38400,
                },
                {
                  name: "4 Haftalık Kariyer Reset",
                  count: 15,
                  revenue: 54000,
                },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-100">{item.name}</p>
                    <p className="text-slate-400">{item.count} seans</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400">
                      {item.revenue.toLocaleString("tr-TR")} TL
                    </span>
                    <span className="text-slate-500">
                      Ortalama seans: ~
                      {Math.round(item.revenue / item.count)} TL
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* SEANSLAR BÖLÜMÜ – GERÇEK SUPABASE VERİSİ */}
        <Card className="bg-slate-900/80 border-white/10">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              Seans Yönetimi (Supabase)
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={sessionFilter === "all" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={() => setSessionFilter("all")}
              >
                Tümü
              </Button>
              <Button
                variant={sessionFilter === "today" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={() => setSessionFilter("today")}
              >
                Bugün
              </Button>
              <Button
                variant={sessionFilter === "week" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={() => setSessionFilter("week")}
              >
                Bu Hafta
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs border-white/20"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Yenile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="bg-slate-950 border border-white/10">
                <TabsTrigger value="upcoming">Gelecek / Bekleyen</TabsTrigger>
                <TabsTrigger value="past">Geçmiş Onaylı</TabsTrigger>
              </TabsList>

              {/* Gelecek Seanslar / Bekleyenler */}
              <TabsContent value="upcoming" className="mt-4 space-y-3">
                {upcomingRequests.length === 0 && (
                  <p className="text-xs text-slate-400">
                    Henüz bu filtreye uygun seans talebi yok.
                  </p>
                )}

                {upcomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">
                        <User className="w-4 h-4 text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {req.full_name || "Danışan"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {req.note || "Hedef: (yakında not alanı eklenecek)"}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{formatDate(req.selected_date)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          <Clock className="w-3 h-3" />
                          {req.selected_time}
                        </p>
                        {req.email && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {req.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
                      {renderStatusBadge(req.status)}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10"
                          onClick={() => updateStatus(req.id, "approved")}
                          disabled={
                            updatingId === req.id || req.status === "approved"
                          }
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Onayla
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] border-red-500/60 text-red-300 hover:bg-red-500/10"
                          onClick={() => updateStatus(req.id, "rejected")}
                          disabled={
                            updatingId === req.id || req.status === "rejected"
                          }
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reddet
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Geçmiş Onaylı Seanslar */}
              <TabsContent value="past" className="mt-4 space-y-3">
                {pastRequests.length === 0 && (
                  <p className="text-xs text-slate-400">
                    Henüz geçmiş onaylı seans bulunmuyor.
                  </p>
                )}

                {pastRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {req.full_name || "Danışan"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {req.note || "Seans tamamlandı."}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{formatDate(req.selected_date)}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <Clock className="w-3 h-3" />
                        {req.selected_time}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      {renderStatusBadge(req.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[11px] border-white/20"
                      >
                        AI Seans Özeti (yakında)
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ALT BLOK: Müşteri & Mesaj – şimdilik mock, sonra bağlarız */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="bg-slate-900/80 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Son Müşteriler (örnek)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {["Mert Y.", "Zeynep A.", "Ali K."].map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-[11px] text-slate-400">
                      Son seans: {idx === 0 ? "Dün" : `${idx + 2} gün önce`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] border-white/20"
                    >
                      Profil
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] text-slate-300"
                    >
                      Notlar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Son Mesajlar (örnek)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                {
                  from: "Yeni Müşteri",
                  text: "İlk seans öncesi neler hazırlamalıyım?",
                },
                {
                  from: "Mevcut Müşteri",
                  text: "Bu haftaki seansı erteleyebilir miyiz?",
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{m.from}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {m.text}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] border-white/20"
                  >
                    Yanıtla
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
