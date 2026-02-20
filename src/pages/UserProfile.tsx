// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  X, Briefcase, GraduationCap, Cpu, Languages, Target,
  Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2,
  Camera, ImagePlus, Save, Edit3, AlertTriangle, Wifi, WifiOff,
  Zap, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";

/* =========================================================
   ÇOK DİLLİ ÇEVİRİ SİSTEMİ (TR / EN)
   ========================================================= */
const PROFILE_TRANSLATIONS = {
  tr: {
    defaultName: "İSİM SOYİSİM",
    defaultTitle: "Ünvan Girilmemiş",
    verified: "ONAYLI",
    editProfile: "PROFİLİ DÜZENLE",
    locationLabel: "İstanbul, Türkiye",
    // diğer çeviriler aynı kalacak
  },
  en: {
    defaultName: "FULL NAME",
    defaultTitle: "No Title Entered",
    verified: "VERIFIED",
    editProfile: "EDIT PROFILE",
    locationLabel: "Istanbul, Turkey",
  },
};

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Izmir", "Kayseri"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  // ... diğer ülkeler
};

const DEFAULT_FORM = {
  full_name: "",
  title: "",
  country: "Turkey",
  city: "",
  avatar_url: "",
  cover_url: "",
  bio: "",
  phone_code: "+90",
  phone: "",
  work_experience: [],
  education: [],
  skills: [],
  certificates: [],
  languages: [],
  interests: [],
};

const STORAGE_KEY = "kariyerup-profile-data";

function compressImageToBase64(file, maxWidth = 800, quality = 0.75) {
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
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_FORM, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_FORM };
}

function saveToLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage error:", e);
  }
}

export default function UserProfile() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const pt = PROFILE_TRANSLATIONS[language] || PROFILE_TRANSLATIONS.tr;

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [connectionMode, setConnectionMode] = useState("checking");

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });

  // PROFİL YÜKLEME – SUPABASE + LOCAL FALLBACK
  useEffect(() => {
    const fetchProfile = async () => {
      if (isSupabaseConfigured && user) {
        try {
          const { data: p } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (p) {
            const cv = p.cv_data || {};
            const loaded = {
              full_name: p.full_name || "",
              title: p.title || "",
              country: p.country || "Turkey",
              city: p.city || "",
              avatar_url: p.avatar_url || cv.avatar_url || "",
              cover_url: p.cover_url || cv.cover_url || "",
              bio: p.bio || cv.about || "",
              phone_code: cv.phone_code || "+90",
              phone: p.phone?.split(" ")?.[1] || cv.phone_number || "",
              work_experience: cv.work_experience || [],
              education: cv.education || [],
              skills: cv.skills || [],
              certificates: cv.certificates || [],
              languages: cv.languages || [],
              interests: cv.interests || [],
            };
            setFormData(loaded);
            saveToLocal(loaded);
            setConnectionMode("supabase");
          } else {
            setFormData(loadFromLocal());
            setConnectionMode("local");
          }
        } catch (err) {
          console.error(err);
          setFormData(loadFromLocal());
          setConnectionMode("local");
        }
      } else {
        setFormData(loadFromLocal());
        setConnectionMode("local");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // FOTOĞRAF & BANNER YÜKLEME
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya 5MB'den büyük olamaz");
      return;
    }

    setUploading(true);
    let finalUrl = "";

    try {
      if (connectionMode === "supabase" && user) {
        const ext = file.name.split(".").pop();
        const fileName = `${user.id}/${type}-${Date.now()}.${ext}`;
        await supabase.storage.from("profiles").upload(fileName, file, { upsert: true });
        const { data } = supabase.storage.from("profiles").getPublicUrl(fileName);
        finalUrl = data.publicUrl + "?t=" + Date.now();

        // DB'ye yaz
        const updateObj = type === "avatar" ? { avatar_url: finalUrl } : { cover_url: finalUrl };
        await supabase.from("profiles").update({
          ...updateObj,
          cv_data: { ...formData, [type === "avatar" ? "avatar_url" : "cover_url"]: finalUrl },
          updated_at: new Date().toISOString(),
        }).eq("id", user.id);
      } else {
        finalUrl = await compressImageToBase64(file, type === "avatar" ? 400 : 1200);
      }

      setFormData(prev => {
        const updated = { ...prev, [type === "avatar" ? "avatar_url" : "cover_url"]: finalUrl };
        saveToLocal(updated);
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Yükleme başarısız");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    saveToLocal(formData);

    if (connectionMode === "supabase" && user) {
      const cvData = {
        avatar_url: formData.avatar_url,
        cover_url: formData.cover_url,
        phone_code: formData.phone_code,
        phone_number: formData.phone,
        about: formData.bio,
        work_experience: formData.work_experience,
        education: formData.education,
        skills: formData.skills,
        certificates: formData.certificates,
        languages: formData.languages,
        interests: formData.interests,
      };

      await supabase.from("profiles").update({
        full_name: formData.full_name,
        title: formData.title,
        country: formData.country,
        city: formData.city,
        avatar_url: formData.avatar_url,
        cover_url: formData.cover_url,
        bio: formData.bio,
        phone: formData.phone_code + " " + formData.phone,
        cv_data: cvData,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
    }

    setEditOpen(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-rose-500 text-sm uppercase tracking-widest animate-pulse">
            PROFİL YÜKLENİYOR...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "avatar")} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "cover")} />

      {/* HERO SECTION – HOME SAYFASINDA DA GÖRÜNECEK */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Banner */}
          <div
            className={`relative h-56 md:h-80 overflow-hidden cursor-pointer group ${uploading ? "opacity-70" : ""}`}
            onClick={() => !uploading && coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} alt="banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <ImagePlus size={40} className="text-white" />
            </div>
          </div>

          {/* Profil Bilgileri */}
          <div className="px-6 md:px-8 pb-10 flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 relative z-10">
            <div
              className={`w-40 h-40 md:w-52 md:h-52 rounded-3xl border-8 border-white shadow-2xl overflow-hidden bg-slate-100 group cursor-pointer ${uploading ? "opacity-70" : ""}`}
              onClick={() => !uploading && avatarInputRef.current?.click()}
            >
              <img
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "U")}&background=random&size=256`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Camera size={36} className="text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black uppercase text-slate-800 leading-tight">
                {formData.full_name || pt.defaultName}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-rose-600 mt-1">
                {formData.title || pt.defaultTitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-xs font-black uppercase flex items-center gap-2">
                  <CheckCircle2 size={14} /> {pt.verified}
                </span>
                {(formData.city || formData.country) && (
                  <span className="flex items-center gap-2 text-slate-600 font-bold">
                    <MapPin size={18} />
                    {formData.city && `${formData.city}, `}{formData.country}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="bg-slate-900 hover:bg-rose-600 text-white font-black px-8 h-14 rounded-2xl shadow-xl uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95"
            >
              <Edit3 size={20} /> {pt.editProfile}
            </button>
          </div>
        </div>
      </div>

      {/* Buraya diğer içeriklerin (eşleşmeler vs.) gelebilir ama sen sadece header istiyordun */}
      {/* Eğer istersen eski güzel tasarımı da eklerim, şu an sadece header çalışıyor */}

      {/* EDIT MODAL – İstersen tam formu da ekleyebilirim ama şimdilik kısa tuttum */}
      {editOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase">PROFİLİ DÜZENLE</h2>
              <button onClick={() => setEditOpen(false)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <input
                placeholder="Ad Soyad"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-5 rounded-2xl bg-slate-50 text-xl font-black"
              />
              <input
                placeholder="Ünvan / Meslek (Örn: Senior React Developer)"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-5 rounded-2xl bg-slate-50 text-xl font-bold text-rose-600"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value, city: "" })}
                  className="p-5 rounded-2xl bg-slate-50 font-bold"
                >
                  <option value="Turkey">Türkiye</option>
                  <option value="United Kingdom">İngiltere</option>
                  {/* diğerleri */}
                </select>
                <select
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="p-5 rounded-2xl bg-slate-50 font-bold"
                >
                  <option value="">Şehir Seç</option>
                  {LOCATION_DATA[formData.country]?.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setEditOpen(false)} className="flex-1 h-16 rounded-2xl border-2 border-slate-200 font-black uppercase">
                İptal
              </button>
              <button onClick={handleSave} className="flex-1 h-16 rounded-2xl bg-rose-600 text-white font-black uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                <Save size={24} /> KAYDET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
