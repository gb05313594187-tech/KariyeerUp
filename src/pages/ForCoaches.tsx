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

        const { data, error } = await supabase
          .from("coaches")
          .select("*")
          .eq("is_active", true)
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
      {/* HERO – KOÇLAR İÇİN ÖZEL */}
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

      {/* KAZANIMLAR */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Kariyeer Ekosistemi Size Neler Kazandırır?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sürdürülebilir gelir, profesyonel gelişim ve sektörel tanınırlık
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pasif Gelir */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Pasif Gelir Fırsatları
            </h3>
            <p className="text-sm text-gray-600">
              Platform üzerinden düzenli danışan akışı ile sürdürülebilir gelir
              elde edin. Komisyon oranları %15-25 arasında değişir.
            </p>
          </div>

          {/* Geniş Danışan Ağı */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Geniş Danışan Ağı
            </h3>
            <p className="text-sm text-gray-600">
              Bireysel danışanlardan kurumsal müşterilere kadar geniş bir
              yelpazede profesyonellerle çalışma fırsatı.
            </p>
          </div>

          {/* Profesyonel Gelişim */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <Briefcase className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Profesyonel Gelişim
            </h3>
            <p className="text-sm text-gray-600">
              Webinarlar, vaka tartışmaları ve süpervizyon seansları ile sürekli
              gelişim imkanı.
            </p>
          </div>

          {/* Webinar ve Etkinlikler */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <CalendarClock className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Webinar ve Etkinlikler
            </h3>
            <p className="text-sm text-gray-600">
              Düzenli webinarlar düzenleyerek görünürlüğünüzü artırın ve
              sektörde öne çıkın.
            </p>
          </div>

          {/* MentorCircle */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              MentorCircle Topluluğu
            </h3>
            <p className="text-sm text-gray-600">
              Diğer koçlarla etkileşim, vaka paylaşımı ve profesyonel
              networking imkanı.
            </p>
          </div>

          {/* Tanınırlık */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Tanınırlık ve Prestij
            </h3>
            <p className="text-sm text-gray-600">
              Ayın Koçu, Haftanın Koçu gibi ödüllerle sektörde tanınırlığınızı
              artırın.
            </p>
          </div>
        </div>
      </section>

      {/* 🔴 AKTİF KOÇLAR – SUPABASE'TEN ÇEKİLEN LİSTE */}
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
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
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
                      {coach.rating ? coach.rating.toFixed(1) : "4.8"}
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
                    {coach.price ? `${coach.price}₺ / seans` : "750₺ / seans"}
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

      {/* EKOSİSTEMDE NASIL AKTİF OLURSUNUZ */}
      <section className="bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Ekosistemde Nasıl Aktif Olursunuz?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İçerik, etkileşim ve katılım ile sektörde öne çıkın
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {/* İçerik Üretimi */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                İçerik Üretimi
              </h3>
              <p className="text-sm text-gray-600">
                MentorCircle üzerinden makaleler, vaka çalışmaları ve
                tartışmalar paylaşarak uzmanlığınızı sergileyin.
              </p>
            </div>

            {/* Webinar Düzenleme */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Webinar Düzenleme
              </h3>
              <p className="text-sm text-gray-600">
                Düzenli webinarlar ile hem danışanlarla hem diğer koçlarla
                etkileşim kurun.
              </p>
            </div>

            {/* Vaka Tartışmaları */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Vaka Tartışmaları
              </h3>
              <p className="text-sm text-gray-600">
                Diğer koçlarla vaka tartışmaları yaparak profesyonel
                gelişiminizi sürdürün.
              </p>
            </div>

            {/* Etkileşim ve Görünürlük */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Etkileşim ve Görünürlük
              </h3>
              <p className="text-sm text-gray-600">
                Aktif katılım ve kaliteli içeriklerle Ayın Koçu veya Haftanın
                Koçu seçilebilirsiniz.
              </p>
            </div>
          </div>

          {/* Ayın Koçu highlight */}
          <div className="rounded-2xl border border-red-100 bg-red-50/60 px-6 py-8 md:px-10 md:py-10 text-center">
            <h3 className="text-xl md:text-2xl font-extrabold text-red-700 mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ayın Koçu veya Haftanın Koçu Olun!
            </h3>
            <p className="text-sm md:text-base text-red-900 max-w-3xl mx-auto mb-5">
              Aktif katılım, kaliteli içerik üretimi ve yüksek danışan
              memnuniyeti ile öne çıkan koçlar her hafta ve ay ödüllendirilir.
              Ana sayfada özel vitrin, rozet ve artan görünürlük kazanın.
            </p>
            <button
              onClick={() => navigate("/mentor-circle")}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm md:text-base shadow-md hover:bg-red-700 transition-colors"
            >
              MentorCircle&apos;a Katıl
            </button>
          </div>
        </div>
      </section>

      {/* GELİR MODELİ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Gelir Modeli
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Şeffaf, adil ve sürdürülebilir gelir sistemi
          </p>
        </div>

        {/* Üst kartlar */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Kurucu Koç Avantajı
            </h3>
            <p className="text-sm text-gray-600">
              İlk 50 koç için %15 komisyon oranı (standart %20 yerine).
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Esnek Ücretlendirme
            </h3>
            <p className="text-sm text-gray-600">
              Kendi seans ücretinizi belirleyin (önerilen: 750-2000 ₺).
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Kurumsal Anlaşmalar
            </h3>
            <p className="text-sm text-gray-600">
              Şirket anlaşmalarından düzenli gelir fırsatı.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Ödeme Güvencesi
            </h3>
            <p className="text-sm text-gray-600">
              Seanslarınızın ödemesi platform tarafından garanti edilir.
            </p>
          </div>
        </div>

        {/* Alt istatistik barı */}
        <div className="rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-8 md:px-12 md:py-10 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1">
              Platform Komisyonu
            </p>
            <p className="text-3xl md:text-4xl font-extrabold">%15-25</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1">
              Önerilen Seans Ücreti
            </p>
            <p className="text-3xl md:text-4xl font-extrabold">
              750-2000₺
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1">
              Sınırsız Gelir Potansiyeli
            </p>
            <p className="text-3xl md:text-4xl font-extrabold">∞</p>
          </div>
        </div>
      </section>

      {/* KOÇ SEÇİM KRİTERLERİ */}
      <section
        id="selection-process"
        className="bg-white border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Koç Seçim Kriterleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kalite standartlarımız ve beklentilerimiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  ICF veya MYK Sertifikası
                </h3>
                <p className="text-sm text-gray-600">
                  Uluslararası veya ulusal geçerliliğe sahip koçluk sertifikası
                  zorunludur.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex gap-3">
              <Clock className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Minimum Deneyim
                </h3>
                <p className="text-sm text-gray-600">
                  En az 2 yıl koçluk deneyimi veya 100 saat koçluk pratiği.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex gap-3">
              <Briefcase className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Sürekli Gelişim
                </h3>
                <p className="text-sm text-gray-600">
                  Yıllık süpervizyon ve eğitim gereksinimlerini karşılama
                  taahhüdü.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex gap-3">
              <Star className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Kalite Standartları
                </h3>
                <p className="text-sm text-gray-600">
                  Minimum 4.0/5.0 puan ortalaması korunmalıdır. 3.5 altı için
                  destek programı uygulanır.
                </p>
              </div>
            </div>
          </div>

          {/* 🔹 BURASI ARTIK ÇALIŞIYOR */}
          <div className="text-center">
            <button
              onClick={() => navigate("/selection-process")}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-red-500 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
            >
              Tam Seçim Süreci
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 🔻 SAYFA İÇİ FOOTER / BÜYÜK CTA BLOĞU */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white mt-0">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Kariyeer Ekosisteminin Bir Parçası Olmaya Hazır mısınız?
          </h2>
          <p className="text-red-50 max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Başvurunuzu yapın, ekosisteme katılın ve kariyer koçluğunda yeni
            bir sayfa açın.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/coach-application")}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-red-600 font-bold text-sm md:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Koç Başvurusu Yap
            </button>
            <button
              onClick={() => navigate("/mentor-circle")}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/80 text-white font-semibold text-sm md:text-base hover:bg-white/10 transition-colors"
            >
              MentorCircle&apos;ı Keşfet
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
