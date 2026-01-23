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
  Rocket,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   🚀 PREMIUM BOOST MODAL
   ========================================================= */
const PremiumBoostModal = ({ job, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      const { error } = await supabase.rpc("boost_post_to_premium", {
        target_post_id: job.id,
      });

      if (!error) {
        toast.success("Premium Aktif! 🚀");
        onSuccess();
        onClose();
      } else {
        toast.error("Ödeme hatası");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-6 text-center">
        <Rocket size={60} className="mx-auto text-[#E63946]" />
        <h2 className="text-3xl font-black italic">PREMIUM BOOST</h2>

        <div className="space-y-3 text-left">
          <div className="flex gap-3 font-bold text-gray-600">
            <CheckCircle2 className="text-green-500" /> AI Skoru %500 artar
          </div>
          <div className="flex gap-3 font-bold text-gray-600">
            <CheckCircle2 className="text-green-500" /> Sponsorlu Rozet
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl flex justify-between">
          <span className="font-bold text-gray-400">Tutar</span>
          <span className="text-3xl font-black">₺499</span>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-black text-white h-16 rounded-2xl font-black"
        >
          {loading ? "İşleniyor..." : "Şimdi Yükselt"}
        </Button>

        <button
          onClick={onClose}
          className="text-gray-400 font-bold text-sm"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   🎯 JOB BOARD (READ-ONLY)
   ========================================================= */
export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForBoost, setSelectedJobForBoost] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("mentor_circle_feed_ai")
      .select("*")
      .eq("post_type", "job")
      .order("ai_score", { ascending: false });

    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {selectedJobForBoost && (
        <PremiumBoostModal
          job={selectedJobForBoost}
          onClose={() => setSelectedJobForBoost(null)}
          onSuccess={fetchJobs}
        />
      )}

      {/* HEADER */}
      <div className="bg-white border-b py-16 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-black tracking-tighter">
            Kariyerini{" "}
            <span className="text-[#E63946]">Yeniden Tanımla</span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg italic">
            AI motoru ile en uygun ilanları keşfet
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-10">
        {/* FILTER */}
        <div className="lg:col-span-3">
          <Card className="p-8 rounded-[40px] shadow-xl sticky top-10">
            <h3 className="font-black text-xl mb-6 flex gap-2">
              <TrendingUp className="text-[#E63946]" /> Akıllı Filtreler
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl font-black text-sm cursor-pointer">
                Teknoloji & Yazılım
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl font-black text-sm cursor-pointer">
                Remote / Uzaktan
              </div>
            </div>
          </Card>
        </div>

        {/* JOB LIST */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="py-20 text-center font-black text-gray-400">
              Yükleniyor...
            </div>
          ) : jobs.length ? (
            jobs.map((job) => (
              <Card
                key={job.id}
                className={`p-8 rounded-[40px] shadow-lg ${
                  job.post_is_premium
                    ? "ring-2 ring-[#E63946] ring-offset-4"
                    : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                    {job.author_avatar ? (
                      <img
                        src={job.author_avatar}
                        className="w-full h-full rounded-3xl object-cover"
                      />
                    ) : (
                      <Building2 className="text-gray-300" size={32} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-black">
                      {job.content?.split("\n")[0]}
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-400 font-bold mt-2">
                      <span className="flex gap-1 items-center">
                        <Building2 size={14} /> {job.author_name}
                      </span>
                      <span className="flex gap-1 items-center">
                        <MapPin size={14} /> Remote
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {user?.id === job.author_id &&
                      !job.post_is_premium && (
                        <Button
                          onClick={() =>
                            setSelectedJobForBoost(job)
                          }
                          className="bg-orange-500 text-white rounded-xl"
                        >
                          <Rocket size={16} /> Boost
                        </Button>
                      )}
                    <Button className="bg-black text-white rounded-xl">
                      Başvur
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[40px]">
              <Briefcase size={64} className="mx-auto text-gray-200" />
              <p className="text-gray-400 font-black mt-4">
                Aktif ilan yok
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
