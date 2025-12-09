// src/pages/Terms.tsx
// @ts-nocheck
export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">
          Kullanım Koşulları
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Son güncelleme: 09.12.2025
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <p>
            Bu internet sitesini (&quot;Platform&quot;) kullanarak aşağıdaki koşulları
            okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz. Platform,
            Kariyeer Teknoloji A.Ş. (&quot;Kariyeer&quot;) tarafından işletilmekte olup
            kullanıcıların kariyer koçluğu hizmetlerine erişimini kolaylaştırmayı
            amaçlamaktadır.
          </p>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">1. Hizmetin Kapsamı</h2>
            <p>
              Kariyeer, kullanıcılar ile bağımsız koçlar arasında aracılık hizmeti sağlar.
              Platform üzerinden sunulan koçluk hizmetleri, ilgili koçların kendi
              sorumluluğunda olup Kariyeer, koçların sunduğu hizmetlerin içeriğinden,
              doğruluğundan veya sonuçlarından sorumlu değildir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              2. Üyelik ve Hesap Güvenliği
            </h2>
            <p>
              Kullanıcılar platformu kullanırken doğru ve güncel bilgi vermekle yükümlüdür.
              Hesap güvenliği (şifrelerin korunması, üçüncü kişilerle paylaşılmaması vb.)
              tamamen kullanıcının sorumluluğundadır. Şifrenin üçüncü kişilerce ele
              geçirilmesi veya yetkisiz kullanım durumlarından doğabilecek zararlardan
              Kariyeer sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              3. Ödeme ve İptal Koşulları
            </h2>
            <p>
              Platform üzerinden yapılan ödemeler, anlaşmalı ödeme kuruluşları aracılığıyla
              güvenli altyapılar kullanılarak gerçekleştirilir. Ödeme, iade ve iptal
              süreçleri; seçilen koçun belirlediği şartlar ve Kariyeer&apos;in ilgili
              politikalarına tabidir. Kullanıcı, seans tarihinden önce belirtilen süreler
              içinde iptal/iade talebinde bulunabilir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              4. Fikri Mülkiyet Hakları
            </h2>
            <p>
              Platformda yer alan tüm metin, görsel, logo, marka, yazılım ve diğer içerikler
              Kariyeer&apos;e veya lisans veren üçüncü kişilere aittir. Bu içerikler;
              Kariyeer&apos;in yazılı izni olmaksızın kopyalanamaz, çoğaltılamaz, yayımlanamaz,
              değiştirilemez veya ticari amaçla kullanılamaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">5. Yasaklı Kullanımlar</h2>
            <p className="mb-2">
              Kullanıcılar platformu aşağıdaki amaçlarla kullanamaz:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Yanıltıcı, zarar verici veya hukuka aykırı faaliyetlerde bulunmak,</li>
              <li>Koçları veya diğer kullanıcıları taciz edici davranışlarda bulunmak,</li>
              <li>Sistem güvenliğini ihlal etmeye yönelik girişimlerde bulunmak,</li>
              <li>
                Virüs, kötü amaçlı yazılım veya zararlı içerik içeren materyaller paylaşmak.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">6. Sorumluluk Reddi</h2>
            <p>
              Platform &quot;olduğu gibi&quot; sunulmaktadır. Kariyeer; teknik arızalar,
              erişim kesintileri, üçüncü taraf hizmet sağlayıcılarından kaynaklanan
              problemler veya kullanıcı hatalarından sorumlu değildir. Koçluk sürecinin
              sonuçları, danışanın bireysel çabaları ve koşullarıyla bağlantılıdır ve
              belirli bir sonuç taahhüdü verilmez.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              7. Değişiklik Hakkı
            </h2>
            <p>
              Kariyeer, kullanım koşullarını dilediği zaman tek taraflı olarak güncelleme
              hakkını saklı tutar. Güncellenen koşullar, platformda yayımlandığı tarih
              itibarıyla geçerli olur. Kullanıcıların güncellemeleri takip etme
              sorumluluğu kendilerine aittir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              8. Uygulanacak Hukuk ve Yetkili Mahkeme
            </h2>
            <p>
              Bu koşulların uygulanmasında ve yorumlanmasında Türk Hukuku geçerlidir.
              Taraflar arasında çıkabilecek uyuşmazlıklarda İstanbul Merkez Mahkemeleri ve
              İcra Daireleri yetkilidir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
