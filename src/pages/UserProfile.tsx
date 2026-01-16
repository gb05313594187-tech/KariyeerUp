// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User, Building2, Pencil, History, X, Award, Briefcase, Trash2, Target, Lightbulb, MapPin, ChevronDown, Globe, GraduationCap, Calendar, Languages, Cpu, Heart, CheckCircle2, Star, Rocket
} from "lucide-react";

const SECTORS = ["Yazılım", "Sağlık", "Eğitim", "Finans", "Pazarlama", "Üretim", "E-Ticaret", "Diğer"];
const LANGUAGES_LIST = ["Türkçe", "English", "Deutsch", "Français", "العربية", "Español", "Italiano"];

const TECH_SKILLS_POOL = ["Java", "Python", "React", "Tableau", "Agile", "Scrum", "SQL", "AWS", "Docker", "Node.js", "SAP", "Salesforce", "Project Management", "UI/UX Design", "Kotlin", "Swift", "C#", "Machine Learning", "Kubernetes", "Power BI", "Go", "Figma", "Excel", "AutoCAD"];

const HOBBIES_DATA = {
  TR: ["Yüzme", "Satranç", "Kampçılık", "Fotoğrafçılık", "Yelken", "Tenis", "Yoga", "Binicilik", "Dağcılık", "Gastronomi", "Gitar", "Piyano", "Resim", "Bahçecilik", "Koşu", "Bisiklet", "E-Spor", "Seyahat", "Okçuluk", "Dalış", "Kodlama", "Podcast", "Gönüllülük", "Astronomi", "Balerin", "Tiyatro", "Koleksiyonculuk", "Felsefe", "Meditasyon", "Kitesurf"],
  EN: ["Swimming", "Chess", "Camping", "Photography", "Sailing", "Tennis", "Yoga", "Horse Riding", "Hiking", "Gastronomy", "Guitar", "Piano", "Painting", "Gardening", "Running", "Cycling", "E-Sports", "Traveling", "Archery", "Diving", "Coding", "Podcasting", "Volunteering", "Astronomy", "Ballet", "Theater", "Collecting", "Philosophy", "Meditation", "Kitesurfing"],
  AR: ["السباحة", "الشطرنج", "التخييم", "التصوير", "الإبحار", "التنس", "اليوجا", "ركوب الخيل", "التنزه", "فن الطهي", "الغيتار", "البيانو", "الرسم", "البستنة", "الجري", "ركوب الدراجات", "الرياضات الإلكترونية", "السفر", "الرماية", "الغوص", "البرمجة", "البودكاست", "التطوع", "علم الفلك", "الباليه", "المسرح", "الجمع", "الفلسفة", "التأمل", "التزلج الشراعي"],
  FR: ["Natation", "Échecs", "Camping", "Photographie", "Voile", "Tennis", "Yoga", "Équitation", "Randonnée", "Gastronomie", "Guitare", "Piano", "Peinture", "Jardinage", "Course", "Cyclisme", "E-Sports", "Voyage", "Tir à l'arc", "Plongée", "Codage", "Podcast", "Bénévolat", "Astronomie", "Ballet", "Théâtre", "Collection", "Philosophie", "Méditation", "Kitesurf"]
};

const translations = {
  TR: {
    verified: "VERIFIED CAREER STRATEGY PROFILE",
    edit_btn: "Profili Düzenle",
    vision_title: "Kariyer Hedefleri & Vizyon",
    vision_sub: "Gelecek Vizyonu",
    action_plan: "Kısa Vadeli Aksiyon",
    achievements_title: "Başarılarım & Kilometre Taşları",
    exp_title: "İş Deneyimi",
    edu_title: "Eğitim Bilgileri",
    cert_title: "Sertifikalar",
    lang_title: "Dil Yetkinliği",
    skill_title: "Teknik Yetkinlikler",
    hobbies_title: "İlgi Alanları & Hobiler",
    contact_title: "İletişim",
    modal_title: "Profil Mimarı",
    save_btn: "TÜM DEĞİŞİKLİKLERİ KAYDET",
    add_exp: "Yeni Deneyim Ekle",
    add_edu: "Yeni Okul Ekle",
    add_cert: "Yeni Sertifika Ekle",
    add_lang: "Yeni Dil Ekle",
    cancel: "Vazgeç",
    start_date: "Başlangıç Tarihi",
    end_date: "Bitiş Tarihi",
    present: "Devam Ediyor",
    school_name: "Okul Adı",
    degree: "Bölüm / Derece",
    company: "Şirket",
    role: "Pozisyon",
    reading: "Okuma",
    writing: "Yazma",
    speaking: "Konuşma",
    levels: ["Az", "Orta", "İyi", "Çok İyi", "Anadil"]
  },
  EN: {
    verified: "VERIFIED CAREER STRATEGY PROFILE",
    edit_btn: "Edit Profile",
    vision_title: "Career Goals & Vision",
    vision_sub: "Future Vision",
    action_plan: "Short-Term Action",
    achievements_title: "Achievements & Milestones",
    exp_title: "Work Experience",
    edu_title: "Education",
    cert_title: "Certificates",
    lang_title: "Language Skills",
    skill_title: "Technical Skills",
    hobbies_title: "Interests & Hobbies",
    contact_title: "Contact",
    modal_title: "Profile Architect",
    save_btn: "SAVE ALL CHANGES",
    add_exp: "Add Experience",
    add_edu: "Add Education",
    add_cert: "Add Certificate",
    add_lang: "Add Language",
    cancel: "Cancel",
    start_date: "Start Date",
    end_date: "End Date",
    present: "Present",
    school_name: "School Name",
    degree: "Degree",
    company: "Company",
    role: "Role",
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
    levels: ["Beginner", "Intermediate", "Good", "Fluent", "Native"]
  },
  AR: {
    verified: "ملف استراتيجية المهنة المعتمد",
    edit_btn: "تعديل الملف الشخصي",
    vision_title: "أهداف المهنة والرؤية",
    vision_sub: "رؤية مستقبلية",
    action_plan: "خطة عمل قصيرة المدى",
    achievements_title: "الإنجازات والنجاحات",
    exp_title: "خبرة في العمل",
    edu_title: "معلومات التعليم",
    cert_title: "شهادات",
    lang_title: "اللغات",
    skill_title: "المهارات التقنية",
    hobbies_title: "الهوايات والاهتمامات",
    contact_title: "اتصال",
    modal_title: "مهندس الملف الشخصي",
    save_btn: "حفظ جميع التغييرات",
    add_exp: "أضف تجربة جديدة",
    add_edu: "أضف مدرسة جديدة",
    add_cert: "أضف شهادة جديدة",
    add_lang: "إضافة لغة",
    cancel: "إلغاء",
    start_date: "تاريخ البدء",
    end_date: "تاريخ الانتهاء",
    present: "مستمر",
    school_name: "اسم المدرسة",
    degree: "الدرجة العلمية",
    company: "شركة",
    role: "دور",
    reading: "قراءة",
    writing: "كتابة",
    speaking: "تحدث",
    levels: ["ضعيف", "متوسط", "جيد", "جيد جداً", "اللغة الأم"]
  },
  FR: {
    verified: "PROFIL DE STRATÉGIE DE CARRIÈRE VÉRIFIÉ",
    edit_btn: "Modifier le profil",
    vision_title: "Objectifs de carrière et vision",
    vision_sub: "Vision d'avenir",
    action_plan: "Action à court terme",
    achievements_title: "Réalisations & Jalons",
    exp_title: "Expérience professionnelle",
    edu_title: "Éducation",
    cert_title: "Certificats",
    lang_title: "Langues",
    skill_title: "Compétences Techniques",
    hobbies_title: "Loisirs & Intérêts",
    contact_title: "Contact",
    modal_title: "Architecte de profil",
    save_btn: "ENREGISTRER TOUT",
    add_exp: "Ajouter une expérience",
    add_edu: "Ajouter une école",
    add_cert: "Ajouter un certificat",
    add_lang: "Ajouter une langue",
    cancel: "Annuler",
    start_date: "Date de début",
    end_date: "Date de fin",
    present: "Actuel",
    school_name: "Nom de l'école",
    degree: "Diplôme",
    company: "Entreprise",
    role: "Poste",
    reading: "Lire",
    writing: "Écrire",
    speaking: "Parler",
    levels: ["Débutant", "Intermédiaire", "Bien", "Très Bien", "Langue Maternelle"]
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
    phone_number: "",
    sector: "",
    title: "",
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    achievements: [],
    work_experience: [],
    education: [],
    certificates: [],
    languages: [],
    skills: [],
    hobbies_indices: []
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }
      setMe(session.user);

      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (p) {
        setFormData({
          full_name: p.full_name || "",
          email: p.email || session.user.email || "",
          city: p.city || "",
          phone_number: p.phone || "",
          sector: p.sector || "",
          title: p.title || "",
          career_goals: p.cv_data?.career_goals || { target_title: "", vision: "", short_term_plan: "" },
          achievements: p.cv_data?.achievements || [],
          work_experience: p.cv_data?.work_experience || [],
          education: p.cv_data?.education || [],
          certificates: p.cv_data?.certificates || [],
          languages: p.cv_data?.languages || [],
          skills: p.cv_data?.skills || [],
          hobbies_indices: p.cv_data?.hobbies_indices || []
        });
      }
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: me.id,
        full_name: formData.full_name,
        city: formData.city,
        phone: formData.phone_number,
        sector: formData.sector,
        title: formData.title,
        cv_data: {
          career_goals: formData.career_goals,
          achievements: formData.achievements,
          work_experience: formData.work_experience,
          education: formData.education,
          certificates: formData.certificates,
          languages: formData.languages,
          skills: formData.skills,
          hobbies_indices: formData.hobbies_indices
        },
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { toast.error("Hata: " + e.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse italic">SYNCING...</div>;

  return (
    <div className={`bg-[#f8fafc] min-h-screen font-sans pb-20 ${lang === 'AR' ? 'text-right' : 'text-left'}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      {/* NAVBAR */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="font-black italic text-xl text-rose-600 uppercase">Kariyeer</div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-xs uppercase italic">
              <Globe size={14} className="text-rose-500" /> {lang} <ChevronDown size={14}/>
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white shadow-2xl rounded-2xl border p-2 z-[70] min-w-[120px]">
              {Object.keys(translations).map(l => (
                <button key={l} onClick={() => setLang(l)} className="block w-full text-left px-4 py-2 hover:bg-rose-50 rounded-lg font-bold text-[10px] uppercase">{l}</button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb923c] py-16 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block italic">{t.verified}</span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">{formData.full_name || "---"}</h1>
            <div className="flex flex-wrap gap-4">
               <span className="bg-black/20 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase italic flex items-center gap-2">
                 <Briefcase size={14}/> {formData.sector || "---"}
               </span>
               <span className="bg-black/20 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase italic flex items-center gap-2">
                 <Target size={14}/> {formData.career_goals.target_title || "---"}
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
          
          {/* KARİYER HEDEFLERİ & VİZYON */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><Target size={24} /></div>
               {t.vision_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div><h4 className="text-xs font-black text-rose-500 uppercase mb-2">{t.vision_sub}</h4><p className="italic font-medium text-slate-700">"{formData.career_goals.vision || "..."}"</p></div>
                <div><h4 className="text-xs font-black text-rose-500 uppercase mb-2">{t.action_plan}</h4><p className="bg-slate-50 p-4 rounded-2xl border-l-4 border-orange-400 font-semibold text-slate-600">{formData.career_goals.short_term_plan || "..."}</p></div>
             </div>
          </section>

          {/* BAŞARILARIM (YENİ) */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center"><Star size={24} /></div>
               {t.achievements_title}
             </h2>
             <div className="grid gap-4">
               {formData.achievements.length > 0 ? formData.achievements.map((ach, i) => (
                 <div key={i} className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-yellow-500 font-bold">{i+1}</div>
                    <p className="font-bold text-slate-700 italic">{ach}</p>
                 </div>
               )) : <p className="text-slate-400 italic font-medium px-4">Henüz başarı eklenmemiş...</p>}
             </div>
          </section>

          {/* İŞ DENEYİMİ */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center"><History size={24} /></div>
               {t.exp_title}
             </h2>
             <div className="space-y-8">
               {formData.work_experience.map((work, i) => (
                 <div key={i} className="border-l-2 border-rose-500 pl-6 relative">
                   <h3 className="text-xl font-black italic uppercase text-slate-800">{work.role}</h3>
                   <p className="text-slate-500 font-bold uppercase text-xs flex items-center gap-2">
                     <Building2 size={12}/> {work.company} • <Calendar size={12}/> {work.start_date} / {work.end_date || t.present}
                   </p>
                   <p className="text-slate-600 mt-3 text-sm leading-relaxed">{work.description}</p>
                 </div>
               ))}
             </div>
          </section>

          {/* DİL YETKİNLİĞİ (DAHA BÜYÜK VE GÖRSEL) */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Languages size={24} /></div>
               {t.lang_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-8">
               {formData.languages.map((l, i) => (
                 <div key={i} className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase italic flex justify-between">
                      {l.name}
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{t.levels[l.speaking_idx]}</span>
                    </h3>
                    <div className="space-y-4">
                      {[ {lab: t.reading, val: l.reading_idx}, {lab: t.writing, val: l.writing_idx}, {lab: t.speaking, val: l.speaking_idx} ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">
                            <span>{item.lab}</span>
                            <span>{t.levels[item.val]}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(item.val + 1) * 20}%`}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </section>

          {/* TEKNİK YETKİNLİKLER */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><Cpu size={24} /></div>
               {t.skill_title}
             </h2>
             <div className="flex flex-wrap gap-3">
               {formData.skills.map((skill, i) => (
                 <span key={i} className="bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl font-black text-xs uppercase italic border border-indigo-100 flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                   <CheckCircle2 size={14}/> {skill}
                 </span>
               ))}
             </div>
          </section>

          {/* HOBİLER */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center"><Heart size={24} /></div>
               {t.hobbies_title}
             </h2>
             <div className="flex flex-wrap gap-2">
               {formData.hobbies_indices.map((idx) => (
                 <span key={idx} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold text-[10px] uppercase italic">
                   # {HOBBIES_DATA[lang][idx]}
                 </span>
               ))}
             </div>
          </section>

          {/* EĞİTİM */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><GraduationCap size={24} /></div>
               {t.edu_title}
             </h2>
             <div className="space-y-8">
               {formData.education.map((edu, i) => (
                 <div key={i} className="border-l-2 border-blue-500 pl-6">
                   <h3 className="text-xl font-black italic uppercase text-slate-800">{edu.school}</h3>
                   <p className="text-slate-500 font-bold uppercase text-xs flex items-center gap-2">
                     {edu.degree} • <Calendar size={12}/> {edu.start_date} / {edu.end_date || t.present}
                   </p>
                 </div>
               ))}
             </div>
          </section>
        </div>

        {/* SAĞ TARAF - İLETİŞİM */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="rounded-[40px] bg-[#0f172a] text-white p-10 border-none shadow-2xl sticky top-28">
              <h3 className="text-xs font-black uppercase text-rose-500 italic mb-8 flex items-center gap-2"><MapPin size={14}/> {t.contact_title}</h3>
              <div className="space-y-6">
                <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">E-posta</p><p className="font-bold italic text-sm">{formData.email}</p></div>
                <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Telefon</p><p className="font-bold italic text-sm">{formData.phone_number}</p></div>
                <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Şehir</p><p className="font-bold italic text-sm uppercase">{formData.city}</p></div>
              </div>
           </Card>
        </div>
      </main>

      {/* MODAL: PROFİL MİMARI */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[50px] shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-10 border-b flex justify-between items-center z-20">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">{t.modal_title}</h2>
              <button onClick={() => setEditOpen(false)} className="w-14 h-14 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><X size={28}/></button>
            </div>

            <div className="p-12 space-y-16">
              
              {/* KARİYER HEDEFLERİ DÜZENLEME (YENİ) */}
              <div className="space-y-6 bg-orange-50/50 p-8 rounded-[40px] border border-orange-100">
                 <h3 className="text-xl font-black uppercase italic text-orange-700 flex items-center gap-3"><Target size={20}/> {t.vision_title}</h3>
                 <div className="grid gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-orange-600 ml-2">Hedef Pozisyon</label>
                     <input value={formData.career_goals.target_title} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_title: e.target.value}})} className="w-full p-5 rounded-2xl border-none font-bold text-black" placeholder="Örn: Senior Software Architect" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-orange-600 ml-2">{t.vision_sub}</label>
                     <textarea value={formData.career_goals.vision} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, vision: e.target.value}})} className="w-full p-5 rounded-2xl border-none font-bold italic text-black min-h-[100px]" placeholder="Uzun vadeli vizyonunuz..." />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-orange-600 ml-2">{t.action_plan}</label>
                     <textarea value={formData.career_goals.short_term_plan} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, short_term_plan: e.target.value}})} className="w-full p-5 rounded-2xl border-none font-bold italic text-black min-h-[100px]" placeholder="Gelecek 1 yıl içindeki planınız..." />
                   </div>
                 </div>
              </div>

              {/* BAŞARILAR DÜZENLEME (YENİ) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 border-l-4 border-yellow-500 pl-4">{t.achievements_title}</h3>
                  <Button onClick={() => setFormData({...formData, achievements: [...formData.achievements, ""]})} variant="outline" className="text-yellow-600 border-yellow-200 rounded-xl font-black uppercase">Ekle</Button>
                </div>
                <div className="space-y-3">
                  {formData.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={ach} onChange={(e) => { const n = [...formData.achievements]; n[i] = e.target.value; setFormData({...formData, achievements: n}); }} className="flex-1 p-4 bg-slate-50 rounded-xl font-bold italic text-black" placeholder="Bir başaranızı yazın..." />
                      <button onClick={() => setFormData({...formData, achievements: formData.achievements.filter((_, idx) => idx !== i)})} className="text-red-400 p-2"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DİLLER (DAHA BÜYÜK MODAL TASARIMI) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 border-l-4 border-emerald-500 pl-4">{t.lang_title}</h3>
                  <Button onClick={() => setFormData({...formData, languages: [...formData.languages, {name: "English", reading_idx: 1, writing_idx: 1, speaking_idx: 1}]})} variant="outline" className="text-emerald-600 border-emerald-200 rounded-xl font-black uppercase">{t.add_lang}</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-8 border-2 border-slate-100 rounded-[40px] relative bg-white shadow-xl space-y-6">
                      <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="absolute -top-3 -right-3 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                      <select value={l.name} onChange={(e) => { const n = [...formData.languages]; n[i].name = e.target.value; setFormData({...formData, languages: n}); }} className="w-full p-4 bg-slate-50 rounded-xl font-black italic text-black text-lg">
                        {LANGUAGES_LIST.map(langName => <option key={langName} value={langName}>{langName}</option>)}
                      </select>
                      {['reading_idx', 'writing_idx', 'speaking_idx'].map((key) => (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t[key.replace('_idx', '')]}</label>
                          <div className="flex gap-1">
                            {t.levels.map((lvl, idx) => (
                              <button key={idx} onClick={() => { const n = [...formData.languages]; n[i][key] = idx; setFormData({...formData, languages: n}); }} className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${l[key] === idx ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* İŞ DENEYİMİ */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 border-l-4 border-rose-500 pl-4">{t.exp_title}</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start_date: "", end_date: "", description: ""}]})} variant="outline" className="text-rose-600 border-rose-200 rounded-xl font-black uppercase">{t.add_exp}</Button>
                </div>
                {formData.work_experience.map((work, i) => (
                  <div key={i} className="p-8 border-2 border-slate-100 rounded-[40px] relative space-y-6">
                    <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-8 right-8 text-red-400"><Trash2 size={24} /></button>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input placeholder={t.role} value={work.role} onChange={(e) => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold italic border-none text-black" />
                      <input placeholder={t.company} value={work.company} onChange={(e) => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold italic border-none text-black" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input type="date" value={work.start_date} onChange={(e) => { const n = [...formData.work_experience]; n[i].start_date = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold border-none text-black" />
                      <input type="date" value={work.end_date} onChange={(e) => { const n = [...formData.work_experience]; n[i].end_date = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold border-none text-black" />
                    </div>
                    <textarea placeholder="Detaylar..." value={work.description} onChange={(e) => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-5 bg-slate-50 rounded-2xl font-bold italic border-none min-h-[120px] text-black" />
                  </div>
                ))}
              </div>

              {/* YETENEKLER & HOBİLER (AYNI KALDI) */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 border-l-4 border-indigo-500 pl-4">{t.skill_title}</h3>
                  <div className="flex flex-wrap gap-2 bg-slate-50 p-6 rounded-3xl">
                    {TECH_SKILLS_POOL.map(s => (
                      <button key={s} onClick={() => {
                        const exists = formData.skills.includes(s);
                        setFormData({...formData, skills: exists ? formData.skills.filter(x => x !== s) : [...formData.skills, s]});
                      }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.skills.includes(s) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 border-l-4 border-rose-500 pl-4">{t.hobbies_title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-50 p-6 rounded-3xl">
                    {HOBBIES_DATA[lang].map((hobby, idx) => (
                      <button key={idx} onClick={() => {
                        const exists = formData.hobbies_indices.includes(idx);
                        setFormData({...formData, hobbies_indices: exists ? formData.hobbies_indices.filter(x => x !== idx) : [...formData.hobbies_indices, idx]});
                      }} className={`p-3 rounded-xl text-[9px] font-bold uppercase transition-all ${formData.hobbies_indices.includes(idx) ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'}`}>
                        {hobby}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* EĞİTİM (AYNI KALDI) */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 border-l-4 border-blue-500 pl-4">{t.edu_title}</h3>
                  <Button onClick={() => setFormData({...formData, education: [...formData.education, {school: "", degree: "", start_date: "", end_date: ""}]})} variant="outline" className="text-blue-600 border-blue-200 rounded-xl font-black uppercase">{t.add_edu}</Button>
                </div>
                {formData.education.map((edu, i) => (
                  <div key={i} className="p-8 border-2 border-slate-100 rounded-[40px] relative space-y-6">
                    <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute top-8 right-8 text-red-400"><Trash2 size={24} /></button>
                    <input placeholder={t.school_name} value={edu.school} onChange={(e) => { const n = [...formData.education]; n[i].school = e.target.value; setFormData({...formData, education: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold italic w-full text-black" />
                    <input placeholder={t.degree} value={edu.degree} onChange={(e) => { const n = [...formData.education]; n[i].degree = e.target.value; setFormData({...formData, education: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold italic w-full text-black" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <input type="date" value={edu.start_date} onChange={(e) => { const n = [...formData.education]; n[i].start_date = e.target.value; setFormData({...formData, education: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold text-black" />
                      <input type="date" value={edu.end_date} onChange={(e) => { const n = [...formData.education]; n[i].end_date = e.target.value; setFormData({...formData, education: n}); }} className="p-5 bg-slate-50 rounded-2xl font-bold text-black" />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-10 border-t flex gap-6 z-20">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-[25px] h-20 text-xl font-black shadow-2xl uppercase italic">
                {saving ? "SAVING..." : t.save_btn}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-20 px-12 rounded-[25px] font-black text-slate-400 uppercase italic">{t.cancel}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
