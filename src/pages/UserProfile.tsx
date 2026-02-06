// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User,
  Pencil,
  History,
  X,
  Briefcase,
  Trash2,
  Target,
  MapPin,
  GraduationCap,
  Languages,
  Cpu,
  Heart,
  CheckCircle2,
  Star,
  Linkedin,
  Github,
  Instagram,
  Globe2,
  Camera,
  Mail,
  Phone,
  Link2
} from "lucide-react";

// --- VERİ HAVUZLARI ---
const TECH_SKILLS_POOL = [
  "Java", "Python", "React", "Tableau", "Agile", "Scrum", "SQL", "AWS", "Docker", "Node.js", "SAP", "Salesforce", "Project Management", "UI/UX Design", "Kotlin", "Swift", "C#", "Machine Learning", "Kubernetes", "Go", "Figma", "AutoCAD", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Word", "Power BI", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Canva", "CapCut", "WordPress", "Google Analytics", "Logo Tiger", "Logo Go3", "Mikro Yazılım", "ETA Muhasebe", "Luca", "Zirve Muhasebe", "Paraşüt", "Akınsoft", "Nebim V3", "Oracle NetSuite", "QuickBooks", "Adobe After Effects", "DaVinci Resolve", "Final Cut Pro", "Sony Vegas Pro", "Filmora", "Adobe Audition", "Avid Media Composer", "Camplitude", "Handbrake", "Color Grading", "Motion Graphics"
];

const COUNTRIES = [
  "Turkey", "United States", "United Kingdom", "Germany", "France", "Netherlands", "United Arab Emirates", "Saudi Arabia", "Qatar", "Tunisia", "Azerbaijan"
].sort();

const HOBBIES_DATA = {
  TR: ["Yüzme", "Satranç", "Kampçılık", "Fotoğrafçılık", "Yelken", "Tenis", "Yoga", "Binicilik", "Dağcılık", "Gastronomi", "Gitar", "Piyano", "Resim", "Bahçecilik", "Koşu", "Bisiklet", "E-Spor", "Seyahat", "Okçuluk", "Dalış", "Kodlama", "Podcast", "Gönüllülük", "Astronomi", "Balerin", "Tiyatro", "Koleksiyonculuk", "Felsefe", "Meditasyon", "Kitesurf", "Yemek Yapma", "Blog Yazarlığı", "Crossfit", "Model Uçak", "Ahşap İşçiliği"],
  EN: ["Swimming", "Chess", "Camping", "Photography", "Sailing", "Tennis", "Yoga", "Horse Riding", "Hiking", "Gastronomy", "Guitar", "Piano", "Painting", "Gardening", "Running", "Cycling", "E-Sports", "Traveling", "Archery", "Diving", "Coding", "Podcasting", "Volunteering", "Astronomy", "Ballet", "Theater", "Collecting", "Philosophy", "Meditation", "Kitesurfing", "Cooking", "Blogging", "Crossfit", "Model Aircraft", "Woodworking"],
};

const translations = {
  TR: { verified: "ONAYLI KARİYER PROFİLİ", edit_btn: "Profili Düzenle", vision_title: "Vizyon & Strateji", target_pos: "Hedef Pozisyon", vision_sub: "GELECEK VİZYONU", action_plan: "AKSİYON PLANI", achievements_title: "BAŞARILAR & MİLATLAR", exp_title: "İŞ DENEYİMİ", edu_title: "EĞİTİM", lang_title: "DİLLER", skill_title: "YETKİNLİKLER", hobbies_title: "HOBİLER", contact_title: "İLETİŞİM", modal_title: "PROFİL MİMARI", save_btn: "GÜNCELLEMELERİ KAYDET", add_exp: "Deneyim Ekle", add_edu: "Eğitim Ekle", add_lang: "Dil Ekle", cancel: "Kapat", present: "Devam Ediyor", levels: ["Az", "Orta", "İyi", "Çok İyi", "Anadil"] },
  EN: { verified: "VERIFIED CAREER PROFILE", edit_btn: "Edit Profile", vision_title: "Vision & Strategy", target_pos: "Target Position", vision_sub: "FUTURE VISION", action_plan: "ACTION PLAN", achievements_title: "ACHIEVEMENTS", exp_title: "EXPERIENCE", edu_title: "EDUCATION", lang_title: "LANGUAGES", skill_title: "SKILLS", hobbies_title: "HOBBIES", contact_title: "CONTACT", modal_title: "PROFILE ARCHITECT", save_btn: "SAVE CHANGES", add_exp: "Add Experience", add_edu: "Add Education", add_lang: "Add Language", cancel: "Close", present: "Present", levels: ["Basic", "Intermediate", "Good", "Fluent", "Native"] },
};

const LANGUAGES_LIST = ["Türkçe", "English", "Deutsch", "Français", "العربية", "Español", "Italiano", "Pусский", "中文", "日本語"];

export default function UserProfile() {
  const navigate = useNavigate();
  const langCtx = useLanguage?.();
  const lang = useMemo(() => (langCtx?.lang?.startsWith("TR") ? "TR" : "EN"), [langCtx?.lang]);
  const t = translations[lang];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", email: "", city: "", country: "Turkey", phone_number: "", sector: "", avatar_url: "",
    social_links: { linkedin: "", github: "", instagram: "" },
    career_goals: { target_title: "", vision: "", short_term_plan: "" },
    achievements: [], work_experience: [], education: [], languages: [], skills: [], hobbies_indices: [],
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
          full_name: p.full_name || "", email: p.email || session.user.email || "",
          city: p.city || "", country: p.country || "Turkey", phone_number: p.phone || "", sector: p.sector || "",
          avatar_url: p.avatar_url || "",
          social_links: p.social_links || { linkedin: "", github: "", instagram: "" },
          career_goals: p.cv_data?.career_goals || { target_title: "", vision: "", short_term_plan: "" },
          achievements: p.cv_data?.achievements || [],
          work_experience: p.cv_data?.work_experience || [],
          education: p.cv_data?.education || [],
          languages: p.cv_data?.languages || [],
          skills: p.cv_data?.skills || [],
          hobbies_indices: p.cv_data?.hobbies_indices || [],
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
        country: formData.country,
        phone: formData.phone_number,
        sector: formData.sector,
        avatar_url: formData.avatar_url, // Ana tabloya kaydediliyor
        social_links: formData.social_links,
        cv_data: {
          career_goals: formData.career_goals,
          achievements: formData.achievements,
          work_experience: formData.work_experience,
          education: formData.education,
          languages: formData.languages,
          skills: formData.skills,
          hobbies_indices: formData.hobbies_indices,
        },
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profil Başarıyla Güncellendi");
      setEditOpen(false);
      loadProfile();
    } catch (e) {
      toast.error("Kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-medium animate-pulse">Profil Hazırlanıyor...</p>
    </div>
  );

  return (
    <div className="bg-[#F0F2F5] min-h-screen font-sans pb-12 overflow-x-hidden">
      
      {/* FACEBOOK STYLE HEADER */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Cover Photo Area */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-[#e11d48] via-[#fb923c] to-[#f59e0b] relative rounded-b-xl" />
          
          {/* Profile Info Bar */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16 md:-mt-20">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden shadow-lg bg-slate-100">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <User size={64} />
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      const url = prompt("Profil Fotoğrafı URL'si:", formData.avatar_url);
                      if (url !== null) setFormData({ ...formData, avatar_url: url });
                    }}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  {formData.full_name || "İsim Soyisim"}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium text-sm">
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} /> {t.verified}
                  </div>
                  <div className="flex items-center gap-1.5"><Briefcase size={16} /> {formData.sector || "Sektör Belirtilmedi"}</div>
                  <div className="flex items-center gap-1.5"><Globe2 size={16} /> {formData.country}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-2">
                <Button 
                  onClick={() => setEditOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold px-6 h-10 shadow-none border border-slate-200"
                >
                  <Pencil size={16} className="mr-2" /> {t.edit_btn}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ABOUT & STATS */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-xl border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">{t.contact_title}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><Mail size={16} /></div>
                  <div className="text-sm truncate"><strong>Email:</strong> {formData.email}</div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><Phone size={16} /></div>
                  <div className="text-sm"><strong>Tel:</strong> {formData.phone_number || "---"}</div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><MapPin size={16} /></div>
                  <div className="text-sm"><strong>Konum:</strong> {formData.city}, {formData.country}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4 justify-center md:justify-start">
                {Object.entries(formData.social_links).map(([key, value]) => (
                  <button key={key} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${value ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-300 opacity-50'}`}>
                    {key === "linkedin" ? <Linkedin size={18} /> : key === "github" ? <Github size={18} /> : <Instagram size={18} />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-sm bg-white p-6">
            <h3 className="font-bold text-slate-900 mb-4">{t.skill_title}</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-100 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-500" /> {s}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vision Section */}
          <section className="bg-white rounded-xl p-8 shadow-sm border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Target size={20} /></div>
              <h2 className="text-lg font-bold text-slate-900">{t.vision_title}</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 font-bold mb-2 uppercase tracking-wide">{t.vision_sub}</p>
                <p className="text-slate-700 leading-relaxed font-medium">"{formData.career_goals.vision || "Henüz bir gelecek vizyonu eklenmedi."}"</p>
              </div>
              <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500 font-bold mb-2 uppercase tracking-wide">{t.action_plan}</p>
                <p className="text-slate-600 font-medium italic">{formData.career_goals.short_term_plan || "Kısa vadeli plan belirtilmedi."}</p>
              </div>
            </div>
          </section>

          {/* Work Experience */}
          <section className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Briefcase size={20} /></div>
              <h2 className="text-lg font-bold text-slate-900">{t.exp_title}</h2>
            </div>
            <div className="space-y-8 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {formData.work_experience.map((w, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-rose-500 z-10" />
                  <h4 className="font-bold text-slate-900">{w.role}</h4>
                  <p className="text-sm text-rose-600 font-bold mb-2">{w.company}</p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">{w.start_date} - {w.end_date || t.present}</p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-50 italic">"{w.description}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><GraduationCap size={20} /></div>
              <h2 className="text-lg font-bold text-slate-900">{t.edu_title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {formData.education.map((e, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-all bg-white shadow-sm">
                  <h4 className="font-bold text-slate-900 truncate mb-1">{e.school}</h4>
                  <p className="text-sm text-blue-600 font-bold mb-2">{e.degree}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                    <History size={12} /> {e.start_date} - {e.end_date || t.present}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* --- MODERN MODAL --- */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b flex justify-between items-center z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600"><Pencil size={18} /></div>
                <h2 className="text-xl font-bold text-slate-900">{t.modal_title}</h2>
              </div>
              <button onClick={() => setEditOpen(false)} className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-full hover:bg-slate-200 transition-all text-slate-500"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-10">
              {/* Profile Photo Section in Modal */}
              <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                 <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm shrink-0">
                    <img src={formData.avatar_url || "https://ui-avatars.com/api/?name="+formData.full_name} className="w-full h-full object-cover" />
                 </div>
                 <div className="space-y-2 flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Profil Fotoğrafı URL</label>
                    <input 
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="https://..."
                    />
                 </div>
              </div>

              {/* Basic Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {["full_name", "sector", "city", "phone_number"].map((f) => (
                  <div key={f} className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-slate-500 ml-1">{f.replace("_", " ")}</label>
                    <input
                      value={formData[f]}
                      onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                ))}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-slate-500 ml-1">Ülke</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none shadow-sm appearance-none"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>

              {/* Language Section in Modal */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><Languages size={18} className="text-emerald-500" /> {t.lang_title}</h3>
                    <Button onClick={() => setFormData({ ...formData, languages: [...formData.languages, { name: "English", reading_idx: 2, writing_idx: 2, speaking_idx: 2 }] })} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-9 text-xs">Dil Ekle</Button>
                 </div>
                 <div className="grid gap-4">
                    {formData.languages.map((l, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-xl relative border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                        <select value={l.name} onChange={(e) => { const n = [...formData.languages]; n[i].name = e.target.value; setFormData({ ...formData, languages: n }); }} className="w-full md:w-48 p-3 rounded-lg border bg-white font-bold">{LANGUAGES_LIST.map((v) => (<option key={v} value={v}>{v}</option>))}</select>
                        <div className="flex-1 flex gap-2 w-full">
                           {["reading_idx", "writing_idx", "speaking_idx"].map((field) => (
                             <div key={field} className="flex-1 space-y-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase text-center">{field.split('_')[0]}</p>
                               <select value={l[field]} onChange={(e) => { const n = [...formData.languages]; n[i][field] = parseInt(e.target.value); setFormData({ ...formData, languages: n }); }} className="w-full p-2 bg-white rounded border text-xs font-bold text-emerald-600">
                                  {t.levels.map((lvl, idx) => <option key={idx} value={idx}>{lvl}</option>)}
                               </select>
                             </div>
                           ))}
                        </div>
                        <button onClick={() => setFormData({ ...formData, languages: formData.languages.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-6 border-t flex gap-4 z-50">
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="flex-1 bg-rose-500 hover:bg-rose-600 h-12 rounded-xl text-md font-bold text-white shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                {saving ? "Güncelleniyor..." : t.save_btn}
              </Button>
              <Button onClick={() => setEditOpen(false)} variant="ghost" className="h-12 px-8 rounded-xl font-bold text-slate-500 border border-slate-100">İptal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
