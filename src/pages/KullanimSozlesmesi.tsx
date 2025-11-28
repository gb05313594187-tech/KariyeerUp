import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function KullanimSozlesmesi() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'Platform Kullanım Sözleşmesi' : 'Platform Terms of Use'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr' ? 'Kariyeer Platformu Kullanım Koşulları' : 'Kariyeer Platform Terms and Conditions'}
          </p>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '1. Hizmet Tanımı' : '1. Service Definition'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Kariyeer, ICF (International Coaching Federation) veya MYK tarafından sertifikalandırılmış profesyonel kariyer koçları ile danışanları bir araya getiren bir online platformdur.'
                : 'Kariyeer is an online platform that brings together professional career coaches certified by ICF (International Coaching Federation) or MYK with clients.'}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>{language === 'tr' ? 'Önemli:' : 'Important:'}</strong>{' '}
                {language === 'tr'
                  ? 'Platformda yalnızca ICF veya MYK tarafından sertifikalandırılmış koçlara yer verilir. Platform kendisi herhangi bir kurum tarafından onaylanmış değildir.'
                  : 'Only coaches certified by ICF or MYK are included on the platform. The platform itself is not approved by any institution.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '2. Kullanım Kuralları ve Yasaklar' : '2. Usage Rules and Prohibitions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p className="font-semibold">{language === 'tr' ? 'Kullanıcılar:' : 'Users:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>{language === 'tr' ? 'Gerçek ve doğru bilgiler vermekle yükümlüdür' : 'Are obliged to provide true and accurate information'}</li>
              <li>{language === 'tr' ? 'Platformu yasa dışı amaçlarla kullanamaz' : 'Cannot use the platform for illegal purposes'}</li>
              <li>{language === 'tr' ? 'Başkalarının hesaplarını kullanamaz veya kimliğine bürünemez' : 'Cannot use others\' accounts or impersonate'}</li>
              <li>{language === 'tr' ? 'Platformun güvenliğini tehdit edecek eylemlerden kaçınmalıdır' : 'Must avoid actions that threaten platform security'}</li>
              <li>{language === 'tr' ? 'Koçlara hakaret, tehdit veya taciz içeren davranışlarda bulunamaz' : 'Cannot engage in insulting, threatening or harassing behavior towards coaches'}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '3. Hesap Oluşturma ve Silme' : '3. Account Creation and Deletion'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Platformu kullanabilmek için 18 yaşını doldurmuş olmanız gerekmektedir. Hesap oluşturma sırasında verdiğiniz bilgilerin doğruluğundan siz sorumlusunuz.'
                : 'You must be 18 years of age or older to use the platform. You are responsible for the accuracy of the information you provide during account creation.'}
            </p>
            <p>
              {language === 'tr'
                ? 'Hesabınızı istediğiniz zaman silebilirsiniz. Hesap silme talebiniz 30 gün içinde işleme alınır. Yasal saklama yükümlülükleri kapsamındaki veriler (ödeme kayıtları vb.) belirlenen süre boyunca saklanmaya devam eder.'
                : 'You can delete your account at any time. Your account deletion request will be processed within 30 days. Data subject to legal retention obligations (payment records, etc.) will continue to be stored for the specified period.'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '4. Sorumluluklar' : '4. Responsibilities'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-4">
            <div>
              <p className="font-semibold mb-2">{language === 'tr' ? 'Platform Sorumluluğu:' : 'Platform Responsibility:'}</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{language === 'tr' ? 'Koçların sertifikalarını doğrulamak' : 'Verify coaches\' certificates'}</li>
                <li>{language === 'tr' ? 'Güvenli ödeme altyapısı sağlamak' : 'Provide secure payment infrastructure'}</li>
                <li>{language === 'tr' ? 'Kullanıcı verilerini KVKK kapsamında korumak' : 'Protect user data under KVKK'}</li>
                <li>{language === 'tr' ? 'Teknik destek sunmak' : 'Provide technical support'}</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">{language === 'tr' ? 'Platform Sorumlu Değildir:' : 'Platform is Not Responsible for:'}</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{language === 'tr' ? 'Koçluk seanslarının içeriği ve kalitesi' : 'Content and quality of coaching sessions'}</li>
                <li>{language === 'tr' ? 'Koç-danışan arasındaki anlaşmazlıklar' : 'Disputes between coach and client'}</li>
                <li>{language === 'tr' ? 'Koçluk sonucunda elde edilen veya edilemeyen sonuçlar' : 'Results achieved or not achieved as a result of coaching'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '5. Uyuşmazlık Çözümü' : '5. Dispute Resolution'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              {language === 'tr'
                ? 'Bu sözleşmeden doğan uyuşmazlıklarda öncelikle taraflar arabuluculuk yoluyla çözüm aramayı kabul eder. Çözüme ulaşılamaması durumunda İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.'
                : 'In disputes arising from this agreement, the parties first agree to seek a solution through mediation. If no solution is reached, Istanbul (Çağlayan) Courts and Execution Offices are authorized.'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '6. Gizlilik ve KVKK' : '6. Privacy and KVKK'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              {language === 'tr'
                ? 'Kişisel verilerinizin işlenmesi 6698 sayılı KVKK kapsamında gerçekleştirilir. Detaylı bilgi için KVKK Aydınlatma Metni\'ni inceleyebilirsiniz.'
                : 'Processing of your personal data is carried out within the scope of KVKK No. 6698. For detailed information, you can review the KVKK Information Text.'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-sm">
              {language === 'tr'
                ? 'Bu sözleşme, platformu kullanmaya başladığınız anda yürürlüğe girer. Sözleşme şartlarını kabul etmiyorsanız platformu kullanmamalısınız. Son güncelleme: 2024'
                : 'This agreement comes into effect when you start using the platform. If you do not accept the terms of the agreement, you should not use the platform. Last update: 2024'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}