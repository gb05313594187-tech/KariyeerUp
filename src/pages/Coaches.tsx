// src/pages/Coaches.tsx
// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  Clock,
  Briefcase,
  LayoutGrid,
  List,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Coaches() {
  const navigate = useNavigate();

  // Veriler
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [experienceFilter, setExperienceFilter] = useState<string>("5-10 Yıl");
  const [sortOption, setSortOption] = useState<string>("recommended");

  // ------- Supabase'ten koçları çek -------
  useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Coaches fetch error:", error);
        setError("Koç listesi yüklenirken bir hata oluştu.");
      } else {
        setCoaches(data || []);
      }
      setLoading(false);
    };

    fetchCoaches();
  }, []);

  // ---- Filtreleme & Sıralama ----
  const filteredCoaches = useMemo(() => {
    let list = [...coaches];

    // 1) Arama
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter((c) => {
        const specs = (c.specializations || []) as string[];
        return (
          c.full_name?.toLowerCase().includes(q) ||
          c.title?.toLowerCase().includes(q) ||
          c.bio?.toLowerCase().includes(q) ||
          specs.some((s) => s.toLowerCase().includes(q))
        );
      });
    }

    // 2) Uzmanlık kategorisi
    if (selectedCategory !== "Tümü") {
      list = list.filter((c) => {
        const specs = (c.specializations || []) as string[];
        return specs.includes(selectedCategory);
      });
    }

    // 3) Deneyim filtresi (yaklaşık)
    if (experienceFilter === "0-5 Yıl") {
      list = list.filter((c) => (c.experience_years || 0) <= 5);
    } else if (experienceFilter === "5-10 Yıl") {
      list = list.filter(
        (c) =>
          (c.experience_years || 0) >= 5 && (c.experience_years || 0) <= 10
      );
    } else if (experienceFilter === "10+ Yıl") {
      list = list.filter((c) => (c.experience_years || 0) >= 10);
    }

    // 4) Sıralama
    if (sortOption === "rating_desc") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "price_asc") {
      list.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
    } else if (sortOption === "price_desc") {
      list.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
    } else if (sortOption === "exp_desc") {
      list.sort(
        (a, b) => (b.experience_years || 0) - (a.experience_years || 0)
      );
    } else {
      // recommended: rating yüksek + review fazla
      list.sort((a, b) => {
        const scoreA = (a.rating || 0) * 10 + (a.total_reviews || 0);
        const scoreB = (b.rating || 0) * 10 + (b.total_reviews || 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [coaches, searchTerm, selectedCategory, experienceFilter, sortOption]);

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO BÖLÜMÜ */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 pb-16 pt-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Potansiyelinizi Keşfedecek <br />{" "}
            <span className="text-yellow-300">Uzman Koçu</span> Bulun
          </h1>
          <p className="text-lg text-red-50 max-w-2xl mx-auto mb-10">
            ICF sertifikalı, deneyimli ve alanında uzman profesyoneller
            arasından hedeflerinize en uygun yol arkadaşını seçin.
          </p>

          {/* ARAMA KUTUSU */}
          <div className="max-w-3xl mx-auto relative shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20">
            <div className="flex bg-white h-16">
              <div className="flex-1 flex items-center px-6">
                <Search className="text-gray-400 w-6 h-6 mr-4" />
                <input
                  type="text"
                  placeholder="İsim, uzmanlık alanı veya anahtar kelime ile ara..."
                  className="w-full h-full outline-none text-gray-700 text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-gray-900 hover:bg-black text-white font-bold px-10 transition-colors text-lg">
                Ara
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* İÇERİK */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-8 relative z-20">
        {/* ANA LAYOUT: SOL FİLTRE + SAĞ LİSTE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SOL: FİLTRELER */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                  <SlidersHorizontal className="w-5 h-5" /> Filtrele
                </h3>
                <button
                  className="text-xs text-red-600 font-semibold hover:underline"
                  onClick={() => {
                    setSelectedCategory("Tümü");
                    setExperienceFilter("5-10 Yıl");
                    setSortOption("recommended");
                    setSearchTerm("");
                  }}
                >
                  Temizle
                </button>
              </div>

              {/* UZMANLIK ALANI */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">
                  Uzmanlık Alanı
                </h4>
                <div className="space-y-3">
                  {[
                    "Tümü",
                    "Kariyer Geçişi",
                    "Liderlik Koçluğu",
                    "Yeni Mezun Koçluğu",
                    "Yöneticiler için Koçluk",
                    "Mülakat Hazırlığı",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-red-500 transition-colors">
                        {selectedCategory === cat && (
                          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DENEYİM */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">
                  Deneyim
                </h4>
                <div className="space-y-3">
                  {["0-5 Yıl", "5-10 Yıl", "10+ Yıl"].map((exp) => (
                    <label
                      key={exp}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setExperienceFilter(exp)}
                    >
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-500 transition-colors">
                        {experienceFilter === exp && (
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors">
                        {exp}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* FİYAT BİLGİLENDİRME */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">
                  Seans Ücreti (Bilgilendirme)
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  Çoğu koçun 45 dk seans ücreti 750 ₺ - 5000 ₺ aralığındadır.
                </p>
                <div className="px-2">
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    disabled
                  />
                  <div className="flex justify-between text-sm font-bold text-gray-700 mt-3">
                    <span>500 ₺</span>
                    <span>5000 ₺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: LİSTE */}
          <div className="lg:col-span-3">
            {/* ÜST BAR: SAYI + SIRALAMA + GÖRÜNÜM */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
              <p className="text-gray-600 font-medium">
                {loading ? (
                  <span>Koçlar yükleniyor...</span>
                ) : (
                  <>
                    <span className="font-bold text-gray-900 text-lg">
                      {filteredCoaches.length}
                    </span>{" "}
                    koç listeleniyor
                  </>
                )}
              </p>

              <div className="flex items-center gap-4">
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none font-medium"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recommended">Önerilen Sıralama</option>
                  <option value="rating_desc">
                    Puana Göre (Yüksek → Düşük)
                  </option>
                  <option value="price_asc">Fiyata Göre (Artan)</option>
                  <option value="price_desc">Fiyata Göre (Azalan)</option>
                  <option value="exp_desc">Deneyime Göre (Yüksek)</option>
                </select>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-red-50 text-red-600"
                        : "bg-white text-gray-500"
                    } hover:bg-red-50 transition-colors`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-red-50 text-red-600"
                        : "bg-white text-gray-500"
                    } hover:bg-red-50 transition-colors`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* HATA / BOŞ DURUM */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {!loading && !error && filteredCoaches.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                Filtrelere uygun koç bulunamadı. Filtreleri gevşetmeyi veya
                arama terimini değiştirmeyi deneyin.
              </div>
            )}

            {/* KARTLAR */}
            {!error && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {filteredCoaches.map((coach) => {
                  const specs = (coach.specializations || []) as string[];
                  const isPremium =
                    (coach.rating || 0) >= 4.8 &&
                    (coach.total_reviews || 0) >= 20;
                  const price = coach.hourly_rate || 0;
                  const currency = coach.currency || "₺";

                  return (
                    <div
                      key={coach.id}
                      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group flex ${
                        viewMode === "list" ? "flex-row" : "flex-col h-full"
                      }`}
                    >
                      {/* ÜST RENKLİ ALAN */}
                      <div
                        className={`relative ${
                          viewMode === "list" ? "w-44" : "h-28"
                        } bg-gradient-to-r from-red-600 to-orange-500`}
                      >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        {isPremium && (
                          <span className="absolute top-4 right-4 bg-white/90 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                            <Star className="w-3 h-3 fill-current" /> Premium
                            Koç
                          </span>
                        )}
                      </div>

                      <div className="px-6 pb-6 relative flex-1 flex flex-col">
                        {/* Avatar */}
                        <div
                          className={`absolute ${
                            viewMode === "list"
                              ? "-top-10 left-6"
                              : "-top-14 left-6"
                          } p-1 bg-white rounded-2xl shadow-md`}
                        >
                          <img
                            src={
                              coach.avatar_url ||
                              "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
                            }
                            className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                            alt={coach.full_name}
                          />
                        </div>

                        {/* İsim & Puan */}
                        <div
                          className={`${
                            viewMode === "list" ? "mt-10" : "mt-16"
                          } flex justify-between items-start`}
                        >
                          <div>
                            <h3 className="font-bold text-2xl text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                              {coach.full_name}
                            </h3>
                            <p className="text-gray-500 font-medium">
                              {coach.title || "Kariyer Koçu"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 font-bold text-lg">
                              <Star className="w-5 h-5 fill-current text-yellow-500" />
                              {coach.rating?.toFixed(1) || "5.0"}
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                              ({coach.total_reviews || 0} yorum)
                            </span>
                          </div>
                        </div>

                        {/* Detaylar */}
                        <div className="mt-6 space-y-3 text-sm text-gray-700 font-medium bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                            <span>
                              {(coach.experience_years || 0).toString()} Yıl
                              Profesyonel Deneyim
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-green-500" />
                            <span>
                              En erken müsaitlik:{" "}
                              <span className="text-green-600 font-bold">
                                Online planlanır
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-purple-500" />
                            <span>Online görüntülü seans</span>
                          </div>
                        </div>

                        {/* Etiketler */}
                        <div className="mt-6 flex flex-wrap gap-2">
                          {specs.length === 0 && (
                            <span className="bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                              Uzmanlık alanları ekleniyor
                            </span>
                          )}
                          {specs.map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Alt kısım */}
                        <div className="mt-8 pt-6 border-t flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-xs text-gray-500 block font-medium mb-1">
                              45 Dk. Seans Ücreti
                            </span>
                            <span className="text-2xl font-black text-gray-900">
                              {price} {currency}
                            </span>
                          </div>
                          <button
                            onClick={() => navigate(`/coach/${coach.id}`)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          >
                            Profili İncele
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
