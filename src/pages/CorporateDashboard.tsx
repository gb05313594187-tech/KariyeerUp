// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Briefcase } from "lucide-react";

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        setMe(data?.user || null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-xs text-white/90">Corporate Panel</p>
          <h1 className="text-2xl font-bold text-white">Şirket Paneli</h1>
          <p className="text-xs text-white/85 mt-1">
            Kullanıcı: <span className="text-yellow-200">{me?.email || "-"}</span>
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-600" /> Talepler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Şimdilik demo. Sonraki adım: `company_requests` tablosu ile bağlamak.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" /> Koç Havuzu
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Aktif koçlara hızlı erişim (demo).
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-600" /> Demo Planları
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Kurumsal demo / teklif akışı (demo).
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button className="bg-orange-600 hover:bg-orange-500" onClick={() => (window.location.href = "/corporate/profile")}>
            Profil
          </Button>
          <Button variant="outline" className="border-slate-200" onClick={() => (window.location.href = "/corporate/settings")}>
            Ayarlar
          </Button>
        </div>
      </div>
    </div>
  );
}
