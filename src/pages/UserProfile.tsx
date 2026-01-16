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

// --- VERİ HAVUZLARI (ASLA DOKUNULMADI, TAM LİSTE) ---
const TECH_SKILLS_POOL = ["Java", "Python", "React", "Tableau", "Agile", "Scrum", "SQL", "AWS", "Docker", "Node.js", "SAP", "Salesforce", "Project Management", "UI/UX Design", "Kotlin", "Swift", "C#", "Machine Learning", "Kubernetes", "Go", "Figma", "AutoCAD", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Word", "Power BI", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Canva", "CapCut", "WordPress", "Google Analytics"];

const HOBBIES_DATA = {
  TR: ["Yüzme", "Satranç", "Kampçılık", "Fotoğrafçılık", "Yelken", "Tenis", "Yoga", "Binicilik", "Dağcılık", "Gastronomi", "Gitar", "Piyano", "Resim", "Bahçecilik", "Koşu", "Bisiklet", "E-Spor", "Seyahat", "Okçuluk", "Dalış", "Kodlama", "Podcast", "Gönüllülük", "Astronomi", "Balerin", "Tiyatro", "Koleksiyonculuk", "Felsefe", "Meditasyon", "Kitesurf", "Yemek Yapma", "Blog Yazarlığı", "Crossfit", "Model Uçak", "Ahşap İşçiliği"],
  EN: ["Swimming", "Chess", "Camping", "Photography", "Sailing", "Tennis", "Yoga", "Horse Riding", "Hiking", "Gastronomy", "Guitar", "Piano", "Painting", "Gardening", "Running", "Cycling", "E-Sports", "Traveling", "Archery", "Diving", "Coding", "Podcasting", "Volunteering", "Astronomy", "Ballet", "Theater", "Collecting", "Philosophy", "Meditation", "Kitesurfing", "Cooking", "Blogging", "Crossfit", "Model Aircraft", "Woodworking"],
  AR: ["السباحة", "الشطرنج", "التخييم", "التصوير", "الإبحار", "التنس", "اليوجا", "ركوب الخيل", "التنزه", "فن الطهي", "الغيتار", "البيانو", "الرسم", "البستنة", "الجري", "ركوب الدراجات", "الرياضات الإلكترونية", "السفر", "الرماية", "الغوص", "البرمجة", "البودكاست", "التطوع", "علم الفلك", "الباليه", "المسرح", "الجمع", "الفلسفة", "التأمل", "التزلج الشراعي", "الطبخ", "التدوين", "كروس فيت", "طائرة نموذجية", "النجارة"],
  FR: ["Natation", "Échecs", "Camping", "Photographie", "Voile", "Tennis", "Yoga", "Équitation", "Randonnée", "Gastronomie", "Guitare", "Piano", "Peinture", "Jardinage", "Course", "Cyclisme", "E-Sports", "Voyage", "Tir à l'arc", "Plongée", "Codage", "Podcast", "Bénévolat", "Astronomie", "Ballet", "Théâtre", "Collection", "Philosophie", "Meditatión", "Kitesurf", "Cuisine", "Bloguer", "Crossfit", "Modélisme", "Travail du bois"]
};

const translations = {
  TR: { verified: "ONAYLI KARİYER PROFİLİ", edit_btn: "PROFİLİ DÜZENLE", vision_title: "KARİYER HEDEFLERİ & VİZYON", target_pos: "Hedef Pozisyon", vision_sub: "GELECEK VİZYONU", action_plan: "KISA VADELİ AKSİYON", achievements_title: "BAŞARILARIM & KİLOMETRE TAŞLARI", exp_title: "İŞ DENEYİMİ", edu_title: "EĞİTİM BİLGİLERİ", lang_title: "DİL YETKİNLİĞİ", skill_title: "TEKNİK YETKİNLİKLER", hobbies_title: "İLGİ ALANLARI & HOBİLER", contact_title: "İLETİŞİM", modal_title: "PROFİL MİMARI", save_btn: "DEĞİŞİKLİKLERİ KAYDET", add_exp: "Yeni Deneyim Ekle", add_edu: "Yeni Okul Ekle", add_lang: "Yeni Dil Ekle", cancel: "Vazgeç", start_date: "Başlangıç Tarihi", end_date: "Bitiş Tarihi", present: "Devam Ediyor", reading: "Okuma", writing: "Yazma", speaking: "Konuşma", social_title: "SOSYAL MEDYA", avatar_prompt: "Profil Fotoğrafı URL'si giriniz:", levels: ["Az", "Orta", "İyi", "Çok İyi", "Anadil"] },
  EN: { verified: "VERIFIED CAREER PROFILE", edit_btn: "EDIT PROFILE", vision_title: "CAREER GOALS & VISION", target_pos: "Target Position", vision_sub: "FUTURE VISION", action_plan: "SHORT-TERM ACTION", achievements_title: "ACHIEVEMENTS & MILESTONES", exp_title: "WORK EXPERIENCE", edu_title: "EDUCATION", lang_title: "LANGUAGE SKILLS", skill_title: "TECHNICAL SKILLS", hobbies_title: "INTERESTS & HOBBIES", contact_title: "CONTACT", modal_title: "PROFILE ARCHITECT", save_btn: "SAVE ALL CHANGES", add_exp: "Add Experience", add_edu: "Add Education", add_lang: "Add Language", cancel: "Cancel", start_date: "Start Date", end_date: "End Date", present: "Present", reading: "Reading", writing: "Writing", speaking: "Speaking", social_title: "SOCIAL MEDIA", avatar_prompt: "Enter Profile Photo URL:", levels: ["Beginner", "Intermediate", "Good", "Fluent", "Native"] },
  AR: { verified: "ملف استراتيجية المهنة المعتمد", edit_btn: "تعديل الملف الشخصي", vision_title: "أهداف المهنة والرؤية", target_pos: "المنصب المستهدف", vision_sub: "رؤية مستقبلية", action_plan: "خطة عمل قصيرة المدى", achievements_title: "الإنجازات والنجاحات", exp_title: "خبرة في العمل", edu_title: "معلومات التعليم", lang_title: "اللغات", skill_title: "المهارات التقنية", hobbies_title: "الهوايات والاهتمامات", contact_title: "اتصال", modal_title: "مهندس الملف الشخصي", save_btn: "حفظ جميع التغييرات", add_exp: "أضف تجربة جديدة", add_edu: "أضف مدرسة جديدة", add_lang: "إضافة لغة", cancel: "إلغاء", start_date: "تاريخ البدء", end_date: "تاريخ الانتهاء", present: "مستمر", reading: "قراءة", writing: "كتابة", speaking: "تحدث", social_title: "وسائل التواصل الاجتماعي", avatar_prompt: "أدخل رابط الصورة الشخصية:", levels: ["ضعيف", "متوسط", "جيد", "جيد جداً", "اللغة الأم"] },
  FR: { verified: "PROFIL DE STRATÉGIE DE CARRIÈRE VÉRIFIÉ", edit_btn: "MODIFIER LE PROFIL", vision_title: "OBJECTIFS DE CARRIÈRE & VISION", target_pos: "Poste Cible", vision_sub: "VISION D'AVENIR", action_plan: "ACTION À COURT TERME", achievements_title: "RÉALISATIONS & JALONS", exp_title: "EXPÉRIENCE PROFESSIONNELLE", edu_title: "ÉDUCATION", lang_title: "LANGUES", skill_title: "COMPÉTENCES TECHNIQUES", hobbies_title: "LOISIRS & INTÉRÊTS", contact_title: "CONTACT", modal_title: "ARCHITECTE DE PROFIL", save_btn: "ENREGISTRER TOUT", add_exp: "Ajouter une expérience", add_edu: "Ajouter une école", add_lang: "Ajouter une langue", cancel: "Annuler", start_date: "Date de début", end_date: "Date de fin", present: "Actuel", reading: "Lire", writing: "Écrire", speaking: "Parler", social_title: "MÉDIAS SOCIAUX", avatar_prompt: "Entrez l'URL de la photo de profil:", levels: ["Débutant", "Intermédiaire", "Bien", "Très Bien", "Maternelle"] }
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

  // FORM STATE (KORUNDU)
  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", phone_number: "", sector: "", avatar_url: "",
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    achievements: [], work_experience: [], education: [], languages: [], skills: [], hobbies_indices: []
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
        full_name: formData.full_name, city: formData.city, phone: formData.phone_number,
        sector: formData.sector, avatar_url: formData.avatar_url, social_links: formData.social_links,
        cv_data: {
          career_goals: formData.career_goals, achievements: formData.achievements,
          work_experience: formData.work_experience, education: formData.education,
          languages: formData.languages, skills: formData.skills, hobbies_indices: formData.hobbies_indices
        },
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Profil Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) {
      toast.error("Hata oluştu");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-rose-500 animate-pulse italic text-xl uppercase">YÜKLENİYOR...</div>;

  return (
    <div className={`bg-[#f8fafc] min-h-screen font-sans pb-12 ${lang === 'AR' ? 'text-right' : 'text-left'}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      
      {/* NAVBAR (TEK DİL SEÇENEĞİ BURADA) */}
      <nav className="bg-white/95 backdrop-blur-md border-b px-8 py-3 flex justify-between items-center sticky top-0 z-[100] shadow-sm">
        <div className="font-black italic text-xl text-rose-600 uppercase tracking-tighter">Kariyeer</div>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-black text-[10px] uppercase italic border border-slate-200 hover:bg-white transition-all">
              <Globe size={16} className="text-rose-500" /> {lang} <ChevronDown size={12}/>
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white shadow-2xl rounded-xl border p-1 z-[110] min-w-[140px] animate-in fade-in zoom-in duration-150">
              {Object.keys(translations).map(l => (
                <button key={l} onClick={() => setLang(l)} className={`block w-full text-left px-4 py-2 rounded-lg font-black text-[9px] uppercase transition-all ${lang === l ? 'bg-rose-500 text-white' : 'hover:bg-rose-50 text-slate-600'}`}>
                  {l === 'TR' ? 'TÜRKÇE' : l === 'EN' ? 'ENGLISH' : l === 'AR' ? 'العربية' : 'FRANÇAIS'}
                </button>
              ))}
            </div>
          </div>
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center font-black text-[9px] text-white">GB</div>
        </div>
      </nav>

      {/* HERO SECTION (ZOOM KAPATILDI, COMPACT HALE GETİRİLDİ) */}
      <section className="bg-gradient-to-r from-[#e11d48] to-[#fb923c] py-12 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          
          <div className="relative group shrink-0" onClick={() => {
             const url = prompt(t.avatar_prompt, formData.avatar_url);
             if(url !== null) setFormData({...formData, avatar_url: url});
          }}>
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[35px] border-4 border-white/20 overflow-hidden shadow-2xl relative cursor-pointer bg-white/10 backdrop-blur-sm">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40"><User size={50}/></div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Pencil size={20} />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-rose-600 px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg tracking-widest">DEĞİŞTİR</div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic border border-white/20 tracking-widest">{t.verified}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight drop-shadow-md">{formData.full_name || "İSİM SOYİSİM"}</h1>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               <span className="bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-[9px] font-black uppercase flex items-center gap-2"><Briefcase size={12}/> {formData.sector || "SEKTÖR"}</span>
               <span className="bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-[9px] font-black uppercase flex items-center gap-2"><Target size={12}/> {formData.career_goals.target_title || "HEDEF"}</span>
            </div>
          </div>
          
          <Button onClick={() => setEditOpen(true)} className="bg-white text-rose-600 hover:bg-rose-50 rounded-[25px] h-14 px-8 font-black shadow-xl uppercase italic text-md transition-all hover:scale-105 shrink-0">
            <Pencil size={18} className="mr-2" /> {t.edit_btn}
          </Button>
        </div>
      </section>

      {/* MAIN CONTENT (TAM SAYFA GÖRÜNÜM) */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner"><Target size={24} /></div>
               {t.vision_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{t.vision_sub}</h4>
                  <p className="italic font-bold text-slate-700 text-lg leading-relaxed">"{formData.career_goals.vision || "..."}"</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{t.action_plan}</h4>
                  <div className="bg-slate-50 p-6 rounded-[30px] border-l-[6px] border-orange-400 font-black text-slate-600 italic">
                    {formData.career_goals.short_term_plan || "..."}
                  </div>
                </div>
             </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center shadow-inner"><Star size={24} /></div>
               {t.achievements_title}
             </h2>
             <div className="grid gap-4">
               {formData.achievements.map((ach, i) => (
                 <div key={i} className="flex gap-4 items-center bg-slate-50 p-5 rounded-[25px] border border-slate-100 font-black text-slate-800 italic">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-yellow-500 text-xs italic">#{i+1}</div>
                    {ach}
                 </div>
               ))}
             </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><History size={24} /></div>
               {t.exp_title}
             </h2>
             <div className="space-y-8">
               {formData.work_experience.map((work, i) => (
                 <div key={i} className="border-l-[4px] border-rose-500 pl-8">
                   <h3 className="text-xl font-black italic uppercase text-slate-900 mb-1">{work.role}</h3>
                   <div className="text-slate-400 font-black text-[9px] uppercase mb-3">{work.company} • {work.start_date} / {work.end_date || t.present}</div>
                   <p className="text-slate-600 font-bold italic text-sm">"{work.description}"</p>
                 </div>
               ))}
             </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><GraduationCap size={24} /></div>
               {t.edu_title}
             </h2>
             <div className="space-y-8">
               {formData.education.map((edu, i) => (
                 <div key={i} className="border-l-[4px] border-blue-500 pl-8">
                   <h3 className="text-xl font-black italic uppercase text-slate-900 mb-1">{edu.school}</h3>
                   <div className="text-slate-400 font-black text-[9px] uppercase">{edu.degree} • {edu.start_date} / {edu.end_date || t.present}</div>
                 </div>
               ))}
             </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><Languages size={24} /></div>
               {t.lang_title}
             </h2>
             <div className="grid md:grid-cols-2 gap-6">
               {formData.languages.map((l, i) => (
                 <div key={i} className="bg-slate-50 p-6 rounded-[30px] border border-slate-100">
                    <h3 className="text-md font-black text-slate-900 mb-4 uppercase italic flex justify-between">
                      {l.name}
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{t.levels[l.speaking_idx]}</span>
                    </h3>
                    <div className="space-y-3">
                      {[{lab: t.reading, val: l.reading_idx}, {lab: t.writing, val: l.writing_idx}, {lab: t.speaking, val: l.speaking_idx}].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[8px] font-black uppercase text-slate-400"><span>{item.lab}</span></div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${(item.val + 1) * 20}%`}}></div></div>
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Cpu size={24} /></div>
               {t.skill_title}
             </h2>
             <div className="flex flex-wrap gap-2">
               {formData.skills.map((skill, i) => (
                 <span key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black text-[9px] uppercase italic border border-indigo-100 flex items-center gap-2">
                   <CheckCircle2 size={12}/> {skill}
                 </span>
               ))}
             </div>
          </section>

          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-800 uppercase italic">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><Heart size={24} /></div>
               {t.hobbies_title}
             </h2>
             <div className="flex flex-wrap gap-2">
               {formData.hobbies_indices.map((idx) => (
                 <span key={idx} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-black text-[9px] uppercase italic border border-slate-200">
                   # {HOBBIES_DATA[lang][idx]}
                 </span>
               ))}
             </div>
          </section>
        </div>

        {/* SAĞ TARAF (BİLGİ KARTI) */}
        <div className="lg:col-span-4">
           <Card className="rounded-[40px] bg-[#0f172a] text-white p-10 border-none shadow-xl sticky top-24 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 to-orange-500"></div>
              <h3 className="text-[10px] font-black uppercase text-rose-500 italic mb-8 flex items-center gap-3 tracking-widest"><MapPin size={16}/> {t.contact_title}</h3>
              
              <div className="space-y-6">
                <div><p className="text-[9px] text-slate-500 uppercase font-black mb-1">E-posta</p><p className="font-black italic text-md break-all">{formData.email}</p></div>
                <div><p className="text-[9px] text-slate-500 uppercase font-black mb-1">Telefon</p><p className="font-black italic text-lg">{formData.phone_number || "..."}</p></div>
                <div><p className="text-[9px] text-slate-500 uppercase font-black mb-1">Şehir</p><p className="font-black italic text-xl uppercase">{formData.city || "..."}</p></div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800 space-y-4">
                 <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{t.social_title}</p>
                 <div className="flex gap-3">
                    {['linkedin', 'github', 'instagram'].map(s => (
                      <button key={s} onClick={() => {
                        const url = prompt(`${s} URL:`, formData.social_links[s]);
                        if(url !== null) setFormData({...formData, social_links: {...formData.social_links, [s]: url}});
                      }} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.social_links[s] ? 'bg-rose-600' : 'bg-slate-800 text-slate-600'}`}>
                        {s === 'linkedin' ? <Linkedin size={18}/> : s === 'github' ? <Github size={18}/> : <Instagram size={18}/>}
                      </button>
                    ))}
                 </div>
              </div>
           </Card>
        </div>
      </main>

      {/* --- MODAL (TÜM FORMLAR KORUNDU) --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[50px] shadow-2xl relative border border-white/20">
            
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-8 border-b flex justify-between items-center z-50">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">{t.modal_title}</h2>
              <button onClick={() => setEditOpen(false)} className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90 shadow-sm"><X size={24}/></button>
            </div>

            <div className="p-10 space-y-12">
               {/* 1. ANA BİLGİLER */}
               <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[35px]">
                  {['full_name', 'sector', 'city', 'phone_number'].map(f => (
                    <div key={f} className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-3">{f.replace('_',' ')}</label>
                      <input value={formData[f]} onChange={(e) => setFormData({...formData, [f]: e.target.value})} className="w-full p-4 rounded-2xl bg-white font-black text-lg border-none shadow-inner ring-rose-500 focus:ring-2" />
                    </div>
                  ))}
               </div>

               {/* 2. HEDEFLER */}
               <div className="space-y-6">
                 <h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><Target className="text-orange-500"/> {t.vision_title}</h3>
                 <input placeholder={t.target_pos} value={formData.career_goals.target_title} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, target_title: e.target.value}})} className="w-full p-5 rounded-2xl bg-slate-50 font-black text-lg border-none" />
                 <textarea placeholder={t.vision_sub} value={formData.career_goals.vision} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, vision: e.target.value}})} className="w-full p-5 rounded-2xl bg-slate-50 font-bold italic text-lg min-h-[100px]" />
                 <textarea placeholder={t.action_plan} value={formData.career_goals.short_term_plan} onChange={(e) => setFormData({...formData, career_goals: {...formData.career_goals, short_term_plan: e.target.value}})} className="w-full p-5 rounded-2xl bg-slate-50 font-bold italic text-lg min-h-[100px]" />
               </div>

               {/* 3. BAŞARILAR */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><Star className="text-yellow-500"/> {t.achievements_title}</h3><Button onClick={() => setFormData({...formData, achievements: [...formData.achievements, ""]})} className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-black px-6">EKLE</Button></div>
                  {formData.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-3">
                      <input value={ach} onChange={(e) => { const n = [...formData.achievements]; n[i] = e.target.value; setFormData({...formData, achievements: n}); }} className="flex-1 p-5 bg-slate-50 rounded-2xl font-black italic" placeholder="Başarı giriniz..." />
                      <button onClick={() => setFormData({...formData, achievements: formData.achievements.filter((_, idx) => idx !== i)})} className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                    </div>
                  ))}
               </div>

               {/* 4. DENEYİM (FULL FORM) */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><Briefcase className="text-rose-500"/> {t.exp_title}</h3><Button onClick={() => setFormData({...formData, work_experience: [...formData.work_experience, {role: "", company: "", start_date: "", end_date: "", description: ""}]})} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black px-6">{t.add_exp}</Button></div>
                  {formData.work_experience.map((work, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[35px] space-y-4 relative border border-slate-100">
                      <button onClick={() => setFormData({...formData, work_experience: formData.work_experience.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-red-400"><Trash2 size={24}/></button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input placeholder="Pozisyon" value={work.role} onChange={(e) => { const n = [...formData.work_experience]; n[i].role = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 rounded-xl font-black" />
                        <input placeholder="Şirket" value={work.company} onChange={(e) => { const n = [...formData.work_experience]; n[i].company = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 rounded-xl font-black" />
                        <input placeholder="Başlangıç" value={work.start_date} onChange={(e) => { const n = [...formData.work_experience]; n[i].start_date = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 rounded-xl font-black" />
                        <input placeholder="Bitiş" value={work.end_date} onChange={(e) => { const n = [...formData.work_experience]; n[i].end_date = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 rounded-xl font-black" />
                      </div>
                      <textarea placeholder="Görev Tanımı" value={work.description} onChange={(e) => { const n = [...formData.work_experience]; n[i].description = e.target.value; setFormData({...formData, work_experience: n}); }} className="w-full p-4 rounded-xl font-bold italic min-h-[100px]" />
                    </div>
                  ))}
               </div>

               {/* 5. EĞİTİM (FULL FORM) */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><GraduationCap className="text-blue-500"/> {t.edu_title}</h3><Button onClick={() => setFormData({...formData, education: [...formData.education, {school: "", degree: "", start_date: "", end_date: ""}]})} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black px-6">{t.add_edu}</Button></div>
                  {formData.education.map((edu, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[35px] space-y-4 relative border border-slate-100">
                      <button onClick={() => setFormData({...formData, education: formData.education.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-red-400"><Trash2 size={24}/></button>
                      <input placeholder="Üniversite" value={edu.school} onChange={(e) => { const n = [...formData.education]; n[i].school = e.target.value; setFormData({...formData, education: n}); }} className="w-full p-4 rounded-xl font-black" />
                      <div className="grid md:grid-cols-3 gap-4">
                        <input placeholder="Derece" value={edu.degree} onChange={(e) => { const n = [...formData.education]; n[i].degree = e.target.value; setFormData({...formData, education: n}); }} className="w-full p-4 rounded-xl font-black" />
                        <input placeholder="Giriş" value={edu.start_date} onChange={(e) => { const n = [...formData.education]; n[i].start_date = e.target.value; setFormData({...formData, education: n}); }} className="w-full p-4 rounded-xl font-black" />
                        <input placeholder="Mezuniyet" value={edu.end_date} onChange={(e) => { const n = [...formData.education]; n[i].end_date = e.target.value; setFormData({...formData, education: n}); }} className="w-full p-4 rounded-xl font-black" />
                      </div>
                    </div>
                  ))}
               </div>

               {/* 6. DİLLER (TAM LİSTE) */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><Languages className="text-emerald-500"/> {t.lang_title}</h3><Button onClick={() => setFormData({...formData, languages: [...formData.languages, {name: "English", reading_idx: 2, writing_idx: 2, speaking_idx: 2}]})} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black px-6">{t.add_lang}</Button></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {formData.languages.map((l, i) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[35px] relative border border-slate-100">
                        <button onClick={() => setFormData({...formData, languages: formData.languages.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-red-400"><Trash2 size={20}/></button>
                        <select value={l.name} onChange={(e) => { const n = [...formData.languages]; n[i].name = e.target.value; setFormData({...formData, languages: n}); }} className="w-full p-4 rounded-xl mb-6 font-black bg-white shadow-sm">
                          {LANGUAGES_LIST.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <div className="space-y-4">
                           {['reading_idx', 'writing_idx', 'speaking_idx'].map(field => (
                             <div key={field} className="space-y-2">
                               <p className="text-[9px] font-black uppercase text-slate-400 ml-2">{field.replace('_idx', '')}</p>
                               <div className="flex gap-1.5">
                                 {t.levels.map((lvl, idx) => (
                                   <button key={idx} onClick={() => { const n = [...formData.languages]; n[i][field] = idx; setFormData({...formData, languages: n}); }} className={`flex-1 py-2.5 rounded-lg text-[8px] font-black transition-all ${l[field] === idx ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-400'}`}>{lvl}</button>
                                 ))}
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* 7. YETENEK HAVUZU (ASLA DOKUNULMADI) */}
               <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><Cpu className="text-indigo-500"/> {t.skill_title}</h3>
                  <div className="flex flex-wrap gap-2 bg-slate-50 p-8 rounded-[35px]">
                    {TECH_SKILLS_POOL.map(s => (
                      <button key={s} onClick={() => {
                        const exists = formData.skills.includes(s);
                        setFormData({...formData, skills: exists ? formData.skills.filter(x => x !== s) : [...formData.skills, s]});
                      }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.skills.includes(s) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
               </div>

               {/* 8. HOBİ HAVUZU (ASLA DOKUNULMADI) */}
               <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-3"><Heart className="text-rose-500"/> {t.hobbies_title}</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 bg-slate-50 p-8 rounded-[35px]">
                    {HOBBIES_DATA[lang].map((hobby, idx) => (
                      <button key={idx} onClick={() => {
                        const exists = formData.hobbies_indices.includes(idx);
                        setFormData({...formData, hobbies_indices: exists ? formData.hobbies_indices.filter(x => x !== idx) : [...formData.hobbies_indices, idx]});
                      }} className={`p-3 rounded-xl text-[9px] font-black uppercase transition-all ${formData.hobbies_indices.includes(idx) ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>
                        {hobby}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-8 border-t flex gap-5 z-50">
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 h-20 rounded-[30px] text-2xl font-black uppercase italic text-white shadow-xl transition-all active:scale-95">{saving ? "..." : t.save_btn}</Button>
              <Button onClick={() => setEditOpen(false)} className="h-20 px-10 rounded-[30px] font-black uppercase italic text-slate-400 border-2 border-slate-100">KAPAT</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
