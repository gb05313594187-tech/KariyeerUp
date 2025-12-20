// src/pages/UserProfileEdit.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Save, ArrowLeft, Mail, Phone, MapPin, Briefcase, Building2 } from "lucide-react";

const PHONE_COUNTRIES = [
  { iso: "TR", name: "Turkey", dial: "+90", placeholder: "532 123 45 67" },
  { iso: "TN", name: "Tunisia", dial: "+216", placeholder: "20 123 456" },
  { iso: "DE", name: "Germany", dial: "+49", placeholder: "1512 3456789" },
  { iso: "US", name: "USA", dial: "+1", placeholder: "555 123 4567" },
  { iso: "GB", name: "UK", dial: "+44", placeholder: "7400 123456" },
];

const TITLE_OPTIONS = [
  "CEO / Founder",
  "HR Manager",
  "HR Specialist",
  "Product Manager",
  "Software Engineer",
  "Sales Manager",
  "Marketing Manager",
  "Operations Manager",
  "Team Lead",
  "Student",
  "Other",
];

const SECTOR_OPTIONS = [
  "Yazılım",
  "Fintech",
  "E-ticaret",
  "Sağlık",
  "Eğitim",
  "Lojistik",
  "Üretim",
  "Danışmanlık",
  "İnsan Kaynakları",
  "Perakende",
  "Other",
];

function digitsOnly(s: string) {
  return (s || "").replace(/[^\d]/g, "");
}

function toE164(dial: string, rawNumber: string) {
  const d = (dial || "").trim();
  const n = digitsOnly(rawNumber);
  if (!d || !n) return "";
  return `${d}${n}`;
}

function parsePhone(existing: string) {
  const v = (existing || "").trim();
  if (!v.startsWith("+")) return { dial: "+90", number: v }; // default
  const match = PHONE_COUNTRIES
    .slice()
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => v.startsWith(c.dial));
  if (!match) return { dial: "+90", number: v.replace("+", "") };
  return { dial: match.dial, number: v.slice(match.dial.length) };
}

export default function UserProfileEdit() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [form, setForm] = useState({
    full_name: "",
    title: "",
    title_other: "",
    sector: "",
    sector_other: "",
    city: "",
    phone_dial: "+90",
    phone_number: "",
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
          toast.error("Profil okunamadı. RLS/izinleri kontrol et.");
          return;
        }

        const p = pData || null;
        setProfile(p);

        const parsed = parsePhone(p?.phone || "");

        const title = p?.title || "";
        const sector = p?.sector || "";

        const titleIsOther = title && !TITLE_OPTIONS.includes(title);
        const sectorIsOther = sector && !SECTOR_OPTIONS.includes(sector);

        setForm({
          full_name: p?.full_name || user?.user_metadata?.full_name || "",
          title: titleIsOther ? "Other" : (title || ""),
          title_other: titleIsOther ? title : "",
          sector: sectorIsOther ? "Other" : (sector || ""),
          sector_other: sectorIsOther ? sector : "",
          city: p?.city || "",
          phone_dial: parsed.dial || "+90",
          phone_number: parsed.number || "",
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
    const titleVal = form.title === "Other" ? form.title_other : form.title;
    const sectorVal = form.sector === "Other" ? form.sector_other : form.sector;
    const phoneE164 = toE164(form.phone_dial, form.phone_number);

    const checks = [
      !!form.full_name.trim(),
      !!(titleVal || "").trim(),
      !!(sectorVal || "").trim(),
      !!form.city.trim(),
      !!phoneE164,
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

    const full_name = form.full_name.trim();
    const title = (form.title === "Other" ? form.title_other : form.title).trim();
    const sector = (form.sector === "Other" ? form.sector_other : form.sector).trim();
    const city = form.city.trim();
    const phone = toE164(form.phone_dial, form.phone_number);

    if (!full_name) return toast.error("Ad Soyad gerekli.");
    if (!title) return toast.error("Ünvan gerekli.");
    if (!sector) return toast.error("Sektör gerekli.");
    if (!city) return toast.error("Şehir gerekli.");
    if (!phone) return toast.error("Telefon gerekli (ülke kodu + numara).");

    setSaving(true);
    try {
      const payload = {
        id: me.id, // ✅ auth.uid()
        full_name,
        title,
        sector,
        city,
        phone, // ✅ E.164 tek string
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload, {
        onConflict: "id",
      });

      if (error) {
        console.error("profiles upsert error:", error);
        toast.error("Kaydedilemedi. RLS veya tablo kolonlarını kontrol et.");
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
            Profili Düzenle
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Ünvan, sektör ve telefon dahil net bilgiler eşleşme kalitesini yükseltir.
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
                <div className="mt-1 font-semibold text-slate-900">{me?.email || "-"}</div>
              </div>

              {/* Full name */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-600">Ad Soyad</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Örn: Kariyer Sepeti"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Ünvan
                </label>
                <select
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">Seç</option>
                  {TITLE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t === "Other" ? "Diğer" : t}
                    </option>
                  ))}
                </select>

                {form.title === "Other" && (
                  <input
                    value={form.title_other}
                    onChange={(e) => setForm({ ...form, title_other: e.target.value })}
                    placeholder="Ünvanını yaz"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                )}
              </div>

              {/* Sector */}
              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Sektör
                </label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">Seç</option>
                  {SECTOR_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === "Other" ? "Diğer" : s}
                    </option>
                  ))}
                </select>

                {form.sector === "Other" && (
                  <input
                    value={form.sector_other}
                    onChange={(e) => setForm({ ...form, sector_other: e.target.value })}
                    placeholder="Sektörünü yaz"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                )}
              </div>

              {/* City */}
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

              {/* Phone */}
              <div>
                <label className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  Telefon
                </label>

                <div className="mt-1 flex gap-2">
                  <select
                    value={form.phone_dial}
                    onChange={(e) => setForm({ ...form, phone_dial: e.target.value })}
                    className="w-[140px] rounded-xl border border-slate-200 px-3 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    {PHONE_COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.dial}>
                        {c.iso} {c.dial}
                      </option>
                    ))}
                  </select>

                  <input
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    placeholder={
                      PHONE_COUNTRIES.find((x) => x.dial === form.phone_dial)?.placeholder ||
                      "Numara"
                    }
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Kaydedilecek format:{" "}
                  <span className="font-mono">{toE164(form.phone_dial, form.phone_number) || "-"}</span>
                </p>
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
              *Veriler <span className="font-medium">profiles</span> tablosuna{" "}
              <span className="font-medium">id = auth.uid()</span> ile yazılır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
