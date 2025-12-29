// src/pages/Coaches.tsx
// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useLanguage } from "@/contexts/LanguageContext";

export default function Coaches() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Dil: Context + URL senkron
  const { language, setLanguage } = useLanguage();
  const urlLang = (searchParams.get("lang") || "").toLowerCase();

  useEffect(() => {
    if (urlLang && ["tr", "en", "ar", "fr"].includes(urlLang) && urlLang !== language) {
      setLanguage(urlLang as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlLang]);

  // ✅ Lokal i18n (sayfayı tek başına çeviri yapar)
  const i18n: any = {
    tr: {
      heroTitle1: "Potansiyelinizi Keşfedecek",
      heroTitle2: "Uzman Koçu",
      heroTitle3: "Bulun",
      heroSubtitle:
        "ICF sertifikalı, deneyimli ve alanında uzman profesyoneller arasından hedeflerinize en uygun yol arkadaşını seçin.",
      searchPlaceholder: "İsim, uzmanlık alanı veya anahtar kelime ile ara...",
      searchBtn: "Ara",
      filterTitle: "Filtrele",
      clear: "Temizle",
      categoryTitle: "Uzmanlık Alanı",
      experienceTitle: "Deneyim",
      priceInfoTitle: "Seans Ücreti (Bilgilendirme)",
      priceInfoDesc: "Çoğu koçun 45 dk seans ücreti 750 ₺ - 5000 ₺ aralığındadır.",
      loading: "Koçlar yükleniyor...",
      listed: "koç listeleniyor",
      sortRecommended: "Önerilen Sıralama",
      sortRating: "Puana Göre (Yüksek → Düşük)",
      sortPriceAsc: "Fiyata Göre (Artan)",
      sortPriceDesc: "Fiyata Göre (Azalan)",
      sortExp: "Deneyime Göre (Yüksek)",
      errorText: "Koç listesi yüklenirken bir hata oluştu.",
      emptyText:
        "Filtrelere uygun koç bulunamadı. Filtreleri gevşetmeyi veya arama terimini değiştirmeyi deneyin.",
      premium: "Premium Koç",
      online: "Online görüntülü seans",
      earliest: "En erken müsaitlik:",
      earliestValue: "Online planlanır",
      expLabelSuffix: "Yıl Profesyonel Deneyim",
      noSpecs: "Uzmanlık alanları ekleniyor",
      priceLabel: "45 Dk. Seans Ücreti",
      viewProfile: "Profili İncele",
      categories: [
        "Tümü",
        "Kariyer Geçişi",
        "Liderlik Koçluğu",
        "Yeni Mezun Koçluğu",
        "Yöneticiler için Koçluk",
        "Mülakat Hazırlığı",
      ],
      experiences: ["0-5 Yıl", "5-10 Yıl", "10+ Yıl"],
    },
    en: {
      heroTitle1: "Find the",
      heroTitle2: "Expert Coach",
      heroTitle3: "for You",
      heroSubtitle:
        "Choose the best companion for your goals from experienced, certified professionals.",
      searchPlaceholder: "Search by name, specialty, or keyword...",
      searchBtn: "Search",
      filterTitle: "Filter",
      clear: "Clear",
      categoryTitle: "Specialty",
      experienceTitle: "Experience",
      priceInfoTitle: "Session Fee (Info)",
      priceInfoDesc: "Most 45-min sessions range between 750 ₺ and 5000 ₺.",
      loading: "Loading coaches...",
      listed: "coaches listed",
      sortRecommended: "Recommended",
      sortRating: "By Rating (High → Low)",
      sortPriceAsc: "By Price (Low → High)",
      sortPriceDesc: "By Price (High → Low)",
      sortExp: "By Experience (High)",
      errorText: "An error occurred while loading the coach list.",
      emptyText:
        "No coaches match your filters. Try loosening filters or changing your search term.",
      premium: "Premium Coach",
      online: "Online video session",
      earliest: "Earliest availability:",
      earliestValue: "Planned online",
      expLabelSuffix: "Years of Professional Experience",
      noSpecs: "Specialties coming soon",
      priceLabel: "45-min Session Fee",
      viewProfile: "View Profile",
      categories: [
        "All",
        "Career Transition",
        "Leadership Coaching",
        "New Grad Coaching",
        "Coaching for Managers",
        "Interview Prep",
      ],
      experiences: ["0-5 Years", "5-10 Years", "10+ Years"],
    },
    ar: {
      heroTitle1: "اعثر على",
      heroTitle2: "المدرّب الخبير",
      heroTitle3: "المناسب لك",
      heroSubtitle:
        "اختر أفضل خبير يناسب أهدافك من بين محترفين ذوي خبرة وشهادات.",
      searchPlaceholder: "ابحث بالاسم أو التخصص أو كلمة مفتاحية...",
      searchBtn: "بحث",
      filterTitle: "تصفية",
      clear: "مسح",
      categoryTitle: "التخصص",
      experienceTitle: "الخبرة",
      priceInfoTitle: "سعر الجلسة (معلومات)",
      priceInfoDesc: "معظم جلسات 45 دقيقة بين 750 ₺ و 5000 ₺.",
      loading: "جاري تحميل المدربين...",
      listed: "مدربًا معروضًا",
      sortRecommended: "مقترح",
      sortRating: "حسب التقييم (مرتفع → منخفض)",
      sortPriceAsc: "حسب السعر (منخفض → مرتفع)",
      sortPriceDesc: "حسب السعر (مرتفع → منخفض)",
      sortExp: "حسب الخبرة (الأعلى)",
      errorText: "حدث خطأ أثناء تحميل قائمة المدربين.",
      emptyText:
        "لا يوجد مدربون مطابقون للتصفية. جرّب تخفيف التصفية أو تغيير البحث.",
      premium: "مدرّب بريميوم",
      online: "جلسة فيديو أونلاين",
      earliest: "أقرب توفر:",
      earliestValue: "يتم التخطيط أونلاين",
      expLabelSuffix: "سنوات خبرة مهنية",
      noSpecs: "التخصصات قيد الإضافة",
      priceLabel: "سعر جلسة 45 دقيقة",
      viewProfile: "عرض الملف",
      categories: [
        "الكل",
        "تغيير المسار",
        "تدريب القيادة",
        "تدريب الخريجين الجدد",
        "تدريب للمديرين",
        "التحضير للمقابلة",
      ],
      experiences: ["0-5 سنوات", "5-10 سنوات", "10+ سنوات"],
    },
    fr: {
      heroTitle1: "Trouvez le",
      heroTitle2: "Coach Expert",
      heroTitle3: "idéal",
      heroSubtitle:
        "Choisissez le meilleur coach pour vos objectifs parmi des professionnels certifiés et expérimentés.",
      searchPlaceholder: "Recherchez par nom, spécialité ou mot-clé...",
      searchBtn: "Rechercher",
      filterTitle: "Filtrer",
      clear: "Réinitialiser",
      categoryTitle: "Spécialité",
      experienceTitle: "Expérience",
      priceInfoTitle: "Tarif séance (Info)",
      priceInfoDesc: "La plupart des séances de 45 min sont entre 750 ₺ et 5000 ₺.",
      loading: "Chargement des coachs...",
      listed: "coachs affichés",
      sortRecommended: "Recommandé",
      sortRating: "Par note (Haut → Bas)",
      sortPriceAsc: "Par prix (Croissant)",
      sortPriceDesc: "Par prix (Décroissant)",
      sortExp: "Par expérience (Haut)",
      errorText: "Une erreur est survenue lors du chargement de la liste.",
      emptyText:
        "Aucun coach ne correspond à vos filtres. Essayez d’ajuster les filtres ou la recherche.",
      premium: "Coach Premium",
      online: "Séance vidéo en ligne",
      earliest: "Disponibilité:",
      earliestValue: "Planifié en ligne",
      expLabelSuffix: "Années d’expérience professionnelle",
      noSpecs: "Spécialités à venir",
      priceLabel: "Tarif séance 45 min",
      viewProfile: "Voir le profil",
      categories: [
        "Tous",
        "Transition de carrière",
        "Coaching leadership",
        "Jeunes diplômés",
        "Coaching managers",
        "Préparation entretien",
      ],
      experiences: ["0-5 ans", "5-10 ans", "10+ ans"],
    },
  };

  const lang = (language || "tr") as any;
  const t = i18n[lang] || i18n.tr;

  // Veriler
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>(t.categories?.[0] || "Tümü");
  const [experienceFilter, setExperienceFilter] = useState<string>(t.experiences?.[1] || "5-10 Yıl");
  const [sortOption, setSortOption] = useState<string>("recommended");

  // URL lang paramını garanti altına al (Index’ten geldiğinde zaten var, yoksa ekler)
  useEffect(() => {
    const current = searchParams.get("lang");
    if (!current && lang) {
      const next = new URLSearchParams(searchParams);
      next.set("lang", lang);
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
        setError(t.errorText);
      } else {
        setCoaches(data || []);
      }
      setLoading(false);
    };

    fetchCoaches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
    const allLabel = (t.categories?.[0] || "Tümü") as string;
    if (selectedCategory !== allLabel) {
      list = list.filter((c) => {
        const specs = (c.specializations || []) as string[];
        return specs.includes(selectedCategory);
      });
    }

    // 3) Deneyim filtresi (yaklaşık)
    const exp0 = t.experiences?.[0] || "0-5 Yıl";
    const exp1 = t.experiences?.[1] || "5-10 Yıl";
    const exp2 = t.experiences?.[2] || "10+ Yıl";

    if (experienceFilter === exp0) {
      list = list.filter((c) => (c.experience_years || 0) <= 5);
    } else if (experienceFilter === exp1) {
      list = list.filter(
        (c) =>
          (c.experience_years || 0) >= 5 && (c.experience_years || 0) <= 10
      );
    } else if (experienceFilter === exp2) {
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
  }, [coaches, searchTerm, selectedCategory, experienceFilter, sortOption, t]);

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO BÖLÜMÜ */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 pb-16 pt-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            {t.heroTitle1} <br />{" "}
            <span className="text-yellow-300">{t.heroTitle2}</span> {t.heroTitle3}
          </h1>
          <p className="text-lg text-red-50 max-w-2xl mx-auto mb-10">
            {t.heroSubtitle}
          </p>

          {/* ARAMA KUTUSU */}
          <div className="max-w-3xl mx-auto relative shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20">
            <div className="flex bg-white h-16">
              <div className="flex-1 flex items-center px-6">
                <Search className="text-gray-400 w-6 h-6 mr-4" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full h-full outline-none text-gray-700 text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-gray-900 hover:bg-black text-white font-bold px-10 transition-colors text-lg">
                {t.searchBtn}
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
                  <SlidersHorizontal className="w-5 h-5" /> {t.filterTitle}
                </h3>
                <button
                  className="text-xs text-red-600 font-semibold hover:underline"
                  onClick={() => {
                    setSelectedCategory(t.categories?.[0] || "Tümü");
                    setExperienceFilter(t.experiences?.[1] || "5-10 Yıl");
                    setSortOption("recommended");
                    setSearchTerm("");
                  }}
                >
                  {t.clear}
                </button>
              </div>

              {/* UZMANLIK ALANI */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">
                  {t.categoryTitle}
                </h4>
                <div className="space-y-3">
                  {(t.categories || []).map((cat: string) => (
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
                  {t.experienceTitle}
                </h4>
                <div className="space-y-3">
                  {(t.experiences || []).map((exp: string) => (
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
                  {t.priceInfoTitle}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{t.priceInfoDesc}</p>
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
                  <span>{t.loading}</span>
                ) : (
                  <>
                    <span className="font-bold text-gray-900 text-lg">
                      {filteredCoaches.length}
                    </span>{" "}
                    {t.listed}
                  </>
                )}
              </p>

              <div className="flex items-center gap-4">
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none font-medium"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recommended">{t.sortRecommended}</option>
                  <option value="rating_desc">{t.sortRating}</option>
                  <option value="price_asc">{t.sortPriceAsc}</option>
                  <option value="price_desc">{t.sortPriceDesc}</option>
                  <option value="exp_desc">{t.sortExp}</option>
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
                {t.emptyText}
              </div>
            )}

            {/* KARTLAR */}
            {!error && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 gap-6"
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
                      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex ${
                        viewMode === "list"
                          ? "flex-row max-w-2xl mx-auto"
                          : "flex-col h-full max-w-sm mx-auto"
                      }`}
                    >
                      {/* ÜST RENKLİ ALAN */}
                      <div
                        className={`relative ${
                          viewMode === "list" ? "w-40" : "h-20"
                        } bg-gradient-to-r from-red-600 to-orange-500`}
                      >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        {isPremium && (
                          <span className="absolute top-3 right-3 bg-white/90 text-red-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                            <Star className="w-3 h-3 fill-current" /> {t.premium}
                          </span>
                        )}
                      </div>

                      <div className="px-4 pb-4 relative flex-1 flex flex-col">
                        {/* Avatar */}
                        <div
                          className={`absolute ${
                            viewMode === "list"
                              ? "-top-7 left-4"
                              : "-top-9 left-4"
                          } p-[4px] bg-white rounded-2xl shadow-md`}
                        >
                          <img
                            src={
                              coach.avatar_url ||
                              "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
                            }
                            className="w-20 h-20 rounded-xl object-cover"
                            alt={coach.full_name}
                          />
                        </div>

                        {/* İsim & Puan */}
                        <div
                          className={`${
                            viewMode === "list" ? "mt-10" : "mt-14"
                          } flex justify-between items-start`}
                        >
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                              {coach.full_name}
                            </h3>
                            <p className="text-gray-500 font-medium text-xs">
                              {coach.title || "Kariyer Koçu"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 font-semibold text-sm">
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                              {coach.rating?.toFixed(1) || "5.0"}
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                              ({coach.total_reviews || 0} {lang === "en" ? "reviews" : lang === "fr" ? "avis" : lang === "ar" ? "تقييم" : "yorum"})
                            </span>
                          </div>
                        </div>

                        {/* Detaylar */}
                        <div className="mt-4 space-y-2 text-xs sm:text-sm text-gray-700 font-medium bg-gray-50 p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            <span>
                              {(coach.experience_years || 0).toString()}{" "}
                              {t.expLabelSuffix}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span>
                              {t.earliest}{" "}
                              <span className="text-green-600 font-semibold">
                                {t.earliestValue}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            <span>{t.online}</span>
                          </div>
                        </div>

                        {/* Etiketler */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {specs.length === 0 && (
                            <span className="bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                              {t.noSpecs}
                            </span>
                          )}
                          {specs.map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Alt kısım */}
                        <div className="mt-5 pt-3 border-t flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-[11px] text-gray-500 block font-medium mb-1">
                              {t.priceLabel}
                            </span>
                            <span className="text-lg font-extrabold text-gray-900">
                              {price} {currency}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const qs = new URLSearchParams(searchParams);
                              if (!qs.get("lang")) qs.set("lang", lang);
                              navigate(`/coach/${coach.id}?${qs.toString()}`);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs sm:text-sm"
                          >
                            {t.viewProfile}
                            <ChevronRight className="w-4 h-4" />
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
