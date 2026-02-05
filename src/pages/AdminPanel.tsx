// src/pages/AdminPanel.tsx
// @ts-nocheck
/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Activity,
  RefreshCw,
  Calendar,
  CheckCircle,
  XCircle,
  ShieldAlert,
  LayoutDashboard,
  ClipboardList,
  BrainCircuit,
  TrendingUp,
  ChevronRight
} from "lucide-react";

import AdminDashboard from "@/pages/AdminDashboard";
import AdvancedAnalytics from "@/pages/AdvancedAnalytics"; // Yeni eklenen sekme

type BookingRow = {
  id: string;
  client_name?: string | null;
  client_email?: string | null;
  created_at?: string | null;
  session_time?: string | null;
  status?: "pending" | "approved" | "rejected" | string | null;
  is_trial?: boolean | null;
  amount?: number | null;
  currency?: string | null;
};

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard" | "bookings" | "ai_intelligence">("dashboard");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsNote, setBookingsNote] = useState<string | null>(null);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsNote(null);
    const { data, error } = await supabase
      .from("bookings")
      .select("id, client_name, client_email, created_at, session_time, status, is_trial, amount, currency")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setBookings([]);
      setBookingsNote(error.message);
      setBookingsLoading(false);
      return;
    }
    setBookings((data || []) as BookingRow[]);
    setBookingsLoading(false);
  };

  useEffect(() => {
    if (tab === "bookings") fetchBookings();
  }, [tab]);

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => (b.status || "").toLowerCase() === "pending").length;
    const approved = bookings.filter((b) => (b.status || "").toLowerCase() === "approved").length;
    const revenueTry = bookings.reduce((sum, b) => {
      const st = (b.status || "").toLowerCase();
      if (st !== "approved") return sum;
      const amount = typeof b.amount === "number" ? b.amount : b.is_trial ? 0 : 1500;
      return sum + amount;
    }, 0);
    return { total, pending, approved, revenueTry };
  }, [bookings]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("İşlem Başarılı");
    fetchBookings();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "rejected" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.error("Talep Reddedildi");
    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] font-sans text-slate-900">
      {/* Premium Üst Bar */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl shadow-lg shadow-orange-100">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tighter italic uppercase">
                Unicorn <span className="text-orange-600">Admin</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                Control Center & Intelligence
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {[
              { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
              { id: "bookings", label: "Operasyon", icon: ClipboardList },
              { id: "ai_intelligence", label: "AI Intelligence", icon: TrendingUp },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t.id 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <t.icon className={`h-4 w-4 ${tab === t.id ? "text-orange-600" : ""}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {tab === "dashboard" && <AdminDashboard />}
        
        {tab === "ai_intelligence" && <AdvancedAnalytics />}

        {tab === "bookings" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-4">
              <Kpi title="Toplam Talep" value={bookingStats.total} icon={<Calendar className="text-blue-600" />} />
              <Kpi title="Bekleyen" value={bookingStats.pending} icon={<ShieldAlert className="text-orange-600" />} />
              <Kpi title="Onaylanan" value={bookingStats.approved} icon={<CheckCircle className="text-emerald-600" />} />
              <Kpi title="Tahmini Gelir" value={formatMoneyTRY(bookingStats.revenueTry)} icon={<Activity className="text-red-600" />} highlight />
            </div>

            {/* Bookings Table */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black italic uppercase tracking-tight text-slate-800">Gelen Rezervasyonlar</CardTitle>
                  <p className="text-sm text-slate-400 font-medium">Müşteri randevularını ve ödeme durumlarını yönetin</p>
                </div>
                <Button onClick={fetchBookings} variant="outline" className="rounded-xl border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all">
                  <RefreshCw className="h-4 w-4 mr-2" /> Yenile
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                {bookingsLoading ? (
                  <div className="p-20 text-center flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="font-bold text-slate-400 tracking-widest text-xs uppercase">Veriler Yükleniyor</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">Kayıt Bulunmamaktadır.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b">
                          <th className="p-6">Müşteri Detayı</th>
                          <th className="p-6">Oturum Tarihi</th>
                          <th className="p-6 text-center">Durum</th>
                          <th className="p-6">Tutar</th>
                          <th className="p-6 text-right">Aksiyon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-6">
                              <div className="font-black text-slate-800 group-hover:text-orange-600 transition-colors">{b.client_name || "İsimsiz"}</div>
                              <div className="text-xs text-slate-400 font-bold">{b.client_email || "E-posta Yok"}</div>
                            </td>
                            <td className="p-6">
                              <div className="font-bold text-slate-700">
                                {b.created_at ? new Date(b.created_at).toLocaleDateString("tr-TR") : "-"}
                              </div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{b.session_time || ""}</div>
                            </td>
                            <td className="p-6 text-center">
                              <Badge className={`${badgeClass(b.status)} rounded-lg px-3 py-1 font-black text-[10px] shadow-none`}>
                                {labelStatus(b.status)}
                              </Badge>
                            </td>
                            <td className="p-6">
                              <div className="font-black text-slate-800 tracking-tighter italic text-lg">{formatAmount(b)}</div>
                            </td>
                            <td className="p-6 text-right">
                              {(b.status || "").toLowerCase() === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleApprove(b.id)}
                                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(b.id)}
                                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-slate-300 flex justify-end">
                                   <ChevronRight className="w-5 h-5" />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {bookingsNote && (
              <div className="rounded-[1.5rem] border border-orange-200 bg-orange-50 p-6">
                <div className="font-black text-orange-800 uppercase text-xs tracking-widest flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Sistem Uyarısı
                </div>
                <div className="text-sm text-orange-900/70 mt-2 font-medium">{bookingsNote}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ title, value, icon, highlight = false }: { title: string; value: any; icon: JSX.Element; highlight?: boolean }) {
  return (
    <Card className={`border-none shadow-lg shadow-slate-200/40 rounded-[2rem] overflow-hidden ${highlight ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 'bg-white'}`}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className={`text-[10px] uppercase tracking-[0.2em] font-black ${highlight ? 'text-orange-400' : 'text-slate-400'}`}>{title}</div>
            <div className="text-3xl font-black italic tracking-tighter">{value}</div>
          </div>
          <div className={`p-4 rounded-2xl ${highlight ? 'bg-white/10' : 'bg-slate-50'}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function badgeClass(status?: string | null) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
  return "bg-orange-100 text-orange-700 border-orange-200";
}

function labelStatus(status?: string | null) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "ONAYLANDI";
  if (s === "rejected") return "REDDEDİLDİ";
  return "BEKLİYOR";
}

function formatMoneyTRY(n: number) {
  return n.toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 });
}

function formatAmount(b: any) {
  const hasAmount = typeof b.amount === "number";
  const currency = (b.currency || "TRY").toString().toUpperCase();
  if (hasAmount) {
    return currency === "TRY" ? formatMoneyTRY(b.amount) : `${b.amount} ${currency}`;
  }
  return b.is_trial ? "ÜCRETSİZ" : "1.500 ₺";
}
