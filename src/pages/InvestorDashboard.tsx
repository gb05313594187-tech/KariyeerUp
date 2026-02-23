// src/pages/InvestorDashboard.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  CreditCard,
  Building2,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);
  const [growth, setGrowth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestor = async () => {
      const { data: dashboardData, error } =
        await supabase.rpc("investor_get_dashboard");

      const { data: growthData } =
        await supabase.rpc("investor_get_revenue_growth");

      if (error) {
        console.error("Investor RPC error:", error);
      }

      if (dashboardData) {
        setData(dashboardData);
      }

      if (growthData) {
        setGrowth(
          growthData.map((g: any) => ({
            month: g.month,
            revenue: (g.revenue ?? 0) / 100, // kuruş → TL
          }))
        );
      }

      setLoading(false);
    };

    fetchInvestor();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  if (!data)
    return (
      <div className="p-6 text-red-500">
        Veri alınamadı. RPC kontrol edin.
      </div>
    );

  return (
    <div className="p-6 space-y-10 max-w-[1400px] mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        Investor Super Dashboard
      </h1>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Toplam Kullanıcı"
          value={data.total_users}
        />

        <KpiCard
          icon={<Building2 className="h-5 w-5" />}
          label="Toplam Corporate"
          value={data.total_corporate}
        />

        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Toplam Koç"
          value={data.total_coaches}
        />

        <KpiCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Toplam Gelir"
          value={`₺${((data.total_revenue ?? 0) / 100).toLocaleString("tr-TR")}`}
        />

        <KpiCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Bu Ay Gelir"
          value={`₺${((data.monthly_revenue ?? 0) / 100).toLocaleString("tr-TR")}`}
        />

        <KpiCard
          icon={<CreditCard className="h-5 w-5" />}
          label="Başarılı Ödeme"
          value={`${data.successful_payments ?? 0} / ${data.total_payments ?? 0}`}
        />
      </div>

      {/* REVENUE GROWTH CHART */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6">
            Revenue Growth (Last 12 Months)
          </h2>

          {growth.length === 0 ? (
            <div className="text-gray-400">
              Henüz revenue verisi yok.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

/* KPI COMPONENT */
function KpiCard({ icon, label, value }: any) {
  return (
    <Card className="rounded-xl shadow-sm border-none">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value ?? 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}
