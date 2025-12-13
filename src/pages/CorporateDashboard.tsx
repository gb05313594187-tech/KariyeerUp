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

  // 🔹 SADECE KENDİ TALEPLERİNİ ÇEK
  const fetchRequests = async (userId: string) => {
    setRequestsLoading(true);
    setRequestsError(null);

    const { data, error } = await supabase
      .from("company_requests")
      .select(
        "id, company_name, contact_person, email, phone, message, status, created_at"
      )
      .eq("user_id", userId) // ✅ KRİTİK FİLTRE
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

  // 🔹 LOGIN KULLANICIYI AL
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        setMe(data?.user || null);

        if (data?.user?.id) {
          await fetchRequests(data.user.id);
        }
      } finally {
        setLoading(false);
      }
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
              onClick={() => fetchRequests(me.id)}
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Inbox className="w-4 h-4 text-orange-600" /> Talepler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Son 50 talep listelenir.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" /> Koç Havuzu
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Aktif koçlara hızlı erişim (demo).
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-600" /> Demo Planları
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Kurumsal demo / teklif akışı (demo).
            </CardContent>
          </Card>
        </div>

        {/* REQUESTS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" /> Demo Talepleri
            </CardTitle>
            <div className="text-xs text-slate-500">
              {requestsLoading ? "Yükleniyor..." : `${requests.length} kayıt`}
            </div>
          </CardHeader>

          <CardContent className="text-sm">
            {requestsError && (
              <div className="p-3 border border-red-200 bg-red-50 text-red-700 rounded">
                {requestsError}
              </div>
            )}

            {!requestsError && !requestsLoading && requests.length === 0 && (
              <div className="py-4 text-slate-500">Henüz talep yok.</div>
            )}

            {!requestsError &&
              !requestsLoading &&
              requests.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-xl p-4 mb-3 bg-white"
                >
                  <div className="flex justify-between">
                    <div className="font-semibold">{r.company_name}</div>
                    <span className="text-xs">{r.status}</span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    {r.contact_person} • {r.email} • {r.phone}
                  </div>

                  {r.message && (
                    <div className="mt-2 text-sm">{r.message}</div>
                  )}

                  <div className="mt-3 flex gap-2">
                    {STATUS.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={r.status === s ? "default" : "outline"}
                        onClick={() => updateStatus(r.id, s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
