// src/pages/CoachSettings.tsx
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
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
  Camera,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const COACHES_TABLE = "profiles";

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

const safeParseArray = (val: any) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    if (val.trim().startsWith("[") && val.trim().endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {}
    }
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

function compressImageToBase64(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CoachSettings() {
  const navigate = useNavigate();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coachId, setCoachId] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    avatar_url: "",
    cover_url: "", 
    bio: "",
    methodology: "",
    cv_url: "",
    specializations: [] as string[],
    education_text: "",
    experience_text: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from(COACHES_TABLE)
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          toast.error("Koç profili yüklenirken bir hata oluştu.");
          return;
        }
        if (!data) {
          toast.error("Bu hesapla ilişkilendirilmiş bir koç profili bulunamadı.");
          return;
        }

        setCoachId(data.id);

        setForm({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || data.photo_url || "",
          cover_url: data.cover_url || data.cv_data?.cover_url || "",
          bio: data.manifesto || data.summary || data.bio || "",
          methodology: data.journey_steps || data.methodology || "",
          cv_url: data.linkedin_url || data.cv_data?.url || data.cv_url || "", // linkedin_url eklendi
          specializations: safeParseArray(data.superpowers || data.specializations),
          education_text: safeParseArray(data.education || data.education_list).join("\n"),
          experience_text: safeParseArray(data.certifications || data.experience_list).join("\n"),
        });
      } catch (err) {
        toast.error("Koç ayarları yüklenirken beklenmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya 5MB'den küçük olmalı.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen geçerli bir resim dosyası seçin.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      let finalUrl = "";
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        try {
          const ext = file.name.split(".").pop() || "jpg";
          const fileName = `${user.id}/${type}-${Date.now()}.${ext}`;

          const { error: upErr } = await supabase.storage
            .from("profiles")
            .upload(fileName, file, { upsert: true });

          if (upErr) throw upErr;

          const { data: urlData } = supabase.storage
            .from("profiles")
            .getPublicUrl(fileName);

          finalUrl = urlData.publicUrl + "?t=" + Date.now();
        } catch (storageErr) {
          console.warn("Storage başarısız, Base64'e çevriliyor...", storageErr);
          finalUrl = await compressImageToBase64(file, type === "avatar" ? 400 : 1200, 0.75);
        }

        const uploadKey = type === "avatar" ? "avatar_url" : "cover_url";
        setForm((prev) => ({ ...prev, [uploadKey]: finalUrl }));
        
        await supabase
          .from(COACHES_TABLE)
          .update({ [uploadKey]: finalUrl, updated_at: new Date().toISOString() })
          .eq("id", user.id);

        toast.success(type === "avatar" ? "Profil fotoğrafı yüklendi ve kaydedildi!" : "Banner yüklendi ve kaydedildi!");
      }
    } catch (error) {
      toast.error("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!coachId) {
      toast.error("Koç kaydı bulunamadı.");
      return;
    }
    if (!form.full_name.trim()) {
      toast.error("İsim alanı boş bırakılamaz.");
      return;
    }

    setSaving(true);
    try {
      const education_list = form.education_text ? form.education_text.split("\n").map((l) => l.trim()).filter(Boolean) : [];
      const experience_list = form.experience_text ? form.experience_text.split("\n").map((l) => l.trim()).filter(Boolean) : [];

      const payload = {
        full_name: form.full_name.trim(),
        avatar_url: form.avatar_url.trim() || null,
        cover_url: form.cover_url.trim() || null,
        manifesto: form.bio.trim(),
        journey_steps: form.methodology.trim(),
        linkedin_url: form.cv_url.trim() || null, 
        superpowers: form.specializations,
        education: education_list,
        certifications: experience_list,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from(COACHES_TABLE).update(payload).eq("id", coachId);

      if (error) throw error;
      toast.success("Profil başarıyla güncellendi ve kaydedildi.");
    } catch (err: any) {
      console.error("Save Error:", err);
      toast.error(`Kaydederken bir hata oluştu: ${err.message || ""}`);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-gray-900">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "avatar")} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "cover")} />

      <div className="bg-white border-b border-slate-100 shadow-sm mb-8">
        <div className="max-w-6xl mx-auto">
          <div
            className={`h-48 md:h-64 bg-slate-200 relative group overflow-hidden md:rounded-b-3xl ${
              uploading ? "pointer-events-none opacity-70" : "cursor-pointer"
            }`}
            onClick={() => !uploading && coverInputRef.current?.click()}
          >
            {form.cover_url ? (
              <img
                src={form.cover_url}
                className="w-full h-full object-cover"
                alt="banner preview"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400 opacity-90" />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="font-black uppercase tracking-widest text-sm">Yükleniyor...</span>
                </>
              ) : (
                <>
                  <ImagePlus size={32} className="mb-2" />
                  <span className="font-black uppercase tracking-widest text-sm">
                    {form.cover_url ? "Banner Değiştir" : "Banner Ekle"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="px-4 md:px-8 pb-8 flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-16 relative z-10">
            <div
              className={`w-32 h-32 md:w-44 md:h-44 rounded-3xl border-[6px] border-white shadow-xl overflow-hidden bg-slate-100 group relative shrink-0 ${
                uploading ? "pointer-events-none" : "cursor-pointer"
              }`}
              onClick={() => !uploading && avatarInputRef.current?.click()}
            >
              <img
                src={
                  form.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    form.full_name || "Koç"
                  )}&size=256&background=f43f5e&color=fff&bold=true`
                }
                className="w-full h-full object-cover bg-white"
                alt="avatar preview"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
                <Camera size={24} className="mb-1" />
                <span className="font-black text-[9px] uppercase tracking-widest">
                  Değiştir
                </span>
              </div>
            </div>

            <div className="flex-1 pb-2 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-800 leading-none truncate">
                {form.full_name || "İSMİNİZİ GİRİN"}
              </h1>
              <p className="text-base md:text-lg font-bold text-slate-500 mt-1 italic truncate">
                Kariyer Koçu
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase">
                  <CheckCircle2 size={12} /> Onaylı Koç
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-2 w-full md:w-auto">
               <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 w-full md:w-48 shadow-lg transition-transform active:scale-95" onClick={handleSave} disabled={saving}>
                 <Save className="w-4 h-4 mr-2" />
                 {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
               </Button>
               <Button variant="outline" size="sm" className="font-bold h-10 w-full md:w-48 border-slate-200 text-slate-600" onClick={() => navigate(`/coach/${coachId}`)}>
                 Önizleme (Canlı Profil)
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider">
              <User className="w-4 h-4 text-rose-500" />
              Temel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ad Soyad
              </label>
              <Input
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Örn: Yağız Alperen"
                className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-rose-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Kısa Özgeçmiş / Manifesto
              </label>
              <Textarea
                rows={5}
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Kariyer eğitimin, kurumsal deneyimin ve koçluk yaklaşımın hakkında özet bir metin yaz."
                className="bg-slate-50 border-slate-200 rounded-xl focus:ring-rose-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              Uzmanlık Etiketleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-slate-500">
              Kullanıcılar koç ararken bu etiketleri filtrelemek için kullanacak. En az 2, en fazla 6 etiket seç.
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
                    className={`rounded-xl px-4 h-9 font-bold text-xs transition-all ${
                      active
                        ? "bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => toggleSpecialization(tag)}
                  >
                    {tag}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" />
                Eğitim & Sertifikalar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Textarea
                rows={6}
                value={form.education_text}
                onChange={(e) => handleChange("education_text", e.target.value)}
                placeholder={`Her satıra bir eğitim yaz.\nÖrn:\nICF Onaylı Profesyonel Koçluk Programı\nBoğaziçi Üniversitesi`}
                className="bg-slate-50 border-slate-200 rounded-xl focus:ring-amber-500"
              />
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                İş Deneyimi & Roller
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Textarea
                rows={6}
                value={form.experience_text}
                onChange={(e) => handleChange("experience_text", e.target.value)}
                placeholder={`Her satıra bir rol yaz.\nÖrn:\nKıdemli İK İş Ortağı – Trendyol\nKariyer Koçu – Serbest`}
                className="bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl mb-10">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-500" />
              Metodoloji & Linkler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Koçluk Metodolojin
              </label>
              <Textarea
                rows={4}
                value={form.methodology}
                onChange={(e) => handleChange("methodology", e.target.value)}
                placeholder="Seanslarda kullandığın yaklaşımlar (Çözüm odaklı, pozitif psikoloji vb.)"
                className="bg-slate-50 border-slate-200 rounded-xl focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="space-y-2 pb-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CV / LinkedIn Linki (Opsiyonel)
              </label>
              <Input
                value={form.cv_url}
                onChange={(e) => handleChange("cv_url", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
