// src/pages/CoachApplication.tsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function CoachApplication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    certificate: "",
    experience: "",
    expertise: "",
    accept_terms: false,
    accept_ethics: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.phone) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }

    if (!formData.accept_terms || !formData.accept_ethics) {
      toast.error("Lütfen tüm onay kutularını işaretleyin.");
      return;
    }

    setLoading(true);

    try {
      // Supabase'e kaydetmek istemiyorsan bu bloğu silebilirsin
      const { error } = await supabase
        .from("coach_applications")
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            certificate: formData.certificate,
            experience: formData.experience,
            expertise: formData.expertise,
            accept_terms: formData.accept_terms,
            accept_ethics: formData.accept_ethics,
          },
        ]);

      if (error) {
        console.error(error);
        toast.error("Başvuru gönderilirken bir hata oluştu.");
      } else {
        toast.success("Başvurunuz başarıyla gönderildi.");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Koç Başvuru Formu</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-4"
      >
        {/* Ad Soyad */}
        <div>
          <label className="block text-sm font-medium mb-1">Ad Soyad</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Adınız Soyadınız"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* E-posta */}
        <div>
          <label className="block text-sm font-medium mb-1">E-posta</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@mail.com"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+90 5xx xxx xx xx"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Sertifika */}
        <div>
          <label className="block text-sm font-medium mb-1">Sertifika</label>
          <input
            type="text"
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
            placeholder="ICF / EMCC / Üniversite vb."
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Deneyim */}
        <div>
          <label className="block text-sm font-medium mb-1">Deneyim</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Kaç yıllık deneyiminiz var?"
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Uzmanlık Alanı */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Uzmanlık Alanı
          </label>
          <textarea
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            placeholder="Kariyer, liderlik, mülakat hazırlığı vb."
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Kullanım koşulları */}
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
            <span className="block mt-1">
              <a
                href="/terms"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Kullanım Koşulları
              </a>{" "}
              ·{" "}
              <a
                href="/privacy"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Gizlilik Politikası
              </a>
            </span>
          </span>
        </label>

        {/* Etik kurallar */}
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
            <span className="block mt-1">
              <a
                href="/ethics"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Etik Kurallar
              </a>
            </span>
          </span>
        </label>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
          </Button>
        </div>
      </form>
    </div>
  );
}
