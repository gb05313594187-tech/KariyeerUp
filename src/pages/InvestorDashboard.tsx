// src/pages/InvestorDashboard.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Building2,
  TrendingUp,
  Briefcase,
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
} from "recharts";

export default function InvestorDashboard() {
  const [financial, setFinancial] = useState<any>(null);
  const [saas, setSaas] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [growth, setGrowth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: f } = await supabase.rpc("investor_get_dashboard");
        const { data: s } = await supabase.rpc("investor_get_saas_kpis");
        const { data: e } = await supabase.rpc("enterprise_get_dashboard");
        const { data: g } = await supabase.rpc("investor_get_revenue_growth");

        if (f) setFinancial(f);
        if (s) setSaas(s);
        if (e) setEnterprise(e);

        if (g) {
          setGrowth(
            g.map((x: any) => ({
              month: x.month,
              revenue: (x.revenue ?? 0) / 100,
            }))
          );
        }
      } catch (err) {
        console.error("Investor load error:", err);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return <div className="p-8 text-gray-500">Yükleniyor...</div>;

  return (
    <div className="p-8 space-y-16 max-w-[1500px] mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        Investor Executive Dashboard
      </h1>

      {/* CORE FINANCIALS */}
      <Section title="Financial Overview">
        <div className="grid md:grid-cols-4 gap-4">
          <Kpi label="Users" value={financial?.total_users} icon={<Users />} />
          <Kpi label="Corporate" value={financial?.total_corporate} icon={<Building2 />} />
          <Kpi
            label="Total Revenue"
            value={`₺${((financial?.total_revenue ?? 0) / 100).toLocaleString("tr-TR")}`}
            icon={<DollarSign />}
          />
          <Kpi
            label="Monthly Revenue"
            value={`₺${((financial?.monthly_revenue ?? 0) / 100).toLocaleString("tr-TR")}`}
            icon={<TrendingUp />}
          />
        </div>
      </Section>

      {/* REVENUE GROWTH */}
      <Section title="Revenue Growth">
        {growth.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
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

      {/* SAAS KPIs */}
      <Section title="SaaS KPIs">
        <div className="grid md:grid-cols-4 gap-4">
          <Kpi label="CAC" value={`₺${saas?.cac ?? 0}`} />
          <Kpi label="LTV" value={`₺${saas?.ltv ?? 0}`} />
          <Kpi label="Churn %" value={`${saas?.churn ?? 0}%`} />
          <Kpi label="LTV/CAC" value={saas?.ltv_cac_ratio ?? 0} />
        </div>
      </Section>

      {/* ENTERPRISE ANALYTICS */}
      <Section title="Enterprise Analytics">
        {enterprise ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enterprise.segments ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty />
        )}
      </Section>

    </div>
  );
}

/* COMPONENTS */

function Kpi({ label, value, icon }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            {icon}
          </div>
        )}
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
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

function Empty() {
  return <div className="text-gray-400">Henüz veri yok.</div>;
}
