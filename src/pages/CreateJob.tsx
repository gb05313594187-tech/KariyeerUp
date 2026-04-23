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
  ShieldCheck
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
    work_model: "Remote (Global)",
    country: "Worldwide",
    city: "",
    salary_range: "",
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

      // Veritabanı tablosu 'jobs' olsa da içerik 'Program' olarak kaydediliyor
      const { error } = await supabase.from("jobs").insert([{
        company_id: auth.user.id,
        title: formData.title,
        description: formData.description,
        location: `${formData.work_model} - ${formData.country}`,
        salary_range: formData.salary_range,
        requirements: formData.requirements,
        metadata: {
          work_model: formData.work_model,
          country: formData.country,
          required_language: formData.required_lang,
          language_min_level: parseInt(formData.lang_level),
          is_global: true,
          type: "mentoring_program" // Tip belirleyici
        },
        status: "active",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success("Gelişim programı yayında! Mentorluk talepleri toplanmaya başlandı.");
      navigate("/corporate/dashboard");
    } catch (err: any) {
      toast.error("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100 rounded-xl transition">
        <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
      </Button>

      {/* YASAL UYARI BANNERI */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
        <ShieldCheck className="text-orange-600 h-5 w-5 shrink-0" />
        <p className="text-[11px] text-orange-800 font-bold uppercase tracking-tight">
          Bu form sadece kariyer mentorluğu ve gelişim vakaları oluşturmak içindir. İşe alım veya personel tedariki amaçlı ilan yayınlanması yasaktır.
        </p>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white p-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Gelişim Programı & Mentorluk Talebi</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Katılımcılar için vaka analizleri ve mentorluk hedefleri tanımlayın.</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <Briefcase className="h-4 w-4" /> Mentorluk Alanı / Program Başlığı
                </label>
                <input 
                  required
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-orange-500 transition font-bold"
                  placeholder="Örn: Kıdemli Satış Yönetimi Mentorluğu"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Languages className="h-4 w-4" /> Eğitim Dili
                  </label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-bold"
                    value={formData.required_lang}
                    onChange={(e) => setFormData({...formData, required_lang: e.target.value})}
                  >
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Award className="h-4 w-4" /> Hedef Seviye
                  </label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none font-bold"
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

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-orange-50/30 rounded-[2rem] border border-orange-50">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <Sparkles className="h-4 w-4 text-orange-600" /> Mentorluk Modeli
                </label>
                <select 
                  className="w-full p-3 rounded-xl border border-white bg-white outline-none font-bold shadow-sm"
                  value={formData.work_model}
                  onChange={(e) => setFormData({...formData, work_model: e.target.value})}
                >
                  <option>Online (Canlı)</option>
                  <option>Hibrit (Görüşme + Ödev)</option>
                  <option>Grup Mentorluğu</option>
                  <option>Birebir Danışmanlık</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-orange-600" /> Coğrafi Odak
                </label>
                <select 
                  className="w-full p-3 rounded-xl border border-white bg-white outline-none font-bold shadow-sm"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <AlignLeft className="h-4 w-4" /> Program Detayları & Vaka Tanımı
              </label>
              <textarea 
                required
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 min-h-[120px] outline-none font-medium"
                placeholder="Bu gelişim programında hangi konular ele alınacak? Katılımcıların hangi vakalar üzerinde çalışması bekleniyor?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Beklenen Teknik Yetkinlikler
              </label>
              <textarea 
                required
                className="w-full p-4 rounded-2xl border border-orange-100 bg-orange-50/20 min-h-[80px] outline-none font-medium"
                placeholder="Örn: Temel Proje Yönetimi, Veri Analizi, Stratejik Planlama..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <Button 
              disabled={loading} 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-lg font-black shadow-xl shadow-orange-100 transition-all active:scale-[0.95] italic uppercase tracking-widest"
            >
              {loading ? "Sistem Hazırlanıyor..." : "Gelişim Programını Başlat"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
        Kariyeer.com üzerinden yayınlanan tüm içerikler eğitim ve mentorluk faaliyetleri kapsamındadır.
      </p>
    </div>
  );
}
