// src/pages/CoachSettings.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCircle2,
  Briefcase,
  MapPin,
  CheckCircle2,
  FileText,
  Award,
  Users,
  Globe2,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

export default function CoachSettings() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [coach, setCoach] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    location: "",
    bio: "",
    methodology: "",
    specializations_input: "",
    education_text: "",
    experience_text: "",
    cv_url: "",
  });

  // AUTH + KOÇ KAYDINI ÇEK
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      setAuthUser(user);

      const { data: coachRow, error: coachError } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (coachError) {
        console.error("CoachSettings coachError:", coachError);
        setCoach(null);
      } else {
        setCoach(coachRow);

        setFormData({
          full_name: coachRow.full_name || "",
          title: coachRow.title || "",
          location: coachRow.location || "",
          bio:
            coachRow.bio ||
            "10+ yıllık kurumsal deneyime sahip kariyer ve liderlik koçu. Farklı sektörlerdeki profesyonellerle çalışarak kariyer geçişi, liderlik gelişimi ve performans artırma alanlarında yüzlerce seans gerçekleştirdim.",
          methodology:
            coachRow.methodology ||
            "Seanslarımda çözüm odaklı koçluk, pozitif psikoloji ve aksiyon planı temelli çalışma yöntemlerini kullanıyorum. Her görüşmede ölçülebilir hedefler belirliyor, seans sonunda net çıktılarla ilerliyorum.",
          specializations_input: (coachRow.specializations || []).join(", "),
          education_text: (coachRow.education_list || []).join("\n"),
          experience_text: (coachRow.experience_list || []).join("\n"),
          cv_url:
            coachRow.cv_url ||
            "https://.../ornek-cv.pdf",
        });
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!coach) {
      toast.error("Koç kaydı bulunamadı.");
      return;
    }

    setSaving(true);
    try {
      // Uzmanlıkları virgülle ayrılmış string → diziye çevir
      const specializationsArray =
        formData.specializations_input
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [];

      // Eğitim & deneyimleri satır satır listeye çevir
      const educationArr =
        formData.education_text
          ?.split("\n")
          .map((l) => l.trim())
          .filter(Boolean) || [];

      const experienceArr =
        formData.experience_text
          ?.split("\n")
          .map((l) => l.trim())
          .filter(Boolean) || [];

      const { error } = await supabase
        .from("app_2dff6511da_coaches")
        .update({
          full_name: formData.full_name,
          title: formData.title,
          location: formData.location,
          bio: formData.bio,
          methodology: formData.methodology,
          specializations: specializationsArray,
          education_list: educationArr,
          experience_list: experienceArr,
          cv_url: formData.cv_url,
        })
        .eq("id", coach.id);

      if (error) {
        console.error("CoachSettings update error:", error);
        toast.error("Profil güncellenemedi, lütfen tekrar deneyin.");
      } else {
        toast.success("Koç profilin başarıyla güncellendi.");
        // local state'i de güncelle
        setCoach((prev: any) =>
          prev
            ? {
                ...prev,
                ...{
                  full_name: formData.full_name,
                  title: formData.title,
                  location: formData.location,
                  bio: formData.bio,
                  methodology: formData.methodology,
                  specializations: specializationsArray,
                  education_list: educationArr,
                  experience_list: experienceArr,
                  cv_url: formData.cv_url,
                },
              }
            : prev
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç ayarların yükleniyor...
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Bu sayfayı görmek için giriş yapmalısın.
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex flex-col items-center justify-center text-gray-600 gap-3">
        <p>Bu hesaba bağlı koç kaydı bulunamadı.</p>
        <Button
          className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm"
          onClick={() => navigate("/coach-application")}
        >
          Koç Başvurusu Yap
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Başlık */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
              Koç Ayarları
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              Profesyonel Profilini Düzenle
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Bu sayfada yaptığın değişiklikler, danışanların gördüğü koç
              profiline yansır.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-gray-300 text-gray-800 text-xs"
            onClick={() => navigate(`/coach/${coach.id}`)}
          >
            Herkese Açık Profilimi Gör
          </Button>
        </div>

        {/* 1. Kart: Temel Bilgiler */}
        <Card className="bg-white border border-orange-100 shadow-sm">
          <CardHeader className="flex items-center gap-3">
            <UserCircle2 className="w-7 h-7 text-red-500" />
            <div>
              <CardTitle className="text-sm text-gray-900">
                Temel Bilgiler
              </CardTitle>
              <p className="text-xs text-gray-500">
                Ad, ünvan ve lokasyon bilgilerin koç kartlarında görünür.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Ad Soyad
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    handleChange("full_name", e.target.value)
                  }
                  placeholder="Örn: Yağız Alperen"
                  className="rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-gray-500" />
                  Profesyonel Ünvan
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Örn: Executive & Kariyer Koçu"
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  Konum
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleChange("location", e.target.value)
                  }
                  placeholder="Örn: İstanbul, TR · Online"
                  className="rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-gray-500" />
                  Uzmanlık Etiketleri
                </label>
                <Input
                  value={formData.specializations_input}
                  onChange={(e) =>
                    handleChange("specializations_input", e.target.value)
                  }
                  placeholder="Kariyer Geçişi, Liderlik Koçluğu, Yeni Mezun Koçluğu..."
                  className="rounded-xl text-sm"
                />
                <p className="text-[11px] text-gray-500">
                  Etiketleri virgül ile ayır. Danışanlar bu etiketlerle filtreleyerek seni bulur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Kart: Koç Hakkında & Metodoloji */}
        <Card className="bg-white border border-orange-100 shadow-sm">
          <CardHeader className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-orange-500" />
            <div>
              <CardTitle className="text-sm text-gray-900">
                Koç Hakkında & Metodoloji
              </CardTitle>
              <p className="text-xs text-gray-500">
                Bu alanlar, koç profilinin “Hakkında” sekmesinde görünür.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Koç Hakkında (Kısa Profesyonel Özet)
              </label>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={5}
                className="rounded-xl text-sm"
                placeholder={`Örn:

10+ yıllık kurumsal deneyime sahip Executive ve Kariyer Koçu. Teknoloji, e-ticaret ve hızlı tüketim sektörlerinde; liderlik gelişimi, kariyer geçişi, performans koçluğu ve yeni rol uyumlanması alanlarında birebir ve grup seansları yürütüyorum.

Bugüne kadar farklı seviyelerden (yeni mezun, uzman, yönetici ve C-level) 300+ danışanla çalıştım; odak alanlarım kariyer yön bulma, yurt dışı kariyer geçişi ve liderlik becerilerinin güçlendirilmesi.`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-gray-500" />
                Koçluk Metodolojin
              </label>
              <Textarea
                value={formData.methodology}
                onChange={(e) =>
                  handleChange("methodology", e.target.value)
                }
                rows={4}
                className="rounded-xl text-sm"
                placeholder={`Örn:

Seanslarımda çözüm odaklı koçluk, pozitif psikoloji ve güçlü soru sorma tekniklerini kullanıyorum. Her görüşmenin başında net bir hedef belirleyip, sonunda somut aksiyon adımlarına indirgeriz.

Danışanlarımla genellikle 4–8 seanslık programlar halinde çalışıyor, ilerlemeyi düzenli check-in soruları ve gelişim metrikleriyle takip ediyorum.`}
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Kart: Profesyonel Özgeçmiş Formu */}
        <Card className="bg-white border border-orange-100 shadow-sm">
          <CardHeader className="flex items-center gap-3">
            <Award className="w-6 h-6 text-red-500" />
            <div>
              <CardTitle className="text-sm text-gray-900">
                Profesyonel Özgeçmiş Formu
              </CardTitle>
              <p className="text-xs text-gray-500">
                Aşağıdaki alanlar özgeçmişinin ana iskeletini oluşturur.
                Her satır, profilinde ayrı bir madde olarak görünecek.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Eğitimler */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <Award className="w-3 h-3 text-gray-500" />
                Eğitim & Sertifikalar (Her satıra bir madde)
              </label>
              <Textarea
                value={formData.education_text}
                onChange={(e) =>
                  handleChange("education_text", e.target.value)
                }
                rows={4}
                className="rounded-xl text-sm"
                placeholder={`Örn:
Boğaziçi Üniversitesi – İşletme (Lisans)
ICF Onaylı Profesyonel Koçluk Programı (PCC Track)
ICF – Etik ve Mesleki Standartlar Eğitimi
Liderlik ve Takım Koçluğu Sertifika Programı`}
              />
            </div>

            {/* Tecrübeler */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <Users className="w-3 h-3 text-gray-500" />
                İş Deneyimi & Koçluk Geçmişi (Her satıra bir madde)
              </label>
              <Textarea
                value={formData.experience_text}
                onChange={(e) =>
                  handleChange("experience_text", e.target.value)
                }
                rows={4}
                className="rounded-xl text-sm"
                placeholder={`Örn:
Kıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi (8 yıl)
Liderlik Gelişim Programları Eğitmeni – Teknoloji & E-ticaret Sektörü
Yurt dışı kariyer geçişi danışmanlığı (Avrupa ve UK odaklı)
300+ bireysel kariyer koçluğu seansı, 50+ grup atölyesi`}
              />
            </div>

            {/* CV linki */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <Link2 className="w-3 h-3 text-gray-500" />
                CV Linki (PDF)
              </label>
              <Input
                value={formData.cv_url}
                onChange={(e) => handleChange("cv_url", e.target.value)}
                placeholder="Örn: Google Drive / Supabase Storage üzerindeki PDF linkin"
                className="rounded-xl text-sm"
              />
              <p className="text-[11px] text-gray-500">
                Bu link, koç profilinde “Özgeçmiş” sekmesinde “Özgeçmişi Görüntüle / İndir” butonunda kullanılır.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KAYDET BUTONU */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm px-6"
          >
            {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
