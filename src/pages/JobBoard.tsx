// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Briefcase, MapPin, Building2, Star, Rocket, ShieldCheck } from "lucide-react";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Milyon dolarlık algoritma: İlanları AI skoruna göre çek
  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .eq("post_type", "job") // Sadece 'job' tipindeki postları getir
      .order("ai_score", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("İlanlar yüklenirken bir sorun oluştu.");
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* ÜST HEADER - UNICORN DESIGN */}
      <div className="bg-white border-b border-gray-100 py-12 mb-8 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-[#1E1E1E] tracking-tight">
                Kariyerini <span className="text-[#E63946]">Yeniden Tanımla</span>
              </h1>
              <p className="text-gray-500 mt-2 font-medium">AI tabanlı eşleşme ile en uygun fırsatları keşfet.</p>
            </div>
            
            {/* SADECE ŞİRKETLER İÇİN İLAN AÇMA BUTONU */}
            {user?.role === "corporate" && (
              <Button className="bg-[#E63946] hover:bg-[#D62828] text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-red-100 transition-all flex gap-2">
                <Rocket size={18} /> Yeni İlan Yayınla
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL KOLON - FİLTRELER */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 border-none shadow-xl rounded-[32px] bg-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" size={20} fill="currentColor" /> Akıllı Filtreler
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 cursor-pointer transition-all">
                <p className="text-[10px] uppercase font-black text-gray-400">Departman</p>
                <p className="font-bold text-sm text-gray-700">Teknoloji & Yazılım</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 cursor-pointer transition-all">
                <p className="text-[10px] uppercase font-black text-gray-400">Çalışma Şekli</p>
                <p className="font-bold text-sm text-gray-700">Remote / Uzaktan</p>
              </div>
            </div>
          </Card>
        </div>

        {/* SAĞ KOLON - İLAN LİSTESİ */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="group p-0 border-none shadow-lg hover:shadow-2xl rounded-[32px] overflow-hidden transition-all duration-500 bg-white border-2 border-transparent hover:border-[#E63946]/10">
                <div className="flex items-center p-6 gap-6">
                  {/* Şirket Logosu */}
                  <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                    {job.author_avatar ? (
                      <img src={job.author_avatar} className="w-full h-full rounded-3xl object-cover" />
                    ) : (
                      <Building2 className="text-gray-300" size={32} />
                    )}
                  </div>

                  {/* İlan Detay */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-wider">Tam Zamanlı</span>
                      {job.post_is_premium && (
                        <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                          <Rocket size={10} /> Öne Çıkarılan
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-gray-800 group-hover:text-[#E63946] transition-colors line-clamp-1">
                      {job.content?.split('\n')[0] || "Kıdemli Yazılım Geliştirici"}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400 font-medium">
                      <span className="flex items-center gap-1"><Building2 size={14} /> {job.author_name}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> İstanbul / Remote</span>
                    </div>
                  </div>

                  {/* Aksiyon */}
                  <div className="flex flex-col items-end gap-2">
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">AI Eşleşme</p>
                        <p className="text-xl font-black text-green-500 italic">%{Math.min(99, (job.ai_score * 10).toFixed(0))}</p>
                     </div>
                     <Button className="rounded-xl bg-gray-900 hover:bg-[#E63946] text-white px-6 transition-all">
                        Başvur
                     </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
               <Briefcase className="mx-auto text-gray-200 mb-4" size={48} />
               <p className="text-gray-400 font-bold italic">Şu an aktif ilan bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
