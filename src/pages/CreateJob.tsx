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
  Clock, 
  Languages 
} from "lucide-react";

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
    language_req: "English (Professional)",
    timezone: "Any Timezone"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Oturum bulunamadı.");

      // Supabase 'jobs' tablosuna kayıt
      const { error } = await supabase.from("jobs").insert([{
        company_id: auth.user.id,
        title: formData.title,
        description: formData.description,
        location: `${formData.work_model} - ${formData.country} ${formData.city ? '/ ' + formData.city : ''}`,
        salary_range: formData.salary_range,
        requirements: formData.requirements,
        metadata: {
          work_model: formData.work_model,
          country: formData.country,
          timezone: formData.timezone,
          language: formData.language_req
        },
        status: "active",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success("Global ilan başarıyla yayınlandı! AI Match dünya çapında adayları tarıyor.");
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
            <div className="p-3 bg-red-50 rounded-2xl">
              <Globe2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Global İş İlanı Oluştur</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Dünya çapındaki yeteneklere ulaşmak için detayları belirleyin.</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Temel Bilgiler */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Briefcase className="h-4 w-4" /> Pozisyon Başlığı
                </label>
                <input 
                  required
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-red-500 transition"
                  placeholder="Örn: Senior Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Languages className="h-4 w-4" /> Dil Gereksinimi
                </label>
                <select 
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none"
                  value={formData.language_req}
                  onChange={(e) => setFormData({...formData, language_req: e.target.value})}
                >
                  <option>English (Professional)</option>
                  <option>Turkish & English</option>
                  <option>Multi-Language (EU)</option>
                  <option>No Language Requirement</option>
                </select>
              </div>
            </div>

            {/* Global Konum Ayarları */}
            <div className="grid md:grid-cols-3 gap-4 p-6 bg-red-50/30 rounded-[2rem] border border-red-50">
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
                  <MapPin className="h-4 w-4 text-red-600" /> Hedef Ülke / Bölge
                </label>
                <input 
                  className="w-full p-3 rounded-xl border bg-white outline-none"
                  placeholder="Örn: Worldwide veya USA"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" /> Saat Dilimi (Timezone)
                </label>
                <select 
                  className="w-full p-3 rounded-xl border bg-white outline-none"
                  value={formData.timezone}
                  onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                >
                  <option>Any Timezone</option>
                  <option>UTC+3 (Turkey Time)</option>
                  <option>UTC-5 (EST - USA)</option>
                  <option>UTC+1 (CET - Europe)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <AlignLeft className="h-4 w-4" /> İş Açıklaması (Global Vision)
              </label>
              <textarea 
                required
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 min-h-[150px] outline-none"
                placeholder="Şirketinizin global hedeflerinden ve adaydan beklentilerinizden bahsedin..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-red-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Global Yetkinlikler (AI Match için kritik)
              </label>
              <textarea 
                required
                className="w-full p-4 rounded-2xl border border-red-100 bg-red-50/20 min-h-[100px] outline-none"
                placeholder="Örn: Cloud Architecture, React, English Communication, Agile, Docker..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <Button 
              disabled={loading} 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-xl shadow-red-200 transition-all active:scale-[0.98]"
            >
              {loading ? "Global Sistem Hazırlanıyor..." : "İlanı Tüm Dünyada Yayınla"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
