// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Star, 
  Rocket, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  CheckCircle2,
  X
} from "lucide-react";

/* =========================================================
   🚀 PREMIUM BOOST MODAL BİLEŞENİ
   ========================================================= */
const PremiumBoostModal = ({ job, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Yapay bir bekleme ile premium hissi veriyoruz
    setTimeout(async () => {
      const { error } = await supabase.rpc('boost_post_to_premium', { 
        target_post_id: job.id 
      });

      if (error) {
        console.error(error);
        toast.error("Ödeme işlemi başarısız oldu.");
      } else {
        toast.success("Ödeme Başarılı! İlanın Zirveye Taşındı 🚀");
        onSuccess();
        onClose();
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <div className="bg-gradient-to-br from-[#E63946] to-[#D62828] p-10 text-white text-center">
          <Rocket size={54} className="mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-black tracking-tighter">PREMIUM BOOST</h2>
          <p className="opacity-80 font-medium">İlanını anında binlerce adaya ulaştır.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <CheckCircle2 className="text-green-500" size={20} /> AI Algoritmasında %500 Öncelik
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <CheckCircle2 className="text-green-500" size={20} /> "Sponsorlu" Rozeti ile Dikkat Çek
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <CheckCircle2 className="text-green-500" size={20} /> En Üst Sırada Sabitlenme
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Ödenecek Tutar</span>
              <span className="text-3xl font-black text-gray-900">₺499</span>
            </div>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#1E1E1E] hover:bg-black text-white h-16 rounded-2xl font-black text-lg flex gap-3 transition-all active:scale-95"
            >
              {loading ? "İşleniyor..." : <><CreditCard /> Şimdi Öde ve Yükselt</>}
            </Button>
          </div>

          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
            <ShieldCheck size={12} className="inline mr-1" /> KariyeerUp Güvenli Ödeme Altyapısı
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   🎯 ANA JOB BOARD SAYFASI
   ========================================================= */
export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForBoost, setSelectedJobForBoost] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .eq("post_type", "job")
      .order("ai_score", { ascending: false });

    if (error) {
      toast.error("İlanlar yüklenemedi.");
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
      {/* Boost Modal Render */}
      {selectedJobForBoost && (
        <PremiumBoostModal 
          job={selectedJobForBoost} 
          onClose={() => setSelectedJobForBoost(null)} 
          onSuccess={fetchJobs}
        />
      )}

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 py-16 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-black text-[#1E1E1E] tracking-tighter">
                Kariyerini <span className="text-[#E63946]">Yeniden Tanımla</span>
              </h1>
              <p className="text-gray-500 mt-3 text-lg font-medium italic">AI tabanlı eşleşme motoru ile en iyi %1'lik dilime gir.</p>
            </div>
            
            {user?.role === "corporate" && (
              <Button className="bg-[#E63946] hover:bg-[#D62828] text-white rounded-[24px] px-10 h-14 text-lg font-black shadow-xl shadow-red-100 transition-all hover:scale-105 flex gap-2">
                <Rocket size={20} /> Yeni İlan Yayınla
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SOL KOLON - FİLTRELER */}
        <div className="lg:col-span-3">
          <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white sticky top-10">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <TrendingUp className="text-[#E63946]" size={24} /> Akıllı Filtreler
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 cursor-pointer transition-all group">
                <p className="text-[10px] uppercase font-black text-gray-400 group-hover:text-[#E63946]">Departman</p>
                <p className="font-black text-sm text-gray-700">Teknoloji & Yazılım</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 cursor-pointer transition-all group">
                <p className="text-[10px] uppercase font-black text-gray-400 group-hover:text-[#E63946]">Lokasyon</p>
                <p className="font-black text-sm text-gray-700">Remote / Uzaktan</p>
              </div>
            </div>
          </Card>
        </div>

        {/* SAĞ KOLON - İLAN LİSTESİ */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
               <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
               <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-xs">AI Eşleşmeleri Hesaplanıyor...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className={`group p-0 border-none shadow-lg hover:shadow-2xl rounded-[40px] overflow-hidden transition-all duration-500 bg-white border-2 ${job.post_is_premium ? 'ring-2 ring-[#E63946] ring-offset-4' : 'border-transparent'}`}>
                <div className="flex flex-col md:flex-row items-center p-8 gap-8">
                  {/* Şirket Logosu */}
                  <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-500 shadow-inner shrink-0">
                    {job.author_avatar ? (
                      <img src={job.author_avatar} className="w-full h-full rounded-[32px] object-cover" />
                    ) : (
                      <Building2 className="text-gray-300" size={40} />
                    )}
                  </div>

                  {/* İlan Detay */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-3">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Tam Zamanlı</span>
                      {job.post_is_premium && (
                        <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                          <Rocket size={12} /> Premium İlan
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 group-hover:text-[#E63946] transition-colors line-clamp-1 mb-2">
                      {job.content?.split('\n')[0] || "Pozisyon Belirtilmemiş"}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-5 text-sm text-gray-400 font-bold">
                      <span className="flex items-center gap-2"><Building2 size={16} /> {job.author_name}</span>
                      <span className="flex items-center gap-2"><MapPin size={16} /> İstanbul / Remote</span>
                    </div>
                  </div>

                  {/* Aksiyon */}
                  <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                     <div className="text-center md:text-right bg-green-50 p-3 rounded-2xl border border-green-100">
                        <p className="text-[10px] font-black text-green-600/50 uppercase tracking-tighter">AI Match Score</p>
                        <p className="text-2xl font-black text-green-600 italic leading-none">%{Math.min(99, (job.ai_score * 10 + 60).toFixed(0))}</p>
                     </div>
                     <div className="flex gap-2">
                        {user?.id === job.author_id && !job.post_is_premium && (
                          <Button 
                            onClick={() => setSelectedJobForBoost(job)}
                            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 h-11 transition-all flex gap-2 font-bold"
                          >
                            <Rocket size={16} /> Boost
                          </Button>
                        )}
                        <Button className="rounded-xl bg-[#1E1E1E] hover:bg-[#E63946] text-white px-8 h-11 font-black transition-all shadow-lg hover:shadow-red-200">
                           Başvur
                        </Button>
                     </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[40px] border-4 border-dashed border-gray-50 flex flex-col items-center">
               <Briefcase className="text-gray-200 mb-4" size={64} />
               <p className="text-gray-400 font-black text-xl italic">Henüz bir ilan yayınlanmadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
