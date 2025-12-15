// src/pages/AdminDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  // view: admin_overview_metrics
  const [overview, setOverview] = useState<any>(null);

  // tablolardan son kayıtlar + count
  const [coachCount, setCoachCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [latestCoachApps, setLatestCoachApps] = useState<any[]>([]);
  const [latestCompanyReqs, setLatestCompanyReqs] = useState<any[]>([]);

  const [errorText, setErrorText] = useState<string | null>(null);

  const supabaseUrl = useMemo(() => {
    try {
      return import.meta.env.VITE_SUPABASE_URL || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrorText(null);

      // 1) Admin KPI view
      const overviewRes = await supabase
        .from("admin_overview_metrics")
        .select("*")
        .single();

      // 2) Koç başvuruları (son 5)
      const coachRes = await supabase
        .from("coach_applications")
        .select("id, full_name, email, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5);

      // 3) Kurumsal talepler (son 5)
      const companyRes = await supabase
        .from("company_requests")
        .select("id, company_name, contact_person, email, phone, created_at", {
          count: "exact",
        })
        .order("created_at", { ascending: false })
        .limit(5);

      // Debug
      console.log("SUPABASE URL:", supabaseUrl);
      console.log("ADMIN admin_overview_metrics:", overviewRes);
      console.log("ADMIN coach_applications:", coachRes);
      console.log("ADMIN company_requests:", companyRes);

      const anyError =
        overviewRes?.error || coachRes?.error || companyRes?.error;

      if (anyError) {
        setErrorText(
          overviewRes?.error?.message ||
            coachRes?.error?.message ||
            companyRes?.error?.message ||
            "Bilinmeyen hata"
        );
      }

      setOverview(overviewRes?.data || null);

      setCoachCount(coachRes?.count || 0);
      setCompanyCount(companyRes?.count || 0);

      setLatestCoachApps(coachRes?.data || []);
      setLatestCompanyReqs(companyRes?.data || []);

      setLoading(false);
    };

    run();
  }, [supabaseUrl]);

  const fmtDate = (v: any) => {
    try {
      return v ? new Date(v).toLocaleString() : "";
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Sadece admin erişebilir.</p>

        {errorText && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorText} (Console / Network kontrol et)
          </div>
        )}
      </div>

      {/* KPI ÖZET */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Toplam Kullanıcı"
          value={loading ? "…" : overview?.total_users ?? 0}
        />
        <KpiCard
          title="Toplam Koç"
          value={loading ? "…" : overview?.total_coaches ?? 0}
        />
        <KpiCard
          title="Toplam Şirket"
          value={loading ? "…" : overview?.total_companies ?? 0}
        />
        <KpiCard
          title="Toplam Admin"
          value={loading ? "…" : overview?.total_admins ?? 0}
        />

        <KpiCard
          title="Aktif Koç (30g)"
          value={loading ? "…" : overview?.active_coaches_30d ?? 0}
        />
        <KpiCard
          title="Seans (30g)"
          value={loading ? "…" : overview?.sessions_30d_total ?? 0}
        />
        <KpiCard
          title="Tamamlanan (30g)"
          value={loading ? "…" : overview?.sessions_30d_completed ?? 0}
        />
        <KpiCard
          title="İptal (30g)"
          value={loading ? "…" : overview?.sessions_30d_cancelled ?? 0}
        />

        <div className="col-span-2 md:col-span-4 text-xs text-gray-500">
          Son hesaplama: {loading ? "…" : fmtDate(overview?.computed_at)}
        </div>
      </div>

      {/* LİSTELER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KOÇ BAŞVURULARI */}
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">Koç Başvuruları</div>
          <div className="mt-2 text-4xl font-bold">
            {loading ? "…" : coachCount}
          </div>

          <div className="mt-4 space-y-2">
            {latestCoachApps.map((x) => (
              <div
                key={x.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">
                  {x.full_name || x.email || "Başvuru"}
                </span>
                <span className="text-gray-500">{fmtDate(x.created_at)}</span>
              </div>
            ))}

            {!loading && latestCoachApps.length === 0 && (
              <div className="text-sm text-gray-500">Henüz başvuru yok.</div>
            )}
          </div>
        </div>

        {/* KURUMSAL TALEPLER */}
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">Kurumsal Talepler</div>
          <div className="mt-2 text-4xl font-bold">
            {loading ? "…" : companyCount}
          </div>

          <div className="mt-4 space-y-2">
            {latestCompanyReqs.map((x) => (
              <div
                key={x.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">
                  {x.company_name || x.email || "Talep"}
                </span>
                <span className="text-gray-500">{fmtDate(x.created_at)}</span>
              </div>
            ))}

            {!loading && latestCompanyReqs.length === 0 && (
              <div className="text-sm text-gray-500">Henüz talep yok.</div>
            )}
          </div>

          {!loading && latestCompanyReqs.length > 0 && (
            <div className="mt-4 text-xs text-gray-500">
              İlk kayıt:{" "}
              {latestCompanyReqs[0]?.contact_person
                ? `${latestCompanyReqs[0].contact_person} • ${
                    latestCompanyReqs[0].email || ""
                  }`
                : latestCompanyReqs[0]?.email || ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
