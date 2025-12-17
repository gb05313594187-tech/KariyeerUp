// src/pages/CorporateSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

export default function CorporateSettings() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  // demo ayarlar
  const [emailNotif, setEmailNotif] = useState(true);
  const [productNotif, setProductNotif] = useState(true);

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("kariyeer_user");
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      toast.error("Çıkış yapılamadı.");
    }
  };

  const saveSettings = () => {
    toast.success("Ayarlar kaydedildi (demo).");
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
          <p className="text-xs text-white/90">Corporate Settings</p>
          <h1 className="text-2xl font-bold text-white">Şirket Ayarları</h1>
          <p className="text-xs text-white/85 mt-1">
            Kullanıcı: <span className="text-yellow-200">{me?.email || "-"}</span>
          </p>
        </div>
      </section>

      {/* ✅ İstediğin blok (düzgün template literal ile) */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-600" /> Bildirimler
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-700 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="font-medium">E-posta Bildirimleri</div>
                  <div className="text-xs text-slate-500">Talep/durum güncellemeleri</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEmailNotif((v: boolean) => !v)}
                className={`h-7 w-12 rounded-full transition-all border ${
                  emailNotif
                    ? "bg-emerald-500 border-emerald-400"
                    : "bg-slate-200 border-slate-300"
                }`}
                aria-label="E-posta bildirimlerini aç/kapat"
              >
                <span
                  className={`block h-6 w-6 bg-white rounded-full shadow transform transition-all ${
                    emailNotif ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="font-medium">Ürün / MVP Bildirimleri</div>
                  <div className="text-xs text-slate-500">Yeni özellik ve duyurular</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProductNotif((v: boolean) => !v)}
                className={`h-7 w-12 rounded-full transition-all border ${
                  productNotif
                    ? "bg-emerald-500 border-emerald-400"
                    : "bg-slate-200 border-slate-300"
                }`}
                aria-label="Ürün bildirimlerini aç/kapat"
              >
                <span
                  className={`block h-6 w-6 bg-white rounded-full shadow transform transition-all ${
                    productNotif ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex gap-2">
              <Button className="bg-orange-600 hover:bg-orange-500" onClick={saveSettings}>
                Kaydet
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-slate-200"
                onClick={() => (window.location.href = "/corporate/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-600" /> Hesap
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-700 space-y-3">
            <div className="text-xs text-slate-500">
              Çıkış yapınca tekrar giriş ekranına yönlendirilirsin.
            </div>

            <Button
              type="button"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              Çıkış Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
