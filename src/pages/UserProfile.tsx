// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User, Building2, Pencil, History, X, Award, Briefcase, Trash2, Target, Lightbulb, MapPin, ChevronDown, Globe, GraduationCap, Calendar, Languages, Cpu, Heart, CheckCircle2, Star, Rocket, Palette, Video, BarChart3, FileSpreadsheet, Monitor, Presentation, PenTool, Layout, Linkedin, Github, Instagram, Link
} from "lucide-react";

// GENİŞLETİLMİŞ VE EKSİKSİZ TEKNİK YETENEK HAVUZU
const TECH_SKILLS_POOL = [
  "Java", "Python", "React", "Tableau", "Agile", "Scrum", "SQL", "AWS", "Docker", "Node.js", "SAP", "Salesforce", "Project Management", "UI/UX Design", "Kotlin", "Swift", "C#", "Machine Learning", "Kubernetes", "Go", "Figma", "AutoCAD",
  "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Word", "Microsoft Outlook", "Microsoft Teams", "Power BI",
  "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Adobe After Effects", "Adobe InDesign", "Adobe Lightroom",
  "Canva", "CapCut", "InShot", "DaVinci Resolve", "Final Cut Pro", "CorelDraw", "Sketch", "WordPress", "Google Analytics"
];

// 4 DİLDE TAM SENKRONİZE GENİŞ HOBİ LİSTESİ
const HOBBIES_DATA = {
  TR: ["Yüzme", "Satranç", "Kampçılık", "Fotoğrafçılık", "Yelken", "Tenis", "Yoga", "Binicilik", "Dağcılık", "Gastronomi", "Gitar", "Piyano", "Resim", "Bahçecilik", "Koşu", "Bisiklet", "E-Spor", "Seyahat", "Okçuluk", "Dalış", "Kodlama", "Podcast", "Gönüllülük", "Astronomi", "Balerin", "Tiyatro", "Koleksiyonculuk", "Felsefe", "Meditasyon", "Kitesurf", "Yemek Yapma", "Blog Yazarlığı", "Crossfit", "Model Uçak", "Ahşap İşçiliği"],
  EN: ["Swimming", "Chess", "Camping", "Photography", "Sailing", "Tennis", "Yoga", "Horse Riding", "Hiking", "Gastronomy", "Guitar", "Piano", "Painting", "Gardening", "Running", "Cycling", "E-Sports", "Traveling", "Archery", "Diving", "Coding", "Podcasting", "Volunteering", "Astronomy", "Ballet", "Theater", "Collecting", "Philosophy", "Meditation", "Kitesurfing", "Cooking", "Blogging", "Crossfit", "Model Aircraft", "Woodworking"],
  AR: ["السباحة", "الشطرنج", "التخييم", "التصوير", "الإبحار", "التنس", "اليوجا", "ركوب الخيل", "التنزه", "فن الطهي", "الغيتار", "البيانو", "الرسم", "البستنة", "الجري", "ركوب الدراجات", "الرياضات الإلكترونية", "السفر", "الرماية", "الغوص", "البرمجة", "البودكاست", "التطوع", "علم الفلك", "الباليه", "المسرح", "الجمع", "الفلسفة", "التأمل", "التزلج الشراعي", "الطبخ", "التدوين", "كروس فيت", "طائرة نموذجية", "النجارة"],
  FR: ["Natation", "Échecs", "Camping", "Photographie", "Voile", "Tennis", "Yoga", "Équitation", "Randonnée", "Gastronomie", "Guitare", "Piano", "Peinture", "Jardinage", "Course", "Cyclisme", "E-Sports", "Voyage", "Tir à l'arc", "Plongée", "Codage", "Podcast", "Bénévolat", "Astronomie", "Ballet", "Théâtre", "Collection", "Philosophie", "Méditation", "Kitesurf", "Cuisine", "Bloguer", "Crossfit", "Modélisme", "Travail du bois"]
};

const translations = {
  TR: {
    verified: "VERIFIED CAREER STRATEGY PROFILE",
    edit_btn: "Profili Düzenle",
    vision_title: "Kariyer Hedefleri & Vizyon",
    target_pos: "Hedef Pozisyon",
    vision_sub: "Gelecek Vizyonu",
    action_plan: "Kısa Vadeli Aksiyon",
    achievements_title: "Başarılarım & Kilometre Taşları",
    exp_title: "İş Deneyimi",
    edu_title: "Eğitim Bilgileri",
    lang_title: "Dil Yetkinliği",
    skill_title: "Teknik Yetkinlikler",
    hobbies_title: "İlgi Alanları & Hobiler",
    contact_title: "İletişim",
    modal_title: "Profil Mimarı",
    save_btn: "TÜM DEĞİŞİKLİKLERİ KAYDET",
    add_exp: "Yeni Deneyim Ekle",
    add_edu: "Yeni Okul Ekle",
    add_lang: "Yeni Dil Ekle",
    cancel: "Vazgeç",
    start_date: "Başlangıç Tarihi",
    end_date: "Bitiş Tarihi",
    present: "Devam Ediyor",
    reading: "Okuma",
    writing: "Yazma",
    speaking: "Konuşma",
    social_title: "Sosyal Medya",
    avatar_prompt: "Profil Fotoğrafı URL'si giriniz:",
    levels: ["Az", "Orta", "İyi", "Çok İyi", "Anadil"]
  },
  EN: {
    verified: "VERIFIED CAREER STRATEGY PROFILE",
    edit_btn: "Edit Profile",
    vision_title: "Career Goals & Vision",
    target_pos: "Target Position",
    vision_sub: "Future Vision",
    action_plan: "Short-Term Action",
    achievements_title: "Achievements & Milestones",
    exp_title: "Work Experience",
    edu_title: "Education",
    lang_title: "Language Skills",
    skill_title: "Technical Skills",
    hobbies_title: "Interests & Hobbies",
    contact_title: "Contact",
    modal_title: "Profile Architect",
    save_btn: "SAVE ALL CHANGES",
    add_exp: "Add Experience",
    add_edu: "Add Education",
    add_lang: "Add Language",
    cancel: "Cancel",
    start_date: "Start Date",
    end_date: "End Date",
    present: "Present",
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
    social_title: "Social Media",
    avatar_prompt: "Enter Profile Photo URL:",
    levels: ["Beginner", "Intermediate", "Good", "Fluent", "Native"]
  },
  AR: {
    verified: "ملف استراتيجية المهنة المعتمد",
    edit_btn: "تعديل الملف الشخصي",
    vision_title: "أهداف المهنة والرؤية",
    target_pos: "المنصب المستهدف",
    vision_sub: "رؤية مستقبلية",
    action_plan: "خطة عمل قصيرة المدى",
    achievements_title: "الإنجازات والنجاحات",
    exp_title: "خبرة في العمل",
    edu_title: "معلومات التعليم",
    lang_title: "اللغات",
    skill_title: "المهارات التقنية",
    hobbies_title: "الهوايات والاهتمامات",
    contact_title: "اتصال",
    modal_title: "مهندس الملف الشخصي",
    save_btn: "حفظ جميع التغييرات",
    add_exp: "أضف تجربة جديدة",
    add_edu: "أضف مدرسة جديدة",
    add_lang: "إضافة لغة",
    cancel: "إلغاء",
    start_date: "تاريخ البدء",
    end_date: "تاريخ الانتهاء",
    present: "مستمر",
    reading: "قراءة",
    writing: "كتابة",
    speaking: "تحدث",
    social_title: "وسائل التواصل الاجتماعي",
    avatar_prompt: "أدخل رابط الصورة الشخصية:",
    levels: ["ضعيف", "متوسط", "جيد", "جيد جداً", "اللغة الأم"]
  },
  FR: {
    verified: "PROFIL DE STRATÉGIE DE CARRIÈRE VÉRIFIÉ",
    edit_btn: "Modifier le profil",
    vision_title: "Objectifs de carrière et vision",
    target_pos: "Poste Cible",
    vision_sub: "Vision d'avenir",
    action_plan: "Action à court terme",
    achievements_title: "Réalisations & Jalons",
    exp_title: "Expérience professionnelle",
    edu_title: "Éducation",
    lang_title: "Langues",
    skill_title: "Compétences Techniques",
    hobbies_title: "Loisirs & Intérêts",
    contact_title: "Contact",
    modal_title: "Architecte de profil",
    save_btn: "ENREGISTRER TOUT",
    add_exp: "Ajouter une expérience",
    add_edu: "Ajouter une école",
    add_lang: "Ajouter une langue",
    cancel: "Annuler",
    start_date: "Date de début",
    end_date: "Date de fin",
    present: "Actuel",
    reading: "Lire",
    writing: "Écrire",
    speaking: "Parler",
    social_title: "Médias Sociaux",
    avatar_prompt: "Entrez l'URL de la photo de profil:",
    levels: ["Débutant", "Intermédiaire", "Bien", "Très Bien", "Maternelle"]
  }
};

const LANGUAGES_LIST = ["Türkçe", "English", "Deutsch", "Français", "العربية", "Español", "Italiano", "Pусский", "中文", "日本語"];

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
    avatar_url: "",
    social_links: { linkedin: "", github: "", instagram: "" },
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
          avatar_url: p.avatar_url || "",
          social_links: p.social_links || { linkedin: "", github: "", instagram: "" },
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
        avatar_url: formData.avatar_url,
        social_links: formData.social_links,
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
      toast.success("Profil Başarıyla Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) { toast.error("Hata Oluştu"); } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse italic text-2xl uppercase tracking-tighter">Syncing Career Data...</div>;

  return (
    <div className={`bg-[#f8fafc] min-h-screen font-sans pb-24 ${lang === 'AR' ? 'text-right' : 'text-left'}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b px-8 py-5 flex justify-between items-center sticky top-0 z-[60]">
        <div className="font-black italic text-2xl text-rose-600 uppercase tracking-tighter">Kariyeer</div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button className="flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-2xl font-black text-xs uppercase italic border border-slate-200 hover:bg-white transition-all shadow-sm">
              <Globe size={18} className="text-rose-500" /> {lang} <ChevronDown size={14}/>
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white shadow-2xl rounded-2xl border p-2 z-[70] min-w-[160px] animate-in fade-in zoom-in duration-200">
              {Object.keys(translations).map(l => (
                <button key={l} onClick={() => setLang(l)} className={`block w-full text-left px-5 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${lang === l ? 'bg-rose-500 text-white' : 'hover:bg-rose-50 text-slate-600'}`}>
                  {l === 'TR' ? 'Türkçe' : l === 'EN' ? 'English' : l === 'AR' ? 'العربية' : 'Français'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#e11d48] via-[#f43f5e] to-[#fb923c] py-24 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          
          {/* FOTOĞRAF KISMI */}
          <div className="relative group cursor-pointer" onClick={() => {
            const url = prompt(t.avatar_prompt, formData.avatar_url);
            if(url !== null) setFormData({...formData, avatar_url: url});
          }}>
            <div className="w-44 h-44 md:w-64 md:h-64 rounded-[50px] border-8 border-white/20 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-all duration-500">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-black/20 flex items-center justify-center text-white/50 backdrop-blur-md">
                   <User size={80} strokeWidth={1}/>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Pencil size={32} className="text-white" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-rose-600 px-4 py-1 rounded-full text-[9px] font-black uppercase shadow-xl border border-rose-100">Değiştir</div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="bg-white/20 px-6 py-2 rounded-full text-[11px] font-black uppercase backdrop-blur-xl italic border border-white/30 tracking-widest">{t.verified}</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">{formData.full_name || "İsim Soyisim"}</h1>
            <div className="flex flex-wrap gap-5 pt-4 justify-center md:justify-start">
               <span className="bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 text-[11px] font-black uppercase italic flex items-center gap-3">
                 <Briefcase size={16}/> {formData.sector || "SEKTÖR BELİRTİLMEDİ"}
               </span>
               <span className="bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 text-[11px] font-black uppercase italic flex items-center gap-3">
                 <Target size={16}/> {formData.career_goals.target_title || "HEDEF BELİRTİLMEDİ"}
               </span>
            </div>
          </div>
          <Button onClick={() => setEditOpen(true)} className="bg-white text-rose-600 hover:bg-rose-50 rounded-[35px] h-20 px-14 font-black shadow-2xl uppercase italic text-xl transition-all hover:scale-105 active:scale-95">
            <Pencil size={24} className="mr-3" /> {t.edit_btn}
          </Button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          
          {/* 1. KARİYER HEDEFLERİ & VİZYON */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -z-10 transition-all group-hover:w-40 group-hover:h-40"></div>
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic leading-none">
               <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-[25px] flex items-center justify-center shadow-inner"><Target size={34} /></div>
               {t.vision_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-5">
                  <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">{t.vision_sub}</h4>
                  <p className="italic font-bold text-slate-700 text-xl leading-relaxed">"{formData.career_goals.vision || "Gelecek vizyonunuzu profil mimarı üzerinden ekleyin..."}"</p>
                </div>
                <div className="space-y-5">
                  <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">{t.action_plan}</h4>
                  <div className="bg-slate-50 p-8 rounded-[35px] border-l-[10px] border-orange-400 font-black text-slate-600 leading-relaxed italic text-lg shadow-sm">
                    {formData.career_goals.short_term_plan || "Kısa vadeli planlarınızı buraya ekleyin..."}
                  </div>
                </div>
             </div>
          </section>

          {/* 2. BAŞARILARIM & KİLOMETRE TAŞLARI */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100">
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic">
               <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-[25px] flex items-center justify-center shadow-inner"><Star size={34} /></div>
               {t.achievements_title}
             </h2>
             <div className="grid gap-6">
               {formData.achievements.length > 0 ? formData.achievements.map((ach, i) => (
                 <div key={i} className="flex gap-6 items-center bg-slate-50 p-8 rounded-[35px] border border-slate-100 hover:border-yellow-300 transition-all group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-yellow-500 font-black italic text-2xl group-hover:scale-110 transition-transform">#{i+1}</div>
                    <p className="font-black text-slate-800 italic text-xl leading-snug">{ach}</p>
                 </div>
               )) : <p className="text-slate-400 italic font-black text-lg px-6">Henüz bir başarı girilmedi...</p>}
             </div>
          </section>

          {/* 3. EĞİTİM BİLGİLERİ */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100">
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[25px] flex items-center justify-center shadow-inner"><GraduationCap size={34} /></div>
               {t.edu_title}
             </h2>
             <div className="space-y-12">
               {formData.education.map((edu, i) => (
                 <div key={i} className="border-l-[6px] border-blue-500 pl-10 relative">
                   <h3 className="text-3xl font-black italic uppercase text-slate-900 mb-4 tracking-tighter">{edu.school}</h3>
                   <div className="flex flex-wrap gap-5 items-center">
                     <span className="bg-blue-50 text-blue-700 px-6 py-2 rounded-2xl font-black text-[11px] uppercase italic border border-blue-100">{edu.degree}</span>
                     <span className="text-slate-400 font-black text-[11px] uppercase flex items-center gap-2"><Calendar size={14}/> {edu.start_date} / {edu.end_date || t.present}</span>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* 4. İŞ DENEYİMİ */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100">
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic">
               <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-[25px] flex items-center justify-center shadow-inner"><History size={34} /></div>
               {t.exp_title}
             </h2>
             <div className="space-y-16">
               {formData.work_experience.map((work, i) => (
                 <div key={i} className="border-l-[6px] border-rose-500 pl-10">
                   <h3 className="text-3xl font-black italic uppercase text-slate-900 mb-3 tracking-tighter leading-none">{work.role}</h3>
                   <div className="flex flex-wrap gap-5 text-slate-400 font-black text-[11px] uppercase mb-6">
                     <span className="text-rose-600 flex items-center gap-2 border-b-2 border-rose-100 pb-1"><Building2 size={14}/> {work.company}</span>
                     <span className="flex items-center gap-2"><Calendar size={14}/> {work.start_date} / {work.end_date || t.present}</span>
                   </div>
                   <p className="text-slate-600 text-xl font-bold leading-relaxed italic opacity-90">"{work.description}"</p>
                 </div>
               ))}
             </div>
          </section>

          {/* 5. DİL YETKİNLİĞİ */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100">
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic">
               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[25px] flex items-center justify-center shadow-inner"><Languages size={34} /></div>
               {t.lang_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-12">
               {formData.languages.map((l, i) => (
                 <div key={i} className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-[45px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase italic flex justify-between items-center">
                      {l.name}
                      <span className="text-[11px] bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full uppercase tracking-tighter">{t.levels[l.speaking_idx]}</span>
                    </h3>
                    <div className="space-y-6">
                      {[ {lab: t.reading, val: l.reading_idx}, {lab: t.writing, val: l.writing_idx}, {lab: t.speaking, val: l.speaking_idx} ].map((item, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>{item.lab}</span>
                            <span className="text-emerald-600">{t.levels[item.val]}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-[1.5s]" style={{width: `${(item.val + 1) * 20}%`}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </section>

          {/* 6. TEKNİK YETKİNLİKLER */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100">
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic">
               <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-[25px] flex items-center justify-center shadow-inner"><Cpu size={34} /></div>
               {t.skill_title}
             </h2>
             <div className="flex flex-wrap gap-5">
               {formData.skills.map((skill, i) => (
                 <span key={i} className="bg-indigo-50 text-indigo-700 px-8 py-5 rounded-[25px] font-black text-xs uppercase italic border border-indigo-100 flex items-center gap-4 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                   {skill.includes("Adobe") ? <Palette size={18}/> : 
                    skill.includes("Microsoft") || skill.includes("Office") || skill.includes("Excel") ? <FileSpreadsheet size={18}/> : 
                    skill.includes("Video") || skill.includes("CapCut") || skill.includes("Premiere") ? <Video size={18}/> : 
                    skill.includes("Canva") || skill.includes("Figma") ? <PenTool size={18}/> : 
                    skill.includes("Power BI") || skill.includes("Analytics") ? <BarChart3 size={18}/> : 
                    <CheckCircle2 size={18}/>}
                   {skill}
                 </span>
               ))}
             </div>
          </section>

          {/* 7. İLGİ ALANLARI & HOBİLER */}
          <section className="bg-white rounded-[60px] p-14 shadow-sm border border-slate-100">
             <h2 className="text-4xl font-black mb-12 flex items-center gap-5 text-slate-800 uppercase italic">
               <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-[25px] flex items-center justify-center shadow-inner"><Heart size={34} /></div>
               {t.hobbies_title}
             </h2>
             <div className="flex flex-wrap gap-4">
               {formData.hobbies_indices.map((idx) => (
                 <span key={idx} className="bg-slate-100 text-slate-700 px-7 py-4 rounded-2xl font-black text-xs uppercase italic border border-slate-200 hover:bg-rose-500 hover:text-white transition-all cursor-default">
                   # {HOBBIES_DATA[lang][idx] || "Hobi"}
                 </span>
               ))}
             </div>
          </section>
        </div>

        {/* SAĞ TARAF - İLETİŞİM & SOSYAL MEDYA */}
        <div className="lg:col-span-4">
           <Card className="rounded-[60px] bg-[#0f172a] text-white p-14 border-none shadow-2xl sticky top-36 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>
              <h3 className="text-[11px] font-black uppercase text-rose-500 italic mb-12 flex items-center gap-4 tracking-[0.3em]"><MapPin size={20}/> {t.contact_title}</h3>
              
              <div className="space-y-10">
                <div className="group"><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3 group-hover:text-rose-400 transition-colors">E-posta</p><p className="font-black italic text-lg break-all">{formData.email}</p></div>
                <div className="group"><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3 group-hover:text-rose-400 transition-colors">Telefon</p><p className="font-black italic text-xl">{formData.phone_number || "Girilmedi"}</p></div>
                <div className="group"><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3 group-hover:text-rose-400 transition-colors">Şehir</p><p className="font-black italic text-2xl uppercase tracking-tighter">{formData.city || "Girilmedi"}</p></div>
              </div>

              {/* SOSYAL MEDYA LİNKLERİ */}
              <div className="mt-14 pt-10 border-t border-slate-800 space-y-8">
                 <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.social_title}</p>
                 <div className="flex flex-wrap gap-4">
                    <button onClick={() => {
                      const link = prompt("LinkedIn URL:", formData.social_links.linkedin);
                      if(link !== null) setFormData({...formData, social_links: {...formData.social_links, linkedin: link}});
                    }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${formData.social_links.linkedin ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}><Linkedin size={22}/></button>
                    
                    <button onClick={() => {
                      const link = prompt("GitHub URL:", formData.social_links.github);
                      if(link !== null) setFormData({...formData, social_links: {...formData.social_links, github: link}});
                    }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${formData.social_links.github ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}><Github size={22}/></button>
                    
                    <button onClick={() => {
                      const link = prompt("Instagram URL:", formData.social_links.instagram);
                      if(link !== null) setFormData({...formData, social_links: {...formData.social_links, instagram: link}});
                    }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${formData.social_links.instagram ? 'bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 text-white' : 'bg-slate-800 text-slate-500'}`}><Instagram size={22}/></button>
                 </div>
              </div>

              <div className="mt-16 pt-10 border-t border-slate-800">
                <p className="text-[9px] font-black text-slate-600 uppercase italic leading-relaxed">Bu profil Kariyeer Career Strategy Engine tarafından doğrulanmıştır.</p>
              </div>
           </Card>
        </div>
      </main>

      {/* MODAL: PROFİL MİMARI (TAM VE EKSİKSİZ) */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[96vh] overflow-y-auto rounded-[70px] shadow-2xl relative border border-white/20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-xl p-12 border-b flex justify-between items-center z-30">
              <div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{t.modal_title}</h2>
                <p className="text-slate-400 font-black text-[10px] uppercase mt-2 tracking-widest italic">Kariyer verilerinizi buradan güncelleyin</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-20 h-20 bg-slate-100 flex items-center justify-center rounded-[30px] hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90 shadow-sm"><X size={36}/></button>
            </div>

            <div className="p-16 space-y-24">
              
              {/* ANA BİLGİLER GÜNCELLEME */}
              <div className="grid md:grid-cols-2 gap-10 bg-slate-50 p-12 rounded-[55px]">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5">Ad Soyad</label>
                  <input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-6 rounded-[25px] border-none font-black text-xl shadow-inner focus:ring-2 ring-rose-500 outline-none" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-5">Sektör</label>
                  <input value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full p-6 rounded-[25px] border-none font-black text-xl shadow-inner focus:ring-2 ring-rose-500 outline-none" />
                </div>
              </div>

              {/* 1. KARİYER HEDEFLERİ MODAL */}
              <div className="space-y-10 bg-orange-50/50 p-12 rounded-[55px] border border-orange-100">
                 <h3 className="text-3xl font-black uppercase italic text-orange-700 flex items-center gap-5"><Target size={28}/> {t.vision_title}</h3>
                 <div className="grid gap-10">
                   <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-orange-600 ml-4 tracking-widest">{t.target_pos}</label>
                     <input value={formData.career_goals.target_title} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_title: e.target.value}})} className="w-full p-7 rounded-[30px] border-none font-black text-slate-800 text-xl shadow-inner bg-white focus:ring-2 ring-orange-400 outline-none" placeholder="Örn: Head of Marketing" />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-orange-600 ml-4 tracking-widest">{t.vision_sub}</label>
                     <textarea value={formData.career_goals.vision} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, vision: e.target.value}})} className="w-full p-7 rounded-[30px] border-none font-bold italic text-slate-800 text-xl min-h-[140px] shadow-inner bg-white focus:ring-2 ring-orange-400 outline-none" placeholder="Uzun vadeli vizyonunuz..." />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-orange-600 ml-4 tracking-widest">{t.action_plan}</label>
                     <textarea value={formData.career_goals.short_term_plan} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, short_term_plan: e.target.value}})} className="w-full p-7 rounded-[30px] border-none font-bold italic text-slate-800 text-xl min-h-[140px] shadow-inner bg-white focus:ring-2 ring-orange-400 outline-none" placeholder="Kısa vadeli aksiyon planlarınız..." />
                   </div>
                 </div>
              </div>

              {/* 2. BAŞARILAR MODAL */}
              <div className="space-y-10">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-3xl font-black uppercase italic text-slate-800 border-l-[10px] border-yellow-500 pl-8 leading-none">{t.achievements_title}</h3>
                  <Button onClick={() => setFormData({...formData, achievements: [...formData.achievements, ""]})} className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-[20px] font-black uppercase px-8 h-14 shadow-lg shadow-yellow-200 transition-all">YENİ BAŞARI EKLE</Button>
                </div>
                <div className="grid gap-6">
                  {formData.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-6 items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-[20px] flex items-center justify-center font-black text-slate-400 italic">#{i+1}</div>
                      <input value={ach} onChange={(e) => { const n = [...formData.achievements]; n[i] = e.target.value; setFormData({...formData, achievements: n}); }} className="flex-1 p-7 bg-slate-50 rounded-[30px] font-black italic text-slate-800 text-xl border-none focus:ring-2 ring-yellow-400 outline-none" placeholder="Başarınızı buraya yazın..." />
                      <button onClick={() => setFormData({...formData, achievements: formData.achievements.filter((_, idx) => idx !== i)})} className="bg-red-50 text-red-500 p-6 rounded-[25px] hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={28}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. EĞİTİM MODAL */}
              <div className="space-y-10">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-3xl font-black uppercase italic text-slate-800 border-l-[10px] border-blue-500 pl-8 leading-none">{t.edu_title}</h3>
                  <Button onClick={() => setFormData({...formData, education: [...formData.education, {school: "", degree: "", start_date: "", end_date: ""}]})} className="bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] font-black uppercase px-8 h-14 shadow-lg shadow-blue-200 transition-all">{t.add_edu}</Button>
                </div>
                {formData.education.map((edu, i) => (
                  <div key={i} className="p-10 border-[3px] border-slate-50 rounded-[55px] relative bg-slate-50/30 space-y-8">
                    <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute top-10 right-10 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={30} /></button>
                    <input placeholder="Okul Adı" value={edu.school} onChange={(e) => { const n = [...formData.education]; n[i].school = e.target.value; setFormData({...formData, education: n}); }} className="p-7 bg-white rounded-[30px] font-black italic text-xl border-none shadow-sm w-full outline-none focus:ring-2 ring-blue-400" />
                    <input placeholder="Bölüm / Derece" value={edu.degree} onChange={(e) => { const n = [...formData.education]; n[i].degree = e.target.value; setFormData({...formData, education: n}); }} className="p-7 bg-white rounded-[30px] font-black italic text-xl border-none shadow-sm w-full outline-none focus:ring-2 ring-blue-400" />
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-5">{t.start_date}</label><input type="date" value={edu.start_date} onChange={(e) => { const n = [...formData.education]; n[i].start_date = e.target.value; setFormData({...formData, education: n}); }} className="p-7 bg-white rounded-[30px] font-black text-xl border-none shadow-sm w-full outline-none focus:ring-2 ring-blue-400" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-5">{t.end_date}</label><input type="date" value={edu.end_date} onChange={(e) => { const n = [...formData.education]; n[i].end_date = e.target.value; setFormData({...formData, education: n}); }} className="p-7 bg-white rounded-[30px] font-black text-xl border-none shadow-sm w-full outline-none focus:ring-2 ring-blue-400" /></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. İŞ DENEYİMİ MODAL */}
              <div className="space-y-10">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-3xl font-black uppercase italic text-slate-800 border-l-[10px] border-rose-500 pl-8 leading-none">{t.exp_title}</h3>
                  <Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start_date: "", end_date: "", description: ""}]})} className="bg-rose-600 hover:bg-rose-700 text-white rounded-[20px] font-black uppercase px-8 h-14 shadow-lg shadow-rose-200 transition-all">{t.add_exp}</Button>
                </div>
                {formData.work_experience.map((work, i) => (
                  <div key={i} className="p-10 border-[3px] border-slate-50 rounded-[55px] relative bg-slate-50/30 space-y-8">
                    <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-10 right-10 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={30} /></button>
                    <div className="grid md:grid-cols-2 gap-8">
                      <input placeholder="Pozisyon" value={work.role} onChange={(e) => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-7 bg-white rounded-[30px] font-black italic text-xl border-none shadow-sm outline-none focus:ring-2 ring-rose-400" />
                      <input placeholder="Şirket" value={work.company} onChange={(e) => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-7 bg-white rounded-[30px] font-black italic text-xl border-none shadow-sm outline-none focus:ring-2 ring-rose-400" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <input type="date" value={work.start_date} onChange={(e) => { const n = [...formData.work_experience]; n[i].start_date = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-7 bg-white rounded-[30px] font-black text-xl border-none shadow-sm outline-none focus:ring-2 ring-rose-400" />
                      <input type="date" value={work.end_date} onChange={(e) => { const n = [...formData.work_experience]; n[i].end_date = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-7 bg-white rounded-[30px] font-black text-xl border-none shadow-sm outline-none focus:ring-2 ring-rose-400" />
                    </div>
                    <textarea placeholder="Deneyim detayı..." value={work.description} onChange={(e) => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="p-7 bg-white rounded-[30px] font-black italic text-xl border-none shadow-sm min-h-[160px] w-full outline-none focus:ring-2 ring-rose-400" />
                  </div>
                ))}
              </div>

              {/* 5. DİLLER MODAL */}
              <div className="space-y-10">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-3xl font-black uppercase italic text-slate-800 border-l-[10px] border-emerald-500 pl-8 leading-none">{t.lang_title}</h3>
                  <Button onClick={() => setFormData({...formData, languages: [...formData.languages, {name: "English", reading_idx: 1, writing_idx: 1, speaking_idx: 1}]})} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[20px] font-black uppercase px-8 h-14 shadow-lg shadow-emerald-200 transition-all">{t.add_lang}</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  {formData.languages.map((l, i) => (
                    <div key={i} className="p-12 border-[3px] border-slate-50 rounded-[60px] relative space-y-10 bg-white shadow-xl hover:border-emerald-200 transition-all">
                      <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="absolute top-10 right-10 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={32} /></button>
                      <select value={l.name} onChange={(e) => { const n = [...formData.languages]; n[i].name = e.target.value; setFormData({...formData, languages: n}); }} className="w-full p-6 bg-slate-50 rounded-[25px] font-black italic text-2xl border-none appearance-none outline-none focus:ring-2 ring-emerald-400">
                        {LANGUAGES_LIST.map(langName => <option key={langName} value={langName}>{langName}</option>)}
                      </select>
                      {['reading_idx', 'writing_idx', 'speaking_idx'].map((key) => (
                        <div key={key} className="space-y-4">
                          <label className="text-[11px] font-black uppercase text-slate-400 ml-4 tracking-[0.2em]">{t[key.split('_')[0]]}</label>
                          <div className="flex gap-2">
                            {t.levels.map((lvl, idx) => (
                              <button key={idx} onClick={() => { const n = [...formData.languages]; n[i][key] = idx; setFormData({...formData, languages: n}); }} className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all ${l[key] === idx ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
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

              {/* 6. YETENEKLER MODAL */}
              <div className="space-y-10">
                <h3 className="text-3xl font-black uppercase italic text-slate-800 border-l-[10px] border-indigo-500 pl-8 leading-none">{t.skill_title}</h3>
                <div className="flex flex-wrap gap-4 bg-slate-50 p-12 rounded-[60px] border border-slate-100">
                  {TECH_SKILLS_POOL.map(s => (
                    <button key={s} onClick={() => {
                      const exists = formData.skills.includes(s);
                      setFormData({...formData, skills: exists ? formData.skills.filter(x => x !== s) : [...formData.skills, s]});
                    }} className={`px-7 py-4 rounded-[22px] text-[11px] font-black uppercase transition-all shadow-sm ${formData.skills.includes(s) ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. HOBİLER MODAL */}
              <div className="space-y-10">
                <h3 className="text-3xl font-black uppercase italic text-slate-800 border-l-[10px] border-rose-500 pl-8 leading-none">{t.hobbies_title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 p-12 rounded-[60px] border border-slate-100">
                  {HOBBIES_DATA[lang].map((hobby, idx) => (
                    <button key={idx} onClick={() => {
                      const exists = formData.hobbies_indices.includes(idx);
                      setFormData({...formData, hobbies_indices: exists ? formData.hobbies_indices.filter(x => x !== idx) : [...formData.hobbies_indices, idx]});
                    }} className={`p-5 rounded-2xl text-[10px] font-black uppercase transition-all shadow-sm border ${formData.hobbies_indices.includes(idx) ? 'bg-rose-500 text-white border-rose-600' : 'bg-white text-slate-400 border-slate-200 hover:border-rose-400'}`}>
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl p-12 border-t flex gap-10 z-40">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-[35px] h-24 text-3xl font-black shadow-2xl uppercase italic tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98]">
                {saving ? "KAYDEDİLİYOR..." : t.save_btn}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-24 px-16 rounded-[35px] font-black text-slate-400 uppercase italic text-xl border-2 border-slate-100 hover:bg-slate-50">{t.cancel}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
