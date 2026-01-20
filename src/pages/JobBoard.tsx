// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Briefcase, MapPin, Building2, Star, Rocket, ShieldCheck, 
  TrendingUp, CreditCard, CheckCircle2, X, DollarSign 
} from "lucide-react";

/* =========================================================
   🏢 ŞİRKETLERE ÖZEL İLAN YAYINLAMA FORMU (MODAL)
   ========================================================= */
const CreateJobModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullContent = `${formData.title}\n${formData.description}\nLokasyon: ${formData.location}\nMaaş: ${formData.salary}`;

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: fullContent,
      post_type: "job",
      visibility: "public"
    });

    if (error) {
      toast.error("Hata: " + error.message);
    } else {
      toast.success("İlanınız başarıyla yayına alındı! 🚀");
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Yeni İlan Yayınla</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="İş Başlığı" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Lokasyon" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <input placeholder="Maaş Aralığı (Örn: 50k-80k TL)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold" onChange={(e) => setFormData({...formData, salary: e.target.value})} />
          <textarea required rows={4} placeholder="İş açıklaması ve aranan kriterler..." className="w-full p-6 bg-gray-50 rounded-[32px] border-none font-medium" onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Button disabled={loading} className="w-full bg-[#E63946] hover:bg-black text-white h-16 rounded-2xl font-black text-xl flex gap-3">
            {loading ? "Yayınlanıyor..." : <><Rocket size={20} /> İlanı Paylaş</>}
          </Button>
        </form>
      </Card>
    </div>
  );
};

/* =========================================================
   🚀 PREMIUM BOOST MODAL BİLEŞENİ
   ========================================================= */
const PremiumBoostModal = ({ job, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      const { error } = await supabase.rpc('boost_post_to_premium', { target_post_id: job.id });
      if (!error) {
        toast.success("Premium Aktif! İlanın Zirvede! 🚀");
        onSuccess();
        onClose();
      } else {
        toast.error("Ödeme hatası.");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4 text-center">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative p-10 space-y-6">
        <Rocket size={60} className="mx-auto text-[#E63946] animate-bounce" />
        <h2 className="text-3xl font-black tracking-tighter italic">PREMIUM BOOST</h2>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 font-bold text-gray-600"><CheckCircle2 className="text-green-500" /> AI Skorunda %500 Artış</div>
          <div className="flex items-center gap-3 font-bold text-gray-600"><CheckCircle2 className="text-green-500" /> Sponsorlu Rozeti</div>
        </div>
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-400">Tutar:</span>
          <span className="text-3xl font-black">₺499</span>
        </div>
        <Button onClick={handlePayment} disabled={loading} className="w-full bg-black text-white h-16 rounded-2xl font-black text-lg">
          {loading ? "İşleniyor..." : "Şimdi Öde ve Yükselt"}
        </Button>
        <button onClick={onClose} className="text-gray-400 font-bold text-sm">Vazgeç</button>
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJobForBoost, setSelectedJobForBoost] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .eq("post_type", "job")
      .order("ai_score", { ascending: false });

    if (!error) setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Modallar */}
      {showCreateModal && <CreateJobModal onClose={() => setShowCreateModal(false)} onSuccess={fetchJobs} />}
      {selectedJobForBoost && <PremiumBoostModal job={selectedJobForBoost} onClose={() => setSelectedJobForBoost(null)} onSuccess={fetchJobs} />}

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 py-16 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h1 className="text-5xl font-black text-[#1E1E1E] tracking-tighter">Kariyerini <span className="text-[#E63946]">Yeniden Tanımla</span></h1>
            <p className="text-gray-500 mt-3 text-lg font-medium italic">AI motoru ile en uygun şirketlerle eşleş.</p>
          </div>
          {user?.role === "corporate" && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-[#E63946] hover:bg-black text-white rounded-[24px] px-10 h-14 text-lg font-black shadow-xl transition-all flex gap-2">
              <Rocket size={20} /> Yeni İlan Yayınla
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white sticky top-10">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2"><TrendingUp className="text-[#E63946]" /> Akıllı Filtreler</h3>
            <div className="space-y-4">
               <div className="p-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-700 cursor-pointer border border-transparent hover:border-red-200 transition-all">Teknoloji & Yazılım</div>
               <div className="p-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-700 cursor-pointer border border-transparent hover:border-red-200 transition-all">Remote / Uzaktan</div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
               <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
               <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Adaylar Analiz Ediliyor...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className={`group p-8 border-none shadow-lg hover:shadow-2xl rounded-[40px] transition-all bg-white border-2 ${job.post_is_premium ? 'ring-2 ring-[#E63946] ring-offset-4' : 'border-transparent'}`}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-500 shrink-0 shadow-inner">
                    {job.author_avatar ? <img src={job.author_avatar} className="w-full h-full rounded-[32px] object-cover" /> : <Building2 className="text-gray-300" size={40} />}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-2 mb-2">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest italic">Tam Zamanlı</span>
                      {job.post_is_premium && <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5"><Rocket size={10} /> Sponsorlu</span>}
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 group-hover:text-[#E63946] transition-colors line-clamp-1">{job.content?.split('\n')[0] || "İş İlanı"}</h2>
                    <div className="flex justify-center md:justify-start gap-4 mt-2 text-sm text-gray-400 font-bold">
                      <span className="flex items-center gap-1"><Building2 size={16} /> {job.author_name}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> İstanbul / Remote</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                     <div className="text-center md:text-right bg-green-50 p-3 rounded-2xl border border-green-100 w-full md:w-auto">
                        <p className="text-[10px] font-black text-green-600/50 uppercase italic">Match Score</p>
                        <p className="text-2xl font-black text-green-600 italic leading-none">%{Math.min(99, (job.ai_score * 10 + 60).toFixed(0))}</p>
                     </div>
                     <div className="flex gap-2">
                        {user?.id === job.author_id && !job.post_is_premium && (
                          <Button onClick={() => setSelectedJobForBoost(job)} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 h-11 font-bold flex gap-2"><Rocket size={16} /> Boost</Button>
                        )}
                        <Button className="rounded-xl bg-black hover:bg-[#E63946] text-white px-8 h-11 font-black shadow-lg">Başvur</Button>
                     </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[40px] border-4 border-dashed border-gray-50 flex flex-col items-center">
               <Briefcase className="text-gray-200 mb-4" size={64} />
               <p className="text-gray-400 font-black text-xl italic text-center px-4">Şu an aktif bir fırsat bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
