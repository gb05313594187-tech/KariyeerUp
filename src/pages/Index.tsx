import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Award,
  Target,
  Users,
  TrendingUp,
  Briefcase,
  GraduationCap,
  UserCheck,
  Calendar,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';
import { coaches } from '@/data/mockData';
import { getCirclePosts, getCoachOfTheMonth } from '@/data/circleData';
import Navbar from '@/components/Navbar';

export default function Index() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const featuredCoaches = coaches.slice(0, 3);
  const recentPosts = getCirclePosts().slice(0, 3);
  const coachOfMonth = getCoachOfTheMonth();

  const services = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: t('careerTransition'),
      description: getNavText(
        'Kariyer değişikliği sürecinizde profesyonel destek',
        'Professional support in your career change process',
        'Soutien professionnel dans votre processus de changement de carrière'
      ),
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: t('interviewPrep'),
      description: getNavText(
        'Mülakatlara hazırlık ve özgüven kazanma',
        'Interview preparation and confidence building',
        'Préparation aux entretiens et renforcement de la confiance'
      ),
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('leadershipDev'),
      description: getNavText(
        'Liderlik becerilerinizi geliştirin',
        'Develop your leadership skills',
        'Développez vos compétences en leadership'
      ),
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: t('newGraduate'),
      description: getNavText(
        'Yeni mezunlar için kariyer yol haritası',
        'Career roadmap for new graduates',
        'Feuille de route de carrière pour les nouveaux diplômés'
      ),
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: t('executiveCoaching'),
      description: getNavText(
        'Üst düzey yöneticiler için koçluk',
        'Coaching for senior executives',
        'Coaching pour cadres supérieurs'
      ),
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: t('careerPlanning'),
      description: getNavText(
        'Uzun vadeli kariyer hedeflerinizi belirleyin',
        'Define your long-term career goals',
        'Définissez vos objectifs de carrière à long terme'
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-50 animate-in fade-in delay-300 duration-700">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in delay-500 duration-700">
            <Link to="/coaches">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8">
                <Calendar className="mr-2 h-5 w-5" />
                {t('bookNow')}
              </Button>
            </Link>
            <Link to="/mentor-circle">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {getNavText('MentorCircle\'a Katıl', 'Join MentorCircle', 'Rejoindre MentorCircle')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coach of the Month Highlight */}
      <section className="py-12 px-4 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <Card className="border-2 border-yellow-400">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-32 w-32 ring-4 ring-yellow-400">
                      <AvatarImage src={coachOfMonth.avatar} />
                      <AvatarFallback>{coachOfMonth.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-2 bg-yellow-500 text-white">
                    {getNavText('Ayın Konuşmacısı', 'Speaker of the Month', 'Conférencier du mois')}
                  </Badge>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">{coachOfMonth.name}</h2>
                  <p className="text-lg text-gray-700 mb-2">{coachOfMonth.title}</p>
                  <p className="text-gray-600 mb-4">{coachOfMonth.bio}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{coachOfMonth.stats.posts}</p>
                      <p className="text-sm text-gray-600">
                        {getNavText('Paylaşım', 'Posts', 'Publications')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{coachOfMonth.stats.likes}</p>
                      <p className="text-sm text-gray-600">
                        {getNavText('Beğeni', 'Likes', 'J\'aime')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{coachOfMonth.stats.engagement}</p>
                      <p className="text-sm text-gray-600">
                        {getNavText('Etkileşim', 'Engagement', 'Engagement')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link to={`/coach/${coachOfMonth.id}`}>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      {getNavText('Profile Git', 'View Profile', 'Voir le profil')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600 flex items-center">
                  <Target className="mr-3 h-6 w-6" />
                  {getNavText('Vizyonumuz', 'Our Vision', 'Notre Vision')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {getNavText(
                    'Türkiye\'nin en güvenilir ve kaliteli kariyer koçluğu platformu olmak. Her bireyin potansiyelini keşfetmesine ve kariyer hedeflerine ulaşmasına yardımcı olmak.',
                    'To be Turkey\'s most reliable and quality career coaching platform. To help every individual discover their potential and achieve their career goals.',
                    'Être la plateforme de coaching de carrière la plus fiable et de qualité en Turquie. Aider chaque individu à découvrir son potentiel et à atteindre ses objectifs de carrière.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600 flex items-center">
                  <Award className="mr-3 h-6 w-6" />
                  {getNavText('Misyonumuz', 'Our Mission', 'Notre Mission')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {getNavText(
                    'ICF ve MYK sertifikalı profesyonel koçlarla, bireylerin kariyer yolculuklarında yanlarında olmak. Kaliteli, erişilebilir ve etkili koçluk hizmeti sunmak.',
                    'To be alongside individuals in their career journeys with ICF and MYK certified professional coaches. To provide quality, accessible and effective coaching services.',
                    'Être aux côtés des individus dans leur parcours professionnel avec des coachs professionnels certifiés ICF et MYK. Fournir des services de coaching de qualité, accessibles et efficaces.'
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MentorCircle Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {getNavText('MentorCircle Topluluğu', 'MentorCircle Community', 'Communauté MentorCircle')}
            </h2>
            <p className="text-xl text-gray-600">
              {getNavText(
                'Koçlardan güncel içerikler, vaka tartışmaları ve profesyonel içgörüler',
                'Current content from coaches, case discussions and professional insights',
                'Contenu actuel des coachs, discussions de cas et perspectives professionnelles'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {recentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{post.author.name}</p>
                      <p className="text-xs text-gray-500">{post.author.title}</p>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </span>
                    <span>{post.likes} {getNavText('beğeni', 'likes', 'j\'aime')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/mentor-circle">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                {getNavText('Tüm İçerikleri Gör', 'View All Content', 'Voir tout le contenu')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is Career Coaching */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">
            {getNavText('Kariyer Koçluğu Nedir?', 'What is Career Coaching?', 'Qu\'est-ce que le coaching de carrière?')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-red-600">
                  {getNavText('Hedef Belirleme', 'Goal Setting', 'Définition des objectifs')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {getNavText(
                    'Kariyer hedeflerinizi netleştirin ve ulaşılabilir adımlara dönüştürün.',
                    'Clarify your career goals and turn them into achievable steps.',
                    'Clarifiez vos objectifs de carrière et transformez-les en étapes réalisables.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-red-600">
                  {getNavText('Kişisel Gelişim', 'Personal Development', 'Développement personnel')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {getNavText(
                    'Güçlü yönlerinizi keşfedin ve gelişim alanlarınızı belirleyin.',
                    'Discover your strengths and identify areas for development.',
                    'Découvrez vos forces et identifiez les domaines de développement.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-red-600">
                  {getNavText('Eylem Planı', 'Action Plan', 'Plan d\'action')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {getNavText(
                    'Somut adımlarla hedeflerinize doğru ilerleyin ve sonuç alın.',
                    'Move towards your goals with concrete steps and get results.',
                    'Avancez vers vos objectifs avec des étapes concrètes et obtenez des résultats.'
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">
            {getNavText('Hizmet Alanlarımız', 'Our Services', 'Nos services')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:-translate-y-1 border-red-100"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-red-600">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Coaches */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">
            {getNavText('Öne Çıkan Koçlar', 'Featured Coaches', 'Coachs en vedette')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach) => (
              <Card key={coach.id} className="hover:shadow-xl transition-shadow border-red-100">
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-red-200">
                      <AvatarImage src={coach.avatar} />
                      <AvatarFallback>{coach.name[0]}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl text-red-600">{coach.name}</CardTitle>
                    <Badge className="mt-2 bg-red-600">{coach.certification}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 line-clamp-3">
                    {language === 'tr' ? coach.bio : coach.bioEn}
                  </p>
                  <div className="flex justify-center gap-4 text-sm">
                    <div>
                      <p className="font-bold text-red-600">{coach.experience}</p>
                      <p className="text-gray-500">{t('yearsExperience')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-red-600">{coach.price} ₺</p>
                      <p className="text-gray-500">{t('sessionPrice')}</p>
                    </div>
                  </div>
                  <Link to={`/coach/${coach.id}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      {getNavText('Profile Git', 'View Profile', 'Voir le profil')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/coaches">
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                {t('discoverCoaches')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {getNavText(
              'Kariyer Yolculuğunuza Bugün Başlayın',
              'Start Your Career Journey Today',
              'Commencez votre parcours professionnel aujourd\'hui'
            )}
          </h2>
          <p className="text-xl mb-8 text-red-50">
            {getNavText(
              'ICF sertifikalı profesyonel koçlarımızla hedeflerinize ulaşın',
              'Reach your goals with our ICF certified professional coaches',
              'Atteignez vos objectifs avec nos coachs professionnels certifiés ICF'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/coaches">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8">
                {t('bookNow')}
              </Button>
            </Link>
            <Link to="/coach-application">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8"
              >
                {getNavText('Koç Olarak Başvur', 'Apply as Coach', 'Postuler en tant que coach')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}