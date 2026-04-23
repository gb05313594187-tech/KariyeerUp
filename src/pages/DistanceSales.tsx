// src/pages/DistanceSales.tsx
import { FileText, User, Building, ShoppingCart, CreditCard, RotateCcw, Scale, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";

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
            Kariyer Mentorluğu ve Gelişim Danışmanlığı Hizmet Şartları
          </p>
          <p className="text-gray-400 text-sm mt-4 font-bold uppercase tracking-widest">
            Kariyeer.com Bir Özel İstihdam Bürosu Değildir
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

            {/* YASAL UYARI KUTUSU */}
            <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-2xl flex gap-4">
              <ShieldAlert className="text-orange-600 shrink-0 w-6 h-6" />
              <div className="text-sm text-orange-900 leading-relaxed">
                <strong>ÖNEMLİ BEYAN:</strong> İşbu sözleşme kapsamında sunulan hizmetler 4904 sayılı Kanun çerçevesinde &quot;İşe Yerleştirme&quot; veya &quot;İş Bulma&quot; faaliyeti niteliğinde değildir. Kariyeer.com, adaylar ve işverenler arasında istihdam sözleşmesi kurulmasına aracılık etmez. Alınan bedel münhasıran <strong>&quot;Eğitim ve Kariyer Mentorluğu Hizmet Bedeli&quot;</strong>dir.
              </div>
            </div>

            {/* Madde 1 - Taraflar */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-600" />
                MADDE 1 - TARAFLAR
              </h2>
              
              {/* Satıcı */}
              <div className="bg-slate-50 p-6 rounded-xl mb-4 border border-slate-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-600" />
                  1.1 HİZMET SAĞLAYICI (SATICI)
                </h3>
                <div className="text-gray-700 space-y-1 text-sm">
                  <p><strong>Unvan:</strong> Salih Gökalp Büyükçelebi (Şahıs Şirketi)</p>
                  <p><strong>Marka:</strong> Kariyeer.com</p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span>Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / İstanbul 34310</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>destek@kariyeer.com</span>
                  </p>
                </div>
              </div>

              {/* Alıcı */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  1.2 KULLANICI (ALICI)
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Platform üzerinden eğitim veya mentorluk hizmeti satın alan gerçek veya tüzel kişidir. 
                  Alıcı, üyelik bilgilerinin doğruluğunu ve hizmetin bir <strong>&quot;istihdam vaadi&quot;</strong> içermediğini kabul eder.
                </p>
              </div>
            </div>

            {/* Madde 2 - Konu */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-600" />
                MADDE 2 - SÖZLEŞMENİN KONUSU
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                İşbu sözleşmenin konusu, ALICI&apos;nın Platform üzerinden satın aldığı <strong>dijital eğitim içerikleri, 
                kariyer gelişim seansları ve mentorluk hizmetlerinin</strong> satışı ve ifasına ilişkin usul ve esasların belirlenmesidir. 
                Sözleşme konusu hizmet, ALICI&apos;nın kariyer yetkinliklerini artırmaya yönelik danışmanlık faaliyetidir.
              </p>
              
              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <h3 className="font-semibold text-orange-800 mb-2 text-sm uppercase">Sözleşme Kapsamındaki Hizmetler:</h3>
                <ul className="text-orange-800 text-sm space-y-2">
                  <li>• Birebir Online Kariyer Mentorluğu ve Gelişim Seansları</li>
                  <li>• Mülakat Teknikleri ve Vaka Analizi Eğitimleri</li>
                  <li>• MentorCircle Grup Gelişim Programları</li>
                  <li>• Özgeçmiş (CV) Optimizasyonu ve Stratejik Danışmanlık</li>
                  <li>• Kurumsal Yetkinlik Değerlendirme ve Gelişim Paneli Erişimi</li>
                </ul>
              </div>
            </div>

            {/* Madde 3 - Fiyat ve Ödeme */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                MADDE 3 - HİZMET BEDELİ VE FATURALANDIRMA
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>3.1</strong> Ödemeler, <strong>Eğitim ve Danışmanlık Hizmet Bedeli</strong> başlığı altında 
                  <strong> iyzico</strong> güvenli ödeme geçidi üzerinden tahsil edilir.
                </p>
                <p>
                  <strong>3.2</strong> Kariyeer, bir iş aracısı olmadığı için &quot;işe yerleştirme komisyonu&quot; adı altında 
                  bir bedel tahsil etmez. Tüm bedeller teknoloji kullanımı ve eğitim hizmetine ilişkindir.
                </p>
              </div>
            </div>

            {/* Madde 4 - İfa Şartları */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 4 - HİZMETİN İFASI VE GARANTİLER
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="text-red-700 font-bold">
                  4.1 İSTİHDAM GARANTİSİ REDDİ: Satın alınan hizmet, ALICI&apos;ya herhangi bir işe yerleşme, 
                  mülakattan geçme veya istihdam edilme GARANTİSİ VERMEZ.
                </p>
                <p>
                  <strong>4.2</strong> Seanslar, tarafların mutabık kaldığı online konferans platformları üzerinden icra edilir.
                </p>
                <p>
                  <strong>4.3</strong> Mentorluk paketlerinin geçerlilik süresi <strong>6 (altı) ay</strong>dır.
                </p>
              </div>
            </div>

            {/* Madde 6 - Cayma Hakkı */}
            <div className="border-l-4 border-emerald-500 pl-6 py-4 bg-emerald-50 rounded-r-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-600" />
                MADDE 6 - CAYMA HAKKI
              </h2>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  <strong>6.1</strong> ALICI, hizmetin ifasına başlanmamış olması kaydıyla 14 gün içinde cayma hakkına sahiptir.
                </p>
                <p>
                  <strong>6.2</strong> Mesafeli Sözleşmeler Yönetmeliği uyarınca; <strong>elektronik ortamda anında ifa edilen hizmetler 
                  ve tüketiciye anında teslim edilen gayrimaddi mallara (gerçekleşen seanslar, indirilen raporlar vb.)</strong> 
                  ilişkin cayma hakkı kullanılamaz.
                </p>
              </div>
            </div>

            {/* Madde 8 - Uyuşmazlık */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                MADDE 8 - UYUŞMAZLIKLARIN ÇÖZÜMÜ
              </h2>
              <p className="text-gray-600 mb-3 text-sm">
                Uyuşmazlıklarda Tüketici Hakem Heyetleri ve İstanbul (Çağlayan) Mahkemeleri yetkilidir.
              </p>
            </div>

            {/* Onay Bildirimi */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl text-center shadow-xl">
              <p className="font-medium leading-relaxed">
                ALICI, bu sözleşmeyi onaylayarak platformun bir iş bulma kurumu olmadığını, 
                aldığı hizmetin kişisel gelişim ve eğitim amaçlı olduğunu beyan ve kabul eder.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
