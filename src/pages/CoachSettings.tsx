// src/pages/CoachSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  User,
  Settings,
  Camera,
  MapPin,
  Globe2,
  Briefcase,
  Star,
  Clock,
  CheckCircle2,
} from "lucide-react";

/**
 * Bu sayfa sadece koçun kendi profilini düzenlemesi için.
 * Buradaki bilgiler /coach/:id sayfasında danışanlara gösterilecek.
 */

export default function CoachSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [coachId, setCoachId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<any>({
    full_name: "",
    title: "Kariyer Koçu", // sabit – koç hesaplarında değiştirilemez
    location: "Online",
    languages: "",
    experience_years: 5,
    bio: "",
    cv_summary: "",
    methodology: "",
    specializations_text: "",
    education_text: "",
    experience_text: "",
    hourly_rate: "",
    currency: "TRY",
    avatar_url: "",
    linkedin: "",
    website: "",
    instagram: "",
    is_online: true,
  });

  // --------------------------------------------------
  // Yardımcılar
  // --------------------------------------------------
  const handleChange = (field: string) => (e: any) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const toggleOnline = () => {
    setForm((prev: any) => ({
      ...prev,
      is_online: !prev.is_online,
    }));
  };

  // --------------------------------------------------
  // VERİ ÇEKME
  // --------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Aktif kullanıcıyı al
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr || !user) {
          setError("Profil ayarlarını görmek için giriş yapmanız gerekiyor.");
          setLoading(false);
          return;
        }

        setUserEmail(user.email || null);

        // 2) İlgili koç kaydını bul (user_id veya email üzerinden)
        let { data: coach, error: coachErr } = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!coach && user.email) {
          const resultByMail = await supabase
            .from("app_2dff6511da_coaches")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();

          coach = resultByMail.data;
          if (!coachErr) coachErr = resultByMail.error;
        }

        if (coachErr && !coach) {
          // Hiç kayıt yoksa, sadece boş form gösterelim
          console.warn("Koç kaydı bulunamadı, boş form gösteriliyor.");
          setLoading(false);
          return;
        }

        if (coach) {
          setCoachId(coach.id);

          setForm((prev: any) => ({
            ...prev,
            full_name: coach.full_name || coach.name || "",
            title: "Kariyer Koçu", // koç ise sabit
            location: coach.location || "Online",
            languages: coach.languages || "",
            experience_years: coach.experience_years || 5,
            bio: coach.bio || "",
            cv_summary:
              coach.cv_summary ||
              coach.cv ||
              "",
            methodology: coach.methodology || "",
            specializations_text: Array.isArray(coach.specializations)
              ? coach.specializations.join(", ")
              : "",
            education_text: Array.isArray(coach.education_list)
              ? coach.education_list.join("\n")
              : "",
            experience_text: Array.isArray(coach.experience_list)
              ? coach.experience_list.join("\n")
              : "",
            hourly_rate:
              coach.hourly_rate != null ? String(coach.hourly_rate) : "",
            currency: coach.currency || "TRY",
            avatar_url:
              coach.avatar_url ||
              coach.photo_url ||
              "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
            linkedin: coach.linkedin || "",
            website: coach.website || "",
            instagram: coach.instagram || "",
            is_online: coach.is_online ?? true,
          }));
        }
      } catch (err: any) {
        console.error(err);
        setError("Profil ayarları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // --------------------------------------------------
  // KAYDET
  // --------------------------------------------------
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Metinsel alanlardan array üret
      const specializations = form.specializations_text
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const education_list = form.education_text
        .split("\n")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const experience_list = form.experience_text
        .split("\n")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const payload: any = {
        full_name: form.full_name,
        location: form.location,
        languages: form.languages,
        experience_years: Number(form.experience_years) || 0,
        bio: form.bio,
        cv_summary: form.cv_summary,
        methodology: form.methodology,
        specializations,
        education_list,
        experience_list,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        currency: form.currency,
        avatar_url: form.avatar_url,
        linkedin: form.linkedin,
        website: form.website,
        instagram: form.instagram,
        is_online: form.is_online,
      };

      if (!coachId) {
        setError(
          "Bu hesapla ilişkili koç kaydı bulunamadı. Lütfen yönetici ile iletişime geçin."
        );
        setSaving(false);
        return;
      }

      const { error: updateErr } = await supabase
        .from("app_2dff6511da_coaches")
        .update(payload)
        .eq("id", coachId);

      if (updateErr) {
        console.error(updateErr);
        setError("Kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
      } else {
        setSuccess("Profiliniz başarıyla güncellendi.");
      }
    } catch (err) {
      console.error(err);
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç profil ayarlarınız yükleniyor...
      </div>
    );
  }

  if (error && !userEmail) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg border-red-100">
          <CardContent className="p-6 text-center space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Giriş Yapmanız Gerekiyor
            </h2>
            <p className="text-sm text-gray-600">
              Koç profilinizi düzenleyebilmek için önce oturum açmalısınız.
            </p>
            <a href="/login">
              <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                Giriş Yap
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white pb-10 pt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Fotoğraf */}
          <div className="relative">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl overflow-hidden border-4 border-white/70 shadow-xl bg-white">
              {form.avatar_url ? (
                <img
                  src={form.avatar_url}
                  alt={form.full_name || "Koç Profil Fotoğrafı"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute -bottom-2 right-2 px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-gray-800 flex items-center gap-1 shadow-md"
            >
              <Camera className="w-3 h-3" />
              Fotoğraf URL&apos;i
            </button>
          </div>

          {/* Başlık */}
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider">
              <Settings className="w-3 h-3" />
              Koç Profil Ayarları
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">
              {form.full_name || "Adınızı Soyadınızı Girin"}
            </h1>
            <p className="text-sm md:text-base text-orange-50 flex flex-wrap items-center gap-2">
              <span className="font-semibold">Kariyer Koçu</span>
              <span className="w-1 h-1 rounded-full bg-orange-100" />
              <MapPin className="w-4 h-4" />
              <span>{form.location || "Online"}</span>
              <span className="w-1 h-1 rounded-full bg-orange-100" />
              <Globe2 className="w-4 h-4" />
              <span>{form.languages || "TR / EN"}</span>
            </p>
            <div className="flex flex-wrap gap-4 text-xs md:text-sm text-orange-50/90">
              <span className="inline-flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {form.experience_years || 0} yıl profesyonel deneyim
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4" />
                Profil görünürlüğü{" "}
                {form.is_online ? "AÇIK (yayında)" : "KAPALI"}
              </span>
              {form.hourly_rate && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  45 dk seans ücreti{" "}
                  <strong>
                    {form.hourly_rate} {form.currency}
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* Kaydet butonu */}
          <div className="flex flex-col items-stretch gap-3 w-full md:w-auto">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-red-600 hover:bg-orange-50 font-semibold rounded-xl shadow-lg"
            >
              {saving ? "Kaydediliyor..." : "Profili Kaydet"}
            </Button>
            <button
              type="button"
              onClick={toggleOnline}
              className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1 justify-center ${
                form.is_online
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 bg-white/10 text-white"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {form.is_online ? "Profil yayında" : "Profili yayına al"}
            </button>
          </div>
        </div>
      </section>

      {/* Uyarılar */}
      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-3">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
        <p className="text-xs text-gray-500">
          Bu sayfadaki bilgiler yalnızca sana görünür. Kaydettikten sonra
          değişiklikler danışanların gördüğü profil sayfasına yansır.
        </p>
      </div>

      {/* FORM ALANI */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* SOL: Temel Bilgiler */}
          <Card className="border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Ad Soyad
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  placeholder="Örn. Yağız Alperen"
                  value={form.full_name}
                  onChange={handleChange("full_name")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Unvan (Koç tipi)
                </label>
                <input
                  className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                  value="Kariyer Koçu"
                  disabled
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Koç olarak kayıt olduğunuz için unvan sabittir. İleride
                  uzmanlık etiketleri ile zenginleştirilecektir.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Konum
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder="İstanbul, TR / Online"
                    value={form.location}
                    onChange={handleChange("location")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Konuşulan Diller
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder="Örn. Türkçe, İngilizce"
                    value={form.languages}
                    onChange={handleChange("languages")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Deneyim (yıl)
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    value={form.experience_years}
                    onChange={handleChange("experience_years")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    45 dk seans ücreti
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                      placeholder="Örn. 1500"
                      value={form.hourly_rate}
                      onChange={handleChange("hourly_rate")}
                    />
                    <select
                      className="w-20 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                      value={form.currency}
                      onChange={handleChange("currency")}
                    >
                      <option value="TRY">TRY</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Profil Fotoğrafı URL&apos;i
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  placeholder="https://..."
                  value={form.avatar_url}
                  onChange={handleChange("avatar_url")}
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Geçici olarak Unsplash / Pexels gibi telifsiz bir görsel
                  URL&apos;i kullanabilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={handleChange("linkedin")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Web Sitesi
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder="https://..."
                    value={form.website}
                    onChange={handleChange("website")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Instagram
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder="@kullaniciadi"
                    value={form.instagram}
                    onChange={handleChange("instagram")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SAĞ: Özgeçmiş ve Uzmanlık */}
          <Card className="border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-500" />
                Profesyonel Özgeçmiş
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Kısa Özgeçmiş (profilde üstte gözükecek)
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  placeholder="Eğitim geçmişiniz, şu anki rolünüz ve koçluk yaklaşımınızı birkaç cümle ile özetleyin."
                  value={form.bio}
                  onChange={handleChange("bio")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Detaylı Özgeçmiş (CV anlatımı)
                </label>
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  placeholder="İş tecrübeleriniz, üstlendiğiniz sorumluluklar, koçluk yaptığınız alanlar... (klasik CV girişinizi buraya yazabilirsiniz)"
                  value={form.cv_summary}
                  onChange={handleChange("cv_summary")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Uzmanlık Alanları (virgülle ayırın)
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  placeholder="Kariyer Geçişi, Liderlik Koçluğu, Yeni Mezun Koçluğu, Mülakat Hazırlığı..."
                  value={form.specializations_text}
                  onChange={handleChange("specializations_text")}
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Bu alanlar profil kartınızda etiket olarak görünecek.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Eğitim & Sertifikalar (her satıra bir madde)
                  </label>
                  <textarea
                    className="w-full min-h-[90px] rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder={`ICF Onaylı Profesyonel Koçluk Programı (PCC Track)\nBoğaziçi Üniversitesi – Psikoloji Lisans`}
                    value={form.education_text}
                    onChange={handleChange("education_text")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    İş Tecrübeleri (her satıra bir rol)
                  </label>
                  <textarea
                    className="w-full min-h-[90px] rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                    placeholder={`Kıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi\nKariyer ve Liderlik Koçu – Freelance`}
                    value={form.experience_text}
                    onChange={handleChange("experience_text")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  Koçluk Metodolojisi
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  placeholder="Seanslarınızda kullandığınız yaklaşım, araçlar, çerçeveler (çözüm odaklı koçluk, pozitif psikoloji, GROW modeli vb.)"
                  value={form.methodology}
                  onChange={handleChange("methodology")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alt kaydet alanı */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl shadow-md"
          >
            {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
