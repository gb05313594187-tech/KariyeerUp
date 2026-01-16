// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Pencil, Award, Mail, Phone, MapPin, X, Plus, Trash2, Download, Globe, History 
} from "lucide-react";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // Form Verileri
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    phone: "",
    sector: "GLOBAL BUSINESS",
    title: "INTERNATIONAL CAREER COACH",
    manifesto: "Sınırları zorlayan, vizyoner bir liderlik manifestosu ekleyerek etkileşiminizi 10 katına çıkarın.",
    summary: "Uluslararası geçerliliği olan, sonuç odaklı ve profesyonel bir kariyer özeti buraya gelecek.",
    work_experience: [],
    certificates: [], // Sertifika listesi
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
          certificates: p.cv_data?.certificates || [],
        });
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Hata almamak için veriyi temiz bir objeye dönüştürüyoruz
      const updatePayload = {
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
          certificates: formData.certificates,
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from("profiles").upsert(updatePayload);

      if (error) throw error;
      toast.success("Değişiklikler başarıyla uygulandı!");
      setEditOpen(false);
      loadProfile();
    } catch (e) {
      toast.error("Hata: " + e.message);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-tighter italic">Sistem Yükleniyor...</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* --- SİYAH HERO ALANI (Screenshot 1) --- */}
      <div className="bg-[#0a0a0a] text-white pt-16 pb-28">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-[#6366f1] rounded-[35px] flex items-center justify-center text-5xl font-black shadow-2xl">
              {formData.full_name?.substring(0,2).toUpperCase() || "GB"}
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase">{formData.full_name}</h1>
              <p className="text-[#f43f5e] font-black tracking-[0.3em] text-xs mt-3 flex items-center gap-2 uppercase">
                {formData.title}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-white text-black hover:bg-slate-100 rounded-2xl h-14 px-8 font-black border-none shadow-xl">
              <Download size={20} className="mr-2"/> CV İNDİR (PDF)
            </Button>
            <Button onClick={() => setEditOpen(true)} className="bg-[#f43f5e] hover:bg-[#e11d48] text-white rounded-2xl h-14 px-10 font-black shadow-lg transition-transform active:scale-95">
              <Pencil size={20} className="mr-2"/> DÜZENLE
            </Button>
          </div>
        </div>
      </div>

      {/* --- KARTLAR (Screenshot 1 & 2) --- */}
      <div className="max-w-7xl mx-auto px-8 -mt-14 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* SOL KOLON */}
        <div className="md:col-span-4 space-y-8">
          <Card className="rounded-[40px] shadow-xl border-none p-10 bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Kariyer Yolculuğum</h3>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100"><Award size={22}/></div>
                 <div><p className="text-xs font-black uppercase italic">Doğrulanmış Profil</p></div>
               </div>
            </div>
          </Card>

          {/* SERTİFİKA GALERİSİ (Screenshot 1 Siyah Kart) */}
          <Card className="rounded-[40px] shadow-2xl border-none p-10 bg-[#0f172a] text-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Sertifika & Başarı</h3>
            <div className="grid grid-cols-2 gap-3">
              {formData.certificates?.map((c, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-2 text-center">
                   <Award size={16} className="text-yellow-500 mb-1"/>
                   <span className="text-[9px] font-bold uppercase">{c.name}</span>
                </div>
              ))}
              <div onClick={() => setEditOpen(true)} className="aspect-square rounded-2xl bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/10">
                <Plus size={16} className="text-white/20"/>
              </div>
            </div>
          </Card>
        </div>

        {/* SAĞ KOLON */}
        <div className="md:col-span-8 space-y-8">
          <Card className="rounded-[40px] shadow-xl border-none p-12 bg-white">
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-8">Professional Manifesto</h3>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight">
              "{formData.manifesto}"
            </p>
          </Card>

          <Card className="rounded-[40px] shadow-xl border-none p-12 bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Executive Summary</h3>
            <p className="text-xl font-bold text-slate-600 leading-relaxed italic border-l-4 border-rose-500 pl-8">
              {formData.summary}
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
               <div>
                 <p className="text-[10px] font-black text-rose-500 uppercase">Primary Industry</p>
                 <p className="text-lg font-black italic uppercase text-slate-900">{formData.sector}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black text-rose-500 uppercase">Service Location</p>
                 <p className="text-lg font-black italic uppercase text-slate-900">WORLDWIDE</p>
               </div>
            </div>
          </Card>
        </div>
      </div>

      {/* --- MODAL (Screenshot 3 Tasarımı) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[50px] shadow-2xl p-10">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase italic">Verileri Güncelle</h2>
              <button onClick={() => setEditOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><X size={24}/></button>
            </div>

            <div className="space-y-10">
              {/* Manifesto & Özet */}
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-rose-500 ml-2">Manifesto</label>
                  <textarea value={formData.manifesto} onChange={e => setFormData({...formData, manifesto: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl h-24 focus:ring-2 ring-rose-500 outline-none font-black italic text-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Kariyer Özeti</label>
                  <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl h-32 focus:ring-2 ring-rose-500 outline-none font-bold text-slate-600" />
                </div>
              </div>

              {/* İş Deneyimleri (Screenshot 3 Form Yapısı) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-900 uppercase italic">İş Deneyimleri</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start: "", end: "", description: ""}]})} variant="outline" className="rounded-xl text-rose-500 border-rose-100">
                    <Plus size={16} className="mr-2"/> Deneyim Ekle
                  </Button>
                </div>
                {formData.work_experience.map((work, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[35px] relative grid grid-cols-2 gap-4">
                    <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute -top-2 -right-2 bg-white text-rose-500 w-8 h-8 rounded-full shadow-md"><X size={14} className="mx-auto"/></button>
                    <input placeholder="Pozisyon" value={work.role} onChange={e => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm outline-none" />
                    <input placeholder="Şirket" value={work.company} onChange={e => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm outline-none" />
                    <input placeholder="Başlangıç" value={work.start} onChange={e => { const n = [...formData.work_experience]; n[i].start = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm outline-none" />
                    <input placeholder="Bitiş" value={work.end} onChange={e => { const n = [...formData.work_experience]; n[i].end = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-white rounded-2xl border-none shadow-sm outline-none" />
                  </div>
                ))}
              </div>

              {/* Sertifikalar Bölümü */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-900 uppercase italic">Sertifikalar</h3>
                  <Button onClick={() => setFormData({...formData, certificates: [...formData.certificates, {name: ""}]})} variant="outline" className="rounded-xl text-yellow-600 border-yellow-100">
                    <Plus size={16} className="mr-2"/> Sertifika Ekle
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.certificates.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <input placeholder="Sertifika Adı" value={cert.name} onChange={e => { const n = [...formData.certificates]; n[i].name = e.target.value; setFormData({...formData, certificates: n}); }} className="flex-1 p-4 bg-slate-50 rounded-2xl border-none outline-none" />
                       <button onClick={() => setFormData({...formData, certificates: formData.certificates.filter((_, idx) => idx !== i)})} className="text-rose-500"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4 sticky bottom-0 bg-white pt-6">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-[#f43f5e] hover:bg-[#e11d48] text-white rounded-3xl h-16 text-lg font-black shadow-xl uppercase italic">
                {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Uygula"}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-16 px-10 rounded-3xl font-bold text-slate-400">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
