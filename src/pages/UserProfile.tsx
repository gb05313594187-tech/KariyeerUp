// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User, Pencil, X, Briefcase, CheckCircle2, MapPin, Camera, Video, Mail, Target
} from "lucide-react";

const LOCATION_DATA = {
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa"],
  "France": ["Paris", "Lyon", "Marseille"]
};

const COUNTRIES = Object.keys(LOCATION_DATA).sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  // ✅ ÇÖKMEYİ ENGELLEYEN GÜVENLİ DİL KONTROLÜ
  const langCtx = useLanguage();
  const lang = useMemo(() => {
    try {
      const l = langCtx?.lang || "TR";
      return String(l).toUpperCase().startsWith("AR") ? "AR" : 
             String(l).toUpperCase().startsWith("FR") ? "FR" : 
             String(l).toUpperCase().startsWith("EN") ? "EN" : "TR";
    } catch (e) { return "TR"; }
  }, [langCtx?.lang]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", country: "Tunisia", city: "", sector: "", about: "",
    avatar_url: "", cover_url: "", 
    career_goals: { vision: "", short_term_plan: "" }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) setFormData(prev => ({ ...prev, ...p, ...p.cv_data }));
      } catch (err) { console.error("Data error:", err); }
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
        .from('profiles')
        .upload(`avatars/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      
      const updateField = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateField }));
      await supabase.from("profiles").update(updateField).eq("id", me.id);
      
      toast.success("Görsel güncellendi ve hafızaya alındı.");
    } catch (error) {
      toast.error("Yükleme hatası: Storage ayarlarını kontrol edin.");
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, 
        cv_data: { career_goals: formData.career_goals },
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profil ve Lokasyon Bilgileri Kaydedildi.");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt sırasında bir hata oluştu."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-rose-500 animate-pulse">SİSTEM YÜKLENİYOR...</div>;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen pb-12 font-sans ${lang === 'AR' ? 'text-right' : 'text-left'}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* SADE TASARIM HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <div 
            className="h-32 md:h-44 bg-gradient-to-r from-[#e11d48] to-[#fb923c] relative cursor-pointer group rounded-b-xl overflow-hidden"
            onClick={() => coverInputRef.current?.click()}
          >
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera className="text-white" size={24} /></div>
          </div>

          <div className="px-6 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-12 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[5px] border-white overflow-hidden shadow-xl bg-slate-100 relative">
                <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
              </div>
              {uploading.avatar && <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 uppercase tracking-tight">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-3 mt-1 text-slate-500 font-bold text-[10px] uppercase">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={10}/> VERIFIED</span>
                <span className="flex items-center gap-1"><Briefcase size={12}/> {formData.sector || "SEKTÖR"}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              <Button onClick={() => setEditOpen(true)} className="bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-bold border border-slate-200 h-10 px-6 shadow-none">EDIT PROFILE</Button>
              <Button onClick={() => window.open(`https://meet.jit.si/Kariyeer-${me?.id.slice(0,8)}`, '_blank')} className="bg-[#6366f1] text-white hover:bg-[#4f46e5] rounded-xl font-bold px-6 h-10 shadow-lg flex items-center gap-2 tracking-tighter"><Video size={16}/> INTERVIEW ROOM</Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white p-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Target size={16} className="text-orange-500" /> Kariyer Hedefleri</h3>
               <p className="text-slate-700 font-bold italic leading-relaxed text-lg">"{formData.career_goals?.vision || "..."}"</p>
            </Card>
         </div>

         <div className="lg:col-span-4">
            <Card className="rounded-2xl border-none shadow-sm bg-[#0f172a] text-white p-8">
               <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-6 flex items-center gap-2"><Mail size={14} /> İletişim</h3>
               <div className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                     <span className="text-slate-500 font-bold uppercase text-[9px]">Email</span>
                     <span className="font-bold tracking-tight truncate">{formData.email}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-slate-500 font-bold uppercase text-[9px]">Telefon</span>
                     <span className="font-bold tracking-tight">{formData.phone_number || "---"}</span>
                  </div>
               </div>
            </Card>
         </div>
      </main>

      {/* MODAL: PROFIL AYARLARI */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight tracking-tighter">Profil Mimarı</h2>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Ülke</label>
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Şehir (Otomatik)</label>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      <option value="">Şehir Seçin...</option>
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
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest italic">Save & Sync</Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-14 px-8 rounded-2xl font-black text-slate-400 uppercase">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
