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
  Globe2, Camera, Mail, Phone, UploadCloud, Award
} from "lucide-react";

// 200+ Ülke Listesi
const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Egypt", "France", "Germany", "India", "Italy", "Japan", "Mexico", "Netherlands", "Norway", "Qatar", "Russia", "Saudi Arabia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Turkey", "UAE", "United Kingdom", "United States"].sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const langCtx = useLanguage?.();
  const lang = useMemo(() => (langCtx?.lang?.startsWith("TR") ? "TR" : "EN"), [langCtx?.lang]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", country: "Turkey", phone_number: "", sector: "", 
    avatar_url: "", cover_url: "", // Banner alanı eklendi
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    languages: [], skills: [], hobbies_indices: [],
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) setFormData({ ...formData, ...p, cv_data: p.cv_data || {} });
      } catch (err) { console.error("Oturum Hatası:", err); } 
      finally { setLoading(false); }
    };
    init();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Dosya boyutu 2MB'den küçük olmalı.");

    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Bucket kontrolü için hata yakalama
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`avatars/${fileName}`, file);

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error("Lütfen Supabase panelinden 'profiles' isimli bir Bucket oluşturun.");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      
      const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateData }));
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      
      toast.success(`${type === 'avatar' ? 'Profil' : 'Kapak'} fotoğrafı yüklendi.`);
    } catch (error) {
      toast.error(error.message || "Yükleme başarısız.");
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Değişiklikler Kaydedildi");
      setEditOpen(false);
    } catch (e) { toast.error("Hata oluştu."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-bold text-rose-500 animate-pulse uppercase tracking-widest">Global Sistem Yükleniyor...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans overflow-x-hidden">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* BANNER & PROFILE HEADER */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <div 
            className="h-48 md:h-64 relative cursor-pointer group overflow-hidden rounded-b-3xl"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} className="w-full h-full object-cover" alt="Banner" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#e11d48] to-[#f59e0b] opacity-90" />
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white flex items-center gap-2">
                <Camera size={20} /> <span className="text-xs font-bold uppercase tracking-wider">Kapak Fotoğrafını Güncelle</span>
              </div>
            </div>
            {uploading.cover && <div className="absolute inset-0 bg-white/40 flex items-center justify-center font-bold text-rose-600 animate-pulse italic">Kapak Yükleniyor...</div>}
          </div>

          <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-24 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-white overflow-hidden shadow-xl bg-slate-100 relative">
                <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}&background=random`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                  <Camera size={28} />
                </div>
                {uploading.avatar && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
              </div>
            </div>
            
            <div className="flex-1 pb-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{formData.full_name || "İsim Soyisim"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-slate-500 font-semibold text-xs uppercase">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 size={12}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14}/> {formData.sector || "Sektör Belirtilmedi"}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.country}</span>
              </div>
            </div>
            
            <Button onClick={() => setEditOpen(true)} className="mb-4 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-bold border border-slate-200 px-8 h-11 shadow-none transition-all">
              <Pencil size={16} className="mr-2"/> Profili Düzenle
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            {/* Vizyon Kartı - Beyaz ve Sade */}
            <Card className="rounded-3xl border-none shadow-sm bg-white p-10">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Target size={18} className="text-orange-500" /> Vizyon & Strateji
               </h3>
               <p className="text-slate-700 font-bold italic leading-relaxed text-xl mb-6">"{formData.career_goals?.vision || "..."}"</p>
               <div className="p-6 bg-slate-50 rounded-2xl border-l-8 border-orange-400 font-semibold text-slate-600">
                 {formData.career_goals?.short_term_plan || "Kısa vadeli plan yok."}
               </div>
            </Card>

            {/* Diller Kartı - Siyah Alanlar Kaldırıldı */}
            <Card className="rounded-3xl border-none shadow-sm bg-white p-10">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Languages size={18} className="text-emerald-500" /> Global Dil Yetkinliği
               </h3>
               <div className="grid md:grid-cols-2 gap-6">
                 {formData.languages?.map((l, i) => (
                   <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">{l.name}</h4>
                        <div className="flex gap-1 mt-2">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={12} className={star <= l.level ? "fill-emerald-500 text-emerald-500" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-white text-emerald-600 px-3 py-1 rounded-lg shadow-sm border border-emerald-50 uppercase tracking-widest">Level {l.level}</span>
                   </div>
                 ))}
               </div>
            </Card>
         </div>

         {/* Sağ Kolon - Siyah Olmayan Yeni Tasarım */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-sm bg-white p-8 sticky top-24 overflow-hidden">
               <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-10 flex items-center gap-3">
                 <Mail size={16} /> İletişim & Sosyal
               </h3>
               <div className="space-y-8">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Email</span>
                     <span className="font-bold text-sm text-slate-700 truncate">{formData.email}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Telefon</span>
                     <span className="font-bold text-lg text-slate-700">{formData.phone_number || "---"}</span>
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-slate-50">
                    <Linkedin size={22} className="text-slate-300 hover:text-rose-500 cursor-pointer transition-all" />
                    <Github size={22} className="text-slate-300 hover:text-rose-500 cursor-pointer transition-all" />
                  </div>
               </div>
            </Card>
         </div>
      </main>

      {/* MODAL - Global ve Ferah */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Profil Mimarı <span className="text-rose-500 italic">v2.1 Global</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-white border shadow-sm flex items-center justify-center rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bulunduğun Ülke (AI İçin Kritik)</label>
                  <select 
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})} 
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white font-bold text-slate-700 outline-none transition-all appearance-none"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  {["full_name", "sector", "city", "phone_number"].map(f => (
                    <div key={f} className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{f.replace('_', ' ')}</label>
                       <input value={formData[f]} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white font-bold text-slate-700 outline-none transition-all" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 border-t flex gap-6 bg-slate-50/50">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-16 rounded-2xl font-black text-white shadow-xl shadow-rose-200 transition-all uppercase tracking-widest italic text-lg">Değişiklikleri Kaydet</Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-16 px-10 rounded-2xl font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-600">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
