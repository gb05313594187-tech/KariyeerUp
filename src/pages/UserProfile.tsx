// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User, Building2, Pencil, History, X, Award, Briefcase, Trash2, Target, Rocket, Lightbulb, MapPin
} from "lucide-react";

const SECTORS = ["Yazılım", "Sağlık", "Eğitim", "Finans", "Pazarlama", "Üretim", "Diğer"];
const TITLES = ["Engineer", "Manager", "Designer", "Consultant", "Specialist", "Diğer"];

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    city: "",
    phone_code: "+90",
    phone_number: "",
    sector: "",
    custom_sector: "",
    title: "",
    custom_title: "",
    career_goals: {
      target_title: "",
      target_sector: "",
      vision: "",
      short_term_plan: ""
    },
    work_experience: [], // Buranın dizi olduğundan emin oluyoruz
    certificates: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/login");
        return;
      }

      setMe(session.user);

      const { data: p, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (p) {
        setFormData({
          full_name: p.full_name || "",
          email: p.email || session.user.email || "",
          city: p.city || "",
          phone_code: p.phone?.split(" ")[0] || "+90",
          phone_number: p.phone?.split(" ")[1] || "",
          sector: SECTORS.includes(p.sector) ? p.sector : (p.sector ? "Diğer" : ""),
          custom_sector: SECTORS.includes(p.sector) ? "" : p.sector,
          title: TITLES.includes(p.title) ? p.title : (p.title ? "Diğer" : ""),
          custom_title: TITLES.includes(p.title) ? "" : p.title,
          career_goals: p.cv_data?.career_goals || { target_title: "", target_sector: "", vision: "", short_term_plan: "" },
          work_experience: p.cv_data?.work_experience || [], // Veri yoksa boş dizi
          certificates: p.cv_data?.certificates || [],
        });
      }
    } catch (err) {
      console.error("Yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!me?.id) return;
    setSaving(true);
    
    const finalSector = formData.sector === "Diğer" ? formData.custom_sector : formData.sector;
    const finalTitle = formData.title === "Diğer" ? formData.custom_title : formData.title;
    
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        email: formData.email,
        full_name: formData.full_name,
        city: formData.city,
        phone: `${formData.phone_code} ${formData.phone_number}`,
        sector: finalSector,
        title: finalTitle,
        cv_data: {
          career_goals: formData.career_goals,
          work_experience: formData.work_experience,
          certificates: formData.certificates,
          education: formData.education || [],
          languages: formData.languages || [],
          digital_skills: formData.digital_skills || []
        },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success("Profil ve Kariyer Hedefleri başarıyla güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { 
      toast.error("Hata: " + e.message); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 font-black italic text-rose-500 animate-pulse text-2xl uppercase">
      Sistem Verileri Senkronize Ediliyor...
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb923c] py-16 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block backdrop-blur-sm italic tracking-widest">
              Verified Career Strategy Profile
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">
              {formData.full_name || "İSİMSİZ KULLANICI"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-bold uppercase italic">
                <Briefcase size={14}/> {formData.sector === "Diğer" ? formData.custom_sector : formData.sector || "SEKTÖR BELİRTİLMEMİŞ"}
              </span>
              <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-bold uppercase italic">
                <Target size={14}/> Hedef: {formData.career_goals.target_title || "BELİRLENMEMİŞ"}
              </span>
            </div>
          </div>
          <Button onClick={() => setEditOpen(true)} className="bg-white text-rose-600 hover:bg-rose-50 rounded-2xl h-14 px-10 font-black shadow-xl uppercase italic transition-transform active:scale-95">
            <Pencil size={18} className="mr-2" /> Profili Düzenle
          </Button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* KARİYER VİZYONU KARTI */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-rose-500/10"><Rocket size={120} /></div>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 uppercase italic">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner"><Target size={24} /></div>
              Kariyer Hedefleri & Vizyon
            </h2>
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Gelecek Vizyonu</h4>
                <p className="text-slate-700 font-medium leading-relaxed italic">
                  "{formData.career_goals.vision || "Kariyer hedeflerinizi ve vizyonunuzu belirlemek için düzenleme panelini kullanın."}"
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Kısa Vadeli Aksiyon Planı</h4>
                <p className="text-slate-600 text-sm font-semibold bg-slate-50 p-4 rounded-2xl border-l-4 border-orange-400">
                  {formData.career_goals.short_term_plan || "Henüz bir aksiyon planı girilmedi."}
                </p>
              </div>
            </div>
          </section>

          {/* İŞ DENEYİMİ (GÖRÜNTÜLEME) */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><History size={24} /></div>
              İş Deneyimi
            </h2>
            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[23px] before:w-[2px] before:bg-slate-100">
              {formData.work_experience?.length > 0 ? formData.work_experience.map((work, i) => (
                <div key={i} className="relative pl-14 group">
                  <div className="absolute left-0 top-1.5 w-[48px] h-[48px] bg-white border-4 border-rose-500 rounded-2xl z-10 flex items-center justify-center transition-all group-hover:bg-rose-500 group-hover:rotate-6">
                    <Briefcase size={20} className="text-rose-500 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900 uppercase italic">{work.role}</h3>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-xl border border-rose-100 self-start">
                      {work.start} — {work.end}
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold mb-3 flex items-center gap-2 text-sm uppercase">
                    <Building2 size={16} /> {work.company}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">{work.description}</p>
                </div>
              )) : <p className="text-slate-400 italic font-bold text-center py-10">Henüz iş deneyimi eklenmemiş.</p>}
            </div>
          </section>

          {/* SERTİFİKALAR (GÖRÜNTÜLEME) */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 uppercase italic">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner"><Award size={24} /></div>
              Sertifikalar ve Başarılar
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {formData.certificates?.length > 0 ? formData.certificates.map((cert, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-amber-200 transition-all">
                  <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm"><Award size={24}/></div>
                  <div>
                    <h4 className="font-black text-xs text-slate-800 uppercase italic leading-tight">{cert.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              )) : <p className="text-slate-400 italic font-bold">Henüz sertifika eklenmemiş.</p>}
            </div>
          </section>
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[40px] overflow-hidden border-none shadow-2xl bg-[#0f172a] text-white p-10">
              <h3 className="text-xs font-black uppercase text-rose-500 italic mb-8 tracking-widest flex items-center gap-2">
                <MapPin size={14}/> İletişim & Konum
              </h3>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1">E-posta Adresi</p>
                  <p className="text-sm font-bold italic text-slate-200 group-hover:text-rose-400 transition-colors truncate">{formData.email}</p>
                </div>
                <div className="group">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Telefon Hattı</p>
                  <p className="text-sm font-bold italic text-slate-200">{formData.phone_code} {formData.phone_number || "GİRİLMEDİ"}</p>
                </div>
                <div className="group">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Bulunduğu Şehir</p>
                  <p className="text-sm font-bold italic text-slate-200 uppercase">{formData.city || "GİRİLMEDİ"}</p>
                </div>
              </div>
          </Card>
        </div>
      </main>

      {/* MODAL: DÜZENLEME */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[50px] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-10 border-b flex justify-between items-center z-20">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Profil Mimarı</h2>
                <p className="text-xs font-bold text-slate-400 uppercase italic">Kariyer verilerini ve hedeflerini optimize et</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-14 h-14 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-inner">
                <X size={28}/>
              </button>
            </div>

            <div className="p-12 space-y-12">
               {/* KARİYER HEDEFLERİ */}
               <div className="bg-orange-50 p-10 rounded-[40px] space-y-6 border border-orange-100">
                <h3 className="text-xl font-black text-orange-700 uppercase italic flex items-center gap-2"><Lightbulb size={24}/> Kariyer Hedeflerini Belirle</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-orange-400 ml-2">HEDEF UNVAN</label>
                    <input placeholder="Örn: Senior Software Architect" value={formData.career_goals.target_title} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_title: e.target.value}})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-orange-400 ml-2">HEDEF SEKTÖR</label>
                    <input placeholder="Örn: Global Finans Teknolojileri" value={formData.career_goals.target_sector} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_sector: e.target.value}})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-orange-400 ml-2">GELECEK VİZYONU</label>
                  <textarea placeholder="Kendini İlk 6 ay ve 1 yıl sonra nerede görüyorsun?" value={formData.career_goals.vision} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, vision: e.target.value}})} className="w-full p-5 rounded-2xl border-none shadow-sm font-medium h-32" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-orange-400 ml-2">KISA VADELİ AKSİYON</label>
                  <input placeholder="Bu hedefe ulaşmak için atacağın ilk somut adım nedir?" value={formData.career_goals.short_term_plan} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, short_term_plan: e.target.value}})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic" />
                </div>
              </div>

               {/* GENEL BİLGİLER */}
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-10 rounded-[40px]">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">AD SOYAD</label>
                  <input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-4 rounded-2xl shadow-sm font-bold italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-POSTA</label>
                  <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 rounded-2xl shadow-sm font-bold italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-rose-500 ml-2 font-black italic tracking-widest">ŞEHİR / KONUM</label>
                  <input placeholder="Örn: İstanbul" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-4 rounded-2xl shadow-sm font-bold italic border-2 border-rose-100 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">TELEFON</label>
                  <div className="flex gap-2">
                    <input className="w-16 p-4 rounded-2xl shadow-sm font-bold italic text-center" value={formData.phone_code} onChange={(e) => setFormData({...formData, phone_code: e.target.value})} />
                    <input className="flex-1 p-4 rounded-2xl shadow-sm font-bold italic" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* İŞ DENEYİMLERİ DÜZENLEME (DÜZELTİLEN KISIM) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic">İş Deneyimleri Geçmişi</h3>
                  <Button 
                    onClick={() => {
                      const newWork = { role: "", company: "", start: "", end: "", description: "" };
                      setFormData({
                        ...formData, 
                        work_experience: [...(formData.work_experience || []), newWork]
                      });
                    }} 
                    variant="outline" 
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl font-black italic uppercase"
                  >
                    Yeni Deneyim Ekle
                  </Button>
                </div>
                <div className="space-y-6">
                  {formData.work_experience && formData.work_experience.length > 0 ? (
                    formData.work_experience.map((work, i) => (
                      <div key={i} className="p-8 border-2 border-slate-100 rounded-[40px] relative bg-white shadow-xl space-y-6 transition-all hover:border-rose-100">
                        <button 
                          onClick={() => {
                            const updated = formData.work_experience.filter((_, idx) => idx !== i);
                            setFormData({...formData, work_experience: updated});
                          }} 
                          className="absolute top-8 right-8 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={24} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-6">
                          <input placeholder="Pozisyon / Unvan" value={work.role} onChange={(e) => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 border-none rounded-2xl font-bold italic outline-none focus:ring-2 ring-rose-200" />
                          <input placeholder="Şirket Adı" value={work.company} onChange={(e) => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 border-none rounded-2xl font-bold italic outline-none focus:ring-2 ring-rose-200" />
                          <input placeholder="Başlangıç (Örn: 2020)" value={work.start} onChange={(e) => { const n = [...formData.work_experience]; n[i].start = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 border-none rounded-2xl font-bold italic outline-none focus:ring-2 ring-rose-200" />
                          <input placeholder="Bitiş (Örn: Halen veya 2023)" value={work.end} onChange={(e) => { const n = [...formData.work_experience]; n[i].end = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 border-none rounded-2xl font-bold italic outline-none focus:ring-2 ring-rose-200" />
                        </div>
                        <textarea placeholder="Görev ve Sorumluluklar" value={work.description} onChange={(e) => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-5 bg-slate-50 border-none rounded-2xl h-40 font-medium text-slate-600 outline-none focus:ring-2 ring-rose-200" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-400 font-bold italic">
                      Henüz bir iş deneyimi eklemediniz. "Yeni Deneyim Ekle" butonu ile başlayın.
                    </div>
                  )}
                </div>
              </div>

              {/* SERTİFİKALAR DÜZENLEME */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic">Sertifikalar ve Başarılar</h3>
                  <Button onClick={() => setFormData({...formData, certificates: [...(formData.certificates || []), {name: "", issuer: "", year: ""}]})} variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50 rounded-xl font-black italic uppercase">Sertifika Ekle</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {formData.certificates?.map((cert, i) => (
                    <div key={i} className="p-6 border-2 border-slate-100 rounded-[30px] relative bg-white shadow-lg space-y-4">
                      <button onClick={() => setFormData({...formData, certificates: formData.certificates.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={20} /></button>
                      <input placeholder="Sertifika Adı" value={cert.name} onChange={(e) => { const n = [...formData.certificates]; n[i].name = e.target.value; setFormData({...formData, certificates: n}); }} className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold italic outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Veren Kurum" value={cert.issuer} onChange={(e) => { const n = [...formData.certificates]; n[i].issuer = e.target.value; setFormData({...formData, certificates: n}); }} className="p-4 bg-slate-50 border-none rounded-xl font-bold italic outline-none" />
                        <input placeholder="Yıl" value={cert.year} onChange={(e) => { const n = [...formData.certificates]; n[i].year = e.target.value; setFormData({...formData, certificates: n}); }} className="p-4 bg-slate-50 border-none rounded-xl font-bold italic outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-10 border-t flex gap-6 z-20">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-[25px] h-20 text-xl font-black shadow-2xl transition-all uppercase italic tracking-tighter">
                {saving ? "STRATEJİ VE VERİLER İŞLENİYOR..." : "TÜM DEĞİŞİKLİKLERİ KAYDET VE VİZYONU GÜNCELLE"}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-20 px-12 rounded-[25px] font-black text-slate-400 uppercase italic border border-slate-100">VAZGEÇ</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
