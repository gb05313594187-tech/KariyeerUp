// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User, Mail, Phone, MapPin, Building2, Pencil, GraduationCap,
  Languages, Code2, Globe, Plus, Trash2, History, X, Save, ArrowRight, Award, Briefcase
} from "lucide-react";

// --- SABİTLER ---
const SECTORS = ["Yazılım", "Sağlık", "Eğitim", "Finans", "Pazarlama", "Üretim", "Diğer"];
const TITLES = ["Engineer", "Manager", "Designer", "Consultant", "Specialist", "Diğer"];
const PHONE_CODES = [
  { code: "+90", country: "TR" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "DE" }
];

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    phone_code: "+90",
    phone_number: "",
    sector: "",
    custom_sector: "",
    title: "",
    custom_title: "",
    work_experience: [],
    education: [],
    certificates: [],
    languages: [],
    digital_skills: []
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setMe(session.user);
      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (p) {
        setFormData({
          ...formData,
          full_name: p.full_name || "",
          city: p.city || "",
          phone_code: p.phone?.split(" ")[0] || "+90",
          phone_number: p.phone?.split(" ")[1] || "",
          sector: SECTORS.includes(p.sector) ? p.sector : (p.sector ? "Diğer" : ""),
          custom_sector: SECTORS.includes(p.sector) ? "" : p.sector,
          title: TITLES.includes(p.title) ? p.title : (p.title ? "Diğer" : ""),
          custom_title: TITLES.includes(p.title) ? "" : p.title,
          ...(p.cv_data || {})
        });
      }
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    const finalSector = formData.sector === "Diğer" ? formData.custom_sector : formData.sector;
    const finalTitle = formData.title === "Diğer" ? formData.custom_title : formData.title;
    
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        full_name: formData.full_name,
        city: formData.city,
        phone: `${formData.phone_code} ${formData.phone_number}`,
        sector: finalSector,
        title: finalTitle,
        cv_data: {
          work_experience: formData.work_experience,
          education: formData.education,
          certificates: formData.certificates,
          languages: formData.languages,
          digital_skills: formData.digital_skills
        },
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Profil başarıyla güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { toast.error("Kaydedilirken bir hata oluştu"); } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-medium">Yükleniyor...</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      {/* --- HERO SECTION: İLK GÖRSELDEKİ RENK YAPISI --- */}
      <section className="bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb923c] py-16 text-white relative shadow-xl">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex-1">
              <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block backdrop-blur-sm">
                International Career Profile
              </span>
              <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-md">
                {formData.full_name || "Profiliniz"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
                <span className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <Briefcase size={18} /> {formData.sector === "Diğer" ? formData.custom_sector : formData.sector || "Sektör Belirtilmedi"}
                </span>
                <span className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <User size={18} /> {formData.title === "Diğer" ? formData.custom_title : formData.title || "Ünvan Belirtilmedi"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <Button onClick={() => setEditOpen(true)} className="bg-white text-rose-600 hover:bg-rose-50 rounded-2xl h-14 px-10 font-bold shadow-lg transition-all active:scale-95">
                 <Pencil size={18} className="mr-2" /> Özgeçmişi Düzenle
               </Button>
               <Button variant="outline" onClick={() => navigate("/user/dashboard")} className="border-white/40 text-white hover:bg-white/10 rounded-2xl h-14 px-8 backdrop-blur-sm">
                 Dashboard <ArrowRight size={18} className="ml-2" />
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- ANA İÇERİK: EUROPASS AKIŞI --- */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        
        {/* SOL KOLON: Deneyim ve Eğitim */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* DENEYİM */}
          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 tracking-tight">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><History size={22} /></div>
              İş Deneyimi
            </h2>
            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-slate-100">
              {formData.work_experience?.length > 0 ? formData.work_experience.map((work, i) => (
                <div key={i} className="relative pl-12 group">
                  <div className="absolute left-0 top-1.5 w-[40px] h-[40px] bg-white border-2 border-rose-500 rounded-full z-10 flex items-center justify-center transition-colors group-hover:bg-rose-500">
                    <div className="w-2 h-2 bg-rose-500 group-hover:bg-white rounded-full" />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{work.role}</h3>
                    <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full self-start">
                      {work.start} — {work.end}
                    </span>
                  </div>
                  <p className="text-slate-600 font-semibold mb-3 flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400" /> {work.company}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">{work.description}</p>
                </div>
              )) : <p className="text-slate-400 italic text-center py-10">Henüz iş deneyimi girilmemiş.</p>}
            </div>
          </section>

          {/* EĞİTİM (Üniversiteler) */}
          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 tracking-tight">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><GraduationCap size={22} /></div>
              Eğitim ve Öğretim
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {formData.education?.map((edu, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{edu.school}</h3>
                  <p className="text-blue-600 text-sm font-medium">{edu.degree}</p>
                  <p className="text-slate-400 text-xs mt-2 font-bold uppercase">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SERTİFİKALAR */}
          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 tracking-tight">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Award size={22} /></div>
              Sertifikalar ve Başarılar
            </h2>
            <div className="flex flex-wrap gap-4">
              {formData.certificates?.map((cert, i) => (
                <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Award size={20}/></div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{cert.name}</h4>
                    <p className="text-[11px] text-slate-500">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SAĞ KOLON: İletişim ve Yetenekler */}
        <div className="lg:col-span-4 space-y-8">
          {/* İletişim Kartı */}
          <Card className="rounded-[32px] overflow-hidden border-none shadow-xl bg-slate-900 text-white">
            <CardHeader className="border-b border-white/10 pb-6 pt-8 px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <User size={18} className="text-rose-400" /> İletişim Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-posta</p>
                <p className="text-sm font-medium truncate">{me?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Telefon</p>
                <p className="text-sm font-medium">{formData.phone_code} {formData.phone_number || "Belirtilmedi"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lokasyon</p>
                <p className="text-sm font-medium">{formData.city || "Belirtilmedi"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Diller */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-800">
              <Languages size={20} className="text-rose-500" /> Dil Becerileri
            </h3>
            <div className="space-y-5">
              {formData.languages?.map((l, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="text-sm font-bold text-slate-700">{l.name}</span>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg uppercase">{l.level}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* --- MODAL: DÜZENLEME (Üniversite, Diğer, Sertifika Destekli) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-8 border-b flex justify-between items-center z-20">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Özgeçmiş Verilerini Güncelle</h2>
                <p className="text-slate-500 text-sm mt-1">Europass formatında bilgilerinizi özelleştirin.</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-slate-200 transition-colors shadow-inner"><X/></button>
            </div>

            <div className="p-10 space-y-12">
              {/* Temel Bilgiler Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-700 ml-1">Sektör Bilgisi</label>
                  <select value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all">
                    <option value="">Sektör Seçiniz</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {formData.sector === "Diğer" && (
                    <input placeholder="Kendi Sektörünüzü Tanımlayın" value={formData.custom_sector} onChange={(e) => setFormData({...formData, custom_sector: e.target.value})} className="w-full p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-in slide-in-from-top-2"/>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-700 ml-1">Mevcut Ünvan</label>
                  <select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all">
                    <option value="">Ünvan Seçiniz</option>
                    {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {formData.title === "Diğer" && (
                    <input placeholder="Ünvanınızı Yazın" value={formData.custom_title} onChange={(e) => setFormData({...formData, custom_title: e.target.value})} className="w-full p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-in slide-in-from-top-2"/>
                  )}
                </div>
              </div>

              {/* Üniversiteler Bölümü */}
              <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-black text-slate-800">Üniversiteler ve Eğitim</h3>
                   <Button onClick={() => setFormData({...formData, education: [...formData.education, {school: "", degree: "", year: ""}]})} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-xl font-bold"><Plus size={18} className="mr-2"/> Okul Ekle</Button>
                </div>
                <div className="space-y-4">
                  {formData.education.map((edu, i) => (
                    <div key={i} className="grid md:grid-cols-3 gap-4 p-6 bg-white border border-slate-200 rounded-[24px] relative group shadow-sm">
                      <input placeholder="Üniversite / Kurum" value={edu.school} onChange={(e) => { const n = [...formData.education]; n[i].school = e.target.value; setFormData({...formData, education: n}); }} className="p-3 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white transition-colors outline-none"/>
                      <input placeholder="Bölüm / Uzmanlık" value={edu.degree} onChange={(e) => { const n = [...formData.education]; n[i].degree = e.target.value; setFormData({...formData, education: n}); }} className="p-3 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none"/>
                      <input placeholder="Mezuniyet Yılı" value={edu.year} onChange={(e) => { const n = [...formData.education]; n[i].year = e.target.value; setFormData({...formData, education: n}); }} className="p-3 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none"/>
                      <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute -right-2 -top-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* İş Deneyimi Düzenleme */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-800">İş Deneyimleri</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start: "", end: "", location: "", description: ""}]})} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl font-bold">
                    <Plus size={18} className="mr-2" /> Deneyim Ekle
                  </Button>
                </div>
                <div className="space-y-6">
                  {formData.work_experience.map((work, i) => (
                    <div key={i} className="p-8 border border-slate-200 rounded-[32px] relative bg-white shadow-sm space-y-4">
                      <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input placeholder="Unvan (Örn: Kıdemli Yazılımcı)" value={work.role} onChange={(e) => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500" />
                        <input placeholder="Şirket Adı" value={work.company} onChange={(e) => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500" />
                        <input placeholder="Başlangıç (Örn: Haz 2020)" value={work.start} onChange={(e) => { const n = [...formData.work_experience]; n[i].start = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500" />
                        <input placeholder="Bitiş (Halen / 2024)" value={work.end} onChange={(e) => { const n = [...formData.work_experience]; n[i].end = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500" />
                      </div>
                      <textarea placeholder="Ana sorumluluklarınız ve başarılarınız..." value={work.description} onChange={(e) => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 bg-slate-50 border rounded-2xl h-32 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-8 border-t flex gap-4 z-20">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-3xl h-16 text-lg font-black shadow-xl shadow-rose-500/30 transition-all active:scale-95">
                {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Uygula"}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-16 px-10 rounded-3xl font-bold text-slate-500">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
