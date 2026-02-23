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

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestor = async () => {
      const { data, error } = await supabase.rpc(
        "investor_get_dashboard"
      );

      if (error) {
        console.error("Investor RPC error:", error);
      } else {
        setData(data);
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
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-green-600" />
        Investor Dashboard
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
          value={`₺${((data.total_revenue ?? 0) / 100).toLocaleString(
            "tr-TR"
          )}`}
        />

        <KpiCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Bu Ay Gelir"
          value={`₺${((data.monthly_revenue ?? 0) / 100).toLocaleString(
            "tr-TR"
          )}`}
        />

        <KpiCard
          icon={<CreditCard className="h-5 w-5" />}
          label="Başarılı Ödeme"
          value={`${data.successful_payments} / ${data.total_payments}`}
        />
      </div>
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
