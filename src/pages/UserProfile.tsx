// @ts-nocheck
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  X, Briefcase, GraduationCap, Cpu, Languages, Target,
  Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2,
  Camera, ImagePlus, Save, Edit3, AlertTriangle, Wifi, WifiOff
} from "lucide-react";

/* =========================================================
   GLOBAL VERİ SETLERİ
   ========================================================= */
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Germany": ["Berlin", "Munich", "Hamburg"],
};

const LANGUAGE_LIST = [
  "Türkçe", "English", "العربية", "Français", "Deutsch", "Español", "Русский", "中文", "日本語", "한국어",
];

/* =========================================================
   VARSAYILAN FORM
   ========================================================= */
const DEFAULT_FORM = {
  full_name: "",
  country: "Turkey",
  city: "",
  bio: "",
  phone_code: "+90",
  phone: "",
  avatar_url: "",
  cover_url: "",
  work_experience: [],
  education: [],
  skills: [],
  certificates: [],
  languages: [],
  interests: [],
};

const STORAGE_KEY = "kariyerup-profile-data";

/* =========================================================
   YARDIMCI FONKSİYONLAR
   ========================================================= */
function compressImageToBase64(file, maxWidth = 800, quality = 0.7) {
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
  } catch { /* ignore */ }
  return { ...DEFAULT_FORM };
}

function saveToLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage kayıt hatası:", e);
  }
}

/* =========================================================
   TOAST SİSTEMİ
   ========================================================= */
let toastIdCounter = 0;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-[slideIn_0.3s_ease-out] ${
            t.type === "success"
              ? "bg-emerald-600 text-white"
              : t.type === "warning"
              ? "bg-amber-500 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {t.type === "success" ? <CheckCircle2 size={16} /> : t.type === "warning" ? <AlertTriangle size={16} /> : <X size={16} />}
          {t.message}
        </div>
      ))}
    </div>
  );

  return { show, ToastContainer };
}

/* =========================================================
   BÖLÜM BAŞLIĞI
   ========================================================= */
function SectionTitle({ icon: Icon, color, title, onAdd, addLabel = "EKLE" }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
      <h3 className="font-black uppercase text-[11px] text-slate-500 tracking-widest flex items-center gap-2">
        <Icon size={16} className={color} /> {title}
      </h3>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="bg-slate-800 hover:bg-rose-600 text-white rounded-xl font-black h-9 px-5 text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus size={12} /> {addLabel}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   ANA KOMPONENT
   ========================================================= */
export default function UserProfile() {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [connectionMode, setConnectionMode] = useState("checking");

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });

  const { show: toast, ToastContainer } = useToast();

  /* ─────────────────────────────────────────────────────────
     PROFİL YÜKLEME
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: sessionData, error: sessErr } = await supabase.auth.getSession();

          if (sessErr || !sessionData?.session?.user) {
            console.warn("Oturum yok, localStorage moduna geçiliyor...", sessErr?.message);
            setConnectionMode("local");
            setFormData(loadFromLocal());
            setLoading(false);
            return;
          }

          const user = sessionData.session.user;
          setMe(user);
          setConnectionMode("supabase");

          const { data: p, error: profileErr } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profileErr) {
            console.error("Profil çekme hatası:", profileErr);
          }

          if (p) {
            const cv = p.cv_data || {};
            const loadedData = {
              full_name: p.full_name || "",
              country: p.country || "Turkey",
              city: p.city || "",
              // ✅ avatar_url → profiles tablosundaki gerçek sütundan oku
              avatar_url: p.avatar_url || "",
              // ✅ cover_url → sütun YOK, cv_data içinden oku
              cover_url: cv.cover_url || "",
              // ✅ bio → profiles tablosundaki gerçek sütundan oku
              bio: p.bio || cv.about || "",
              // ✅ phone → profiles tablosundaki gerçek sütundan oku
              phone_code: cv.phone_code || "+90",
              phone: p.phone || cv.phone_number || "",
              work_experience: Array.isArray(cv.work_experience) ? cv.work_experience : [],
              education: Array.isArray(cv.education) ? cv.education : [],
              skills: Array.isArray(cv.skills) ? cv.skills : [],
              certificates: Array.isArray(cv.certificates) ? cv.certificates : [],
              languages: Array.isArray(cv.languages) ? cv.languages : [],
              interests: Array.isArray(cv.interests) ? cv.interests : [],
            };
            setFormData(loadedData);
            saveToLocal(loadedData);
          }

          setLoading(false);
          return;
        } catch (err) {
          console.error("Supabase bağlantı hatası:", err);
        }
      }

      setConnectionMode("local");
      setFormData(loadFromLocal());
      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* ─────────────────────────────────────────────────────────
     FOTOĞRAF YÜKLEME
     
     avatar → avatar_url sütununa (gerçek sütun)
     cover  → cv_data.cover_url içine (sütun yok)
     ───────────────────────────────────────────────────────── */
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Dosya 5MB'den küçük olmalı.", "error");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast("Lütfen bir resim dosyası seçin.", "error");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      let finalUrl = "";

      // ─── Supabase Storage ───
      if (connectionMode === "supabase" && me) {
        let storageSuccess = false;

        try {
          const ext = file.name.split(".").pop() || "jpg";
          const fileName = `${me.id}/${type}-${Date.now()}.${ext}`;

          const { error: upErr } = await supabase.storage
            .from("profiles")
            .upload(fileName, file, { upsert: true });

          if (upErr) {
            console.warn("Storage upload hatası:", upErr.message);
            throw upErr;
          }

          const { data: urlData } = supabase.storage
            .from("profiles")
            .getPublicUrl(fileName);

          if (urlData?.publicUrl) {
            finalUrl = urlData.publicUrl + "?t=" + Date.now();
            storageSuccess = true;
          } else {
            throw new Error("Public URL alınamadı");
          }
        } catch (storageErr) {
          console.warn("Storage başarısız, base64'e dönülüyor:", storageErr);
          finalUrl = await compressImageToBase64(file, type === "avatar" ? 400 : 1200, 0.75);
        }

        // ─── DB'ye Kaydet ───
        try {
          if (type === "avatar") {
            // ✅ avatar_url → doğrudan profiles.avatar_url sütununa yaz
            const { error: dbErr } = await supabase
              .from("profiles")
              .update({
                avatar_url: finalUrl,
                updated_at: new Date().toISOString(),
              })
              .eq("id", me.id);

            if (dbErr) {
              console.error("Avatar DB hatası:", dbErr);
              toast("Avatar veritabanına yazılamadı, yerel kayıt yapıldı.", "warning");
            } else {
              toast("Profil fotoğrafı mühürlendi!", "success");
            }
          } else {
            // ✅ cover_url → cv_data JSON içine yaz (sütun yok!)
            const { data: currentProfile } = await supabase
              .from("profiles")
              .select("cv_data")
              .eq("id", me.id)
              .maybeSingle();

            const currentCv = currentProfile?.cv_data || {};
            const updatedCvData = { ...currentCv, cover_url: finalUrl };

            const { error: dbErr } = await supabase
              .from("profiles")
              .update({
                cv_data: updatedCvData,
                updated_at: new Date().toISOString(),
              })
              .eq("id", me.id);

            if (dbErr) {
              console.error("Cover DB hatası:", dbErr);
              toast("Banner veritabanına yazılamadı, yerel kayıt yapıldı.", "warning");
            } else {
              toast("Banner mühürlendi!", "success");
            }
          }
        } catch (dbError) {
          console.error("DB kayıt hatası:", dbError);
          toast("Yerel kayıt yapıldı.", "warning");
        }

      } else {
        // ─── localStorage modu ───
        finalUrl = await compressImageToBase64(file, type === "avatar" ? 400 : 1200, 0.75);
        toast(`${type === "avatar" ? "Profil fotoğrafı" : "Banner"} kaydedildi!`, "success");
      }

      // State güncelle
      const uploadKey = type === "avatar" ? "avatar_url" : "cover_url";
      setFormData((prev) => {
        const updated = { ...prev, [uploadKey]: finalUrl };
        saveToLocal(updated);
        return updated;
      });

    } catch (error) {
      console.error("Upload hatası:", error);
      try {
        const uploadKey = type === "avatar" ? "avatar_url" : "cover_url";
        const base64 = await compressImageToBase64(file, type === "avatar" ? 400 : 1200);
        setFormData((prev) => {
          const updated = { ...prev, [uploadKey]: base64 };
          saveToLocal(updated);
          return updated;
        });
        toast("Yerel yedek kayıt oluşturuldu.", "warning");
      } catch {
        toast("Yükleme tamamen başarısız oldu.", "error");
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* ─────────────────────────────────────────────────────────
     TÜM PROFİLİ KAYDET
     
     Tablo sütunları:
       full_name, avatar_url, country, city, bio, phone → gerçek sütunlar
       cover_url, phone_code, work_experience, education,
       skills, certificates, languages, interests → cv_data içinde
     ───────────────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);

    try {
      saveToLocal(formData);

      if (connectionMode === "supabase" && me) {
        const payload = {
          id: me.id,
          // ✅ Gerçek sütunlar (tabloda var)
          full_name: formData.full_name.trim(),
          avatar_url: formData.avatar_url,
          country: formData.country,
          city: formData.city,
          bio: formData.bio,
          phone: formData.phone_code + " " + formData.phone,
          // ✅ cv_data JSON (cover_url dahil her şey burada)
          cv_data: {
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
          },
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("profiles").upsert(payload);
        if (error) throw error;

        toast("Tüm veriler Supabase'e mühürlendi!", "success");
      } else {
        toast("Veriler yerel olarak mühürlendi!", "success");
      }

      setEditOpen(false);
    } catch (e) {
      console.error("Kayıt hatası:", e);
      toast("Hata: " + (e.message || "Bilinmeyen hata") + " — Yerel kayıt yapıldı.", "warning");
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  /* ----- Form Güncelleme Helpers ----- */
  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const updateArrayItem = (field, index, key, value) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addArrayItem = (field, template) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], template],
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        updateField("skills", [...formData.skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === "Enter" && interestInput.trim()) {
      e.preventDefault();
      if (!formData.interests.includes(interestInput.trim())) {
        updateField("interests", [...formData.interests, interestInput.trim()]);
      }
      setInterestInput("");
    }
  };

  /* ----- Yükleniyor ----- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-rose-500 text-sm uppercase tracking-widest animate-pulse">
            Hafıza Senkronize Ediliyor...
          </p>
        </div>
      </div>
    );
  }

  const cities = LOCATION_DATA[formData.country] || [];

  const hasContent =
    formData.bio ||
    formData.work_experience.length > 0 ||
    formData.education.length > 0 ||
    formData.certificates.length > 0 ||
    formData.languages.length > 0 ||
    formData.skills.length > 0 ||
    formData.interests.length > 0;

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      <ToastContainer />

      {/* Gizli file input'lar */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*"
        onChange={(e) => handleFileUpload(e, "avatar")} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*"
        onChange={(e) => handleFileUpload(e, "cover")} />

      {/* BAĞLANTI DURUMU */}
      <div className={`text-center py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
        connectionMode === "supabase" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}>
        {connectionMode === "supabase" ? (
          <><Wifi size={12} /> Supabase Bağlantısı Aktif</>
        ) : (
          <><WifiOff size={12} /> Yerel Mod — Veriler localStorage'da Saklanıyor</>
        )}
      </div>

      {/* ==================== HEADER ==================== */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Banner */}
          <div
            className={`h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-3xl ${uploading ? "pointer-events-none opacity-70" : "cursor-pointer"}`}
            onClick={() => !uploading && coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img
                src={formData.cover_url}
                className="w-full h-full object-cover"
                alt="banner"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : null}
            <div className={`absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400 ${formData.cover_url ? "opacity-0" : "opacity-90"}`} />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="font-black uppercase tracking-widest text-sm">Yükleniyor...</span>
                </>
              ) : (
                <>
                  <ImagePlus size={32} className="mb-2" />
                  <span className="font-black uppercase tracking-widest text-sm">Banner Değiştir</span>
                  <span className="text-xs text-white/70 mt-1">Tıklayarak yeni görsel seçin</span>
                </>
              )}
            </div>
          </div>

          {/* Profil Özet */}
          <div className="px-4 md:px-8 pb-8 flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-16 relative z-10">
            <div
              className={`w-32 h-32 md:w-44 md:h-44 rounded-3xl border-[6px] border-white shadow-xl overflow-hidden bg-slate-100 group relative shrink-0 ${uploading ? "pointer-events-none" : "cursor-pointer"}`}
              onClick={() => !uploading && avatarInputRef.current?.click()}
            >
              <img
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "U")}&size=256&background=f43f5e&color=fff&bold=true`}
                className="w-full h-full object-cover"
                alt="avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "U")}&size=256&background=f43f5e&color=fff&bold=true`;
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
                <Camera size={24} className="mb-1" />
                <span className="font-black text-[9px] uppercase tracking-widest">Değiştir</span>
              </div>
            </div>

            <div className="flex-1 pb-2 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-800 leading-none truncate">
                {formData.full_name || "İSİM SOYİSİM"}
              </h1>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase">
                  <CheckCircle2 size={12} /> ONAYLI
                </span>
                {(formData.city || formData.country) && (
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                    <MapPin size={12} /> {[formData.city, formData.country].filter(Boolean).join(", ")}
                  </span>
                )}
                {formData.phone && (
                  <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                    <Phone size={12} /> {formData.phone_code} {formData.phone}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="mb-2 bg-slate-900 text-white font-black px-6 md:px-8 h-12 rounded-xl shadow-lg hover:bg-rose-600 transition-all uppercase italic text-xs tracking-widest active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Edit3 size={16} /> PROFİLİ DÜZENLE
            </button>
          </div>
        </div>
      </div>

      {/* ==================== ANA İÇERİK ==================== */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Edit3 size={40} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black uppercase text-slate-400 tracking-wider mb-2">
              Profiliniz Boş
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md">
              Profil bilgilerinizi ekleyerek kariyer yolculuğunuza başlayın.
            </p>
            <button
              onClick={() => setEditOpen(true)}
              className="bg-rose-600 text-white font-black px-10 h-14 rounded-2xl shadow-xl hover:bg-rose-700 transition-all uppercase italic text-sm tracking-widest active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={20} /> PROFİLİ OLUŞTUR
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* SOL KOLON */}
            <div className="lg:col-span-8 space-y-10">
              {formData.bio && (
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target size={18} className="text-rose-500" /> Kariyer Vizyonu
                  </h3>
                  <p className="text-slate-700 font-bold italic text-lg leading-relaxed">
                    &ldquo;{formData.bio}&rdquo;
                  </p>
                </section>
              )}

              {formData.work_experience.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Briefcase size={20} className="text-rose-500" /> İş Deneyimi
                  </h3>
                  <div className="space-y-4">
                    {formData.work_experience.map((w, i) => (
                      <div key={i} className="p-6 rounded-3xl shadow-sm bg-white border border-slate-50">
                        <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{w.role || "Pozisyon"}</h4>
                        <p className="text-rose-600 font-black text-[10px] uppercase mt-1">
                          {w.company || "Şirket"} • {w.start || "?"} - {w.isCurrent ? "Günümüz" : w.end || "?"}
                        </p>
                        {w.desc && (
                          <p className="text-slate-500 italic text-sm mt-3 pl-4 border-l-2 border-rose-100">&ldquo;{w.desc}&rdquo;</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData.education.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <GraduationCap size={20} className="text-emerald-500" /> Eğitim
                  </h3>
                  <div className="space-y-4">
                    {formData.education.map((ed, i) => (
                      <div key={i} className="p-6 rounded-3xl shadow-sm bg-white border border-slate-50">
                        <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{ed.school || "Okul"}</h4>
                        <p className="text-emerald-600 font-black text-[10px] uppercase mt-1">{ed.degree} • {ed.field}</p>
                        <p className="text-slate-400 font-bold text-[10px] uppercase mt-1">
                          {ed.start || "?"} - {ed.isCurrent ? "Devam Ediyor" : ed.end || "?"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData.certificates.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Award size={20} className="text-amber-500" /> Sertifikalar
                  </h3>
                  <div className="space-y-4">
                    {formData.certificates.map((c, i) => (
                      <div key={i} className="p-6 rounded-3xl shadow-sm bg-white border border-slate-50">
                        <h4 className="text-base font-black uppercase tracking-tight text-slate-800">{c.name || "Sertifika"}</h4>
                        <p className="text-amber-600 font-black text-[10px] uppercase mt-1">{c.issuer} • {c.year}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* SAĞ KOLON */}
            <div className="lg:col-span-4 space-y-10">
              {formData.languages.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Languages size={16} className="text-indigo-500" /> Diller
                  </h3>
                  <div className="space-y-3">
                    {formData.languages.map((l, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                        <span className="font-black uppercase text-[10px] text-slate-700 tracking-widest">{l.lang || "Dil"}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {formData.skills.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu size={16} className="text-cyan-500" /> Yetenekler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((s, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </section>
              )}

              {formData.interests.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Heart size={16} className="text-pink-500" /> İlgi Alanları
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((s, i) => (
                      <span key={i} className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          DÜZENLEME MODALI
          ========================================================= */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl relative flex flex-col">
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 md:px-8 py-6 border-b border-slate-100 z-50 flex justify-between items-center rounded-t-[32px]">
              <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800">
                Profil Mimarı <span className="text-rose-500">v32</span>
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL İÇERİK */}
            <div className="p-6 md:p-8 space-y-10">

              {/* FOTOĞRAF YÜKLEMELERİ */}
              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Profil Görselleri
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Avatar */}
                  <div
                    className={`relative h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-rose-300 transition-colors ${uploading ? "pointer-events-none opacity-60" : ""}`}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-full h-full object-cover" alt="avatar preview"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Camera size={28} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profil Fotoğrafı</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                      <Camera size={24} />
                    </div>
                  </div>

                  {/* Banner */}
                  <div
                    className={`relative h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-rose-300 transition-colors ${uploading ? "pointer-events-none opacity-60" : ""}`}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {formData.cover_url ? (
                      <img src={formData.cover_url} className="w-full h-full object-cover" alt="banner preview"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImagePlus size={28} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Banner Görseli</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                      <ImagePlus size={24} />
                    </div>
                  </div>
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-bold">
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    Görsel yükleniyor...
                  </div>
                )}
              </div>

              {/* AD SOYAD */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                <input
                  value={formData.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  placeholder="Adınız ve Soyadınız"
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>

              {/* LOKASYON */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasyon</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={formData.country}
                    onChange={(e) => { updateField("country", e.target.value); updateField("city", ""); }}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Ülke Seçin</option>
                    {Object.keys(LOCATION_DATA).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Şehir Seçin</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TELEFON */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Phone size={12} /> Uluslararası Telefon
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={formData.phone_code}
                    onChange={(e) => updateField("phone_code", e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {PHONE_CODES.map((p) => (
                      <option key={p.code} value={p.code}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    placeholder="5XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="sm:col-span-2 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* HAKKIMDA / BIO */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Target size={12} /> Hakkımda / Kariyer Vizyonu
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Kendinizi ve kariyer hedefinizi tanımlayın..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* İŞ DENEYİMİ */}
              <div className="space-y-4">
                <SectionTitle icon={Briefcase} color="text-rose-500" title="İş Deneyimi"
                  onAdd={() => addArrayItem("work_experience", { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" })} />
                {formData.work_experience.map((w, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl space-y-3 relative border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input placeholder="Pozisyon / Ünvan" value={w.role}
                        onChange={(e) => updateArrayItem("work_experience", i, "role", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500" />
                      <input placeholder="Şirket Adı" value={w.company}
                        onChange={(e) => updateArrayItem("work_experience", i, "company", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <input placeholder="Başlangıç (2020)" value={w.start}
                        onChange={(e) => updateArrayItem("work_experience", i, "start", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-rose-500" />
                      <input placeholder="Bitiş (2023)" value={w.end} disabled={w.isCurrent}
                        onChange={(e) => updateArrayItem("work_experience", i, "end", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none disabled:opacity-40 focus:ring-2 focus:ring-rose-500" />
                      <label className="flex items-center gap-2 cursor-pointer justify-center">
                        <input type="checkbox" checked={w.isCurrent}
                          onChange={(e) => updateArrayItem("work_experience", i, "isCurrent", e.target.checked)}
                          className="w-4 h-4 accent-rose-500" />
                        <span className="text-[9px] font-black uppercase text-slate-400">Devam Ediyor</span>
                      </label>
                      <button onClick={() => removeArrayItem("work_experience", i)}
                        className="flex items-center justify-center gap-1 bg-white text-red-400 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase cursor-pointer">
                        <Trash2 size={14} /> SİL
                      </button>
                    </div>
                    <textarea placeholder="Görev tanımı ve başarılarınız..." value={w.desc}
                      onChange={(e) => updateArrayItem("work_experience", i, "desc", e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none min-h-[80px] resize-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                ))}
              </div>

              {/* EĞİTİM */}
              <div className="space-y-4">
                <SectionTitle icon={GraduationCap} color="text-emerald-500" title="Eğitim Bilgileri"
                  onAdd={() => addArrayItem("education", { school: "", degree: "", field: "", start: "", end: "", isCurrent: false })} />
                {formData.education.map((ed, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input placeholder="Okul / Üniversite" value={ed.school}
                        onChange={(e) => updateArrayItem("education", i, "school", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                      <input placeholder="Bölüm / Alan" value={ed.field}
                        onChange={(e) => updateArrayItem("education", i, "field", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <select value={ed.degree}
                        onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">Derece</option>
                        <option value="Lise">Lise</option>
                        <option value="Ön Lisans">Ön Lisans</option>
                        <option value="Lisans">Lisans</option>
                        <option value="Yüksek Lisans">Yüksek Lisans</option>
                        <option value="Doktora">Doktora</option>
                      </select>
                      <input placeholder="Başlangıç" value={ed.start}
                        onChange={(e) => updateArrayItem("education", i, "start", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                      <input placeholder="Bitiş" value={ed.end} disabled={ed.isCurrent}
                        onChange={(e) => updateArrayItem("education", i, "end", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none disabled:opacity-40 focus:ring-2 focus:ring-emerald-500" />
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={ed.isCurrent}
                            onChange={(e) => updateArrayItem("education", i, "isCurrent", e.target.checked)}
                            className="w-4 h-4 accent-emerald-500" />
                          <span className="text-[8px] font-black uppercase text-slate-400">Devam</span>
                        </label>
                        <button onClick={() => removeArrayItem("education", i)}
                          className="text-red-400 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DİLLER */}
              <div className="space-y-4">
                <SectionTitle icon={Languages} color="text-indigo-500" title="Dil Yetkinliği"
                  onAdd={() => addArrayItem("languages", { lang: "", level: 1 })} />
                {formData.languages.map((l, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <select value={l.lang}
                      onChange={(e) => updateArrayItem("languages", i, "lang", e.target.value)}
                      className="flex-1 p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Dil Seçin</option>
                      {LANGUAGE_LIST.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button"
                          onClick={() => updateArrayItem("languages", i, "level", s)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer">
                          <Star size={20} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => removeArrayItem("languages", i)} className="text-red-400 hover:text-red-600 p-2 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* SERTİFİKALAR */}
              <div className="space-y-4">
                <SectionTitle icon={Award} color="text-amber-500" title="Sertifikalar"
                  onAdd={() => addArrayItem("certificates", { name: "", issuer: "", year: "" })} />
                {formData.certificates.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                    <input placeholder="Sertifika Adı" value={c.name}
                      onChange={(e) => updateArrayItem("certificates", i, "name", e.target.value)}
                      className="sm:col-span-2 w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                    <input placeholder="Kurum" value={c.issuer}
                      onChange={(e) => updateArrayItem("certificates", i, "issuer", e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                    <div className="flex gap-2 items-center">
                      <input placeholder="Yıl" value={c.year}
                        onChange={(e) => updateArrayItem("certificates", i, "year", e.target.value)}
                        className="flex-1 p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                      <button onClick={() => removeArrayItem("certificates", i)} className="text-red-400 hover:text-red-600 p-2 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* YETENEKLER */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Cpu size={12} className="text-cyan-500" /> Teknik Programlar & Yetenekler
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => updateField("skills", formData.skills.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600 ml-1 cursor-pointer">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input placeholder="Yetenek yazıp Enter'a basın..."
                  value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>

              {/* İLGİ ALANLARI */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Heart size={12} className="text-pink-500" /> İlgi Alanları
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((s, i) => (
                    <span key={i} className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => updateField("interests", formData.interests.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600 ml-1 cursor-pointer">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input placeholder="İlgi alanı yazıp Enter'a basın..."
                  value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={handleInterestKeyDown}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 p-6 bg-white/95 backdrop-blur-sm border-t border-slate-100 flex gap-3 rounded-b-[32px]">
              <button onClick={() => setEditOpen(false)}
                className="px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                İPTAL
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl active:scale-[0.98] transition-all tracking-widest disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer">
                <Save size={20} />
                {saving ? "MÜHÜRLENİYOR..." : "HAFIZAYI MÜHÜRLE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
