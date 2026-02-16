// src/pages/DistanceSales.tsx
import { FileText, User, Building, ShoppingCart, CreditCard, RotateCcw, Scale, MapPin, Phone, Mail } from "lucide-react";

export default function DistanceSales() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-gray-300 text-lg">
            6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

            {/* Madde 1 - Taraflar */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-600" />
                MADDE 1 - TARAFLAR
              </h2>
              
              {/* Satıcı */}
              <div className="bg-red-50 p-4 rounded-lg mb-4 border-l-4 border-red-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-600" />
                  1.1 SATICI BİLGİLERİ
                </h3>
                <div className="text-gray-700 space-y-1 text-sm">
                  <p><strong>Unvan:</strong> Salih Gökalp Büyükçelebi (Şahıs Şirketi)</p>
                  <p><strong>Marka:</strong> Kariyeer.com</p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span>Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / İstanbul 34310</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>0531 359 41 87</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>destek@kariyeer.com</span>
                  </p>
                </div>
              </div>

              {/* Alıcı */}
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  1.2 ALICI (TÜKETİCİ) BİLGİLERİ
                </h3>
                <p className="text-gray-600 text-sm">
                  Alıcı bilgileri, sipariş esnasında üyelik hesabındaki bilgiler esas alınarak 
                  sözleşmeye dahil edilir. Alıcı, üyelik bilgilerinin doğruluğundan sorumludur.
                </p>
              </div>
            </div>

            {/* Madde 2 - Konu */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-600" />
                MADDE 2 - SÖZLEŞMENİN KONUSU
              </h2>
              <p className="text-gray-600 mb-4">
                İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait <strong>kariyeer.com</strong> internet 
                sitesinden elektronik ortamda sipariş verdiği aşağıda nitelikleri ve satış fiyatı 
                belirtilen hizmetin satışı ve ifası ile ilgili olarak 6502 sayılı Tüketicinin 
                Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince 
                tarafların hak ve yükümlülüklerinin belirlenmesidir.
              </p>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Sunulan Hizmetler:</h3>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Birebir online kariyer koçluğu seansları</li>
                  <li>• Grup koçluk programları</li>
                  <li>• MentorCircle grup seansları</li>
                  <li>• Webinar ve eğitim programları</li>
                  <li>• Kurumsal koçluk hizmetleri</li>
                  <li>• CV ve mülakat hazırlık danışmanlığı</li>
                </ul>
              </div>
            </div>

            {/* Madde 3 - Fiyat ve Ödeme */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                MADDE 3 - HİZMET BEDELİ VE ÖDEME
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>3.1</strong> Hizmet bedeli, sipariş anında platformda belirtilen fiyattır. 
                  Tüm fiyatlara KDV dahildir.
                </p>
                <p>
                  <strong>3.2</strong> Ödeme, <strong>iyzico</strong> güvenli ödeme altyapısı üzerinden 
                  kredi kartı/banka kartı ile gerçekleştirilir.
                </p>
                <p>
                  <strong>3.3</strong> SATICI, kampanya ve indirim düzenleme hakkını saklı tutar.
                </p>
                <p>
                  <strong>3.4</strong> Taksitli işlemlerde banka tarafından uygulanan faiz oranları 
                  ALICI'nın sorumluluğundadır.
                </p>
              </div>
            </div>

            {/* Madde 4 - Hizmet İfası */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 4 - HİZMETİN İFASI
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>4.1</strong> Satın alınan koçluk seansları, belirlenen tarih ve saatte 
                  online video konferans (Zoom, Google Meet vb.) aracılığıyla gerçekleştirilir.
                </p>
                <p>
                  <strong>4.2</strong> Randevu saati, sipariş sonrasında ALICI tarafından koçun 
                  müsait takviminden seçilir.
                </p>
                <p>
                  <strong>4.3</strong> Satın alınan paketlerin kullanım süresi, aksi belirtilmedikçe 
                  satın alma tarihinden itibaren <strong>6 (altı) ay</strong>dır.
                </p>
                <p>
                  <strong>4.4</strong> Webinar ve grup programları, belirtilen tarih ve saatte 
                  canlı olarak gerçekleştirilir.
                </p>
              </div>
            </div>

            {/* Madde 5 - Randevu Değişikliği */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 5 - RANDEVU İPTAL VE DEĞİŞİKLİK
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3 text-gray-700">
                <p>
                  <strong>5.1</strong> Randevu iptali veya değişikliği, seans başlangıcından en az 
                  <strong> 24 saat önce</strong> yapılmalıdır.
                </p>
                <p>
                  <strong>5.2</strong> 24 saatten az süre kala yapılan iptallerde seans hakkı 
                  kullanılmış sayılır.
                </p>
                <p>
                  <strong>5.3</strong> Koçun mücbir sebeple seansa katılamaması durumunda, 
                  ALICI'ya alternatif randevu sunulur veya iade yapılır.
                </p>
              </div>
            </div>

            {/* Madde 6 - Cayma Hakkı */}
            <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-green-600" />
                MADDE 6 - CAYMA HAKKI
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>6.1</strong> ALICI, hizmet satın alma tarihinden itibaren <strong>14 (on dört) gün</strong> içinde 
                  herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma 
                  hakkına sahiptir.
                </p>
                <p>
                  <strong>6.2</strong> Cayma hakkının kullanılması için bu süre içinde SATICI'ya 
                  e-posta (<strong>destek@kariyeer.com</strong>) yoluyla bildirimde bulunulması yeterlidir.
                </p>
                <p className="text-red-700 font-medium">
                  <strong>6.3 İstisna:</strong> 14 gün içinde hizmetin ifasına başlanmış ve seans 
                  gerçekleştirilmişse, tüketilen seanslara ilişkin cayma hakkı kullanılamaz. 
                  Kullanılmayan seans hakları için iade yapılır.
                </p>
                <p>
                  <strong>6.4</strong> Cayma bildiriminin SATICI'ya ulaşmasından itibaren <strong>14 gün</strong> içinde 
                  ödeme iadesi yapılır.
                </p>
              </div>
            </div>

            {/* Madde 7 - Sorumluluklar */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 7 - TARAFLARIN YÜKÜMLÜL�KLERİ
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">SATICI Yükümlülükleri</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Hizmeti zamanında ve eksiksiz sunmak</li>
                    <li>• Gizlilik ve veri güvenliğini sağlamak</li>
                    <li>• Profesyonel ve etik standartlarda hizmet vermek</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">ALICI Yükümlülükleri</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Doğru ve güncel bilgi vermek</li>
                    <li>• Randevu saatlerine uymak</li>
                    <li>• Ödeme yükümlülüklerini yerine getirmek</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Madde 8 - Uyuşmazlık */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 8 - UYUŞMAZLIKLARIN ÇÖZÜMÜ
              </h2>
              <p className="text-gray-600 mb-3">
                İşbu sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı tarafından 
                ilan edilen değere kadar <strong>Tüketici Hakem Heyetleri</strong>, bu değerin üzerindeki 
                uyuşmazlıklarda <strong>Tüketici Mahkemeleri</strong> yetkilidir.
              </p>
              <p className="text-gray-600">
                <strong>Yetkili Mahkeme ve İcra Daireleri:</strong> İstanbul Mahkemeleri ve İcra Daireleri
              </p>
            </div>

            {/* Madde 9 - Yürürlük */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 9 - YÜRÜRLÜK
              </h2>
              <p className="text-gray-600">
                İşbu sözleşme, ALICI tarafından elektronik ortamda onaylandığı tarihte yürürlüğe girer. 
                ALICI, sipariş vermekle işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.
              </p>
            </div>

            {/* Onay Bildirimi */}
            <div className="bg-gray-900 text-white p-6 rounded-xl">
              <p className="text-center">
                ALICI, işbu Mesafeli Satış Sözleşmesi'nin tüm maddelerini okuduğunu, anladığını 
                ve kabul ettiğini, sipariş vermeden önce gerekli bilgilendirmenin yapıldığını 
                beyan ve taahhüt eder.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
