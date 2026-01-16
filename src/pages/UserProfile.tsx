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
  Languages, Code2, Globe, Plus, Trash2, History, X, Save, ArrowRight, Award
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

  // --- FORM STATE ---
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
    education: [], // Üniversiteler burada tutulur
    certificates: [], // Sertifikalar için yeni alan
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
          phone_number: p.phone?.replace(/^\+\d+/, "") || "",
          sector: SECTORS.includes(p.sector) ? p.sector : (p.sector ? "Diğer" : ""),
          custom_sector: SECTORS.includes(p.sector) ? "" : p.sector,
          title: TITLES.includes(p.title) ? p.title : (p.title ? "Diğer" : ""),
          custom_title: TITLES.includes(p.title) ? "" : p.title,
          ...p.cv_data 
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
        phone: `${formData.phone_code}${formData.phone_number}`,
        sector: finalSector,
        title: finalTitle,
        cv_data: {
          work_experience: formData.work_experience,
          education: formData.education,
          certificates: formData.certificates,
          languages: formData.languages,
          digital_skills: formData.digital_skills
        }
      });
      if (error) throw error;
      toast.success("Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { toast.error("Hata"); } finally { setSaving(false); }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO SECTION (Sadeleştirilmiş Görünüm) */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tight">{formData.full_name || "Profiliniz"}</h1>
            <p className="mt-4 text-orange-400 font-medium flex items-center gap-2">
              <Building2 size={18} /> {formData.sector === "Diğer" ? formData.custom_sector : formData.sector} 
              <span className="text-slate-500">|</span> 
              <User size={18} /> {formData.title === "Diğer" ? formData.custom_title : formData.title}
            </p>
          </div>
          <Button onClick={() => setEditOpen(true)} className="bg-orange-500 hover:bg-orange-600 rounded-2xl h-14 px-8 shadow-lg shadow-orange-500/20">
            <Pencil size={18} className="mr-2" /> Özgeçmişi Düzenle
          </Button>
        </div>
      </section>

      {/* ANA AKIŞ */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          
          {/* İŞ DENEYİMİ */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><History className="text-orange-500" /> Deneyim</h2>
            <div className="space-y-8 border-l-2 border-slate-200 ml-4">
              {formData.work_experience?.map((work, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-orange-500" />
                  <h3 className="text-xl font-bold">{work.role}</h3>
                  <p className="text-slate-600 font-semibold">{work.company} • <span className="text-sm font-normal text-slate-400">{work.start} - {work.end}</span></p>
                  <p className="mt-3 text-slate-500 leading-relaxed text-sm">{work.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* EĞİTİM & ÜNİVERSİTE */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><GraduationCap className="text-blue-500" /> Eğitim</h2>
            <div className="grid gap-4">
              {formData.education?.map((edu, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg">{edu.school}</h3>
                  <p className="text-blue-600 text-sm font-medium">{edu.degree}</p>
                  <p className="text-slate-400 text-xs mt-1">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SERTİFİKALAR */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Award className="text-yellow-500" /> Sertifikalar</h2>
            <div className="flex flex-wrap gap-3">
              {formData.certificates?.map((cert, i) => (
                <div key={i} className="px-4 py-3 bg-white border rounded-2xl flex items-center gap-3 shadow-sm">
                   <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600"><Award size={16}/></div>
                   <div>
                     <p className="text-sm font-bold">{cert.name}</p>
                     <p className="text-[10px] text-slate-400">{cert.issuer} • {cert.year}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SAĞ PANEL */}
        <aside className="space-y-6">
           <Card className="rounded-[32px] p-8 bg-slate-900 text-white border-none">
              <h3 className="font-bold text-lg mb-6">İletişim</h3>
              <div className="space-y-4 opacity-90 text-sm">
                <div className="flex items-center gap-3"><Mail size={16} className="text-orange-400"/> {me?.email}</div>
                <div className="flex items-center gap-3"><Phone size={16} className="text-orange-400"/> {formData.phone_code} {formData.phone_number}</div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-orange-400"/> {formData.city}</div>
              </div>
           </Card>
        </aside>
      </main>

      {/* --- MODAL: DÜZENLEME --- */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[40px] shadow-2xl shadow-black/50">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-8 border-b flex justify-between items-center z-20">
              <h2 className="text-2xl font-black">Özgeçmiş Verilerini Güncelle</h2>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"><X/></button>
            </div>

            <div className="p-10 space-y-12">
              {/* Bölüm: Temel & Sektör */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold ml-1">Sektör</label>
                  <select value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-orange-500">
                    <option value="">Seçiniz</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {formData.sector === "Diğer" && (
                    <input placeholder="Kendi Sektörünüzü Yazın" value={formData.custom_sector} onChange={(e) => setFormData({...formData, custom_sector: e.target.value})} className="w-full p-4 bg-orange-50 border border-orange-200 rounded-2xl animate-in fade-in duration-300"/>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold ml-1">Ünvan</label>
                  <select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-orange-500">
                    <option value="">Seçiniz</option>
                    {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {formData.title === "Diğer" && (
                    <input placeholder="Kendi Ünvanınızı Yazın" value={formData.custom_title} onChange={(e) => setFormData({...formData, custom_title: e.target.value})} className="w-full p-4 bg-orange-50 border border-orange-200 rounded-2xl animate-in fade-in duration-300"/>
                  )}
                </div>
              </div>

              {/* Bölüm: Telefon (Kod + Numara) */}
              <div className="space-y-4">
                  <label className="text-sm font-bold ml-1">İletişim Numarası</label>
                  <div className="flex gap-3">
                    <select value={formData.phone_code} onChange={(e) => setFormData({...formData, phone_code: e.target.value})} className="w-24 p-4 bg-slate-50 border rounded-2xl">
                      {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.code} ({p.country})</option>)}
                    </select>
                    <input placeholder="5xx xxx xx xx" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} className="flex-1 p-4 bg-slate-50 border rounded-2xl outline-orange-500" />
                  </div>
              </div>

              {/* Bölüm: Üniversiteler */}
              <div>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">Üniversite & Eğitim</h3>
                   <Button onClick={() => setFormData({...formData, education: [...formData.education, {school: "", degree: "", year: ""}]})} variant="ghost" className="text-orange-600 font-bold hover:bg-orange-50"><Plus size={18}/> Yeni Okul</Button>
                </div>
                <div className="space-y-4">
                  {formData.education.map((edu, i) => (
                    <div key={i} className="grid md:grid-cols-3 gap-3 p-6 border rounded-3xl relative group">
                      <input placeholder="Üniversite Adı" value={edu.school} onChange={(e) => { const n = [...formData.education]; n[i].school = e.target.value; setFormData({...formData, education: n}); }} className="p-3 bg-slate-50 rounded-xl border"/>
                      <input placeholder="Bölüm/Derece" value={edu.degree} onChange={(e) => { const n = [...formData.education]; n[i].degree = e.target.value; setFormData({...formData, education: n}); }} className="p-3 bg-slate-50 rounded-xl border"/>
                      <input placeholder="Yıl" value={edu.year} onChange={(e) => { const n = [...formData.education]; n[i].year = e.target.value; setFormData({...formData, education: n}); }} className="p-3 bg-slate-50 rounded-xl border"/>
                      <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute -right-2 -top-2 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bölüm: Sertifikalar */}
              <div>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">Sertifikalar</h3>
                   <Button onClick={() => setFormData({...formData, certificates: [...formData.certificates, {name: "", issuer: "", year: ""}]})} variant="ghost" className="text-yellow-600 font-bold hover:bg-yellow-50"><Plus size={18}/> Yeni Sertifika</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {formData.certificates.map((cert, i) => (
                    <div key={i} className="p-4 border rounded-2xl bg-slate-50/30 flex gap-2">
                      <input placeholder="Sertifika Adı" value={cert.name} onChange={(e) => { const n = [...formData.certificates]; n[i].name = e.target.value; setFormData({...formData, certificates: n}); }} className="flex-1 p-2 bg-white border rounded-lg text-sm"/>
                      <input placeholder="Kurum" value={cert.issuer} onChange={(e) => { const n = [...formData.certificates]; n[i].issuer = e.target.value; setFormData({...formData, certificates: n}); }} className="w-24 p-2 bg-white border rounded-lg text-sm"/>
                      <button onClick={() => setFormData({...formData, certificates: formData.certificates.filter((_, idx) => idx !== i)})} className="text-red-400 p-1"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-8 border-t flex gap-4 z-20">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-[20px] h-14 text-lg font-bold shadow-xl shadow-orange-500/20">
                {saving ? "Güncelleniyor..." : "Bilgileri Kaydet"}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-14 px-8 rounded-[20px] font-bold">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
