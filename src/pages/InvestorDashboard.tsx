// src/pages/InvestorDashboard.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Building2,
  TrendingUp,
  Activity,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function InvestorDashboard() {
  const [saas, setSaas] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [usage, setUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: saasData } =
        await supabase.rpc("investor_get_saas_kpis");

      const { data: enterpriseData } =
        await supabase.rpc("enterprise_get_deep_analytics");

      const { data: segmentData } =
        await supabase.rpc("enterprise_get_revenue_by_segment");

      const { data: usageData } =
        await supabase.rpc("enterprise_get_usage_metrics");

      if (saasData)
        setSaas({
          cac: (saasData.cac ?? 0) / 100,
          ltv: (saasData.ltv ?? 0) / 100,
          churn: saasData.churn_rate ?? 0,
        });

      if (enterpriseData)
        setEnterprise({
          acv: (enterpriseData.avg_contract_value ?? 0) / 100,
          active: enterpriseData.active_enterprises ?? 0,
          expansion: (enterpriseData.expansion_revenue ?? 0) / 100,
        });

      if (segmentData)
        setSegments(
          segmentData.map((s: any) => ({
            segment: s.segment,
            revenue: (s.revenue ?? 0) / 100,
          }))
        );

      if (usageData) setUsage(usageData);

      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  const ltvCacRatio =
    saas?.cac > 0 ? (saas.ltv / saas.cac).toFixed(2) : 0;

  return (
    <div className="p-6 space-y-16 max-w-[1600px] mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        SaaS KPI & Enterprise Deep Analytics
      </h1>

      {/* ================= SaaS KPI ================= */}
      <Section title="SaaS Core Metrics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<DollarSign />} label="CAC" value={`₺${saas?.cac?.toLocaleString("tr-TR") ?? 0}`} />
          <KpiCard icon={<DollarSign />} label="LTV" value={`₺${saas?.ltv?.toLocaleString("tr-TR") ?? 0}`} />
          <KpiCard icon={<Activity />} label="Churn Rate" value={`${saas?.churn ?? 0}%`} />
          <KpiCard icon={<TrendingUp />} label="LTV / CAC" value={ltvCacRatio} />
        </div>
      </Section>

      {/* ================= Enterprise KPIs ================= */}
      <Section title="Enterprise KPIs">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <KpiCard icon={<Building2 />} label="Active Enterprises" value={enterprise?.active} />
          <KpiCard icon={<DollarSign />} label="Avg Contract Value (ACV)" value={`₺${enterprise?.acv?.toLocaleString("tr-TR") ?? 0}`} />
          <KpiCard icon={<TrendingUp />} label="Expansion Revenue" value={`₺${enterprise?.expansion?.toLocaleString("tr-TR") ?? 0}`} />
        </div>
      </Section>

      {/* ================= Revenue by Segment ================= */}
      <Section title="Enterprise Revenue by Segment">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={segments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* ================= Usage Analytics ================= */}
      <Section title="Enterprise Usage Growth">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="usage" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* ================= Cohort Pie (Optional Visual Upgrade) ================= */}
      <Section title="Revenue Segment Distribution">
        <PieChart width={400} height={300}>
          <Pie
            data={segments}
            dataKey="revenue"
            nameKey="segment"
            outerRadius={100}
            label
          >
            {segments.map((_, index) => (
              <Cell
                key={index}
                fill={["#16a34a", "#2563eb", "#f59e0b", "#6366f1"][index % 4]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
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
