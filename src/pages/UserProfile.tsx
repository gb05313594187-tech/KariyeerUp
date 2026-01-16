
// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Pencil, History, GraduationCap, Award, Mail, Phone, MapPin, 
  X, Plus, Trash2, Save, Download, Globe, Briefcase 
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    phone: "",
    sector: "",
    title: "",
    manifesto: "Sınırları zorlayan, vizyoner bir liderlik manifestosu ekleyerek etkileşiminizi 10 katına çıkarın.",
    summary: "Uluslararası geçerliliği olan, sonuç odaklı ve profesyonel bir kariyer özeti buraya gelecek.",
    work_experience: [],
    education: [],
    certificates: [],
    languages: []
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setMe(session.user);

      const { data: p, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

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
      toast.success("Profil başarıyla güncellendi!");
      setEditOpen(false);
      loadProfile();
    } catch (e) {
      toast.error("Kaydedilirken bir hata oluştu: " + e.message);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="bg-[#f3f4f6] min-h-screen pb-20">
      {/* --- HEADER / HERO (SİYAH ALAN) --- */}
      <div className="bg-black text-white pt-12 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-[30px] flex items-center justify-center text-4xl font-bold shadow-2xl">
              {formData.full_name?.substring(0,2).toUpperCase() || "GB"}
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase">{formData.full_name}</h1>
              <p className="text-rose-500 font-bold tracking-[0.2em] text-sm mt-2 flex items-center gap-2">
                <Globe size={14}/> {formData.title}
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0">
            <Button variant="outline" className="bg-white text-black hover:bg-slate-100 rounded-xl px-6 h-12 font-bold">
              <Download size={18} className="mr-2"/> CV İNDİR (PDF)
            </Button>
            <Button onClick={() => setEditOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 h-12 font-bold transition-transform active:scale-95">
              <Pencil size={18} className="mr-2"/> DÜZENLE
            </Button>
          </div>
        </div>
      </div>

      {/* --- KARTLI İÇERİK ALANI --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* SOL KOLON */}
        <div className="md:col-span-4 space-y-8">
          {/* Kariyer Yolculuğum */}
          <Card className="rounded-[40px] shadow-xl border-none p-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"/> Kariyer Yolculuğum
            </h3>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Award size={20}/></div>
                 <div>
                   <p className="text-xs font-black uppercase italic">Kariyerup Doğrulaması</p>
                   <p className="text-[10px] text-slate-400">ULUSLARARASI ONAYLI PROFİL</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center"><Plus size={20}/></div>
                 <div>
                   <p className="text-xs font-black uppercase italic">Aktif Hedefler</p>
                   <p className="text-[10px] text-slate-400">ÜST DÜZEY YÖNETİCİ MENTÖRLÜĞÜ</p>
                 </div>
               </div>
            </div>
          </Card>

          {/* Sertifika Galerisi (SİYAH KART) */}
          <Card className="rounded-[40px] shadow-2xl border-none p-8 bg-[#0f172a] text-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Award size={14} className="text-yellow-500"/> Sertifika & Başarı Galerisi
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg border border-white/20 mb-2 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <Plus size={16}/>
                  </div>
                  <span className="text-[8px] text-white/30 uppercase font-bold">Belge Ekle</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SAĞ KOLON */}
        <div className="md:col-span-8 space-y-8">
          {/* Manifesto Kartı */}
          <Card className="rounded-[40px] shadow-xl border-none p-10 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-6">Professional Manifesto</h3>
            <p className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-800 leading-tight">
              "{formData.manifesto}"
            </p>
          </Card>

          {/* Summary Kartı */}
          <Card className="rounded-[40px] shadow-xl border-none p-10 bg-white">
            <div className="flex justify-between items-start mb-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Professional Executive Summary</h3>
              <Globe size={18} className="text-rose-500"/>
            </div>
            <p className="text-xl font-medium text-slate-600 leading-relaxed italic border-l-4 border-rose-500 pl-6 py-2">
              {formData.summary}
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-50">
               <div>
                 <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Primary Industry</p>
                 <p className="text-lg font-black italic uppercase text-slate-800 mt-1">{formData.sector}</p>
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Service Location</p>
                 <p className="text-lg font-black italic uppercase text-slate-800 mt-1">Worldwide</p>
               </div>
            </div>
          </Card>
        </div>
      </div>

      {/* --- MODAL (Görsel 3'teki Yapı) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic">Özgeçmiş Verilerini Güncelle</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Europass formatında bilgilerinizi özelleştirin.</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors"><X/></button>
            </div>

            <div className="space-y-10">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-slate-400">Ünvan / Coach Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-rose-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-slate-400">Sektör / Industry</label>
                  <input value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-rose-500 outline-none" />
                </div>
              </div>

              {/* Manifesto ve Özet */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-rose-500">Manifesto (Giriş Cümlesi)</label>
                  <textarea value={formData.manifesto} onChange={e => setFormData({...formData, manifesto: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl h-24 focus:ring-2 ring-rose-500 outline-none font-bold italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-slate-400">Profesyonel Özet</label>
                  <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl h-32 focus:ring-2 ring-rose-500 outline-none" />
                </div>
              </div>

              {/* Deneyimler Bölümü (Görsel 3'teki Tasarım) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-900 uppercase italic">İş Deneyimleri</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start: "", end: "", description: ""}]})} variant="outline" className="rounded-xl text-rose-500 border-rose-100 hover:bg-rose-50">
                    <Plus size={16} className="mr-2"/> Deneyim Ekle
                  </Button>
                </div>
                {formData.work_experience.map((work, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[30px] relative space-y-4">
                    <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-rose-300 hover:text-rose-600"><Trash2 size={18}/></button>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Pozisyon" value={work.role} onChange={e => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-3 bg-white rounded-xl border-none shadow-sm outline-none" />
                      <input placeholder="Şirket" value={work.company} onChange={e => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-3 bg-white rounded-xl border-none shadow-sm outline-none" />
                      <input placeholder="Başlangıç" value={work.start} onChange={e => { const n = [...formData.work_experience]; n[i].start = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-3 bg-white rounded-xl border-none shadow-sm outline-none" />
                      <input placeholder="Bitiş" value={work.end} onChange={e => { const n = [...formData.work_experience]; n[i].end = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-3 bg-white rounded-xl border-none shadow-sm outline-none" />
                    </div>
                    <textarea placeholder="Görev Tanımı" value={work.description} onChange={e => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-3 bg-white rounded-xl border-none shadow-sm h-20 outline-none" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex gap-4 sticky bottom-0 bg-white pt-6 border-t">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-[20px] h-16 text-lg font-black shadow-lg shadow-rose-200 uppercase italic">
                {saving ? "Güncelleniyor..." : "Tüm Değişiklikleri Uygula"}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-16 px-8 rounded-[20px] font-bold text-slate-400">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
