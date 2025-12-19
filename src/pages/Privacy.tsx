// src/pages/Privacy.tsx
// @ts-nocheck

export default function Privacy() {
  return (
    <main className="flex-1 bg-white">
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
                Profil bilgileri: deneyim, hedefler, biyografi ve kullanıcı
                tarafından sağlanan bilgiler
              </li>
              <li>
                Şirket talepleri: şirket adı, yetkili kişi ve iletişim bilgileri
              </li>
              <li>
                Ödeme bilgileri: kart bilgileri platformda saklanmaz, lisanslı
                ödeme kuruluşları tarafından işlenir
              </li>
              <li>
                Teknik veriler: IP adresi, cihaz, tarayıcı ve log kayıtları
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Verilerin İşlenme Amaçları
            </h2>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Platform hizmetlerinin sunulması</li>
              <li>Kayıt, giriş ve seans süreçlerinin yürütülmesi</li>
              <li>Kullanıcı destek taleplerinin yanıtlanması</li>
              <li>Güvenliğin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Anonim istatistiksel analizler</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Verilerin Paylaşımı
            </h2>
            <p className="mt-3 leading-relaxed">
              Kişisel veriler yalnızca hizmetin sunulabilmesi için gerekli olan
              üçüncü taraflarla paylaşılır. Yasal zorunluluklar dışında ticari
              amaçla satılmaz veya paylaşılmaz.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Ödeme Güvenliği
            </h2>
            <p className="mt-3 leading-relaxed">
              Ödeme işlemleri iyzico gibi lisanslı ödeme kuruluşları üzerinden
              gerçekleştirilir. Kart bilgileri Kariyeer tarafından tutulmaz.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Saklama Süresi
            </h2>
            <p className="mt-3 leading-relaxed">
              Kişisel veriler, mevzuata uygun süre boyunca saklanır; süre sonunda
              silinir veya anonimleştirilir.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Kullanıcı Hakları
            </h2>
            <p className="mt-3 leading-relaxed">
              Kullanıcılar kişisel verileriyle ilgili taleplerini aşağıdaki
              adres üzerinden iletebilir:
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
              Bu gizlilik politikası güncellenebilir. Güncel sürüm her zaman bu
              sayfada yayınlanır.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
