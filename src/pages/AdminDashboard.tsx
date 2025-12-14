// src/pages/AdminDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

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

      // ✅ COACH APPLICATIONS (son 5)
      const coachRes = await supabase
        .from("coach_applications")
        .select("id, full_name, email, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5);

      // ✅ COMPANY REQUESTS (son 5) - kolonlar DB ile bire bir uyumlu
      const companyRes = await supabase
        .from("company_requests")
        .select("id, company_name, contact_person, email, phone, created_at", {
          count: "exact",
        })
        .order("created_at", { ascending: false })
        .limit(5);

      // Debug (gerekirse console’dan kontrol edersin)
      console.log("SUPABASE URL:", supabaseUrl);
      console.log("ADMIN coach_applications:", coachRes);
      console.log("ADMIN company_requests:", companyRes);

      if (coachRes?.error || companyRes?.error) {
        setErrorText(
          coachRes?.error?.message ||
            companyRes?.error?.message ||
            "Bilinmeyen hata"
        );
      }

      setCoachCount(coachRes?.count || 0);
      setCompanyCount(companyRes?.count || 0);

      setLatestCoachApps(coachRes?.data || []);
      setLatestCompanyReqs(companyRes?.data || []);

      setLoading(false);
    };

    run();
  }, [supabaseUrl]);

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
                <span className="text-gray-500">
                  {x.created_at ? new Date(x.created_at).toLocaleString() : ""}
                </span>
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
                <span className="text-gray-500">
                  {x.created_at ? new Date(x.created_at).toLocaleString() : ""}
                </span>
              </div>
            ))}

            {!loading && latestCompanyReqs.length === 0 && (
              <div className="text-sm text-gray-500">Henüz talep yok.</div>
            )}
          </div>

          {/* küçük detay satırı (istersen kaldır) */}
          {!loading && latestCompanyReqs.length > 0 && (
            <div className="mt-4 text-xs text-gray-500">
              İlk kayıt:{" "}
              {latestCompanyReqs[0]?.contact_person
                ? `${latestCompanyReqs[0].contact_person} • ${latestCompanyReqs[0].email || ""}`
                : latestCompanyReqs[0]?.email || ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
