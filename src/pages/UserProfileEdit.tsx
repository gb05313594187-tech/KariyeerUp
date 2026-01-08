// src/pages/UserProfileEdit.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, User, Phone, Briefcase, Building2, MapPin } from "lucide-react";

export default function UserProfileEdit() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // ---- Telefon ülke kodları ----
  const PHONE_COUNTRIES = useMemo(
    () => [
      { iso: "TR", name: "Türkiye", dial: "+90", placeholder: "5xx xxx xx xx" },
      { iso: "TN", name: "Tunus", dial: "+216", placeholder: "xx xxx xxx" },
      { iso: "DE", name: "Almanya", dial: "+49", placeholder: "15xx xxxxxx" },
      { iso: "FR", name: "Fransa", dial: "+33", placeholder: "6 xx xx xx xx" },
      { iso: "NL", name: "Hollanda", dial: "+31", placeholder: "6 xxxxxxxx" },
      { iso: "GB", name: "İngiltere", dial: "+44", placeholder: "7xxx xxxxxx" },
      { iso: "US", name: "ABD", dial: "+1", placeholder: "555 123 4567" },
      { iso: "AE", name: "BAE", dial: "+971", placeholder: "5x xxx xxxx" },
      { iso: "SA", name: "Suudi Arabistan", dial: "+966", placeholder: "5x xxx xxxx" },
      { iso: "QA", name: "Katar", dial: "+974", placeholder: "xxxx xxxx" },
      { iso: "KW", name: "Kuveyt", dial: "+965", placeholder: "xxxx xxxx" },
    ],
    []
  );

  // ---- Sektör listesi ----
  const SECTORS = useMemo(
    () => [
      "Yazılım",
      "Fintech",
      "E-ticaret",
      "Sağlık",
      "Eğitim",
      "Lojistik",
      "Üretim",
      "Danışmanlık",
      "Pazarlama",
      "Satış",
      "İnsan Kaynakları",
      "Hukuk",
      "Turizm",
      "Gıda & İçecek",
      "Medya",
      "Telekom",
      "Enerji",
      "Perakende",
      "Otomotiv",
      "Gayrimenkul",
      "Kamu",
      "Diğer",
    ],
    []
  );

  // ---- Ünvan listesi ----
  const TITLES = useMemo(
    () => [
      "CEO / Kurucu",
      "COO",
      "CTO",
      "CFO",
      "CHRO",
      "Genel Müdür",
      "Direktör",
      "Müdür",
      "Takım Lideri",
      "Product Manager",
      "Project Manager",
      "Software Engineer",
      "UI/UX Designer",
      "Data Analyst",
      "Data Scientist",
      "DevOps Engineer",
      "Sales Manager",
      "Marketing Manager",
      "HR Manager",
      "İş Geliştirme",
      "Operasyon",
      "Öğrenci",
      "Serbest / Freelancer",
      "Diğer",
    ],
    []
  );

  // ✅ Form state (profiles kolonlarıyla uyumlu) -> display_name kullan
  const [form, setForm] = useState({
    display_name: "",
    title: "",
    sector: "",
    city: "",
    phone_country: "TR",
    phone_local: "",
  });

  const splitPhone = (raw: string) => {
    if (!raw) return { phone_country: "TR", phone_local: "" };
    const clean = String(raw).trim();
    const found = PHONE_COUNTRIES.find((c) => clean.startsWith(c.dial));
    if (found) {
      return {
        phone_country: found.iso,
        phone_local: clean.replace(found.dial, "").trim(),
      };
    }
    return { phone_country: "TR", phone_local: clean.replace("+", "").trim() };
  };

  const buildE164 = () => {
    const country =
      PHONE_COUNTRIES.find((c) => c.iso === form.phone_country) || PHONE_COUNTRIES[0];
    const local = String(form.phone_local || "").replace(/[^\d]/g, "").trim();
    if (!local) return "";
    return `${country.dial}${local}`;
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data?.user || null;
        if (!mounted) return;

        setMe(user);

        if (!user) {
          toast.error("Giriş yapmadan profili düzenleyemezsin.");
          navigate("/login");
          return;
        }

        // ✅ profili çek (kolonları açık seçelim)
        const { data: p, error: pErr } = await supabase
          .from("profiles")
          .select("id, full_name, display_name, role, phone, country, title, sector, city, updated_at")
          .eq("id", user.id)
          .maybeSingle();

        if (pErr) {
          console.error("profiles select error:", pErr);
        }

        const phoneParts = splitPhone(p?.phone || "");

        setProfile(p || null);

        // ✅ display_name öncelik: profiles -> user_metadata
        const meta = user?.user_metadata || {};
        const metaName =
          meta.display_name || meta.full_name || meta.fullName || meta.name || "";

        setForm({
          display_name: p?.display_name || p?.full_name || metaName || "",
          title: p?.title || "",
          sector: p?.sector || "",
          city: p?.city || "",
          phone_country: phoneParts.phone_country,
          phone_local: phoneParts.phone_local,
        });
      } catch (e) {
        console.error(e);
        toast.error("Profil yüklenemedi.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [navigate, PHONE_COUNTRIES]);

  const onSave = async () => {
    if (saving) return;

    const display_name = String(form.display_name || "").trim();
    if (!display_name) {
      toast.error("Ad Soyad zorunlu.");
      return;
    }

    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const user = u?.user;
      if (!user) {
        toast.error("Oturum bulunamadı. Lütfen yeniden giriş yap.");
        navigate("/login");
        return;
      }

      // ✅ Auth metadata da güncellensin (Navbar/AuthContext tutarlı kalsın)
      await supabase.auth.updateUser({
        data: {
          display_name,
          full_name: display_name, // geriye dönük uyum
        },
      });

      const payload = {
        id: user.id, // ✅ kritik (RLS with_check id=auth.uid())
        // ✅ isim alanları paralel: dashboard/profile tutarlı kalsın
        display_name,
        full_name: display_name,

        title: form.title || null,
        sector: form.sector || null,
        city: form.city || null,
        phone: buildE164() || null,
        updated_at: new Date().toISOString(),
      };

      // ✅ upsert’te conflict açık olsun
      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.error("profiles upsert error:", error);
        toast.error("Kaydedilemedi. RLS/policy veya kolonları kontrol et.");
        return;
      }

      toast.success("Profil kaydedildi.");
      navigate("/user/profile");
    } catch (e) {
      console.error(e);
      toast.error("Beklenmeyen bir hata oluştu.");
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
    <div className="bg-white text-slate-900">
      {/* Header */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="text-xs text-white/90">User Profile</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">Profili Düzenle</h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Bu bilgiler eşleşme kalitesini ve seans deneyimini etkiler. Ne kadar net, o kadar iyi eşleşme.
          </p>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="rounded-xl border-white/70 text-white hover:bg-white/10"
              onClick={() => navigate("/user/profile")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
            <Button
              className="rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={onSave}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              Temel Bilgiler
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Ad Soyad */}
            <div>
              <label className="text-xs text-slate-600">Ad Soyad</label>
              <input
                value={form.display_name}
                onChange={(e) => setForm((s) => ({ ...s, display_name: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Örn: Salih Gökalp Büyükçelebi"
              />
            </div>

            {/* Ünvan + Sektör */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" /> Ünvan
                </label>
                <select
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                  <option value="">Seçiniz</option>
                  {TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" /> Sektör
                </label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm((s) => ({ ...s, sector: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                  <option value="">Seçiniz</option>
                  {SECTORS.map((sct) => (
                    <option key={sct} value={sct}>
                      {sct}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Şehir + Telefon */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" /> Şehir
                </label>
                <input
                  value={form.city}
                  onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Örn: İstanbul"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" /> Telefon
                </label>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  <select
                    value={form.phone_country}
                    onChange={(e) => setForm((s) => ({ ...s, phone_country: e.target.value }))}
                    className="col-span-1 rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                  >
                    {PHONE_COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.iso}>
                        {c.iso} {c.dial}
                      </option>
                    ))}
                  </select>

                  <input
                    value={form.phone_local}
                    onChange={(e) => setForm((s) => ({ ...s, phone_local: e.target.value }))}
                    className="col-span-2 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder={
                      PHONE_COUNTRIES.find((c) => c.iso === form.phone_country)?.placeholder || "Telefon"
                    }
                    inputMode="tel"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Kaydedilecek format: <span className="font-mono">{buildE164() || "—"}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-2 flex-wrap">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate("/user/profile")}>
                Vazgeç
              </Button>
              <Button className="rounded-xl" onClick={onSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>

            <p className="text-xs text-slate-500">
              * Kaydet dediğinde veriler <span className="font-mono">profiles</span> tablosuna yazılır. RLS bu kullanıcı için
              sadece kendi kaydına izin verir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
