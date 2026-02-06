// src/pages/UserProfileEdit.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, User, Briefcase, Languages, 
  Globe2, Award, Plus, Trash2, Sparkles, MapPin 
} from "lucide-react";

// Global Matcher için Alfabetik Ülke Listesi
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Brazil", "Bulgaria",
  "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Egypt", "Estonia", "Ethiopia", "Finland", "France",
  "Georgia", "Germany", "Greece", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Lebanon", "Libya", "Luxembourg",
  "Malta", "Mexico", "Monaco", "Morocco", "Netherlands", "New Zealand", "Norway", "Oman",
  "Pakistan", "Palestine", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Syria",
  "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uzbekistan", "Vietnam", "Worldwide"
].sort();

const LANG_OPTIONS = ["English", "Arabic", "French", "German", "Spanish", "Italian", "Portuguese", "Dutch", "Turkish"];

// Arka plandaki 1-5 değerlerini görsel etiketlerle eşleştiriyoruz
const LEVEL_LABELS = {
  1: "Az (Basic)",
  2: "Orta (Intermediate)",
  3: "İyi (Upper-Inter)",
  4: "Çok İyi (Advanced)",
  5: "Anadil (Native)"
};

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState<any>(null);

  const [form, setForm] = useState({
    display_name: "",
    title: "",
    sector: "",
    country: "Turkey",
    city: "",
    work_preference: "Remote (Global)",
    skills: "", 
    languages: [{ lang: "English", level: "3" }] 
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setMe(user);

        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (p) {
          setForm({
            display_name: p.display_name || p.full_name || "",
            title: p.title || "",
            sector: p.sector || "",
            country: p.country || "Turkey",
            city: p.city || "",
            work_preference: p.metadata?.work_preference || "Remote (Global)",
            skills: p.metadata?.skills || "",
            languages: p.metadata?.languages || [{ lang: "English", level: "3" }]
          });
        }
      } catch (e) {
        toast.error("Profil yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleAddLang = () => {
    setForm(s => ({ ...s, languages: [...s.languages, { lang: "English", level: "3" }] }));
  };

  const handleRemoveLang = (index: number) => {
    setForm(s => ({ ...s, languages: s.languages.filter((_, i) => i !== index) }));
  };

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        id: me.id,
        display_name: form.display_name,
        full_name: form.display_name,
        title: form.title,
        sector: form.sector,
        country: form.country,
        city: form.city,
        metadata: {
          work_preference: form.work_preference,
          skills: form.skills,
          languages: form.languages,
          is_global_ready: true,
          last_ai_sync: new Date().toISOString()
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;

      toast.success("Global profiliniz kaydedildi. AI sistemleri güncellendi.");
      navigate("/user/profile");
    } catch (e) {
      toast.error("Kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-red-600 animate-pulse text-lg">AI Matcher Sistemleri Hazırlanıyor...</div>;

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-20">
      {/* Global Branding Header */}
      <section className="bg-gradient-to-r from-[#e11d48] to-[#f59e0b] py-16 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-bold tracking-widest uppercase opacity-80">Global Talent Network</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Profilini Düzenle</h1>
          <p className="opacity-90 mt-2 text-lg max-w-2xl font-medium leading-relaxed">
            Verilerin dünya çapındaki şirketlerle olan eşleşme skorunu belirler. Dil ve yetkinliklerini ne kadar net girersen, o kadar yukarıda çıkarsın.
          </p>
          <div className="mt-8 flex gap-4">
            <Button variant="outline" className="rounded-2xl bg-white/10 border-white/30 text-white backdrop-blur-md hover:bg-white/20 transition-all px-6 py-6 h-auto" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 mr-2" /> Geri
            </Button>
            <Button className="rounded-2xl bg-white text-red-600 hover:bg-gray-50 shadow-xl transition-transform active:scale-95 px-8 py-6 h-auto font-bold text-md" onClick={onSave} disabled={saving}>
              <Save className="w-5 h-5 mr-2" /> {saving ? "Senkronize Ediliyor..." : "Global Profili Kaydet"}
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-10 space-y-8">
        {/* Temel Kariyer Kartı */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 border-b p-8">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-red-100 rounded-xl"><User className="w-5 h-5 text-red-600" /></div>
              Temel Kariyer Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-600 ml-1">Tam Adın</label>
                <input value={form.display_name} onChange={e => setForm(s => ({...s, display_name: e.target.value}))} className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-600 ml-1">Profesyonel Ünvan</label>
                <input value={form.title} onChange={e => setForm(s => ({...s, title: e.target.value}))} className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-red-600 flex items-center gap-2 ml-1">
                <Sparkles className="w-4 h-4 fill-red-600" /> Teknik Yetkinlikler (AI Matcher Anahtarları)
              </label>
              <textarea 
                value={form.skills} 
                onChange={e => setForm(s => ({...s, skills: e.target.value}))} 
                className="w-full p-5 rounded-3xl border border-red-50 bg-red-50/20 outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[120px] font-medium leading-relaxed"
                placeholder="Örn: React, Node.js, Project Management, Sales Strategy, Docker, Python..."
              />
              <p className="text-[11px] text-gray-400 italic">Şirket ilanlarındaki anahtar kelimelerle buradaki kelimelerin eşleşmesi skorunu %500 artırır.</p>
            </div>
          </CardContent>
        </Card>

        {/* Global Lokasyon Kartı */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b p-8">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-blue-100 rounded-xl"><Globe2 className="w-5 h-5 text-blue-600" /></div>
              Global Konum & Mobilite Tercihi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-600 ml-1">Bulunduğun Ülke</label>
              <select value={form.country} onChange={e => setForm(s => ({...s, country: e.target.value}))} className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-medium appearance-none">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-600 ml-1">Şehir</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input value={form.city} onChange={e => setForm(s => ({...s, city: e.target.value}))} className="w-full p-4 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-medium" placeholder="Örn: İstanbul" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-600 ml-1">Çalışma Tercihi</label>
              <select value={form.work_preference} onChange={e => setForm(s => ({...s, work_preference: e.target.value}))} className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-medium">
                <option>Remote (Global)</option>
                <option>Remote (Only Region)</option>
                <option>Hybrid</option>
                <option>Office Based</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Dil Yetkinlik Kartı */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-emerald-100 rounded-xl"><Languages className="w-5 h-5 text-emerald-600" /></div>
              Dil Yetkinlik Skalası (CEFR Uyumlu)
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-red-600 font-bold hover:bg-red-50 rounded-xl" onClick={handleAddLang}>
              <Plus className="w-4 h-4 mr-1" /> Yeni Dil Ekle
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-5">
            {form.languages.map((l, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50/80 p-5 rounded-3xl border border-gray-100 group transition-all hover:border-red-200">
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">Dil</label>
                  <select 
                    value={l.lang} 
                    onChange={e => {
                      const newList = [...form.languages];
                      newList[index].lang = e.target.value;
                      setForm(s => ({...s, languages: newList}));
                    }}
                    className="w-full p-3 rounded-xl border border-white bg-white outline-none font-bold text-gray-700"
                  >
                    {LANG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                
                <div className="flex-[2] w-full">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">Seviye (AI Puanı)</label>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-emerald-500 hidden md:block" />
                    <select 
                      value={l.level}
                      onChange={e => {
                        const newList = [...form.languages];
                        newList[index].level = e.target.value;
                        setForm(s => ({...s, languages: newList}));
                      }}
                      className="w-full p-3 rounded-xl border border-white bg-white outline-none font-bold text-emerald-600"
                    >
                      {[1,2,3,4,5].map(v => <option key={v} value={String(v)}>{LEVEL_LABELS[v]}</option>)}
                    </select>
                  </div>
                </div>

                <Button size="icon" variant="ghost" className="text-gray-300 hover:text-red-600 mt-5 md:mt-0 transition-colors" onClick={() => handleRemoveLang(index)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-[12px] text-emerald-700 font-medium">
               💡 **İpucu:** Global ilanlarda AI genellikle **Seviye 3 ve üzeri** adayları en üst sıralara taşır.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
