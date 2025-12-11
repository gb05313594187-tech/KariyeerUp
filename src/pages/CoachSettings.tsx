// src/pages/CoachSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function CoachSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    avatar_url: "",
    bio: "",          // Kısa özet
    education: "",    // Eğitim & sertifikalar
    experience: "",   // İş deneyimi
    methodology: "",  // Koçluk yaklaşımı
  });

  // ---------------------------------------------------------------------------
  // 1) Koça bağlı kaydı Supabase'ten çek
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
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
    };

    load();
  }, []);

  // ---------------------------------------------------------------------------
  // 2) Kaydet
  // ---------------------------------------------------------------------------
  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    await supabase
      .from("app_2dff6511da_coaches")
      .update({
        full_name: formData.full_name,
        title: formData.title, // veritabanında dursun ama ekranda değiştirilmiyor
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        education: formData.education,
        experience: formData.experience,
        methodology: formData.methodology,
      })
      .eq("user_id", user.id);

    setSaving(false);
    alert("Profesyonel özgeçmişin güncellendi ✅");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Koç profili yükleniyor...
      </div>
    );
  }

  const avatarSrc =
    formData.avatar_url ||
    "https://api.dicebear.com/7.x/adventurer/svg?seed=coach";

  // CV önizlemesi için basit derleme
  const previewNameLine = `${formData.full_name || "Ad Soyad"} – Kariyer Koçu`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Fotoğraf */}
          <div className="relative">
            <div className="w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white/10">
              <img
                src={avatarSrc}
                alt={formData.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white" />
            </span>
          </div>

          {/* Metin */}
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] mb-3 opacity-80">
              Koç Ayarları · Profesyonel Özgeçmiş
            </p>
            <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
              {formData.full_name || "Ad Soyadını Güncelle"}
            </h1>
            <p className="text-lg md:text-xl font-medium text-orange-100 mb-3">
              Kariyer Koçu
            </p>
            <p className="text-sm md:text-base text-orange-50/90 max-w-xl">
              Buradaki bilgiler hem koç kartında hem de herkese açık profilinde
              görünecek. Bu alan senin profesyonel CV&apos;nin vitrini.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ANA İÇERİK: FORM + CV ÖNİZLEME                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto px-6 mt-8 md:mt-10 grid md:grid-cols-[2fr,1.4fr] gap-8">
        {/* --------------------------- SOL: FORM ---------------------------- */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Profil & Özgeçmiş Formu
            </h2>
            <span className="text-xs text-gray-500">
              Doldurdukça sağ tarafta CV önizlemesi oluşur.
            </span>
          </div>

          {/* Temel Bilgiler */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              1. Temel Bilgiler
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Ad Soyad */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Ad Soyad
                </label>
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                  placeholder="Yağız Alperen"
                />
              </div>

              {/* Rol – Sabit */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Profesyonel Rol
                </label>
                <div className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-gray-100 text-gray-700 flex items-center justify-between">
                  <span>Kariyer Koçu</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-orange-200 text-orange-800 font-semibold">
                    Sabit
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  Bu hesap koç hesabı olarak oluşturulduğu için rol
                  değiştirilemez.
                </p>
              </div>
            </div>

            {/* Fotoğraf URL */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Profil Fotoğrafı URL (tercihen kare, yüksek çözünürlük)
              </label>
              <input
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                placeholder="https://... (Unsplash, Pexels vb.)"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Fotoğrafı değiştirdiğinde hem kartta hem herkese açık profilde
                güncellenir.
              </p>
            </div>
          </section>

          {/* Kısa Özet */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              2. Kısa Özet (Elevator Pitch)
            </h3>
            <p className="text-xs text-gray-500 mb-1">
              3–5 cümlede kim olduğunu, kimlere nasıl değer kattığını anlat.
              Yatırımcı & kurumsal HR buraya bakacak.
            </p>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              placeholder={`10+ yıllık kurumsal deneyime sahip Executive ve Kariyer Koçu. 
Liderlik gelişimi, kariyer geçişi ve performans koçluğu alanlarında çalışıyorum. 
Yöneticilerin ve genç profesyonellerin net kariyer hedefleri belirlemesine ve aksiyon planı oluşturmasına destek oluyorum.`}
            />
          </section>

          {/* Eğitim */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              3. Eğitim & Sertifikalar
            </h3>
            <p className="text-xs text-gray-500 mb-1">
              Her satıra bir madde gelecek şekilde yaz. Örneğin üniversite,
              yüksek lisans, koçluk sertifikaları.
            </p>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              placeholder={`ICF Onaylı Profesyonel Koçluk Programı (PCC Track)
Boğaziçi Üniversitesi – İşletme
ICF Etik ve Mesleki Standartlar Eğitimi`}
            />
          </section>

          {/* Deneyim */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              4. İş Deneyimi & Kariyer Geçmişi
            </h3>
            <p className="text-xs text-gray-500 mb-1">
              Kurumsal rollerini ve koçluk deneyimini öne çıkan 3–5 maddeyle yaz.
            </p>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              placeholder={`Kıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi
Liderlik Gelişim Programları Eğitmeni – Orta & Üst Düzey Yöneticiler
Yurt dışı kariyer geçişi ve mülakat hazırlığı danışmanlığı`}
            />
          </section>

          {/* Metodoloji */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              5. Koçluk Metodolojisi
            </h3>
            <p className="text-xs text-gray-500 mb-1">
              Seanslarda nasıl çalıştığını, hangi yöntemleri kullandığını anlat.
            </p>
            <textarea
              name="methodology"
              value={formData.methodology}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              placeholder={`Seanslarımda çözüm odaklı koçluk, pozitif psikoloji ve aksiyon planı odaklı çalışma yöntemlerini kullanıyorum. 
Her görüşmenin sonunda net bir hedef, gözlemlenebilir çıktılar ve takip planı tanımlıyoruz.`}
            />
          </section>

          {/* Kaydet Butonu */}
          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm"
            >
              {saving ? "Kaydediliyor..." : "Profesyonel Özgeçmişi Kaydet"}
            </Button>
          </div>
        </div>

        {/* ------------------------ SAĞ: CV ÖNİZLEME ------------------------ */}
        <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-7">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Canlı CV Önizlemesi
          </p>

          <div className="border border-gray-200 rounded-xl p-4 md:p-5 text-sm text-gray-8
00 bg-gray-50/60">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
              {previewNameLine}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Kariyeer koç profilinde yatırımcı & danışanların göreceği özet.
            </p>

            {/* Özet */}
            {formData.bio && (
              <section className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Kısa Özet
                </h4>
                <p className="text-sm whitespace-pre-line text-gray-800">
                  {formData.bio}
                </p>
              </section>
            )}

            {/* Eğitim */}
            {formData.education && (
              <section className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Eğitim & Sertifikalar
                </h4>
                <ul className="text-sm space-y-1">
                  {formData.education.split("\n").map((line, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Deneyim */}
            {formData.experience && (
              <section className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Tecrübe & Geçmiş
                </h4>
                <ul className="text-sm space-y-1">
                  {formData.experience.split("\n").map((line, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Metodoloji */}
            {formData.methodology && (
              <section>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Koçluk Metodolojisi
                </h4>
                <p className="text-sm whitespace-pre-line text-gray-800">
                  {formData.methodology}
                </p>
              </section>
            )}

            {!formData.bio &&
              !formData.education &&
              !formData.experience &&
              !formData.methodology && (
                <p className="text-xs text-gray-500">
                  Formu solda doldurdukça burada profesyonel bir özgeçmiş
                  görünümü oluşacak.
                </p>
              )}
          </div>
        </aside>
      </div>
    </div>
  );
}
