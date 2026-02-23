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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);
  const [growth, setGrowth] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [recurring, setRecurring] = useState<any>(null);
  const [burn, setBurn] = useState<any>(null);
  const [multiple, setMultiple] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: dashboardData } =
        await supabase.rpc("investor_get_dashboard");

      const { data: growthData } =
        await supabase.rpc("investor_get_revenue_growth");

      const { data: breakdownData } =
        await supabase.rpc("investor_get_revenue_breakdown");

      const { data: recurringData } =
        await supabase.rpc("investor_get_recurring_metrics");

      const { data: burnData } =
        await supabase.rpc("investor_get_burn");

      if (dashboardData) setData(dashboardData);

      if (growthData) {
        setGrowth(
          growthData.map((g: any) => ({
            month: g.month,
            revenue: (g.revenue ?? 0) / 100,
          }))
        );
      }

      if (breakdownData) {
        setBreakdown({
          coaching: (breakdownData.coaching ?? 0) / 100,
          corporate: (breakdownData.corporate ?? 0) / 100,
          boost: (breakdownData.boost ?? 0) / 100,
        });
      }

      if (recurringData) {
        setRecurring({
          mrr: (recurringData.mrr ?? 0) / 100,
          arr: (recurringData.arr ?? 0) / 100,
        });
      }

      if (burnData) {
        setBurn({
          monthly: burnData.monthly_burn ?? 0,
          runway: burnData.runway_months ?? 0,
        });
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  const valuation = (recurring?.arr ?? 0) * multiple;

  return (
    <div className="p-6 space-y-12 max-w-[1500px] mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        Investor Super Dashboard
      </h1>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard icon={<Users />} label="Toplam Kullanıcı" value={data?.total_users} />
        <KpiCard icon={<Building2 />} label="Corporate" value={data?.total_corporate} />
        <KpiCard icon={<Users />} label="Koç" value={data?.total_coaches} />
        <KpiCard
          icon={<DollarSign />}
          label="Toplam Gelir"
          value={`₺${((data?.total_revenue ?? 0) / 100).toLocaleString("tr-TR")}`}
        />
        <KpiCard
          icon={<DollarSign />}
          label="Bu Ay Gelir"
          value={`₺${((data?.monthly_revenue ?? 0) / 100).toLocaleString("tr-TR")}`}
        />
        <KpiCard
          icon={<CreditCard />}
          label="Ödeme"
          value={`${data?.successful_payments ?? 0}/${data?.total_payments ?? 0}`}
        />
      </div>

      {/* REVENUE GROWTH */}
      <Section title="Revenue Growth (12 Ay)">
        {growth.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Section>

      {/* REVENUE BREAKDOWN */}
      <Section title="Revenue Breakdown">
        {breakdown ? (
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: "Coaching", value: breakdown.coaching },
                { name: "Corporate", value: breakdown.corporate },
                { name: "Boost", value: breakdown.boost },
              ]}
              dataKey="value"
              outerRadius={100}
              label
            >
              <Cell fill="#16a34a" />
              <Cell fill="#2563eb" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <Empty />
        )}
      </Section>

      {/* MRR + ARR */}
      <div className="grid md:grid-cols-2 gap-6">
        <KpiCard
          icon={<DollarSign />}
          label="MRR"
          value={`₺${recurring?.mrr?.toLocaleString("tr-TR") ?? 0}`}
        />
        <KpiCard
          icon={<TrendingUp />}
          label="ARR"
          value={`₺${recurring?.arr?.toLocaleString("tr-TR") ?? 0}`}
        />
      </div>

      {/* VALUATION */}
      <Section title="Valuation Estimator (ARR × Multiple)">
        <div className="space-y-4">
          <input
            type="number"
            value={multiple}
            onChange={(e) => setMultiple(Number(e.target.value))}
            className="border p-2 rounded w-32"
          />
          <p className="text-3xl font-bold text-green-600">
            ₺{valuation.toLocaleString("tr-TR")}
          </p>
        </div>
      </Section>

      {/* BURN & RUNWAY */}
      <Section title="Burn & Runway">
        <p>Aylık Gider: ₺{burn?.monthly?.toLocaleString("tr-TR") ?? 0}</p>
        <p className="text-xl font-bold">
          Runway: {burn?.runway?.toFixed(1) ?? 0} Ay
        </p>
      </Section>

    </div>
  );
}

/* COMPONENTS */

function KpiCard({ icon, label, value }: any) {
  return (
    <Card>
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

function Section({ title, children }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

function Empty() {
  return <div className="text-gray-400">Henüz veri yok.</div>;
}
