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
    expertise_tags: [],

    // Adım 3
    cv_file: null,
    certificate_file: null,
    bio: "",
    linkedin: "",
    website: "",

    // Adım 4
    accept_terms: false,
    accept_ethics: false,
  });

  // Checkbox list for uzmanlık alanları
  const expertiseOptions = [
    "Kariyer Geçişi",
    "Liderlik Koçluğu",
    "Yönetici Koçluğu",
    "Girişimcilik",
    "İş-Yaşam Dengesi",
    "Performans Koçluğu",
    "Takım Koçluğu",
    "Kişisel Gelişim",
  ];

  const toggleExpertise = (item) => {
    setFormData((prev) => ({
      ...prev,
      expertise_tags: prev.expertise_tags.includes(item)
        ? prev.expertise_tags.filter((x) => x !== item)
        : [...prev.expertise_tags, item],
    }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accept_terms || !formData.accept_ethics) {
      toast.error("Lütfen tüm onay kutularını işaretleyin.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("coach_applications").insert([
        {
          ...formData,
          cv_file: formData.cv_file?.name || "",
          certificate_file: formData.certificate_file?.name || "",
        },
      ]);

      if (error) {
        console.error(error);
        toast.error("Başvuru gönderilirken hata oluştu.");
      } else {
        toast.success("Başvurunuz başarıyla gönderildi!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Koç Başvuru Formu</h1>

      {/* -------------------- STEP 1 -------------------- */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Kişisel Bilgiler</h2>

          <input
            type="text"
            name="full_name"
            placeholder="Ad Soyad *"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="email"
            name="email"
            placeholder="E-posta *"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="phone"
            placeholder="Telefon *"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="city"
            placeholder="Şehir"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="country"
            placeholder="Ülke"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <Button className="w-full mt-4" onClick={nextStep}>
            Sonraki Adım
          </Button>
        </div>
      )}

      {/* -------------------- STEP 2 -------------------- */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profesyonel Bilgiler</h2>

          <input
            type="text"
            name="certificate_type"
            placeholder="Sertifika Türü *"
            value={formData.certificate_type}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="certificate_year"
            placeholder="Sertifika Yılı *"
            value={formData.certificate_year}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="experience_level"
            placeholder="Koçluk Deneyimi *"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="number"
            name="session_price"
            placeholder="Önerilen Seans Ücreti *"
            value={formData.session_price}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <p className="text-xs text-gray-500">Önerilen: 750 – 2000 ₺</p>

          <div>
            <p className="font-medium mb-2">Uzmanlık Alanları *</p>

            <div className="grid grid-cols-2 gap-2">
              {expertiseOptions.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.expertise_tags.includes(opt)}
                    onChange={() => toggleExpertise(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={prevStep} className="w-1/2">
              Geri
            </Button>
            <Button onClick={nextStep} className="w-1/2">
              Sonraki Adım
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- STEP 3 -------------------- */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Belgeler</h2>

          <label className="block">
            CV / Özgeçmiş *
            <input
              type="file"
              name="cv_file"
              onChange={handleFile}
              className="w-full border rounded p-2 mt-1"
            />
          </label>

          <label className="block">
            Koçluk Sertifikası *
            <input
              type="file"
              name="certificate_file"
              onChange={handleFile}
              className="w-full border rounded p-2 mt-1"
            />
          </label>

          <textarea
            name="bio"
            placeholder="Kısa Biyografi"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <div className="flex gap-2 mt-4">
            <Button onClick={prevStep} className="w-1/2">
              Geri
            </Button>
            <Button onClick={nextStep} className="w-1/2">
              Sonraki Adım
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- STEP 4 -------------------- */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Onay ve Gönder</h2>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="accept_terms"
              checked={formData.accept_terms}
              onChange={handleChange}
              className="mt-1"
            />
            <span>
              Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum.{" "}
              <a href="/terms" className="underline" target="_blank">
                Kullanım Koşulları
              </a>{" "}
              ·{" "}
              <a href="/privacy" className="underline" target="_blank">
                Gizlilik Politikası
              </a>
            </span>
          </label>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="accept_ethics"
              checked={formData.accept_ethics}
              onChange={handleChange}
              className="mt-1"
            />
            <span>
              Etik Kurallara uyacağımı onaylıyorum.{" "}
              <a href="/ethics" className="underline" target="_blank">
                Etik Kurallar
              </a>
            </span>
          </label>

          <div className="flex gap-2 mt-4">
            <Button onClick={prevStep} className="w-1/2">
              Geri
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-red-600 text-white"
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
