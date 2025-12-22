// src/pages/AdminDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Briefcase,
  Building2,
  Hourglass,
  RefreshCw,
  Crown,
  CreditCard,
  TrendingUp,
  ShieldAlert,
  CalendarClock,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";

/* ==============================
   TYPES
============================== */
type AdminMetrics = {
  total_profiles: number;
  total_coaches: number;
  total_company_requests: number;
  pending_coach_apps: number;
  total_corporates?: number;
  total_sessions?: number;
  total_revenue_try?: number;
};

type PremiumRow = {
  id: string;
  user_id: string;
  subscription_type: string | null;
  status: string | null;
  price: number | null;
  currency: string | null;
  start_date: string | null;
  end_date: string | null;
  auto_renew: boolean | null;
  badge_type: string | null;
  created_at: string | null;
};

type CompanyRequestRow = {
  id: string;
  company_name?: string | null;
  status?: string | null;
  created_at?: string | null;
};

// ✅ DB ile UYUMLU coach_applications shape
type CoachAppRow = {
  id: string;
  user_id?: string | null;

  full_name?: string | null;
  email?: string | null;
  phone?: string | null;

  city?: string | null;
  country?: string | null;

  status?: string | null;
  created_at?: string | null;

  certification?: string | null;
  certification_year?: string | null;

  experience?: string | null; // DB: experience
  specializations?: string | null; // DB: specializations
  session_fee?: number | null; // DB: session_fee

  cv_path?: string | null;
  certificate_path?: string | null;

  bio?: string | null;
  linkedin?: string | null;
  website?: string | null;
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminMetrics | null>(null);

  const [premiumRows, setPremiumRows] = useState<PremiumRow[]>([]);
  const [companyRows, setCompanyRows] = useState<CompanyRequestRow[]>([]);
  const [coachAppRows, setCoachAppRows] = useState<CoachAppRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [hardError, setHardError] = useState<string | null>(null);
  const [softNotes, setSoftNotes] = useState<string[]>([]);
  const [q, setQ] = useState("");

  // Coach approval UI states
  const [selectedApp, setSelectedApp] = useState<CoachAppRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setHardError(null);
    setSoftNotes([]);

    // 1) KPI view
    const { data: metrics, error: metricsErr } = await supabase
      .from("admin_overview_metrics")
      .select("*")
      .single();

    if (metricsErr) {
      setHardError(metricsErr.message);
      setLoading(false);
      return;
    }

    setData(metrics as AdminMetrics);

    // 2) Optional sources
    const notes: string[] = [];

    const tasks = await Promise.allSettled([
      supabase
        .from("app_2dff6511da_premium_subscriptions")
        .select(
          "id,user_id,subscription_type,status,price,currency,start_date,end_date,auto_renew,badge_type,created_at"
        )
        .order("created_at", { ascending: false })
        .limit(50),

      supabase
        .from("company_requests")
        .select("id,company_name,status,created_at")
        .order("created_at", { ascending: false })
        .limit(30),

      // ✅ Coach applications (DB kolonları ile)
      supabase
        .from("coach_applications")
        .select(
          "id,user_id,full_name,email,phone,city,country,status,created_at,certification,certification_year,experience,specializations,session_fee,cv_path,certificate_path,bio,linkedin,website"
        )
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    // premium
    if (tasks[0].status === "fulfilled") {
      const r = tasks[0].value;
      if (r.error) notes.push(`Premium: ${r.error.message}`);
      else setPremiumRows((r.data as any[]) as PremiumRow[]);
    } else {
      notes.push("Premium: okunamadı (bağlantı/izin).");
    }

    // company requests
    if (tasks[1].status === "fulfilled") {
      const r = tasks[1].value;
      if (r.error) notes.push(`Company Requests: ${r.error.message}`);
      else setCompanyRows((r.data as any[]) as CompanyRequestRow[]);
    } else {
      notes.push("Company Requests: okunamadı (bağlantı/izin).");
    }

    // coach apps
    if (tasks[2].status === "fulfilled") {
      const r = tasks[2].value;
      if (r.error) notes.push(`Coach Applications: ${r.error.message}`);
      else setCoachAppRows((r.data as any[]) as CoachAppRow[]);
    } else {
      notes.push("Coach Applications: okunamadı (bağlantı/izin).");
    }

    setSoftNotes(notes);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const premiumAgg = useMemo(() => {
    const rows = premiumRows || [];
    const active = rows.filter((r) => (r.status || "").toLowerCase() === "active");
    const activeCount = active.length;

    const activeTry = active.filter((r) => (r.currency || "").toUpperCase() === "TRY");
    const mrrTry = activeTry.reduce((sum, r) => sum + (Number(r.price) || 0), 0);
    const arrTry = mrrTry * 12;

    const autoRenewRate =
      activeCount === 0
        ? 0
        : Math.round((active.filter((r) => r.auto_renew === true).length / activeCount) * 100);

    const byType = rows.reduce<Record<string, number>>((acc, r) => {
      const k = (r.subscription_type || "unknown").toString();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    return { rows, activeCount, mrrTry, arrTry, autoRenewRate, byType };
  }, [premiumRows]);

  const filteredRecent = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return { premiums: premiumRows, companies: companyRows, coachApps: coachAppRows };

    const match = (s?: string | null) => (s || "").toLowerCase().includes(needle);

    return {
      premiums: premiumRows.filter(
        (r) =>
          match(r.user_id) ||
          match(r.subscription_type) ||
          match(r.status) ||
          match(r.badge_type) ||
          match(r.currency)
      ),
      companies: companyRows.filter((r) => match(r.company_name) || match(r.status) || match(r.id)),
      coachApps: coachAppRows.filter(
        (r) =>
          match(r.full_name) ||
          match(r.status) ||
          match(r.id) ||
          match(r.user_id) ||
          match(r.email) ||
          match(r.phone)
      ),
    };
  }, [q, premiumRows, companyRows, coachAppRows]);

  // ✅ Pending list for approval flow
  const pendingCoachApps = useMemo(() => {
    return (filteredRecent.coachApps || []).filter(
      (a) => (a.status || "").toLowerCase() === "pending_review"
    );
  }, [filteredRecent.coachApps]);

  /* ==============================
     COACH APPROVAL ACTIONS
  ============================== */

  const openSignedFile = async (path?: string | null) => {
    if (!path) return;
    try {
      setActionLoading(true);
      const { data, error } = await supabase.storage
        .from("coach_uploads")
        .createSignedUrl(path, 60 * 10);
      if (error) throw error;
      const url = data?.signedUrl;
      if (!url) throw new Error("Signed URL üretilemedi.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("Dosya açılamadı (bucket private olabilir / izin yok).");
    } finally {
      setActionLoading(false);
    }
  };

  const approveCoach = async (app: CoachAppRow) => {
    if (!app?.id || !app?.user_id) {
      alert("Bu başvuruda user_id yok. coach_applications tablosunda user_id olmalı.");
      return;
    }

    setActionLoading(true);
    try {
      // 1) coach_applications -> approved
      const { error: upErr } = await supabase
        .from("coach_applications")
        .update({ status: "approved" })
        .eq("id", app.id);

      if (upErr) throw upErr;

      // 2) profiles -> role = coach (ASIL ÖNEMLİ)
      const { error: roleErr } = await supabase
        .from("profiles")
        .update({ role: "coach" })
        .eq("id", app.user_id);

      if (roleErr) throw roleErr;

      setSelectedApp(null);
      await fetchAll();
      alert("Koç onaylandı. (profiles.role = coach)");
    } catch (e: any) {
      console.error(e);
      alert(`Onay sırasında hata: ${e?.message || "Unknown error"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const rejectCoach = async (app: CoachAppRow) => {
    if (!app?.id) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("coach_applications")
        .update({ status: "rejected" })
        .eq("id", app.id);

      if (error) throw error;

      // opsiyonel: role'u user'a geri çek
      if (app.user_id) {
        await supabase.from("profiles").update({ role: "user" }).eq("id", app.user_id);
      }

      setSelectedApp(null);
      await fetchAll();
      alert("Başvuru reddedildi.");
    } catch (e: any) {
      console.error(e);
      alert(`Ret sırasında hata: ${e?.message || "Unknown error"}`);
    } finally {
      setActionLoading(false);
    }
  };

  /* ==============================
     RENDER
  ============================== */

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-100 rounded-xl" />
          <div className="h-28 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (hardError) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-2xl font-bold">Admin Dashboard</div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="font-semibold">Hata</div>
          <div className="text-sm mt-1">{hardError}</div>
          <div className="text-sm mt-2">
            Bu hata genelde şu yüzden olur: <b>admin_overview_metrics</b> view’ına RLS/izin yok ya da view yok.
          </div>
        </div>

        <button
          onClick={fetchAll}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!data) return null;

  const overviewCards = [
    {
      title: "Toplam Kullanıcı",
      value: data.total_profiles,
      icon: <Users className="h-5 w-5" />,
      hint: "Tüm profil sayısı",
    },
    {
      title: "Toplam Koç",
      value: data.total_coaches,
      icon: <Briefcase className="h-5 w-5" />,
      hint: "Koç rolündeki kullanıcı",
    },
    {
      title: "Şirket Talepleri",
      value: data.total_company_requests,
      icon: <Building2 className="h-5 w-5" />,
      hint: "Toplam kurumsal talep",
    },
    {
      title: "Bekleyen Koç Başvurusu",
      value: data.pending_coach_apps,
      icon: <Hourglass className="h-5 w-5" />,
      hint: "pending_review başvurular",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">KPI • Premium • Operasyon • Koç Onay Merkezi</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara (premium / şirket / başvuru)…"
              className="pl-9 pr-3 py-2 rounded-lg border w-[280px] max-w-full"
            />
          </div>

          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
            title="Yenile"
          >
            <RefreshCw className="h-4 w-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Soft notes */}
      {softNotes.length > 0 && (
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-4 text-amber-900">
          <div className="font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Not
          </div>
          <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
            {softNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {overviewCards.map((c) => (
          <StatCard key={c.title} title={c.title} value={c.value} icon={c.icon} hint={c.hint} />
        ))}
      </div>

      {/* ✅ COACH APPROVAL CENTER */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Koç Onay Merkezi
            </div>
            <div className="text-xs text-gray-500 mt-1">
              pending_review başvurular • CV/Sertifika aç • Approve/Reject
            </div>
          </div>

          <div className="text-xs text-gray-500">{pendingCoachApps.length} bekleyen başvuru</div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {/* LEFT: list */}
          <div className="rounded-xl border bg-gray-50 p-4">
            {pendingCoachApps.length === 0 ? (
              <div className="text-sm text-gray-600">Bekleyen başvuru yok.</div>
            ) : (
              <div className="space-y-2">
                {pendingCoachApps.slice(0, 30).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full text-left rounded-xl border p-3 bg-white hover:bg-gray-50 transition ${
                      selectedApp?.id === app.id ? "border-red-300 ring-2 ring-red-100" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {app.full_name || "İsimsiz Başvuru"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {app.email || "—"} • {app.phone || "—"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(app.created_at)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: details */}
          <div className="rounded-xl border p-4">
            {!selectedApp ? (
              <div className="text-sm text-gray-600">
                Soldan bir başvuru seç. Detay + dosyalar burada açılacak.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-bold truncate">
                      {selectedApp.full_name || "Koç Adayı"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedApp.email || "—"} • {selectedApp.phone || "—"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedApp.city || "—"} {selectedApp.country ? ` / ${selectedApp.country}` : ""}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Status: <b>{selectedApp.status || "-"}</b>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Detail label="Deneyim">{(selectedApp.experience || "-").toString()}</Detail>
                  <Detail label="Seans Ücreti">
                    {selectedApp.session_fee != null ? `${selectedApp.session_fee} TRY` : "-"}
                  </Detail>
                  <Detail label="Sertifika">{selectedApp.certification || "-"}</Detail>
                  <Detail label="Sertifika Yılı">{selectedApp.certification_year || "-"}</Detail>
                </div>

                <Detail label="Uzmanlık">
                  {selectedApp.specializations ? (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedApp.specializations}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </Detail>

                <Detail label="Bio">
                  {selectedApp.bio ? (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApp.bio}</div>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </Detail>

                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={selectedApp.linkedin || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-xl border p-3 flex items-center justify-between ${
                      selectedApp.linkedin ? "hover:bg-gray-50" : "opacity-50 pointer-events-none"
                    }`}
                    title="LinkedIn"
                  >
                    <div className="text-sm font-semibold">LinkedIn</div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>

                  <a
                    href={selectedApp.website || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-xl border p-3 flex items-center justify-between ${
                      selectedApp.website ? "hover:bg-gray-50" : "opacity-50 pointer-events-none"
                    }`}
                    title="Website"
                  >
                    <div className="text-sm font-semibold">Website</div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => openSignedFile(selectedApp.cv_path)}
                    disabled={actionLoading || !selectedApp.cv_path}
                    className={`rounded-xl border p-3 flex items-center justify-between hover:bg-gray-50 ${
                      !selectedApp.cv_path ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold">CV Aç</span>
                    </div>
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  <button
                    onClick={() => openSignedFile(selectedApp.certificate_path)}
                    disabled={actionLoading || !selectedApp.certificate_path}
                    className={`rounded-xl border p-3 flex items-center justify-between hover:bg-gray-50 ${
                      !selectedApp.certificate_path ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold">Sertifika Aç</span>
                    </div>
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t">
                  <button
                    onClick={() => rejectCoach(selectedApp)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
                  >
                    <XCircle className="h-4 w-4 text-red-600" />
                    Reddet
                  </button>

                  <button
                    onClick={() => approveCoach(selectedApp)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Onayla
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  Onay = <b>coach_applications.status=approved</b> + <b>profiles.role=coach</b>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium + Revenue */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Premium / Gelir
            </div>
            <span className="text-xs text-gray-500">
              {premiumRows.length > 0 ? `${premiumRows.length} kayıt` : "veri yok/izin yok"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <MiniKpi title="Active" value={premiumAgg.activeCount} icon={<TrendingUp className="h-4 w-4" />} />
            <MiniKpi title="MRR (TRY)" value={formatMoneyTRY(premiumAgg.mrrTry)} icon={<CreditCard className="h-4 w-4" />} />
            <MiniKpi title="AutoRenew %" value={`${premiumAgg.autoRenewRate}%`} icon={<RefreshCw className="h-4 w-4" />} />
          </div>

          <div className="rounded-xl bg-gray-50 border p-4">
            <div className="text-sm font-semibold">Plan kırılımı (subscription_type)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.keys(premiumAgg.byType).length === 0 ? (
                <span className="text-sm text-gray-500">Henüz veri yok</span>
              ) : (
                Object.entries(premiumAgg.byType)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 12)
                  .map(([k, v]) => (
                    <span key={k} className="text-xs rounded-full border bg-white px-2 py-1" title={k}>
                      {k}: <b>{v}</b>
                    </span>
                  ))
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Not: Çoklu para birimi varsa MRR/ARR’i currency’ye göre ayıracağız.
            </div>
          </div>

          <div className="text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">ARR (TRY)</span>
              <span className="font-semibold">{formatMoneyTRY(premiumAgg.arrTry)}</span>
            </div>
          </div>
        </div>

        {/* Ops KPIs */}
        <div className="rounded-2xl border p-5 space-y-4 bg-white">
          <div className="font-semibold flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Operasyon Merkezi
          </div>

          <div className="space-y-3">
            <OpsRow title="Şirket talepleri" value={data.total_company_requests} sub="Pipeline girişi" />
            <OpsRow title="Bekleyen koç başvurusu" value={data.pending_coach_apps} sub="Onboarding darboğazı" />
            <OpsRow
              title="Koç oranı"
              value={
                data.total_profiles > 0
                  ? `${Math.round((data.total_coaches / data.total_profiles) * 100)}%`
                  : "0%"
              }
              sub="Koç / toplam kullanıcı"
            />
            <OpsRow title="Aktif premium" value={premiumAgg.activeCount} sub="Gelir üreten üyelik" />
          </div>

          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm font-semibold mb-2">Hızlı aksiyon listesi</div>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Bekleyen koçlara SLA koy (örn. 24-48 saat)</li>
              <li>Kurumsal talepleri status ile pipeline’a bağla</li>
              <li>Premium dönüşüm hunisi: landing → register → checkout</li>
            </ul>
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-2xl border p-5 space-y-4 bg-white">
          <div className="font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Insights (UI)
          </div>

          <div className="rounded-xl border bg-gradient-to-b from-gray-50 to-white p-4">
            <div className="text-sm font-semibold">Bu panel ne yapacak?</div>
            <div className="text-sm text-gray-600 mt-1">
              Admin için özet + öneri + anomali üretimi (Edge Function) bağlanacak.
            </div>

            <div className="mt-3 text-xs text-gray-500">Örnek:</div>
            <ul className="mt-2 text-sm text-gray-700 space-y-2">
              <li className="rounded-lg border bg-white p-3">
                <b>Gelir:</b> MRR (TRY) {formatMoneyTRY(premiumAgg.mrrTry)}
              </li>
              <li className="rounded-lg border bg-white p-3">
                <b>Öneri:</b> Koç onboarding’de “profile completion” ölç
              </li>
            </ul>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm font-semibold mb-2">Toplanacak datalar</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• DAU/WAU/MAU</div>
              <div>• Funnel</div>
              <div>• Premium: churn/ARPU/LTV</div>
              <div>• Kurumsal: lead → anlaşma</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tables */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PanelTable
          title="Son Premium Kayıtları"
          subtitle="subscription_type / status / price"
          emptyText="Premium tablosu boş veya erişim yok."
          rows={filteredRecent.premiums.slice(0, 10).map((r) => ({
            id: r.id,
            left: r.subscription_type || "-",
            mid: r.status || "-",
            right: `${r.price ?? "-"} ${r.currency ?? ""}`.trim(),
            meta: r.badge_type ? `badge: ${r.badge_type}` : "",
          }))}
        />

        <PanelTable
          title="Son Şirket Talepleri"
          subtitle="company_name / status"
          emptyText="company_requests boş veya erişim yok."
          rows={filteredRecent.companies.slice(0, 10).map((r) => ({
            id: r.id,
            left: r.company_name || r.id,
            mid: r.status || "-",
            right: formatDate(r.created_at),
            meta: "",
          }))}
        />

        <PanelTable
          title="Son Koç Başvuruları"
          subtitle="full_name / status"
          emptyText="coach_applications boş veya erişim yok."
          rows={filteredRecent.coachApps.slice(0, 10).map((r) => ({
            id: r.id,
            left: r.full_name || r.id,
            mid: r.status || "-",
            right: formatDate(r.created_at),
            meta: r.user_id ? `user: ${shortId(r.user_id)}` : "",
          }))}
        />
      </div>

      <div className="text-xs text-gray-500">
        Sonraki adım: <b>RLS/Policy</b> tarafını sağlamlaştırıp “admin-only” update garantisi.
      </div>
    </div>
  );
}

/* ==============================
   UI PARTS
============================== */

function StatCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border p-4 flex items-center gap-4 bg-white">
      <div className="p-3 rounded-xl bg-gray-50 border">{icon}</div>
      <div className="min-w-0">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        {hint ? <div className="text-xs text-gray-400 mt-1">{hint}</div> : null}
      </div>
    </div>
  );
}

function MiniKpi({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
}) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function OpsRow({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {sub ? <div className="text-xs text-gray-500 mt-1">{sub}</div> : null}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: any }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function PanelTable({
  title,
  subtitle,
  rows,
  emptyText,
}: {
  title: string;
  subtitle?: string;
  emptyText: string;
  rows: { id: string; left: string; mid: string; right: string; meta?: string }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle ? <div className="text-xs text-gray-500 mt-1">{subtitle}</div> : null}
        </div>
      </div>

      <div className="mt-4">
        {rows.length === 0 ? (
          <div className="text-sm text-gray-500">{emptyText}</div>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{r.left}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {r.mid}
                      {r.meta ? <span className="ml-2 text-gray-400">• {r.meta}</span> : null}
                    </div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">{r.right}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==============================
   HELPERS
============================== */

function formatMoneyTRY(n: number) {
  const val = Number(n || 0);
  try {
    return val.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
  } catch {
    return `${val} TRY`;
  }
}

function formatDate(s?: string | null) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("tr-TR");
}

function shortId(id?: string | null) {
  if (!id) return "-";
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}
