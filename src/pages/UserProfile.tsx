// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext"; // Navbar ile senkronize dil context'i
import { 
  MapPin, CheckCircle2, Briefcase, Pencil, X, Target, 
  Mail, Camera, Plus, Trash2, Award, Cpu, Languages, Sparkles, Rocket, Video, Send
} from "lucide-react";

const LOCATION_DATA = {
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa"],
  "USA": ["New York", "Los Angeles", "Chicago"],
  "France": ["Paris", "Lyon", "Marseille"]
};

const GLOBAL_SKILL_POOL = ["React", "Python", "Java", "SQL", "Docker", "AWS", "SAP", "Figma"];
const COUNTRIES = Object.keys(LOCATION_DATA).sort();

// --- MULTILINGUAL TRANSLATIONS ---
const UI_STRINGS = {
  TR: { 
    verified: "ONAYLI", edit: "PROFİLİ DÜZENLE", boost: "AI BOOST AKTİF ET", 
    sync: "VERİLERİ MÜHÜRLE & SYNC ET", interview: "MÜLAKAT ODASI", 
    email_sent: "Profil güncellendi, Resend e-postası gönderildi.", rtl: false 
  },
  EN: { 
    verified: "VERIFIED", edit: "EDIT PROFILE", boost: "ACTIVATE AI BOOST", 
    sync: "SEAL DATA & SYNC", interview: "INTERVIEW ROOM", 
    email_sent: "Profile updated, Resend notification sent.", rtl: false 
  },
  FR: { 
    verified: "VÉRIFIÉ", edit: "MODIFIER LE PROFIL", boost: "ACTIVER AI BOOST", 
    sync: "SCELLER ET SYNCHRONISER", interview: "SALLE D'ENTRETIEN", 
    email_sent: "Profil mis à jour, e-mail Resend envoyé.", rtl: false 
  },
  AR: { 
    verified: "موثق", edit: "تعديل الملف الشخصي", boost: "تفعيل تعزيز الذكاء الاصطناعي", 
    sync: "ختم البيانات والمزامنة", interview: "غرفة المقابلة", 
    email_sent: "تم تحديث الملف الشخصي، تم إرسال بريد Resend.", rtl: true 
  }
};

export default function UserProfile() {
  const { lang } = useLanguage(); // Navbar'daki seçim burayı otomatik günceller
  const t = UI_STRINGS[lang] || UI_STRINGS.EN;
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [me, setMe] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "", email: "", country: "Tunisia", city: "", sector: "", about: "",
    is_boosted: false, languages: [], skills: [], certifications: []
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setMe(user);
          const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
          if (p) setFormData({ ...formData, ...p, ...p.cv_data });
        }
      } finally { setLoading(false); }
    };
    init();
  }, []);

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, 
        cv_data: { ...formData, ai_sync_date: new Date().toISOString() },
        updated_at: new Date().toISOString()
      });
      
      if (error) throw error;

      // ✅ RESEND ENTEGRASYONU: Edge Function Tetikleme
      await supabase.functions.invoke('resend-email-sync', {
        body: { email: formData.email, name: formData.full_name, type: 'profile_update' }
      });

      toast.success(t.email_sent);
      setEditOpen(false);
    } catch (e) { toast.error("Error syncing profile."); }
  };

  // ✅ JITSI MEET ENTEGRASYONU: Dinamik Oda Oluşturma
  const startInterview = () => {
    const roomName = `Kariyeer-${me.id.substring(0, 8)}`;
    window.open(`https://meet.jit.si/${roomName}`, '_blank');
    toast.info(`${t.interview}: ${roomName}`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse">SYNCING GLOBAL DATA...</div>;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen pb-20 ${t.rtl ? 'text-right' : 'text-left'}`} dir={t.rtl ? 'rtl' : 'ltr'}>
      {/* HEADER AREA */}
      <div className="h-64 bg-gradient-to-r from-red-600 to-orange-500 relative rounded-b-[40px] overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[40px] border border-white/40 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-40 h-40 rounded-[40px] border-[10px] border-white shadow-2xl overflow-hidden bg-slate-100">
            <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-800 uppercase">{formData.full_name || "NAME"}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-rose-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black">{t.verified}</span>
              <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1"><MapPin size={10} /> {formData.city}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setEditOpen(true)} className="bg-white text-slate-900 font-bold px-8 h-12 rounded-2xl shadow-xl">{t.edit}</Button>
            <Button onClick={startInterview} className="bg-indigo-600 text-white font-bold px-8 h-12 rounded-2xl shadow-xl flex items-center gap-2">
              <Video size={18} /> {t.interview}
            </Button>
          </div>
        </div>
      </div>

      {/* --- SYNCED MODAL --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[60px] shadow-2xl relative">
            <div className="p-10 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-800">
                {lang.toUpperCase()} SYSTEM SYNC <span className="text-rose-500">v5.0</span>
              </h2>
              <button onClick={() => setEditOpen(false)} className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90"><X /></button>
            </div>
            
            <div className="p-12 space-y-10">
               {/* FORM CONTENT (SYNCED WITH MULTI-LANG) */}
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email (Resend Target)</label>
                    <input value={formData.email} disabled className="w-full p-4 rounded-2xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed border-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                    <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 ring-rose-500" />
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><Send size={14} className="text-blue-500"/> Integration Control</h3>
                  <div className="p-6 bg-blue-50 rounded-[35px] border border-blue-100 flex items-center justify-between">
                     <span className="text-sm font-bold text-blue-800">Resend & Jitsi API Sync: Active</span>
                     <CheckCircle2 className="text-blue-600" size={24} />
                  </div>
               </div>
            </div>

            <div className="sticky bottom-0 p-10 bg-white/90 backdrop-blur-md border-t flex gap-6">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-20 rounded-[30px] text-2xl font-black uppercase italic text-white shadow-2xl shadow-rose-200 transition-all active:scale-95">
                 {t.sync}
               </Button>
               <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-20 px-12 rounded-[30px] font-black uppercase text-slate-400 border-2 border-slate-100">CANCEL</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
