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

/* =========================================================
   ✅ GLOBAL VERİ SETLERİ (MÜHÜRLÜ)
   ========================================================= */
const PHONE_CODES = [
  { code: "+90", label: "Turkey (+90)", country: "TR" },
  { code: "+216", label: "Tunisia (+216)", country: "TN" },
  { code: "+44", label: "UK (+44)", country: "UK" },
  { code: "+971", label: "UAE (+971)", country: "UAE" },
  { code: "+966", label: "Saudi Arabia (+966)", country: "SA" },
  { code: "+33", label: "France (+33)", country: "FR" },
  { code: "+49", label: "Germany (+49)", country: "DE" }
];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
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
    phone_code: "+90", phone_number: "", avatar_url: "", cover_url: "",
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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}/${type}-${Date.now()}`;
      const { error: upErr } = await supabase.storage.from('profiles').upload(fileName, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...updateData }));
      await supabase.from("profiles").update(updateData).eq("id", me.id);
      toast.success("Fotoğraf mühürlendi.");
    } catch (error) { toast.error("Bağlantı hatası."); } finally { setUploading(prev => ({ ...prev, [type]: false })); }
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
      toast.success("Hafıza mühürlendi!");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt başarısız."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse text-xl uppercase italic">Hafıza Senkronize Ediliyor...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans text-left overflow-x-hidden">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER SECTION (Görsel olarak küçültüldü) */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-3xl cursor-pointer shadow-inner" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url ? <img src={formData.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-rose-600 to-orange-400 opacity-90" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black uppercase tracking-widest text-sm">Banner Değiştir</div>
          </div>
          <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-8 border-white shadow-xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-800 leading-none">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-4 mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={12}/> ONAYLI</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="mb-2 bg-slate-900 text-white font-black px-8 h-12 rounded-xl shadow-lg hover:bg-rose-600 transition-all uppercase italic text-xs tracking-widest active:scale-95">PROFİLİ DÜZENLE</Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* HAKKIMDA */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 relative overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={18} className="text-rose-500" /> Kariyer Vizyonu</h3>
            <p className="text-slate-700 font-bold italic text-lg leading-relaxed">"{formData.about || "Kariyer hedeflerinizi ekleyin..."}"</p>
          </section>

          {/* DENEYİM */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3"><Briefcase size={20} className="text-rose-500" /> İş Deneyimi</h3>
            <div className="space-y-6">
              {formData.work_experience.map((w, i) => (
                <Card key={i} className="p-6 rounded-3xl border-none shadow-sm bg-white border-l-8 border-rose-500/10">
                  <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-800">{w.role}</h4>
                  <p className="text-rose-600 font-black text-[10px] uppercase mt-1">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                  <p className="text-slate-500 italic text-sm mt-3 pl-4 border-l border-slate-100">"{w.desc}"</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3"><Languages size={18} className="text-indigo-500" /> Diller</h3>
            <div className="space-y-4">
              {formData.languages.map((l, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                  <span className="font-black uppercase text-[10px] text-slate-700 tracking-widest">{l.lang}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-100"} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* =========================================================
          ✅ MODAL (Ölçeklendirme Normal Seviyeye Çekildi)
          ========================================================= */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative custom-scrollbar flex flex-col">
            <div className="sticky top-0 bg-white/95 p-8 border-b z-50 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800">Profil Mimarı <span className="text-rose-500">v30</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-rose-50 transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-12 text-left">
              {/* Bölüm 1: Temel Bilgiler (Grid Sıkışıklığı Giderildi) */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm outline-none focus:ring-2 ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Global Lokasyon</label>
                  <div className="flex gap-2">
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="flex-1 p-4 rounded-2xl bg-slate-50 border-none font-bold text-xs outline-none">
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Telefon</label>
                  <div className="flex gap-2">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="w-1/2 p-4 rounded-2xl bg-slate-50 border-none font-bold text-[10px] outline-none">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                    </select>
                    <input placeholder="5XX..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-4 rounded-2xl bg-slate-50 border-none font-bold text-sm" />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: İş Deneyimi (Boyutlar Dengelendi) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2"><h3 className="font-black uppercase text-[10px] text-slate-400 italic">İş Deneyimi</h3><Button size="sm" onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" }]})} className="bg-rose-500 text-white rounded-xl font-bold h-10 px-6 text-[9px]">EKLE</Button></div>
                {formData.work_experience.map((w, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[30px] space-y-4 relative group shadow-inner">
                    <div className="grid md:grid-cols-4 gap-4">
                      <input placeholder="Pozisyon" value={w.role} onChange={e => { const nw = [...formData.work_experience]; nw[i].role = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-3 bg-white rounded-xl border-none font-bold text-xs" />
                      <input placeholder="Şirket" value={w.company} onChange={e => { const nw = [...formData.work_experience]; nw[i].company = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-3 bg-white rounded-xl border-none font-bold text-xs" />
                      <div className="flex items-center gap-2 justify-center"><span className="text-[8px] font-black uppercase text-slate-300">AKTİF</span><input type="checkbox" checked={w.isCurrent} onChange={e => { const nw = [...formData.work_experience]; nw[i].isCurrent = e.target.checked; setFormData({...formData, work_experience: nw}); }} className="w-5 h-5 accent-rose-500" /></div>
                      <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="bg-white text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all w-fit mx-auto"><Trash2 size={16}/></button>
                    </div>
                    <textarea placeholder="Görev tanımı..." value={w.desc} onChange={e => { const nw = [...formData.work_experience]; nw[i].desc = e.target.value; setFormData({...formData, work_experience: nw}); }} className="w-full p-4 bg-white rounded-2xl border-none font-bold text-xs min-h-[100px]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 p-8 bg-white/95 border-t flex gap-4">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-14 rounded-2xl text-xl font-black uppercase italic text-white shadow-xl active:scale-95 transition-all tracking-widest">HAFIZAYI MÜHÜRLE</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
