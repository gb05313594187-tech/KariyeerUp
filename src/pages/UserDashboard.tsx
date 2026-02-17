// src/pages/UserDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  CreditCard,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LogIn,
  Clock,
  CheckCircle2,
  Star,
  FileText,
  Crown,
  Zap,
} from "lucide-react";

const SESSION_TABLE = "app_2dff6511da_session_requests";
const PAYMENTS_TABLE = "app_2dff6511da_payments";
const PAYMENT_TX_TABLE = "app_2dff6511da_payment_transactions";
const INVOICES_TABLE = "app_2dff6511da_invoices";
const COACHES_TABLE = "app_2dff6511da_coaches";
const PREMIUM_TABLE = "app_2dff6511da_premium_subscriptions";

const formatDate = (d: string) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch { return d; }
};

const formatCurrency = (amount: number | null) => {
  if (!amount) return "—";
  const val = amount > 1000 ? amount / 100 : amount;
  return val.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: { label: "Beklemede", cls: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200" },
  approved: { label: "Onaylandı", cls: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Reddedildi", cls: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200" },
  completed: { label: "Tamamlandı", cls: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200" },
};

const payStatusConfig: Record<string, { label: string; cls: string }> = {
  pending: { label: "Ödeme Bekleniyor", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  initiated: { label: "Başlatıldı", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  success: { label: "Ödendi", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Ödendi", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "Başarısız", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentTx, setPaymentTx] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user || null;
        if (!mounted) return;
        setAuthUser(user);
        if (!user) return;

        try { const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(); if (p) setProfile(p); } catch {}
        try { const { data: s } = await supabase.from(SESSION_TABLE).select("*").eq("user_id", user.id).order("created_at", { ascending: false }); if (s) setSessions(s); } catch {}
        try { const { data: p } = await supabase.from(PAYMENTS_TABLE).select("*").eq("user_id", user.id).order("created_at", { ascending: false }); if (p) setPayments(p); } catch {}
        try { const { data: t } = await supabase.from(PAYMENT_TX_TABLE).select("*").eq("user_id", user.id).order("created_at", { ascending: false }); if (t) setPaymentTx(t); } catch {}
        try { const { data: i } = await supabase.from(INVOICES_TABLE).select("*").eq("user_id", user.id).order("created_at", { ascending: false }); if (i) setInvoices(i); } catch {}
        try { const { data: sub } = await supabase.from(PREMIUM_TABLE).select("*").eq("user_id", user.id).eq("status", "active").maybeSingle(); if (sub) setSubscription(sub); } catch {}
        try { const { data: c } = await supabase.from(COACHES_TABLE).select("id, full_name, avatar_url, title, rating"); if (c) setCoaches(c); } catch {}
      } catch (err) { console.error(err); }
      finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const getCoachName = (id: string) => coaches.find((c) => c.id === id)?.full_name || "Koç";

  const displayName = profile?.display_name || profile?.full_name || authUser?.user_metadata?.display_name || authUser?.user_metadata?.full_name || authUser?.email?.split("@")?.[0] || "Kullanıcı";

  const completion = useMemo(() => {
    if (!authUser) return 0;
    const checks = [
      !!(profile?.display_name || profile?.full_name || authUser?.user_metadata?.full_name),
      !!(profile?.phone), !!(profile?.city), !!(profile?.title), !!(profile?.sector),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, authUser]);

  const now = new Date();
  const upcomingSessions = sessions.filter((s) => new Date(s.selected_date) >= now && (s.status === "pending" || s.status === "approved"));
  const pastSessions = sessions.filter((s) => new Date(s.selected_date) < now || s.status === "completed");
  const approvedCount = sessions.filter((s) => s.status === "approved").length;
  const pendingCount = sessions.filter((s) => s.status === "pending").length;

  const totalSpent = payments
    .filter((p) => p.payment_status === "success" || p.status === "success")
    .reduce((sum, p) => sum + (p.amount > 1000 ? p.amount / 100 : p.amount), 0);

  const nextStep = useMemo(() => {
    if (!authUser) return { title: "Giriş yap ve kaldığın yerden devam et", desc: "Dashboard kişiselleştirme ve seans akışı için giriş gerekli.", ctaText: "Giriş Yap", ctaHref: "/login", icon: LogIn };
    if (completion < 60) return { title: "Profilini tamamla", desc: `Profil %${completion} tamamlandı. Daha iyi koç eşleşmesi için bilgilerini güncelle.`, ctaText: "Profilimi Düzenle", ctaHref: "/user/profile", icon: BadgeCheck };
    if (sessions.length === 0) return { title: "İlk seansını planla", desc: "Koçları incele, sana uygun olanı seç.", ctaText: "Koçları İncele", ctaHref: "/coaches", icon: Calendar };
    if (upcomingSessions.length > 0) return { title: `${upcomingSessions.length} yaklaşan seansın var`, desc: `Sonraki: ${formatDate(upcomingSessions[0]?.selected_date)} - ${upcomingSessions[0]?.selected_time}`, ctaText: "Seanslarımı Gör", ctaHref: "/book-session", icon: Calendar };
    return { title: "Yeni seans planla", desc: "Gelişim planını güncelle.", ctaText: "Koçları İncele", ctaHref: "/coaches", icon: Sparkles };
  }, [authUser, completion, sessions, upcomingSessions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-8 bg-white/10 rounded-xl w-48 animate-pulse" />
            <div className="h-12 bg-white/10 rounded-xl w-72 mt-3 animate-pulse" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (<div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO — dark theme matching Index featured section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600/20 to-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm mb-3">
                <User className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-300">User Panel</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Hoş geldin, <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{displayName}</span>
              </h1>
              <p className="mt-2 text-gray-400 max-w-2xl">Seanslarını, ödemelerini ve profilini buradan yönet.</p>
            </div>
            {subscription && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-300">{subscription.subscription_type || "Premium"} Üye</span>
              </div>
            )}
          </div>

          {/* Completion bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Profil tamamlanma</span>
              <span className="font-bold text-orange-400">%{completion}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all rounded-full" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Toplam Seans", value: sessions.length },
              { label: "Onaylanan", value: approvedCount },
              { label: "Bekleyen", value: pendingCount },
              ...(totalSpent > 0 ? [{ label: "Harcanan", value: formatCurrency(totalSpent) }] : []),
            ].map((s) => (
              <div key={s.label} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-gray-300">
                <span className="text-gray-500">{s.label}: </span>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Next step card */}
        <div className="mb-8 -mt-6 relative z-20">
          <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <nextStep.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Bir sonraki adım</p>
                  <p className="mt-1 text-lg font-black text-gray-900">{nextStep.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{nextStep.desc}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to={nextStep.ctaHref}>
                  <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:brightness-110 shadow-lg shadow-red-200/50">
                    {nextStep.ctaText} <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                {authUser && (
                  <Link to="/user/settings">
                    <Button variant="outline" className="rounded-xl border-orange-200 hover:bg-orange-50">Ayarlar</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ana Kartlar */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* HESAP */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                Hesap
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              {!authUser ? (
                <div className="space-y-3">
                  <p className="text-gray-600">Bu alanı görmek için giriş yapmalısın.</p>
                  <Link to="/login"><Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white">Giriş Yap</Button></Link>
                </div>
              ) : (
                <>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{authUser.email}</span></div>
                  <div><span className="text-gray-500">Rol:</span> <span className="font-medium capitalize">{profile?.role || "user"}</span></div>
                  {subscription && (
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span className="font-semibold text-amber-700">{subscription.subscription_type} Premium</span>
                    </div>
                  )}
                  <div className="pt-2 flex gap-2 flex-wrap">
                    <Link to="/user/profile"><Button size="sm" className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white">Profile Git</Button></Link>
                    <Link to="/user/settings"><Button size="sm" variant="outline" className="rounded-xl border-orange-200">Ayarlar</Button></Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* SEANSLAR */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                Seanslar
                {sessions.length > 0 && (
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 text-orange-700 font-bold">{sessions.length}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              {!authUser ? (
                <p className="text-gray-600">Giriş yapınca seanslarını burada görürsün.</p>
              ) : sessions.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-gray-600">Henüz seansın yok. Koçları inceleyip ilk seansını planla.</p>
                  <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white" onClick={() => navigate("/coaches")}>
                    Koçları İncele <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Yaklaşan ({upcomingSessions.length})</p>
                      {upcomingSessions.slice(0, 3).map((s) => (
                        <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                              <Calendar className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{getCoachName(s.coach_id)}</p>
                              <p className="text-xs text-gray-500">{formatDate(s.selected_date)} • {s.selected_time}</p>
                            </div>
                          </div>
                          <Badge className={`text-[10px] border ${statusConfig[s.status]?.cls || statusConfig.pending.cls}`}>
                            {statusConfig[s.status]?.label || s.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {pastSessions.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Geçmiş ({pastSessions.length})</p>
                      {pastSessions.slice(0, 2).map((s) => (
                        <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 opacity-75">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">{getCoachName(s.coach_id)}</p>
                              <p className="text-xs text-gray-400">{formatDate(s.selected_date)}</p>
                            </div>
                          </div>
                          <Badge className={`text-[10px] border ${statusConfig[s.status]?.cls || statusConfig.pending.cls}`}>
                            {statusConfig[s.status]?.label || s.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="rounded-xl w-full border-orange-200 hover:bg-orange-50 text-orange-700 font-semibold" onClick={() => navigate("/book-session")}>
                    Tüm Seansları Gör
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ÖDEMELER */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                Ödemeler
                {(payments.length > 0 || paymentTx.length > 0) && (
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 text-orange-700 font-bold">{payments.length + paymentTx.length}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              {!authUser ? (
                <p className="text-gray-600">Giriş yapınca ödeme geçmişini burada görürsün.</p>
              ) : payments.length === 0 && paymentTx.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-gray-600">Henüz ödeme kaydın yok. Seans oluşturduğunda burada görünecek.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    PayTR ile güvenli ödeme altyapısı aktif.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {(payments.length > 0 ? payments : paymentTx).slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(p.payment_date || p.created_at)}{p.provider && ` • ${p.provider.toUpperCase()}`}</p>
                      </div>
                      <Badge className={`text-[10px] border ${payStatusConfig[p.payment_status || p.status]?.cls || payStatusConfig.pending.cls}`}>
                        {payStatusConfig[p.payment_status || p.status]?.label || p.payment_status || p.status}
                      </Badge>
                    </div>
                  ))}
                  {totalSpent > 0 && (
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Toplam harcama</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(totalSpent)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />PayTR ile güvenli ödeme
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FATURALAR */}
        {authUser && invoices.length > 0 && (
          <div className="mt-6">
            <Card className="rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Faturalar
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 text-orange-700 font-bold">{invoices.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                        <th className="pb-3 pr-4">Fatura No</th><th className="pb-3 pr-4">Tarih</th><th className="pb-3 pr-4">Tutar</th><th className="pb-3 pr-4">KDV</th><th className="pb-3 pr-4">Toplam</th><th className="pb-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-gray-100 last:border-0 hover:bg-orange-50/30 transition">
                          <td className="py-3 pr-4 font-semibold">{inv.invoice_number}</td>
                          <td className="py-3 pr-4">{formatDate(inv.invoice_date)}</td>
                          <td className="py-3 pr-4">{formatCurrency(inv.amount)}</td>
                          <td className="py-3 pr-4">{formatCurrency(inv.tax_amount)}</td>
                          <td className="py-3 pr-4 font-bold">{formatCurrency(inv.total_amount)}</td>
                          <td className="py-3">
                            <Badge className={`text-[10px] border ${inv.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                              {inv.status === "paid" ? "Ödendi" : inv.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PREMIUM */}
        <div className="mt-6">
          <div className={`rounded-2xl overflow-hidden ${subscription ? "border border-amber-200" : "border border-gray-200"}`}>
            {subscription ? (
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">{subscription.subscription_type} Premium Aktif</p>
                    <p className="text-sm text-gray-600">
                      Bitiş: {formatDate(subscription.end_date)} • {formatCurrency(subscription.price)}
                      {subscription.auto_renew && " • Otomatik yenileme açık"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-600/20 to-transparent rounded-full blur-2xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">Premium'a Geç</p>
                      <p className="text-sm text-gray-400">Öncelikli eşleşme, sınırsız mesaj ve özel içerikler.</p>
                    </div>
                  </div>
                  <Link to="/premium">
                    <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:brightness-110 shadow-lg shadow-red-900/30">
                      <Crown className="h-4 w-4 mr-2" /> Premium Planları Gör
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alt Öneri */}
        <div className="mt-6">
          <div className="rounded-2xl border border-orange-200 bg-white shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Doğru koçu daha hızlı bul</p>
                  <p className="mt-1 text-sm text-gray-600">Hedefini netleştir → filtrele → kısa liste yap → ilk görüşme planla.</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to="/how-it-works"><Button variant="outline" className="rounded-xl border-orange-200 hover:bg-orange-50">Nasıl Çalışır?</Button></Link>
                <Link to="/coaches"><Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white hover:brightness-110">Koçları İncele <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
