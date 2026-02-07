// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  X, Briefcase, GraduationCap, Cpu, Languages, Target, 
  Camera, Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2 
} from "lucide-react";

/* =========================================================
   ✅ GLOBAL VERİ SETLERİ (TAM LİSTE)
   ========================================================= */
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)", country: "TR" },
  { code: "+216", label: "Tunisia (+216)", country: "TN" },
  { code: "+44", label: "United Kingdom (+44)", country: "UK" },
  { code: "+971", label: "UAE (+971)", country: "UAE" },
  { code: "+966", label: "Saudi Arabia (+966)", country: "SA" },
  { code: "+33", label: "France (+33)", country: "FR" },
  { code: "+49", label: "Germany (+49)", country: "DE" }
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Mersin", "Diyarbakir"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Edinburgh"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Taif", "Tabuk", "Buraydah"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf"]
};

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  /* =========================================================
     ✅ DEV HR DATA MODEL (HİÇBİR ALAN EKSİK DEĞİL)
     ========================================================= */
  const [formData, setFormData] = useState({
    full_name: "",
    country: "Turkey",
    city: "",
    about: "",
    phone_code: "+90",
    phone_number: "",
    avatar_url: "",
    cover_url: "",
    // Dinamik Listeler
    work_experience: [],
    education: [],
    skills: [],
    certificates: [],
    languages: [],
    interests: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);

        // Profili Getir
        const { data: p, error } = await supabase
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
            work_experience: cv.work_experience || [],
            education: cv.education || [],
            skills: cv.skills || [],
            certificates: cv.certificates || [],
            languages: cv.languages || [],
            interests: cv.interests || []
          });
        }
      } catch (err) {
        console.error("Mühürleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  /* =========================================================
     ✅ GÖRSEL YÜKLEME & BETON MÜHÜRLEME
     ========================================================= */
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}/${type}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      const updateData = type === 'avatar' 
        ? { avatar_url: publicUrl } 
        : { cover_url: publicUrl };

      // 1. Arayüzü Güncelle
      setFormData(prev => ({ ...prev, ...updateData }));
      
      // 2. Veritabanına Beton Mühür (Cache silinse de gitmez)
      const { error: dbError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", me.id);

      if (dbError) throw dbError;

      toast.success(`${type === 'avatar' ? 'Profil' : 'Kapak'} fotoğrafı veritabanına mühürlendi.`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Yükleme hatası: Supabase ayarlarını kontrol edin.");
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  /* =========================================================
     ✅ TÜM VERİLERİ HAVUZA MÜHÜRLEME
     ========================================================= */
  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        full_name: formData.full_name,
        country: formData.country,
        city: formData.city,
        avatar_url: formData.avatar_url,
        cover_url: formData.cover_url,
        cv_data: {
          about: formData.about,
          phone_code: formData.phone_code,
          phone_number: formData.phone_number,
          work_experience: formData.work_experience,
          education: formData.education,
          skills: formData.skills,
          certificates: formData.certificates,
          languages: formData.languages,
          interests: formData.interests
        },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success("Tüm kariyer verileri başarıyla mühürlendi!");
      setEditOpen(false);
    } catch (e) {
      console.error("Save error:", e);
      toast.error("Kayıt mühürlenemedi. Lütfen bağlantınızı kontrol edin.");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse text-2xl tracking-[1em] uppercase italic">
      AI Engine Syncing...
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 font-sans text-left overflow-x-hidden">
      {/* Hidden Inputs */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* ----------------- HEADER & BANNER ----------------- */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <div 
            className="h-60 md:h-80 bg-slate-200 relative group overflow-hidden rounded-b-[60px] cursor-pointer transition-all hover:brightness-95 shadow-inner"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-600 to-orange-400 opacity-90" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase tracking-[0.5em] transition-all italic text-xl">
              Kapak Fotoğrafını Değiştir
            </div>
            {uploading.cover && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-black text-rose-500">MÜHÜRLENİYOR...</div>
            )}
          </div>

          <div className="px-10 md:px-20 pb-12 flex flex-col md:flex-row items-end gap-10 -mt-24 relative z-10">
            <div 
              className="w-44 h-44 md:w-56 md:h-56 rounded-[65px] border-[12px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer group relative"
              onClick={() => avatarInputRef.current?.click()}
            >
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-[10px] uppercase tracking-widest transition-all">DEĞİŞTİR</div>
              {uploading.avatar && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-rose-500 font-black">...</div>
              )}
            </div>
            
            <div className="flex-1 pb-6">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-800 leading-none mb-4">
                {formData.full_name || "NAME SURNAME"}
              </h1>
              <div className="flex flex-wrap gap-6 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-rose-100">
                  <CheckCircle2 size={16}/> ONAYLI PRO
                </span>
                <span className="flex items-center gap-2 px-2 py-1.5">
                  <MapPin size={18} className="text-slate-300"/> {formData.city || "Şehir"}, {formData.country}
                </span>
                <span className="flex items-center gap-2 px-2 py-1.5">
                  <Phone size={18} className="text-slate-300"/> {formData.phone_code} {formData.phone_number || "000 000 00 00"}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={() => setEditOpen(true)} 
              className="mb-6 bg-slate-900 text-white font-black px-16 h-20 rounded-[35px] shadow-2xl hover:bg-rose-600 transition-all uppercase italic tracking-widest text-lg active:scale-95 flex items-center gap-3 border-4 border-white"
            >
              <Pencil size={20} /> PROFİLİ DÜZENLE
            </Button>
          </div>
        </div>
      </div>

      {/* ----------------- ANA İÇERİK ----------------- */}
      <main className="max-w-7xl mx-auto px-10 md:px-20 py-24 grid lg:grid-cols-12 gap-20">
        
        {/* SOL KOLON (DENEYİM, EĞİTİM, SERTİFİKA) */}
        <div className="lg:col-span-8 space-y-24">
          
          {/* HAKKIMDA */}
          <section className="bg-white p-12 rounded-[55px] shadow-sm border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <Target size={24} className="text-rose-500" /> Kariyer Vizyonu
            </h3>
            <p className="text-slate-700 font-bold italic text-xl leading-relaxed">
              "{formData.about || "Kariyer hedeflerinizi ve profesyonel özetinizi buraya ekleyerek AI Matcher havuzunda öne çıkın..."}"
            </p>
          </section>

          {/* İŞ DENEYİMİ */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-12 flex items-center gap-6">
              <Briefcase size={28} className="text-rose-500" /> Profesyonel Deneyim
            </h3>
            <div className="space-y-12">
              {formData.work_experience.length > 0 ? formData.work_experience.map((w, i) => (
                <Card key={i} className="p-12 rounded-[60px] border-none shadow-sm bg-white hover:shadow-xl transition-all border-l-[15px] border-l-rose-500/10">
                  <h4 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">{w.role}</h4>
                  <div className="flex justify-between items-center mt-2 mb-8">
                    <p className="text-rose-600 font-black text-base uppercase tracking-widest">
                      {w.company} <span className="text-slate-200 mx-3">/</span> {w.start} - {w.isCurrent ? "Günümüz" : w.end}
                    </p>
                  </div>
                  <p className="text-slate-500 italic text-base leading-relaxed pl-8 border-l-4 border-slate-50">
                    "{w.desc}"
                  </p>
                </Card>
              )) : (
                <div className="p-20 bg-slate-50 rounded-[60px] border-4 border-dashed border-slate-200 text-center font-black text-slate-300 uppercase tracking-widest">
                  Henüz İş Deneyimi Eklenmedi
                </div>
              )}
            </div>
          </section>

          {/* EĞİTİM GEÇMİŞİ */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-12 flex items-center gap-6">
              <GraduationCap size={30} className="text-orange-500" /> Akademik Kariyer
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {formData.education.map((e, i) => (
                <Card key={i} className="p-10 rounded-[45px] border-none shadow-sm bg-white hover:shadow-2xl transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-4 py-1.5 rounded-xl uppercase tracking-widest">
                      {e.level}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 italic">GPA: {e.gpa || "0.0"}</span>
                  </div>
                  <h4 className="text-xl font-black uppercase text-slate-800 mt-6 tracking-tighter group-hover:text-orange-600 transition-colors">
                    {e.field || "Bölüm Belirtilmedi"}
                  </h4>
                  <p className="text-slate-400 font-bold text-xs uppercase mt-1">
                    {e.school || "Okul / Üniversite Adı"}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* SAĞ KOLON (DİLLER, PROGRAMLAR, SERTİFİKALAR) */}
        <div className="lg:col-span-4 space-y-24">
          
          {/* DİL YETKİNLİĞİ */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-5">
              <Languages size={24} className="text-indigo-500" /> Dil Yetkinliği
            </h3>
            <div className="space-y-6">
              {formData.languages.map((l, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 group hover:border-indigo-500/20 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black uppercase text-xs text-slate-700 tracking-widest italic">{l.lang}</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(s => (
                        <Star 
                          key={s} 
                          size={16} 
                          fill={s <= l.level ? "#6366f1" : "none"} 
                          className={s <= l.level ? "text-indigo-500" : "text-slate-100"} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(l.level / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* KULLANILAN PROGRAMLAR */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-5">
              <Cpu size={24} className="text-emerald-500" /> Teknik Araçlar
            </h3>
            <div className="flex flex-wrap gap-4">
              {formData.skills.map((s, i) => (
                <span key={i} className="px-6 py-3 bg-white text-slate-800 rounded-[20px] text-[10px] font-black uppercase border border-slate-100 shadow-sm hover:scale-110 hover:text-emerald-600 transition-all cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* SERTİFİKALAR */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-5">
              <Award size={24} className="text-yellow-500" /> Sertifikalar
            </h3>
            <div className="space-y-4">
              {formData.certificates.map((c, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl border border-slate-50 shadow-sm flex items-center gap-5 hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 shadow-inner">
                    <Award size={24}/>
                  </div>
                  <div>
                    <h5 className="font-black text-slate-800 text-xs uppercase italic">{c.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{c.issuer} • {c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* İLGİ ALANLARI */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-5">
              <Heart size={24} className="text-rose-500" /> İlgi Alanları
            </h3>
            <div className="flex flex-wrap gap-3">
              {formData.interests.map((it, i) => (
                <span key={i} className="px-5 py-2.5 bg-rose-50/50 text-rose-600 rounded-2xl text-[9px] font-black uppercase italic border border-rose-100">
                  {it}
                </span>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* =========================================================
          ✅ ULTRA GENİŞ MODAL (TAM SENKRONİZE DÜZENLEME)
          ========================================================= */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12">
          <div className="bg-white w-full max-w-7xl max-h-[92vh] overflow-y-auto rounded-[100px] shadow-2xl border border-white/40 custom-scrollbar relative animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 p-16 border-b z-50 flex justify-between items-center backdrop-blur-md">
              <div className="text-left">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">
                  Profil Mimarı <span className="text-rose-500">v29 ULTRA</span>
                </h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.5em] mt-3 italic">
                  Hafıza Senkronizasyonu & Beton Mühürleme Aktif
                </p>
              </div>
              <button 
                onClick={() => setEditOpen(false)} 
                className="w-24 h-24 bg-slate-50 rounded-[45px] flex items-center justify-center hover:rotate-90 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-inner active:scale-90"
              >
                <X size={48} />
              </button>
            </div>
            
            <div className="p-16 space-y-24 text-left">
              
              {/* 1. TEMEL KİMLİK & İLETİŞİM (ULTRA GENİŞ GRID) */}
              <section className="space-y-12">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.8em] ml-4 italic border-b pb-4">01. Temel Bilgiler & Global İletişim</h4>
                <div className="grid lg:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-6">Tam Ad Soyad</label>
                    <input 
                      value={formData.full_name} 
                      onChange={e => setFormData({...formData, full_name: e.target.value})} 
                      className="w-full p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none focus:ring-[15px] ring-rose-500/5 shadow-inner transition-all"
                      placeholder="Adınızı ve soyadınızı girin..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-6">Global Lokasyon</label>
                    <div className="flex gap-4">
                      <select 
                        value={formData.country} 
                        onChange={e => setFormData({...formData, country: e.target.value, city: ""})} 
                        className="flex-1 p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none shadow-inner cursor-pointer"
                      >
                        {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select 
                        value={formData.city} 
                        onChange={e => setFormData({...formData, city: e.target.value})} 
                        className="flex-1 p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none shadow-inner cursor-pointer"
                      >
                        <option value="">Şehir Seçiniz...</option>
                        {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-6">Uluslararası Telefon</label>
                    <div className="flex gap-4">
                      <select 
                        value={formData.phone_code} 
                        onChange={e => setFormData({...formData, phone_code: e.target.value})} 
                        className="min-w-[260px] p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none shadow-inner cursor-pointer"
                      >
                        {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                      </select>
                      <input 
                        placeholder="5XX XXX XX XX" 
                        value={formData.phone_number} 
                        onChange={e => setFormData({...formData, phone_number: e.target.value})} 
                        className="flex-1 p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none shadow-inner" 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-6">Kariyer Özeti (Hakkımda)</label>
                  <textarea 
                    value={formData.about} 
                    onChange={e => setFormData({...formData, about: e.target.value})} 
                    className="w-full p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none shadow-inner min-h-[160px] resize-none focus:ring-[15px] ring-rose-500/5 transition-all"
                    placeholder="Profesyonel geçmişinizi, uzmanlık alanlarınızı ve gelecek hedeflerinizi anlatın..."
                  />
                </div>
              </section>

              {/* 2. İŞ DENEYİMLERİ (DİNAMİK EKLE/SİL) */}
              <section className="space-y-12">
                <div className="flex justify-between items-center border-b pb-8">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.8em] ml-4 italic">02. Profesyonel Geçmiş</h4>
                  <Button 
                    onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" }]})} 
                    className="bg-rose-500 text-white rounded-[35px] font-black text-xs px-16 h-20 shadow-2xl hover:bg-rose-600 transition-all flex items-center gap-3 active:scale-95"
                  >
                    <Plus size={24}/> YENİ DENEYİM EKLE
                  </Button>
                </div>
                <div className="space-y-12">
                  {formData.work_experience.map((w, i) => (
                    <div key={i} className="p-16 bg-slate-50 rounded-[80px] space-y-10 relative group border-4 border-transparent hover:border-rose-500/10 transition-all shadow-inner">
                      <div className="grid lg:grid-cols-4 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Pozisyon / Rol</label>
                          <input placeholder="Örn: Kıdemli Pazarlama Müdürü" value={w.role} onChange={e => { const nw = [...formData.work_experience]; nw[i].role = e.target.value; setFormData({...formData, work_experience: nw}); }} className="w-full p-6 rounded-[30px] bg-white border-none font-bold text-slate-800 shadow-sm" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Şirket Adı</label>
                          <input placeholder="Örn: Yemeksepeti" value={w.company} onChange={e => { const nw = [...formData.work_experience]; nw[i].company = e.target.value; setFormData({...formData, work_experience: nw}); }} className="w-full p-6 rounded-[30px] bg-white border-none font-bold text-slate-800 shadow-sm" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Zaman Aralığı</label>
                          <div className="flex gap-2">
                             <input placeholder="Başlangıç" value={w.start} onChange={e => { const nw = [...formData.work_experience]; nw[i].start = e.target.value; setFormData({...formData, work_experience: nw}); }} className="flex-1 p-6 rounded-[30px] bg-white border-none font-bold text-slate-800 text-center text-xs shadow-sm" />
                             {!w.isCurrent && <input placeholder="Bitiş" value={w.end} onChange={e => { const nw = [...formData.work_experience]; nw[i].end = e.target.value; setFormData({...formData, work_experience: nw}); }} className="flex-1 p-6 rounded-[30px] bg-white border-none font-bold text-slate-800 text-center text-xs shadow-sm" />}
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 pt-4">
                           <span className="text-[10px] font-black text-slate-300 uppercase italic">Hala Çalışıyorum</span>
                           <input type="checkbox" checked={w.isCurrent} onChange={e => { const nw = [...formData.work_experience]; nw[i].isCurrent = e.target.checked; setFormData({...formData, work_experience: nw}); }} className="w-10 h-10 accent-rose-500 cursor-pointer shadow-lg" />
                        </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Görev Tanımı & Başarılar</label>
                         <textarea placeholder="Bu pozisyondaki sorumluluklarınızdan ve elde ettiğiniz başarılardan bahsedin..." value={w.desc} onChange={e => { const nw = [...formData.work_experience]; nw[i].desc = e.target.value; setFormData({...formData, work_experience: nw}); }} className="w-full p-8 bg-white rounded-[40px] border-none font-bold text-slate-700 min-h-[140px] resize-none shadow-sm" />
                      </div>
                      <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute -top-6 -right-6 w-20 h-20 bg-white text-red-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-2xl active:scale-90"><Trash2 size={32}/></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. DİLLER & PROGRAMLAR (YAN YANA) */}
              <div className="grid lg:grid-cols-2 gap-16">
                 
                 {/* DİLLER */}
                 <section className="space-y-10">
                   <div className="flex justify-between items-center border-b pb-6">
                     <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] italic">03. Dil Yetkinliği</h4>
                     <Button size="sm" onClick={() => setFormData({...formData, languages: [...formData.languages, { lang: "English", level: 3 }]})} className="bg-indigo-600 text-white rounded-2xl font-black text-[10px] px-8 h-12 shadow-lg">DİL EKLE</Button>
                   </div>
                   <div className="space-y-6">
                      {formData.languages.map((l, i) => (
                        <div key={i} className="p-8 bg-slate-50 rounded-[40px] flex items-center justify-between border-2 border-white shadow-inner">
                           <input placeholder="Dil..." value={l.lang} onChange={e => { const nl = [...formData.languages]; nl[i].lang = e.target.value; setFormData({...formData, languages: nl}); }} className="bg-transparent font-black uppercase text-xs outline-none w-1/3 text-slate-700 placeholder:text-slate-200" />
                           <div className="flex gap-2">
                              {[1,2,3,4,5].map(v => (
                                <button key={v} onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }} className={`w-10 h-10 rounded-2xl font-black text-[11px] transition-all shadow-md ${l.level === v ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/10' : 'bg-white text-slate-300 hover:text-indigo-400'}`}>{v}</button>
                              ))}
                           </div>
                           <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="text-red-300 hover:text-red-500 transition-all ml-4 active:scale-75"><Trash2 size={24}/></button>
                        </div>
                      ))}
                   </div>
                 </section>

                 {/* SKILLS */}
                 <section className="space-y-10">
                    <div className="border-b pb-6 text-left">
                       <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] italic">04. Teknik Programlar (Enter)</h4>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[45px] border-2 border-white shadow-inner flex flex-wrap gap-4 min-h-[140px] items-start">
                       {formData.skills.map((s, idx) => (
                         <span key={idx} className="bg-white px-6 py-3 rounded-[20px] font-black text-[11px] uppercase shadow-lg text-emerald-600 flex items-center gap-3 border border-emerald-50">
                           {s} <X size={14} className="cursor-pointer text-red-300 hover:text-red-500 hover:rotate-90 transition-all" onClick={() => setFormData({...formData, skills: formData.skills.filter(x => x !== s)})} />
                         </span>
                       ))}
                       <input 
                         placeholder="+ Yeni bir yetkinlik yazıp Enter'a basın..." 
                         onKeyDown={e => { if(e.key === 'Enter' && e.target.value) { setFormData({...formData, skills: [...formData.skills, e.target.value]}); e.target.value = ""; } }} 
                         className="bg-transparent text-[11px] font-bold outline-none flex-1 p-3 text-slate-400" 
                       />
                    </div>
                 </section>
              </div>

            </div>

            {/* Modal Save Button */}
            <div className="sticky bottom-0 p-20 bg-white/98 backdrop-blur-md border-t flex gap-10 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-rose-600 hover:bg-rose-700 h-32 rounded-[65px] text-4xl font-black uppercase italic text-white shadow-2xl transition-all active:scale-95 shadow-rose-200 tracking-[0.5em] border-[8px] border-white"
              >
                HAFIZAYI MÜHÜRLE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
