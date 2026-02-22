// src/pages/InvestorDashboard.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("enterprise_master_dashboard")
        .select("*")
        .single();

      if (!error) setData(data);
    };

    fetchData();
  }, []);

  if (!data) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Investor Super Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p>Toplam Kullanıcı</p>
            <h2 className="text-2xl font-bold">{data.total_users}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Toplam Gelir</p>
            <h2 className="text-2xl font-bold">
              ₺{data.total_revenue}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Hire Conversion</p>
            <h2 className="text-2xl font-bold">
              %{data.hire_conversion_percent}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Boost Geliri</p>
            <h2 className="text-2xl font-bold">
              ₺{data.total_boost_revenue}
            </h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
