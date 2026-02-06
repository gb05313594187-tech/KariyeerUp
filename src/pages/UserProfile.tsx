// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, X, CheckCircle2, MapPin, Camera, Target, Video, Mail } from "lucide-react";

// --- FULL GLOBAL LOKASYON HAVUZU (AB + UK + SAUDI + UAE) ---
const LOCATION_DATA = {
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul", "Tataouine", "Béja", "Jendouba", "Mahdia", "Sidi Bouzid", "Siliana", "Kebili", "Zaghouan", "Tozeur", "Manouba"],
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Mersin", "Diyarbakir", "Kayseri", "Eskisehir", "Samsun", "Denizli", "Sanliurfa", "Adapazari", "Malatya", "Kahramanmaras", "Erzurum", "Van"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Taif", "Tabuk", "Buraydah", "Abha", "Khobar"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Sheffield", "Edinburgh", "Bristol"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier"],
  "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga", "Murcia", "Palma"],
  "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen"],
  "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège"],
  "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala"],
  "Poland": ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań"]
};

const COUNTRIES = Object.keys(LOCATION_DATA).sort();

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", country: "Turkey", city: "", sector: "", avatar_url: "", cover_url: "", 
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
      } catch (err) { console.error("Sync Error:", err); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      // UID tabanlı klasör yapısı (Policy ile %100 uyumlu)
      const fileName = `${me.id}/${type}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file);

      if (uploadError) throw new Error("Policy Hatası: Supabase üzerinden klasör erişim iznini (Policy) kontrol edin.");

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      const updateField = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      
      setFormData(prev => ({ ...prev, ...updateField }));
      await supabase.from("profiles").update(updateField).eq("id", me.id);
      toast.success("Fotoğraf hafızaya alındı.");
    } catch (error) {
      toast.error(error.message);
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
      toast.success("Profil ve Lokasyon Hafızası Mühürlendi.");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt mühürlenemedi."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-rose-500 animate-pulse text-lg tracking-widest">KARIYEER GLOBAL YÜKLENİYOR...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans text-left">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER SECTION (SADE TASARIM) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="h-32 md:h-44 bg-gradient-to-r from-red-600 to-orange-500 relative cursor-pointer overflow-hidden rounded-b-xl group" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-black uppercase"><Camera className="mr-2" size={16}/> Kapak Fotoğrafı Seç</div>
          </div>
          <div className="px-6 pb-6 flex flex-col md:flex-row items-end gap-6 -mt-12 relative z-10">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-800">{formData.full_name || "NAME"}</h1>
              <div className="flex gap-3 mt-1 text-slate-500 font-bold text-[10px] uppercase">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={10}/> ONAYLI</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {formData.city || "Şehir"}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-bold border h-10 px-6 shadow-none">PROFİLİ DÜZENLE</Button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Card className="rounded-2xl border-none shadow-sm bg-white p-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={16} className="text-orange-500" /> Kariyer Hedefleri</h3>
          <p className="text-slate-700 font-bold italic text-lg leading-relaxed">"{formData.career_goals?.vision || "Vizyonunuzu ekleyin..."}"</p>
        </Card>
      </main>

      {/* MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 uppercase italic">Profil Mimarı Global</h2>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:rotate-90 transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Ülke</label>
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Şehir (Tüm Liste)</label>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 outline-none">
                      <option value="">Seçiniz...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 ring-rose-500 outline-none" />
               </div>
            </div>
            <div className="p-8 bg-slate-50 border-t flex gap-4">
               <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest italic">Hafızayı Güncelle</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
