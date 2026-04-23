// src/pages/CreateJob.tsx
// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Briefcase, 
  MapPin, 
  AlignLeft, 
  Sparkles, 
  ArrowLeft, 
  Globe2, 
  Languages,
  Award,
  ShieldCheck,
  Zap
} from "lucide-react";

const countries = [
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

const languages = ["English", "Arabic", "French", "German", "Spanish", "Italian", "Portuguese", "Dutch", "Turkish"];

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    work_model: "Online (Canlı)",
    country: "Worldwide",
    requirements: "",
    required_lang: "English",
    lang_level: "3", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Oturum bulunamadı.");

      // Veritabanı tablosu 'jobs' olsa da içerik tamamen 'Eğitim/Gelişim' odaklı kaydediliyor
      const { error } = await supabase.from("jobs").insert([{
        company_id: auth.user.id,
        title: formData.title,
        description: formData.description,
        location: `${formData.work_model} - ${formData.country}`,
        salary_range: "Eğitim Programı", // Maaş yerine sabit değer
        requirements: formData.requirements,
        metadata: {
          work_model: formData.work_model,
          country: formData.country,
          required_language: formData.required_lang,
          language_min_level: parseInt(formData.lang_level),
          is_global: true,
          type: "mentoring_program",
          legal_status: "educational_content"
        },
        status: "active",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success("Gelişim programı başarıyla oluşturuldu!");
      navigate("/kurumsal/yonetim");
    } catch (err: any) {
      toast.error("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-20">
      <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100 rounded-xl transition font-bold text-slate-500">
        <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
      </Button>

      {/* YASAL ZIRH BANNERI */}
      <div className="bg-slate-900 border-l-4 border-orange-600 p-5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-orange-500 h-6 w-6 shrink-0" />
          <div>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">Yasal Bilgilendirme</p>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Bu panel sadece **kurumsal gelişim programları** ve **mentorluk vakaları** oluşturmak içindir. 
              Sistem üzerinden "iş ilanı" veya "personel alımı" yapılması yasaktır. Tüm süreçler eğitim mevzuatına tabidir.
            </p>
          </div>
        </div>
      </div>

      <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Program Başlat</CardTitle>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Yeni Gelişim & Mentorluk Vakası</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                  Mentorluk Alanı / Program Başlığı
                </label>
                <input 
                  required
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white outline-none focus:border-orange-500 transition font-bold text-slate-700"
                  placeholder="Örn: Global Lojistik Yönetimi Vaka Analizi"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                    Eğitim Dili
                  </label>
                  <select 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white outline-none font-bold text-slate-700 focus:border-orange-500"
                    value={formData.required_lang}
                    onChange={(e) => setFormData({...formData, required_lang: e.target.value})}
                  >
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                    Hedef Seviye
                  </label>
                  <select 
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white outline-none font-bold text-slate-700 focus:border-orange-500"
                    value={formData.lang_level}
                    onChange={(e) => setFormData({...formData, lang_level: e.target.value})}
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v}>Seviye {v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8 bg-orange-50/50 rounded-[2.5rem] border-2 border-orange-100/50">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-orange-600 ml-1 flex items-center gap-2">
                  <Sparkles size={14} /> Mentorluk Modeli
                </label>
                <select 
                  className="w-full p-4 rounded-xl border-none bg-white outline-none font-bold shadow-sm text-slate-700"
                  value={formData.work_model}
                  onChange={(e) => setFormData({...formData, work_model: e.target.value})}
                >
                  <option>Online (Canlı Seans)</option>
                  <option>Hibrit (Gelişim Odaklı)</option>
                  <option>Grup Mentorluğu</option>
                  <option>Birebir Kariyer Danışmanlığı</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-orange-600 ml-1 flex items-center gap-2">
                  <MapPin size={14} /> Odak Bölge
                </label>
                <select 
                  className="w-full p-4 rounded-xl border-none bg-white outline-none font-bold shadow-sm text-slate-700"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Program Detayları & Vaka Tanımı
              </label>
              <textarea 
                required
                className="w-full p-6 rounded-[2rem] border-2 border-slate-100 bg-white min-h-[150px] outline-none font-medium text-slate-600 focus:border-orange-500 transition"
                placeholder="Bu gelişim programında katılımcılar hangi senaryolar üzerinde çalışacak? Mentorluk sürecinin sonunda hangi yetkinliklerin kazanılması hedefleniyor?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-orange-600 ml-1">
                Beklenen Gelişim Yetkinlikleri
              </label>
              <textarea 
                required
                className="w-full p-6 rounded-[2rem] border-2 border-orange-100 bg-white min-h-[100px] outline-none font-medium text-slate-600 focus:border-orange-600 transition"
                placeholder="Örn: Analitik Düşünme, Dijital Okuryazarlık, Stratejik Karar Verme..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <Button 
              disabled={loading} 
              type="submit" 
              className="w-full h-20 rounded-[2rem] bg-orange-600 hover:bg-slate-900 text-white text-xl font-black shadow-2xl shadow-orange-200 transition-all active:scale-[0.98] uppercase italic tracking-[0.1em]"
            >
              {loading ? "Sistem Yapılandırılıyor..." : "Gelişim Programını Yayına Al"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="p-6 bg-slate-100 rounded-3xl text-center">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] leading-relaxed">
          Kariyeer.com bir teknoloji altyapı sağlayıcısıdır. Yayınlanan programlar eğitim amaçlı olup, 4904 sayılı kanun kapsamındaki istihdam faaliyetlerini içermez.
        </p>
      </div>
    </div>
  );
}
