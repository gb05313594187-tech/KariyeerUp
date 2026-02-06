// src/pages/CreateJob.tsx
// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Briefcase, MapPin, AlignLeft, Sparkles, ArrowLeft } from "lucide-react";

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "Remote",
    salary_range: "",
    requirements: ""
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
        location: formData.location,
        salary_range: formData.salary_range,
        requirements: formData.requirements,
        status: "active",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success("İlan başarıyla yayınlandı! AI Match motoru adayları taramaya başladı.");
      navigate("/corporate/dashboard");
    } catch (err: any) {
      toast.error("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
      </Button>

      <Card className="rounded-3xl border-none shadow-xl">
        <CardHeader className="border-b bg-gray-50/50 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-red-600" />
            <CardTitle>Yeni İş İlanı Oluştur</CardTitle>
          </div>
          <p className="text-sm text-gray-500">AI motoru bu verileri kullanarak en uygun adayları listeleyecektir.</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Pozisyon Başlığı
              </label>
              <input 
                required
                className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Örn: Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Konum
                </label>
                <select 
                  className="w-full p-3 rounded-xl border outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  <option>Remote</option>
                  <option>İstanbul</option>
                  <option>Ankara</option>
                  <option>Hibrit</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maaş Aralığı (Opsiyonel)</label>
                <input 
                  className="w-full p-3 rounded-xl border outline-none"
                  placeholder="Örn: 80.000 - 120.000 TL"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlignLeft className="h-4 w-4" /> İş Açıklaması
              </label>
              <textarea 
                required
                className="w-full p-3 rounded-xl border min-h-[120px] outline-none"
                placeholder="Şirketiniz ve rölün detaylarından bahsedin..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-red-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Teknik Gereksinimler (AI için kritik)
              </label>
              <textarea 
                required
                className="w-full p-3 rounded-xl border border-red-100 bg-red-50/30 min-h-[80px] outline-none"
                placeholder="Örn: React, TypeScript, Tailwind CSS, Vite..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">
              {loading ? "Yayınlanıyor..." : "İlanı Canlıya Al"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
