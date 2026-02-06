// src/pages/UserProfileEdit.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, User, Phone, Briefcase, Building2, MapPin, 
  Languages, Globe2, Award, Plus, Trash2 
} from "lucide-react";

// Şirket panelindeki listeyle birebir aynı ülke listesi
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

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    display_name: "",
    title: "",
    sector: "",
    country: "Turkey",
    city: "",
    work_preference: "Remote (Global)",
    skills: "", // AI Matcher için anahtar kelimeler
    languages: [{ lang: "English", level: "3" }] // Array of {lang, level}
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
    setForm(s => ({ ...s, languages: [...s.languages, { lang: "Turkish", level: "5" }] }));
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
          is_global_ready: true
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;

      toast.success("Global profiliniz kaydedildi. AI eşleşmeleri güncelleniyor.");
      navigate("/user/profile");
    } catch (e) {
      toast.error("Kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">AI Sistemleri Hazırlanıyor...</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12 px-4">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-3xl font-bold">Global AI Profilini Düzenle</h1>
          <p className="opacity-90 mt-2">Bilgilerin, dünya çapındaki şirketlerle eşleşme skorunu belirler.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="rounded-xl bg-white/10 border-white/20 text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Geri
            </Button>
            <Button className="rounded-xl bg-white text-red-600 hover:bg-gray-100" onClick={onSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Temel Bilgiler */}
        <Card className="rounded-[2rem] border-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-red-600" /> Kişisel ve Kariyer Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Ad Soyad</label>
                <input value={form.display_name} onChange={e => setForm(s => ({...s, display_name: e.target.value}))} className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Ünvan</label>
                <input value={form.title} onChange={e => setForm(s => ({...s, title: e.target.value}))} className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-red-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Yetkinlikler (AI Matcher Anahtarları)
              </label>
              <textarea 
                value={form.skills} 
                onChange={e => setForm(s => ({...s, skills: e.target.value}))} 
                className="w-full p-3 rounded-xl border outline-none bg-red-50/30"
                placeholder="Örn: React, Node.js, Project Management, Sales Strategy..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Global Konum ve Tercih */}
        <Card className="rounded-[2rem] border-slate-100 shadow-xl">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-red-600" /> Global Konum ve Çalışma Tercihi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Ülke</label>
              <select value={form.country} onChange={e => setForm(s => ({...s, country: e.target.value}))} className="w-full p-3 rounded-xl border bg-white outline-none">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Şehir</label>
              <input value={form.city} onChange={e => setForm(s => ({...s, city: e.target.value}))} className="w-full p-3 rounded-xl border outline-none" placeholder="Örn: İstanbul" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Çalışma Şekli</label>
              <select value={form.work_preference} onChange={e => setForm(s => ({...s, work_preference: e.target.value}))} className="w-full p-3 rounded-xl border bg-white outline-none">
                <option>Remote (Global)</option>
                <option>Remote (Local)</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Diller ve Seviyeler */}
        <Card className="rounded-[2rem] border-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Languages className="w-4 h-4 text-red-600" /> Dil Yetkinlikleri (1-5 Seviye)
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-red-600" onClick={handleAddLang}><Plus className="w-4 h-4 mr-1" /> Ekle</Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {form.languages.map((l, index) => (
              <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <select 
                  value={l.lang} 
                  onChange={e => {
                    const newList = [...form.languages];
                    newList[index].lang = e.target.value;
                    setForm(s => ({...s, languages: newList}));
                  }}
                  className="flex-1 p-2 rounded-lg border bg-white outline-none"
                >
                  {LANG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400" />
                  <select 
                    value={l.level}
                    onChange={e => {
                      const newList = [...form.languages];
                      newList[index].level = e.target.value;
                      setForm(s => ({...s, languages: newList}));
                    }}
                    className="p-2 rounded-lg border bg-white outline-none"
                  >
                    {[1,2,3,4,5].map(v => <option key={v} value={v}>Seviye {v}</option>)}
                  </select>
                </div>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-600" onClick={() => handleRemoveLang(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
