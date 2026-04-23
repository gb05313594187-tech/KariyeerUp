// src/pages/DanisanSozlesmesi.tsx
// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, Shield, AlertTriangle, Ban, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DanisanSozlesmesi() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'Mentorluk ve Eğitim Hizmet Sözleşmesi' : 'Mentoring and Training Service Agreement'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr' ? 'Kariyer Gelişim Seansı Kullanım Koşulları' : 'Career Development Session Terms and Conditions'}
          </p>
        </div>

        {/* İŞKUR KORUMA MADDESİ */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6 flex gap-4">
            <Info className="text-orange-600 shrink-0 h-6 w-6" />
            <div className="text-sm text-orange-900 leading-relaxed">
              <strong>{language === 'tr' ? 'Yasal Tanımlama:' : 'Legal Definition:'}</strong><br />
              {language === 'tr' 
                ? 'Bu sözleşme, bir iş bulma veya işe yerleştirme taahhüdü içermez. Kariyeer.com bir Özel İstihdam Bürosu değildir. Alınan hizmet tamamen kişisel gelişim, mülakat eğitimi ve kariyer mentorluğu odaklı bir eğitim faaliyetidir.'
                : 'This agreement does not include a commitment to find or place a job. Kariyeer.com is not a Private Employment Agency. The service received is an educational activity focused entirely on personal development, interview training, and career mentoring.'}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Clock className="mr-3 h-6 w-6" />
              {language === 'tr' ? '1. Eğitim Seans Sayısı ve Süresi' : '1. Number and Duration of Training Sessions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Mentorluk seansları, danışan ve mentor arasında karşılıklı olarak belirlenir:'
                : 'Mentoring sessions are mutually determined between client and mentor:'}
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Standart seans süresi: 60 dakika'
                  : 'Standard session duration: 60 minutes'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Hizmet Kapsamı: Tekil eğitim seansı veya gelişim paketleri'
                  : 'Service Scope: Single training session or development packages'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Geçerlilik süresi: Satın alma tarihinden itibaren 6 ay'
                  : 'Validity period: 6 months from purchase date'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Shield className="mr-3 h-6 w-6" />
              {language === 'tr' ? '2. Gizlilik ve Mahremiyet' : '2. Confidentiality and Privacy'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Eğitim ve mentorluk seanslarında paylaşılan tüm bilgiler gizlidir. Kariyeer, bir teknoloji sağlayıcısı olarak seans içeriklerini kayıt altına almaz ve erişemez.'
                : 'All information shared in training and mentoring sessions is confidential. Kariyeer, as a technology provider, does not record or access session content.'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-3 h-6 w-6" />
              {language === 'tr' ? '3. Hizmet Sınırları ve İstihdam Garantisi' : '3. Service Boundaries and Employment Guarantee'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="font-semibold mb-2">
                {language === 'tr' ? 'KRİTİK UYARI:' : 'CRITICAL WARNING:'}
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  {language === 'tr'
                    ? 'Mentor/Danışman, danışana hiçbir şekilde İŞ GARANTİSİ VEREMEZ.'
                    : 'The Mentor/Consultant CANNOT guarantee employment to the client in any way.'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Bu hizmet bir işe alım veya personel tedarik süreci değildir.'
                    : 'This service is not a recruitment or personnel supply process.'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Sunulan öneriler "tavsiye" niteliğindedir; uygulama ve sonuç sorumluluğu danışana aittir.'
                    : 'The suggestions provided are of a "recommendation" nature; the responsibility for application and results belongs to the client.'}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Ban className="mr-3 h-6 w-6" />
              {language === 'tr' ? '4. İptal ve İade Şartları' : '4. Cancellation and Refund Terms'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Seansa 12 saat kalana kadar yapılan iptallerde %100 iade yapılır.'
                  : '100% refund for cancellations made up to 12 hours before the session.'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Seansların "Eğitim Hizmet Bedeli" faturası ödeme anında kesilir.'
                  : 'The "Education Service Fee" invoice is issued at the time of payment.'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-sm italic">
              {language === 'tr'
                ? 'Bu sözleşme, ilk eğitim rezervasyonu yapıldığında yürürlüğe girer. Danışan, bu şartları kabul ederek kişisel gelişim sürecine başlamış sayılır. Son güncelleme: 23.04.2026'
                : 'This agreement comes into effect when the first training reservation is made. By accepting these terms, the client is deemed to have started their personal development process. Last update: 23.04.2026'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
