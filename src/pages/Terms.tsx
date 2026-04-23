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
          Son güncelleme: 23.04.2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <p>
            Bu internet sitesini (&quot;Platform&quot;) kullanarak aşağıdaki koşulları
            okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz. Platform,
            Kariyeer Teknoloji A.Ş. (&quot;Kariyeer&quot;) tarafından işletilmekte olup
            kullanıcıların kariyer mentorluğu ve eğitim hizmetlerine erişimini kolaylaştırmayı
            amaçlayan bir teknoloji hizmetidir.
          </p>

          {/* İŞKUR KRİTİK MADDE */}
          <section className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h2 className="font-bold text-red-700 mb-2 uppercase">Önemli Yasal Beyan</h2>
            <p className="text-red-900 font-medium">
              Kariyeer, 4904 sayılı Türkiye İş Kurumu Kanunu kapsamında faaliyet gösteren bir 
              &quot;Özel İstihdam Bürosu&quot; değildir. Platform üzerinden hiçbir şekilde işe yerleştirme, 
              iş bulma veya personel tedarik etme faaliyeti yürütülmez. Kariyeer, yalnızca bağımsız 
              danışmanlar ile kullanıcıları eğitim ve mentorluk amaçlı bir araya getiren bir teknoloji sağlayıcısıdır.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">1. Hizmetin Niteliği ve Kapsamı</h2>
            <p>
              Platform üzerinden sunulan hizmetler; mülakat teknikleri, özgeçmiş iyileştirme, 
              kariyer planlama ve yetkinlik geliştirme odaklı danışmanlık ve eğitim seanslarından ibarettir. 
              Kariyeer, kullanıcıların bir işe girmesini, terfi almasını veya belirli bir ekonomik kazanç 
              elde etmesini taahhüt etmez. Platform, sunulan mentorluk hizmetlerinin içeriğinden veya 
              bağımsız danışmanların beyanlarından sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              2. İstihdam Garantisi Verilmemesi
            </h2>
            <p>
              Kullanıcı, Platform üzerinden aldığı danışmanlık hizmetinin bir işe alım süreci olmadığını 
              kabul eder. Kariyeer, işverenler ile adaylar arasında bir sözleşme kurulmasına aracılık etmez. 
              Hizmet alan kullanıcılar ile hizmet veren mentorlar arasında doğabilecek hiçbir hukuki 
              ihtilafta Kariyeer taraf değildir.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              3. Üyelik ve Hesap Güvenliği
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
              4. Ödeme ve Fatura Koşulları
            </h2>
            <p>
              Platform üzerinden gerçekleştirilen tüm ödemeler &quot;Eğitim ve Danışmanlık Hizmet Bedeli&quot; 
              olarak tahsil edilir. İade ve iptal süreçleri; seans tarihinden önce belirtilen süreler 
              içinde Kariyeer&apos;in güncel politikalarına göre yürütülür.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              5. Fikri Mülkiyet Hakları
            </h2>
            <p>
              Platformda yer alan tüm metin, görsel, logo, yazılım ve içerikler Kariyeer&apos;e aittir. 
              Kariyeer&apos;in yazılı izni olmaksızın kopyalanamaz, ticari amaçla kullanılamaz.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">6. Yasaklı Kullanımlar</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Platformu işe alım veya personel bulma amacıyla kullanmak,</li>
              <li>Hukuka aykırı veya yanıltıcı içerik paylaşmak,</li>
              <li>Danışmanları veya kullanıcıları Platform dışı ödemeye zorlamak,</li>
              <li>Sistem güvenliğini tehlikeye atacak girişimlerde bulunmak.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              7. Değişiklik Hakkı
            </h2>
            <p>
              Kariyeer, kullanım koşullarını dilediği zaman güncelleme hakkını saklı tutar. 
              Güncellenen koşullar Platformda yayımlandığı an yürürlüğe girer.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-red-600 mb-2">
              8. Uygulanacak Hukuk ve Yetki
            </h2>
            <p>
              Bu koşullar Türk Hukukuna tabidir. Taraflar arasındaki uyuşmazlıklarda 
              İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
