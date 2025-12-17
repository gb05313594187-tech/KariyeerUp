// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Calendar,
  FileText,
  CreditCard,
  BadgeCheck,
  Inbox,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const REQ_STATUS = ["new", "contacted", "closed"] as const;

function money(n: any) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  // live data
  const [profile, setProfile] = useState<any>(null);
  const [ent, setEnt] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  // ui state
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const computed = useMemo(() => {
    const seatsTotal = ent?.seats_total ?? 0;
    const seatsUsed = ent?.seats_used ?? 0;
    const seatsLeft = Math.max(0, seatsTotal - seatsUsed);

    const sessionsTotal = ent?.sessions_total ?? 0;
    const sessionsUsed = ent?.sessions_used ?? 0;
    const sessionsLeft = Math.max(0, sessionsTotal - sessionsUsed);

    const reqTotal = requests?.length ?? 0;
    const reqNew = (requests || []).filter((r) => r.status === "new").length;
    const reqContacted = (requests || []).filter((r) => r.status === "contacted").length;
    const reqClosed = (requests || []).filter((r) => r.status === "closed").length;

    const upcoming = (bookings || []).filter((b) => b.status === "scheduled").length;

    const start = ent?.period_start ? String(ent.period_start) : "-";
    const end = ent?.period_end ? String(ent.period_end) : "-";

    const thisMonthSpend = (invoices || [])
      .filter((inv) => {
        // basit: period_end bu ay ise say
        if (!inv?.period_end) return false;
        const d = new Date(inv.period_end);
        const now = new Date();
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

    return {
      seatsTotal, seatsUsed, seatsLeft,
      sessionsTotal, sessionsUsed, sessionsLeft,
      reqTotal, reqNew, reqContacted, reqClosed,
      upcoming,
      periodText: `${start} → ${end}`,
      invoiceCount: invoices?.length ?? 0,
      thisMonthSpend,
    };
  }, [ent, requests, bookings, invoices]);

  const safeSetError = (key: string, message?: string) => {
    setErrors((p) => {
      const n = { ...p };
      if (!message) delete n[key];
      else n[key] = message;
      return n;
    });
  };

  const fetchAll = async (userId: string) => {
    setRefreshing(true);
    setErrors({});

    // 1) Profile
    try {
      const { data, error } = await supabase
        .from("corporate_profiles")
        .select("user_id, legal_name, brand_name, status, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data || null);
      safeSetError("profile", null);
    } catch (e: any) {
      setProfile(null);
      safeSetError("profile", e?.message || "Profil okunamadı.");
    }

    // 2) Entitlements
    try {
      const { data, error } = await supabase
        .from("corporate_entitlements")
        .select("user_id, seats_total, seats_used, sessions_total, sessions_used, period_start, period_end, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setEnt(data || null);
      safeSetError("entitlements", null);
    } catch (e: any) {
      setEnt(null);
      safeSetError("entitlements", e?.message || "Paket/Limit okunamadı.");
    }

    // 3) Bookings (yaklaşan)
    try {
      const { data, error } = await supabase
        .from("corporate_bookings")
        .select("id, user_id, coach_id, starts_at, status, created_at")
        .eq("user_id", userId)
        .order("starts_at", { ascending: true })
        .limit(50);

      if (error) throw error;
      setBookings(data || []);
      safeSetError("bookings", null);
    } catch (e: any) {
      setBookings([]);
      safeSetError("bookings", e?.message || "Planlanan seanslar okunamadı.");
    }

    // 4) Invoices
    try {
      const { data, error } = await supabase
        .from("corporate_invoices")
        .select("id, user_id, invoice_no, amount, currency, period_start, period_end, status, file_path, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setInvoices(data || []);
      safeSetError("invoices", null);
    } catch (e: any) {
      setInvoices([]);
      safeSetError("invoices", e?.message || "Faturalar okunamadı.");
    }

    // 5) Requests (senin mevcut tablon)
    try {
      const { data, error } = await supabase
        .from("company_requests")
        .select("id, user_id, company_name, contact_person, email, phone, message, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setRequests(data || []);
      safeSetError("requests", null);
    } catch (e: any) {
      setRequests([]);
      safeSetError("requests", e?.message || "Talepler okunamadı.");
    }

    setRefreshing(false);
  };

  const updateRequestStatus = async (id: string, next: (typeof REQ_STATUS)[number]) => {
    const prev = requests;
    setRequests((cur) => cur.map((r) => (r.id === id ? { ...r, status: next } : r)));

    const { data, error } = await supabase
      .from("company_requests")
      .update({ status: next })
      .eq("id", id)
      .select("id,status");

    if (error || !data?.length) {
      setRequests(prev);
      toast.error("Status güncellenemedi (RLS/Policy).");
      return;
    }
    toast.success(`Status güncellendi: ${next}`);
  };

  const downloadInvoice = async (inv: any) => {
    try {
      if (!inv?.file_path) return;

      // Bucket adı: invoices
      const { data, error } = await supabase.storage
        .from("invoices")
        .download(inv.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = inv.invoice_no ? `${inv.invoice_no}.pdf` : "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Fatura indirilemedi.");
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const user = data?.user || null;
      setMe(user);

      if (user?.id) await fetchAll(user.id);

      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  if (!me?.id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Giriş gerekli.
      </div>
    );
  }

  const hasErrors = Object.keys(errors || {}).length > 0;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-white/90">Corporate Panel</p>
            <h1 className="text-2xl font-bold text-white">Şirket Paneli</h1>
            <p className="text-xs text-white/85 mt-1">
              Kullanıcı: <span className="text-yellow-200">{me?.email || "-"}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white/15 text-white hover:bg-white/20 border border-white/20"
              onClick={() => fetchAll(me.id)}
              disabled={refreshing}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Yenile
            </Button>

            <Button
              className="bg-white text-red-600 hover:bg-orange-50"
              onClick={() => (window.location.href = "/corporate/profile")}
            >
              Profil
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

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* ERROR BANNER */}
        {hasErrors && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Bazı veriler okunamadı
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-1">
              {errors.profile && <div>Profil: {errors.profile}</div>}
              {errors.entitlements && <div>Paket/Limit: {errors.entitlements}</div>}
              {errors.bookings && <div>Planlanan Seanslar: {errors.bookings}</div>}
              {errors.invoices && <div>Faturalar: {errors.invoices}</div>}
              {errors.requests && <div>Açık Talepler: {errors.requests}</div>}
            </CardContent>
          </Card>
        )}

        {/* KPI CARDS */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Inbox className="w-4 h-4 text-orange-600" />
                Açık Talepler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-2xl font-bold">{computed.reqTotal}</div>
              <div className="text-xs text-slate-500 mt-1">
                New: {computed.reqNew} • Contacted: {computed.reqContacted} • Closed: {computed.reqClosed}
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
                {computed.seatsUsed}/{computed.seatsTotal}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Kalan katılımcı hakkı: {computed.seatsLeft}
              </div>
              <div className="text-xs text-slate-500">Dönem: {computed.periodText}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Seans Kredisi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-2xl font-bold">
                {computed.sessionsUsed}/{computed.sessionsTotal}
              </div>
              <div className="text-xs text-slate-500 mt-1">Kalan seans: {computed.sessionsLeft}</div>
              <div className="text-xs text-slate-500">Planlanan (yaklaşan): {computed.upcoming}</div>
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
              <div className="text-2xl font-bold">{money(computed.thisMonthSpend)}</div>
              <div className="text-xs text-slate-500 mt-1">Fatura sayısı: {computed.invoiceCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* PROFILE STATUS + CTA */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
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
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Son güncelleme</span>
                <span className="text-slate-700">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : "-"}
                </span>
              </div>

              <Button className="w-full bg-orange-600 hover:bg-orange-500" onClick={() => (window.location.href = "/corporate/profile")}>
                Profili Güncelle
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-600" />
                Yeni Talep Aç
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-slate-600">
                Kurumsal koçluk / demo / teklif için talep oluştur.
              </div>
              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/for-companies")}>
                Talep Formuna Git
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                Faturalar
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-slate-600">
                PDF indirilebilir. Dosya yoksa buton pasif olur.
              </div>
              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/corporate/invoices")}>
                Fatura Listesine Git
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* REQUESTS LIST */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Inbox className="w-4 h-4 text-orange-600" />
              Taleplerim (Son 50)
            </CardTitle>
            <div className="text-xs text-slate-500">{requests.length} kayıt</div>
          </CardHeader>

          <CardContent className="text-sm">
            {requests.length === 0 && <div className="py-4 text-slate-500">Henüz talep yok. (0 gösterilir, mock yok)</div>}

            {requests.map((r) => (
              <div key={r.id} className="border rounded-xl p-4 mb-3 bg-white">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-semibold">{r.company_name || "-"}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {r.contact_person || "-"} • {r.email || "-"} • {r.phone || "-"}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
                  </div>
                </div>

                {r.message && <div className="mt-2 text-sm">{r.message}</div>}

                <div className="mt-3 flex gap-2 flex-wrap">
                  {REQ_STATUS.map((s) => (
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
              </div>
            ))}
          </CardContent>
        </Card>

        {/* BOOKINGS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              Planlanan Seanslar (Yaklaşan)
            </CardTitle>
            <div className="text-xs text-slate-500">{bookings.length} kayıt</div>
          </CardHeader>

          <CardContent className="text-sm">
            {bookings.length === 0 && <div className="py-4 text-slate-500">Henüz planlanan seans yok. (0 gösterilir, mock yok)</div>}

            {bookings.map((b) => (
              <div key={b.id} className="border rounded-xl p-4 mb-3 bg-white flex items-center justify-between">
                <div>
                  <div className="font-semibold">{b.status || "scheduled"}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {b.starts_at ? new Date(b.starts_at).toLocaleString() : "-"}
                    {b.coach_id ? ` • coach: ${b.coach_id}` : ""}
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" disabled className="mt-2">
              Takvime Git (yakında)
            </Button>
         ς
          </CardContent>
        </Card>

        {/* INVOICES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              Faturalar (İndirilebilir)
            </CardTitle>
            <div className="text-xs text-slate-500">{invoices.length} kayıt</div>
          </CardHeader>

          <CardContent className="text-sm">
            {invoices.length === 0 && <div className="py-4 text-slate-500">Henüz fatura yok. (0 gösterilir, mock yok)</div>}

            {invoices.map((inv) => (
              <div key={inv.id} className="border rounded-xl p-4 mb-3 bg-white flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{inv.invoice_no || "-"}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {inv.period_start || "-"} → {inv.period_end || "-"} • {inv.status || "-"}
                  </div>
                  <div className="text-sm mt-1">{money(inv.amount || 0)}</div>
                </div>

                <Button
                  variant={inv.file_path ? "default" : "outline"}
                  disabled={!inv.file_path}
                  onClick={() => downloadInvoice(inv)}
                >
                  PDF İndir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-xs text-slate-500">
          Bu panel enterprise mantığında: veriler Supabase’ten okunur; veri yoksa 0 görünür. “Okunamadı” hatası çıkarsa sorun %99: tablo yok / kolon adı farklı / RLS policy eksik.
        </div>
      </div>
    </div>
  );
}
