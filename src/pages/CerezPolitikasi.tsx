import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CerezPolitikasi() {
  const { language } = useLanguage();

  const cookieTypes = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: language === 'tr' ? 'Zorunlu Çerezler' : 'Necessary Cookies',
      description: language === 'tr'
        ? 'Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezlerdir. Oturum yönetimi, güvenlik ve kimlik doğrulama için kullanılır.'
        : 'These are cookies necessary for the website to perform its basic functions. Used for session management, security and authentication.',
      examples: language === 'tr' ? 'Oturum kimliği, güvenlik tokeni, dil tercihi' : 'Session ID, security token, language preference',
      duration: language === 'tr' ? 'Oturum süresi veya 1 yıl' : 'Session duration or 1 year',
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: language === 'tr' ? 'İşlevsel Çerezler' : 'Functional Cookies',
      description: language === 'tr'
        ? 'Kullanıcı tercihlerini hatırlamak ve kişiselleştirilmiş deneyim sunmak için kullanılır.'
        : 'Used to remember user preferences and provide a personalized experience.',
      examples: language === 'tr' ? 'Dil seçimi, tema tercihi, form verileri' : 'Language selection, theme preference, form data',
      duration: language === 'tr' ? '1 yıl' : '1 year',
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: language === 'tr' ? 'Analitik Çerezler' : 'Analytics Cookies',
      description: language === 'tr'
        ? 'Web sitesi kullanımını analiz etmek ve hizmet kalitesini artırmak için kullanılır. Anonim istatistiksel veriler toplar.'
        : 'Used to analyze website usage and improve service quality. Collects anonymous statistical data.',
      examples: language === 'tr' ? 'Sayfa görüntüleme, tıklama oranları, kullanıcı davranışları' : 'Page views, click rates, user behavior',
      duration: language === 'tr' ? '2 yıl' : '2 years',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cookie className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr'
              ? 'Web sitemizde kullanılan çerezler hakkında bilgilendirme'
              : 'Information about cookies used on our website'}
          </p>
        </div>

        <Card className="mb-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? 'Çerez Nedir?' : 'What is a Cookie?'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              {language === 'tr'
                ? 'Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, telefon) kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin düzgün çalışmasını sağlamak, kullanıcı deneyimini iyileştirmek ve site kullanımı hakkında istatistiksel bilgi toplamak için kullanılır.'
                : 'Cookies are small text files that are saved to your device (computer, tablet, phone) when you visit websites. Cookies are used to ensure the proper functioning of the website, improve user experience and collect statistical information about site usage.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {language === 'tr'
                ? 'Kariyeer platformu olarak, hizmetlerimizi sunabilmek ve kullanıcı deneyimini iyileştirebilmek için çerezler kullanmaktayız. Bu politika, hangi çerezleri kullandığımızı ve bunların nasıl yönetileceğini açıklamaktadır.'
                : 'As the Kariyeer platform, we use cookies to provide our services and improve user experience. This policy explains which cookies we use and how they can be managed.'}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6 mb-8">
          {cookieTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    {type.icon}
                  </div>
                  {type.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">{type.description}</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong className="text-gray-900">
                      {language === 'tr' ? 'Örnekler:' : 'Examples:'}
                    </strong>{' '}
                    <span className="text-gray-600">{type.examples}</span>
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-900">
                      {language === 'tr' ? 'Saklama Süresi:' : 'Retention Period:'}
                    </strong>{' '}
                    <span className="text-gray-600">{type.duration}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? 'Çerezleri Nasıl Yönetebilirsiniz?' : 'How Can You Manage Cookies?'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              {language === 'tr'
                ? 'Tarayıcınızın ayarlarından çerezleri kabul etmeme, silme veya belirli çerezleri engelleme seçeneklerini kullanabilirsiniz. Ancak, zorunlu çerezleri devre dışı bırakmanız durumunda web sitemizin bazı özellikleri düzgün çalışmayabilir.'
                : 'You can use the options to reject, delete or block certain cookies from your browser settings. However, if you disable necessary cookies, some features of our website may not work properly.'}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                {language === 'tr' ? 'Popüler Tarayıcılarda Çerez Ayarları:' : 'Cookie Settings in Popular Browsers:'}
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Google Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                <li>• Mozilla Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                <li>• Safari: Tercihler → Gizlilik → Çerezler</li>
                <li>• Microsoft Edge: Ayarlar → Gizlilik → Çerezler</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? 'Politika Güncellemeleri' : 'Policy Updates'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {language === 'tr'
                ? 'Bu çerez politikası, yasal düzenlemeler ve hizmet değişiklikleri doğrultusunda güncellenebilir. Önemli değişiklikler olduğunda kullanıcılarımızı bilgilendireceğiz. Son güncelleme tarihi: 2024'
                : 'This cookie policy may be updated in line with legal regulations and service changes. We will inform our users when there are significant changes. Last update date: 2024'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}