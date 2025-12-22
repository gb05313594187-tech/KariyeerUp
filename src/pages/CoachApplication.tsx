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
    certificate_type: "", // "Diğer" seçilirse açıklama
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
    "Kariyer Geçişi",
    "Liderlik Koçluğu",
    "Yeni Mezun Koçluğu",
    "Yöneticiler için Koçluk",
    "Mülakat Hazırlığı",
    "CV & LinkedIn",
    "Performans Gelişimi",
    "Uluslararası Kariyer",
  ];

  const certificateOptions = ["ICF", "EMCC", "MYK", "ICF + MYK", "Diğer"];

  const isOtherSelected = useMemo(
    () => formData.selected_certificates.includes("Diğer"),
    [formData.selected_certificates]
  );

  /* ---------------- BOOT ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        const user = data?.user;
        if (error || !user) {
          toast.error("Koç başvurusu için önce giriş yapmalısın.");
          window.location.href = "/login";
          return;
        }
        setMe(user);

        // Kullanıcı daha önce başvurmuş mu?
        const { data: existingApps, error: exErr } = await supabase
          .from("coach_applications")
          .select("id,status,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!exErr && existingApps && existingApps.length > 0) {
          const last = existingApps[0];
          if (last?.status === "pending_review" || last?.status === "approved") {
            toast.message("Zaten bir koç başvurun var. Tekrar başvuru alamıyoruz.");
            setStep(5);
            return;
          }
        }

        // Profilde pending/approved ise de engelleyebilirsin (opsiyonel)
        const { data: prof } = await supabase
          .from("profiles")
          .select("status,is_approved")
          .eq("id", user.id)
          .maybeSingle();

        if (prof?.status === "pending_review" || prof?.is_approved === true) {
          toast.message("Profil durumun zaten incelemede / onaylı görünüyor.");
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

      // Diğer kaldırıldıysa açıklamayı temizle
      const nextCertificateType = next.includes("Diğer") ? prev.certificate_type : "";

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
        toast.error("Lütfen ad soyad, e-posta ve telefon alanlarını doldurun.");
        return;
      }
    }

    if (step === 2) {
      const hasSelectedCerts = formData.selected_certificates?.length > 0;
      if (!hasSelectedCerts || !formData.experience_level) {
        toast.error("Lütfen en az bir sertifika seçin ve deneyim seviyesini belirtin.");
        return;
      }

      if (isOtherSelected && !formData.certificate_type?.trim()) {
        toast.error("“Diğer” seçtiysen kısa bir açıklama yazmalısın.");
        return;
      }
    }

    if (step === 3) {
      if (!formData.cv_file || !formData.certificate_file) {
        toast.error("Lütfen CV ve Sertifika dosyalarını yükleyin.");
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

    // public url (bucket public ise)
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { path: data.path, publicUrl: pub?.publicUrl || null };
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.accept_terms || !formData.accept_ethics) {
      toast.error("Başvuru göndermek için tüm koşulları onaylamalısınız.");
      return;
    }

    if (!me?.id) {
      toast.error("Giriş bilgisi bulunamadı. Lütfen tekrar giriş yap.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    try {
      const userId = me.id;

      // Tekrar kontrol: aynı user pending ise engelle
      const { data: existing } = await supabase
        .from("coach_applications")
        .select("id,status,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing?.[0]?.status === "pending_review" || existing?.[0]?.status === "approved") {
        toast.message("Zaten bir koç başvurun var. Tekrar başvuru alamıyoruz.");
        setStep(5);
        return;
      }

      // Upload
      let cv_path: string | null = null;
      let certificate_path: string | null = null;
      let cv_public_url: string | null = null;
      let certificate_public_url: string | null = null;

      if (formData.cv_file) {
        const up = await uploadToBucket("coach_uploads", formData.cv_file, "cv", userId);
        cv_path = up.path;
        cv_public_url = up.publicUrl;
      }

      if (formData.certificate_file) {
        const up = await uploadToBucket("coach_uploads", formData.certificate_file, "certificate", userId);
        certificate_path = up.path;
        certificate_public_url = up.publicUrl;
      }

      const combinedCertificateType =
        formData.selected_certificates?.length > 0
          ? formData.selected_certificates.join(", ")
          : formData.certificate_type;

      const payload: any = {
        user_id: userId,

        // Step 1
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,

        // Step 2
        certificate_type: combinedCertificateType,
        certificate_year: formData.certificate_year,
        experience_level: formData.experience_level,
        session_price: formData.session_price ? Number(formData.session_price) : null,
        expertise_tags: formData.expertise_tags,

        // Step 3
        cv_path,
        certificate_path,
        // Admin ekranda görmek istersen (DB’de kolon yoksa şimdilik yazma)
        // cv_public_url,
        // certificate_public_url,
        bio: formData.bio,
        linkedin: formData.linkedin,
        website: formData.website,

        // Step 4
        accept_terms: formData.accept_terms,
        accept_ethics: formData.accept_ethics,

        status: "pending_review",
      };

      const { error: insertError } = await supabase.from("coach_applications").insert(payload);
      if (insertError) {
        console.error(insertError);
        toast.error("Başvuru kaydedilirken bir hata oluştu (RLS/Policy olabilir).");
        return;
      }

      await supabase
        .from("profiles")
        .update({ status: "pending_review", is_approved: false })
        .eq("id", userId);

      setStep(5);
      toast.success("Başvurunuz alındı. En kısa sürede inceleyeceğiz. 🎉");
    } catch (err: any) {
      console.error(err);
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (booting) return null;

  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 space-y-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Başvurunuz Alındı 🎉</h1>
          <p className="text-slate-600 text-sm">
            Koç başvurunuz kaydedildi. Ekibimiz belgelerinizi inceledikten sonra sizinle e-posta üzerinden iletişime geçecek.
          </p>
          <p className="text-slate-500 text-xs">
            Onaylandığınızda profiliniz Koçlar sayfasında görünür hale gelecek ve koç paneline erişebileceksiniz.
          </p>

          <div className="flex gap-3 justify-center mt-4">
            <Button onClick={() => (window.location.href = "/")}>Ana Sayfaya Dön</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Koç Başvuru Formu</h1>
          <p className="text-sm text-slate-600 mt-1">
            Koç ağına katılmak için formu eksiksiz doldurun. Başvurunuz ekip tarafından incelenecektir.
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
              <h2 className="text-lg font-semibold text-slate-900">1. Kişisel Bilgiler</h2>

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
                  <label className="text-sm font-medium text-slate-700">Şehir</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Ülke</label>
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
                  Sertifika Türü (birden fazla seçebilirsiniz)
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
                    placeholder="Diğer sertifika(lar) / açıklama"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                )}

                <p className="text-xs text-slate-500">
                  Seçtiklerin kayda “tek alan” olarak (ICF, EMCC...) yazılır.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Sertifika Yılı</label>
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
                    <option value="">Seçin</option>
                    <option value="junior">1-2 Yıl</option>
                    <option value="mid">3-5 Yıl</option>
                    <option value="senior">5+ Yıl</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Seans Ücreti (₺)</label>
                  <input
                    type="number"
                    name="session_price"
                    value={formData.session_price}
                    onChange={handleChange}
                    placeholder="Örn: 750"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Uzmanlık Alanları</label>
                <p className="text-xs text-slate-500">Birden fazla alan seçebilirsiniz.</p>

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
                    <p className="text-xs text-slate-500 mt-1">Seçilen dosya: {formData.cv_file.name}</p>
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
                      Seçilen dosya: {formData.certificate_file.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Kısa Biyografi</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Koçluk yaklaşımınız, deneyimleriniz ve çalıştığınız hedef kitle hakkında kısa bir özet..."
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
              <h2 className="text-lg font-semibold text-slate-900">4. Koşullar ve Onay</h2>

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
                    Kullanım koşullarını ve komisyon yapısını okudum, kabul ediyorum.
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
                    Profesyonel etik kurallara uygun çalışacağımı ve gizlilik ilkelerine uyacağımı taahhüt ediyorum.
                  </label>
                </div>

                <p className="text-xs text-slate-500">
                  Başvurunuz değerlendirilecek. Onaylanırsa profiliniz yayına alınır ve koç paneline erişirsiniz.
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
                  İleri
                </Button>
              )}

              {step === 4 && (
                <Button
                  type="submit"
                  disabled={loading || !formData.accept_terms || !formData.accept_ethics}
                >
                  {loading ? "Başvuru Gönderiliyor..." : "Başvuruyu Gönder"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
