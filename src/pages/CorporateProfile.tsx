// src/pages/CorporateProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
} from "lucide-react";

export default function CorporateProfile() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  // ---- PHONE LIST (demo) ----
  const PHONE_COUNTRIES = [
    // USA
    { iso: "US", name: "United States", dial: "+1", group: "USA", placeholder: "555 123 4567" },

    // EU (örnekler)
    { iso: "TR", name: "Turkey", dial: "+90", group: "EU", placeholder: "532 123 45 67" },
    { iso: "DE", name: "Germany", dial: "+49", group: "EU", placeholder: "1512 3456789" },
    { iso: "FR", name: "France", dial: "+33", group: "EU", placeholder: "6 12 34 56 78" },
    { iso: "NL", name: "Netherlands", dial: "+31", group: "EU", placeholder: "6 12345678" },

    // ARAB
    { iso: "TN", name: "Tunisia", dial: "+216", group: "ARAB", placeholder: "20 123 456" },
    { iso: "AE", name: "UAE", dial: "+971", group: "ARAB", placeholder: "50 123 4567" },
    { iso: "SA", name: "Saudi Arabia", dial: "+966", group: "ARAB", placeholder: "50 123 4567" },
    { iso: "EG", name: "Egypt", dial: "+20", group: "ARAB", placeholder: "10 1234 5678" },
  ];

  const getPhoneMeta = (iso: string) => {
    const found = PHONE_COUNTRIES.find((c) => c.iso === iso);
    return found || { dial: "+", placeholder: "Telefon" };
  };

  const [phoneCountryIso, setPhoneCountryIso] = useState<string>("TR");

  const [form, setForm] = useState<any>({
    // 1) Temel
    legal_name: "",
    brand_name: "",
    logo_url: "",
    industry: "",
    activity_tags: "",

    // 2) Operasyon
    founded_year: "",
    employee_range: "1-10",
    company_type: "Limited",
    hq_country: "",
    hq_city: "",

    // 3) İletişim
    website: "",
    corporate_email: "",
    phone_number: "",
    kep_address: "",
    linkedin_url: "",
    instagram_url: "",
    x_url: "",

    // 4) Yasal
    tax_office: "",
    vkn: "",
    mersis: "",
    trade_registry_no: "",

    // 5) Tanıtım
    tagline: "",
    about: "",
    products_services: [""],
  });

  const setField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addProductLine = () => {
    setForm((prev: any) => ({
      ...prev,
      products_services: [...(prev.products_services || []), ""],
    }));
  };

  const updateProductLine = (idx: number, value: string) => {
    setForm((prev: any) => {
      const arr = [...(prev.products_services || [])];
      arr[idx] = value;
      return { ...prev, products_services: arr };
    });
  };

  const removeProductLine = (idx: number) => {
    setForm((prev: any) => {
      const arr = [...(prev.products_services || [])];
      if (arr.length <= 1) return prev;
      arr.splice(idx, 1);
      return { ...prev, products_services: arr };
    });
  };

  const phoneMeta = getPhoneMeta(phoneCountryIso);

  const saveCorporateProfile = () => {
    // demo kaydet
    console.log("corporate profile (demo):", { ...form, phone_country_iso: phoneCountryIso });
    // toast.success("Şirket profili kaydedildi (demo).");
  };

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

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* Hesap Bilgisi */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" /> Hesap Bilgisi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <div>
              Email: <span className="font-medium">{me?.email || "-"}</span>
            </div>
            <div>
              User ID: <span className="font-mono text-xs">{me?.id || "-"}</span>
            </div>

            <div className="pt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-slate-200"
                onClick={() => (window.location.href = "/corporate/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                type="button"
                className="bg-orange-600 hover:bg-orange-500"
                onClick={() => (window.location.href = "/corporate/settings")}
              >
                Ayarlar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Şirket Profil Bilgileri */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-orange-600" /> Şirket Profil Bilgileri
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-700 space-y-6">
            {/* 1) Temel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Building2 className="w-4 h-4 text-orange-600" />
                1. Temel Kimlik Bilgileri
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600">Şirket Resmi Unvanı *</label>
                  <input
                    value={form.legal_name}
                    onChange={(e) => setField("legal_name", e.target.value)}
                    placeholder="Örn: ABC Teknoloji Anonim Şirketi"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Marka Adı *</label>
                  <input
                    value={form.brand_name}
                    onChange={(e) => setField("brand_name", e.target.value)}
                    placeholder="Örn: ABC Tech"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Şirket Logosu (PNG/JPG)</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="mt-1 w-full h-10 px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    onChange={(e: any) => {
                      const f = e?.target?.files?.[0];
                      if (f) setField("logo_url", f.name); // demo
                    }}
                  />
                  {form.logo_url ? (
                    <div className="text-xs text-slate-500 mt-1">Seçildi: {form.logo_url}</div>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-slate-600">Sektör / Endüstri *</label>
                  <select
                    value={form.industry}
                    onChange={(e) => setField("industry", e.target.value)}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Yazılım">Yazılım</option>
                    <option value="Fintech">Fintech</option>
                    <option value="E-ticaret">E-ticaret</option>
                    <option value="Lojistik">Lojistik</option>
                    <option value="Tekstil">Tekstil</option>
                    <option value="Danışmanlık">Danışmanlık</option>
                    <option value="Sağlık">Sağlık</option>
                    <option value="Eğitim">Eğitim</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-slate-600">Faaliyet Alanı (Anahtar Kelimeler)</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Tags className="w-4 h-4 text-slate-400" />
                    <input
                      value={form.activity_tags}
                      onChange={(e) => setField("activity_tags", e.target.value)}
                      placeholder="#SaaS, #Fintech, #HRTech"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2) Operasyon */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Users className="w-4 h-4 text-orange-600" />
                2. Demografik ve Operasyonel Bilgiler
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600">Kuruluş Yılı</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input
                      value={form.founded_year}
                      onChange={(e) => setField("founded_year", e.target.value)}
                      placeholder="Örn: 2019"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Çalışan Sayısı Aralığı</label>
                  <select
                    value={form.employee_range}
                    onChange={(e) => setField("employee_range", e.target.value)}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500-1000">500-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Şirket Türü</label>
                  <select
                    value={form.company_type}
                    onChange={(e) => setField("company_type", e.target.value)}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="Limited">Limited</option>
                    <option value="Anonim">Anonim</option>
                    <option value="Şahıs">Şahıs</option>
                    <option value="Start-up">Start-up</option>
                    <option value="STK">STK</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Yönetim Merkezi (Ülke / Şehir)</label>
                  <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <input
                        value={form.hq_country}
                        onChange={(e) => setField("hq_country", e.target.value)}
                        placeholder="Ülke"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <input
                        value={form.hq_city}
                        onChange={(e) => setField("hq_city", e.target.value)}
                        placeholder="Şehir"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3) İletişim */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Mail className="w-4 h-4 text-orange-600" />
                3. İletişim ve Dijital Varlıklar
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600">Web Sitesi</label>
                  <input
                    value={form.website}
                    onChange={(e) => setField("website", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Kurumsal E-posta</label>
                  <input
                    value={form.corporate_email}
                    onChange={(e) => setField("corporate_email", e.target.value)}
                    placeholder="info@..."
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Telefon (Ülke bazlı)</label>
                  <div className="mt-1 flex gap-2">
                    <select
                      value={phoneCountryIso}
                      onChange={(e) => setPhoneCountryIso(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    >
                      <optgroup label="USA">
                        {PHONE_COUNTRIES.filter((c) => c.group === "USA").map((c) => (
                          <option key={c.iso} value={c.iso}>
                            {c.name} ({c.dial})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="European Union">
                        {PHONE_COUNTRIES.filter((c) => c.group === "EU").map((c) => (
                          <option key={c.iso} value={c.iso}>
                            {c.name} ({c.dial})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Arab Countries">
                        {PHONE_COUNTRIES.filter((c) => c.group === "ARAB").map((c) => (
                          <option key={c.iso} value={c.iso}>
                            {c.name} ({c.dial})
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    <div className="flex-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div className="flex-1 flex">
                        <span className="h-10 px-3 inline-flex items-center rounded-l-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs">
                          {phoneMeta.dial}
                        </span>
                        <input
                          value={form.phone_number}
                          onChange={(e) =>
                            setField("phone_number", e.target.value.replace(/[^\d\s()-]/g, ""))
                          }
                          placeholder={phoneMeta.placeholder}
                          className="w-full h-10 px-3 rounded-r-lg border border-l-0 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Örnek: {phoneMeta.placeholder}</div>
                </div>

                <div>
                  <label className="text-xs text-slate-600">KEP Adresi (Opsiyonel)</label>
                  <input
                    value={form.kep_address}
                    onChange={(e) => setField("kep_address", e.target.value)}
                    placeholder="abc@hs01.kep.tr"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">LinkedIn Şirket Sayfası</label>
                  <input
                    value={form.linkedin_url}
                    onChange={(e) => setField("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Instagram</label>
                  <input
                    value={form.instagram_url}
                    onChange={(e) => setField("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Twitter / X</label>
                  <input
                    value={form.x_url}
                    onChange={(e) => setField("x_url", e.target.value)}
                    placeholder="https://x.com/..."
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
            </div>

            {/* 4) Yasal */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Landmark className="w-4 h-4 text-orange-600" />
                4. Yasal ve Finansal Bilgiler
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600">Vergi Dairesi</label>
                  <input
                    value={form.tax_office}
                    onChange={(e) => setField("tax_office", e.target.value)}
                    placeholder="Örn: Levent VD"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Vergi Kimlik No (VKN)</label>
                  <input
                    value={form.vkn}
                    onChange={(e) => setField("vkn", e.target.value)}
                    placeholder="1234567890"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">MERSİS No</label>
                  <input
                    value={form.mersis}
                    onChange={(e) => setField("mersis", e.target.value)}
                    placeholder="0XXXXXXXXXXXXXXX"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Ticaret Sicil No</label>
                  <input
                    value={form.trade_registry_no}
                    onChange={(e) => setField("trade_registry_no", e.target.value)}
                    placeholder="Örn: 123456"
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
            </div>

            {/* 5) Tanıtım */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <FileText className="w-4 h-4 text-orange-600" />
                5. Tanıtım ve İçerik
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-slate-600">Kısa Slogan (max 100)</label>
                  <input
                    value={form.tagline}
                    onChange={(e) => setField("tagline", e.target.value.slice(0, 100))}
                    placeholder='Örn: "İşinizi büyüten çözümler"'
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">{(form.tagline || "").length}/100</div>
                </div>

                <div>
                  <label className="text-xs text-slate-600">Şirket Açıklaması (Hakkımızda)</label>
                  <textarea
                    value={form.about}
                    onChange={(e) => setField("about", e.target.value)}
                    placeholder="Şirketinizi anlatın..."
                    className="mt-1 w-full min-h-[110px] p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-600">Hizmet / Ürün Listesi</label>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 h-9"
                      onClick={addProductLine}
                    >
                      + Satır Ekle
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(form.products_services || []).map((line: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={line}
                          onChange={(e) => updateProductLine(idx, e.target.value)}
                          placeholder={`Örn: Ürün/Hizmet ${idx + 1}`}
                          className="flex-1 h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-slate-200 h-10"
                          onClick={() => removeProductLine(idx)}
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                className="bg-orange-600 hover:bg-orange-500"
                onClick={saveCorporateProfile}
              >
                Kaydet (demo)
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-slate-200"
                onClick={() => (window.location.href = "/corporate/dashboard")}
              >
                Dashboard
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-slate-200"
                onClick={() => (window.location.href = "/corporate/settings")}
              >
                Ayarlar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
