// src/pages/Privacy.tsx
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone, MapPin } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-gray-300 text-lg">
            Kişisel verilerinizin korunması bizim için önceliktir
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
            
            {/* Giriş */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                İşbu Gizlilik Politikası, <strong>Kariyeer.com</strong> ("Platform") tarafından 6698 sayılı 
                Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin nasıl 
                toplandığını, işlendiğini, saklandığını ve korunduğunu açıklamaktadır.
              </p>
            </div>

            {/* Veri Sorumlusu */}
            <div className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 rounded-r-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                1. Veri Sorumlusu
              </h2>
              <div className="text-gray-700 space-y-1">
                <p><strong>Unvan:</strong> Salih Gökalp Büyükçelebi (Şahıs Şirketi)</p>
                <p><strong>Marka:</strong> Kariyeer.com</p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
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

            {/* Toplanan Veriler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-600" />
                2. Toplanan Kişisel Veriler
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Kimlik Bilgileri</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Ad, soyad</li>
                    <li>• E-posta adresi</li>
                    <li>• Telefon numarası</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">İşlem Bilgileri</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Satın alma geçmişi</li>
                    <li>• Randevu kayıtları</li>
                    <li>• Ödeme bilgileri*</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Teknik Bilgiler</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• IP adresi</li>
                    <li>• Tarayıcı bilgileri</li>
                    <li>• Çerez verileri</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Profil Bilgileri</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Meslek bilgisi</li>
                    <li>• Kariyer hedefleri</li>
                    <li>• Seans notları</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Ödeme bilgileri iyzico altyapısı tarafından işlenir, platformumuzda saklanmaz.
              </p>
            </div>

            {/* Veri İşleme Amaçları */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-600" />
                3. Kişisel Verilerin İşlenme Amaçları
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span>Üyelik işlemlerinin gerçekleştirilmesi ve hesap yönetimi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span>Koçluk hizmetlerinin sunulması ve randevu yönetimi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span>Ödeme işlemlerinin gerçekleştirilmesi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span>Yasal yükümlülüklerin yerine getirilmesi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span>Müşteri memnuniyeti ve hizmet kalitesinin artırılması</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span>İletişim ve bilgilendirme faaliyetleri (onayınız dahilinde)</span>
                </li>
              </ul>
            </div>

            {/* Hukuki Sebepler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri
              </h2>
              <p className="text-gray-600 mb-3">
                Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Açık rızanızın bulunması</li>
                <li>• Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması</li>
                <li>• Hukuki yükümlülüğün yerine getirilmesi</li>
                <li>• Meşru menfaatlerimiz için zorunlu olması</li>
              </ul>
            </div>

            {/* Veri Aktarımı */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                5. Kişisel Verilerin Aktarılması
              </h2>
              <p className="text-gray-600 mb-3">
                Kişisel verileriniz, aşağıdaki taraflarla paylaşılabilir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-600">
                <p>• <strong>Ödeme kuruluşları:</strong> iyzico (ödeme işlemleri için)</p>
                <p>• <strong>Hosting sağlayıcıları:</strong> Supabase, Vercel</p>
                <p>• <strong>Yasal merciler:</strong> Kanuni zorunluluk halinde yetkili kurumlar</p>
                <p>• <strong>Koçlar:</strong> Randevu aldığınız koçlarla sınırlı bilgi paylaşımı</p>
              </div>
            </div>

            {/* Veri Saklama */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                6. Kişisel Verilerin Saklanma Süresi
              </h2>
              <p className="text-gray-600">
                Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal saklama 
                yükümlülüklerimiz çerçevesinde saklanır. Üyelik sonlandırıldığında, yasal zorunluluklar 
                saklı kalmak kaydıyla verileriniz silinir veya anonim hale getirilir.
              </p>
            </div>

            {/* Çerezler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                7. Çerez (Cookie) Politikası
              </h2>
              <p className="text-gray-600 mb-3">
                Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır:
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm">Zorunlu Çerezler</h4>
                  <p className="text-green-700 text-xs mt-1">Site işlevselliği için gerekli</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm">Analitik Çerezler</h4>
                  <p className="text-blue-700 text-xs mt-1">Kullanım istatistikleri</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm">Tercih Çerezleri</h4>
                  <p className="text-orange-700 text-xs mt-1">Kullanıcı tercihleri</p>
                </div>
              </div>
            </div>

            {/* KVKK Hakları */}
            <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                8. KVKK Kapsamındaki Haklarınız
              </h2>
              <p className="text-gray-600 mb-3">
                KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>✓ İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>✓ İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>✓ Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>✓ Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>✓ KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini isteme</li>
                <li>✓ İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>✓ Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </div>

            {/* Başvuru */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                9. Başvuru Yöntemi
              </h2>
              <p className="text-gray-600 mb-4">
                Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-red-600" />
                  <strong>E-posta:</strong> destek@kariyeer.com
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <strong>Adres:</strong> Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / İstanbul 34310
                </p>
              </div>
              <p className="text-gray-500 text-sm mt-3">
                Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
              </p>
            </div>

            {/* Değişiklikler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                10. Politika Değişiklikleri
              </h2>
              <p className="text-gray-600">
                Bu Gizlilik Politikası, yasal düzenlemeler veya hizmetlerimizdeki değişiklikler 
                doğrultusunda güncellenebilir. Değişiklikler bu sayfada yayınlandığı tarihte 
                yürürlüğe girer. Önemli değişikliklerde e-posta ile bilgilendirileceksiniz.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
