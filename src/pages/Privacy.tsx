// src/pages/Privacy.tsx
// @ts-nocheck
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Gizlilik Politikası
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Bu metin, Kariyeer platformu üzerinden sunulan hizmetler kapsamında
            kişisel verilerin işlenmesine ilişkin kullanıcıları bilgilendirmek
            amacıyla hazırlanmıştır.
          </p>

          <div className="mt-10 space-y-8 text-gray-700">
            {/* 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                1. Toplanan Veriler
              </h2>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>
                  Hesap bilgileri: ad, soyad, e-posta adresi, telefon numarası
                  (varsa)
                </li>
                <li>
                  Profil bilgileri: deneyim, hedefler, biyografi ve benzeri
                  kullanıcı tarafından sağlanan bilgiler
                </li>
                <li>
                  Şirket talepleri: şirket adı, yetkili kişi ve iletişim
                  bilgileri
                </li>
                <li>
                  Ödeme bilgileri: kart bilgileri platformumuzda saklanmaz,
                  lisanslı ödeme kuruluşları aracılığıyla işlenir
                </li>
                <li>
                  Teknik veriler: IP adresi, cihaz, tarayıcı bilgileri ve log
                  kayıtları (güvenlik ve sistem iyileştirme amaçlı)
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                2. Verilerin İşlenme Amaçları
              </h2>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>Platform hizmetlerinin sunulması ve yönetilmesi</li>
                <li>Kayıt, giriş, eşleşme ve seans süreçlerinin yürütülmesi</li>
                <li>Kullanıcı destek taleplerinin yanıtlanması</li>
                <li>Güvenliğin sağlanması ve kötüye kullanımın önlenmesi</li>
                <li>
                  Yasal yükümlülüklerin yerine getirilmesi ve mevzuata uyum
                </li>
                <li>
                  Ürün geliştirme ve anonim istatistiksel analiz çalışmaları
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                3. Verilerin Paylaşımı
              </h2>
              <p className="mt-3 leading-relaxed">
                Kişisel veriler, hizmetin sunulabilmesi için zorunlu olan üçüncü
                taraflarla (barındırma hizmetleri, altyapı sağlayıcıları, ödeme
                kuruluşları gibi) paylaşılabilir. Yasal yükümlülükler dışında
                üçüncü kişilere satılmaz veya ticari amaçla paylaşılmaz.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                4. Ödeme Güvenliği
              </h2>
              <p className="mt-3 leading-relaxed">
                Platform üzerinden gerçekleştirilen ödemeler, iyzico gibi
                lisanslı ödeme kuruluşları aracılığıyla alınır. Kredi kartı veya
                banka kartı bilgileri Kariyeer tarafından saklanmaz ve ödeme
                işlemleri ilgili ödeme kuruluşunun güvenli altyapısı üzerinden
                gerçekleştirilir.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                5. Saklama Süresi
              </h2>
              <p className="mt-3 leading-relaxed">
                Kişisel veriler, yürürlükteki mevzuat ve hizmet gereklilikleri
                kapsamında gerekli olan süre boyunca saklanır. Bu sürenin
                sonunda veriler silinir, yok edilir veya anonim hale getirilir.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                6. Kullanıcı Hakları
              </h2>
              <p className="mt-3 leading-relaxed">
                Kullanıcılar, kişisel verilerine ilişkin taleplerini aşağıdaki
                iletişim adresi üzerinden iletebilir:
              </p>
              <p className="mt-1 font-medium text-gray-900">
                support@kariyeer.com
              </p>
            </section>

            {/* Güncelleme */}
            <section className="rounded-xl border bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Politika Güncellemeleri
              </h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                Bu gizlilik politikası, hizmet kapsamı veya mevzuattaki
                değişiklikler doğrultusunda güncellenebilir. Güncel sürüm her
                zaman bu sayfa üzerinden yayınlanır.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
