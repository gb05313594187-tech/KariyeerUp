// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Briefcase,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
  Search,
} from "lucide-react";

const REQUESTS_TABLE = "company_requests";

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  const [reqLoading, setReqLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [reqError, setReqError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const fetchMe = async () => {
    const { data } = await supabase.auth.getUser();
    setMe(data?.user || null);
  };

  const fetchRequests = async () => {
    setReqLoading(true);
    setReqError(null);

    try {
      const { data, error } = await supabase
        .from(REQUESTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) {
        console.error("company_requests fetch error:", error);
        setRequests([]);
        setReqError(
          error?.message ||
            "Talepler alınamadı. (RLS/policy veya tablo adı kontrol edin.)"
        );
        return;
      }

      setRequests(data || []);
    } catch (e: any) {
      console.error("company_requests fetch unexpected:", e);
      setRequests([]);
      setReqError("Beklenmeyen hata oluştu.");
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchMe();
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    // kullanıcı yüklenince talepleri çek
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return requests;

    return (requests || []).filter((r) => {
      const hay = [
        r.company_name,
        r.contact_person,
        r.email,
        r.phone,
        r.message,
        r.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [requests, search]);

  const totalRequests = requests?.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-xs text-white/90">Corporate Panel</p>
          <h1 className="text-2xl font-bold text-white">Şirket Paneli</h1>
          <p className="text-xs text-white/85 mt-1">
            Kullanıcı:{" "}
            <span className="text-yellow-200">{me?.email || "-"}</span>
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-600" /> Talepler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500 text-xs">Toplam</span>
                <span className="text-2xl font-semibold text-slate-900">
                  {totalRequests}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Kaynak: <span className="font-mono">{REQUESTS_TABLE}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" /> Koç Havuzu
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Aktif koçlara hızlı erişim (demo).
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-600" /> Demo Planları
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Kurumsal demo / teklif akışı (demo).
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div className="flex gap-2">
            <Button
              className="bg-orange-600 hover:bg-orange-500"
              onClick={() => (window.location.href = "/corporate/profile")}
            >
              Profil
            </Button>
            <Button
              variant="outline"
              className="border-slate-200"
              onClick={() => (window.location.href = "/corporate/settings")}
            >
              Ayarlar
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Talep ara (şirket, kişi, email, mesaj...)"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              />
            </div>

            <Button
              variant="outline"
              className="border-slate-200"
              onClick={async () => {
                await fetchRequests();
                toast.success("Talepler yenilendi.");
              }}
              disabled={reqLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
          </div>
        </div>

        {/* TALEP LİSTESİ */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" /> Kurumsal Talepler
            </CardTitle>
            <p className="text-xs text-slate-500">
              Gösterilen: {filtered.length} / {totalRequests}
            </p>
          </CardHeader>

          <CardContent>
            {reqLoading && (
              <div className="py-10 text-center text-sm text-slate-600">
                Talepler yükleniyor...
              </div>
            )}

            {!reqLoading && reqError && (
              <div className="py-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4">
                <div className="font-semibold mb-1">Talepler çekilemedi</div>
                <div className="text-[13px]">{reqError}</div>
                <div className="text-[12px] text-red-600/90 mt-2">
                  Not: Eğer RLS açıksa, corporate kullanıcılarının bu tabloyu
                  okuyabilmesi için policy gerekir.
                </div>
              </div>
            )}

            {!reqLoading && !reqError && filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-600">
                Henüz talep yok.
              </div>
            )}

            {!reqLoading && !reqError && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map((r) => (
                  <div
                    key={r.id || `${r.email}-${r.created_at}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {r.company_name || "Şirket"}
                          </p>
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                            {r.source || "unknown-source"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600">
                          Yetkili:{" "}
                          <span className="font-medium text-slate-800">
                            {r.contact_person || "-"}
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-600 mt-1">
                          {r.email && (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {r.email}
                            </span>
                          )}
                          {r.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {r.phone}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatDateTime(r.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <p className="text-[11px] text-slate-500">ID</p>
                        <p className="text-[12px] font-mono text-slate-700">
                          {String(r.id || "-")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">
                      {r.message ? r.message : "Mesaj yok."}
                    </div>
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
