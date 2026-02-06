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
  Award
} from "lucide-react";

// Alfabetik Ülke Listesi (Supa entegrasyonu için)
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
    lang_level: "3", // Default: Intermediate
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Oturum bulunamadı.");

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
          is_global: true
        },
        status: "active",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success("Global ilan yayında! AI motoru dil seviyesine göre adayları tarıyor.");
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

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white p-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Global İlan & Dil Matcher</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Adayların dil seviyelerini (1-5) AI ile otomatik eşleştirin.</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Pozisyon Başlığı
                </label>
                <input 
                  required
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-red-500 transition"
                  placeholder="Örn: Global Sales Manager"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Languages className="h-4 w-4" /> Zorunlu Dil
                  </label>
                  <select 
                    className="w-full p-4 rounded-2xl border bg-gray-50/50 outline-none"
                    value={formData.required_lang}
                    onChange={(e) => setFormData({...formData, required_lang: e.target.value})}
                  >
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" /> Min. Seviye
                  </label>
                  <select 
                    className="w-full p-4 rounded-2xl border bg-gray-50/50 outline-none"
                    value={formData.lang_level}
                    onChange={(e) => setFormData({...formData, lang_level: e.target.value})}
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v}>Seviye {v} {v === 5 ? "(Native)" : v === 1 ? "(Basic)" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-red-50/30 rounded-[2rem] border border-red-50">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-red-600" /> Çalışma Modeli
                </label>
                <select 
                  className="w-full p-3 rounded-xl border bg-white outline-none"
                  value={formData.work_model}
                  onChange={(e) => setFormData({...formData, work_model: e.target.value})}
                >
                  <option>Remote (Global)</option>
                  <option>Remote (Region Restricted)</option>
                  <option>Hybrid</option>
                  <option>On-site (Office)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" /> Hedef Ülke (Alfabetik)
                </label>
                <select 
                  className="w-full p-3 rounded-xl border bg-white outline-none"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <AlignLeft className="h-4 w-4" /> İş Açıklaması
              </label>
              <textarea 
                required
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 min-h-[120px] outline-none"
                placeholder="Global vizyonunuzdan bahsedin..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-red-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Teknik & Global Yetkinlikler
              </label>
              <textarea 
                required
                className="w-full p-4 rounded-2xl border border-red-100 bg-red-50/20 min-h-[80px] outline-none"
                placeholder="Örn: Leadership, Strategic Thinking, SAP, Python..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <Button 
              disabled={loading} 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-xl shadow-red-200 transition-all active:scale-[0.95]"
            >
              {loading ? "AI Matcher Hazırlanıyor..." : "İlanı Globalde Yayınla"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
