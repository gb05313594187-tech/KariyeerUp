import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Building2, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

export default function RevenueModel() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const revenueStreams = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: language === 'tr' ? 'Koçtan Komisyon' : 'Coach Commission',
      description: language === 'tr' ? '%15–25 arasında komisyon oranı' : '15-25% commission rate',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: language === 'tr' ? 'Premium Üyelik' : 'Premium Membership',
      description: language === 'tr' 
        ? 'Aylık sabit ücretle öne çıkma ve analiz araçları'
        : 'Monthly subscription for visibility and analytics tools',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'tr' ? 'Kullanıcı Aboneliği' : 'User Subscription',
      description: language === 'tr' ? 'Paketli seans planları' : 'Bundled session packages',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: language === 'tr' ? 'B2B – Kurumsal Paket' : 'B2B – Corporate Package',
      description: language === 'tr' 
        ? 'Kurumsal koçluk programları ve çalışan gelişim paketleri'
        : 'Corporate coaching programs and employee development packages',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const corporateServices = [
    language === 'tr' ? 'Aday değerlendirme koçluğu' : 'Candidate assessment coaching',
    language === 'tr' ? 'Çalışan gelişim seansları' : 'Employee development sessions',
    language === 'tr' ? '3-6 aylık programlar' : '3-6 month programs',
    language === 'tr' ? 'Özel danışmanlık hizmetleri' : 'Custom consulting services',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'Platform Gelir Modeli' : 'Platform Revenue Model'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'tr'
              ? 'Yatırımcı dostu ve sürdürülebilir bir melez model'
              : 'An investor-friendly and sustainable hybrid model'}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-12 border-red-200">
          <CardContent className="pt-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'tr'
                ? 'Gelir yapımız yatırımcı dostu ve sürdürülebilir bir melez modele dayanır. Platformumuz, koçlar, kullanıcılar ve kurumsal müşteriler için değer yaratırken, çeşitli gelir akışları ile büyüme hedeflerimizi destekler.'
                : 'Our revenue structure is based on an investor-friendly and sustainable hybrid model. Our platform supports our growth objectives with various revenue streams while creating value for coaches, users, and corporate clients.'}
            </p>
          </CardContent>
        </Card>

        {/* Revenue Streams */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">
            {language === 'tr' ? 'Gelir Akışları' : 'Revenue Streams'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader>
                  <div className={`w-16 h-16 ${stream.color} rounded-lg flex items-center justify-center mb-4`}>
                    {stream.icon}
                  </div>
                  <CardTitle className="text-xl text-red-600">{stream.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg">{stream.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Corporate Package Details */}
        <Card className="mb-12 bg-gradient-to-r from-red-50 to-white border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600 flex items-center">
              <Building2 className="mr-3 h-6 w-6" />
              {language === 'tr' ? 'Kurumsal Paket Detayları' : 'Corporate Package Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'tr' ? 'Hizmetlerimiz:' : 'Our Services:'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {corporateServices.map((service, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{service}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {language === 'tr' ? 'Örnek Paket:' : 'Example Package:'}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 mb-2">
                      {language === 'tr' 
                        ? '10 çalışan için 3 aylık destek programı'
                        : '3-month support program for 10 employees'}
                    </p>
                    <Badge className="bg-red-600 text-white">
                      {language === 'tr' ? 'Popüler Paket' : 'Popular Package'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-600">40.000 ₺</p>
                    <p className="text-sm text-gray-500">
                      {language === 'tr' ? '3 ay' : '3 months'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>{language === 'tr' ? 'Not:' : 'Note:'}</strong>{' '}
                  {language === 'tr'
                    ? 'Kurumsal model için başvurular özel değerlendirmeye alınır. Her kurumun ihtiyaçlarına özel paketler hazırlanır.'
                    : 'Applications for the corporate model are subject to special evaluation. Custom packages are prepared for each organization\'s needs.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to="/partnership">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              {language === 'tr' ? 'Kurumsal Talep Formu\'nu Doldurmak İçin Tıklayın' : 'Click to Fill Corporate Request Form'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}