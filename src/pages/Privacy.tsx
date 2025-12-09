// src/pages/Privacy.tsx
// @ts-nocheck
export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">
          Gizlilik Politikası
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Son güncelleme: 09.12.2025
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <p>
            Kariyeer Teknoloji A.Ş. olarak kişisel verilerinizin güvenliğini önemsiyoruz ve
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili
            mevzuat ile Avrupa Birliği Genel Veri Koruma Tüzüğü&apos;ne (GDPR) uygun
            hareket ediyoruz.
          </p>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">1. Toplanan Veriler</h2>
            <p className="mb-2">Platformu kullanmanız sırasında aşağıdaki veriler işlenebilir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ad, soyad, e-posta adresi, telefon numarası gibi iletişim bilgileri,</li>
              <li>Kariyer hedefleri, ilgi alanları ve tercih ettiğiniz koçluk alanları,</li>
              <li>Oluşturduğunuz profil ve seans geçmişi,</li>
              <li>Ödeme işlemine ilişkin bilgiler (kart bilgileri ödeme kuruluşu tarafından tutulur),</li>
              <li>Cihaz bilgisi, IP adresi, çerezler ve kullanım istatistikleri.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">2. Verilerin İşlenme Amaçları</h2>
            <p className="mb-2">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Koç ve kullanıcı eşleştirmesini gerçekleştirmek,</li>
              <li>Hizmet kalitesini artırmak ve kullanıcı deneyimini iyileştirmek,</li>
              <li>Ödeme, faturalama ve muhasebe süreçlerini yürütmek,</li>
              <li>Kullanıcı destek hizmetleri sunmak,</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek,</li>
              <li>
                Tercih ettiyseniz, kampanya ve bilgilendirmeler hakkında e-posta veya bildirim
                göndermek.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">3. Verilerin Paylaşımı</h2>
            <p className="mb-2">Kişisel verileriniz aşağıdaki durumlarda paylaşılabilir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Seans planlama ve iletişimi sağlamak için seçtiğiniz koçlarla gerekli
                bilgiler,
              </li>
              <li>
                Ödeme işlemleri için anlaşmalı ödeme kuruluşları ve bankalarla zorunlu
                bilgiler,
              </li>
              <li>
                Yasal zorunluluklar çerçevesinde yetkili kamu kurum ve kuruluşları ile
                talep edilmesi halinde,
              </li>
              <li>
                Altyapı, barındırma ve güvenlik hizmeti aldığımız üçüncü taraf hizmet
                sağlayıcılarla, sadece gerekli olduğu kadarıyla.
              </li>
            </ul>
            <p className="mt-2">
              Verileriniz hiçbir koşulda üçüncü şahıslara satılmaz veya yetkisiz amaçlarla
              aktarılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">4. Veri Güvenliği</h2>
            <p>
              Kişisel verileriniz, şifreleme, erişim kısıtlaması ve düzenli güvenlik
              kontrolleri gibi teknik ve idari tedbirlerle korunmaktadır. Verilere yalnızca
              yetkili personel ve hizmet sağlayıcılar, görevleri ile sınırlı şekilde erişir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              5. Veri Saklama Süresi
            </h2>
            <p>
              Kişisel verileriniz, ilgili mevzuatta öngörülen veya işleme amaçları için
              gerekli olan süre boyunca saklanır. Bu süre sona erdiğinde verileriniz
              silinir, anonim hale getirilir veya imha edilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">6. Haklarınız</h2>
            <p className="mb-2">
              KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>Silinmesini veya yok edilmesini talep etme,</li>
              <li>İşleme faaliyetine itiraz etme,</li>
              <li>Veri taşınabilirliği hakkını kullanma.</li>
            </ul>
            <p className="mt-2">
              Talepleriniz için{' '}
              <a
                href="mailto:privacy@kariyeer.com"
                className="text-red-600 underline"
              >
                privacy@kariyeer.com
              </a>{' '}
              adresi üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">7. Çerez (Cookie) Kullanımı</h2>
            <p>
              Platformda, kullanıcı deneyimini iyileştirmek ve istatistiksel analizler
              yapmak için çerezler kullanılmaktadır. Çerez tercihlerinizi tarayıcı
              ayarlarınız üzerinden yönetebilirsiniz. Çerezleri kısıtlamanız durumunda
              platformun bazı özellikleri düzgün çalışmayabilir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
