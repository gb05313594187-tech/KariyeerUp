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
  Globe2, Camera, Mail, Phone, UploadCloud, History
} from "lucide-react";

const COUNTRIES = ["Turkey", "United States", "United Kingdom", "Germany", "France", "Netherlands", "UAE", "Saudi Arabia"].sort();
const LANGUAGES_LIST = ["Türkçe", "English", "Deutsch", "Français", "العربية"];

export default function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Dosya seçici için referans
  const langCtx = useLanguage?.();
  const lang = useMemo(() => (langCtx?.lang?.startsWith("TR") ? "TR" : "EN"), [langCtx?.lang]);
  const t = {
    TR: { verified: "ONAYLI PROFİL", edit_btn: "Profili Düzenle", save_btn: "DEĞİŞİKLİKLERİ KAYDET", present: "Devam Ediyor", levels: ["Az", "Orta", "İyi", "Çok İyi", "Anadil"] },
    EN: { verified: "VERIFIED PROFILE", edit_btn: "Edit Profile", save_btn: "SAVE CHANGES", present: "Present", levels: ["Basic", "Intermediate", "Good", "Fluent", "Native"] }
  }[lang];
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", country: "Turkey", phone_number: "", sector: "", avatar_url: "",
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    achievements: [], work_experience: [], education: [], languages: [], skills: [], hobbies_indices: [],
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }
      setMe(session.user);
      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (p) setFormData({ ...formData, ...p, cv_data: p.cv_data || {} });
    } finally { setLoading(false); }
  };

  // ✅ DOSYA YÜKLEME (Link sormaz, direkt çalışır)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${me.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles') // ⚠️ Supabase'de 'profiles' bucket'ı açtığından emin ol!
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Veritabanını da hemen güncelle
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", me.id);
      
      toast.success("Fotoğraf başarıyla güncellendi.");
    } catch (error) {
      toast.error("Yükleme hatası. Storage ayarlarını kontrol edin.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profil Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { toast.error("Hata oluştu"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-bold text-rose-500 animate-pulse">KARIYEER YÜKLENİYOR...</div>;

  return (
    <div className="bg-[#F0F2F5] min-h-screen pb-12 font-sans">
      
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="h-32 md:h-40 bg-gradient-to-r from-red-600 to-orange-500 rounded-b-2xl relative" />
          <div className="px-8 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-20">
            {/* Profil Fotoğrafı (Tıkla ve Seç) */}
            <div 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-xl bg-slate-100 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                <Camera size={24} />
                <span className="text-[10px] font-bold mt-1 uppercase">Değiştir</span>
              </div>
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
            </div>
            
            <div className="flex-1 pb-2 text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={10}/> {t.verified}</span>
                <span className="flex items-center gap-1"><Briefcase size={12}/> {formData.sector}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {formData.country}</span>
              </div>
            </div>
            
            <Button onClick={() => setEditOpen(true)} className="mb-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold border border-slate-200 h-10 px-6 shadow-none">
              <Pencil size={14} className="mr-2"/> {t.edit_btn}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            {/* Vizyon Kartı */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Target size={16} className="text-orange-500" /> Vizyon & Strateji</h3>
               <p className="text-slate-700 font-bold italic leading-relaxed text-lg">"{formData.career_goals.vision || "..."}"</p>
               <div className="mt-6 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500 text-sm font-medium text-slate-600">{formData.career_goals.short_term_plan || "Kısa vadeli plan yok."}</div>
            </section>

            {/* Deneyimler */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2"><Briefcase size={16} className="text-rose-500" /> İş Deneyimi</h3>
               <div className="space-y-8">
                  {formData.work_experience.map((w, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-1 h-12 bg-rose-100 rounded-full shrink-0" />
                       <div>
                          <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{w.role}</h4>
                          <p className="text-rose-600 font-bold text-xs uppercase">{w.company}</p>
                          <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">{w.start_date} - {w.end_date || t.present}</p>
                          <p className="text-sm text-slate-500 italic">"{w.description}"</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-[#0f172a] text-white p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Globe2 size={80} /></div>
               <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-6 flex items-center gap-2"><Mail size={14} /> İletişim</h3>
               <div className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                     <span className="text-slate-500 font-black tracking-widest uppercase text-[9px]">Email</span>
                     <span className="font-bold truncate tracking-tighter">{formData.email}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-slate-500 font-black tracking-widest uppercase text-[9px]">Telefon</span>
                     <span className="font-bold tracking-tighter">{formData.phone_number || "---"}</span>
                  </div>
               </div>
            </Card>
         </div>
      </main>

      {/* MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Profil Mimarı</h2>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
               <div className="grid md:grid-cols-2 gap-6">
                  {["full_name", "sector", "city", "phone_number"].map(f => (
                    <div key={f} className="space-y-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.replace('_', ' ')}</label>
                       <input value={formData[f]} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                  ))}
               </div>
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ülke</label>
                  <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>
            <div className="p-6 border-t flex gap-4 bg-slate-50">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest italic">{t.save_btn}</Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-14 px-8 rounded-2xl font-black text-slate-400 uppercase tracking-widest italic">Vazgeç</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
