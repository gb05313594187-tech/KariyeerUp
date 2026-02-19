// src/pages/CorporateProfile.tsx - GÜNCELLENMİŞ VERSİYON
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  BadgeCheck,
  Tags,
  Users,
  Calendar,
  Globe,
  MapPin,
  Mail,
  Phone,
  Landmark,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";

type CorporateProfileRow = {
  id?: string;
  user_id: string;

  legal_name: string;
  brand_name: string;
  logo_url?: string | null;

  industry: string;
  activity_tags: string[]; // ["SaaS","HRTech"]

  founded_year: number | null;
  employee_range: string;
  company_type: string;

  hq_country: string;
  hq_city: string;

  website: string;
  corporate_email: string;

  phone_country_iso: string; // "TR"
  phone_dial: string; // "+90"
  phone_local: string; // "532 123 45 67"
  phone_e164: string; // "+905321234567" (best effort)

  kep_address: string;
  linkedin_url: string;
  instagram_url: string;
  x_url: string;
  youtube_url: string;

  tax_office: string;
  vkn: string;
  mersis: string;
  trade_registry_no: string;

  tagline: string;
  about: string;
  products_services: string[]; // ["...", "..."]

  status?: string; // "draft" | "completed" | "active" | "verified"
  updated_at?: string;
};

export default function CorporateProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState<any>(null);

  // ---------- ALL COUNTRIES (ISO) ----------
  const ALL_REGIONS = useMemo(() => {
    try {
      const regions =
        // @ts-ignore
        typeof Intl !== "undefined" && Intl.supportedValuesOf
          ? // @ts-ignore
            Intl.supportedValuesOf("region")
          : ["TR", "US", "DE", "TN", "FR", "GB", "NL", "IT", "ES"];

      // @ts-ignore
      const dn = typeof Intl !== "undefined" ? new Intl.DisplayNames(["tr"], { type: "region" }) : null;

      const list = regions
        .map((iso: string) => {
          const name = dn ? dn.of(iso) : iso;
          return { iso, name: name || iso };
        })
        .filter((x: any) => x?.iso && x?.name)
        .sort((a: any, b: any) => a.name.localeCompare(b.name, "tr"));

      return list;
    } catch {
      return [
        { iso: "TR", name: "Türkiye" },
        { iso: "US", name: "Amerika Birleşik Devletleri" },
        { iso: "DE", name: "Almanya" },
        { iso: "TN", name: "Tunus" },
      ];
    }
  }, []);

  const DIAL_BY_ISO: Record<string, string> = {
    TR: "+90", US: "+1", CA: "+1", DE: "+49", FR: "+33", GB: "+44", NL: "+31", IT: "+39", ES: "+34", PT: "+351",
    BE: "+32", CH: "+41", AT: "+43", SE: "+46", NO: "+47", DK: "+45", FI: "+358", IE: "+353", PL: "+48", CZ: "+420",
    HU: "+36", RO: "+40", BG: "+359", GR: "+30", TN: "+216", MA: "+212", DZ: "+213", EG: "+20", AE: "+971", SA: "+966",
    QA: "+974", KW: "+965", BH: "+973", OM: "+968", JO: "+962", LB: "+961", IQ: "+964", SY: "+963", IL: "+972",
  };

  const buildE164 = (dial: string, local: string) => {
    const d = (dial || "").trim();
    const n = (local || "").replace(/[^\d]/g, "");
    if (!d.startsWith("+") || n.length < 6) return "";
    return `${d}${n}`;
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [form, setForm] = useState<CorporateProfileRow>({
    user_id: "",
    legal_name: "",
    brand_name: "",
    logo_url: "",
    industry: "",
    activity_tags: [],
    founded_year: null,
    employee_range: "1-10",
    company_type: "Limited",
    hq_country: "",
    hq_city: "",
    website: "",
    corporate_email: "",
    phone_country_iso: "TR",
    phone_dial: "+90",
    phone_local: "",
    phone_e164: "",
    kep_address: "",
    linkedin_url: "",
    instagram_url: "",
    x_url: "",
    youtube_url: "",
    tax_office: "",
    vkn: "",
    mersis: "",
    trade_registry_no: "",
    tagline: "",
    about: "",
    products_services: [""],
    status: "draft",
  });

  const setField = (k: keyof CorporateProfileRow, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  const addProductLine = () =>
    setForm((p: any) => ({
      ...p,
      products_services: [...(p.products_services || []), ""],
    }));

  const removeProductLine = (i: number) =>
    setForm((p: any) => ({
      ...p,
      products_services: (p.products_services || []).filter((_: any, idx: number) => idx !== i),
    }));

  const updateProductLine = (i: number, v: string) =>
    setForm((p: any) => {
      const arr = [...(p.products_services || [""])];
      arr[i] = v;
      return { ...p, products_services: arr };
    });

  const tagsString = useMemo(() => (form.activity_tags || []).join(", "), [form.activity_tags]);

  const setTagsFromString = (s: string) => {
    const arr = (s || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => (x.startsWith("#") ? x.slice(1) : x));
    setField("activity_tags", Array.from(new Set(arr)));
  };

  const onChangeCountryIso = (iso: string) => {
    const dial = DIAL_BY_ISO[iso] || "+";
    setForm((p: any) => ({
      ...p,
      phone_country_iso: iso,
      phone_dial: p.phone_dial && p.phone_dial !== "+" ? p.phone_dial : dial,
    }));
  };

  const validateStep1 = () => {
    if (!form.legal_name?.trim()) return "Şirket resmi ünvanı zorunlu.";
    if (!form.brand_name?.trim()) return "Marka adı zorunlu.";
    if (!form.industry?.trim()) return "Sektör zorunlu.";
    if (!form.activity_tags?.length) return "Faaliyet alanı (tag) zorunlu.";
    if (!form.employee_range?.trim()) return "Çalışan sayısı zorunlu.";
    if (!form.company_type?.trim()) return "Şirket türü zorunlu.";
    if (!form.hq_country?.trim()) return "Merkez ülke zorunlu.";
    if (!form.hq_city?.trim()) return "Merkez şehir zorunlu.";
    return "";
  };

  const validateStep2 = () => {
    if (!form.corporate_email?.trim()) return "Kurumsal e-posta zorunlu.";
    if (!form.phone_dial?.trim() || !form.phone_dial.startsWith("+")) return "Telefon ülke kodu (+) ile başlamalı.";
    if (!form.phone_local?.trim()) return "Telefon numarası zorunlu.";
    return "";
  };

  const validateStep3 = () => {
    if (!form.about?.trim()) return "Hakkımızda alanı zorunlu.";
    return "";
  };

  const normalizeForSave = (row: CorporateProfileRow) => {
    const cleanedProducts = (row.products_services || []).map((x) => (x || "").trim()).filter(Boolean);
    const e164 = buildE164(row.phone_dial, row.phone_local);
    return {
      ...row,
      founded_year: row.founded_year ? Number(row.founded_year) : null,
      activity_tags: row.activity_tags || [],
      products_services: cleanedProducts.length ? cleanedProducts : [""],
      phone_e164: e164,
      status: row.status || "draft",
    };
  };

  const loadCorporateProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("corporate_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Profil verisi okunamadı.");
        return;
      }

      if (data) {
        setForm((p: any) => ({
          ...p,
          ...data,
          activity_tags: Array.isArray(data.activity_tags) ? data.activity_tags : [],
          products_services: Array.isArray(data.products_services) ? data.products_services : [""],
          phone_country_iso: data.phone_country_iso || "TR",
          phone_dial: data.phone_dial || DIAL_BY_ISO[data.phone_country_iso || "TR"] || "+90",
          phone_local: data.phone_local || "",
          corporate_email: data.corporate_email || me?.email || "",
        }));
      } else {
        setForm((p: any) => ({ ...p, corporate_email: me?.email || "" }));
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Profil yüklenirken hata oluştu.");
    }
  };

  const saveCorporateProfile = async (mode: "draft" | "completed") => {
    const err =
      step === 1 ? validateStep1() : step === 2 ? validateStep2() : validateStep3();

    if (err) {
      toast.error(err);
      return;
    }

    setSaving(true);
    try {
      // 1. Önce corporate_profiles tablosuna kaydet
      const payload = normalizeForSave({
        ...form,
        user_id: me?.id,
        status: mode,
      });

      const { data, error } = await supabase
        .from("corporate_profiles")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Kaydedilemedi.");
        return;
      }

      if (data) setForm((p: any) => ({ ...p, ...data }));

      // 2. profiles tablosunu da güncelle (Home sol sütun için)
      // Şirket adını full_name'e, Logo'yu avatar_url'e yazıyoruz
      const profileUpdate = {
        full_name: form.brand_name || form.legal_name,
        title: form.industry || "Kurumsal Hesap", // Sektörü veya sabit bir başlık
        avatar_url: form.logo_url, // Varsa logo
        city: form.hq_city,
        country: form.hq_country,
        updated_at: new Date().toISOString()
      };

      const { error: profileErr } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", me.id);

      if (profileErr) {
        console.warn("profiles tablosu güncellenemedi:", profileErr);
      }

      toast.success(mode === "completed" ? "Profil tamamlandı." : "Taslak kaydedildi.");
    } catch (e: any) {
      console.error(e);
      toast.error("Kaydetme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user || null;
      setMe(user);

      if (!user?.id) {
        setLoading(false);
        return;
      }

      setForm((p: any) => ({
        ...p,
        user_id: user.id,
        corporate_email: p.corporate_email || user.email || "",
      }));

      await loadCorporateProfile(user.id);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-10">Yükleniyor...</div>;

  if (!me?.id) {
    return (
      <div className="p-10">
        <div className="text-sm">Giriş yapılmamış. Kurumsal profili düzenlemek için login ol.</div>
      </div>
    );
  }

  const StepButton = ({ n, label }: any) => (
    <button
      className={`px-3 py-2 rounded border text-xs flex items-center gap-2 ${
        step === n ? "border-orange-600 text-orange-700" : "border-gray-200 text-gray-600"
      }`}
      onClick={() => setStep(n)}
      type="button"
    >
      <span className="font-semibold">{n}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Şirket Profili</h1>
              <p className="text-xs mt-1 opacity-90">Kurumsal Kimlik ve Ayarlar</p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <StepButton n={1} label="Kimlik & Operasyon" />
              <StepButton n={2} label="İletişim & Yasal" />
              <StepButton n={3} label="Tanıtım & Onay" />
            </div>
          </div>

          <div className="md:hidden mt-4 flex gap-2">
            <StepButton n={1} label="1" />
            <StepButton n={2} label="2" />
            <StepButton n={3} label="3" />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-orange-600" />
              Hesap Bilgisi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>Email: {me?.email}</div>
            <div className="text-xs text-gray-500">
              Durum: <span className="font-medium">{form.status || "draft"}</span>
            </div>
          </CardContent>
        </Card>

        {/* STEP 1 */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-orange-600" />
                Kimlik & Operasyon
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {/* Legal / Brand */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4" />
                    Şirket Resmi Ünvanı (Zorunlu)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="ABC Teknoloji Anonim Şirketi"
                    value={form.legal_name}
                    onChange={(e) => setField("legal_name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-4 h-4" />
                    Marka Adı (Zorunlu)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="ABC Tech"
                    value={form.brand_name}
                    onChange={(e) => setField("brand_name", e.target.value)}
                  />
                </div>
              </div>

              {/* Logo (URL for now) */}
              <div>
                <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                  <Upload className="w-4 h-4" />
                  Logo URL (URL girin)
                </label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="https://..."
                  value={form.logo_url || ""}
                  onChange={(e) => setField("logo_url", e.target.value)}
                />
              </div>

              {/* Industry / Tags */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4" />
                    Sektör / Endüstri (Zorunlu)
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={form.industry}
                    onChange={(e) => setField("industry", e.target.value)}
                  >
                    <option value="">Seç</option>
                    <option>Yazılım</option>
                    <option>Fintech</option>
                    <option>E-ticaret</option>
                    <option>Sağlık</option>
                    <option>Eğitim</option>
                    <option>Lojistik</option>
                    <option>Üretim</option>
                    <option>Danışmanlık</option>
                    <option>Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Tags className="w-4 h-4" />
                    Faaliyet Alanı (Tag) (Zorunlu) — virgülle ayır
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="#SaaS, #HRTech, #B2B"
                    value={tagsString}
                    onChange={(e) => setTagsFromString(e.target.value)}
                  />
                </div>
              </div>

              {/* Founded / Employees / Type */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    Kuruluş Yılı
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder="2019"
                    value={form.founded_year || ""}
                    onChange={(e) => setField("founded_year", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4" />
                    Çalışan Sayısı (Zorunlu)
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={form.employee_range}
                    onChange={(e) => setField("employee_range", e.target.value)}
                  >
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500-1000</option>
                    <option>1000+</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Landmark className="w-4 h-4" />
                    Şirket Türü (Zorunlu)
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={form.company_type}
                    onChange={(e) => setField("company_type", e.target.value)}
                  >
                    <option>Limited</option>
                    <option>Anonim</option>
                    <option>Şahıs</option>
                    <option>Start-up</option>
                    <option>STK</option>
                    <option>Diğer</option>
                  </select>
                </div>
              </div>

              {/* HQ */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4" />
                    Merkez Ülke (Zorunlu)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Türkiye"
                    value={form.hq_country}
                    onChange={(e) => setField("hq_country", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4" />
                    Merkez Şehir (Zorunlu)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="İstanbul"
                    value={form.hq_city}
                    onChange={(e) => setField("hq_city", e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  disabled={saving}
                  onClick={() => saveCorporateProfile("draft")}
                >
                  {saving ? "Kaydediliyor..." : "Taslak Kaydet"}
                </Button>

                <Button
                  className="bg-orange-600 hover:bg-orange-500"
                  disabled={saving}
                  onClick={() => {
                    const err = validateStep1();
                    if (err) return toast.error(err);
                    setStep(2);
                  }}
                >
                  Devam (2/3)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-orange-600" />
                İletişim & Yasal
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4" />
                    Kurumsal E-posta (Zorunlu)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="info@abctech.com"
                    value={form.corporate_email}
                    onChange={(e) => setField("corporate_email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <LinkIcon className="w-4 h-4" />
                    Web Sitesi
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://www.abctech.com"
                    value={form.website}
                    onChange={(e) => setField("website", e.target.value)}
                  />
                </div>
              </div>

              {/* Phone (ALL COUNTRIES selector) */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4" />
                    Ülke (Tüm Ülkeler)
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={form.phone_country_iso}
                    onChange={(e) => onChangeCountryIso(e.target.value)}
                  >
                    {ALL_REGIONS.map((c: any) => (
                      <option key={c.iso} value={c.iso}>
                        {c.name} ({c.iso})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4" />
                    Ülke Kodu
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="+90"
                    value={form.phone_dial}
                    onChange={(e) => setField("phone_dial", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4" />
                    Telefon Numarası (Zorunlu)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="532 123 45 67"
                    value={form.phone_local}
                    onChange={(e) => setField("phone_local", e.target.value)}
                  />
                </div>
              </div>

              {/* Social */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn Şirket Sayfası
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://linkedin.com/company/..."
                    value={form.linkedin_url}
                    onChange={(e) => setField("linkedin_url", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <LinkIcon className="w-4 h-4" />
                    Instagram (Opsiyonel)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://instagram.com/..."
                    value={form.instagram_url}
                    onChange={(e) => setField("instagram_url", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <LinkIcon className="w-4 h-4" />
                    X / Twitter (Opsiyonel)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://x.com/..."
                    value={form.x_url}
                    onChange={(e) => setField("x_url", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                    <LinkIcon className="w-4 h-4" />
                    YouTube (Opsiyonel)
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://youtube.com/..."
                    value={form.youtube_url}
                    onChange={(e) => setField("youtube_url", e.target.value)}
                  />
                </div>
              </div>

              {/* Legal (private) */}
              <div className="mt-2 p-3 rounded border bg-gray-50">
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Yasal & Finansal Bilgiler (Public Görünmez)
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Vergi Dairesi</label>
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="..."
                      value={form.tax_office}
                      onChange={(e) => setField("tax_office", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Vergi Kimlik No</label>
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="..."
                      value={form.vkn}
                      onChange={(e) => setField("vkn", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">MERSİS No</label>
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="..."
                      value={form.mersis}
                      onChange={(e) => setField("mersis", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Ticaret Sicil No</label>
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="..."
                      value={form.trade_registry_no}
                      onChange={(e) => setField("trade_registry_no", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600 mb-1 block">KEP Adresi</label>
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="..."
                      value={form.kep_address}
                      onChange={(e) => setField("kep_address", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Geri (1/3)
                </Button>

                <Button
                  variant="outline"
                  disabled={saving}
                  onClick={() => saveCorporateProfile("draft")}
                >
                  {saving ? "Kaydediliyor..." : "Taslak Kaydet"}
                </Button>

                <Button
                  className="bg-orange-600 hover:bg-orange-500"
                  disabled={saving}
                  onClick={() => {
                    const err = validateStep2();
                    if (err) return toast.error(err);
                    setStep(3);
                  }}
                >
                  Devam (3/3)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-orange-600" />
                Tanıtım & Onay
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                  <BadgeCheck className="w-4 h-4" />
                  Kısa Slogan (Tagline) — max 100
                </label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="İşinizi büyüten dijital çözümler"
                  maxLength={100}
                  value={form.tagline}
                  onChange={(e) => setField("tagline", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4" />
                  Şirket Açıklaması (Hakkımızda) (Zorunlu)
                </label>
                <textarea
                  className="w-full border p-2 rounded min-h-[140px]"
                  placeholder="Ne yapıyorsunuz, kimler için, neden varsınız?"
                  value={form.about}
                  onChange={(e) => setField("about", e.target.value)}
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 flex items-center gap-2 mb-2">
                  <Plus className="w-4 h-4" />
                  Ürün / Hizmet Listesi
                </div>

                <div className="space-y-2">
                  {(form.products_services || [""]).map((p: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="flex-1 border p-2 rounded"
                        value={p}
                        placeholder={`Hizmet / Ürün ${i + 1}`}
                        onChange={(e) => updateProductLine(i, e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => removeProductLine(i)}
                        disabled={(form.products_services || []).length <= 1}
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button onClick={addProductLine} variant="outline" className="mt-2">
                  + Satır Ekle
                </Button>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Geri (2/3)
                </Button>

                <Button
                  variant="outline"
                  disabled={saving}
                  onClick={() => saveCorporateProfile("draft")}
                >
                  {saving ? "Kaydediliyor..." : "Taslak Kaydet"}
                </Button>

                <Button
                  className="bg-orange-600 hover:bg-orange-500"
                  disabled={saving}
                  onClick={() => {
                    const e1 = validateStep1();
                    const e2 = validateStep2();
                    const e3 = validateStep3();
                    if (e1) return toast.error(e1);
                    if (e2) return toast.error(e2);
                    if (e3) return toast.error(e3);
                    saveCorporateProfile("completed");
                  }}
                >
                  {saving ? "Kaydediliyor..." : "Tamamla & Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              Public Profil Önizleme (Özet)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="font-semibold">{form.brand_name || "—"}</div>
            <div className="text-xs text-gray-600">{form.tagline || "—"}</div>
            <div className="text-xs">
              <span className="font-medium">Sektör:</span> {form.industry || "—"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
