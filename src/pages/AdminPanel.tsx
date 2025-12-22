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
} from "lucide-react";

import AdminDashboard from "@/pages/AdminDashboard";

type BookingRow = {
  id: string;
  client_name?: string | null;
  client_email?: string | null;
  created_at?: string | null;
  session_time?: string | null;
  status?: "pending" | "approved" | "rejected" | string | null;
  is_trial?: boolean | null;
  amount?: number | null; // varsa
  currency?: string | null; // varsa
};

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard" | "bookings">("dashboard");

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
      // tablo yoksa / RLS engellediyse / yetki yoksa kırma
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => (b.status || "").toLowerCase() === "pending").length;
    const approved = bookings.filter((b) => (b.status || "").toLowerCase() === "approved").length;

    // gelir: amount varsa onu kullan, yoksa trial=0 değilse 1500 varsay
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
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Onaylandı");
    fetchBookings();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "rejected" }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.error("Reddedildi");
    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Üst bar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border bg-gray-50 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">CEO / Admin Panel</div>
              <div className="text-sm text-gray-500">
                Dashboard + Operasyon (bookings) tek yerde
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={tab === "dashboard" ? "default" : "outline"}
              onClick={() => setTab("dashboard")}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={tab === "bookings" ? "default" : "outline"}
              onClick={() => setTab("bookings")}
              className="gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              Bookings
            </Button>

            {tab === "bookings" && (
              <Button onClick={fetchBookings} className="gap-2" variant="outline">
                <RefreshCw className="h-4 w-4" />
                Yenile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {tab === "dashboard" ? (
          <AdminDashboard />
        ) : (
          <div className="space-y-4">
            {/* Bookings KPI */}
            <div className="grid gap-4 md:grid-cols-4">
              <Kpi title="Toplam Booking" value={bookingStats.total} icon={<Calendar className="h-5 w-5" />} />
              <Kpi title="Bekleyen" value={bookingStats.pending} icon={<ShieldAlert className="h-5 w-5" />} />
              <Kpi title="Onaylanan" value={bookingStats.approved} icon={<CheckCircle className="h-5 w-5" />} />
              <Kpi title="Gelir (TRY)" value={formatMoneyTRY(bookingStats.revenueTry)} icon={<Activity className="h-5 w-5" />} />
            </div>

            {/* Not / hata */}
            {bookingsNote && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <div className="font-semibold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Bookings okunamadı
                </div>
                <div className="text-sm mt-1">{bookingsNote}</div>
                <div className="text-sm mt-2">
                  Bu genelde 2 sebepten olur: <b>bookings tablosu yok</b> veya <b>RLS admin’i engelliyor</b>.
                </div>
              </div>
            )}

            {/* Liste */}
            <Card className="border rounded-2xl">
              <CardHeader className="border-b bg-gray-50 rounded-t-2xl">
                <CardTitle>Gelen Bookings</CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {bookingsLoading ? (
                  <div className="p-6 text-sm text-gray-500">Yükleniyor…</div>
                ) : bookings.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">Kayıt yok.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white text-gray-500 border-b">
                        <tr>
                          <th className="p-4">Müşteri</th>
                          <th className="p-4">Tarih</th>
                          <th className="p-4">Durum</th>
                          <th className="p-4">Tutar</th>
                          <th className="p-4 text-right">İşlem</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y bg-white">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div className="font-semibold">{b.client_name || "-"}</div>
                              <div className="text-gray-500">{b.client_email || "-"}</div>
                            </td>

                            <td className="p-4">
                              <div className="font-medium">
                                {b.created_at ? new Date(b.created_at).toLocaleDateString("tr-TR") : "-"}
                              </div>
                              <div className="text-gray-400 text-xs">{b.session_time || ""}</div>
                            </td>

                            <td className="p-4">
                              <Badge className={badgeClass(b.status)}>
                                {labelStatus(b.status)}
                              </Badge>
                            </td>

                            <td className="p-4 font-semibold">
                              {formatAmount(b)}
                            </td>

                            <td className="p-4 text-right">
                              {(b.status || "").toLowerCase() === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(b.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Onayla
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(b.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reddet
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
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
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ title, value, icon }: { title: string; value: any; icon: JSX.Element }) {
  return (
    <Card className="border rounded-2xl">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{title}</div>
            <div className="text-3xl font-extrabold mt-1">{value}</div>
          </div>
          <div className="h-10 w-10 rounded-xl border bg-gray-50 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function badgeClass(status?: string | null) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-green-600";
  if (s === "rejected") return "bg-red-600";
  return "bg-yellow-500";
}

function labelStatus(status?: string | null) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "ONAYLANDI";
  if (s === "rejected") return "REDDEDİLDİ";
  return "BEKLİYOR";
}

function formatMoneyTRY(n: number) {
  const val = Number(n || 0);
  try {
    return val.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
  } catch {
    return `${val} TRY`;
  }
}

function formatAmount(b: any) {
  const hasAmount = typeof b.amount === "number";
  const currency = (b.currency || "TRY").toString().toUpperCase();
  if (hasAmount) {
    if (currency === "TRY") return formatMoneyTRY(b.amount);
    return `${b.amount} ${currency}`;
  }
  return b.is_trial ? "0 ₺" : "1500 ₺";
}
