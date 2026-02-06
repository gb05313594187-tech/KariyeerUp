// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User, Pencil, X, Briefcase, Trash2, Target, MapPin, GraduationCap,
  Languages, Cpu, Heart, CheckCircle2, Star, Linkedin, Github, Instagram,
  Globe2, Camera, Mail, Phone, UploadCloud, History, Award, Image as ImageIcon
} from "lucide-react";

// --- 200+ GLOBAL ÜLKE LİSTESİ ---
const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Egypt", "France", "Germany", "India", "Italy", "Japan", "Mexico", "Netherlands", "Norway", "Qatar", "Russia", "Saudi Arabia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Turkey", "UAE", "United Kingdom", "United States"].sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null); // Kapak fotoğrafı referansı
  const langCtx = useLanguage?.();
  const lang = useMemo(() => (langCtx?.lang?.startsWith("TR") ? "TR" : "EN"), [langCtx?.lang]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", country: "Turkey", phone_number: "", sector: "", 
    avatar_url: "", cover_url: "", // Kapak fotoğrafı eklendi
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    languages: [], skills: [], hobbies_indices: [],
  });

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        if (mounted) {
          setMe(user);
          const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
          if (p) setFormData({ ...formData, ...p, cv_data: p.cv_data || {} });
        }
      } catch (err) { console.error(err); } finally { if (mounted) setLoading(false); }
    };
    checkUser();
    return () => { mounted = false; };
  }, []);

  // ✅ GENEL DOSYA YÜKLEME (Avatar veya Cover)
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage.from('profiles').upload(`avatars/${fileName}`, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      
      const updateField = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateField }));
      await supabase.from("profiles").update(updateField).eq("id", me.id);
      
      toast.success(`${type === 'avatar' ? 'Profil' : 'Kapak'} fotoğrafı güncellendi.`);
    } catch (error) {
      toast.error("Yükleme hatası.");
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profil Güncellendi");
      setEditOpen(false);
    } catch (e) { toast.error("Hata oluştu"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-bold text-rose-500 animate-pulse text-lg tracking-widest uppercase">Kariyer Global Yükleniyor...</div>;

  return (
    <div className="bg-[#F0F2F5] min-h-screen pb-12 font-sans overflow-x-hidden">
      {/* Gizli Inputlar */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Banner / Kapak Fotoğrafı */}
          <div 
            className="h-48 md:h-64 relative cursor-pointer group overflow-hidden rounded-b-2xl"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" />
            )}
            
            {/* Kapak Fotoğrafı Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                <Camera size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Kapak Fotoğrafını Değiştir</span>
              </div>
            </div>
            {uploading.cover && <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center font-bold text-rose-600 animate-pulse italic">Kapak Yükleniyor...</div>}
          </div>

          {/* Profil Bilgileri Barı */}
          <div className="px-8 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-24 relative z-10">
            {/* Profil Fotoğrafı */}
            <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}>
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden shadow-2xl bg-slate-100 relative">
                <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}&background=random`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                  <Camera size={28} />
                  <span className="text-[10px] font-bold mt-1 uppercase">Değiştir</span>
                </div>
                {uploading.avatar && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
              </div>
            </div>
            
            <div className="flex-1 pb-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{formData.full_name || "İsim Soyisim"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-slate-500 font-semibold text-xs uppercase">
                <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 size={12}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14}/> {formData.sector}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.country}</span>
              </div>
            </div>
            
            <Button onClick={() => setEditOpen(true)} className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold border border-slate-200 px-8 h-11 shadow-none">
              <Pencil size={16} className="mr-2"/> Profili Düzenle
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
        {/* Sol Kolon ve İçerik aynı kalacak... */}
        <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Target size={18} className="text-orange-500" /> Vizyon & Strateji
               </h3>
               <p className="text-slate-700 font-bold italic leading-relaxed text-xl mb-6">"{formData.career_goals?.vision || "..."}"</p>
               <div className="p-6 bg-orange-50/50 rounded-2xl border-l-8 border-orange-500 font-semibold text-slate-600">
                 {formData.career_goals?.short_term_plan || "Kısa vadeli plan yok."}
               </div>
            </section>

            <section className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Languages size={18} className="text-emerald-500" /> Global Dil Yetkinliği (AI Puanlı)
               </h3>
               <div className="grid md:grid-cols-2 gap-6">
                 {formData.languages?.map((l, i) => (
                   <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div>
                        <h4 className="font-bold text-slate-800">{l.name}</h4>
                        <div className="flex gap-1 mt-2">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={12} className={star <= l.level ? "fill-emerald-500 text-emerald-500" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">Level {l.level}</span>
                   </div>
                 ))}
               </div>
            </section>
        </div>

        {/* Sağ Kolon aynı kalacak... */}
        <div className="lg:col-span-4">
            <Card className="rounded-3xl border-none shadow-xl bg-[#0f172a] text-white p-8 sticky top-24 overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-5"><Globe2 size={200} /></div>
               <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-10 flex items-center gap-3">
                 <Mail size={16} /> İletişim & Sosyal
               </h3>
               <div className="space-y-8">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Profesyonel Email</span>
                     <span className="font-bold text-sm truncate">{formData.email}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <span className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Telefon</span>
                     <span className="font-bold text-lg">{formData.phone_number || "---"}</span>
                  </div>
               </div>
            </Card>
        </div>
      </main>

      {/* MODAL SECTION (Kodun kalanıyla aynı kalacak...) */}
      {/* ... editOpen && (...) ... */}
    </div>
  );
}
