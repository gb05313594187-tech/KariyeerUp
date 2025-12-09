// src/pages/CoachProfile.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Video,
  Globe2,
  Linkedin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CoachProfile() {
  const { id } = useParams(); // /coach/:id
  const navigate = useNavigate();

  const [coach, setCoach] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Coach profile fetch error:", error);
        setError("Koç profili yüklenirken bir hata oluştu.");
      } else {
        setCoach(data);
      }

      setLoading(false);
    };

    fetchCoach();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white px-6 py-4 rounded-xl shadow-md text-gray-600 font-medium">
          Koç profili yükleniyor...
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white px-6 py-6 rounded-xl shadow-md max-w-md w-full text-center">
          <p className="text-red-600 font-semibold mb-3">{error || "Koç bulunamadı."}</p>
          <button
            onClick={() => navigate("/coaches")}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Koç listesine dön
          </button>
        </div>
      </div>
    );
  }

  const specs = (coach.specializations || []) as string[];
  const price = coach.hourly_rate || 0;
  const currency = coach.currency || "₺";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Üst arka plan */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 h-48 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 pb-16 relative z-10">
        {/* Geri butonu */}
        <button
          onClick={() => navigate("/coaches")}
          className="inline-flex items-center gap-2 mb-4 text-white bg-black/30 hover:bg-black/40 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur"
        >
          <ArrowLeft className="w-4 h-4" />
          Koç listesine dön
        </button>

        {/* Ana kart */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sol: Profil */}
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 p-8 flex flex-col items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white -mt-20 bg-gray-100">
                  <img
                    src={
                      coach.avatar_url ||
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
                    }
                    alt={coach.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-extrabold text-gray-900 text-center">
                {coach.full_name}
              </h1>
              <p className="text-sm font-medium text-red-600 mt-1">
                {coach.title || "Kariyer Koçu"}
              </p>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full text-sm font-semibold text-yellow-800">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span>{coach.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-xs text-gray-500">
                  ({coach.total_reviews || 0} yorum)
                </span>
              </div>

              {/* Kısa bilgiler */}
              <div className="mt-6 w-full space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>
                    {(coach.experience_years || 0).toString()} Yıl profesyonel
                    deneyim
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>
                    En erken müsaitlik:{" "}
                    <span className="font-semibold text-green-600">
                      Online planlanır
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>Online görüntülü seans</span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span>Zoom / Google Meet</span>
                </div>
              </div>

              {/* Fiyat + buton */}
              <div className="mt-8 w-full">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-500 font-medium">
                        45 Dk. Seans Ücreti
                      </span>
                      <div className="text-2xl font-extrabold text-gray-900 mt-1">
                        {price} {currency}
                      </div>
                    </div>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        // burada ileride rezervasyon akışına gidebiliriz
                        alert("Rezervasyon akışı daha sonra bağlanacak 🙂");
                      }}
                    >
                      Seans Planla
                    </button>
                  </div>
                </div>
              </div>

              {/* Sosyal link placeholder'ları */}
              <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
                <Globe2 className="w-4 h-4" />
                <span>Kişisel web sitesi ve LinkedIn entegrasyonu yakında.</span>
              </div>
            </div>

            {/* Sağ: Detaylar */}
            <div className="lg:col-span-2 p-8 lg:p-10 space-y-10">
              {/* Uzmanlık alanları */}
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Uzmanlık Alanları
                </h2>
                {specs.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Koç uzmanlık alanlarını yakında ekleyecek.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {specs.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Hakkında */}
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Hakkında
                </h2>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                  {coach.bio ||
                    "Koç, deneyimi ve uzmanlık alanlarıyla ilgili bilgileri yakında paylaşacak."}
                </div>
              </section>

              {/* Öne çıkan odak alanları / kazanımlar */}
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Kime Nasıl Destek Olur?
                </h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">
                      Kariyer yönünü netleştirmek isteyenler
                    </p>
                    <p className="text-gray-600">
                      Güçlü yönlerini, motivasyonlarını ve kariyer hedeflerini
                      netleştirmek isteyen profesyonellerle çalışır.
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">
                      Terfi / rol değişimi hedefleyenler
                    </p>
                    <p className="text-gray-600">
                      Yöneticilik, takım liderliği veya fonksiyon değişimi gibi
                      adımlarda stratejik kariyer planı oluşturmanıza yardım eder.
                    </p>
                  </div>
                </div>
              </section>

              {/* SSS / seans bilgisi */}
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Seans Bilgileri
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Seans süresi: 45 dakika</li>
                  <li>• Görüşme dili: Türkçe (isteğe göre İngilizce eklenebilir)</li>
                  <li>• Online: Zoom veya Google Meet linki otomatik paylaşılır</li>
                  <li>• Ödeme ve fatura süreci Kariyeed güvenli altyapısı üzerinden yönetilir</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
