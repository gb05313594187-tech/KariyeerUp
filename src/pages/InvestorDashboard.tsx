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
  Briefcase,
  Brain,
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
  BarChart,
  Bar,
} from "recharts";

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);
  const [growth, setGrowth] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [recurring, setRecurring] = useState<any>(null);
  const [burn, setBurn] = useState<any>(null);

  const [enterprise, setEnterprise] = useState<any>(null);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [cohort, setCohort] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any[]>([]);

  const [multiple, setMultiple] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: dashboardData } = await supabase.rpc("investor_get_dashboard");
      const { data: growthData } = await supabase.rpc("investor_get_revenue_growth");
      const { data: breakdownData } = await supabase.rpc("investor_get_revenue_breakdown");
      const { data: recurringData } = await supabase.rpc("investor_get_recurring_metrics");
      const { data: burnData } = await supabase.rpc("investor_get_burn");

      const { data: enterpriseData } = await supabase.rpc("enterprise_get_dashboard");
      const { data: funnelData } = await supabase.rpc("investor_get_hiring_funnel");
      const { data: cohortData } = await supabase.rpc("investor_get_corporate_cohort");
      const { data: predictionData } = await supabase.rpc("investor_get_revenue_prediction");

      if (dashboardData) setData(dashboardData);

      if (growthData)
        setGrowth(growthData.map((g: any) => ({
          month: g.month,
          revenue: (g.revenue ?? 0) / 100,
        })));

      if (breakdownData)
        setBreakdown({
          coaching: (breakdownData.coaching ?? 0) / 100,
          corporate: (breakdownData.corporate ?? 0) / 100,
          boost: (breakdownData.boost ?? 0) / 100,
        });

      if (recurringData)
        setRecurring({
          mrr: (recurringData.mrr ?? 0) / 100,
          arr: (recurringData.arr ?? 0) / 100,
        });

      if (burnData)
        setBurn({
          monthly: burnData.monthly_burn ?? 0,
          runway: burnData.runway_months ?? 0,
        });

      if (enterpriseData) setEnterprise(enterpriseData);
      if (funnelData) setFunnel(funnelData);
      if (cohortData) setCohort(cohortData);
      if (predictionData)
        setPrediction(predictionData.map((p: any) => ({
          month: p.month,
          predicted: (p.predicted ?? 0) / 100,
        })));

      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  const valuation = (recurring?.arr ?? 0) * multiple;

  return (
    <div className="p-6 space-y-16 max-w-[1600px] mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        Enterprise Investor Dashboard
      </h1>

      {/* ================= CORE KPI ================= */}
      <Section title="Core Financials">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Users />} label="Users" value={data?.total_users} />
          <KpiCard icon={<Building2 />} label="Corporate" value={data?.total_corporate} />
          <KpiCard icon={<DollarSign />} label="MRR" value={`₺${recurring?.mrr?.toLocaleString("tr-TR") ?? 0}`} />
          <KpiCard icon={<TrendingUp />} label="ARR" value={`₺${recurring?.arr?.toLocaleString("tr-TR") ?? 0}`} />
        </div>
      </Section>

      {/* ================= REVENUE GROWTH ================= */}
      <Section title="Revenue Growth">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* ================= PREDICTIVE REVENUE ================= */}
      <Section title="AI Revenue Prediction">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prediction}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* ================= HIRING FUNNEL ================= */}
      <Section title="Hiring Funnel Analytics">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* ================= CORPORATE COHORT ================= */}
      <Section title="Corporate Revenue Cohort">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cohort}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* ================= VALUATION ================= */}
      <Section title="Valuation Estimator">
        <input
          type="number"
          value={multiple}
          onChange={(e) => setMultiple(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />
        <p className="text-3xl font-bold text-green-600 mt-4">
          ₺{valuation.toLocaleString("tr-TR")}
        </p>
      </Section>

      {/* ================= BURN ================= */}
      <Section title="Burn & Runway">
        <p>Aylık Burn: ₺{burn?.monthly?.toLocaleString("tr-TR") ?? 0}</p>
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
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}
