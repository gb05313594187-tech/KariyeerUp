// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Pencil, Award, Mail, Phone, MapPin, X, Plus, Trash2, Save, Download, Globe, Briefcase, History, GraduationCap 
} from "lucide-react";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    phone: "",
    sector: "GLOBAL BUSINESS",
    title: "INTERNATIONAL CAREER COACH",
    manifesto: "Sınırları zorlayan, vizyoner bir liderlik manifestosu ekleyerek etkileşiminizi 10 katına çıkarın.",
    summary: "Uluslararası geçerliliği olan, sonuç odaklı ve profesyonel bir kariyer özeti buraya gelecek.",
    work_experience: [],
    education: [],
    certificates: [], // Sertifikalar için dizi
    languages: []
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setMe(session.user);

      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

      if (p) {
        setFormData({
          full_name: p.full_name || "",
          city: p.city || "",
          phone: p.phone || "",
          sector: p.sector || "GLOBAL BUSINESS",
          title: p.title || "INTERNATIONAL CAREER COACH",
          manifesto: p.cv_data?.manifesto || formData.manifesto,
          summary: p.cv_data?.summary || formData.summary,
          work_experience: p.cv_data?.work_experience || [],
          education: p.cv_data?.education || [],
          certificates: p.cv_data?.certificates || [],
          languages: p.cv_data?.languages || []
        });
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        full_name: formData.full_name,
        city: formData.city,
        phone: formData.phone,
        sector: formData.sector,
        title: formData.title,
        cv_data: {
          manifesto: formData.manifesto,
          summary: formData.summary,
          work_experience: formData.work_experience,
          education: formData.education,
          certificates: formData.certificates,
          languages: formData.languages
        },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success("Değişiklikler başarıyla uygulandı!");
      setEditOpen(false);
      loadProfile();
    } catch (e) {
      toast.error("Kaydedilirken hata: " + e.message);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold italic uppercase tracking-tighter">Yükleniyor...</div>;

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 font-sans">
      {/* --- BLACK HERO SECTION (Screenshot 1) --- */}
      <div className="bg-[#0a0a0a] text-white pt-16 pb-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-36 h-36 bg-[#6366f1] rounded-[38px] flex items-center justify-center text-5xl font-black shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              {formData.full_name?.substring(0,2).toUpperCase() || "GB"}
            </div>
            <div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">{formData.full_name}</h1>
              <p className="text-[#f43f5e] font-black tracking-[0.3em] text-xs mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#f43f5e] rounded-full animate-pulse"/> {formData.title}
              </p>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <Button variant="outline" className="bg-white text-black hover:bg-slate-100 rounded-2xl h-14 px-8 font-black italic border-none shadow-xl">
              <Download size={20} className="mr-2"/> CV İNDİR (PDF)
            </Button>
            <Button onClick={() => setEditOpen(true)} className="bg-[#f43f5e] hover:bg-[#e11d48] text-white rounded-2xl h-14 px-10 font-black italic shadow-lg shadow-rose-500/20 transition-all active:scale-95">
              <Pencil size={20} className="mr-2"/> DÜZENLE
            </Button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-8 -mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-20">
        
        {/* SOL KOLON */}
        <div className="md:col-span-4 space-y-8">
          {/* Kariyer Yolculuğu */}
          <Card className="rounded-[45px] shadow-2xl border-none p-10 bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500"/> Kariyer Yolculuğum
            </h3>
            <div className="space-y-8">
               <div className="flex items-center gap-5 group cursor-help">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Award size={24}/></div>
                 <div>
                   <p className="text-sm font-black uppercase italic text-slate-800">Kariyerup Doğrulaması</p>
                   <p className="text-[10px] text-slate-400 font-bold tracking-wider">ULUSLARARASI ONAYLI PROFİL</p>
                 </div>
               </div>
               <div className="flex items-center gap-5">
                 <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100"><Plus size={24}/></div>
                 <div>
                   <p className="text-sm font-black uppercase italic text-slate-800">Aktif Hedefler</p>
                   <p className="text-[10px] text-slate-400 font-bold tracking-wider">ÜST DÜZEY YÖNETİCİ MENTÖRLÜĞÜ</p>
                 </div>
               </div>
            </div>
          </Card>

          {/* SERTİFİKA GALERİSİ (Screenshot 1 Siyah Kart) */}
          <Card className="rounded-[45px] shadow-2xl border-none p-10 bg-[#0f172a] text-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                <Award size={14} className="text-yellow-500"/> Sertifika & Başarı
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formData.certificates?.length > 0 ? formData.certificates.map((c, i) => (
                <div key={i} className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-4 hover:bg-white/10 transition-all text-center">
                   <Award size={20} className="text-yellow-500 mb-2"/>
                   <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight">{c.name}</span>
                </div>
              )) : [1,2,3,4].map(i => (
                <div key={i} className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer group">
                  <Plus size={20} className="text-white/20 group-hover:text-white transition-all"/>
                  <span className="text-[8px] text-white/20 uppercase font-black mt-2">Belge Ekle</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-white/30 italic mt-6 leading-tight">* Sertifikalarınız ATS (Uluslararası iş alım algoritmaları) uyumlu olarak indekslenir.</p>
          </Card>
        </div>

        {/* SAĞ KOLON */}
        <div className="md:col-span-8 space-y-8">
          {/* Manifesto Kartı */}
          <Card className="rounded-[50px] shadow-2xl border-none p-14 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] mb-10">Professional Manifesto</h3>
            <p className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 leading-[1.1] relative z-10">
              "{formData.manifesto}"
            </p>
          </Card>

          {/* Executive Summary */}
          <Card className="rounded-[50px] shadow-2xl border-none p-14 bg-white">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Professional Executive Summary</h3>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-rose-500"><Globe size={20}/></div>
            </div>
            <p className="text-2xl font-bold text-slate-600 leading-relaxed italic border-l-[6px] border-rose-500 pl-8 py-4">
              {formData.summary}
            </p>
            <div className="grid grid-cols-2 gap-10 mt-16 pt-10 border-t border-slate-100">
               <div>
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2">Primary Industry</p>
                 <p className="text-xl font-black italic uppercase text-slate-900">{formData.sector}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2">Service Location</p>
                 <p className="text-xl font-black italic uppercase text-slate-900">WORLDWIDE</p>
               </div>
            </div>
          </Card>
        </div>
      </div>

      {/* --- MODAL: DÜZENLEME (Screenshot 3 Tasarımı) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[55px] shadow-2xl p-12">
            <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Profil & CV Verilerini Güncelle</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-3">Europass formatında global standartlarda özelleştirin.</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-14 h-14 bg-slate-100 rounded-3xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-inner"><X size={24}/></button>
            </div>

            <div className="space-y-12">
              {/* Bölüm: Manifesto & Özet */}
              <div className="space-y-8 bg-slate-50/50 p-8 rounded-[40px]">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase italic text-rose-500 ml-4 tracking-widest">Manifesto (Giriş Cümlesi)</label>
                  <textarea value={formData.manifesto} onChange={e => setFormData({...formData, manifesto: e.target.value})} className="w-full p-6 bg-white border-none rounded-[30px] h-28 focus:ring-4 ring-rose-100 outline-none font-black italic text-xl shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase italic text-slate-400 ml-4 tracking-widest">Kariyer Özeti (Summary)</label>
                  <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-6 bg-white border-none rounded-[30px] h-32 focus:ring-4 ring-rose-100 outline-none font-bold text-slate-600 shadow-sm" />
                </div>
              </div>

              {/* Bölüm: Deneyimler (Screenshot 3 Kartları) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="font-black text-slate-900 uppercase italic flex items-center gap-3"><History className="text-rose-500"/> İş Deneyimleri</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start: "", end: "", description: ""}]})} variant="outline" className="rounded-2xl text-rose-500 border-rose-200 hover:bg-rose-50 h-12 font-black italic">
                    <Plus size={18} className="mr-2"/> Deneyim Ekle
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {formData.work_experience.map((work, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[40px] relative animate-in slide-in-from-bottom-4 transition-all hover:shadow-lg border border-transparent hover:border-slate-200">
                      <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 w-10 h-10 bg-white text-rose-400 hover:text-rose-600 rounded-full flex items-center justify-center shadow-sm"><Trash2 size={18}/></button>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <input placeholder="Pozisyon / Rol" value={work.role} onChange={e => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm font-bold outline-none focus:ring-2 ring-rose-500" />
                        <input placeholder="Şirket Adı" value={work.company} onChange={e => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm font-bold outline-none focus:ring-2 ring-rose-500" />
                        <input placeholder="Başlangıç Yılı" value={work.start} onChange={e => { const n = [...formData.work_experience]; n[i].start = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm font-bold outline-none focus:ring-2 ring-rose-500" />
                        <input placeholder="Bitiş Yılı (veya Halen)" value={work.end} onChange={e => { const n = [...formData.work_experience]; n[i].end = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm font-bold outline-none focus:ring-2 ring-rose-500" />
                      </div>
                      <textarea placeholder="Görev Tanımı & Başarılar" value={work.description} onChange={e => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 bg-white rounded-2xl border-none shadow-sm h-24 outline-none focus:ring-2 ring-rose-500 font-medium" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bölüm: Sertifikalar Ekleme */}
              <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="font-black text-slate-900 uppercase italic flex items-center gap-3"><Award className="text-yellow-500"/> Sertifikalar</h3>
                  <Button onClick={() => setFormData({...formData, certificates: [...formData.certificates, {name: "", issuer: "", year: ""}]})} variant="outline" className="rounded-2xl text-yellow-600 border-yellow-200 hover:bg-yellow-50 h-12 font-black italic">
                    <Plus size={18} className="mr-2"/> Sertifika Ekle
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.certificates.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-[25px]">
                       <input placeholder="Sertifika Adı" value={cert.name} onChange={e => { const n = [...formData.certificates]; n[i].name = e.target.value; setFormData({...formData, certificates: n}); }} className="flex-1 p-3 bg-white rounded-xl border-none text-sm font-bold outline-none" />
                       <button onClick={() => setFormData({...formData, certificates: formData.certificates.filter((_, idx) => idx !== i)})} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-16 flex gap-6 sticky bottom-0 bg-white pt-8 border-t border-slate-100">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-[#f43f5e] hover:bg-[#e11d48] text-white rounded-[30px] h-20 text-xl font-black shadow-2xl shadow-rose-200 uppercase italic tracking-tighter transition-all active:scale-95">
                {saving ? "Güncelleniyor..." : "Tüm Değişiklikleri Uygula"}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-20 px-12 rounded-[30px] font-black text-slate-400 uppercase italic text-sm hover:bg-slate-50">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
