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

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

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

  // Step başlıkları
  const stepTitles = {
    1: "Kişisel Bilgiler",
    2: "Profesyonel Bilgiler",
    3: "Belgeler",
    4: "Onay ve Gönder",
  };

  const stepSubtitles = {
    1: "Sizinle iletişim kurabilmemiz için temel bilgilerinizi paylaşın.",
    2: "Koçluk yeterliliklerinizi ve uzmanlık alanlarınızı belirtin.",
    3: "CV, sertifika ve dijital profil linklerinizi ekleyin.",
    4: "Başvurunuzu göndermeden önce son kontrolleri yapın.",
  };

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Koç Başvuru Formu</h1>

      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border mb-6">
        <strong>Başvuru Ön Bilgilendirmesi:</strong>
        <br />
        Aşağıdaki form, profesyonel koçluk yeterliliklerinin doğrulanması amacıyla
        yapılandırılmıştır. Lütfen bilgilerinizi eksiksiz, güncel ve doğrulanabilir
        şekilde girin. Sağladığınız veriler; kalite standartlarımız, etik ilkelerimiz
        ve veri güvenliği politikamız doğrultusunda incelenecek, yalnızca başvuru
        değerlendirme sürecinde kullanılacaktır.
      </p>

      {/* Stepper */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-medium text-gray-600">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full border text-xs 
                ${
                  step === s
                    ? "bg-red-600 text-white border-red-600"
                    : step > s
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {s}
              </div>
              {s !== 4 && (
                <div className="flex-1 h-[2px] mx-1 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-1 bg-red-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-gray-900">
            Adım {step} / 4 – {stepTitles[step]}
          </p>
          <p className="text-xs text-gray-500">{stepSubtitles[step]}</p>
        </div>
      </div>

      {/* -------------------- STEP 1 -------------------- */}
      {step === 1 && (
        <div className="space-y-4 bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Kişisel Bilgiler</h2>

          <input
            type="text"
            name="full_name"
            placeholder="Ad Soyad *"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="E-posta *"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <input
            type="text"
            name="phone"
            placeholder="Telefon *"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="Şehir"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm"
            />
            <input
              type="text"
              name="country"
              placeholder="Ülke"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          <div className="pt-2">
            <Button className="w-full" onClick={nextStep}>
              Sonraki Adım
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- STEP 2 -------------------- */}
      {step === 2 && (
        <div className="space-y-4 bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Profesyonel Bilgiler</h2>

          <select
            name="certificate_type"
            value={formData.certificate_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm bg-white"
          >
            <option value="">Sertifika Türü Seçin *</option>

            {/* ICF */}
            <option value="ICF - ACC">ICF - ACC</option>
            <option value="ICF - PCC">ICF - PCC</option>
            <option value="ICF - MCC">ICF - MCC</option>

            {/* EMCC */}
            <option value="EMCC Foundation">EMCC Foundation</option>
            <option value="EMCC Practitioner">EMCC Practitioner</option>
            <option value="EMCC Senior Practitioner">
              EMCC Senior Practitioner
            </option>

            {/* Üniversite */}
            <option value="Üniversite Sertifikası">Üniversite Sertifikası</option>

            {/* MYK */}
            <option value="MYK (Mesleki Yeterlilik Kurumu)">
              MYK (Mesleki Yeterlilik Kurumu)
            </option>

            {/* Diğer */}
            <option value="Diğer">Diğer</option>
          </select>

          <input
            type="number"
            name="certificate_year"
            placeholder="Sertifika Yılı *"
            value={formData.certificate_year}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
            min="1980"
            max="2100"
          />

          <input
            type="text"
            name="experience_level"
            placeholder="Koçluk Deneyimi * (Örn: 3 yıl, 50+ seans)"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <div>
            <input
              type="number"
              name="session_price"
              placeholder="Önerilen Seans Ücreti *"
              value={formData.session_price}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Önerilen aralık: 750 – 2000 ₺
            </p>
          </div>

          <div>
            <p className="font-medium mb-2 text-sm">Uzmanlık Alanları *</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {expertiseOptions.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={formData.expertise_tags.includes(opt)}
                    onChange={() => toggleExpertise(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={prevStep} variant="outline" className="w-1/2">
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
        <div className="space-y-4 bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Belgeler</h2>

          <label className="block text-sm">
            CV / Özgeçmiş *
            <input
              type="file"
              name="cv_file"
              onChange={handleFile}
              className="w-full border rounded-lg p-2 mt-1 text-sm"
            />
          </label>

          <label className="block text-sm">
            Koçluk Sertifikası *
            <input
              type="file"
              name="certificate_file"
              onChange={handleFile}
              className="w-full border rounded-lg p-2 mt-1 text-sm"
            />
          </label>

          <textarea
            name="bio"
            placeholder="Kısa Biyografi (Arka planınız, çalışma stiliniz, koçluk yaklaşımınız...)"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn (https://linkedin.com/in/...)"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <input
            type="text"
            name="website"
            placeholder="Kişisel Website / Portfolyo (varsa)"
            value={formData.website}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm"
          />

          <p className="text-xs text-gray-500">
            Sorularınız mı var?{" "}
            <a href="mailto:info@kariyeer.com" className="underline">
              info@kariyeer.com
            </a>
          </p>

          <div className="flex gap-2 pt-2">
            <Button onClick={prevStep} variant="outline" className="w-1/2">
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
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white border rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Onay ve Gönder</h2>

          <p className="text-xs text-gray-600">
            Lütfen aşağıdaki bilgileri onayladıktan sonra başvurunuzu gönderin.
          </p>

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

          <div className="flex gap-2 pt-2">
            <Button onClick={prevStep} type="button" variant="outline" className="w-1/2">
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
