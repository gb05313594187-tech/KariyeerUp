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

// --- GLOBAL AI DATA (KESİNTİSİZ LİSTELER) ---
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
      // VERİTABANINA BETON MÜHÜRLER (OTURUM KAPATSA DA KALIR)
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
      toast.success("Kariyer verileriniz veritabanına mühürlendi!");
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

      {/* HEADER SECTION (ULTRA FERAH) */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="h-64 md:h-80 bg-slate-200 relative group overflow-hidden rounded-b-[70px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase tracking-[0.3em] transition-all italic text-xl">Kapağı Mühürle</div>
          </div>
          <div className="px-20 pb-16 flex flex-col md:flex-row items-end gap-12 -mt-32 relative z-10">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-[80px] border-[15px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-10 text-slate-800">
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-8 mt-6 text-slate-400 font-bold text-sm uppercase tracking-[0.3em]">
                <span className="text-rose-600 bg-rose-50 px-5 py-2 rounded-full flex items-center gap-3 shadow-sm"><CheckCircle2 size={20}/> ONAYLI PRO</span>
                <span className="flex items-center gap-3"><MapPin size={22}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-8 bg-slate-900 text-white font-black px-20 h-24 rounded-[45px] shadow-2xl hover:bg-rose-600 transition-all uppercase italic tracking-[0.2em] text-xl active:scale-95">DÜZENLE</Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-16 py-24 grid lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-24">
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.6em] mb-12 flex items-center gap-6"><Briefcase size={28} className="text-rose-500" /> Profesyonel Deneyim</h3>
            <div className="space-y-12">
              {formData.work_experience.map((w, i) => (
                <Card key={i} className="p-16 rounded-[65px] border-none shadow-sm bg-white border-l-[15px] border-l-rose-500/10">
                  <h4 className="text-3xl font-black uppercase italic tracking-tight text-slate-800">{w.role}</h4>
                  <p className="text-rose-600 font-black text-lg uppercase mt-3 mb-10 tracking-widest">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                  <p className="text-slate-500 italic text-lg leading-relaxed pl-10 border-l-4 border-slate-50">"{w.desc}"</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-24">
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.6em] mb-12 flex items-center gap-6"><Languages size={28} className="text-indigo-500" /> Dil Yetkinliği</h3>
            <div className="space-y-8">
              {formData.languages.map((l, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                  <span className="font-black uppercase text-sm text-slate-700 tracking-widest">{l.lang}</span>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-100"} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- ULTRA MODAL v26 (EKSTRA GENİŞ) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-3xl flex items-center justify-center p-10">
          <div className="bg-white w-full max-w-7xl max-h-[94vh] overflow-y-auto rounded-[100px] shadow-2xl border border-white/30 custom-scrollbar">
            <div className="sticky top-0 bg-white/95 p-20 border-b z-50 flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800">Profil Mimarı <span className="text-rose-500">v26 ULTRA</span></h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3 italic text-left">Hafıza Senkronizasyonu & Beton Mühürleme Aktif</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-24 h-24 bg-slate-50 rounded-[45px] flex items-center justify-center hover:rotate-90 transition-all shadow-inner"><X size={40} /></button>
            </div>
            
            <div className="p-20 space-y-24 text-left">
              <div className="grid lg:grid-cols-3 gap-16">
                <div className="space-y-6">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Tam Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none focus:ring-[15px] ring-rose-500/5 shadow-inner" />
                </div>
                <div className="space-y-6">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Global Lokasyon</label>
                  <div className="flex gap-6">
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="flex-1 p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none shadow-inner cursor-pointer">
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="flex-1 p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none shadow-inner cursor-pointer">
                      <option value="">Şehir...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Telefon Mührü</label>
                  <div className="flex gap-6">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="min-w-[260px] p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-lg outline-none shadow-inner cursor-pointer">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                    </select>
                    <input placeholder="5XX..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-10 rounded-[45px] bg-slate-50 border-none font-bold text-slate-800 text-xl outline-none shadow-inner" />
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex justify-between items-center border-b pb-12">
                  <h3 className="font-black uppercase text-base tracking-[0.5em] text-slate-400 italic">Dil Yetkinlikleri (1-5 Puan)</h3>
                  <Button onClick={() => setFormData({...formData, languages: [...formData.languages, { lang: "English", level: 3 }]})} className="bg-indigo-600 text-white rounded-[35px] font-black text-sm px-16 h-20 shadow-2xl transition-all active:scale-95">YENİ DİL EKLE</Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-12 bg-slate-50 rounded-[60px] flex items-center justify-between border-4 border-transparent hover:border-indigo-500/10 transition-all shadow-sm">
                      <input placeholder="Dil..." value={l.lang} onChange={e => { const nl = [...formData.languages]; nl[i].lang = e.target.value; setFormData({...formData, languages: nl}); }} className="bg-transparent font-black uppercase text-sm outline-none w-1/3 text-slate-800" />
                      <div className="flex gap-3">
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }} className={`w-12 h-12 rounded-[20px] font-black text-xs transition-all shadow-md ${l.level === v ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300'}`}>{v}</button>
                        ))}
                      </div>
                      <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="text-red-400 hover:scale-125 transition-all ml-6"><Trash2 size={32}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-20 bg-white/98 backdrop-blur-md border-t flex gap-12">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-32 rounded-[60px] text-4xl font-black uppercase italic text-white shadow-2xl transition-all active:scale-95 shadow-rose-200 tracking-[0.4em]">
                HAFIZAYI MÜHÜRLE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
