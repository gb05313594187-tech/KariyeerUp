// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Briefcase, Building2, Hourglass } from "lucide-react";

type AdminMetrics = {
  total_profiles: number;
  total_coaches: number;
  total_company_requests: number;
  pending_coach_apps: number;
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from("admin_overview_metrics")
        .select("*")
        .single();

      if (error) {
        setError(error.message);
      } else {
        setData(data as AdminMetrics);
      }

      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Toplam Kullanıcı"
          value={data.total_profiles}
          icon={<Users />}
        />
        <StatCard
          title="Toplam Koç"
          value={data.total_coaches}
          icon={<Briefcase />}
        />
        <StatCard
          title="Şirket Talepleri"
          value={data.total_company_requests}
          icon={<Building2 />}
        />
        <StatCard
          title="Bekleyen Koç Başvurusu"
          value={data.pending_coach_apps}
          icon={<Hourglass />}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
}) {
  return (
    <div className="rounded-xl border p-4 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-muted">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
