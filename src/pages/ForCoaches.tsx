// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  Users,
  CalendarClock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CoachList() {
  const navigate = useNavigate();

  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔴 TABLO ADINI BURADA GÜNCELLEDİM
        const { data, error } = await supabase
          .from("app_2dff651lda_coaches")
          .select("*")
          .eq("status", "approved")   // is_active yerine status kullanıyoruz
          .order("rating", { ascending: false });

        if (error) throw error;
        setCoaches(data || []);
      } catch (err: any) {
        console.error("Koçlar çekilirken hata:", err.message);
        setError("Koç listesi yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 pb-20 pt-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold tracking-widest uppercase mb-5">
            Koçlar İçin Özel
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            Kariyeer Ekosisteminin Bir <br />
            <span className="text-yellow-300">Parçası Olun</span>
          </h1>
          <p className="text-base md:text-lg text-red-50 max-w-2xl mx-auto mb-10">
            Pasif gelir, profesyonel gelişim ve sektörde tanınırlık için ideal
            platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/coach-application")}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-red-600 font-bold text-sm md:text-base shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Hemen Başvur
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("selection-process");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/70 text-white font-semibold text-sm md:text-base hover:bg-white/10 transition-colors"
            >
              Seçim Süreci
            </button>
          </div>
        </div>
      </section>

      {/* 🔴 AKTİF KOÇLAR LİSTESİ */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Aktif Koçlar
          </h2>
          <p className="text-sm text-gray-500">
            Ekosisteme kabul edilen koçlardan birkaçı
          </p>
        </div>

        {loading && (
          <p className="text-gray-500 text-sm">Koçlar yükleniyor...</p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {!loading && !error && coaches.length === 0 && (
          <p className="text-gray-500 text-sm">
            Henüz yayınlanmış koç bulunmuyor. Çok yakında burada göreceksiniz.
          </p>
        )}

        {!loading && !error && coaches.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/coaches/${coach.id}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {coach.avatar_url ? (
                      <img
                        src={coach.avatar_url}
                        alt={coach.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-500">
                        {coach.full_name?.[0]?.toUpperCase() || "K"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {coach.full_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {coach.title || "Kariyer Koçu"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {coach.bio}
                </p>

                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">
                      {coach.rating ? Number(coach.rating).toFixed(1) : "4.8"}
                    </span>
                  </div>

                  <div className="text-gray-500 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      {coach.experience_years
                        ? `${coach.experience_years}+ yıl`
                        : "2+ yıl"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-500">
                    {coach.languages || "TR"}
                  </span>

                  <span className="font-bold text-gray-900">
                    {coach.hourly_rate
                      ? `${coach.hourly_rate}₺ / seans`
                      : "750₺ / seans"}
                  </span>
                </div>

                <button className="mt-auto inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                  Profili Görüntüle
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
