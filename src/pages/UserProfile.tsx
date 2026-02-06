// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User, Pencil, X, Briefcase, Trash2, Target, MapPin, GraduationCap,
  Languages, Cpu, Heart, CheckCircle2, Star, Linkedin, Github, Instagram,
  Globe2, Camera, Mail, Phone, UploadCloud
} from "lucide-react";

const COUNTRIES = ["Turkey", "United States", "United Kingdom", "Germany", "France", "Netherlands", "UAE", "Saudi Arabia"].sort();
const TECH_SKILLS_POOL = ["Java", "Python", "React", "SQL", "Docker", "Node.js", "Project Management", "Figma", "AWS"];
const LANGUAGES_LIST = ["Türkçe", "English", "Deutsch", "Français", "العربية"];

export default function UserProfile() {
  const navigate = useNavigate();
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

  // ✅ DOSYA YÜKLEME FONKSİYONU (Supabase Storage)
  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${me.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Dosyayı Supabase Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('profiles') // Supabase'de 'profiles' adında bir Bucket oluşturmalısın
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Dosyanın URL'ini al
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);

      // 3. State'i güncelle
      setFormData({ ...formData, avatar_url: publicUrl });
      toast.success("Fotoğraf başarıyla yüklendi.");
    } catch (error) {
      toast.error("Yükleme hatası: Bucket ayarlarını kontrol et.");
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-white italic text-rose-500 animate-pulse">KARIYEER YÜKLENİYOR...</div>;

  return (
    <div className="bg-[#F0F2F5] min-h-screen pb-12 font-sans">
      
      {/* HEADER TASARIMI (GÜNCELLENDİ) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="h-40 bg-gradient-to-r from-red-600 to-orange-500 rounded-b-2xl relative" />
          <div className="px-8 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-12">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-xl bg-slate-100">
              <img src={formData.avatar_url || "https://ui-avatars.com/api/?name=" + formData.full_name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-slate-800">{formData.full_name || "İsim Soyisim"}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2"><MapPin size={14}/> {formData.city}, {formData.country}</p>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold shadow-none border border-slate-200"><Pencil size={14} className="mr-2"/> Profili Düzenle</Button>
          </div>
        </div>
      </div>

      {/* MODAL (DOSYA YÜKLEME ÖZELLİKLİ) */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Profil Mimarı</h2>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              {/* ✅ YENİ FOTOĞRAF YÜKLEME ALANI */}
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                   <img src={formData.avatar_url || "https://ui-avatars.com/api/?name="+formData.full_name} className="w-full h-full object-cover" />
                </div>
                <label className="cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm text-slate-600">
                  <UploadCloud size={18} className="text-rose-500" />
                  {uploading ? "Yükleniyor..." : "Bilgisayardan Fotoğraf Seç"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tam Adın</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sektör</label>
                  <input value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Ülke</label>
                <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold outline-none">
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex gap-4">
              <Button onClick={handleSave} className="flex-1 bg-red-600 hover:bg-red-700 h-12 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95">DEĞİŞİKLİKLERİ KAYDET</Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-12 px-6 rounded-xl font-bold text-slate-400">İPTAL</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
