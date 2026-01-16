// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User, Building2, Pencil, History, X, Award, Briefcase, Trash2, Target, Rocket, Lightbulb, MapPin, ChevronDown, Globe
} from "lucide-react"; // BURASI DÜZELTİLDİ: lucide-react

const SECTORS = ["Yazılım", "Sağlık", "Eğitim", "Finans", "Pazarlama", "Üretim", "E-Ticaret", "Diğer"];
const TITLES = ["Engineer", "Manager", "Designer", "Consultant", "Specialist", "Executive", "Diğer"];

// --- DİL SÖZLÜĞÜ ---
const translations = {
  TR: {
    verified: "VERIFIED CAREER STRATEGY PROFILE",
    edit_btn: "Profili Düzenle",
    vision_title: "Kariyer Hedefleri & Vizyon",
    vision_sub: "Gelecek Vizyonu",
    action_plan: "Kısa Vadeli Aksiyon",
    exp_title: "İş Deneyimi",
    cert_title: "Sertifikalar",
    contact_title: "İletişim",
    email: "E-posta",
    phone: "Telefon",
    city: "Şehir",
    modal_title: "Profil Mimarı",
    modal_sub: "Kariyer verilerini ve hedeflerini optimize et",
    save_btn: "TÜM DEĞİŞİKLİKLERİ KAYDET VE VİZYONU GÜNCELLE",
    cancel_btn: "VAZGEÇ",
    add_exp: "Yeni Deneyim Ekle",
    add_cert: "Yeni Sertifika Ekle",
    sync: "Veriler Senkronize Ediliyor...",
    saving: "STRATEJİ İŞLENİYOR..."
  },
  EN: {
    verified: "VERIFIED CAREER STRATEGY PROFILE",
    edit_btn: "Edit Profile",
    vision_title: "Career Goals & Vision",
    vision_sub: "Future Vision",
    action_plan: "Short-Term Action",
    exp_title: "Work Experience",
    cert_title: "Certificates",
    contact_title: "Contact",
    email: "Email",
    phone: "Phone",
    city: "City",
    modal_title: "Profile Architect",
    modal_sub: "Optimize your career data and goals",
    save_btn: "SAVE ALL CHANGES AND UPDATE VISION",
    cancel_btn: "CANCEL",
    add_exp: "Add New Experience",
    add_cert: "Add New Certificate",
    sync: "Synchronizing Data...",
    saving: "PROCESSING STRATEGY..."
  },
  AR: {
    verified: "ملف استراتيجية المهنة المعتمد",
    edit_btn: "تعديل الملف الشخصي",
    vision_title: "أهداف المهنة والرؤية",
    vision_sub: "رؤية مستقبلية",
    action_plan: "خطة عمل قصيرة المدى",
    exp_title: "خبرة في العمل",
    cert_title: "شهادات",
    contact_title: "اتصال",
    email: "البريد الإلكتروني",
    phone: "هاتف",
    city: "مدينة",
    modal_title: "مهندس الملف الشخصي",
    modal_sub: "تحسين بيانات حياتك المهنية وأهدافك",
    save_btn: "حفظ جميع التغييرات وتحديث الرؤية",
    cancel_btn: "إلغاء",
    add_exp: "أضف تجربة جديدة",
    add_cert: "أضف شهادة جديدة",
    sync: "مزامنة البيانات...",
    saving: "معالجة الاستراتيجية..."
  },
  FR: {
    verified: "PROFIL DE STRATÉGIE DE CARRIÈRE VÉRIFIÉ",
    edit_btn: "Modifier le profil",
    vision_title: "Objectifs de carrière et vision",
    vision_sub: "Vision d'avenir",
    action_plan: "Action à court terme",
    exp_title: "Expérience professionnelle",
    cert_title: "Certificats",
    contact_title: "Contact",
    email: "E-mail",
    phone: "Téléphone",
    city: "Ville",
    modal_title: "Architecte de profil",
    modal_sub: "Optimisez vos données et objectifs de carrière",
    save_btn: "ENREGISTRER TOUT ET METTRE À JOUR LA VISION",
    cancel_btn: "ANNULER",
    add_exp: "Ajouter une expérience",
    add_cert: "Ajouter un certificat",
    sync: "Synchronisation des données...",
    saving: "TRAITEMENT EN COURS..."
  }
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("TR");
  const t = translations[lang];

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
    work_experience: [],
    certificates: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }
      setMe(session.user);

      const { data: p, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
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
          work_experience: p.cv_data?.work_experience || [],
          certificates: p.cv_data?.certificates || [],
        });
      }
    } catch (err) { console.error("Yükleme hatası:", err); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!me?.id) { toast.error("Oturum bilgisi bulunamadı"); return; }
    setSaving(true);
    const finalSector = formData.sector === "Diğer" ? formData.custom_sector : formData.sector;
    const finalTitle = formData.title === "Diğer" ? formData.custom_title : formData.title;
    
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        email: formData.email || me.email,
        full_name: formData.full_name,
        city: formData.city,
        phone: `${formData.phone_code} ${formData.phone_number}`,
        sector: finalSector,
        title: finalTitle,
        cv_data: {
          career_goals: formData.career_goals,
          work_experience: formData.work_experience,
          certificates: formData.certificates,
        },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success("Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { toast.error("Hata: " + e.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse text-2xl italic uppercase">{t.sync}</div>;

  return (
    <div className={`bg-[#f8fafc] min-h-screen font-sans pb-20 ${lang === 'AR' ? 'text-right' : 'text-left'}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      
      {/* NAVBAR */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="font-black italic text-xl text-rose-600 tracking-tighter uppercase">Kariyeer</div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-xs uppercase italic border border-slate-200">
              <Globe size={14} className="text-rose-500" /> {lang} <ChevronDown size={14}/>
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white shadow-2xl rounded-2xl border p-2 z-[70] min-w-[120px]">
              {Object.keys(translations).map(l => (
                <button key={l} onClick={() => setLang(l)} className="block w-full text-left px-4 py-2 hover:bg-rose-50 rounded-lg font-bold text-[10px] uppercase">
                   {l === 'TR' ? '🇹🇷 TR' : l === 'EN' ? '🇺🇸 EN' : l === 'AR' ? '🇸🇦 AR' : '🇫🇷 FR'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb923c] py-16 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block backdrop-blur-sm italic">{t.verified}</span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">{formData.full_name || "İSİMSİZ KULLANICI"}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-bold uppercase italic">
                <Briefcase size={14}/> {formData.sector === "Diğer" ? formData.custom_sector : formData.sector || "SEKTÖR"}
              </span>
              <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-bold uppercase italic">
                <Target size={14}/> {lang === 'TR' ? 'Hedef' : 'Target'}: {formData.career_goals.target_title || "..."}
              </span>
            </div>
          </div>
          <Button onClick={() => setEditOpen(true)} className="bg-white text-rose-600 hover:bg-rose-50 rounded-2xl h-14 px-10 font-black shadow-xl uppercase italic">
            <Pencil size={18} className="mr-2" /> {t.edit_btn}
          </Button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><Target size={24} /></div>
               {t.vision_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-black text-rose-500 uppercase mb-2">{t.vision_sub}</h4>
                  <p className="text-slate-700 font-medium italic">"{formData.career_goals.vision || "..."}"</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-500 uppercase mb-2">{t.action_plan}</h4>
                  <p className="text-slate-600 text-sm font-semibold bg-slate-50 p-4 rounded-2xl border-l-4 border-orange-400">
                    {formData.career_goals.short_term_plan || "..."}
                  </p>
                </div>
             </div>
          </section>
          
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center"><History size={24} /></div>
               {t.exp_title}
             </h2>
             <div className="space-y-8">
               {formData.work_experience.map((work, i) => (
                 <div key={i} className={`border-l-2 border-rose-500 ${lang === 'AR' ? 'pr-6 border-l-0 border-r-2' : 'pl-6'}`}>
                   <h3 className="text-xl font-black italic uppercase">{work.role}</h3>
                   <p className="text-slate-500 font-bold uppercase text-sm">{work.company} • {work.start} - {work.end}</p>
                   <p className="text-slate-600 mt-2">{work.description}</p>
                 </div>
               ))}
             </div>
          </section>

          {formData.certificates.length > 0 && (
            <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><Award size={24} /></div>
                {t.cert_title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {formData.certificates.map((cert, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h3 className="font-black text-slate-800 uppercase italic text-sm">{cert.name}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        <div className="lg:col-span-4">
           <Card className="rounded-[40px] bg-[#0f172a] text-white p-10 border-none shadow-2xl">
              <h3 className="text-xs font-black uppercase text-rose-500 italic mb-8 flex items-center gap-2"><MapPin size={14}/> {t.contact_title}</h3>
              <div className="space-y-6">
                <div><p className="text-[10px] text-slate-500 uppercase font-black">{t.email}</p><p className="font-bold italic">{formData.email}</p></div>
                <div><p className="text-[10px] text-slate-500 uppercase font-black">{t.phone}</p><p className="font-bold italic">{formData.phone_code} {formData.phone_number}</p></div>
                <div><p className="text-[10px] text-slate-500 uppercase font-black">{t.city}</p><p className="font-bold italic uppercase">{formData.city}</p></div>
              </div>
           </Card>
        </div>
      </main>

      {/* MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[50px] shadow-2xl animate-in zoom-in-95">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-10 border-b flex justify-between items-center z-20">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic">{t.modal_title}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase italic">{t.modal_sub}</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-14 h-14 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><X size={28}/></button>
            </div>

            <div className="p-12 space-y-12">
              <div className="grid md:grid-cols-2 gap-8 bg-rose-50 p-10 rounded-[40px] border border-rose-100">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-rose-400 ml-2">SEKTÖR</label>
                  <select value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic outline-none appearance-none bg-white">
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-rose-400 ml-2">UNVAN</label>
                  <select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic outline-none appearance-none bg-white">
                    {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-orange-50 p-10 rounded-[40px] space-y-6 border border-orange-100">
                <h3 className="text-xl font-black text-orange-700 uppercase italic flex items-center gap-2"><Lightbulb size={24}/> {t.vision_title}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input placeholder="HEDEF UNVAN" value={formData.career_goals.target_title} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_title: e.target.value}})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic text-black" />
                  <input placeholder="HEDEF SEKTÖR" value={formData.career_goals.target_sector} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_sector: e.target.value}})} className="w-full p-5 rounded-2xl border-none shadow-sm font-bold italic text-black" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic">{t.exp_title}</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start: "", end: "", description: ""}]})} variant="outline" className="text-rose-600 border-rose-200 rounded-xl font-black italic uppercase">{t.add_exp}</Button>
                </div>
                {formData.work_experience.map((work, i) => (
                  <div key={i} className="p-8 border-2 border-slate-100 rounded-[40px] relative bg-white shadow-xl space-y-6">
                    <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-8 right-8 text-red-400 hover:text-red-600"><Trash2 size={24} /></button>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input placeholder="Pozisyon" value={work.role} onChange={(e) => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold italic text-black" />
                      <input placeholder="Şirket" value={work.company} onChange={(e) => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold italic text-black" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8 border-t-2 border-slate-100 pt-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-2"><Award className="text-amber-500" size={24}/> {t.cert_title}</h3>
                  <Button onClick={() => setFormData({...formData, certificates: [...formData.certificates, {name: "", issuer: "", date: ""}]})} variant="outline" className="text-amber-600 border-amber-200 rounded-xl font-black italic uppercase">{t.add_cert}</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {formData.certificates.map((cert, i) => (
                    <div key={i} className="p-8 bg-amber-50/30 border-2 border-amber-100 rounded-[40px] relative space-y-4">
                      <button onClick={() => setFormData({...formData, certificates: formData.certificates.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-amber-400 hover:text-rose-600"><Trash2 size={20} /></button>
                      <input placeholder="SERTİFİKA ADI" value={cert.name} onChange={(e) => { const n = [...formData.certificates]; n[i].name = e.target.value; setFormData({...formData, certificates: n}); }} className="w-full p-4 rounded-2xl border-none shadow-sm font-bold italic text-black" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-10 border-t flex gap-6 z-20">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-[25px] h-20 text-xl font-black shadow-2xl uppercase italic">
                {saving ? t.saving : t.save_btn}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-20 px-12 rounded-[25px] font-black text-slate-400 uppercase italic">{t.cancel_btn}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
