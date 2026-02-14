// src/pages/CoachApplication.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function CoachApplication() {
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [step, setStep] = useState(1);

  const [me, setMe] = useState<any>(null);

  const [formData, setFormData] = useState({
    // Step 1
    full_name: "",
    email: "",
    phone: "",
    city: "",
    country: "",

    // Step 2
    certificate_type: "",
    selected_certificates: [] as string[],
    certificate_year: "",
    experience_level: "",
    session_price: "",
    expertise_tags: [] as string[],

    // Step 3
    cv_file: null as File | null,
    certificate_file: null as File | null,
    bio: "",
    linkedin: "",
    website: "",

    // Step 4
    accept_terms: false,
    accept_ethics: false,
  });

  const expertiseOptions = [
    "Kariyer Gecisi",
    "Liderlik Koclugu",
    "Yeni Mezun Koclugu",
    "Yoneticiler icin Kocluk",
    "Mulakat Hazirligi",
    "CV & LinkedIn",
    "Performans Gelisimi",
    "Uluslararasi Kariyer",
  ];

  const certificateOptions = ["ICF", "EMCC", "MYK", "ICF + MYK", "Diger"];

  const isOtherSelected = useMemo(
    () => formData.selected_certificates.includes("Diger"),
    [formData.selected_certificates]
  );

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        const user = data?.user;
        if (error || !user) {
          toast.error("Koc basvurusu icin once giris yapmalisin.");
          window.location.href = "/login";
          return;
        }
        setMe(user);

        const { data: existingApps, error: exErr } = await supabase
          .from("coach_applications")
          .select("id,status,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!exErr && existingApps && existingApps.length > 0) {
          const last = existingApps[0];
          if (last?.status === "pending_review" || last?.status === "approved") {
            toast.message("Zaten bir koc basvurun var. Tekrar basvuru alamiyoruz.");
            setStep(5);
            return;
          }
        }

        const { data: prof } = await supabase
          .from("profiles")
          .select("status,is_approved")
          .eq("id", user.id)
          .maybeSingle();

        if (prof?.status === "pending_review" || prof?.is_approved === true) {
          toast.message("Profil durumun zaten incelemede / onayli gorunuyor.");
          setStep(5);
          return;
        }
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (field: "cv_file" | "certificate_file", e: any) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const toggleExpertiseTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.expertise_tags.includes(tag);
      return {
        ...prev,
        expertise_tags: exists
          ? prev.expertise_tags.filter((t) => t !== tag)
          : [...prev.expertise_tags, tag],
      };
    });
  };

  const toggleCertificate = (cert: string) => {
    setFormData((prev) => {
      const exists = prev.selected_certificates.includes(cert);
      const next = exists
        ? prev.selected_certificates.filter((c) => c !== cert)
        : [...prev.selected_certificates, cert];

      const nextCertificateType = next.includes("Diger") ? prev.certificate_type : "";

      return {
        ...prev,
        selected_certificates: next,
        certificate_type: nextCertificateType,
      };
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone) {
        toast.error("Lutfen ad soyad, e-posta ve telefon alanlarini doldurun.");
        return;
      }
    }

    if (step === 2) {
      const hasSelectedCerts = formData.selected_certificates?.length > 0;
      if (!hasSelectedCerts || !formData.experience_level) {
        toast.error("Lutfen en az bir sertifika secin ve deneyim seviyesini belirtin.");
        return;
      }

      if (isOtherSelected && !formData.certificate_type?.trim()) {
        toast.error("\"Diger\" sectiysen kisa bir aciklama yazmalisin.");
        return;
      }
    }

    if (step === 3) {
      if (!formData.cv_file || !formData.certificate_file) {
        toast.error("Lutfen CV ve Sertifika dosyalarini yukleyin.");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => Math.max(1, prev - 1));

  async function uploadToBucket(bucket: string, file: File, prefix: string, userId: string) {
    const ext = file.name.split(".").pop() || "file";
    const fileName = `${prefix}_${userId}_${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      upsert: false,
    });

    if (error) throw error;

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { path: data.path, publicUrl: pub?.publicUrl || null };
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.accept_terms || !formData.accept_ethics) {
      toast.error("Basvuru gondermek icin tum kosullari onaylamalisiniz.");
      return;
    }

    if (!me?.id) {
      toast.error("Giris bilgisi bulunamadi. Lutfen tekrar giris yap.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    try {
      const userId = me.id;

      const { data: existing } = await supabase
        .from("coach_applications")
        .select("id,status,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing?.[0]?.status === "pending_review" || existing?.[0]?.status === "approved") {
        toast.message("Zaten bir koc basvurun var. Tekrar basvuru alamiyoruz.");
        setStep(5);
        return;
      }

      let cv_path: string | null = null;
      let certificate_path: string | null = null;

      if (formData.cv_file) {
        const up = await uploadToBucket("coach_uploads", formData.cv_file, "cv", userId);
        cv_path = up.path;
      }

      if (formData.certificate_file) {
        const up = await uploadToBucket("coach_uploads", formData.certificate_file, "certificate", userId);
        certificate_path = up.path;
      }

      const combinedCertificateType =
        formData.selected_certificates?.length > 0
          ? formData.selected_certificates.join(", ")
          : formData.certificate_type;

      const payload: any = {
        user_id: userId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        certificate_type: combinedCertificateType,
        certificate_year: formData.certificate_year,
        experience_level: formData.experience_level,
        session_price: formData.session_price ? Number(formData.session_price) : null,
        expertise_tags: formData.expertise_tags,
        cv_path,
        certificate_path,
        bio: formData.bio,
        linkedin: formData.linkedin,
        website: formData.website,
        accept_terms: formData.accept_terms,
        accept_ethics: formData.accept_ethics,
        status: "pending_review",
      };

      const { error: insertError } = await supabase.from("coach_applications").insert(payload);
      if (insertError) {
        console.error(insertError);
        toast.error("Basvuru kaydedilirken bir hata olustu (RLS/Policy olabilir).");
        return;
      }

      await supabase
        .from("profiles")
        .update({ status: "pending_review", is_approved: false })
        .eq("id", userId);

      setStep(5);
      toast.success("Basvurunuz alindi. En kisa surede inceleyecegiz.");
    } catch (err: any) {
      console.error(err);
      toast.error("Beklenmeyen bir hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Sayfa yukleniyor...</p>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 space-y-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Basvurunuz Alindi</h1>
          <p className="text-slate-600 text-sm">
            Koc basvurunuz kaydedildi. Ekibimiz belgelerinizi inceledikten sonra sizinle e-posta uzerinden iletisime gececek.
          </p>
          <p className="text-slate-500 text-xs">
            Onaylandiginizda profiliniz Koclar sayfasinda gorunur hale gelecek ve koc paneline erisebileceksiniz.
          </p>

          <div className="flex gap-3 justify-center mt-4">
            <Button onClick={() => (window.location.href = "/")}>Ana Sayfaya Don</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Koc Basvuru Formu</h1>
          <p className="text-sm text-slate-600 mt-1">
            Koc agina katilmak icin formu eksiksiz doldurun. Basvurunuz ekip tarafindan incelenecektir.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${step >= s ? "bg-slate-900" : "bg-slate-200"}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">1. Kisisel Bilgiler</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Ad Soyad</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Sehir</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Ulke</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">2. Profesyonel Bilgiler</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Sertifika Turu (birden fazla secebilirsiniz)
                </label>

                <div className="flex flex-wrap gap-2">
                  {certificateOptions.map((cert) => {
                    const active = formData.selected_certificates.includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCertificate(cert)}
                        className={`px-3 py-1 rounded-full text-xs border ${
                          active
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {cert}
                      </button>
                    );
                  })}
                </div>

                {isOtherSelected && (
                  <input
                    type="text"
                    name="certificate_type"
                    value={formData.certificate_type}
                    onChange={handleChange}
                    placeholder="Diger sertifika(lar) / aciklama"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                )}

                <p className="text-xs text-slate-500">
                  Sectiklerin kayda tek alan olarak (ICF, EMCC...) yazilir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Sertifika Yili</label>
                  <input
                    type="text"
                    name="certificate_year"
                    value={formData.certificate_year}
                    onChange={handleChange}
                    placeholder="2020"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Deneyim Seviyesi</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">Secin</option>
                    <option value="junior">1-2 Yil</option>
                    <option value="mid">3-5 Yil</option>
                    <option value="senior">5+ Yil</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Seans Ucreti (TL)</label>
                  <input
                    type="number"
                    name="session_price"
                    value={formData.session_price}
                    onChange={handleChange}
                    placeholder="Orn: 750"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Uzmanlik Alanlari</label>
                <p className="text-xs text-slate-500">Birden fazla alan secebilirsiniz.</p>

                <div className="flex flex-wrap gap-2">
                  {expertiseOptions.map((tag) => {
                    const active = formData.expertise_tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleExpertiseTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs border ${
                          active
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">3. Belgeler ve Profil</h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">CV (PDF / DOC)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange("cv_file", e)}
                    className="w-full text-sm"
                  />
                  {formData.cv_file && (
                    <p className="text-xs text-slate-500 mt-1">Secilen dosya: {formData.cv_file.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Sertifika (PDF / JPG / PNG)</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("certificate_file", e)}
                    className="w-full text-sm"
                  />
                  {formData.certificate_file && (
                    <p className="text-xs text-slate-500 mt-1">
                      Secilen dosya: {formData.certificate_file.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Kisa Biyografi</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Kocluk yaklasiminiz, deneyimleriniz ve calistiginiz hedef kitle hakkinda kisa bir ozet..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">LinkedIn Profili</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Web Sitesi (varsa)</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">4. Kosullar ve Onay</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    id="accept_terms"
                    name="accept_terms"
                    type="checkbox"
                    checked={formData.accept_terms}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="accept_terms" className="text-sm text-slate-700">
                    Kullanim kosullarini ve komisyon yapisini okudum, kabul ediyorum.
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    id="accept_ethics"
                    name="accept_ethics"
                    type="checkbox"
                    checked={formData.accept_ethics}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="accept_ethics" className="text-sm text-slate-700">
                    Profesyonel etik kurallara uygun calisacagimi ve gizlilik ilkelerine uyacagimi taahhut ediyorum.
                  </label>
                </div>

                <p className="text-xs text-slate-500">
                  Basvurunuz degerlendirilecek. Onaylanirsa profiliniz yayina alinir ve koc paneline erisirsiniz.
                </p>
              </div>
            </div>
          )}

          {/* NAV */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevStep} disabled={loading}>
                  Geri
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step < 4 && (
                <Button type="button" onClick={handleNextStep} disabled={loading}>
                  Ileri
                </Button>
              )}

              {step === 4 && (
                <Button
                  type="submit"
                  disabled={loading || !formData.accept_terms || !formData.accept_ethics}
                >
                  {loading ? "Basvuru Gonderiliyor..." : "Basvuruyu Gonder"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
