// src/pages/CoachApplication.tsx
// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function CoachApplication() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Adım 1
    full_name: "",
    email: "",
    phone: "",
    city: "",
    country: "",

    // Adım 2
    certificate_type: "",
    certificate_year: "",
    experience_level: "",
    session_price: "",
    expertise_tags: [] as string[],

    // Adım 3
    cv_file: null as File | null,
    certificate_file: null as File | null,
    bio: "",
    linkedin: "",
    website: "",

    // Adım 4
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

  // ---------- Helpers ----------
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (field: "cv_file" | "certificate_file", e: any) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
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

  const handleNextStep = () => {
    // Basit step validation (çok kasmıyoruz)
    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone) {
        toast.error("Lütfen ad soyad, e-posta ve telefon alanlarını doldurun.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.certificate_type || !formData.experience_level) {
        toast.error("Lütfen sertifika türü ve deneyim seviyesini seçin.");
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

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // ---------- Submit ----------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.accept_terms || !formData.accept_ethics) {
      toast.error("Başvuru göndermek için tüm koşulları onaylamalısınız.");
      return;
    }

    setLoading(true);

    try {
      // 1) Aktif kullanıcıyı al
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(userError);
        toast.error("Devam etmek için lütfen giriş yapın.");
        setLoading(false);
        return;
      }

      const userId = user.id;

      // 2) Dosyaları Storage'a yükle
      let cv_path: string | null = null;
      let certificate_path: string | null = null;

      // CV
      if (formData.cv_file) {
        const ext = formData.cv_file.name.split(".").pop();
        const fileName = `cv_${userId}_${Date.now()}.${ext}`;

        const { data: cvData, error: cvError } = await supabase.storage
          .from("coach_uploads")
          .upload(fileName, formData.cv_file);

        if (cvError) {
          console.error(cvError);
          toast.error("CV yüklenirken bir hata oluştu.");
          setLoading(false);
          return;
        }

        cv_path = cvData?.path ?? null;
      }

      // Sertifika
      if (formData.certificate_file) {
        const ext = formData.certificate_file.name.split(".").pop();
        const fileName = `certificate_${userId}_${Date.now()}.${ext}`;

        const { data: certData, error: certError } = await supabase.storage
          .from("coach_uploads")
          .upload(fileName, formData.certificate_file);

        if (certError) {
          console.error(certError);
          toast.error("Sertifika yüklenirken bir hata oluştu.");
          setLoading(false);
          return;
        }

        certificate_path = certData?.path ?? null;
      }

      // 3) coach_applications tablosuna kayıt ekle
      const { error: insertError } = await supabase
        .from("coach_applications")
        .insert({
          user_id: userId,

          // Adım 1
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,

          // Adım 2
          certificate_type: formData.certificate_type,
          certificate_year: formData.certificate_year,
          experience_level: formData.experience_level,
          session_price: formData.session_price
            ? Number(formData.session_price)
            : null,
          expertise_tags: formData.expertise_tags,

          // Adım 3
          cv_path,
          certificate_path,
          bio: formData.bio,
          linkedin: formData.linkedin,
          website: formData.website,

          // Adım 4
          accept_terms: formData.accept_terms,
          accept_ethics: formData.accept_ethics,

          status: "pending_review",
        });

      if (insertError) {
        console.error(insertError);
        toast.error("Başvuru kaydedilirken bir hata oluştu.");
        setLoading(false);
        return;
      }

      // 4) profiles tablosunu güncelle (opsiyonel ama güzel)
      await supabase
        .from("profiles")
        .update({
          status: "pending_review",
          is_approved: false,
        })
        .eq("id", userId);

      // 5) Başarılı ekran
      setStep(5);
      toast.success("Başvurunuz alındı. En kısa sürede inceleyeceğiz. 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  if (step === 5) {
    // Başarı ekranı
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 space-y-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Başvurunuz Alındı 🎉
          </h1>
          <p className="text-slate-600 text-sm">
            Kariyeer koç başvurunuz başarıyla kaydedildi. Ekibimiz belgelerinizi
            inceledikten sonra sizinle e-posta üzerinden iletişime geçecek.
          </p>
          <p className="text-slate-500 text-xs">
            Onaylandığınızda profiliniz Koçlar sayfasında görünür hale gelecek
            ve koç paneline erişebileceksiniz.
          </p>

          <div className="flex gap-3 justify-center mt-4">
            <Button onClick={() => (window.location.href = "/")}>
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Koç Başvuru Formu
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kariyeer koç ağına katılmak için formu eksiksiz doldurmanız
            gerekiyor. Başvurunuz ekibimiz tarafından incelenecektir.
          </p>
        </div>

        {/* Adım göstergesi */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${
                step >= s ? "bg-slate-900" : "bg-slate-200"
              }`}
            ></div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                1. Kişisel Bilgiler
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Ad Soyad
                  </label>
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
                  <label className="text-sm font-medium text-slate-700">
                    E-posta
                  </label>
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
                  <label className="text-sm font-medium text-slate-700">
                    Telefon
                  </label>
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
                  <label className="text-sm font-medium text-slate-700">
                    Şehir
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Ülke
                  </label>
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
              <h2 className="text-lg font-semibold text-slate-900">
                2. Profesyonel Bilgiler
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Sertifika Türü
                  </label>
                  <input
                    type="text"
                    name="certificate_type"
                    value={formData.certificate_type}
                    onChange={handleChange}
                    placeholder="ICF, EMCC vb."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Sertifika Yılı
                  </label>
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
                  <label className="text-sm font-medium text-slate-700">
                    Deneyim Seviyesi
                  </label>
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
                  <label className="text-sm font-medium text-slate-700">
                    Seans Ücreti (₺)
                  </label>
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
                <label className="text-sm font-medium text-slate-700">
                  Uzmanlık Alanları
                </label>
                <p className="text-xs text-slate-500 mb-1">
                  Birden fazla alan seçebilirsiniz.
                </p>
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
              <h2 className="text-lg font-semibold text-slate-900">
                3. Belgeler ve Profil
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    CV (PDF / DOC)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange("cv_file", e)}
                    className="w-full text-sm"
                  />
                  {formData.cv_file && (
                    <p className="text-xs text-slate-500 mt-1">
                      Seçilen dosya: {formData.cv_file.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Sertifika (PDF / JPG / PNG)
                  </label>
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
                  <label className="text-sm font-medium text-slate-700">
                    Kısa Biyografi
                  </label>
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
                    <label className="text-sm font-medium text-slate-700">
                      LinkedIn Profili
                    </label>
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
                    <label className="text-sm font-medium text-slate-700">
                      Web Sitesi (varsa)
                    </label>
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
              <h2 className="text-lg font-semibold text-slate-900">
                4. Koşullar ve Onay
              </h2>

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
                  <label
                    htmlFor="accept_terms"
                    className="text-sm text-slate-700"
                  >
                    Kariyeer platformu kullanım koşullarını ve komisyon
                    yapısını okudum, kabul ediyorum.
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
                  <label
                    htmlFor="accept_ethics"
                    className="text-sm text-slate-700"
                  >
                    Profesyonel koçluk etik kurallarına uygun çalışacağımı,
                    gizlilik ve güven ilkelerine uyacağımı taahhüt ediyorum.
                  </label>
                </div>

                <p className="text-xs text-slate-500">
                  Başvurunuz ekibimiz tarafından değerlendirilecek. Onaylanması
                  halinde profiliniz yayına alınacak ve randevu almaya açık
                  hale gelecektir.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  Geri
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step < 4 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  İleri
                </Button>
              )}

              {step === 4 && (
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.accept_terms ||
                    !formData.accept_ethics
                  }
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
