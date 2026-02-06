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
  Globe2, Camera, Mail, Phone, UploadCloud, History, Award
} from "lucide-react";

// --- 200+ GLOBAL ÜLKE LİSTESİ ---
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts & Nevis", "Saint Lucia", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const langCtx = useLanguage?.();
  const lang = useMemo(() => (langCtx?.lang?.startsWith("TR") ? "TR" : "EN"), [langCtx?.lang]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", country: "Turkey", phone_number: "", sector: "", avatar_url: "",
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    achievements: [], work_experience: [], education: [], 
    languages: [], // { name, level (1-5) }
    skills: [], hobbies_indices: [],
  });

  // Hata veren getSession yerine daha güvenli kontrol
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
      } catch (err) {
        console.error("User Check Error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    checkUser();
    return () => { mounted = false; };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${me.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('profiles').upload(`avatars/${fileName}`, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", me.id);
      toast.success("Fotoğraf yüklendi.");
    } catch (error) {
      toast.error("Yükleme hatası: Storage ayarlarını kontrol edin.");
    } finally { setUploading(false); }
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-bold text-rose-500 animate-pulse">KARIYEER GLOBAL YÜKLENİYOR...</div>;

  return (
    <div className="bg-[#F0F2F5] min-h-screen pb-12 font-sans overflow-x-hidden">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

      {/* HEADER: FACEBOOK/LINKEDIN STYLE */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="h-40 md:h-52 bg-gradient-to-r from-red-600 to-orange-500 rounded-b-2xl relative shadow-inner" />
          <div className="px-8 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-24">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden shadow-2xl bg-slate-100">
                <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}&background=random`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                  <Camera size={28} />
                  <span className="text-[10px] font-bold mt-1 uppercase">Değiştir</span>
                </div>
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
              </div>
            </div>
            
            <div className="flex-1 pb-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-slate-500 font-semibold text-xs uppercase">
                <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 size={12}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14}/> {formData.sector}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.country}</span>
              </div>
            </div>
            
            <Button onClick={() => setEditOpen(true)} className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold border border-slate-200 px-8 h-11 shadow-none transition-all">
              <Pencil size={16} className="mr-2"/> Profili Düzenle
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
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

            {/* LANGUAGES SECTION with AI LEVELS */}
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

         {/* CONTACT CARD */}
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
                  <div className="flex gap-4 pt-6 border-t border-slate-800">
                    <Linkedin size={20} className="text-slate-400 hover:text-white cursor-pointer transition-all" />
                    <Github size={20} className="text-slate-400 hover:text-white cursor-pointer transition-all" />
                  </div>
               </div>
            </Card>
         </div>
      </main>

      {/* --- GLOBAL AI MODAL --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Profil Mimarı <span className="text-rose-500">v2.0 Global</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-white border shadow-sm flex items-center justify-center rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
               {/* 200 ÜLKE SEÇİMİ */}
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bulunduğun Ülke (AI Filtreleme İçin Şart)</label>
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

               {/* AI DİL SEVİYE DÜZENLEMESİ */}
               <div className="space-y-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Award size={18} className="text-emerald-500" /> Diller ve AI Seviyeleri</h3>
                    <Button onClick={() => setFormData({...formData, languages: [...(formData.languages || []), { name: "English", level: 3 }]})} className="bg-emerald-500 text-white rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest">Ekle</Button>
                  </div>
                  <div className="space-y-4">
                    {formData.languages?.map((l, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-3xl border flex flex-col md:flex-row gap-6 items-center group relative">
                        <select 
                          value={l.name} 
                          onChange={e => { const nl = [...formData.languages]; nl[i].name = e.target.value; setFormData({...formData, languages: nl}); }}
                          className="w-full md:w-48 p-3 rounded-xl bg-white border font-bold"
                        >
                          {["Türkçe", "English", "Deutsch", "Français", "Arabic", "Spanish", "Russian"].map(v => <option key={v} value={v}>{v}</option>)}
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
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-16 rounded-2xl font-black text-white shadow-xl shadow-rose-200 transition-all uppercase tracking-widest italic">Tüm Değişiklikleri Kaydet</Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-16 px-10 rounded-2xl font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-600">Vazgeç</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
