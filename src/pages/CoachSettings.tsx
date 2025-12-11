// src/pages/CoachSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Save,
  ImageIcon,
  Award,
  Briefcase,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const specializationOptions = [
  "Kariyer Geçişi",
  "Liderlik Koçluğu",
  "Yeni Mezun Koçluğu",
  "Yöneticiler için Koçluk",
  "Mülakat Hazırlığı",
  "CV & LinkedIn",
  "Yetenek Yönetimi",
  "Kurumsal Koçluk",
];

export default function CoachSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coachId, setCoachId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
    methodology: "",
    cv_url: "",
    specializations: [] as string[],
    education_text: "",
    experience_text: "",
  });

  // ------------------------------------------------
  // 1) GİRİŞ YAPAN KULLANICININ KENDİ KOÇ KAYDINI ÇEK
  // ------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Auth error:", userError);
          navigate("/login");
          return;
        }

        setEmail(user.email || "");

        const { data, error } = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("CoachSettings fetch error:", error);
          toast.error("Koç profili yüklenirken bir hata oluştu.");
          return;
        }

        if (!data) {
          toast.error(
            "Bu hesapla ilişkilendirilmiş bir koç profili bulunamadı."
          );
          return;
        }

        setCoachId(data.id);

        setForm({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || data.photo_url || "",
          bio: data.bio || "",
          methodology: data.methodology || "",
          cv_url: data.cv_url || "",
          specializations: data.specializations || [],
          education_text: (data.education_list || []).join("\n"),
          experience_text: (data.experience_list || []).join("\n"),
        });
      } catch (err) {
        console.error("Unexpected CoachSettings error:", err);
        toast.error("Koç ayarları yüklenirken beklenmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // ------------------------------------------------
  // 2) FORM DEĞİŞİKLİKLERİ
  // ------------------------------------------------
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (tag: string) => {
    setForm((prev) => {
      const exists = prev.specializations.includes(tag);
      return {
        ...prev,
        specializations: exists
          ? prev.specializations.filter((t) => t !== tag)
          : [...prev.specializations, tag],
      };
    });
  };

  // ------------------------------------------------
  // 3) KAYDET BUTONU
  // ------------------------------------------------
  const handleSave = async () => {
    if (!coachId) {
      toast.error("Koç kaydı bulunamadı. Lütfen daha sonra tekrar deneyin.");
      return;
    }

    if (!form.full_name.trim()) {
      toast.error("İsim alanı boş bırakılamaz.");
      return;
    }

    setSaving(true);
    try {
      const education_list = form.education_text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const experience_list = form.experience_text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const payload = {
        full_name: form.full_name.trim(),
        avatar_url: form.avatar_url.trim() || null,
        bio: form.bio.trim(),
        methodology: form.methodology.trim(),
        cv_url: form.cv_url.trim() || null,
        specializations: form.specializations,
        education_list,
        experience_list,
        status: "active",
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("app_2dff6511da_coaches")
        .update(payload)
        .eq("id", coachId);

      if (error) {
        console.error("CoachSettings update error:", error);
        toast.error("Değişiklikler kaydedilemedi.");
        return;
      }

      toast.success("Profilin başarıyla güncellendi.");
    } catch (err) {
      console.error("CoachSettings save error:", err);
      toast.error("Kaydederken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------
  // 4) YÜKLENİYOR EKRANI
  // ------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç ayarların yükleniyor...
      </div>
    );
  }

  if (!coachId) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-700">
        Bu hesapla eşleştirilmiş bir koç profili bulunamadı.
      </div>
    );
  }

  // ------------------------------------------------
  // 5) SAYFA
  // ------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide">
              <CheckCircle2 className="w-3 h-3 text-lime-300" />
              <span>Koç Ayarları</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Profesyonel Koç Profilini
              <br />
              <span className="text-yellow-300">Yatırımcı Seviyesinde</span>{" "}
              Hazırla
            </h1>

            <p className="text-sm md:text-base text-orange-50 max-w-xl">
              Bu sayfada doldurduğun bilgiler, herkese açık koç profilinde
              görüntülenir. Fotoğrafın, uzmanlık etiketlerin, özgeçmişin ve
              metodolojinle tam anlamıyla profesyonel bir vitrin oluştur.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-orange-50/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300" />
                <span>Özgeçmiş &amp; Metodoloji</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300" />
                <span>Eğitim &amp; Deneyim Listesi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300" />
                <span>Uzmanlık Etiketleri</span>
              </div>
            </div>
          </div>

          {/* Avatar Kartı */}
          <div className="w-full md:w-80">
            <Card className="bg-white/95 border-none shadow-xl rounded-2xl">
              <CardContent className="pt-6 pb-5 flex flex-col items-center gap-4">
                <div className="relative">
                  {form.avatar_url ? (
                    <img
                      src={form.avatar_url}
                      alt={form.full_name || "Koç Avatarı"}
                      className="w-28 h-28 rounded-2xl object-cover shadow-md border border-gray-200 bg-gray-50"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {form.full_name || "İsmini Gir"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {/* Kullanıcı talebi: unvan sabit olsun */}
                    Kariyer Koçu
                  </p>
                  {email && (
                    <p className="text-[11px] text-gray-400">{email}</p>
                  )}
                </div>

                <div className="w-full space-y-2">
                  <label className="text-[11px] font-medium text-gray-600">
                    Profil Fotoğrafı URL&apos;si
                  </label>
                  <Input
                    value={form.avatar_url}
                    onChange={(e) =>
                      handleChange("avatar_url", e.target.value)
                    }
                    placeholder="https://... (Unsplash, iStock vb.)"
                    className="text-xs"
                  />
                  <p className="text-[10px] text-gray-400">
                    Şimdilik sadece URL kullanıyoruz. İleride doğrudan dosya
                    yükleme gelecektir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* İÇERİK */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* ÜST BAR: Kaydet + Canlı Profil */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Koç Profil Ayarları
            </h2>
            <p className="text-xs text-gray-500">
              Burada yaptığın değişiklikler, herkese açık koç profilinde
              görüntülenir.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/coach-dashboard")}
            >
              Panelime Dön
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/coaches")}
            >
              Koç Listesini Gör
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="w-3 h-3 mr-1" />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </div>

        {/* GENEL BİLGİLER */}
        <Card className="bg-white border border-orange-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
              <User className="w-4 h-4 text-orange-500" />
              Genel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Ad Soyad
                </label>
                <Input
                  value={form.full_name}
                  onChange={(e) =>
                    handleChange("full_name", e.target.value)
                  }
                  placeholder="Örn: Yağız Alperen"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Unvan (sabit)
                </label>
                <Input
                  value="Kariyer Koçu"
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-[10px] text-gray-400">
                  Unvan, koç hesabı açtığın için sistem tarafından otomatik
                  atanır.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Kısa Özgeçmiş / Hakkında Metni
              </label>
              <Textarea
                rows={5}
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Kariyer eğitimin, kurumsal deneyimin ve koçluk yaklaşımın hakkında özet bir metin yaz. Bu bölüm, herkese açık profilinde ilk görülen alan olacaktır."
              />
              <p className="text-[10px] text-gray-400">
                4–8 cümlelik net ve profesyonel bir özet önerilir.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* UZMANLIK ALANLARI */}
        <Card className="bg-white border border-orange-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              Uzmanlık Etiketleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-gray-600">
              Kullanıcılar koç ararken bu etiketleri filtrelemek için
              kullanacak. Uzmanlık alanlarını mümkün olduğunca net seç.
            </p>
            <div className="flex flex-wrap gap-2">
              {specializationOptions.map((tag) => {
                const active = form.specializations.includes(tag);
                return (
                  <Button
                    key={tag}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${
                      active
                        ? "bg-orange-500 hover:bg-orange-600 text-white border-none"
                        : "border-orange-200 text-gray-700 hover:bg-orange-50"
                    }`}
                    onClick={() => toggleSpecialization(tag)}
                  >
                    {tag}
                  </Button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400">
              En az 2, en fazla 6 etiket seçmeni öneririz.
            </p>
          </CardContent>
        </Card>

        {/* EĞİTİM & DENEYİM */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-white border border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
                <Award className="w-4 h-4 text-orange-500" />
                Eğitim &amp; Sertifikalar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Textarea
                rows={6}
                value={form.education_text}
                onChange={(e) =>
                  handleChange("education_text", e.target.value)
                }
                placeholder={`Her satıra bir eğitim / sertifika yaz.\nÖrn:\nICF Onaylı Profesyonel Koçluk Programı (PCC Track)\nBoğaziçi Üniversitesi - Psikoloji Lisans`}
              />
              <p className="text-[10px] text-gray-400">
                Kaydederken her satır, herkese açık profilinde madde madde
                listelenir.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
                <Briefcase className="w-4 h-4 text-orange-500" />
                İş Deneyimi &amp; Roller
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Textarea
                rows={6}
                value={form.experience_text}
                onChange={(e) =>
                  handleChange("experience_text", e.target.value)
                }
                placeholder={`Her satıra bir rol / kurum yaz.\nÖrn:\nKıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi\nKariyer ve Liderlik Koçu – Serbest`}
              />
              <p className="text-[10px] text-gray-400">
                Bu alan ziyaretçilerin senin arka planını hızlı anlaması için
                kullanılır.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* METODOLOJİ & CV */}
        <Card className="bg-white border border-orange-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
              <FileText className="w-4 h-4 text-orange-500" />
              Koçluk Metodolojisi &amp; CV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Koçluk Metodolojin
              </label>
              <Textarea
                rows={5}
                value={form.methodology}
                onChange={(e) =>
                  handleChange("methodology", e.target.value)
                }
                placeholder="Seanslarda kullandığın yaklaşımlar, ekoller, araçlar ve çalışma biçimini yaz. Örn: Çözüm odaklı koçluk, pozitif psikoloji, aksiyon planı odaklı çalışma, güçlü soru teknikleri vb."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                CV / LinkedIn / Portfolyo Linki (opsiyonel)
              </label>
              <Input
                value={form.cv_url}
                onChange={(e) => handleChange("cv_url", e.target.value)}
                placeholder="https://www.linkedin.com/in/... veya PDF CV linki"
              />
              <p className="text-[10px] text-gray-400">
                Bu link herkese açık profilinde “Detaylı CV&apos;yi Gör” gibi
                bir buton olarak gösterilebilir.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700 bg-green-50 text-[10px]"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Kayıtların Supabase&apos;e güvenle kaydedilir
                </Badge>
              </div>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-3 h-3 mr-1" />
                {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ALT CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 mt-4 mb-10">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-3 h-3" />
            <span>
              Bu sayfayı doldurduktan sonra{" "}
              <span className="font-medium text-gray-700">
                koç profilini yatırımcıya
              </span>{" "}
              bile gösterebilirsin. Tüm kritik bilgiler tek yerde.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => navigate("/coach/" + coachId)}
          >
            Herkese Açık Profili Gör
          </Button>
        </div>
      </div>
    </div>
  );
}
