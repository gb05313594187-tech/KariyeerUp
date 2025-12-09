// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async () => {
    if (!formData.accept_terms || !formData.accept_ethics) {
      toast.error("Lütfen tüm onay kutularını işaretleyin.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("coach_applications")
      .insert([formData]);

    setLoading(false);

    if (error) {
      console.log(error);
      toast.error("Başvuru gönderilirken hata oluştu.");
      return;
    }

    toast.success("Başvurunuz başarıyla gönderildi!");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Koç Başvuru Formu</h1>

      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">

        <div>
          <label className="font-medium">Ad Soyad</label>
          <input
            name="full_name"
            type="text"
            className="w-full p-3 border rounded"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Adınız Soyadınız"
          />
        </div>

        <div>
          <label className="font-medium">E-posta</label>
          <input
            name="email"
            type="email"
            className="w-full p-3 border rounded"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@mail.com"
          />
        </div>

        <div>
          <label className="font-medium">Telefon</label>
          <input
            name="phone"
            type="text"
            className="w-full p-3 border rounded"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+90 5xx xxx xx xx"
          />
        </div>

        <div>
          <label className="font-medium">Sertifika</label>
          <input
            name="certificate"
            type="text"
            className="w-full p-3 border rounded"
            value={formData.certificate}
            onChange={handleChange}
            placeholder="ICF / EMCC / Üniversite vb."
          />
        </div>

        <div>
          <label className="font-medium">Deneyim</label>
          <textarea
            name="experience"
            className="w-full p-3 border rounded"
            rows={3}
            value={formData.experience}
            onChange={handleChange}
            placeholder="Kaç yıllık deneyiminiz var?"
          ></textarea>
        </div>

        <div>
          <label className="font-medium">Uzmanlık Alanı</label>
          <textarea
            name="expertise"
            className="w-full p-3 border rounded"
            rows={3}
            value={formData.expertise}
            onChange={handleChange}
            placeholder="Kariyer, liderlik, mülakat hazırlığı vb."
          ></textarea>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="accept_terms"
            checked={formData.accept_terms}
            onChange={handleChange}
          />
          <label className="text-sm">
            Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum.
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="accept_ethics"
            checked={formData.accept_ethics}
            onChange={handleChange}
          />
          <label className="text-sm">Etik Kurallara uyacağımı onaylıyorum.</label>
        </div>

        <Button
          className="bg-red-500 text-white w-full py-3 rounded mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
        </Button>
      </div>
    </div>
  );
}
