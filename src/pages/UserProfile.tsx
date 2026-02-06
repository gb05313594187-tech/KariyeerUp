// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  X, Briefcase, GraduationCap, Cpu, Languages, Target, 
  Camera, Plus, Trash2, Award, Heart, Phone, MapPin, Star, CheckCircle2 
} from "lucide-react";

// --- GLOBAL VERİ SETLERİ ---
const PHONE_CODES = [
  { code: "+90", country: "Turkey", mask: "5XX XXX XX XX" },
  { code: "+216", country: "Tunisia", mask: "XX XXX XXX" },
  { code: "+44", country: "UK", mask: "7XXX XXXXXX" },
  { code: "+971", country: "UAE", mask: "5X XXX XXXX" },
  { code: "+966", country: "Saudi Arabia", mask: "5X XXX XXXX" },
  { code: "+49", country: "Germany", mask: "1XX XXXXXXXX" },
  { code: "+33", country: "France", mask: "X XX XX XX XX" }
];

const LANGUAGES_LIST = ["Turkish", "English", "Arabic", "French", "German", "Spanish", "Italian", "Russian", "Chinese"];

const LOCATION_DATA = {
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"]
};

export default function UserProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // --- NİHAİ HR VERİ MODELİ ---
  const [formData, setFormData] = useState({
    full_name: "", country: "Turkey", city: "", about: "",
    phone_code: "+90", phone_number: "",
    avatar_url: "", cover_url: "",
    work_experience: [], // { role, company, start, end, isCurrent, desc }
    education: [],       // { level, school, field, start, end, isCurrent, gpa }
    skills: [],          // Strings (Programlar)
    certificates: [],    // { name, issuer, date }
    languages: [],       // { lang, level (1-5) }
    interests: []        // Strings
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
      toast.success("Kariyer Pasaportu Güncellendi!");
      setEditOpen(false);
    } catch (e) { toast.error("Kayıt mühürlenemedi."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse tracking-tighter">AI ENGINE SYNCING...</div>;

  return (
    <div className="bg-[#FBFCFE] min-h-screen pb-24 font-sans text-left">
      {/* HEADER & COVER */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="h-48 md:h-64 bg-slate-200 relative group overflow-hidden rounded-b-[40px] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
            {formData.cover_url ? <img src={formData.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-rose-500 to-orange-400 opacity-90" />}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera className="text-white" /></div>
          </div>
          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[50px] border-[10px] border-white shadow-2xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-4">
              <h1 className="text-4xl font-black uppercase text-slate-800 tracking-tighter">{formData.full_name || "İsim Soyisim"}</h1>
              <div className="flex flex-wrap gap-4 mt-2 font-bold text-[11px] text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-full"><CheckCircle2 size={14}/> Verified</span>
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {formData.city}, {formData.country}</span>
                <span className="flex items-center gap-1.5"><Phone size={14}/> {formData.phone_code} {formData.phone_number}</span>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="bg-slate-900 text-white font-black px-12 h-16 rounded-[25px] shadow-2xl hover:bg-rose-600 transition-all uppercase italic tracking-wider mb-2">Düzenle</Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-12">
        {/* SOL KOLON: DENEYİM VE EĞİTİM */}
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Briefcase size={20} className="text-rose-500" /> Profesyonel Geçmiş</h3>
            <div className="space-y-8">
              {formData.work_experience.map((w, i) => (
                <div key={i} className="relative pl-10 border-l-4 border-slate-100 pb-2">
                  <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-white border-4 border-rose-500 shadow-sm" />
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{w.role}</h4>
                  <p className="text-rose-600 font-black text-sm mb-3 uppercase">{w.company} <span className="text-slate-300 mx-2">|</span> {w.start} - {w.isCurrent ? "Günümüz" : w.end}</p>
                  <p className="text-slate-500 leading-relaxed font-medium">"{w.desc}"</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><GraduationCap size={22} className="text-orange-500" /> Akademik Kariyer</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {formData.education.map((e, i) => (
                <Card key={i} className="p-8 rounded-[40px] border-none shadow-sm bg-white hover:shadow-xl transition-all">
                  <span className="text-[10px] font-black text-orange-500 uppercase bg-orange-50 px-3 py-1 rounded-lg">{e.level}</span>
                  <h4 className="text-lg font-black text-slate-800 uppercase mt-4">{e.field}</h4>
                  <p className="text-slate-500 font-bold text-sm">{e.school}</p>
                  <div className="mt-4 flex justify-between items-center text-[10px] font-black text-slate-400">
                    <span>{e.start} - {e.isCurrent ? "Devam" : e.end}</span>
                    <span className="text-slate-800">GPA: {e.gpa}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* SAĞ KOLON: DİLLER VE YETENEKLER */}
        <div className="lg:col-span-4 space-y-16">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Languages size={20} className="text-indigo-500" /> Dil Yetkinliği</h3>
            <div className="space-y-6">
              {formData.languages.map((l, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-700 uppercase text-xs">{l.lang}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= l.level ? "#6366f1" : "none"} className={s <= l.level ? "text-indigo-500" : "text-slate-200"} />)}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(l.level/5)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Award size={20} className="text-yellow-500" /> Sertifikalar</h3>
            <div className="space-y-4">
              {formData.certificates.map((c, i) => (
                <div key={i} className="p-5 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600"><Award size={20}/></div>
                  <div>
                    <h5 className="font-black text-slate-800 text-xs uppercase">{c.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{c.issuer} • {c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- DEV DÜZENLEME MODALI --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[60px] shadow-2xl relative custom-scrollbar">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-12 border-b z-50 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800">Kariyer Mimarı <span className="text-rose-500">v20</span></h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-left">Global HR Data Senkronizasyonu</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-16 h-16 bg-slate-50 rounded-[25px] flex items-center justify-center hover:rotate-90 transition-all shadow-sm"><X /></button>
            </div>
            
            <div className="p-12 space-y-20 text-left">
              {/* 1. TEMEL VE İLETİŞİM */}
              <div className="grid md:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ad Soyad</label>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none focus:ring-4 ring-rose-500/10" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ülke Kodu & Telefon</label>
                  <div className="flex gap-3">
                    <select value={formData.phone_code} onChange={e => setFormData({...formData, phone_code: e.target.value})} className="w-1/3 p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.code} ({p.country})</option>)}
                    </select>
                    <input placeholder="5XX XXX XX XX" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Hakkımda</label>
                  <textarea value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full p-6 rounded-[25px] bg-slate-50 border-none font-bold outline-none h-18 resize-none" />
                </div>
              </div>

              {/* 2. DİNAMİK DİL PUANLAMA */}
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-black uppercase tracking-widest text-slate-800 text-sm">Dil Yetkinliği (1-5 Puan)</h3>
                  <Button size="sm" onClick={() => setFormData({...formData, languages: [...formData.languages, { lang: "English", level: 3 }]})} className="bg-indigo-600 text-white rounded-2xl font-black text-[10px]">DİL EKLE</Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[30px] flex items-center justify-between">
                      <select value={l.lang} onChange={e => { const nl = [...formData.languages]; nl[i].lang = e.target.value; setFormData({...formData, languages: nl}); }} className="bg-transparent font-black uppercase text-xs outline-none">
                        {LANGUAGES_LIST.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                      </select>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => { const nl = [...formData.languages]; nl[i].level = v; setFormData({...formData, languages: nl}); }} className={`w-8 h-8 rounded-xl font-black text-[10px] transition-all ${l.level === v ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>{v}</button>
                        ))}
                      </div>
                      <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="text-red-400 ml-4"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. İŞ DENEYİMLERİ (EKLE/SİL) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-black uppercase tracking-widest text-slate-800 text-sm">İş Deneyimleri</h3>
                  <Button size="sm" onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, { role: "", company: "", start: "", end: "", isCurrent: false, desc: "" }]})} className="bg-rose-500 text-white rounded-2xl font-black text-[10px]">DENEYİM EKLE</Button>
                </div>
                <div className="space-y-6">
                  {formData.work_experience.map((w, i) => (
                    <div key={i} className="p-10 bg-slate-50 rounded-[45px] space-y-6 relative">
                      <div className="grid md:grid-cols-3 gap-6">
                        <input placeholder="Pozisyon" value={w.role} onChange={e => { const nw = [...formData.work_experience]; nw[i].role = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-5 bg-white rounded-2xl border-none font-bold" />
                        <input placeholder="Şirket" value={w.company} onChange={e => { const nw = [...formData.work_experience]; nw[i].company = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-5 bg-white rounded-2xl border-none font-bold" />
                        <div className="flex items-center gap-4 px-4 bg-white rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400">HALA ÇALIŞIYORUM</span>
                          <input type="checkbox" checked={w.isCurrent} onChange={e => { const nw = [...formData.work_experience]; nw[i].isCurrent = e.target.checked; setFormData({...formData, work_experience: nw}); }} className="w-6 h-6 accent-rose-500" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <input type="date" value={w.start} onChange={e => { const nw = [...formData.work_experience]; nw[i].start = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-5 bg-white rounded-2xl border-none font-bold" />
                        {!w.isCurrent && <input type="date" value={w.end} onChange={e => { const nw = [...formData.work_experience]; nw[i].end = e.target.value; setFormData({...formData, work_experience: nw}); }} className="p-5 bg-white rounded-2xl border-none font-bold" />}
                      </div>
                      <textarea placeholder="Görev tanımı..." value={w.desc} onChange={e => { const nw = [...formData.work_experience]; nw[i].desc = e.target.value; setFormData({...formData, work_experience: nw}); }} className="w-full p-5 bg-white rounded-2xl border-none font-bold min-h-[120px]" />
                      <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-6 right-8 text-red-400"><Trash2 size={24}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-12 bg-white/90 backdrop-blur-md border-t flex gap-8">
              <Button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 h-24 rounded-[35px] text-3xl font-black uppercase italic text-white shadow-2xl shadow-rose-200 transition-all active:scale-95">
                VERİLERİ MÜHÜRLE
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-24 px-16 rounded-[35px] font-black uppercase text-slate-400 text-lg">Vazgeç</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
