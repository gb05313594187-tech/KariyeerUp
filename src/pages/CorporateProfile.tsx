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

  console.log("CorporateProfile mounted");

  const PHONE_COUNTRIES = [
    { iso: "TR", name: "Turkey", dial: "+90", placeholder: "532 123 45 67" },
    { iso: "DE", name: "Germany", dial: "+49", placeholder: "1512 3456789" },
    { iso: "US", name: "USA", dial: "+1", placeholder: "555 123 4567" },
    { iso: "TN", name: "Tunisia", dial: "+216", placeholder: "20 123 456" },
  ];

  const [phoneCountryIso, setPhoneCountryIso] = useState("TR");

  const getPhoneMeta = (iso: string) =>
    PHONE_COUNTRIES.find((c) => c.iso === iso) || {
      dial: "+",
      placeholder: "Telefon",
    };

  const phoneMeta = getPhoneMeta(phoneCountryIso);

  const [form, setForm] = useState<any>({
    legal_name: "",
    brand_name: "",
    industry: "",
    activity_tags: "",
    founded_year: "",
    employee_range: "1-10",
    company_type: "Limited",
    hq_country: "",
    hq_city: "",
    website: "",
    corporate_email: "",
    phone_number: "",
    kep_address: "",
    linkedin_url: "",
    instagram_url: "",
    x_url: "",
    tax_office: "",
    vkn: "",
    mersis: "",
    trade_registry_no: "",
    tagline: "",
    about: "",
    products_services: [""],
  });

  const setField = (k: string, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  const addProductLine = () =>
    setForm((p: any) => ({
      ...p,
      products_services: [...p.products_services, ""],
    }));

  const removeProductLine = (i: number) =>
    setForm((p: any) => ({
      ...p,
      products_services: p.products_services.filter((_: any, idx: number) => idx !== i),
    }));

  const saveCorporateProfile = () => {
    console.log("SAVE PROFILE", form);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setMe(data?.user || null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-10">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Şirket Profili</h1>
          <p className="text-xs mt-1">BUILD_MARK: CorporateProfile</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-orange-600" />
              Hesap Bilgisi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>Email: {me?.email}</div>
            <div>User ID: {me?.id}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BadgeCheck className="w-4 h-4 text-orange-600" />
              Şirket Bilgileri
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <input
              className="w-full border p-2 rounded"
              placeholder="Şirket Ünvanı"
              value={form.legal_name}
              onChange={(e) => setField("legal_name", e.target.value)}
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Marka Adı"
              value={form.brand_name}
              onChange={(e) => setField("brand_name", e.target.value)}
            />

            <div className="flex gap-2">
              <select
                className="border p-2 rounded"
                value={phoneCountryIso}
                onChange={(e) => setPhoneCountryIso(e.target.value)}
              >
                {PHONE_COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </select>

              <input
                className="flex-1 border p-2 rounded"
                placeholder={phoneMeta.placeholder}
                value={form.phone_number}
                onChange={(e) => setField("phone_number", e.target.value)}
              />
            </div>

            {form.products_services.map((p: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 border p-2 rounded"
                  value={p}
                  placeholder={`Ürün ${i + 1}`}
                  onChange={(e) =>
                    setForm((prev: any) => {
                      const arr = [...prev.products_services];
                      arr[i] = e.target.value;
                      return { ...prev, products_services: arr };
                    })
                  }
                />
                <Button variant="outline" onClick={() => removeProductLine(i)}>
                  Sil
                </Button>
              </div>
            ))}

            <Button onClick={addProductLine} variant="outline">
              + Satır Ekle
            </Button>

            <Button
              className="bg-orange-600 hover:bg-orange-500"
              onClick={saveCorporateProfile}
            >
              Kaydet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
