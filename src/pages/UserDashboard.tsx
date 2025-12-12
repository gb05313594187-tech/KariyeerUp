// src/pages/UserDashboard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CalendarDays, Wallet } from "lucide-react";

export default function UserDashboard() {
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
          <p className="text-xs text-white/90">User Panel</p>
          <h1 className="text-2xl font-bold text-white">
            Hoş geldin, <span className="text-yellow-200">{me?.email?.split("@")?.[0] || "Kullanıcı"}</span>
          </h1>
          <p className="text-xs text-white/85 mt-1">
            Buradan seanslarını, ödemelerini ve profilini yönetebilirsin.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" /> Hesap
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              <div>Email: <span className="font-medium">{me?.email || "-"}</span></div>
              <div>ID: <span className="font-mono text-xs">{me?.id || "-"}</span></div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-orange-600" /> Seanslar
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Şimdilik demo. Sonraki adım: `sessions` tablosundan user’a göre listeleme.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-orange-600" /> Ödemeler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Şimdilik demo. Sonraki adım: ödeme/abonelik tabloları.
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button className="bg-orange-600 hover:bg-orange-500" onClick={() => (window.location.href = "/user/profile")}>
            Profile Git
          </Button>
          <Button variant="outline" className="border-slate-200" onClick={() => (window.location.href = "/user/settings")}>
            Ayarlara Git
          </Button>
        </div>
      </div>
    </div>
  );
}
