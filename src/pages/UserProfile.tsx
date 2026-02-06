// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  X, Briefcase, GraduationCap, Cpu, Languages, Target, 
  Camera, Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2 
} from "lucide-react";

// --- GLOBAL LOKASYON & TELEFON (TAM LİSTE) ---
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" }
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Germany": ["Berlin", "Munich", "Hamburg"]
};

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // --- FULL HR ENGINE DATA MODEL ---
  const [formData, setFormData] = useState({
    full_name: "", country: "Turkey", city: "", about: "",
    phone_code: "+90", phone_number: "",
    avatar_url: "", cover_url: "",
    work_experience: [], education: [], skills: [], certificates: [], languages: [], interests: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) {
          const cv = p.cv_data || {};
          setFormData({
            full_name: p.full_name || "",
            country: p.country || "Turkey",
            city: p.city || "",
            avatar_url: p.avatar_url || "",
            cover_url: p.cover_url || "",
            phone_code: cv.phone_code || "+90",
            phone_number: cv.phone_number || "",
            about: cv.about || "",
            work_experience: cv.work_experience || [],
            education: cv.education || [],
            skills: cv.skills || [],
            certificates: cv.certificates || [],
            languages: cv.languages || [],
            interests: cv.interests || []
          });
        }
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}/${type}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage.from('profiles').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      
      setFormData(prev => ({ ...prev, ...updateData }));
      // VERİTABANINA BETON MÜHÜR
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      
      toast.success("Görsel veritabanına mühürlendi.");
    } catch (error) {
      toast.error("Yükleme hatası: Storage/Policy kontrol edin.");
    } finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        full_name: formData.full_name,
        country: formData.country,
        city: formData.city,
        avatar_url: formData.avatar_url,
        cover_url: formData.cover_url,
        cv_data: { ...formData }, 
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Hafıza başarıyla mühürlendi!");
      setEditOpen(false);
    } catch (e) {
      toast.error("Kayıt mühürlenemedi.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse uppercase tracking-[0.5em] text-xl">System Syncing...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans text-left overflow-x-hidden">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER SECTION (GENİŞLETİLDİ) */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="h-56 md:h-72 bg-slate-200 relative group overflow-hidden rounded-b-[60px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase tracking-widest transition-all italic">Kapağı Mühürle</div>
          </div>
          <div className="px-16 pb-12 flex flex-col md:flex-row items-end gap-10 -mt-24 relative z-10">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-[65px] border-[12px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-6 text-slate-800">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-6 mt-4 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm"><CheckCircle2 size={16}/> ONAYLI PRO</span>
                <span className="flex items-center gap-2"><MapPin size={18}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-4 bg-slate-900 text-white font-black px-16 h-20 rounded-[35px] shadow-2xl hover:bg-rose-600 transition-all uppercase italic tracking-widest text-lg active:scale-95">DÜZENLE</Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-20">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-5"><Briefcase size={24} className="text-rose-500" /> Profesyonel Deneyim</h3>
            <div className="space-y-10">
              {formData.work_experience.map((w, i) => (
                <Card key={i} className="p-12 rounded-[55px] border-none shadow-sm bg-white border-l-[12px] border-l-rose-500/10">
                  <h4 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">{w.role}</h4>
                  <p className="text-rose-600 font-black text-base uppercase mt-2 mb-8 tracking-wider">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                  <p className="text-slate-500 italic text-base leading-relaxed pl-8 border-l-2 border-slate-100">"{w.desc}"</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-20">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center gap-5"><Languages size={24} className="text-indigo-500" /> Dil Yetkinliği</h3>
            <div className="space-y-6">
              {formData.languages.map((l, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-6 rounded-[30px] shadow-sm border border-slate-50">
                  <span className="font-black uppercase text-xs text-slate-700 tracking-widest">{l.lang}</span>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-100"} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- PRO MODAL v25 (GENİŞ & RAHAT) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/85 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-7xl max-h-[92vh] overflow-y-auto rounded-[80px] shadow-2xl border border-white/20 custom-scrollbar">
            <div className="sticky top-0 bg-white/95 p-16 border-b z-50 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Profil Mimarı <span className="text-rose-500">v25 FINAL</span></h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Hafıza Senkronizasyonu & Beton Mühür</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-20 h-20 bg-slate-50 rounded-[35px] flex items-center justify-center hover:rotate-90 transition-all shadow-inner"><X size={32} /></button>
            </div>
            
            <div className="p-16 space-y-20 text-left">
              {/* BÖLÜM 1: GENİŞ GRID */}
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Tam Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-8 rounded-[35px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none focus:ring-8 ring-rose-500/5" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Global Lokasyon</label>
                  <div className="flex gap-4">
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="flex-1 p-8 rounded-[35px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none">
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="flex-1 p-8 rounded-[35px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none">
                      <option value="">Şehir...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Telefon Mührü</label>
                  <div className="flex gap-4">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="min-w-[220px] p-8 rounded-[35px] bg-slate-50 border-none font-bold text-slate-800 text-base outline-none">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                    </select>
                    <input placeholder="5XX..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-8 rounded-[35px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none" />
                  </div>
                </div>
              </div>

              {/* BÖLÜM 2: DİNAMİK LİSTELER (FERAH TASARIM) */}
              <div className="space-y-10">
                <div className="flex justify-between items-center border-b pb-8">
                  <h3 className="font-black uppercase text-sm tracking-[0.4em] text-slate-400 italic">Dil Yetkinlikleri (1-5 Puan)</h3>
                  <Button onClick={() => setFormData({...formData, languages: [...formData.languages, { lang: "English", level: 3 }]})} className="bg-indigo-600 text-white rounded-[25px] font-black text-xs px-10 h-14 shadow-xl">EKLE</Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-10 bg-slate-50 rounded-[45px] flex items-center justify-between border-2 border-transparent hover:border-indigo-500/20 transition-all">
                      <input placeholder="Dil..." value={l.lang} onChange={e => { const nl = [...formData.languages]; nl[i].lang = e.target.value; setFormData({...formData, languages: nl}); }} className="bg-transparent font-black uppercase text-sm outline-none w-1/3 text-slate-800" />
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }} className={`w-10 h-10 rounded-2xl font-black text-xs transition-all shadow-md ${l.level === v ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300'}`}>{v}</button>
                        ))}
                      </div>
                      <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="text-red-400 hover:scale-125 transition-all ml-4"><Trash2 size={24}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-16 bg-white/95 backdrop-blur-md border-t flex gap-10">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-28 rounded-[45px] text-3xl font-black uppercase italic text-white shadow-2xl transition-all active:scale-95 shadow-rose-200 tracking-[0.3em]">
                HAFIZAYI MÜHÜRLE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
