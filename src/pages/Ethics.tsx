// src/pages/Ethics.tsx
// @ts-nocheck
export default function Ethics() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">
          Etik Kurallar
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Kariyeer platformunda yer alan tüm koçlar ve profesyoneller aşağıdaki etik
          ilkelere uymayı taahhüt eder.
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <section>
            <h2 className="font-semibold text-red-600 mb-2">1. Gizlilik</h2>
            <p>
              Danışan tarafından paylaşılan tüm bilgiler gizlidir. Koç; danışanın açık,
              yazılı izni olmaksızın bu bilgileri üçüncü kişilerle paylaşamaz. Yasal
              zorunluluklar veya ciddi zarar tehlikesi içeren durumlar istisna
              oluşturabilir; bu hallerde dahi danışanın yüksek yararı gözetilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">2. Profesyonellik</h2>
            <p>
              Koç, yalnızca yetkin olduğu alanlarda hizmet verir ve uzmanlık alanı
              dışındaki konularda danışanı yanıltıcı vaatlerde bulunmaz. Koçluk; terapi,
              psikolojik danışmanlık veya tıbbi müdahalenin yerine geçmez. Gerekli
              görüldüğünde danışan ilgili uzmanlara yönlendirilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">3. Tarafsızlık ve Saygı</h2>
            <p>
              Koç, danışanın kimliği, dili, dini, cinsiyeti, kültürel yapısı, yaşam tarzı
              veya kariyer tercihi ne olursa olsun yargısız ve tarafsız bir tutum
              sergiler. Her danışana saygı, nezaket ve eşit mesafede yaklaşmak esastır.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">4. Yetkinlik ve Gelişim</h2>
            <p>
              Koçlar, mesleki bilgi ve becerilerini güncel tutmakla yükümlüdür. Eğitim,
              süpervizyon ve geri bildirim süreçlerine açık olmak; hem kendisinin hem de
              danışanlarının gelişimi için temel bir ilkedir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">5. Çıkar Çatışmasından Kaçınma</h2>
            <p>
              Koç, danışan ile finansal, kurumsal veya kişisel çıkar çatışması
              oluşturabilecek durumları önceden değerlendirir ve gerektiğinde süreci kabul
              etmez veya sonlandırır. Her türlü ek menfaat, danışana şeffaf şekilde
              açıklanır.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">6. Şeffaflık ve Bilgilendirme</h2>
            <p>
              Tüm seans ücretleri, ödeme koşulları, seans süresi, iptal politikası ve
              çalışma yöntemi danışan ile açıkça paylaşılır. Danışan; koçluk sürecine
              kendi özgür iradesi ile katılır ve dilediği zaman süreci sonlandırma
              hakkına sahiptir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              7. Platform Kurallarına Uyma
            </h2>
            <p>
              Koçlar, Kariyeer&apos;in belirlediği topluluk kuralları, içerik standartları
              ve hizmet kalitesi politikalarına uymayı kabul eder. Platformda yapılan tüm
              yazışma ve paylaşımlar saygı çerçevesinde, profesyonel bir dil ile
              gerçekleştirilir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
