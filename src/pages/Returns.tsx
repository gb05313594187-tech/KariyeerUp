// src/pages/Returns.tsx
// @ts-nocheck
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Returns() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900">
            İptal ve İade Koşulları
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Bu sayfa, Kariyeer platformu üzerinden sunulan dijital hizmetler
            (online koçluk seansları ve benzeri danışmanlık hizmetleri) için
            geçerli olan iptal ve iade koşullarını açıklamak amacıyla
            hazırlanmıştır.
          </p>

          <div className="mt-10 space-y-8 text-gray-700">
            {/* 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                1. Hizmetin Niteliği
              </h2>
              <p className="mt-3 leading-relaxed">
                Kariyeer üzerinden sunulan hizmetler, dijital içerik ve online
                danışmanlık niteliğindedir. Seans planlama, gerçekleştirme ve
                içeriğin belirlenmesi koç ve kullanıcı arasında yürütülür.
                Platform, taraflar arasında aracılık hizmeti sunar.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                2. Seans İptali
              </h2>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>
                  Planlanan seanstan <strong>en az 24 saat önce</strong> yapılan
                  iptal taleplerinde, uygun bulunması halinde ücret iadesi
                  yapılabilir.
                </li>
                <li>
                  Seansa 24 saatten daha kısa süre kala yapılan iptallerde iade
                  yapılmayabilir.
                </li>
                <li>
                  Koç tarafından iptal edilen seanslarda kullanıcıya alternatif
                  tarih/saat önerilebilir veya talep edilmesi halinde iade
                  sağlanabilir.
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                3. Katılmama Durumu (No-Show)
              </h2>
              <p className="mt-3 leading-relaxed">
                Kullanıcının, planlanan seansa katılmaması (no-show) durumunda
                ücret iadesi yapılmayabilir.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                4. Cayma Hakkı Bilgilendirmesi
              </h2>
              <p className="mt-3 leading-relaxed">
                Mesafeli satış hükümleri kapsamında, dijital hizmetlerde
                ifasına başlanan hizmetler için cayma hakkı istisnaları
                uygulanabilir. Seansın başlaması veya hizmetin ifasına
                başlanması ile birlikte iade koşulları değişebilir.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                5. İade Süreci
              </h2>
              <p className="mt-3 leading-relaxed">
                İade talepleri{" "}
                <span className="font-medium text-gray-900">
                  destek@kariyeer.com
                </span>{" "}
                adresine e-posta yoluyla iletilmelidir. Uygun bulunan iadeler,
                ödeme yönteminize bağlı olarak ilgili ödeme kuruluşu
                (ör. iyzico) üzerinden gerçekleştirilir.
              </p>
            </section>

            {/* Not */}
            <section className="rounded-xl border bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Bilgilendirme</h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                Bu iptal ve iade koşulları, platformun mevcut hizmet modeli için
                geçerlidir. Kariyeer, hizmet kapsamı veya mevzuat
                değişikliklerine bağlı olarak bu koşulları güncelleme hakkını
                saklı tutar. Güncel sürüm her zaman bu sayfada yayınlanır.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
