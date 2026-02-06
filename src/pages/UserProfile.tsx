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
  Globe2, Camera, Mail, Phone, UploadCloud, Video
} from "lucide-react";

// Tunus Dahil Global Lokasyon Verisi
const LOCATION_DATA = {
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous"],
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Mersin", "Diyarbakir"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Germany": ["Berlin", "Munich", "Hamburg"],
  "UAE": ["Dubai", "Abu Dhabi"],
  "USA": ["New York", "Los Angeles", "Chicago"]
};

const COUNTRIES = Object.keys(LOCATION_DATA).sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const { lang } = useLanguage() || { lang: 'TR' };
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", country: "Tunisia", city: "", sector: "", about: "",
    avatar_url: "", cover_url: "", 
    career_goals: { vision: "", short_term_plan: "" },
    languages: [], skills: [], certifications: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) setFormData({ ...formData, ...p, ...p.cv_data });
      } catch (err) { console.error("Fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles') // ⚠️ Supabase panelinde bu isimde bir PUBLIC bucket açmalısın
        .upload(`avatars/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      
      const updateField = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateField }));
      await supabase.from("profiles").update(updateField).eq("id", me.id);
      
      toast.success("Fotoğraf başarıyla güncellendi.");
    } catch (error) {
      toast.error("Yükleme hatası: Supabase Storage/Bucket ayarlarını kontrol edin.");
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, 
        cv_data: { career_goals: formData.career_goals, languages: formData.languages, skills: formData.skills },
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profil Kararlılıkla Güncellendi.");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt hatası."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-rose-500 animate-pulse">SİSTEM YÜKLENİYOR...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans overflow-x-hidden text-left">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER: COMPACT & CLEAN DESIGN */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          {/* Banner Area (Sadeleştirilmiş Boyut) */}
          <div 
            className="h-32 md:h-44 bg-gradient-to-r from-[#e11d48] to-[#f59e0b] relative cursor-pointer group rounded-b-xl overflow-hidden"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <Camera className="text-white" size={24} />
            </div>
            {uploading.cover && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-rose-600 animate-pulse">Banner Güncelleniyor...</div>}
          </div>

          {/* Profile Details */}
          <div className="px-6 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-12 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[5px] border-white overflow-hidden shadow-xl bg-slate-100 relative">
                <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"><Camera size={24} /></div>
              </div>
              {uploading.avatar && <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 uppercase tracking-tight">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-3 mt-1 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={10}/> VERIFIED</span>
                <span className="flex items-center gap-1"><Briefcase size={12}/> {formData.sector || "Sektör"}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {formData.country}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              <Button onClick={() => setEditOpen(true)} className="bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-bold border border-slate-200 h-10 px-6 shadow-none">EDIT PROFILE</Button>
              <Button onClick={() => window.open(`https://meet.jit.si/Kariyeer-${me?.id.slice(0,8)}`, '_blank')} className="bg-[#6366f1] text-white hover:bg-[#4f46e5] rounded-xl font-bold px-6 h-10 shadow-lg flex items-center gap-2"><Video size={16}/> INTERVIEW ROOM</Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8 text-left">
         <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white p-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Target size={16} className="text-orange-500" /> Vision & Strategy</h3>
               <p className="text-slate-700 font-bold italic leading-relaxed text-lg">"{formData.career_goals?.vision || "..."}"</p>
               <div className="mt-4 p-4 bg-slate-50 rounded-xl border-l-4 border-orange-400 text-xs font-medium text-slate-500">{formData.career_goals?.short_term_plan || "Action plan not set."}</div>
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-white p-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Briefcase size={16} className="text-rose-500" /> Experience</h3>
               <div className="space-y-6">
                  {formData.work_experience?.map((w, i) => (
                    <div key={i} className="border-l-2 border-slate-100 pl-6 relative">
                       <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-rose-500" />
                       <h4 className="font-bold text-slate-800 text-sm uppercase">{w.role}</h4>
                       <p className="text-rose-600 font-bold text-xs">{w.company}</p>
                       <p className="text-sm text-slate-500 mt-2 italic">"{w.description}"</p>
                    </div>
                  ))}
               </div>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-[#0f172a] text-white p-8">
               <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-6 flex items-center gap-2"><Mail size={14} /> Contact Sync</h3>
               <div className="space-y-5 text-xs">
                  <div>
                     <span className="text-slate-500 font-bold uppercase text-[9px] block mb-1">Professional Email</span>
                     <span className="font-bold tracking-tight block truncate">{formData.email}</span>
                  </div>
                  <div>
                     <span className="text-slate-500 font-bold uppercase text-[9px] block mb-1">Phone (Resend Sync)</span>
                     <span className="font-bold tracking-tight block">{formData.phone_number || "---"}</span>
                  </div>
               </div>
            </Card>
         </div>
      </main>

      {/* MODAL: PROFIL MIMARI v6 */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Profile Architect Global</h2>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Country (AI Matching)</label>
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">City (Region)</label>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      <option value="">Select City...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  {["full_name", "sector", "phone_number"].map(f => (
                    <div key={f} className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{f.replace('_', ' ')}</label>
                       <input value={formData[f]} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 ring-rose-500" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex gap-4">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest italic">Save & Sync AI</Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-14 px-8 rounded-2xl font-black text-slate-400 uppercase">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
