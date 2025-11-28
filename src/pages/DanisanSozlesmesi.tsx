import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, Shield, AlertTriangle, Ban } from 'lucide-react';
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
            {language === 'tr' ? 'Danışan - Koç Sözleşmesi' : 'Client - Coach Agreement'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr' ? 'Koçluk Seansı Kullanım Koşulları' : 'Coaching Session Terms and Conditions'}
          </p>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Clock className="mr-3 h-6 w-6" />
              {language === 'tr' ? '1. Seans Sayısı ve Süresi' : '1. Number and Duration of Sessions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Koçluk seansları, danışan ve koç arasında karşılıklı olarak belirlenir:'
                : 'Coaching sessions are mutually determined between client and coach:'}
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Standart seans süresi: 60 dakika'
                  : 'Standard session duration: 60 minutes'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Seans sayısı: Tek seans, 3\'lü paket, 6\'lı paket veya özel anlaşma'
                  : 'Number of sessions: Single session, 3-session package, 6-session package or custom agreement'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Seanslar arasında önerilen süre: 1-2 hafta'
                  : 'Recommended time between sessions: 1-2 weeks'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Paket seansların geçerlilik süresi: Satın alma tarihinden itibaren 6 ay'
                  : 'Validity period of package sessions: 6 months from purchase date'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Shield className="mr-3 h-6 w-6" />
              {language === 'tr' ? '2. Gizlilik ve Mahremiyet İlkesi' : '2. Confidentiality and Privacy Principle'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Koçluk seanslarında paylaşılan tüm bilgiler gizlidir ve koç tarafından üçüncü kişilerle paylaşılmaz. Ancak aşağıdaki durumlar istisnadır:'
                : 'All information shared in coaching sessions is confidential and will not be shared with third parties by the coach. However, the following situations are exceptions:'}
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Danışanın kendisine veya başkalarına zarar verme riski'
                  : 'Risk of harm to client or others'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Yasal zorunluluklar (mahkeme kararı vb.)'
                  : 'Legal obligations (court order, etc.)'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Danışanın yazılı izni ile'
                  : 'With written consent of client'}
              </li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
              <p className="text-sm">
                <strong>{language === 'tr' ? 'Not:' : 'Note:'}</strong>{' '}
                {language === 'tr'
                  ? 'Platform, seans içeriklerine erişemez. Gizlilik yükümlülüğü tamamen koç ile danışan arasındadır.'
                  : 'Platform cannot access session content. Confidentiality obligation is entirely between coach and client.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-3 h-6 w-6" />
              {language === 'tr' ? '3. Koçluk Sınırları ve Garantiler' : '3. Coaching Boundaries and Guarantees'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="font-semibold mb-2">
                {language === 'tr' ? 'ÖNEMLİ UYARI:' : 'IMPORTANT WARNING:'}
              </p>
              <p className="text-sm mb-3">
                {language === 'tr'
                  ? 'Koçluk, danışmanlık veya terapi değildir. Koç, belirli sonuçlar garanti edemez.'
                  : 'Coaching is not counseling or therapy. Coach cannot guarantee specific results.'}
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  {language === 'tr'
                    ? 'Koç, psikolojik tedavi sağlamaz'
                    : 'Coach does not provide psychological treatment'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Koç, iş garantisi veremez'
                    : 'Coach cannot guarantee employment'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Koç, finansal tavsiye vermez'
                    : 'Coach does not provide financial advice'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Sonuçlar, danışanın çabası ve koşullara bağlıdır'
                    : 'Results depend on client\'s effort and circumstances'}
                </li>
              </ul>
            </div>
            <p className="mt-4">
              {language === 'tr'
                ? 'Koçluk, kişinin potansiyelini ortaya çıkarmasına, hedeflerini netleştirmesine ve eylem planı oluşturmasına yardımcı olan bir gelişim sürecidir.'
                : 'Coaching is a development process that helps individuals realize their potential, clarify their goals and create an action plan.'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Ban className="mr-3 h-6 w-6" />
              {language === 'tr' ? '4. Seans İptali ve Değişim Şartları' : '4. Session Cancellation and Change Terms'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p className="font-semibold">{language === 'tr' ? 'İptal Politikası:' : 'Cancellation Policy:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? '12 saat öncesine kadar: Ücretsiz iptal, tam iade'
                  : 'Up to 12 hours before: Free cancellation, full refund'}
              </li>
              <li>
                {language === 'tr'
                  ? '12 saat - 2 saat arası: %50 ücret kesilir'
                  : '12 hours - 2 hours: 50% fee charged'}
              </li>
              <li>
                {language === 'tr'
                  ? '2 saat içinde veya katılmama: Tam ücret kesilir'
                  : 'Within 2 hours or no-show: Full fee charged'}
              </li>
            </ul>
            <p className="font-semibold mt-4">{language === 'tr' ? 'Seans Değişikliği:' : 'Session Change:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Tarih/saat değişikliği 24 saat öncesine kadar ücretsiz'
                  : 'Date/time change is free up to 24 hours before'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Koçun müsaitliğine göre yeni randevu belirlenir'
                  : 'New appointment is determined according to coach\'s availability'}
              </li>
            </ul>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
              <p className="text-sm">
                <strong>{language === 'tr' ? 'Acil Durumlar:' : 'Emergencies:'}</strong>{' '}
                {language === 'tr'
                  ? 'Hastalık, vefat gibi acil durumlarda esneklik gösterilir. Belge ibraz edilmesi gerekebilir.'
                  : 'Flexibility is shown in emergencies such as illness, death. Documentation may be required.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '5. Yasal Sınırlamalar' : '5. Legal Limitations'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="font-semibold mb-2">
                {language === 'tr' ? 'Koçluk Psikolojik Tedavi Yerine Geçmez:' : 'Coaching Does Not Replace Psychological Treatment:'}
              </p>
              <p className="text-sm mb-3">
                {language === 'tr'
                  ? 'Aşağıdaki durumlarda profesyonel psikolojik destek alınması önerilir:'
                  : 'Professional psychological support is recommended in the following cases:'}
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>{language === 'tr' ? 'Depresyon, anksiyete bozukluğu' : 'Depression, anxiety disorder'}</li>
                <li>{language === 'tr' ? 'Travma sonrası stres' : 'Post-traumatic stress'}</li>
                <li>{language === 'tr' ? 'Bağımlılık sorunları' : 'Addiction problems'}</li>
                <li>{language === 'tr' ? 'Ciddi kişilik bozuklukları' : 'Serious personality disorders'}</li>
                <li>{language === 'tr' ? 'İntihar düşünceleri' : 'Suicidal thoughts'}</li>
              </ul>
              <p className="text-sm mt-3">
                {language === 'tr'
                  ? 'Koç, bu tür durumları tespit ettiğinde danışanı uygun profesyonel yardıma yönlendirme sorumluluğuna sahiptir.'
                  : 'Coach has a responsibility to refer client to appropriate professional help when such situations are detected.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-sm">
              {language === 'tr'
                ? 'Bu sözleşme, ilk seans rezervasyonu yapıldığında yürürlüğe girer. Danışan, sözleşme şartlarını kabul ederek koçluk sürecine başlar. Sözleşme, her iki tarafın da hak ve sorumluluklarını korumak amacıyla hazırlanmıştır. Son güncelleme: 2024'
                : 'This agreement comes into effect when the first session reservation is made. Client begins the coaching process by accepting the terms of the agreement. The agreement has been prepared to protect the rights and responsibilities of both parties. Last update: 2024'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}