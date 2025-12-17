// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Briefcase,
  Inbox,
  RefreshCw,
  FileDown,
  CalendarDays,
  BadgeCheck,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

/**
 * ✅ Bu dashboard MOCK değildir.
 * - Supabase'ten okur.
 * - Veri yoksa 0 gösterir.
 * - Tablo/RLS hatasında net hata verir.
 *
 * Beklenen tablolar (minimum):
 * 1) company_requests: (id, user_id, company_name, contact_person, email, phone, message, status, created_at)
 *
 * Profesyonel (enterprise) için ek tablolar:
 * 2) corporate_profiles: (user_id, brand_name, legal_name, status, ... )
 * 3) corporate_entitlements: (user_id, seats_total, seats_used, sessions_total, sessions_used, period_start, period_end, updated_at)
 * 4) corporate_bookings: (id, user_id, coach_id, starts_at, status, created_at)  // kurumun planladığı seanslar
 * 5) corporate_invoices: (id, user_id, invoice_no, amount, currency, period_start, period_end, status, file_path, created_at)
 *
 * NOT: Bu file'da hepsi opsiyonel okunuyor. Tablo yoksa sıfır + hata kartı gösterir.
 */

const REQUEST_STATUS = ["new", "contacted", "closed"] as const;
const BOOKING_STATUS = ["scheduled", "completed", "cancelled", "no_show"] as const;

function fmtMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `${amount || 0} ${currency || ""}`.trim();
  }
}

function fmtDate(dt: string) {
  if (!dt) return "-";
  try {
    return new Date(dt).toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return dt;
  }
}

export default function CorporateDashboard() {
  const [bootLoading, setBootLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  // ----- Profile -----
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // ----- Entitlements (Seats/Sessions) -----
  const [entLoading, setEntLoading] = useState(true);
  const [entError, setEntError] = useState<string | null>(null);
  const [ent, setEnt] = useState<any>(null);

  // ----- Requests -----
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);

  // ----- Bookings (upcoming) -----
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  // ----- Invoices -----
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  // ----- Aggregates (always show 0 if no data) -----
  const kpi = useMemo(() => {
    const reqTotal = requests?.length || 0;
    const reqNew = (requests || []).filter((r) => r.status === "new").length;
    const reqContacted = (requests || []).filter((r) => r.status === "contacted").length;
    const reqClosed = (requests || []).filter((r) => r.status === "closed").length;

    const seatsTotal = Number(ent?.seats_total || 0);
    const seatsUsed = Number(ent?.seats_used || 0);
    const seatsLeft = Math.max(seatsTotal - seatsUsed, 0);

    const sesTotal = Number(ent?.sessions_total || 0);
    const sesUsed = Number(ent?.sessions_used || 0);
    const sesLeft = Math.max(sesTotal - sesUsed, 0);

    const upcomingCount = (bookings || []).filter((b) => b.status === "scheduled").length;

    // This month spend (from invoices)
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const monthStart = new Date(y, m, 1).getTime();
    const monthEnd = new Date(y, m + 1, 1).getTime();

    const monthInvoices = (invoices || []).filter((inv) => {
      const t = inv.created_at ? new Date(inv.created_at).getTime() : 0;
      return t >= monthStart && t < monthEnd;
    });

    const currency = (monthInvoices[0]?.currency || invoices?.[0]?.currency || "USD").toUpperCase();
    const monthSpend = monthInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

    return {
      reqTotal,
      reqNew,
      reqContacted,
      reqClosed,
      seatsTotal,
      seatsUsed,
      seatsLeft,
      sesTotal,
      sesUsed,
      sesLeft,
      upcomingCount,
      monthSpend,
      currency,
    };
  }, [requests, ent, bookings, invoices]);

  // ---------- Fetchers ----------
  const fetchProfile = async (userId: string) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const { data, error } = await supabase
        .from("corporate_profiles")
        .select("user_id, legal_name, brand_name, status, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        setProfile(null);
        setProfileError(error.message || "corporate_profiles okunamadı.");
      } else {
        setProfile(data || null);
      }
    } catch (e: any) {
      setProfile(null);
      setProfileError("Profil okunurken hata oluştu.");
      console.error(e);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchEntitlements = async (userId: string) => {
    setEntLoading(true);
    setEntError(null);
    try {
      const { data, error } = await supabase
        .from("corporate_entitlements")
        .select(
          "user_id, seats_total, seats_used, sessions_total, sessions_used, period_start, period_end, updated_at"
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        setEnt(null);
        setEntError(error.message || "corporate_entitlements okunamadı.");
      } else {
        setEnt(data || null);
      }
    } catch (e: any) {
      setEnt(null);
      setEntError("Paket/limit okunurken hata oluştu.");
      console.error(e);
    } finally {
      setEntLoading(false);
    }
  };

  const fetchRequests = async (userId: string) => {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const { data, error } = await supabase
        .from("company_requests")
        .select("id, company_name, contact_person, email, phone, message, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        setRequests([]);
        setRequestsError(error.message || "company_requests okunamadı.");
      } else {
        setRequests(data || []);
      }
    } catch (e: any) {
      setRequests([]);
      setRequestsError("Talepler okunurken hata oluştu.");
      console.error(e);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchBookings = async (userId: string) => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const { data, error } = await supabase
        .from("corporate_bookings")
        .select("id, coach_id, starts_at, status, created_at")
        .eq("user_id", userId)
        .order("starts_at", { ascending: true })
        .limit(20);

      if (error) {
        setBookings([]);
        setBookingsError(error.message || "corporate_bookings okunamadı.");
      } else {
        setBookings(data || []);
      }
    } catch (e: any) {
      setBookings([]);
      setBookingsError("Planlanan seanslar okunurken hata oluştu.");
      console.error(e);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchInvoices = async (userId: string) => {
    setInvoicesLoading(true);
    setInvoicesError(null);
    try {
      const { data, error } = await supabase
        .from("corporate_invoices")
        .select("id, invoice_no, amount, currency, period_start, period_end, status, file_path, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        setInvoices([]);
        setInvoicesError(error.message || "corporate_invoices okunamadı.");
      } else {
        setInvoices(data || []);
      }
    } catch (e: any) {
      setInvoices([]);
      setInvoicesError("Faturalar okunurken hata oluştu.");
      console.error(e);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const refreshAll = async () => {
    if (!me?.id) return;
    await Promise.all([
      fetchProfile(me.id),
      fetchEntitlements(me.id),
      fetchRequests(me.id),
      fetchBookings(me.id),
      fetchInvoices(me.id),
    ]);
  };

  const updateRequestStatus = async (id: string, nextStatus: (typeof REQUEST_STATUS)[number]) => {
    const prev = requests;
    setRequests((cur) => cur.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));

    const { data, error } = await supabase
      .from("company_requests")
      .update({ status: nextStatus })
      .eq("id", id)
      .select("id,status");

    if (error || !data || data.length === 0) {
      setRequests(prev);
      toast.error("Status güncellenemedi (RLS/Policy).");
      console.error("UPDATE ERROR:", error);
      return;
    }

    toast.success(`Status güncellendi: ${nextStatus}`);
  };

  const downloadInvoice = async (inv: any) => {
    try {
      if (!inv?.file_path) {
        toast.error("Bu fatura için dosya bulunmuyor.");
        return;
      }
      // ✅ bucket adı: invoices (değilse kendi bucket adını yaz)
      const { data, error } = await supabase.storage.from("invoices").createSignedUrl(inv.file_path, 60);
      if (error || !data?.signedUrl) {
        toast.error("Fatura indirilemedi (storage/policy).");
        console.error(error);
        return;
      }
      window.open(data.signedUrl, "_blank");
    } catch (e: any) {
      console.error(e);
      toast.error("Fatura indirme sırasında hata oluştu.");
    }
  };

  // ---------- Boot ----------
  useEffect(() => {
    const run = async () => {
      setBootLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user || null;
        setMe(user);

        if (!user?.id) return;

        await Promise.all([
          fetchProfile(user.id),
          fetchEntitlements(user.id),
          fetchRequests(user.id),
          fetchBookings(user.id),
          fetchInvoices(user.id),
        ]);
      } finally {
        setBootLoading(false);
      }
    };
    run();
  }, []);

  if (bootLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  if (!me?.id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Giriş yapılmamış. Kurumsal panel için login ol.
      </div>
    );
  }

  const brand = profile?.brand_name || profile?.legal_name || "Şirket";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-white/90">Corporate Panel</p>
            <h1 className="text-2xl font-bold text-white">Şirket Paneli</h1>
            <p className="text-xs text-white/85 mt-1">
              {brand} • <span className="text-yellow-200">{me?.email || "-"}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white/15 text-white hover:bg-white/20 border border-white/20"
              onClick={refreshAll}
              disabled={requestsLoading || invoicesLoading || bookingsLoading || entLoading || profileLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>

            <Button
              className="bg-white text-red-600 hover:bg-orange-50"
              onClick={() => (window.location.href = "/corporate/profile")}
            >
              Profil
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="border-white/60 text-white hover:bg-white/10"
              onClick={() => (window.location.href = "/corporate/settings")}
            >
              Ayarlar
            </Button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* ERROR STRIP (non-blocking) */}
        {(profileError || entError || requestsError || bookingsError || invoicesError) && (
          <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
            <div className="font-semibold mb-1">Bazı veriler okunamadı:</div>
            <ul className="list-disc pl-5 space-y-1">
              {profileError && <li>Profil: {profileError}</li>}
              {entError && <li>Paket/Limit: {entError}</li>}
              {requestsError && <li>Talepler: {requestsError}</li>}
              {bookingsError && <li>Planlanan Seanslar: {bookingsError}</li>}
              {invoicesError && <li>Faturalar: {invoicesError}</li>}
            </ul>
          </div>
        )}

        {/* KPI GRID */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Inbox className="w-4 h-4 text-orange-600" />
                Açık Talepler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-2xl font-bold">{kpi.reqNew}</div>
              <div className="text-xs text-slate-500">
                Toplam: {kpi.reqTotal} • Contacted: {kpi.reqContacted} • Closed: {kpi.reqClosed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                Katılımcı Paketi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-2xl font-bold">
                {kpi.seatsUsed}/{kpi.seatsTotal}
              </div>
              <div className="text-xs text-slate-500">Kalan katılımcı hakkı: {kpi.seatsLeft}</div>
              <div className="text-xs text-slate-500 mt-1">
                Dönem: {ent?.period_start ? fmtDate(ent.period_start) : "-"} →{" "}
                {ent?.period_end ? fmtDate(ent.period_end) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-orange-600" />
                Seans Kredisi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-2xl font-bold">
                {kpi.sesUsed}/{kpi.sesTotal}
              </div>
              <div className="text-xs text-slate-500">Kalan seans: {kpi.sesLeft}</div>
              <div className="text-xs text-slate-500 mt-1">Planlanan (yaklaşan): {kpi.upcomingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-600" />
                Bu Ay Harcama
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-2xl font-bold">{fmtMoney(kpi.monthSpend, kpi.currency)}</div>
              <div className="text-xs text-slate-500">Fatura sayısı: {(invoices || []).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-orange-600" />
                Profil Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Durum</span>
                <span className="font-semibold">{profile?.status || "draft"}</span>
              </div>
              <div className="text-xs text-slate-500">
                Son güncelleme: {profile?.updated_at ? fmtDate(profile.updated_at) : "-"}
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-500"
                onClick={() => (window.location.href = "/corporate/profile")}
              >
                Profili Güncelle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-600" />
                Yeni Talep Aç
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-xs text-slate-500">
                Kurumsal koçluk / demo / teklif için talep oluştur.
              </div>
              <Button className="w-full" variant="outline" onClick={() => (window.location.href = "/companies")}>
                Talep Formuna Git
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileDown className="w-4 h-4 text-orange-600" />
                Faturalar
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-xs text-slate-500">
                PDF indirilebilir. Dosya yoksa buton pasif olur.
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("invoices");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Fatura Listesine Git
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* REQUESTS + BOOKINGS */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* REQUESTS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-600" />
                Taleplerim (Son 50)
              </CardTitle>
              <div className="text-xs text-slate-500">
                {requestsLoading ? "Yükleniyor..." : `${requests.length} kayıt`}
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              {!requestsLoading && (requests || []).length === 0 && (
                <div className="py-4 text-slate-500">Henüz talep yok. (0 gösterilir, mock yok)</div>
              )}

              {(requests || []).map((r) => (
                <div key={r.id} className="border rounded-xl p-4 mb-3 bg-white">
                  <div className="flex justify-between items-start gap-3">
                    <div className="font-semibold">{r.company_name || "—"}</div>
                    <span className="text-xs px-2 py-1 rounded border">
                      {r.status || "new"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    {r.contact_person || "—"} • {r.email || "—"} • {r.phone || "—"}
                  </div>

                  {r.message && <div className="mt-2 text-sm text-slate-800">{r.message}</div>}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {REQUEST_STATUS.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={r.status === s ? "default" : "outline"}
                        onClick={() => updateRequestStatus(r.id, s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2">
                    {r.created_at ? fmtDate(r.created_at) : "-"}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* BOOKINGS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-orange-600" />
                Planlanan Seanslar (Yaklaşan)
              </CardTitle>
              <div className="text-xs text-slate-500">
                {bookingsLoading ? "Yükleniyor..." : `${(bookings || []).length} kayıt`}
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              {!bookingsLoading && (bookings || []).length === 0 && (
                <div className="py-4 text-slate-500">
                  Henüz planlanan seans yok. (0 gösterilir, mock yok)
                </div>
              )}

              {(bookings || []).map((b) => (
                <div key={b.id} className="border rounded-xl p-4 mb-3 bg-white">
                  <div className="flex justify-between items-start gap-3">
                    <div className="font-semibold">Seans</div>
                    <span className="text-xs px-2 py-1 rounded border">{b.status || "scheduled"}</span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    Başlangıç: <span className="font-medium">{b.starts_at ? fmtDate(b.starts_at) : "-"}</span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">Coach ID: {b.coach_id || "—"}</div>
                </div>
              ))}

              <div className="pt-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => toast.message("Takvim ekranını bir sonraki adımda bağlayalım (corporate_bookings).")}
                >
                  Takvime Git (yakında)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INVOICES */}
        <Card id="invoices">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileDown className="w-4 h-4 text-orange-600" />
              Faturalar (İndirilebilir)
            </CardTitle>
            <div className="text-xs text-slate-500">
              {invoicesLoading ? "Yükleniyor..." : `${(invoices || []).length} kayıt`}
            </div>
          </CardHeader>

          <CardContent className="text-sm">
            {!invoicesLoading && (invoices || []).length === 0 && (
              <div className="py-4 text-slate-500">Henüz fatura yok. (0 gösterilir, mock yok)</div>
            )}

            {(invoices || []).map((inv) => (
              <div key={inv.id} className="border rounded-xl p-4 mb-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      Fatura: {inv.invoice_no || inv.id}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Dönem: {inv.period_start ? fmtDate(inv.period_start) : "-"} →{" "}
                      {inv.period_end ? fmtDate(inv.period_end) : "-"}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Tarih: {inv.created_at ? fmtDate(inv.created_at) : "-"} • Durum:{" "}
                      <span className="font-medium">{inv.status || "issued"}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {fmtMoney(Number(inv.amount || 0), (inv.currency || "USD").toUpperCase())}
                    </div>
                    <Button
                      size="sm"
                      className="mt-2"
                      variant={inv.file_path ? "default" : "outline"}
                      disabled={!inv.file_path}
                      onClick={() => downloadInvoice(inv)}
                      title={!inv.file_path ? "Dosya yolu yok (file_path)" : "PDF indir"}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      PDF İndir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* FOOTNOTE */}
        <div className="text-[11px] text-slate-500">
          Bu panel enterprise mantığında: veriler Supabase’ten okunur; veri yoksa 0 görünür. “Okunamadı” hatası çıkarsa
          sorun %99: tablo yok / kolon adı farklı / RLS policy eksik.
        </div>
      </div>
    </div>
  );
}
