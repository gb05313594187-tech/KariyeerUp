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

const PHONE_CODES = [
  { code: "+90", label: "+90 (Turkey)" },
  { code: "+216", label: "+216 (Tunisia)" },
  { code: "+44", label: "+44 (United Kingdom)" },
  { code: "+971", label: "+971 (United Arab Emirates)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+33", label: "+33 (France)" },
  { code: "+49", label: "+49 (Germany)" }
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
        if (p) setFormData(prev => ({ 
          ...prev, 
          ...p, 
          ...(p.cv_data || {}) 
        }));
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
      // KRİTİK: Veritabanına anında mühürle ki cache silinince gitmesin
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      
      toast.success("Fotoğraf kalıcı olarak mühürlendi.");
    } catch (error) {
      toast.error("Yükleme hatası: Storage ayarlarını kontrol edin.");
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
        cv_data: { ...formData }, // Tüm Kariyer Verisini JSON olarak mühürle
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Tüm veriler veritabanına mühürlendi!");
      setEditOpen(false);
    } catch (e) {
      toast.error("Kayıt mühürlenemedi. Veritabanı izni (Policy) hatası olabilir.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse uppercase tracking-widest text-lg">Hafıza Senkronize Ediliyor...</div>;

  return (
    <div className="bg-[#FBFCFE] min-h-screen pb-24 font-sans text-left">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER SECTION */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="h-40 md:h-56 bg-slate-200 relative group overflow-hidden rounded-b-[40px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase italic">Kapak Fotoğrafı</div>
          </div>
          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[50px] border-[8px] border-white shadow-xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-4 text-slate-800">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{formData.full_name || "NAME"}</h1>
              <div className="flex gap-4 mt-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1.5"><CheckCircle2 size={12}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><MapPin size={12}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-2 bg-slate-900 text-white font-black px-10 h-14 rounded-2xl shadow-xl hover:bg-rose-600 transition-all uppercase italic">Düzenle</Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12 text-slate-700">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><Briefcase size={18} className="text-rose-500" /> İş Deneyimi</h3>
            {formData.work_experience.map((w, i) => (
              <Card key={i} className="p-8 rounded-[40px] border-none shadow-sm bg-white mb-4">
                <h4 className="text-lg font-black uppercase italic">{w.role}</h4>
                <p className="text-rose-600 font-black text-xs uppercase mb-4">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                <p className="text-slate-500 italic text-sm leading-relaxed">"{w.desc}"</p>
              </Card>
            ))}
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><GraduationCap size={20} className="text-orange-500" /> Eğitim Geçmişi</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {formData.education.map((e, i) => (
                <Card key={i} className="p-6 rounded-[30px] border-none shadow-sm bg-white">
                  <span className="text-[8px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase">{e.level}</span>
                  <h4 className="text-md font-black uppercase text-slate-800 mt-3">{e.field}</h4>
                  <p className="text-slate-400 font-bold text-xs">{e.school}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><Languages size={18} className="text-indigo-500" /> Diller</h3>
            <div className="space-y-4">
              {formData.languages.map((l, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                  <span className="font-black uppercase text-[10px] text-slate-600">{l.lang}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-100"} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- DEV MODAL: FULL HR ENGINE --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[85vh] overflow-y-auto rounded-[60px] shadow-2xl relative custom-scrollbar">
            <div className="sticky top-0 bg-white/90 p-10 border-b z-50 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">Kariyer Mimarı <span className="text-rose-500">v23</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-14 h-14 bg-slate-50 rounded-[25px] flex items-center justify-center hover:rotate-90 transition-all shadow-inner"><X /></button>
            </div>
            
            <div className="p-10 space-y-12 text-left">
              {/* Bölüm 1: Kimlik & Lokasyon */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Lokasyon</label>
                  <div className="flex gap-2">
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="w-1/2 p-5 rounded-2xl bg-slate-50 border-none font-bold">
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-1/2 p-5 rounded-2xl bg-slate-50 border-none font-bold">
                      <option value="">Seçiniz...</option>
                      {LOCATION_DATA[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alan Kodu & Telefon</label>
                  <div className="flex gap-2">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="w-2/3 p-5 rounded-2xl bg-slate-50 border-none font-bold text-[11px]">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                    </select>
                    <input placeholder="5XX..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-5 rounded-2xl bg-slate-50 border-none font-bold" />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Eğitim (Ekle/Sil) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 italic">Eğitim Bilgileri</h3>
                  <Button size="sm" onClick={() => setFormData({...formData, education: [...formData.education, { level: "Lisans", school: "", field: "", gpa: "" }]})} className="bg-orange-500 text-white rounded-xl font-black text-[10px]">OKUL EKLE</Button>
                </div>
                {formData.education.map((e, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[40px] space-y-4 relative group">
                    <div className="grid md:grid-cols-4 gap-4 text-slate-800">
                      <select value={e.level} onChange={e => { const ne = [...formData.education]; ne[i].level = e.target.value; setFormData({...formData, education: ne}); }} className="p-4 bg-white rounded-xl border-none font-bold">
                        <option value="Lise">Lise</option><option value="Ön Lisans">Ön Lisans</option><option value="Lisans">Lisans</option><option value="Yüksek Lisans">Yüksek Lisans</option>
                      </select>
                      <input placeholder="Okul" value={e.school} onChange={e => { const ne = [...formData.education]; ne[i].school = e.target.value; setFormData({...formData, education: ne}); }} className="p-4 bg-white rounded-xl border-none font-bold" />
                      <input placeholder="Bölüm" value={e.field} onChange={e => { const ne = [...formData.education]; ne[i].field = e.target.value; setFormData({...formData, education: ne}); }} className="p-4 bg-white rounded-xl border-none font-bold" />
                      <input placeholder="Ortalama" value={e.gpa} onChange={e => { const ne = [...formData.education]; ne[i].gpa = e.target.value; setFormData({...formData, education: ne}); }} className="p-4 bg-white rounded-xl border-none font-bold" />
                    </div>
                    <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-all"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>

              {/* Bölüm 3: Sertifikalar & Hobiler */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <div className="flex justify-between items-center"><h3 className="font-black uppercase text-xs text-slate-400">Sertifikalar</h3><Button size="sm" onClick={() => setFormData({...formData, certificates: [...formData.certificates, { name: "", issuer: "", date: "" }]})} className="bg-indigo-500 text-white rounded-xl font-black text-[9px]">EKLE</Button></div>
                   {formData.certificates.map((c, i) => (
                      <div key={i} className="flex gap-2 bg-slate-50 p-4 rounded-2xl relative group">
                         <input placeholder="Belge Adı" value={c.name} onChange={e => { const nc = [...formData.certificates]; nc[i].name = e.target.value; setFormData({...formData, certificates: nc}); }} className="w-full bg-white p-3 rounded-xl text-xs font-bold" />
                         <button onClick={() => setFormData({...formData, certificates: formData.certificates.filter((_, idx) => idx !== i)})} className="text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                   ))}
                </div>
                <div className="space-y-4">
                   <h3 className="font-black uppercase text-xs text-slate-400">İlgi Alanları (Enter ile)</h3>
                   <div className="p-4 bg-slate-50 rounded-2xl flex flex-wrap gap-2">
                      {formData.interests.map((it, idx) => <span key={idx} className="bg-white px-3 py-1 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1">{it} <X size={10} className="cursor-pointer" onClick={() => setFormData({...formData, interests: formData.interests.filter(x => x !== it)})} /></span>)}
                      <input placeholder="+ Ekle" onKeyDown={e => { if(e.key === 'Enter' && e.target.value) { setFormData({...formData, interests: [...formData.interests, e.target.value]}); e.target.value = ""; } }} className="bg-transparent text-[10px] font-bold outline-none flex-1 p-1" />
                   </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-10 bg-white/90 border-t flex gap-8">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-20 rounded-[30px] text-2xl font-black uppercase italic text-white shadow-2xl transition-all active:scale-95 shadow-rose-200">
                HAVUZU MÜHÜRLE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
