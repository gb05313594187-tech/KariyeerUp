// src/pages/CoachDashboard.tsx
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
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
  MessageCircle,
  Video,
  Download,
  Check,
  XCircle,
  Mail,
  RefreshCw,
  FileText,
  CreditCard,
  AlertCircle,
  Crown,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const SESSION_TABLE = "app_2dff6511da_session_requests";
const COACHES_TABLE = "app_2dff6511da_coaches";
const PAYMENTS_TABLE = "app_2dff6511da_payments";
const INVOICES_TABLE = "app_2dff6511da_invoices";

// Tarihi TR formatına çevir
const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
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

const formatCurrency = (amount: number | null) => {
  if (!amount) return "—";
  const val = amount > 1000 ? amount / 100 : amount;
  return val.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
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
  return diffDays >= -1 && diffDays <= 7;
};

// Status badge görünümü
const renderStatusBadge = (status: string) => {
  const s = status || "pending";
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Beklemede", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    approved: { label: "Onaylandı", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { label: "Reddedildi", cls: "bg-red-50 text-red-700 border-red-200" },
    completed: { label: "Tamamlandı", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  };
  const cfg = map[s] || map.pending;
  return <Badge className={`${cfg.cls} border text-[11px]`}>{cfg.label}</Badge>;
};

export default function CoachDashboard() {
  const [sessionFilter, setSessionFilter] = useState<"all" | "today" | "week">("all");
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState<any | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1) Giriş yapan kullanıcı → koç kaydı → o koça gelen seans talepleri + ödemeler + faturalar
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
          setPayments([]);
          setInvoices([]);
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
          setPayments([]);
          setInvoices([]);
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

        // Bu koça ait ödemeler
        try {
          const { data: payData } = await supabase
            .from(PAYMENTS_TABLE)
            .select("*")
            .eq("coach_id", coachRow.id)
            .order("created_at", { ascending: false });
          setPayments(payData || []);
        } catch {
          setPayments([]);
        }

        // Faturalar
        try {
          const { data: invData } = await supabase
            .from(INVOICES_TABLE)
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
          setInvoices(invData || []);
        } catch {
          setInvoices([]);
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
      const updateData: any = { status: nextStatus };
      if (nextStatus === "approved") updateData.approved_at = new Date().toISOString();
      if (nextStatus === "rejected") updateData.rejected_at = new Date().toISOString();

      const { error } = await supabase
        .from(SESSION_TABLE)
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Update status error:", error);
        toast.error("Durum güncellenemedi.");
        return;
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updateData } : r))
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

  // İstatistikler
  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const total = requests.length;

    const totalEarnings = payments
      .filter((p) => (p.payment_status || p.status) === "success")
      .reduce((sum, p) => {
        const amt = p.amount > 1000 ? p.amount / 100 : p.amount;
        return sum + amt;
      }, 0);

    const pendingEarnings = payments
      .filter((p) => (p.payment_status || p.status) === "pending" || (p.payment_status || p.status) === "initiated")
      .reduce((sum, p) => {
        const amt = p.amount > 1000 ? p.amount / 100 : p.amount;
        return sum + amt;
      }, 0);

    return { pending, approved, completed, total, totalEarnings, pendingEarnings };
  }, [requests, payments]);

  // Filtrelenmiş istekler (Tümü / Bugün / Bu Hafta)
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const dStr = req.selected_date || req.session_date;
      if (sessionFilter === "today") return isToday(dStr);
      if (sessionFilter === "week") return isThisWeek(dStr);
      return true;
    });
  }, [requests, sessionFilter]);

  // Gelecek / Geçmiş ayrımı
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
    return d < today && req.status !== "pending";
  });

  // Benzersiz danışanlar (gerçek veriden)
  const uniqueClients = useMemo(() => {
    const map = new Map();
    requests.forEach((r) => {
      const key = r.user_id || r.email;
      if (key && !map.has(key)) {
        map.set(key, {
          name: r.full_name || r.email || "Anonim",
          email: r.email,
          lastDate: r.selected_date,
          totalSessions: requests.filter((x) => (x.user_id || x.email) === key).length,
        });
      }
    });
    return Array.from(map.values());
  }, [requests]);

  const coachInitials = coach?.full_name
    ? coach.full_name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase()
    : "KO";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Koç paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-orange-200 bg-white shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-lg font-black text-gray-900">Koç Profili Bulunamadı</h2>
          <p className="text-sm text-gray-600 mt-2">
            Lütfen önce koç başvurusu yapın veya profilinizi tamamlayın.
          </p>
          <Button
            className="mt-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:brightness-110"
            onClick={() => (window.location.href = "/coach-application")}
          >
            Koç Olarak Başvur <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* HERO — dark theme matching Index featured section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600/20 to-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {/* Profil foto + fallback */}
            {coach.avatar_url ? (
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-lg bg-white/10">
                <img
                  src={coach.avatar_url}
                  alt={coach.full_name || "Koç"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-xl font-black text-white shadow-lg">
                {coachInitials}
              </div>
            )}

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm mb-1">
                <Sparkles className="h-3 w-3 text-orange-400" />
                <span className="text-xs font-bold text-orange-300">Koç Kontrol Paneli</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white">
                Hoş geldin,{" "}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  {coach.full_name || "Koç"}
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                {stats.pending} bekleyen talep • {stats.approved} onaylı seans • {stats.total} toplam
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 rounded-xl"
            >
              <Video className="w-3 h-3 mr-2" />
              Tanıtım Videosu Ekle
            </Button>
            <Button
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-semibold"
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
        <div className="grid md:grid-cols-4 gap-4 -mt-6 relative z-20">
          {[
            {
              label: "Bekleyen Talepler",
              value: stats.pending,
              sub: "Onay bekliyor",
              gradient: "from-amber-500 to-orange-500",
              icon: Clock,
            },
            {
              label: "Onaylı Seanslar",
              value: stats.approved,
              sub: stats.completed > 0 ? `${stats.completed} tamamlandı` : "Aktif seanslar",
              gradient: "from-emerald-500 to-teal-500",
              icon: Check,
            },
            {
              label: "Toplam Kazanç",
              value: stats.totalEarnings > 0 ? formatCurrency(stats.totalEarnings) : "—",
              sub: stats.pendingEarnings > 0 ? `${formatCurrency(stats.pendingEarnings)} beklemede` : "Ödeme bekleniyor",
              gradient: "from-red-500 to-orange-500",
              icon: Wallet,
            },
            {
              label: "Ortalama Puan",
              value: coach.rating ? Number(coach.rating).toFixed(1) : "—",
              sub: `${coach.total_reviews || 0} değerlendirme`,
              gradient: "from-yellow-500 to-amber-500",
              icon: Star,
            },
          ].map((kpi, i) => (
            <Card key={i} className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="py-5 px-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-md mb-3`}>
                  <kpi.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{kpi.label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{kpi.value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* KAZANÇ & FATURALAR */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Kazanç Özeti */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                Kazanç Özeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-3">
                    <Wallet className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Henüz ödeme kaydı yok.</p>
                  <p className="text-xs text-gray-400 mt-1">Seanslar tamamlandıkça burada görünecek.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                      <p className="text-xs text-emerald-600 font-semibold">Toplam Kazanç</p>
                      <p className="text-xl font-black text-emerald-700">{formatCurrency(stats.totalEarnings)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                      <p className="text-xs text-amber-600 font-semibold">Bekleyen</p>
                      <p className="text-xl font-black text-amber-700">{formatCurrency(stats.pendingEarnings)}</p>
                    </div>
                  </div>
                  {payments.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(p.payment_date || p.created_at)}</p>
                      </div>
                      <Badge
                        className={`text-[10px] border ${
                          (p.payment_status || p.status) === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {(p.payment_status || p.status) === "success" ? "Ödendi" : "Beklemede"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Faturalar */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Faturalar
                {invoices.length > 0 && (
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 text-orange-700 font-bold">
                    {invoices.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Henüz fatura yok.</p>
                  <p className="text-xs text-gray-400 mt-1">Ödemeler tamamlandıkça otomatik oluşturulur.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold">{inv.invoice_number}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(inv.invoice_date)} • {formatCurrency(inv.total_amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[10px] border ${
                            inv.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {inv.status === "paid" ? "Ödendi" : inv.status}
                        </Badge>
                        {inv.invoice_sent && (
                          <Mail className="w-3 h-3 text-gray-400" title="E-posta gönderildi" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SEANSLAR BÖLÜMÜ – GERÇEK SUPABASE VERİSİ */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-white" />
              </div>
              Seans Yönetimi
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              {(["all", "today", "week"] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  className={`h-8 rounded-full text-xs font-semibold ${
                    sessionFilter === f
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow"
                      : "bg-white border border-orange-200 text-gray-700 hover:bg-orange-50"
                  }`}
                  onClick={() => setSessionFilter(f)}
                >
                  {f === "all" ? "Tümü" : f === "today" ? "Bugün" : "Bu Hafta"}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs border-gray-200 text-gray-800"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Yenile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="bg-white border border-gray-200 rounded-xl p-1">
                <TabsTrigger
                  value="upcoming"
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  Gelecek / Bekleyen ({upcomingRequests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  Geçmiş ({pastRequests.length})
                </TabsTrigger>
              </TabsList>

              {/* Gelecek Seanslar / Bekleyenler */}
              <TabsContent value="upcoming" className="mt-4 space-y-3">
                {upcomingRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto mb-3">
                      <CalendarDays className="h-8 w-8 text-red-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Bu filtreye uygun seans talebi yok.
                    </p>
                  </div>
                )}

                {upcomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 hover:border-orange-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center border border-orange-200">
                        <User className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {req.full_name || "Danışan"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {req.note || ""}
                        </p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-2">
                          <CalendarDays className="w-3 h-3" />
                          <span>{formatDate(req.selected_date)}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <Clock className="w-3 h-3" />
                          {req.selected_time}
                          {req.payment_amount && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <CreditCard className="w-3 h-3" />
                              {formatCurrency(req.payment_amount)}
                            </>
                          )}
                        </p>
                        {req.email && (
                          <p className="text-[11px] text-gray-600 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {req.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
                      {renderStatusBadge(req.status)}
                      {req.payment_status && (
                        <Badge
                          className={`text-[10px] border ${
                            req.payment_status === "success"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {req.payment_status === "success" ? "Ödendi" : "Ödeme bekleniyor"}
                        </Badge>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          onClick={() => updateStatus(req.id, "approved")}
                          disabled={updatingId === req.id || req.status === "approved"}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Onayla
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
                          onClick={() => updateStatus(req.id, "rejected")}
                          disabled={updatingId === req.id || req.status === "rejected"}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reddet
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Geçmiş Seanslar */}
              <TabsContent value="past" className="mt-4 space-y-3">
                {pastRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Geçmiş seans bulunmuyor.
                    </p>
                  </div>
                )}

                {pastRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 opacity-80"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {req.full_name || "Danışan"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {req.note || "Seans tamamlandı."}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-2">
                        <span>{formatDate(req.selected_date)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <Clock className="w-3 h-3" />
                        {req.selected_time}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      {renderStatusBadge(req.status)}
                      {req.payment_amount && (
                        <span className="text-xs text-gray-600">{formatCurrency(req.payment_amount)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* DANIŞANLAR — Gerçek veriden */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              Danışanlarım
              {uniqueClients.length > 0 && (
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 text-orange-700 font-bold">
                  {uniqueClients.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uniqueClients.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-3">
                  <User className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Henüz danışan bulunmuyor.</p>
                <p className="text-xs text-gray-400 mt-1">Seans talepleri geldikçe burada listelenecek.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {uniqueClients.slice(0, 10).map((client, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-gray-100 hover:border-orange-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-xs font-black text-red-600 border border-orange-200">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                        <p className="text-[11px] text-gray-500">
                          {client.totalSessions} seans • Son: {formatDate(client.lastDate)}
                        </p>
                      </div>
                    </div>
                    {client.email && (
                      <p className="text-[11px] text-gray-400 hidden md:block">{client.email}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
