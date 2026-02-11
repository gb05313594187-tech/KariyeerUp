// src/pages/AdminDashboard.tsx
// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users, UserCheck, UserX, Briefcase, CreditCard, Star,
  Building2, MessageSquare, TrendingUp, RefreshCw, Award,
  Video, FileText, Brain, Mail, Heart, Calendar, CheckCircle2,
  Clock, BarChart3, Shield, Eye, Download, ChevronDown,
  ChevronUp, AlertTriangle, Zap, Search, ExternalLink,
  DollarSign, Activity, Globe, BookOpen
} from "lucide-react";

type Tab = "overview" | "coaches" | "companies" | "users" | "revenue" | "community" | "jobs";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");

  // Koç başvuru state
  const [coachApps, setCoachApps] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Şirket talepleri
  const [companyReqs, setCompanyReqs] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Kullanıcı listesi
  const [users, setUsers] = useState<any[]>([]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, statsRes, recentRes, appsRes, companiesRes, usersRes] =
        await Promise.all([
          supabase.from("admin_overview_metrics").select("*").single(),
          supabase.rpc("admin_get_dashboard_stats"),
          supabase.rpc("admin_recent_activity", { limit_count: 30 }),
          supabase
            .from("coach_applications")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("company_requests")
            .select("*")
            .order("updated_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
        ]);

      if (metricsRes.error) console.warn("metrics err:", metricsRes.error);
      if (statsRes.error) console.warn("stats err:", statsRes.error);
      if (recentRes.error) console.warn("recent err:", recentRes.error);

      setMetrics(metricsRes.data);
      setStats(statsRes.data);
      setRecent(recentRes.data);
      setCoachApps(appsRes.data || []);
      setCompanyReqs(companiesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Koç onayla
  const approveCoach = async (id: string) => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.rpc("admin_approve_coach", {
        application_id: id,
      });
      if (error) throw error;
      alert("✅ Koç onaylandı!");
      fetchAll();
      setSelectedApp(null);
    } catch (e: any) {
      alert("❌ Hata: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Koç reddet
  const rejectCoach = async (id: string) => {
    if (!confirm("Bu başvuruyu reddetmek istediğinize emin misiniz?")) return;
    setActionLoading(true);
    try {
      const { data, error } = await supabase.rpc("admin_reject_coach", {
        application_id: id,
        rejection_reason: "Başvurunuz değerlendirildi ancak uygun bulunmadı.",
      });
      if (error) throw error;
      alert("Başvuru reddedildi.");
      fetchAll();
      setSelectedApp(null);
    } catch (e: any) {
      alert("❌ Hata: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Şirket onayla
  const approveCompany = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase.rpc("admin_approve_company", {
        request_id: id,
      });
      if (error) throw error;
      alert("✅ Şirket onaylandı!");
      fetchAll();
    } catch (e: any) {
      alert("❌ Hata: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Şirket reddet
  const rejectCompany = async (id: string) => {
    if (!confirm("Bu şirket talebini reddetmek istediğinize emin misiniz?")) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.rpc("admin_reject_company", {
        request_id: id,
      });
      if (error) throw error;
      alert("Şirket reddedildi.");
      fetchAll();
    } catch (e: any) {
      alert("❌ Hata: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Arama filtresi
  const pendingApps = useMemo(() => {
    return coachApps
      .filter((a) => ["pending", "pending_review", "new"].includes(a.status))
      .filter((a) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          a.full_name?.toLowerCase().includes(s) ||
          a.email?.toLowerCase().includes(s)
        );
      });
  }, [coachApps, search]);

  const pendingCompanies = useMemo(() => {
    return companyReqs
      .filter((c) => ["pending", "pending_review", "new"].includes(c.status))
      .filter((c) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          c.legal_name?.toLowerCase().includes(s) ||
          c.brand_name?.toLowerCase().includes(s)
        );
      });
  }, [companyReqs, search]);

  const m = metrics || {};
  const s = stats || {};

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {m.last_updated
              ? `Son güncelleme: ${new Date(m.last_updated).toLocaleString("tr-TR")}`
              : "Yükleniyor..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64 rounded-lg"
            />
          </div>
          <Button onClick={fetchAll} variant="outline" className="rounded-lg">
            <RefreshCw className="h-4 w-4 mr-2" /> Yenile
          </Button>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex gap-1 overflow-x-auto border-b pb-1">
        {[
          { key: "overview", label: "Genel Bakış", icon: <BarChart3 className="h-4 w-4" /> },
          { key: "coaches", label: `Koç Onay (${pendingApps.length})`, icon: <UserCheck className="h-4 w-4" /> },
          { key: "companies", label: `Şirket Onay (${pendingCompanies.length})`, icon: <Building2 className="h-4 w-4" /> },
          { key: "users", label: "Kullanıcılar", icon: <Users className="h-4 w-4" /> },
          { key: "revenue", label: "Gelir", icon: <DollarSign className="h-4 w-4" /> },
          { key: "community", label: "Topluluk", icon: <MessageSquare className="h-4 w-4" /> },
          { key: "jobs", label: "İşe Alım", icon: <Briefcase className="h-4 w-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${
              tab === t.key
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══ GENEL BAKIŞ ═══ */}
      {tab === "overview" && (
        <div className="space-y-8">
          {/* Uyarı banner */}
          {(pendingApps.length > 0 || pendingCompanies.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-amber-800">Aksiyon gerekli: </span>
                {pendingApps.length > 0 && (
                  <span className="text-amber-700">
                    {pendingApps.length} koç başvurusu bekliyor.{" "}
                  </span>
                )}
                {pendingCompanies.length > 0 && (
                  <span className="text-amber-700">
                    {pendingCompanies.length} şirket talebi bekliyor.
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto shrink-0 text-amber-700 border-amber-300"
                onClick={() => setTab("coaches")}
              >
                İncele →
              </Button>
            </div>
          )}

          {/* Ana KPI'lar */}
          <div>
            <h2 className="text-lg font-semibold mb-3">📊 Ana Metrikler</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <KpiCard label="Toplam Kullanıcı" value={m.total_users} sub={`+${m.monthly_new_users} bu ay`} icon={<Users className="h-5 w-5" />} color="blue" />
              <KpiCard label="Bugün Kayıt" value={m.today_new_users} sub={`+${m.weekly_new_users} bu hafta`} icon={<TrendingUp className="h-5 w-5" />} color="green" />
              <KpiCard label="Premium Üye" value={m.total_premium_users} sub={`${m.total_users ? ((m.total_premium_users / m.total_users) * 100).toFixed(1) : 0}% oran`} icon={<Award className="h-5 w-5" />} color="orange" />
              <KpiCard label="Toplam Koç" value={m.total_coaches} sub={`${m.active_coaches} aktif`} icon={<UserCheck className="h-5 w-5" />} color="purple" />
              <KpiCard label="Toplam Seans" value={m.total_sessions} sub={`${m.completed_sessions} tamamlandı`} icon={<Video className="h-5 w-5" />} color="blue" />
              <KpiCard label="Toplam Gelir" value={`₺${((m.total_successful_revenue || 0) / 100).toLocaleString("tr-TR")}`} sub={`₺${((m.monthly_payment_amount || 0) / 100).toLocaleString("tr-TR")} bu ay`} icon={<DollarSign className="h-5 w-5" />} color="green" />
            </div>
          </div>

          {/* Operasyon KPI */}
          <div>
            <h2 className="text-lg font-semibold mb-3">⚡ Operasyon</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <KpiCard label="Bekleyen Başvuru" value={m.pending_coach_applications || pendingApps.length} icon={<Clock className="h-5 w-5" />} color="red" alert />
              <KpiCard label="Seans Talebi" value={m.pending_session_requests} icon={<Calendar className="h-5 w-5" />} color="orange" alert={m.pending_session_requests > 0} />
              <KpiCard label="Rezervasyon" value={m.total_bookings} sub={`${m.monthly_bookings} bu ay`} icon={<Calendar className="h-5 w-5" />} color="blue" />
              <KpiCard label="Demo Talep" value={m.total_demo_requests} icon={<Building2 className="h-5 w-5" />} color="purple" />
              <KpiCard label="İş İlanı" value={m.total_jobs} sub={`${m.total_job_applications} başvuru`} icon={<Briefcase className="h-5 w-5" />} color="blue" />
              <KpiCard label="Email" value={m.total_emails_sent} icon={<Mail className="h-5 w-5" />} color="gray" />
            </div>
          </div>

          {/* Topluluk KPI */}
          <div>
            <h2 className="text-lg font-semibold mb-3">📱 Topluluk</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <KpiCard label="Post" value={m.total_posts} sub={`+${m.monthly_posts} bu ay`} icon={<MessageSquare className="h-5 w-5" />} color="blue" />
              <KpiCard label="Yorum" value={m.total_comments} icon={<MessageSquare className="h-5 w-5" />} color="green" />
              <KpiCard label="Reaksiyon" value={m.total_reactions} icon={<Heart className="h-5 w-5" />} color="red" />
              <KpiCard label="Takip" value={m.total_follows} icon={<Users className="h-5 w-5" />} color="purple" />
              <KpiCard label="Değerlendirme" value={m.total_reviews} sub={`⭐ ${m.average_rating}`} icon={<Star className="h-5 w-5" />} color="orange" />
              <KpiCard label="Etkinlik" value={m.total_events} icon={<Calendar className="h-5 w-5" />} color="blue" />
            </div>
          </div>

          {/* Son Aktiviteler */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Son Kullanıcılar */}
            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" /> Son Kayıtlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {(recent?.recent_users || users.slice(0, 8)).map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{u.full_name || u.email}</p>
                      <p className="text-xs text-gray-400">{u.role} • {u.user_type}</p>
                    </div>
                    <div className="text-right">
                      {u.is_coach && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Koç</span>}
                      {u.is_premium && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-1">Premium</span>}
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(u.created_at).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Son Koç Başvuruları */}
            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" /> Son Koç Başvuruları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {coachApps.slice(0, 8).map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{a.full_name}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Son Ödemeler */}
            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-600" /> Son Ödemeler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {(recent?.recent_payments || []).length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Henüz ödeme yok</p>
                ) : (
                  recent.recent_payments.slice(0, 8).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">₺{(p.amount / 100).toLocaleString("tr-TR")}</p>
                        <p className="text-xs text-gray-400">{p.provider}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={p.status} />
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(p.created_at).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ KOÇ ONAY MERKEZİ ═══ */}
      {tab === "coaches" && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Sol: Liste */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">
              Bekleyen Başvurular ({pendingApps.length})
            </h2>
            {pendingApps.length === 0 ? (
              <EmptyState text="Bekleyen başvuru yok 🎉" />
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {pendingApps.map((a) => (
                  <Card
                    key={a.id}
                    className={`rounded-xl cursor-pointer transition-all hover:shadow-md p-4 ${
                      selectedApp?.id === a.id ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
                    }`}
                    onClick={() => setSelectedApp(a)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{a.full_name}</p>
                        <p className="text-xs text-gray-500">{a.email}</p>
                        <p className="text-xs text-gray-400">{a.phone} • {a.city}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={a.status} />
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(a.created_at).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Onaylanmış ve Reddedilmiş */}
            <h3 className="text-sm font-semibold text-gray-500 mt-6">
              Son İşlenenler
            </h3>
            {coachApps
              .filter((a) => ["approved", "rejected"].includes(a.status))
              .slice(0, 5)
              .map((a) => (
                <Card key={a.id} className="rounded-xl p-3 opacity-70">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{a.full_name}</p>
                    <StatusBadge status={a.status} />
                  </div>
                </Card>
              ))}
          </div>

          {/* Sağ: Detay */}
          <div className="lg:col-span-3">
            {!selectedApp ? (
              <Card className="rounded-xl p-10 text-center text-gray-400">
                <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Soldan bir başvuru seçin</p>
              </Card>
            ) : (
              <Card className="rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{selectedApp.full_name}</h3>
                  <StatusBadge status={selectedApp.status} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow label="Email" value={selectedApp.email} />
                  <InfoRow label="Telefon" value={selectedApp.phone} />
                  <InfoRow label="Şehir" value={`${selectedApp.city}, ${selectedApp.country}`} />
                  <InfoRow label="Deneyim" value={selectedApp.experience || selectedApp.experience_level} />
                  <InfoRow label="Sertifika" value={selectedApp.certification || selectedApp.certificate_type} />
                  <InfoRow label="Sertifika Yılı" value={selectedApp.certification_year || selectedApp.certificate_year} />
                  <InfoRow label="Seans Ücreti" value={`₺${selectedApp.session_fee || selectedApp.session_price || "—"}`} />
                  <InfoRow label="Uzmanlık" value={
                    Array.isArray(selectedApp.expertise_tags)
                      ? selectedApp.expertise_tags.join(", ")
                      : selectedApp.specializations || "—"
                  } />
                </div>

                {selectedApp.bio && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Biyografi</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApp.bio}</p>
                  </div>
                )}

                {/* Dosyalar */}
                <div className="flex gap-3 flex-wrap">
                  {selectedApp.cv_path && (
                    <a
                      href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${selectedApp.cv_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Download className="h-4 w-4 mr-2" /> CV İndir
                      </Button>
                    </a>
                  )}
                  {selectedApp.certificate_path && (
                    <a
                      href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${selectedApp.certificate_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Download className="h-4 w-4 mr-2" /> Sertifika İndir
                      </Button>
                    </a>
                  )}
                  {selectedApp.linkedin && (
                    <a href={selectedApp.linkedin} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <ExternalLink className="h-4 w-4 mr-2" /> LinkedIn
                      </Button>
                    </a>
                  )}
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => approveCoach(selectedApp.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {actionLoading ? "İşleniyor..." : "Onayla"}
                  </Button>
                  <Button
                    onClick={() => rejectCoach(selectedApp.id)}
                    disabled={actionLoading}
                    variant="destructive"
                    className="flex-1 rounded-lg"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Reddet
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ═══ ŞİRKET ONAY MERKEZİ ═══ */}
      {tab === "companies" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">
              Şirket Talepleri ({pendingCompanies.length} bekleyen)
            </h2>
            {companyReqs.length === 0 ? (
              <EmptyState text="Şirket talebi yok" />
            ) : (
              companyReqs.map((c) => (
                <Card
                  key={c.id}
                  className={`rounded-xl cursor-pointer p-4 hover:shadow-md transition-all ${
                    selectedCompany?.id === c.id ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
                  }`}
                  onClick={() => setSelectedCompany(c)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{c.brand_name || c.legal_name}</p>
                      <p className="text-xs text-gray-400">{c.legal_name}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </Card>
              ))
            )}
          </div>
          <div className="lg:col-span-3">
            {!selectedCompany ? (
              <Card className="rounded-xl p-10 text-center text-gray-400">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Soldan bir şirket seçin</p>
              </Card>
            ) : (
              <Card className="rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{selectedCompany.brand_name || selectedCompany.legal_name}</h3>
                  <StatusBadge status={selectedCompany.status} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow label="Tüzel Ad" value={selectedCompany.legal_name} />
                  <InfoRow label="Marka" value={selectedCompany.brand_name} />
                  <InfoRow label="User ID" value={selectedCompany.user_id} />
                  <InfoRow label="Güncelleme" value={new Date(selectedCompany.updated_at).toLocaleString("tr-TR")} />
                </div>
                {["pending", "pending_review", "new"].includes(selectedCompany.status) && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => approveCompany(selectedCompany.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Onayla
                    </Button>
                    <Button
                      onClick={() => rejectCompany(selectedCompany.id)}
                      disabled={actionLoading}
                      variant="destructive"
                      className="flex-1 rounded-lg"
                    >
                      <UserX className="h-4 w-4 mr-2" /> Reddet
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ═══ KULLANICILAR ═══ */}
      {tab === "users" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Tüm Kullanıcılar ({users.length})</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Kullanıcı</th>
                  <th className="text-left p-3 font-medium text-gray-600">Rol</th>
                  <th className="text-left p-3 font-medium text-gray-600">Tip</th>
                  <th className="text-left p-3 font-medium text-gray-600">Durum</th>
                  <th className="text-left p-3 font-medium text-gray-600">Kayıt</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => {
                    if (!search) return true;
                    const s = search.toLowerCase();
                    return u.full_name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
                  })
                  .map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <p className="font-medium">{u.full_name || "—"}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.role === "admin" ? "bg-red-100 text-red-700" :
                          u.role === "coach" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{u.role || "user"}</span>
                      </td>
                      <td className="p-3 text-xs text-gray-500">{u.user_type || "—"}</td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {u.is_coach && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Koç</span>}
                          {u.is_premium && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Premium</span>}
                          {u.is_verified && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Doğrulanmış</span>}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-gray-400">
                        {new Date(u.created_at).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ GELİR ═══ */}
      {tab === "revenue" && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiCard label="Toplam Gelir" value={`₺${((m.total_successful_revenue || 0) / 100).toLocaleString("tr-TR")}`} icon={<DollarSign className="h-5 w-5" />} color="green" />
            <KpiCard label="Bu Ay" value={`₺${((m.monthly_payment_amount || 0) / 100).toLocaleString("tr-TR")}`} icon={<Calendar className="h-5 w-5" />} color="blue" />
            <KpiCard label="Bugün" value={`₺${((m.today_payment_amount || 0) / 100).toLocaleString("tr-TR")}`} icon={<TrendingUp className="h-5 w-5" />} color="orange" />
            <KpiCard label="Başarılı Ödeme" value={m.successful_payments} sub={`/ ${m.total_payments} toplam`} icon={<CheckCircle2 className="h-5 w-5" />} color="green" />
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            <KpiCard label="Seans Geliri" value={`₺${m.total_session_revenue}`} icon={<Video className="h-5 w-5" />} color="purple" />
            <KpiCard label="Abonelik" value={m.total_subscriptions} icon={<Award className="h-5 w-5" />} color="blue" />
            <KpiCard label="Kurumsal Fatura" value={m.total_corporate_invoices} icon={<Building2 className="h-5 w-5" />} color="gray" />
          </div>
        </div>
      )}

      {/* ═══ TOPLULUK ═══ */}
      {tab === "community" && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <KpiCard label="Post" value={m.total_posts} sub={`+${m.monthly_posts} bu ay`} icon={<MessageSquare className="h-5 w-5" />} color="blue" />
            <KpiCard label="Premium Post" value={m.premium_posts} icon={<Award className="h-5 w-5" />} color="orange" />
            <KpiCard label="Yorum" value={m.total_comments} icon={<MessageSquare className="h-5 w-5" />} color="green" />
            <KpiCard label="Reaksiyon" value={m.total_reactions} icon={<Heart className="h-5 w-5" />} color="red" />
            <KpiCard label="Takip" value={m.total_follows} icon={<Users className="h-5 w-5" />} color="purple" />
            <KpiCard label="Anket" value={m.total_polls} icon={<BarChart3 className="h-5 w-5" />} color="blue" />
            <KpiCard label="Etkinlik" value={m.total_events} icon={<Calendar className="h-5 w-5" />} color="orange" />
            <KpiCard label="Yer İşareti" value={m.total_bookmarks} icon={<BookOpen className="h-5 w-5" />} color="gray" />
            <KpiCard label="Ort. Puan" value={`⭐ ${m.average_rating}`} sub={`${m.total_reviews} değerlendirme`} icon={<Star className="h-5 w-5" />} color="orange" />
            <KpiCard label="Kişilik Testi" value={m.total_personality_tests} icon={<Brain className="h-5 w-5" />} color="purple" />
            <KpiCard label="AI Özet" value={m.total_ai_summaries} icon={<Brain className="h-5 w-5" />} color="blue" />
            <KpiCard label="Email" value={m.total_emails_sent} icon={<Mail className="h-5 w-5" />} color="gray" />
          </div>
        </div>
      )}

      {/* ═══ İŞE ALIM ═══ */}
      {tab === "jobs" && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <KpiCard label="İş İlanı" value={m.total_jobs} icon={<Briefcase className="h-5 w-5" />} color="blue" />
            <KpiCard label="Boosted İlan" value={m.boosted_jobs} icon={<Zap className="h-5 w-5" />} color="orange" />
            <KpiCard label="Başvuru" value={m.total_job_applications} sub={`+${m.monthly_job_applications} bu ay`} icon={<FileText className="h-5 w-5" />} color="purple" />
            <KpiCard label="Mülakat" value={m.total_interviews} sub={`${m.completed_interviews} tamamlandı`} icon={<Video className="h-5 w-5" />} color="blue" />
            <KpiCard label="İşe Alınan" value={m.total_hired} sub={`/ ${m.total_hire_decisions} karar`} icon={<UserCheck className="h-5 w-5" />} color="green" />
            <KpiCard label="Eşleşme" value={m.total_matches} icon={<Heart className="h-5 w-5" />} color="red" />
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ALT BİLEŞENLER
// ═══════════════════════════════════════════════

function KpiCard({ label, value, sub, icon, color = "blue", alert = false }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };
  return (
    <Card className={`rounded-xl border-none shadow-sm p-4 ${alert ? "ring-2 ring-red-200 bg-red-50/30" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${colors[color]}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500 leading-tight truncate">{label}</p>
          <p className="text-xl font-bold mt-0.5">{value ?? 0}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    pending: { bg: "bg-yellow-100 text-yellow-700", label: "⏳ Beklemede" },
    pending_review: { bg: "bg-orange-100 text-orange-700", label: "📋 İncelemede" },
    new: { bg: "bg-blue-100 text-blue-700", label: "🆕 Yeni" },
    approved: { bg: "bg-green-100 text-green-700", label: "✅ Onaylı" },
    rejected: { bg: "bg-red-100 text-red-700", label: "❌ Reddedildi" },
    success: { bg: "bg-green-100 text-green-700", label: "✅ Başarılı" },
    failed: { bg: "bg-red-100 text-red-700", label: "❌ Başarısız" },
    active: { bg: "bg-green-100 text-green-700", label: "🟢 Aktif" },
    completed: { bg: "bg-gray-100 text-gray-700", label: "✔ Tamamlandı" },
  };
  const s = map[status] || { bg: "bg-gray-100 text-gray-600", label: status };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.bg}`}>
      {s.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm">{value || "—"}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="p-8 text-center border-2 border-dashed rounded-xl text-gray-400">
      <p className="font-medium">{text}</p>
    </div>
  );
}
