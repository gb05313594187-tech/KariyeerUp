// src/pages/UserProfileEdit.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
} from "lucide-react";

export default function UserProfileEdit() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // DB kolonların: full_name, title, sector, city, phone
  const [form, setForm] = useState({
    full_name: "",
    title: "",
    sector: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data?.user || null;
        if (!mounted) return;

        setMe(user);

        if (!user) {
          toast.error("Profilini düzenlemek için giriş yapmalısın.");
          navigate("/login", { replace: true });
          return;
        }

        const { data: pData, error: pErr } = await supabase
          .from("profiles")
          .select("id, full_name, title, sector, city, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (pErr) {
          console.error("profiles select error:", pErr);
          // tablo var ama RLS/kolon vb. sorun olabilir
          setProfile(null);
          setForm({
            full_name: user?.user_metadata?.full_name || "",
            title: "",
            sector: "",
            city: "",
            phone: "",
          });
          return;
        }

        setProfile(pData || null);

        setForm({
          full_name: pData?.full_name || user?.user_metadata?.full_name || "",
          title: pData?.title || "",
          sector: pData?.sector || "",
          city: pData?.city || "",
          phone: pData?.phone || "",
        });
      } catch (e) {
        console.error(e);
        toast.error("Sayfa yüklenemedi.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const completion = useMemo(() => {
    if (!me) return 0;
    const checks = [
      !!form.full_name,
      !!form.title,
      !!form.sector,
      !!form.city,
      !!form.phone,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [me, form]);

  const save = async () => {
    if (!me?.id) {
      toast.error("Giriş bulunamadı.");
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: me.id, // ✅ EN KRİTİK NOKTA
        full_name: (form.full_name || "").trim(),
        title: (form.title || "").trim(),
        sector: (form.sector || "").trim(),
        city: (form.city || "").trim(),
        phone: (form.phone || "").trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload, {
        onConflict: "id",
      });

      if (error) {
        console.error("profiles upsert error:", error);
        toast.error("Kaydedilemedi. RLS/policy veya kolonları kontrol et.");
        return;
      }

      toast.success("Profil kaydedildi.");
      navigate("/user/profile");
    } catch (e) {
      console.error(e);
      toast.error("Beklenmeyen hata oluştu.");
    } finally {
      setSaving(false);
    }
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
      {/* Header */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-xs text-white/90">User Profile</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">
            Profilini Düzenle
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Bu bilgiler koç eşleşmesini ve seans kalitesini doğrudan etkiler.
          </p>

          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-white/90">
              <span>Profil tamamlanma</span>
              <span className="font-semibold">%{completion}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/25 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Button
              className="rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => navigate("/user/profile")}
              disabled={saving}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Profile Dön
            </Button>
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              Profil Bilgileri
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email readonly */}
              <div className="sm:col-span-2 rounded-xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Mail className="h-4 w-4" />
                  Email (değiştirilemez)
                </div>
                <div className="mt-1 font-semibold text-slate-900">
                  {me?.email || "-"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-600">Ad Soyad</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Örn: Salih Gökalp Büyükçelebi"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Unvan
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Örn: Product Manager"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Sektör
                </label>
                <input
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  placeholder="Örn: Yazılım, Fintech..."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  Şehir
                </label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Örn: İstanbul"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  Telefon
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Örn: +90 5xx xxx xx xx"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Button
                className="rounded-xl bg-orange-600 hover:bg-orange-500"
                onClick={save}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate("/user/profile")}
                disabled={saving}
              >
                Vazgeç
              </Button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              *Kaydet dediğinde veriler <span className="font-medium">profiles</span>{" "}
              tablosuna yazılır (id = auth.uid()).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
