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

// --- GLOBAL AI DATA REPOSITORY ---
const PHONE_CODES = [
  { code: "+90", country: "TR", label: "+90 (Turkey)" },
  { code: "+216", country: "TN", label: "+216 (Tunisia)" },
  { code: "+44", country: "UK", label: "+44 (UK)" },
  { code: "+971", country: "UAE", label: "+971 (UAE)" },
  { code: "+966", country: "SA", label: "+966 (Saudi Arabia)" },
  { code: "+33", country: "FR", label: "+33 (France)" },
  { code: "+49", country: "DE", label: "+49 (Germany)" }
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Bizerte"],
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

  // --- FULL HR DATA MODEL ---
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
        const { data: p, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) setFormData(prev => ({ 
          ...prev, 
          ...p, 
          ...(p.cv_data || {}) // Veritabanındaki tüm kariyer verisini yükle
        }));
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
      const fileName = `${me.id}/${type}-${Date.now()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      
      // KRİTİK: Fotoğrafı veritabanına mühürle
      const updateField = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateField }));
      
      const { error: updateError } = await supabase.from("profiles").update(updateField).eq("id", me.id);
      if (updateError) throw updateError;

      toast.success("Fotoğraf kalıcı olarak kaydedildi.");
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
        cv_data: {
          about: formData.about,
          phone_code: formData.phone_code,
          phone_number: formData.phone_number,
          work_experience: formData.work_experience,
          education: formData.education,
          skills: formData.skills,
          certificates: formData.certificates,
          languages: formData.languages,
          interests: formData.interests
        },
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Tüm veriler veritabanına mühürlendi!");
      setEditOpen(false);
    } catch (e) {
      toast.error("Kayıt mühürlenemedi. Lütfen veritabanı bağlantınızı kontrol edin.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse">SİSTEM HAFIZASI YÜKLENİYOR...</div>;

  return (
    <div className="bg-[#FBFCFE] min-h-screen pb-24 font-sans text-left">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER SECTION */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-[40px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold">KAPAK FOTOĞRAFI DEĞİŞTİR</div>
          </div>
          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[50px] border-[10px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-4">
              <h1 className="text-4xl font-black uppercase text-slate-800 tracking-tighter">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-4 mt-2 font-bold text-[11px] text-slate-400 uppercase tracking-widest">
                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 size={14}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="bg-slate-900 text-white font-black px-12 h-16 rounded-[25px] shadow-2xl uppercase italic mb-2">DÜZENLE</Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          {/* İŞ DENEYİMİ */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Briefcase size={20} className="text-rose-500" /> İş Deneyimi</h3>
            {formData.work_experience.length > 0 ? formData.work_experience.map((w, i) => (
              <Card key={i} className="p-8 rounded-[40px] border-none shadow-sm bg-white mb-4">
                <h4 className="text-xl font-black uppercase">{w.role}</h4>
                <p className="text-rose-600 font-black text-sm mb-4">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                <p className="text-slate-500 italic">"{w.desc}"</p>
              </Card>
            )) : <p className="text-slate-400 italic">Henüz deneyim eklenmedi.</p>}
          </section>

          {/* EĞİTİM */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><GraduationCap size={22} className="text-orange-500" /> Eğitim Bilgileri</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {formData.education.map((e, i) => (
                <Card key={i} className="p-8 rounded-[35px] border-none shadow-sm bg-white">
                  <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg uppercase">{e.level}</span>
                  <h4 className="text-lg font-black text-slate-800 uppercase mt-4">{e.field}</h4>
                  <p className="text-slate-500 font-bold">{e.school}</p>
                  <p className="text-[10px] font-black text-slate-400 mt-2">GPA: {e.gpa}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* SAĞ KOLON: DİLLER VE YETENEKLER */}
        <div className="lg:col-span-4 space-y-16">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Languages size={20} className="text-indigo-500" /> Dil Yetkinliği</h3>
            {formData.languages.map((l, i) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-slate-700 uppercase text-xs">{l.lang}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />)}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* --- DEV MODAL: FULL HR ENGINE --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[60px] shadow-2xl relative custom-scrollbar">
            <div className="sticky top-0 bg-white/90 p-12 border-b z-50 flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Profil Mimarı <span className="text-rose-500">v22</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-16 h-16 bg-slate-50 rounded-[25px] flex items-center justify-center hover:rotate-90 transition-all"><X /></button>
            </div>
            
            <div className="p-12 space-y-16 text-left">
              {/* Bölüm 1: Temel Bilgiler */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none focus:ring-4 ring-rose-500/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ülke & Şehir</label>
                  <div className="flex gap-2">
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="w-1/2 p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none">
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-1/2 p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none">
                      <option value="">Seçiniz...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alan Kodu & Telefon</label>
                  <div className="flex gap-2">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="w-2/3 p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none text-[12px]">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                    </select>
                    <input placeholder="5XX..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none" />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Eğitim (Ekle/Sil) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-black uppercase tracking-widest text-slate-800 text-sm">Eğitim Bilgileri</h3>
                  <Button size="sm" onClick={() => setFormData({...formData, education: [...formData.education, { level: "Lisans", school: "", field: "", start: "", end: "", gpa: "" }]})} className="bg-orange-500 text-white rounded-2xl font-black text-[10px] px-6">OKUL EKLE</Button>
                </div>
                {formData.education.map((e, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[45px] space-y-6 relative group">
                    <div className="grid md:grid-cols-3 gap-6">
                      <select value={e.level} onChange={e => { const ne = [...formData.education]; ne[i].level = e.target.value; setFormData({...formData, education: ne}); }} className="p-5 bg-white rounded-2xl border-none font-bold">
                        <option value="Lise">Lise</option><option value="Lisans">Lisans</option><option value="Yüksek Lisans">Yüksek Lisans</option>
                      </select>
                      <input placeholder="Okul Adı" value={e.school} onChange={e => { const ne = [...formData.education]; ne[i].school = e.target.value; setFormData({...formData, education: ne}); }} className="p-5 bg-white rounded-2xl border-none font-bold" />
                      <input placeholder="Bölüm" value={e.field} onChange={e => { const ne = [...formData.education]; ne[i].field = e.target.value; setFormData({...formData, education: ne}); }} className="p-5 bg-white rounded-2xl border-none font-bold" />
                    </div>
                    <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute top-6 right-8 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={24}/></button>
                  </div>
                ))}
              </div>
              
              {/* Diğer diller, sertifikalar vb. buraya v21'deki gibi eklenebilir */}
            </div>

            <div className="sticky bottom-0 p-12 bg-white/90 border-t flex gap-8">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-24 rounded-[35px] text-3xl font-black uppercase italic text-white shadow-2xl transition-all active:scale-95">
                HAFIZAYI MÜHÜRLERLE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
