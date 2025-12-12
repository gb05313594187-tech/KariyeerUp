// src/pages/UserSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function UserSettings() {
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem("kariyeer_user");
    window.location.href = "/";
  };

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
          <p className="text-xs text-white/90">User Settings</p>
          <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
          <p className="text-xs text-white/85 mt-1">Şimdilik temel ayarlar (demo).</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-600" /> Hesap
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-3">
            <div>Email: <span className="font-medium">{me?.email || "-"}</span></div>

            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200" onClick={() => (window.location.href = "/user/dashboard")}>
                Dashboard
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={logout}>
                Çıkış Yap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
