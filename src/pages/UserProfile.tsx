// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  X, Briefcase, GraduationCap, Cpu, Languages, Target,
  Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2
} from "lucide-react";

/* =========================================================
   ✅ GLOBAL VERİ SETLERİ
   ========================================================= */
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" }
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Germany": ["Berlin", "Munich", "Hamburg"]
};

const LANGUAGE_LIST = [
  "Türkçe", "English", "العربية", "Français", "Deutsch", "Español", "Русский", "中文", "日本語", "한국어"
];

/* =========================================================
   ✅ VARSAYILAN FORM
   ========================================================= */
const DEFAULT_FORM = {
  full_name: "",
  country: "Turkey",
  city: "",
  about: "",
  phone_code: "+90",
  phone_number: "",
  avatar_url: "",
  cover_url: "",
  work_experience: [],
  education: [],
  skills: [],
  certificates: [],
  languages: [],
  interests: []
};

/* =========================================================
   ✅ BÖLÜM BAŞLIĞI YARDIMCISI
   ========================================================= */
const SectionTitle = ({ icon: Icon, color, title, onAdd, addLabel = "EKLE" }) => (
  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
    <h3 className="font-black uppercase text-[11px] text-slate-500 tracking-widest flex items-center gap-2">
      <Icon size={16} className={color} /> {title}
    </h3>
    {onAdd && (
      <Button
        type="button"
        size="sm"
        onClick={onAdd}
        className="bg-slate-800 hover:bg-rose-600 text-white rounded-xl font-black h-9 px-5 text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all"
      >
        <Plus size={12} /> {addLabel}
      </Button>
    )}
  </div>
);

/* =========================================================
   ✅ ANA KOMPONENT
   ========================================================= */
export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });

  /* ----- Profil Yükleme ----- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);

        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (p) {
          const cv = p.cv_data || {};
          setFormData({
            full_name: p.full_name || "",
            country: p.country || "Turkey",
            city: p.city || "",
            avatar_url: p.avatar_url || "",
            cover_url: p.cover_url || "",
            phone_code: cv.phone_code || "+90",
            phone_number: cv.phone_number || "",
            about: cv.about || "",
            work_experience: Array.isArray(cv.work_experience) ? cv.work_experience : [],
            education: Array.isArray(cv.education) ? cv.education : [],
            skills: Array.isArray(cv.skills) ? cv.skills : [],
            certificates: Array.isArray(cv.certificates) ? cv.certificates : [],
            languages: Array.isArray(cv.languages) ? cv.languages : [],
            interests: Array.isArray(cv.interests) ? cv.interests : []
          });
        }
      } catch (err) {
        console.error("Profil yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  /* ----- Fotoğraf Yükleme (Beton Hafıza) ----- */
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file || !me) return;

    // Boyut kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya 5MB'den küçük olmalı.");
      return;
    }

    const uploadKey = type === "avatar" ? "avatar_url" : "cover_url";

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${me.id}/${type}-${Date.now()}.${ext}`;

      // 1) Storage'a yükle
      const { error: upErr } = await supabase.storage
        .from("profiles")
        .upload(fileName, file, { upsert: true });
      if (upErr) throw upErr;

      // 2) Public URL al
      const { data: urlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      // 3) Anında DB'ye yaz (Beton Mühür)
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ [uploadKey]: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", me.id);
      if (dbErr) throw dbErr;

      // 4) State güncelle
      setFormData(prev => ({ ...prev, [uploadKey]: publicUrl }));
      toast.success(`${type === "avatar" ? "Profil fotoğrafı" : "Banner"} mühürlendi!`);
    } catch (error) {
      console.error("Upload hatası:", error);
      toast.error("Yükleme başarısız oldu.");
    }

    // Input'u sıfırla (aynı dosyayı tekrar seçebilmek için)
    e.target.value = "";
  };

  /* ----- Tüm Profili Kaydet ----- */
  const handleSave = async () => {
    if (!me) return;
    setSaving(true);

    try {
      const payload = {
        id: me.id,
        full_name: formData.full_name.trim(),
        country: formData.country,
        city: formData.city,
        avatar_url: formData.avatar_url,
        cover_url: formData.cover_url,
        cv_data: {
          phone_code: formData.phone_code,
          phone_number: formData.phone_number,
          about: formData.about,
          work_experience: formData.work_experience,
          education: formData.education,
          skills: formData.skills,
          certificates: formData.certificates,
          languages: formData.languages,
          interests: formData.interests
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;

      toast.success("Tüm veriler mühürlendi!");
      setEditOpen(false);
    } catch (e) {
      console.error("Kayıt hatası:", e);
      toast.error("Kayıt mühürlenemedi: " + (e.message || "Bilinmeyen hata"));
    } finally {
      setSaving(false);
    }
  };

  /* ----- Form Güncelleme Helpers ----- */
  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const updateArrayItem = (field, index, key, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addArrayItem = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  /* ----- Skill & Interest Enter ile Ekleme ----- */
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-rose-500 text-sm uppercase tracking-widest animate-pulse">
            Hafıza Senkronize Ediliyor...
          </p>
        </div>
      </div>
    );
  }

  const cities = LOCATION_DATA[formData.country] || [];

  /* =========================================================
     ✅ RENDER
     ========================================================= */
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      {/* Gizli file input'lar */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "avatar")} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "cover")} />

      {/* ==================== HEADER ==================== */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Banner */}
          <div
            className="h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-3xl cursor-pointer"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} className="w-full h-full object-cover" alt="banner" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-600 to-orange-400 opacity-90" />
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase tracking-widest text-sm transition-opacity">
              Banner Değiştir
            </div>
          </div>

          {/* Profil Özet */}
          <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
            <div
              className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-8 border-white shadow-xl overflow-hidden bg-slate-100 cursor-pointer group relative"
              onClick={() => avatarInputRef.current?.click()}
            >
              <img
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "U")}&size=256&background=f43f5e&color=fff&bold=true`}
                className="w-full h-full object-cover"
                alt="avatar"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest transition-opacity">
                Değiştir
              </div>
            </div>

            <div className="flex-1 pb-2">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-800 leading-none">
                {formData.full_name || "İSİM SOYİSİM"}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-black uppercase">
                  <CheckCircle2 size={12} /> ONAYLI
                </span>
                {(formData.city || formData.country) && (
                  <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={12} /> {[formData.city, formData.country].filter(Boolean).join(", ")}
                  </span>
                )}
                {formData.phone_number && (
                  <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Phone size={12} /> {formData.phone_code} {formData.phone_number}
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={() => setEditOpen(true)}
              className="mb-2 bg-slate-900 text-white font-black px-8 h-12 rounded-xl shadow-lg hover:bg-rose-600 transition-all uppercase italic text-xs tracking-widest active:scale-95"
            >
              PROFİLİ DÜZENLE
            </Button>
          </div>
        </div>
      </div>

      {/* ==================== ANA İÇERİK ==================== */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-12 gap-10">
        {/* SOL KOLON */}
        <div className="lg:col-span-8 space-y-10">
          {/* Hakkımda */}
          {formData.about && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={18} className="text-rose-500" /> Kariyer Vizyonu
              </h3>
              <p className="text-slate-700 font-bold italic text-lg leading-relaxed">
                "{formData.about}"
              </p>
            </section>
          )}

          {/* İş Deneyimi */}
          {formData.work_experience.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Briefcase size={20} className="text-rose-500" /> İş Deneyimi
              </h3>
              <div className="space-y-4">
                {formData.work_experience.map((w, i) => (
                  <Card key={i} className="p-6 rounded-3xl border-none shadow-sm bg-white">
                    <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{w.role}</h4>
                    <p className="text-rose-600 font-black text-[10px] uppercase mt-1">
                      {w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}
                    </p>
                    {w.desc && (
                      <p className="text-slate-500 italic text-sm mt-3 pl-4 border-l-2 border-rose-100">
                        "{w.desc}"
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Eğitim */}
          {formData.education.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <GraduationCap size={20} className="text-emerald-500" /> Eğitim
              </h3>
              <div className="space-y-4">
                {formData.education.map((ed, i) => (
                  <Card key={i} className="p-6 rounded-3xl border-none shadow-sm bg-white">
                    <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{ed.school}</h4>
                    <p className="text-emerald-600 font-black text-[10px] uppercase mt-1">
                      {ed.degree} • {ed.field}
                    </p>
                    <p className="text-slate-400 font-bold text-[10px] uppercase mt-1">
                      {ed.start} - {ed.isCurrent ? "Devam Ediyor" : ed.end}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Sertifikalar */}
          {formData.certificates.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Award size={20} className="text-amber-500" /> Sertifikalar
              </h3>
              <div className="space-y-4">
                {formData.certificates.map((c, i) => (
                  <Card key={i} className="p-6 rounded-3xl border-none shadow-sm bg-white">
                    <h4 className="text-base font-black uppercase tracking-tight text-slate-800">{c.name}</h4>
                    <p className="text-amber-600 font-black text-[10px] uppercase mt-1">
                      {c.issuer} • {c.year}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:col-span-4 space-y-10">
          {/* Diller */}
          {formData.languages.length > 0 && (
            <section className="bg-white p-6 rounded-3xl shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Languages size={16} className="text-indigo-500" /> Diller
              </h3>
              <div className="space-y-3">
                {formData.languages.map((l, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                    <span className="font-black uppercase text-[10px] text-slate-700 tracking-widest">{l.lang}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Yetenekler */}
          {formData.skills.length > 0 && (
            <section className="bg-white p-6 rounded-3xl shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Cpu size={16} className="text-cyan-500" /> Yetenekler
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((s, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* İlgi Alanları */}
          {formData.interests.length > 0 && (
            <section className="bg-white p-6 rounded-3xl shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Heart size={16} className="text-pink-500" /> İlgi Alanları
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((s, i) => (
                  <span key={i} className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* =========================================================
          ✅ DÜZENLEME MODALI — DİKEY SIRALAMA
          ========================================================= */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl relative flex flex-col">

            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-8 py-6 border-b z-50 flex justify-between items-center rounded-t-[32px]">
              <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800">
                Profil Mimarı <span className="text-rose-500">v30</span>
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL İÇERİK — HER ŞEY DİKEY (ALT ALTA) */}
            <div className="p-8 space-y-10">

              {/* ───────── 1. AD SOYAD ───────── */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                <input
                  value={formData.full_name}
                  onChange={e => updateField("full_name", e.target.value)}
                  placeholder="Adınız ve Soyadınız"
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-rose-500 transition-all"
                />
              </div>

              {/* ───────── 2. LOKASYON ───────── */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasyon</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={formData.country}
                    onChange={e => {
                      updateField("country", e.target.value);
                      updateField("city", "");
                    }}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-rose-500"
                  >
                    <option value="">Ülke Seçin</option>
                    {Object.keys(LOCATION_DATA).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={formData.city}
                    onChange={e => updateField("city", e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-rose-500"
                  >
                    <option value="">Şehir Seçin</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ───────── 3. TELEFON ───────── */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Phone size={12} /> Uluslararası Telefon
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={formData.phone_code}
                    onChange={e => updateField("phone_code", e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-rose-500"
                  >
                    {PHONE_CODES.map(p => (
                      <option key={p.code} value={p.code}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    placeholder="5XX XXX XX XX"
                    value={formData.phone_number}
                    onChange={e => updateField("phone_number", e.target.value)}
                    className="sm:col-span-2 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-rose-500"
                  />
                </div>
              </div>

              {/* ───────── 4. HAKKIMDA ───────── */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Target size={12} /> Hakkımda / Kariyer Vizyonu
                </label>
                <textarea
                  value={formData.about}
                  onChange={e => updateField("about", e.target.value)}
                  placeholder="Kendinizi ve kariyer hedefinizi tanımlayın..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-rose-500 resize-none"
                />
              </div>

              {/* ───────── 5. İŞ DENEYİMİ ───────── */}
              <div className="space-y-4">
                <SectionTitle
                  icon={Briefcase}
                  color="text-rose-500"
                  title="İş Deneyimi"
                  onAdd={() => addArrayItem("work_experience", { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" })}
                />
                {formData.work_experience.map((w, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl space-y-3 relative border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Pozisyon / Ünvan"
                        value={w.role}
                        onChange={e => updateArrayItem("work_experience", i, "role", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-rose-500"
                      />
                      <input
                        placeholder="Şirket Adı"
                        value={w.company}
                        onChange={e => updateArrayItem("work_experience", i, "company", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-rose-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <input
                        placeholder="Başlangıç (2020)"
                        value={w.start}
                        onChange={e => updateArrayItem("work_experience", i, "start", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-rose-500"
                      />
                      <input
                        placeholder="Bitiş (2023)"
                        value={w.end}
                        disabled={w.isCurrent}
                        onChange={e => updateArrayItem("work_experience", i, "end", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none disabled:opacity-40 focus:ring-2 ring-rose-500"
                      />
                      <label className="flex items-center gap-2 cursor-pointer justify-center">
                        <input
                          type="checkbox"
                          checked={w.isCurrent}
                          onChange={e => updateArrayItem("work_experience", i, "isCurrent", e.target.checked)}
                          className="w-4 h-4 accent-rose-500"
                        />
                        <span className="text-[9px] font-black uppercase text-slate-400">Devam Ediyor</span>
                      </label>
                      <button
                        onClick={() => removeArrayItem("work_experience", i)}
                        className="flex items-center justify-center gap-1 bg-white text-red-400 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase"
                      >
                        <Trash2 size={14} /> SİL
                      </button>
                    </div>
                    <textarea
                      placeholder="Görev tanımı ve başarılarınız..."
                      value={w.desc}
                      onChange={e => updateArrayItem("work_experience", i, "desc", e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none min-h-[80px] resize-none focus:ring-2 ring-rose-500"
                    />
                  </div>
                ))}
              </div>

              {/* ───────── 6. EĞİTİM ───────── */}
              <div className="space-y-4">
                <SectionTitle
                  icon={GraduationCap}
                  color="text-emerald-500"
                  title="Eğitim Bilgileri"
                  onAdd={() => addArrayItem("education", { school: "", degree: "", field: "", start: "", end: "", isCurrent: false })}
                />
                {formData.education.map((ed, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Okul / Üniversite"
                        value={ed.school}
                        onChange={e => updateArrayItem("education", i, "school", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-emerald-500"
                      />
                      <input
                        placeholder="Bölüm / Alan"
                        value={ed.field}
                        onChange={e => updateArrayItem("education", i, "field", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <select
                        value={ed.degree}
                        onChange={e => updateArrayItem("education", i, "degree", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-emerald-500"
                      >
                        <option value="">Derece</option>
                        <option value="Lise">Lise</option>
                        <option value="Ön Lisans">Ön Lisans</option>
                        <option value="Lisans">Lisans</option>
                        <option value="Yüksek Lisans">Yüksek Lisans</option>
                        <option value="Doktora">Doktora</option>
                      </select>
                      <input
                        placeholder="Başlangıç"
                        value={ed.start}
                        onChange={e => updateArrayItem("education", i, "start", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-emerald-500"
                      />
                      <input
                        placeholder="Bitiş"
                        value={ed.end}
                        disabled={ed.isCurrent}
                        onChange={e => updateArrayItem("education", i, "end", e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none disabled:opacity-40 focus:ring-2 ring-emerald-500"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ed.isCurrent}
                            onChange={e => updateArrayItem("education", i, "isCurrent", e.target.checked)}
                            className="w-4 h-4 accent-emerald-500"
                          />
                          <span className="text-[8px] font-black uppercase text-slate-400">Devam</span>
                        </label>
                        <button
                          onClick={() => removeArrayItem("education", i)}
                          className="text-red-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ───────── 7. DİLLER ───────── */}
              <div className="space-y-4">
                <SectionTitle
                  icon={Languages}
                  color="text-indigo-500"
                  title="Dil Yetkinliği"
                  onAdd={() => addArrayItem("languages", { lang: "", level: 1 })}
                />
                {formData.languages.map((l, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <select
                      value={l.lang}
                      onChange={e => updateArrayItem("languages", i, "lang", e.target.value)}
                      className="flex-1 p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-indigo-500"
                    >
                      <option value="">Dil Seçin</option>
                      {LANGUAGE_LIST.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateArrayItem("languages", i, "level", s)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star size={20} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => removeArrayItem("languages", i)} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* ───────── 8. SERTİFİKALAR ───────── */}
              <div className="space-y-4">
                <SectionTitle
                  icon={Award}
                  color="text-amber-500"
                  title="Sertifikalar"
                  onAdd={() => addArrayItem("certificates", { name: "", issuer: "", year: "" })}
                />
                {formData.certificates.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                    <input
                      placeholder="Sertifika Adı"
                      value={c.name}
                      onChange={e => updateArrayItem("certificates", i, "name", e.target.value)}
                      className="sm:col-span-2 w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-amber-500"
                    />
                    <input
                      placeholder="Kurum"
                      value={c.issuer}
                      onChange={e => updateArrayItem("certificates", i, "issuer", e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-amber-500"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        placeholder="Yıl"
                        value={c.year}
                        onChange={e => updateArrayItem("certificates", i, "year", e.target.value)}
                        className="flex-1 p-3 bg-white rounded-xl border border-slate-100 font-bold text-xs outline-none focus:ring-2 ring-amber-500"
                      />
                      <button onClick={() => removeArrayItem("certificates", i)} className="text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ───────── 9. TEKNİK PROGRAMLAR & SKİLLER ───────── */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Cpu size={12} className="text-cyan-500" /> Teknik Programlar & Yetenekler
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => updateField("skills", formData.skills.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 ml-1">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="Yetenek yazıp Enter'a basın..."
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-cyan-500"
                />
              </div>

              {/* ───────── 10. İLGİ ALANLARI ───────── */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Heart size={12} className="text-pink-500" /> İlgi Alanları
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((s, i) => (
                    <span key={i} className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => updateField("interests", formData.interests.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 ml-1">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="İlgi alanı yazıp Enter'a basın..."
                  value={interestInput}
                  onChange={e => setInterestInput(e.target.value)}
                  onKeyDown={handleInterestKeyDown}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-pink-500"
                />
              </div>
            </div>

            {/* MODAL FOOTER — KAYDET */}
            <div className="sticky bottom-0 p-6 bg-white/95 backdrop-blur-sm border-t flex gap-3 rounded-b-[32px]">
              <Button
                onClick={() => setEditOpen(false)}
                variant="outline"
                className="px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2"
              >
                İPTAL
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl text-lg font-black uppercase italic text-white shadow-xl active:scale-[0.98] transition-all tracking-widest disabled:opacity-60"
              >
                {saving ? "MÜHÜRLENİYOR..." : "HAFIZAYI MÜHÜRLE"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Çözülen Sorunlar

| Sorun | Neden | Çözüm |
|-------|-------|-------|
| **Banner/Avatar kayboluyor** | `handleFileUpload` sadece state güncelliyordu, DB'ye düzgün yazmıyordu | Yükleme anında **hemen** `profiles` tablosuna `update` ile mühürleniyor |
| **Kayıt çalışmıyor** | `cv_data` içine `avatar_url`, `cover_url` gibi gereksiz alanlar da gidiyordu, çakışma oluyordu | `cv_data` sadece CV verilerini tutuyor, üst seviye alanlar (`full_name`, `avatar_url`, vs.) ayrı gidiyor |
| **Modal'da bölümler eksik** | Eğitim, sertifika, skill, ilgi alanı yoktu | 10 bölüm tam dikey sıralama ile eklendi |
| **Skill/Interest ekleme yok** | Enter ile ekleme mekanizması yoktu | `onKeyDown` ile Enter basınca tag olarak ekleniyor, X ile silinebiliyor |
| **Aynı dosya tekrar seçilemiyordu** | Input value sıfırlanmıyordu | `e.target.value = ""` ile sıfırlanıyor |
