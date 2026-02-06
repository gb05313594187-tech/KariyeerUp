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

// --- GLOBAL LOKASYON & TELEFON (GENİŞLETİLMİŞ VE TAM LİSTE) ---
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" }
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"]
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
      // KRİTİK: Veritabanına anında mühürle ki cache silinince banner uçmasın!
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      
      toast.success(`${type === 'avatar' ? 'Profil' : 'Kapak'} fotoğrafı mühürlendi.`);
    } catch (error) {
      toast.error("Yükleme hatası: Storage veya veritabanı mühürlenemedi.");
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
        cv_data: { ...formData }, // Tüm kariyer verisini paketle
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Tüm veriler AI havuzuna mühürlendi!");
      setEditOpen(false);
    } catch (e) {
      toast.error("Kayıt mühürlenemedi. Lütfen tekrar deneyin.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse uppercase tracking-[0.5em] text-xl">System Syncing...</div>;

  return (
    <div className="bg-[#FBFCFE] min-h-screen pb-24 font-sans text-left">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER AREA */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="h-44 md:h-60 bg-slate-200 relative group overflow-hidden rounded-b-[45px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase italic tracking-widest transition-all">Kapak Fotoğrafını Mühürle</div>
          </div>
          <div className="px-12 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-[55px] border-[10px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-4 text-slate-800">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-5 mt-2 text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-2"><CheckCircle2 size={14}/> Onaylı Profil</span>
                <span className="flex items-center gap-2"><MapPin size={14}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-2 bg-slate-900 text-white font-black px-12 h-16 rounded-[28px] shadow-2xl hover:bg-rose-600 transition-all uppercase italic tracking-widest text-xs">Düzenle</Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-16 grid lg:grid-cols-12 gap-12 text-slate-700">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4"><Briefcase size={20} className="text-rose-500" /> Profesyonel Geçmiş</h3>
            {formData.work_experience.map((w, i) => (
              <Card key={i} className="p-10 rounded-[45px] border-none shadow-sm bg-white mb-6">
                <h4 className="text-xl font-black uppercase italic tracking-tight">{w.role}</h4>
                <p className="text-rose-600 font-black text-sm uppercase mt-1 mb-6">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                <p className="text-slate-500 italic text-sm leading-relaxed border-l-4 border-slate-50 pl-6">"{w.desc}"</p>
              </Card>
            ))}
          </section>

          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4"><GraduationCap size={22} className="text-orange-500" /> Akademik Kariyer</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {formData.education.map((e, i) => (
                <Card key={i} className="p-8 rounded-[35px] border-none shadow-sm bg-white">
                  <span className="text-[9px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg uppercase tracking-widest">{e.level}</span>
                  <h4 className="text-lg font-black uppercase text-slate-800 mt-4 tracking-tighter">{e.field}</h4>
                  <p className="text-slate-400 font-bold text-xs uppercase">{e.school}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-16">
          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4"><Languages size={20} className="text-indigo-500" /> Dil Yetkinliği</h3>
            <div className="space-y-5">
              {formData.languages.map((l, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                  <span className="font-black uppercase text-[11px] text-slate-700 tracking-widest">{l.lang}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-100"} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- ULTRA MODAL: v24 GLOBAL --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[88vh] overflow-y-auto rounded-[65px] shadow-2xl relative custom-scrollbar border border-white/20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-12 border-b z-50 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">Kariyer Mimarı <span className="text-rose-500">v24 ULTRA</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center hover:rotate-90 transition-all shadow-inner"><X /></button>
            </div>
            
            <div className="p-12 space-y-16 text-left">
              {/* Bölüm 1: Kimlik & Lokasyon & Telefon (DROPDOWN GENİŞLİKLERİ DÜZELTİLDİ) */}
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Tam Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-6 rounded-3xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-4 ring-rose-500/10" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Global Lokasyon</label>
                  <div className="flex gap-3">
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="min-w-[140px] flex-1 p-6 rounded-3xl bg-slate-50 border-none font-bold text-slate-800 outline-none">
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="min-w-[140px] flex-1 p-6 rounded-3xl bg-slate-50 border-none font-bold text-slate-800 outline-none">
                      <option value="">Şehir...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Uluslararası Telefon</label>
                  <div className="flex gap-3">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="min-w-[180px] p-6 rounded-3xl bg-slate-50 border-none font-bold text-slate-800 outline-none text-xs">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                    </select>
                    <input placeholder="5XX..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-6 rounded-3xl bg-slate-50 border-none font-bold text-slate-800 outline-none" />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Diller (GERİ GETİRİLDİ) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-5">
                  <h3 className="font-black uppercase text-xs tracking-[0.3em] text-slate-400 italic">Dil Yetkinlikleri</h3>
                  <Button size="sm" onClick={() => setFormData({...formData, languages: [...formData.languages, { lang: "English", level: 3 }]})} className="bg-indigo-500 text-white rounded-2xl font-black text-[10px] px-8">DİL EKLE</Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[35px] flex items-center justify-between border border-white">
                      <input placeholder="Dil Adı" value={l.lang} onChange={e => { const nl = [...formData.languages]; nl[i].lang = e.target.value; setFormData({...formData, languages: nl}); }} className="bg-transparent font-black uppercase text-xs outline-none w-1/3 text-slate-800" />
                      <div className="flex gap-1.5">
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }} className={`w-8 h-8 rounded-xl font-black text-[10px] transition-all shadow-sm ${l.level === v ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300 hover:text-indigo-400'}`}>{v}</button>
                        ))}
                      </div>
                      <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="text-red-400 hover:text-red-600 ml-4"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bölüm 3: Eğitim & Sertifika & Hobiler... */}
              <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                   <div className="flex justify-between items-center"><h3 className="font-black uppercase text-xs text-slate-400 tracking-widest italic">Akademik</h3><Button size="sm" onClick={() => setFormData({...formData, education: [...formData.education, { level: "Lisans", school: "", field: "" }]})} className="bg-orange-500 text-white rounded-xl font-black text-[9px] px-6">EKLE</Button></div>
                   {formData.education.map((e, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-3xl space-y-3 relative group">
                        <select value={e.level} onChange={e => { const ne = [...formData.education]; ne[i].level = e.target.value; setFormData({...formData, education: ne}); }} className="w-full bg-white p-4 rounded-xl font-bold text-xs">
                          <option value="Lise">Lise</option><option value="Ön Lisans">Ön Lisans</option><option value="Lisans">Lisans</option><option value="Yüksek Lisans">Yüksek Lisans</option>
                        </select>
                        <input placeholder="Okul / Üniversite" value={e.school} onChange={e => { const ne = [...formData.education]; ne[i].school = e.target.value; setFormData({...formData, education: ne}); }} className="w-full p-4 bg-white rounded-xl font-bold text-xs" />
                        <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
                      </div>
                   ))}
                 </div>
                 <div className="space-y-6">
                   <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest italic">İlgi Alanları (Enter)</h3>
                   <div className="p-6 bg-slate-50 rounded-[35px] flex flex-wrap gap-3 border border-white">
                      {formData.interests.map((it, idx) => <span key={idx} className="bg-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-sm flex items-center gap-2 text-slate-600">{it} <X size={12} className="cursor-pointer text-red-400" onClick={() => setFormData({...formData, interests: formData.interests.filter(x => x !== it)})} /></span>)}
                      <input placeholder="+ Yeni Ekle" onKeyDown={e => { if(e.key === 'Enter' && e.target.value) { setFormData({...formData, interests: [...formData.interests, e.target.value]}); e.target.value = ""; } }} className="bg-transparent text-[11px] font-bold outline-none flex-1 p-2" />
                   </div>
                 </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-12 bg-white/95 backdrop-blur-md border-t flex gap-8">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-24 rounded-[35px] text-2xl font-black uppercase italic text-white shadow-2xl transition-all active:scale-95 shadow-rose-200 tracking-[0.2em]">
                HAFIZAYI MÜHÜRLE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
