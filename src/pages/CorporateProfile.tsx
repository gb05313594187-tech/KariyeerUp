// src/pages/CorporateProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function CorporateProfile() {
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
          <p className="text-xs text-white/90">Corporate Profile</p>
          <h1 className="text-2xl font-bold text-white">Şirket Profili</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" /> Hesap Bilgisi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <div>Email: <span className="font-medium">{me?.email || "-"}</span></div>
            <div>User ID: <span className="font-mono text-xs">{me?.id || "-"}</span></div>

            <div className="pt-3 flex gap-2">
              <Button variant="outline" className="border-slate-200" onClick={() => (window.location.href = "/corporate/dashboard")}>
                Dashboard
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-500" onClick={() => (window.location.href = "/corporate/settings")}>
                Ayarlar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
