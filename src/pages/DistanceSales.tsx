// src/pages/DistanceSales.tsx
// @ts-nocheck
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DistanceSales() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Mesafeli Satış Sözleşmesi
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            İşbu sözleşme, Kariyeer platformu üzerinden satın alınan dijital
            hizmetlere ilişkin tarafların hak ve yükümlülüklerini düzenler.
          </p>

          <div className="mt-10 space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Taraflar</h2>
              <p className="mt-3">
                <strong>Satıcı (Platform):</strong> Kariyeer (Platform işletmecisi)
                <br />
                <strong>Alıcı (Kullanıcı):</strong> Platform üzerinden hizmet
                satın alan kişi veya kurum
              </p>
              <p className="mt-2">
                İletişim:{" "}
                <span className="font-medium text-gray-900">
                  support@kariyeer.com
                </span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Konu</h2>
              <p className="mt-3 leading-relaxed">
                Bu sözleşmenin konusu; platform üzerinden sunulan online koçluk
                ve danışmanlık hizmetlerinin satışı, ifası, iptali ve iadesine
                ilişkin esasların belirlenmesidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                3. Hizmet Bilgileri
              </h2>
              <p className="mt-3 leading-relaxed">
                Hizmetin kapsamı, ücreti ve seans detayları ilgili sayfalarda ve
                satın alma adımında açıkça belirtilir. Platform, koç ile
                kullanıcı arasındaki iletişim için teknik altyapı sağlar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Ödeme</h2>
              <p className="mt-3 leading-relaxed">
                Ödemeler, iyzico gibi lisanslı ödeme kuruluşları aracılığıyla
                gerçekleştirilir. Kart bilgileri Kariyeer sistemlerinde
                saklanmaz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                5. Cayma Hakkı
              </h2>
              <p className="mt-3 leading-relaxed">
                Dijital hizmetlerde ifaya başlanması halinde, cayma hakkına
                ilişkin istisnalar uygulanabilir. Kullanıcı, seansın planlanması
                veya ifasına başlanmasıyla birlikte cayma hakkının sınırlanacağını
                kabul eder.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                6. İptal ve İade
              </h2>
              <p className="mt-3 leading-relaxed">
                İptal ve iade koşulları, “İptal ve İade Koşulları” sayfasında
                belirtilmiştir ve işbu sözleşmenin ayrılmaz bir parçasıdır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                7. Uyuşmazlık
              </h2>
              <p className="mt-3 leading-relaxed">
                Taraflar arasında doğabilecek uyuşmazlıklarda, ilgili tüketici
                hakem heyetleri ve/veya mahkemeler yetkilidir.
              </p>
            </section>

            <section className="rounded-xl border bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Yürürlük</h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                Kullanıcı, platform üzerinden hizmet satın alarak işbu sözleşme
                hükümlerini okuduğunu ve kabul ettiğini beyan eder.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
