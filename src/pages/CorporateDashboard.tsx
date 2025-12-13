// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Briefcase, Inbox } from "lucide-react";
import { toast } from "sonner";

const STATUS = ["new", "contacted", "closed"] as const;

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    setRequestsLoading(true);
    setRequestsError(null);

    const { data, error } = await supabase
      .from("company_requests")
      .select(
        "id, company_name, contact_person, email, phone, message, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setRequests([]);
      setRequestsError(error.message || "company_requests okunamadı.");
      setRequestsLoading(false);
      return;
    }

    setRequests(data || []);
    setRequestsLoading(false);
  };

  const updateStatus = async (
    id: string,
    nextStatus: (typeof STATUS)[number]
  ) => {
    const prev = requests;

    // optimistik güncelleme
    setRequests((cur) =>
      cur.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    // ✅ RLS/policy update'i reddederse "0 satır" dönebilir.
    // Bu yüzden .select ile gerçekten update oldu mu kontrol ediyoruz.
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

    // İstersen güncel listeyi DB'den tekrar çek (opsiyonel ama sağlam)
    // await fetchRequests();
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        setMe(data?.user || null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!loading) fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-white/90">Corporate Panel</p>
            <h1 className="text-2xl font-bold text-white">Şirket Paneli</h1>
            <p className="text-xs text-white/85 mt-1">
              Kullanıcı:{" "}
              <span className="text-yellow-200">{me?.email || "-"}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white/15 text-white hover:bg-white/20 border border-white/20"
              onClick={fetchRequests}
              disabled={requestsLoading}
            >
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
        {/* TOP CARDS */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Inbox className="w-4 h-4 text-orange-600" /> Talepler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Son 50 talep listelenir.
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

        {/* REQUESTS LIST */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" /> company_requests
            </CardTitle>
            <div className="text-xs text-slate-500">
              {requestsLoading ? "Yükleniyor..." : `${requests.length} kayıt`}
            </div>
          </CardHeader>

          <CardContent className="text-sm text-slate-700">
            {requestsError && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                <div className="font-semibold">Okuma hatası</div>
                <div className="text-xs mt-1">{requestsError}</div>
              </div>
            )}

            {!requestsError && requestsLoading && (
              <div className="py-4">Talepler getiriliyor...</div>
            )}

            {!requestsError && !requestsLoading && requests.length === 0 && (
              <div className="py-4 text-slate-500">Kayıt yok.</div>
            )}

            {!requestsError && !requestsLoading && requests.length > 0 && (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 p-4 bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900">
                        {r.company_name || "-"}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50">
                          {r.status || "new"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div>
                        Yetkili:{" "}
                        <span className="text-slate-800">
                          {r.contact_person || "-"}
                        </span>
                      </div>
                      <div>
                        Email:{" "}
                        <span className="text-slate-800">{r.email || "-"}</span>
                        {"  "}• Tel:{" "}
                        <span className="text-slate-800">{r.phone || "-"}</span>
                      </div>

                      {r.message && (
                        <div className="pt-2 text-sm text-slate-700">
                          {r.message}
                        </div>
                      )}

                      {/* STATUS BUTTONS */}
                      <div className="pt-3 flex flex-wrap gap-2">
                        {STATUS.map((s) => {
                          const active = (r.status || "new") === s;
                          return (
                            <Button
                              key={s}
                              size="sm"
                              variant={active ? "default" : "outline"}
                              className={
                                active
                                  ? "bg-orange-600 hover:bg-orange-500"
                                  : "border-slate-200"
                              }
                              onClick={() => updateStatus(r.id, s)}
                              disabled={requestsLoading}
                            >
                              {s}
                            </Button>
                          );
                        })}
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400 font-mono">
                        id: {r.id}
                      </div>
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
