// src/pages/Returns.tsx
import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Mail, Phone, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">İptal ve İade Koşulları</h1>
          <p className="text-gray-300 text-lg">
            Haklarınızı ve iade süreçlerimizi şeffaf bir şekilde açıklıyoruz
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

            {/* Genel Bilgi */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Önemli Bilgilendirme
              </h2>
              <p className="text-blue-800">
                Kariyeer.com olarak müşteri memnuniyetini ön planda tutuyoruz. Dijital hizmet 
                sunduğumuz için iade koşullarımız, 6502 sayılı Tüketicinin Korunması Hakkında 
                Kanun ve ilgili yönetmelikler çerçevesinde belirlenmiştir.
              </p>
            </div>

            {/* 14 Gün Cayma Hakkı */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                1. Cayma Hakkı (14 Gün Kuralı)
              </h2>
              <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
                <p className="text-gray-700 mb-3">
                  Satın alma tarihinden itibaren <strong className="text-green-700">14 gün</strong> içinde, 
                  herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Cayma bildiriminizi e-posta ile iletmeniz yeterlidir
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Herhangi bir cezai şart uygulanmaz
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    İade, bildirimin tarafımıza ulaşmasından itibaren 14 gün içinde yapılır
                  </li>
                </ul>
              </div>
            </div>

            {/* İade Koşulları Tablosu */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-red-600" />
                2. Hizmet Türüne Göre İade Koşulları
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Hizmet Türü</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">İade Durumu</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Koşullar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Tekil Koçluk Seansı</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Tam İade</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                        Seans gerçekleşmeden en az 24 saat önce iptal
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">Seans Paketleri</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Kısmi İade</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                        Kullanılmayan seanslar için oransal iade
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Webinarlar</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Tam İade</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                        Webinar tarihinden 24 saat önce iptal
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">MentorCircle</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Kısmi İade</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                        İlk seans öncesi tam, sonrasında oransal iade
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Tamamlanmış Seans</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">İade Yok</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                        Hizmet tamamlandıktan sonra iade yapılmaz
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* İade Yapılmayan Durumlar */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                3. İade Yapılmayan Durumlar
              </h2>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-2">
                <p className="text-red-800 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Seansın gerçekleştirilmiş olması (katılsanız da katılmasanız da)</span>
                </p>
                <p className="text-red-800 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>24 saatten az süre kala yapılan iptaller</span>
                </p>
                <p className="text-red-800 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Mazeretsiz olarak seansa katılmama (no-show)</span>
                </p>
                <p className="text-red-800 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Kullanım süresi (6 ay) dolmuş paketler</span>
                </p>
                <p className="text-red-800 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Canlı yayınlanmış ve kayıt gönderilmiş webinarlar</span>
                </p>
              </div>
            </div>

            {/* Randevu İptal/Değişiklik */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                4. Randevu İptal ve Değişiklik Kuralları
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✅ 24+ Saat Önce</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Ücretsiz iptal edilebilir</li>
                    <li>• Ücretsiz tarih değiştirilebilir</li>
                    <li>• Seans hakkı korunur</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">❌ 24 Saatten Az</h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Seans hakkı kullanılmış sayılır</li>
                    <li>• İade yapılmaz</li>
                    <li>• Tarih değişikliği yapılamaz</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* İade Süreci */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                5. İade Nasıl Yapılır?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Talep Gönderin</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>destek@kariyeer.com</strong> adresine sipariş numaranız ve iade talebinizi içeren e-posta gönderin.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Değerlendirme</h3>
                    <p className="text-gray-600 text-sm">
                      Talebiniz 2 iş günü içinde değerlendirilir ve size bilgi verilir.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">İade İşlemi</h3>
                    <p className="text-gray-600 text-sm">
                      Onaylanan iadeler, <strong>14 gün içinde</strong> ödeme yaptığınız karta/hesaba aktarılır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* İletişim */}
            <div className="bg-gray-900 text-white p-6 rounded-xl">
              <h2 className="text-lg font-bold mb-4 text-center">İade Talebi İçin İletişim</h2>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span>destek@kariyeer.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span>0531 359 41 87</span>
                </div>
              </div>
              <p className="text-center text-gray-400 text-sm mt-4">
                Çalışma Saatleri: Hafta içi 09:00 - 18:00
              </p>
            </div>

            {/* Yasal Uyarı */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <p>
                Bu koşullar, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli 
                Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.
              </p>
              <p className="mt-2">
                Detaylı bilgi için{" "}
                <Link to="/distance-sales" className="text-red-600 hover:underline">
                  Mesafeli Satış Sözleşmesi
                </Link>
                'ni inceleyebilirsiniz.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
