// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  X, Briefcase, GraduationCap, Cpu, Languages, Target, 
  Camera, Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2 
} from "lucide-react";

// --- GLOBAL AI DATA ---
const PHONE_CODES = [
  { code: "+90", country: "Turkey" }, { code: "+216", country: "Tunisia" },
  { code: "+44", country: "UK" }, { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" }, { code: "+33", country: "France" }
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
  const langCtx = useLanguage();
  
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
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) setFormData(prev => ({ ...prev, ...p, ...(p.cv_data || {}) }));
      } finally { setLoading(false); }
    };
    init();
  }, [navigate]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const fileName = `${me.id}/${type}-${Date.now()}`;
      const { error } = await supabase.storage.from('profiles').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      const update = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      setFormData(prev => ({ ...prev, ...update }));
      await supabase.from("profiles").update(update).eq("id", me.id);
      toast.success("Fotoğraf mühürlendi.");
    } catch (err) { toast.error("Storage Hatası: profiles bucket'ı Public mi?"); }
    finally { setUploading(prev => ({ ...prev, [type]: false })); }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id, full_name: formData.full_name, country: formData.country, city: formData.city,
        avatar_url: formData.avatar_url, cover_url: formData.cover_url,
        cv_data: { ...formData }, updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Tüm Kariyer Verileri Mühürlendi!");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt mühürlenemedi."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse">AI SYNC...</div>;

  return (
    <div className="bg-[#FBFCFE] min-h-screen pb-24 font-sans text-left">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />

      {/* HEADER */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-[40px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url && <img src={formData.cover_url} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera className="text-white" /></div>
          </div>
          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[50px] border-[10px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-4 text-slate-800">
              <h1 className="text-4xl font-black uppercase tracking-tighter">{formData.full_name || "İSİM SOYİSİM"}</h1>
              <div className="flex gap-4 mt-2 font-bold text-[11px] text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-rose-600"><CheckCircle2 size={14}/> ONAYLI</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.city}, {formData.country}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="bg-slate-900 text-white font-black px-12 h-16 rounded-[25px] shadow-2xl hover:bg-rose-600 transition-all uppercase mb-2 italic">Düzenle</Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-12 text-slate-700">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Briefcase size={20} className="text-rose-500" /> İş Deneyimi</h3>
            {formData.work_experience.map((w, i) => (
              <Card key={i} className="p-8 rounded-[40px] border-none shadow-sm bg-white mb-4">
                <h4 className="text-xl font-black uppercase">{w.role}</h4>
                <p className="text-rose-600 font-black text-sm">{w.company} • {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                <p className="mt-4 text-slate-500 italic">"{w.desc}"</p>
              </Card>
            ))}
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><GraduationCap size={22} className="text-orange-500" /> Eğitim</h3>
            {formData.education.map((e, i) => (
              <Card key={i} className="p-8 rounded-[40px] border-none shadow-sm bg-white mb-4">
                <h4 className="text-lg font-black uppercase">{e.field}</h4>
                <p className="text-slate-500 font-bold">{e.school} • GPA: {e.gpa}</p>
              </Card>
            ))}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-16">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Languages size={20} className="text-indigo-500" /> Diller</h3>
            {formData.languages.map((l, i) => (
              <div key={i} className="flex justify-between items-center mb-4">
                <span className="font-black uppercase text-xs">{l.lang}</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />)}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* MODAL: FULL HR SYNC */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[60px] shadow-2xl">
            <div className="sticky top-0 bg-white/80 p-12 border-b z-50 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Kariyer Mimarı <span className="text-rose-500">v21</span></h2>
              <button onClick={() => setEditOpen(false)} className="w-16 h-16 bg-slate-50 rounded-[25px] flex items-center justify-center hover:rotate-90 transition-all"><X /></button>
            </div>
            
            <div className="p-12 space-y-16">
              {/* Bölüm 1: Kimlik ve Telefon */}
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Ülke</label>
                  <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value, city: ""})} className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold">
                    {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Alan Kodu & Telefon</label>
                  <div className="flex gap-2">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="w-1/3 p-5 rounded-2xl bg-slate-50 border-none font-bold">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.code} ({p.country})</option>)}
                    </select>
                    <input placeholder="5XX XXX XX XX" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-5 rounded-2xl bg-slate-50 border-none font-bold" />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: İş Deneyimi (Ekle/Sil) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center"><h3 className="font-black uppercase text-xs">İş Deneyimi</h3><Button size="sm" onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" }]})} className="bg-rose-500 text-white rounded-xl">EKLE</Button></div>
                {formData.work_experience.map((w, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[40px] space-y-4 relative">
                    <div className="grid md:grid-cols-3 gap-4">
                      <input placeholder="Pozisyon" value={w.role} onChange={e => { const nw = [...formData.work_experience]; nw[i].role = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-4 bg-white rounded-xl border-none font-bold" />
                      <input placeholder="Şirket" value={w.company} onChange={e => { const nw = [...formData.work_experience]; nw[i].company = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-4 bg-white rounded-xl border-none font-bold" />
                      <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase">Aktif</span><input type="checkbox" checked={w.isCurrent} onChange={e => { const nw = [...formData.work_experience]; nw[i].isCurrent = e.target.checked; setFormData({...formData, work_experience: nw}); }} className="w-6 h-6 accent-rose-500" /></div>
                    </div>
                    <textarea placeholder="Görev Tanımı" value={w.desc} onChange={e => { const nw = [...formData.work_experience]; nw[i].desc = e.target.value; setFormData({...formData, work_experience: nw}); }} className="w-full p-4 bg-white rounded-xl border-none font-bold min-h-[100px]" />
                    <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-red-400"><Trash2/></button>
                  </div>
                ))}
              </div>

              {/* Bölüm 3: Diller (Puanlamalı) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center"><h3 className="font-black uppercase text-xs">Dil Yetkinliği</h3><Button size="sm" onClick={() => setFormData({...formData, languages: [...formData.languages, { lang: "English", level: 3 }]})} className="bg-indigo-600 text-white rounded-xl">EKLE</Button></div>
                <div className="grid md:grid-cols-3 gap-6">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
                      <input value={l.lang} onChange={e => { const nl = [...formData.languages]; nl[i].lang = e.target.value; setFormData({...formData, languages: nl}); }} className="bg-transparent font-black uppercase text-xs outline-none w-1/2" />
                      <div className="flex gap-1">{[1,2,3,4,5].map(v => <button key={v} onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }} className={`w-6 h-6 rounded-lg text-[10px] font-black ${l.level === v ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>{v}</button>)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-12 bg-white/90 border-t flex gap-8">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-20 rounded-[30px] text-2xl font-black uppercase italic text-white shadow-2xl transition-all">HAVUZU MÜHÜRLE</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
