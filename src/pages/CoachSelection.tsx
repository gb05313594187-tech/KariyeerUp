import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle, Users, Globe, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

export default function CoachSelection() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const selectionCriteria = [
    {
      icon: <Award className="h-6 w-6" />,
      title: language === 'tr' ? 'ICF veya MYK Sertifikası' : 'ICF or MYK Certification',
      description: language === 'tr' 
        ? 'ICF onaylı (ACC, PCC, MCC) veya MYK Seviye 6 sertifikalı olmak'
        : 'ICF approved (ACC, PCC, MCC) or MYK Level 6 certified',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: language === 'tr' ? 'Deneyim' : 'Experience',
      description: language === 'tr'
        ? 'Tercihen en az 5 yıl deneyime sahip olmak'
        : 'Preferably at least 5 years of experience',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: language === 'tr' ? 'Video Tanıtım' : 'Video Introduction',
      description: language === 'tr'
        ? 'Video tanıtımı ile iletişim ve anlatım becerisi göstermek'
        : 'Demonstrate communication and presentation skills with video introduction',
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: language === 'tr' ? 'Referanslar' : 'References',
      description: language === 'tr'
        ? 'LinkedIn referansları ve danışan değerlendirmeleri'
        : 'LinkedIn references and client reviews',
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: language === 'tr' ? 'Alan Çeşitliliği' : 'Field Diversity',
      description: language === 'tr'
        ? 'Alan çeşitliliğini gözetmek: öğrenci, kariyer, liderlik vb.'
        : 'Consider field diversity: student, career, leadership, etc.',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: language === 'tr' ? 'Dil Yetkinliği' : 'Language Proficiency',
      description: language === 'tr'
        ? 'En az %30 oranında İngilizce bilen koçlar dahil edilmiştir'
        : 'At least 30% of coaches are English-speaking',
    },
  ];

  const founderBenefits = [
    language === 'tr' ? 'İlk 6 ay ücretsiz veya %5 düşük komisyon avantajı' : 'First 6 months free or 5% lower commission',
    language === 'tr' ? '"Kurucu Koç" etiketiyle görünürlük' : '"Founding Coach" badge for visibility',
    language === 'tr' ? 'Blog içeriklerinde tanıtım fırsatları' : 'Promotion opportunities in blog content',
    language === 'tr' ? 'Geliştirme sürecine geri bildirimle katılım' : 'Participation in development process with feedback',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'İlk Koçlarımız Nasıl Seçiliyor?' : 'How Are Our First Coaches Selected?'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'tr' 
              ? 'Kaliteyi ve güveni esas alan seçim kriterlerimiz'
              : 'Our selection criteria based on quality and trust'}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-12 border-red-200">
          <CardContent className="pt-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'tr'
                ? 'Platformumuzda yer alan ilk 100 koç, aşağıdaki kriterlere göre titizlikle seçilir. Amacımız, danışanlara yüksek kaliteli ve belgeli koçluk hizmeti sunmaktır:'
                : 'The first 100 coaches on our platform are carefully selected according to the following criteria. Our goal is to provide high-quality and certified coaching services to clients:'}
            </p>
          </CardContent>
        </Card>

        {/* Selection Criteria */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">
            {language === 'tr' ? 'Seçim Kriterleri' : 'Selection Criteria'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectionCriteria.map((criterion, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                    {criterion.icon}
                  </div>
                  <CardTitle className="text-lg text-red-600">{criterion.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{criterion.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Founder Coach Benefits */}
        <Card className="mb-12 bg-gradient-to-r from-red-50 to-white border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600 flex items-center">
              <Star className="mr-3 h-6 w-6" />
              {language === 'tr' ? 'Kurucu Koç Avantajları' : 'Founding Coach Benefits'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {founderBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to="/coach-application">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              {language === 'tr' ? 'Koç Başvuru Formu\'nu Doldurmak İçin Tıklayın' : 'Click to Fill Coach Application Form'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}