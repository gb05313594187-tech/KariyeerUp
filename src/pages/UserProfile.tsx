// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Pencil, X, Briefcase, CheckCircle2, MapPin, Camera, Video, Mail, Target } from "lucide-react";

// --- AI FULL LOKASYON VERİSİ (TUNUS VE TÜRKİYE TÜM ŞEHİRLER) ---
const COUNTRY_DATA = {
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul", "Tataouine", "Béja", "Jendouba", "Mahdia", "Sidi Bouzid", "Siliana", "Kebili", "Zaghouan", "Tozeur", "Manouba"],
  "Turkey": ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop", "Sivas", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  "USA": ["New York", "Los Angeles", "Chicago", "Miami"]
};

const COUNTRIES = Object.keys(COUNTRY_DATA).sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const langCtx = useLanguage();
  
  // ÇÖKMEYİ ENGELLEYEN GÜVENLİ DİL KONTROLÜ
  const lang = useMemo(() => {
    const l = langCtx?.lang || "TR";
    return String(l).toUpperCase().startsWith("AR") ? "AR" : 
           String(l).toUpperCase().startsWith("FR") ? "FR" : 
           String(l).toUpperCase().startsWith("EN") ? "EN" : "TR";
  }, [langCtx?.lang]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", country: "Tunisia", city: "", sector: "", avatar_url: "", cover_url: "", 
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
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('profiles').upload(`avatars/${fileName}`, file);
      
      if (uploadError) throw new Error("Yükleme hatası: Storage Bucket ayarlarını kontrol edin.");

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(`avatars/${fileName}`);
      const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateData }));
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      toast.success("Fotoğraf hafızaya alındı.");
    } catch (error) {
      toast.error(error.message);
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, ...formData, cv_data: { career_goals: formData.career_goals }, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profil ve Lokasyon Kaydedildi.");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt hatası."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-rose-500 animate-spin">O</div>;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen pb-12 font-sans overflow-x-hidden ${lang === 'AR' ? 'text-right' : 'text-left'}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* COMPACT HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="h-32 md:h-44 bg-gradient-to-r from-[#e11d48] to-[#fb923c] relative cursor-pointer overflow-hidden rounded-b-xl" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-all flex items-center justify-center"><Camera className="text-white" /></div>
          </div>
          <div className="px-6 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-12 relative z-10">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 uppercase">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-3 mt-1 text-slate-500 font-bold text-[10px] uppercase">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={10}/> VERIFIED</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-bold border border-slate-200 h-10 px-6 shadow-none">EDIT PROFILE</Button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Card className="rounded-2xl border-none shadow-sm bg-white p-8 mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={16} className="text-orange-500" /> Kariyer Vizyonu</h3>
          <p className="text-slate-700 font-bold italic text-lg leading-relaxed">"{formData.career_goals?.vision || "..."}"</p>
        </Card>
      </main>

      {/* MODAL: FULL OTOMATİK LOKASYON */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 uppercase">Profil Ayarları</h2>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
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
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Şehir (Tüm Liste)</label>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      <option value="">Seçiniz...</option>
                      {COUNTRY_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 ring-rose-500" />
               </div>
            </div>
            <div className="p-8 bg-slate-50 border-t flex gap-4">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest italic">Save & Sync</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
