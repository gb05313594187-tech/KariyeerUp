// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Pencil,
  GraduationCap,
  Languages,
  Code2,
  Globe,
  Plus,
  Trash2,
  History
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // Europass Veri Yapısı (Başlangıç Değerleri)
  const [cvData, setCvData] = useState({
    work_experience: [],
    education: [],
    languages: [],
    digital_skills: [],
    projects: []
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data: sData } = await supabase.auth.getSession();
        const user = sData?.session?.user || null;
        if (!mounted) return;
        setMe(user);

        if (user) {
          const { data: pData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          
          setProfile(pData);
          if (pData?.cv_data) {
            setCvData(pData.cv_data);
          }
        }
      } catch (e) {
        toast.error("Yüklenirken bir hata oluştu.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const displayName = profile?.full_name || me?.email?.split("@")[0] || "Kullanıcı";
  const completion = useMemo(() => {
    const sections = [profile?.full_name, profile?.city, cvData.work_experience.length > 0, cvData.education.length > 0];
    return Math.round((sections.filter(Boolean).length / sections.length) * 100);
  }, [profile, cvData]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* --- HERO SECTION (MEVCUT YAPI KORUNDU) --- */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-xs text-white/90 uppercase tracking-widest">Europass CV Profile</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">
            {displayName}
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl font-light">
            Avrupa standartlarında özgeçmişiniz. Bilgileriniz koç eşleşmeleri ve kariyer yolculuğunuz için optimize edilmiştir.
          </p>

          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-white/90 mb-2">
              <span>Profil Tamamlanma Oranı</span>
              <span className="font-bold">%{completion}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-6" onClick={() => navigate("/user/dashboard")}>
              Dashboard <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/10 px-6" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" /> Profili Düzenle
            </Button>
          </div>
        </div>
      </section>

      {/* --- EUROPASS CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* SOL TARAF: ANA CV AKIŞI */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* İŞ DENEYİMİ */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><History size={20} /></div>
                  İş Deneyimi
                </h2>
                <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50 rounded-full">
                  <Plus size={18} className="mr-1" /> Ekle
                </Button>
              </div>

              {cvData.work_experience.length > 0 ? (
                <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-slate-200">
                  {cvData.work_experience.map((exp, i) => (
                    <div key={i} className="relative pl-12 group">
                      <div className="absolute left-0 top-1 w-[31px] h-[31px] bg-white border-2 border-orange-500 rounded-full z-10 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                          {exp.start} — {exp.end}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 font-medium mb-3">
                        <Building2 size={16} /> {exp.company} | <MapPin size={14} /> {exp.location}
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-2xl">Henüz iş deneyimi eklenmemiş.</p>
              )}
            </section>

            {/* EĞİTİM */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><GraduationCap size={20} /></div>
                Eğitim ve Öğretim
              </h2>
              <div className="grid gap-6">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="text-slate-400"><Calendar size={20} /></div>
                    <div>
                      <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-slate-600 text-sm">{edu.school}</p>
                      <p className="text-xs text-slate-400 mt-1">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJELER */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Code2 size={20} /></div>
                Projeler
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {cvData.projects.map((proj, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2">{proj.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SAĞ TARAF: KİŞİSEL BİLGİLER VE DİLLER */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* KART: İletişim */}
            <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <User size={16} /> İletişim Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Mail size={16} /></div>
                  <span className="text-slate-700 truncate">{me?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Phone size={16} /></div>
                  <span className="text-slate-700">{profile?.phone || "Belirtilmedi"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><MapPin size={16} /></div>
                  <span className="text-slate-700">{profile?.city || "Lokasyon girilmedi"}</span>
                </div>
              </CardContent>
            </Card>

            {/* KART: Diller */}
            <Card className="rounded-3xl border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <Languages size={18} className="text-orange-600" /> Dil Becerileri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {cvData.languages.map((lang, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{lang.name}</span>
                      <span className="text-orange-600">{lang.level}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full">
                       <div className="h-full bg-orange-400 rounded-full" style={{ width: lang.percent + '%' }}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* KART: Dijital Yetkinlikler */}
            <Card className="rounded-3xl border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <Globe size={18} className="text-orange-600" /> Dijital Yetkinlikler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-wrap gap-2">
                {cvData.digital_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
                    {skill}
                  </span>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* --- FOOTER STRIP (MEVCUT YAPI KORUNDU) --- */}
      <footer className="max-w-6xl mx-auto px-4 pb-12">
        <Card className="border-slate-200 bg-slate-900 text-white rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Verileriniz Güvende</h4>
                  <p className="text-slate-400 text-sm">Europass formatındaki bilgileriniz sadece eşleştiğiniz koçlar tarafından görülebilir.</p>
                </div>
              </div>
              <Button className="rounded-full bg-orange-500 hover:bg-orange-600 px-8" onClick={() => navigate("/coaches")}>
                Koçları Keşfet
              </Button>
            </div>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
