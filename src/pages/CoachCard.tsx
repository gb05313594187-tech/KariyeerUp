// @ts-nocheck
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type CoachCardProps = {
  coach: {
    id: string | number;
    name: string;
    title: string;
    rating: number;
    reviews?: number;
    image: string;
    experience: string;
    nextAvailable: string;
    specialties?: string[];
    price: number;
    isVerified?: boolean;  // mavi tik
    isPremium?: boolean;   // premium rozet
    isFeatured?: boolean;  // öne çıkan
  };
};

export default function CoachCard({ coach }: CoachCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={
        "rounded-2xl border shadow-md hover:shadow-2xl transition-all overflow-hidden group bg-white " +
        (coach.isFeatured
          ? "border-orange-500 ring-2 ring-orange-300/50"
          : "border-gray-200")
      }
    >
      {/* Üst gradient */}
      <div className="relative h-28 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        {/* Premium rozet */}
        {coach.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-bold text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Premium Koç
          </div>
        )}

        {/* Öne çıkan etiketi */}
        {coach.isFeatured && (
          <div className="absolute bottom-3 right-3 bg-white/90 text-orange-600 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
            Öne Çıkan Koç
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="px-6 pb-6 relative">
        {/* Foto */}
        <div className="absolute -top-10 left-6 p-1 bg-white rounded-xl shadow-md">
          <img
            src={coach.image}
            alt={coach.name}
            className="w-24 h-24 rounded-xl object-cover"
          />
        </div>

        {/* İsim + mavi tik + puan */}
        <div className="mt-12 flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">
                {coach.name}
              </h3>

              {coach.isVerified && (
                <CheckCircle2
                  className="w-4 h-4 text-sky-500"
                  title="Doğrulanmış koç"
                />
              )}
            </div>
            <p className="text-gray-500 text-sm">{coach.title}</p>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 font-bold">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              {coach.rating?.toFixed ? coach.rating.toFixed(1) : coach.rating}
            </div>
            {coach.reviews != null && (
              <span className="text-xs text-gray-400 mt-1">
                ({coach.reviews} yorum)
              </span>
            )}
          </div>
        </div>

        {/* Detay kutusu */}
        <div className="mt-4 bg-gray-50 p-4 rounded-xl space-y-3 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            {coach.experience} profesyonel deneyim
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            En erken müsaitlik:{" "}
            <span className="text-green-700 font-bold">
              {coach.nextAvailable}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            Online görüntülü görüşme
          </div>
        </div>

        {/* Etiketler */}
        {coach.specialties && coach.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {coach.specialties.map((tag) => (
              <span
                key={tag}
                className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Fiyat + buton */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">45 dk. seans ücreti</p>
            <p className="text-2xl font-bold text-gray-900">{coach.price}₺</p>
          </div>

          <button
            onClick={() => navigate(`/coach/${coach.id}`)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition shadow-md hover:shadow-lg"
          >
            Profili İncele <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
