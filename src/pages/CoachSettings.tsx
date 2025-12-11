// src/pages/CoachSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function CoachSettings() {
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    avatar_url: "",
    bio: "",
    education: "",
    experience: "",
    methodology: "",
  });

  useEffect(() => {
    loadCoach();
  }, []);

  async function loadCoach() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Koç tablosundan veri çek
    const { data } = await supabase
      .from("app_2dff6511da_coaches")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setCoach(data);
      setFormData({
        full_name: data.full_name || "",
        title: data.title || "",
        avatar_url: data.avatar_url || "",
        bio: data.bio || "",
        education: data.education || "",
        experience: data.experience || "",
        methodology: data.methodology || "",
      });
    }

    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("app_2dff6511da_coaches")
      .update({
        full_name: formData.full_name,
        title: formData.title,
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        education: formData.education,
        experience: formData.experience,
        methodology: formData.methodology,
      })
      .eq("user_id", user.id);

    setLoading(false);
    alert("Profil başarıyla güncellendi!");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* -------------------------------- HERO -------------------------------- */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-10">
          {/* Koç Fotoğrafı */}
          <img
            src={
              formData.avatar_url ||
              "https://api.dicebear.com/7.x/adventurer/svg?seed=coach"
            }
            className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white"
          />

          <div>
            <h1 className="text-4xl font-bold">{formData.full_name}</h1>
            <p className="text-lg opacity-90 mt-1">
              {formData.title || "Kariyer Koçu"}
            </p>
            <p className="mt-4 text-white/80 max-w-xl">
              Profil bilgilerini güncelleyerek daha profesyonel bir görünüm
              oluşturabilirsin.
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------- FORM ALANI ------------------------------ */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-10 rounded-2xl shadow-md border">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Profil Bilgilerini Güncelle
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* İsim */}
          <div>
            <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          {/* Unvan */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Profesyonel Unvan
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Kariyer Koçu, İK Uzmanı vb."
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          {/* Fotoğraf URL */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Profil Fotoğrafı URL
            </label>
            <input
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Koç Hakkında (Bio)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-3 rounded-lg border"
              placeholder="Kendini tanıt, uzmanlık alanların, yaklaşımın..."
            />
          </div>

          {/* Eğitim */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Eğitim & Sertifikalar
            </label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-3 rounded-lg border"
              placeholder="- ICF PCC Sertifikası
- Boğaziçi Üniversitesi İşletme
- Koçluk metodolojisi eğitimleri..."
            />
          </div>

          {/* Tecrübe */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Tecrübe & İş Geçmişi
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-3 rounded-lg border"
              placeholder="- X Teknoloji Şirketi: Kıdemli İK İş Ortağı
- 8 yıl liderlik koçluğu deneyimi..."
            />
          </div>

          {/* Metodoloji */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Koçluk Metodolojisi
            </label>
            <textarea
              name="methodology"
              value={formData.methodology}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-3 rounded-lg border"
              placeholder="Çözüm odaklı koçluk, pozitif psikoloji, aksiyon planlama..."
            />
          </div>
        </div>

        {/* KAYDET */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}
