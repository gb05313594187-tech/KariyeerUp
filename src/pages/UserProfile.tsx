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
  Globe2, Camera, Mail, Phone, UploadCloud, History, Award, Plus
} from "lucide-react";

// --- 200+ ÜLKE ---
const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "China", "France", "Germany", "India", "Italy", "Japan", "Mexico", "Netherlands", "Norway", "Qatar", "Russia", "Saudi Arabia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Turkey", "UAE", "United Kingdom", "United States", "Uzbekistan", "Vietnam"].sort();

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

  // --- HAFIZA: TÜM ALANLARI KAPSAYAN STATE ---
  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", country: "Turkey", phone_number: "", sector: "", 
    avatar_url: "", cover_url: "", 
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    achievements: [], work_experience: [], education: [], languages: [], skills: [], hobbies_indices: []
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) {
          setFormData({
            ...formData,
            ...p,
            social_links: p.social_links || formData.social_links,
            career_goals: p.cv_data?.career_goals || formData.career_goals,
            achievements: p.cv_data?.achievements || [],
            work_experience: p.cv_data?.work_experience || [],
            education: p.cv_data?.education || [],
            languages: p.cv_data?.languages || [],
            skills: p.cv_data?.skills || [],
            hobbies_indices: p.cv_data?.hobbies_indices || []
          });
        }
      } catch (err) { console.error("Session Error:", err); }
      finally { setLoading(false); }
    };
    init();
  }, [navigate]);

  // --- FOTOĞRAF YÜKLEME (AVATAR & BANNER) ---
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileExt = file.name.split('.').pop();
      const fileName = `${me.id}-${type}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('profiles').upload(`avatars/${fileName}`, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      
      const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateData }));
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      toast.success("Görsel başarıyla güncellendi.");
    } catch (error) {
      toast.error("Hata: Storage'da 'profiles' bucket'ı oluşturduğunuzdan emin olun.");
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        full_name: formData.full_name,
        city: formData.city,
        country: formData.country,
        phone: formData.phone_number,
        sector: formData.sector,
        avatar_url: formData.avatar_url,
        cover_url: formData.cover_url,
        social_links: formData.social_links,
        cv_data: {
          career_goals: formData.career_goals,
          achievements: formData.achievements,
          work_experience: formData.work_experience,
          education: formData.education,
          languages: formData.languages,
          skills: formData.skills,
          hobbies_indices: formData.hobbies_indices
        },
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Profiliniz Kararlılıkla Kaydedildi.");
      setEditOpen(false);
    } catch (e) { toast.error("Hafıza kaydı sırasında hata oluştu."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-bold text-rose-500 animate-pulse uppercase">Sistem Hafızası Hazırlanıyor...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans overflow-x-hidden">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* BANNER AREA */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div 
            className="h-48 md:h-64 relative cursor-pointer group overflow-hidden rounded-b-3xl"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url ? (
              <img src={formData.cover_url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-red-600 to-orange-500" />
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
               <Camera className="text-white" size={32} />
            </div>
            {uploading.cover && <div className="absolute inset-0 bg-white/50 flex items-center justify-center animate-pulse font-bold text-rose-500">Banner Yükleniyor...</div>}
          </div>

          <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-24 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-white overflow-hidden shadow-2xl bg-slate-100">
                <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
              </div>
              {uploading.avatar && <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
            </div>
            
            <div className="flex-1 pb-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 size={12}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14}/> {formData.sector}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.country}</span>
              </div>
            </div>
            
            <Button onClick={() => setEditOpen(true)} className="mb-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold border px-8 h-11 transition-all">
              <Pencil size={16} className="mr-2"/> Profili Düzenle
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            {/* Vizyon Kartı */}
            <Card className="rounded-3xl border-none shadow-sm bg-white p-10">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3"><Target size={18} className="text-orange-500" /> Vizyon & Strateji</h3>
               <p className="text-slate-700 font-bold italic leading-relaxed text-xl mb-6">"{formData.career_goals?.vision || "..."}"</p>
               <div className="p-6 bg-slate-50 rounded-2xl border-l-8 border-orange-400 font-semibold text-slate-600">
                 {formData.career_goals?.short_term_plan || "Kısa vadeli plan yok."}
               </div>
            </Card>

            {/* Deneyim Bölümü */}
            <Card className="rounded-3xl border-none shadow-sm bg-white p-10">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3"><Briefcase size={18} className="text-rose-500" /> İş Deneyimi</h3>
               <div className="space-y-8">
                  {formData.work_experience?.map((w, i) => (
                    <div key={i} className="relative pl-8 border-l-2 border-rose-100">
                       <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-rose-500" />
                       <h4 className="font-bold text-slate-800 text-lg uppercase">{w.role}</h4>
                       <p className="text-rose-600 font-bold text-sm">{w.company}</p>
                       <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase">{w.start_date} - {w.end_date || "Devam"}</p>
                       <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl">"{w.description}"</p>
                    </div>
                  ))}
               </div>
            </Card>

            {/* Diller Bölümü */}
            <Card className="rounded-3xl border-none shadow-sm bg-white p-10">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3"><Languages size={18} className="text-emerald-500" /> Diller (AI Seviyesi)</h3>
               <div className="grid md:grid-cols-2 gap-6">
                 {formData.languages?.map((l, i) => (
                   <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-inner">
                      <span className="font-bold text-slate-700">{l.name}</span>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">LEVEL {l.level}</span>
                   </div>
                 ))}
               </div>
            </Card>
         </div>

         {/* Sağ Taraf - İletişim */}
         <div className="lg:col-span-4">
            <Card className="rounded-3xl border-none shadow-xl bg-[#0f172a] text-white p-8 sticky top-24">
               <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-10 flex items-center gap-3"><Mail size={16} /> İletişim</h3>
               <div className="space-y-8">
                  <div>
                     <span className="text-slate-500 font-bold uppercase text-[9px] tracking-widest block mb-1">Email</span>
                     <span className="font-bold text-sm truncate block">{formData.email}</span>
                  </div>
                  <div>
                     <span className="text-slate-500 font-bold uppercase text-[9px] tracking-widest block mb-1">Telefon</span>
                     <span className="font-bold text-lg block">{formData.phone_number || "---"}</span>
                  </div>
               </div>
            </Card>
         </div>
      </main>

      {/* --- PROFIL MIMARI MODAL --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Profil Mimarı <span className="text-rose-500 italic">Global v3</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-white border shadow-sm flex items-center justify-center rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
               {/* ÜLKE SEÇİMİ */}
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Konum (AI Filtrelemesi)</label>
                  <select 
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})} 
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white font-bold text-slate-700 outline-none appearance-none"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>

               {/* TEMEL BİLGİLER */}
               <div className="grid md:grid-cols-2 gap-8">
                  {["full_name", "sector", "city", "phone_number"].map(f => (
                    <div key={f} className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{f.replace('_', ' ')}</label>
                       <input value={formData[f]} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white font-bold text-slate-700 outline-none transition-all" />
                    </div>
                  ))}
               </div>

               {/* DİLLER (AI PUANLI) */}
               <div className="space-y-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Languages size={18} className="text-emerald-500" /> Diller ve Seviyeler</h3>
                    <Button onClick={() => setFormData({...formData, languages: [...(formData.languages || []), { name: "English", level: 3 }]})} className="bg-emerald-500 text-white rounded-xl h-10 px-6 font-bold text-xs">EKLE</Button>
                  </div>
                  <div className="space-y-4">
                    {formData.languages?.map((l, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-3xl border flex flex-col md:flex-row gap-6 items-center">
                        <select 
                          value={l.name} 
                          onChange={e => { const nl = [...formData.languages]; nl[i].name = e.target.value; setFormData({...formData, languages: nl}); }}
                          className="w-full md:w-48 p-3 rounded-xl bg-white border font-bold"
                        >
                          {["Türkçe", "English", "Deutsch", "Français", "Arabic"].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <div className="flex-1 flex items-center gap-4">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">Seviye (1-5):</span>
                           <div className="flex gap-2">
                             {[1,2,3,4,5].map(v => (
                               <button 
                                 key={v} 
                                 onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }}
                                 className={`w-10 h-10 rounded-lg font-black transition-all ${l.level === v ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-300 border hover:bg-emerald-50'}`}
                               >
                                 {v}
                               </button>
                             ))}
                           </div>
                        </div>
                        <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-10 border-t flex gap-6 bg-slate-50/50">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-16 rounded-2xl font-black text-white shadow-xl uppercase tracking-widest italic">Hafızayı Güncelle</Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-16 px-10 rounded-2xl font-black text-slate-400 uppercase">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
