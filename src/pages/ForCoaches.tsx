// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  BookOpen,
  MessageCircle,
  Video,
  Target,
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForCoaches() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title:
        language === 'tr'
          ? 'Pasif Gelir Fırsatları'
          : language === 'en'
          ? 'Passive Income Opportunities'
          : 'Opportunités de revenus passifs',
      description:
        language === 'tr'
          ? 'Platform üzerinden düzenli danışan akışı ile sürdürülebilir gelir elde edin. Komisyon oranları %15-25 arasında değişir.'
          : language === 'en'
          ? 'Earn sustainable income with regular client flow through the platform. Commission rates range from 15-25%.'
          : 'Obtenez des revenus durables avec un flux régulier de clients via la plateforme. Les taux de commission varient de 15 à 25%.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title:
        language === 'tr'
          ? 'Geniş Danışan Ağı'
          : language === 'en'
          ? 'Wide Client Network'
          : 'Large réseau de clients',
      description:
        language === 'tr'
          ? 'Bireysel danışanlardan kurumsal müşterilere kadar geniş bir yelpazede profesyonellerle çalışma fırsatı.'
          : language === 'en'
          ? 'Opportunity to work with professionals ranging from individual clients to corporate customers.'
          : 'Opportunité de travailler avec des professionnels allant des clients individuels aux entreprises.',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title:
        language === 'tr'
          ? 'Profesyonel Gelişim'
          : language === 'en'
          ? 'Professional Development'
          : 'Développement professionnel',
      description:
        language === 'tr'
          ? 'Webinarlar, vaka tartışmaları ve süpervizyon seansları ile sürekli gelişim imkanı.'
          : language === 'en'
          ? 'Continuous development opportunities through webinars, case discussions and supervision sessions.'
          : 'Opportunités de développement continu via des webinaires, discussions de cas et séances de supervision.',
    },
    {
      icon: <Video className="h-8 w-8" />,
      title:
        language === 'tr'
          ? 'Webinar ve Etkinlikler'
          : language === 'en'
          ? 'Webinars and Events'
          : 'Webinaires et événements',
      description:
        language === 'tr'
          ? 'Düzenli webinarlar düzenleyerek görünürlüğünüzü artırın ve sektörde öne çıkın.'
          : language === 'en'
          ? 'Increase your visibility and stand out in the industry by organizing regular webinars.'
          : "Augmentez votre visibilité et démarquez-vous dans l'industrie en organisant des webinaires réguliers.",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title:
        language === 'tr'
          ? 'MentorCircle Topluluğu'
          : language === 'en'
          ? 'MentorCircle Community'
          : 'Communauté MentorCircle',
      description:
        language === 'tr'
          ? 'Diğer koçlarla etkileşim, vaka paylaşımı ve profesyonel networking imkanı.'
          : language === 'en'
          ? 'Interaction with other coaches, case sharing and professional networking opportunities.'
          : "Interaction avec d'autres coachs, partage de cas et opportunités de réseautage professionnel.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title:
        language === 'tr'
          ? 'Tanınırlık ve Prestij'
          : language === 'en'
          ? 'Recognition and Prestige'
          : 'Reconnaissance et prestige',
      description:
        language === 'tr'
          ? 'Ayın Koçu, Haftanın Koçu gibi ödüllerle sektörde tanınırlığınızı artırın.'
          : language === 'en'
          ? 'Increase your recognition in the industry with awards like Coach of the Month and Coach of the Week.'
          : "Augmentez votre reconnaissance dans l'industrie avec des récompenses comme Coach du Mois et Coach de la Semaine.",
    },
  ];

  const ecosystem = [
    {
      title:
        language === 'tr'
          ? 'İçerik Üretimi'
          : language === 'en'
          ? 'Content Creation'
          : 'Création de contenu',
      description:
        language === 'tr'
          ? 'MentorCircle üzerinden makaleler, vaka çalışmaları ve tartışmalar paylaşarak uzmanlığınızı sergileyin.'
          : language === 'en'
          ? 'Showcase your expertise by sharing articles, case studies and discussions on MentorCircle.'
          : "Présentez votre expertise en partageant des articles, études de cas et discussions sur MentorCircle.",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      title:
        language === 'tr'
          ? 'Webinar Düzenleme'
          : language === 'en'
          ? 'Hosting Webinars'
          : 'Organisation de webinaires',
      description:
        language === 'tr'
          ? 'Düzenli webinarlar ile hem danışanlarla hem diğer koçlarla etkileşim kurun.'
          : language === 'en'
          ? 'Interact with both clients and other coaches through regular webinars.'
          : 'Interagissez avec les clients et les autres coachs via des webinaires réguliers.',
      icon: <Video className="h-6 w-6" />,
    },
    {
      title:
        language === 'tr'
          ? 'Vaka Tartışmaları'
          : language === 'en'
          ? 'Case Discussions'
          : 'Discussions de cas',
      description:
        language === 'tr'
          ? 'Diğer koçlarla vaka tartışmaları yaparak profesyonel gelişiminizi sürdürün.'
          : language === 'en'
          ? 'Continue your professional development by discussing cases with other coaches.'
          : "Poursuivez votre développement professionnel en discutant de cas avec d'autres coachs.",
      icon: <MessageCircle className="h-6 w-6" />,
    },
    {
      title:
        language === 'tr'
          ? 'Etkileşim ve Görünürlük'
          : language === 'en'
          ? 'Engagement and Visibility'
          : 'Engagement et visibilité',
      description:
        language === 'tr'
          ? 'Aktif katılım ve kaliteli içeriklerle Ayın Koçu veya Haftanın Koçu seçilebilirsiniz.'
          : language === 'en'
          ? 'With active participation and quality content, you can be selected as Coach of the Month or Coach of the Week.'
          : "Avec une participation active et un contenu de qualité, vous pouvez être sélectionné comme Coach du Mois ou Coach de la Semaine.",
      icon: <Star className="h-6 w-6" />,
    },
  ];

  const revenueModel = [
    {
      title:
        language === 'tr'
          ? 'Kurucu Koç Avantajı'
          : language === 'en'
          ? 'Founding Coach Advantage'
          : 'Avantage coach fondateur',
      description:
        language === 'tr'
          ? 'İlk 50 koç için %15 komisyon oranı (standart %20 yerine).'
          : language === 'en'
          ? '15% commission rate for the first 50 coaches (instead of standard 20%).'
          : 'Taux de commission de 15% pour les 50 premiers coachs (au lieu de 20% standard).',
    },
    {
      title:
        language === 'tr'
          ? 'Esnek Ücretlendirme'
          : language === 'en'
          ? 'Flexible Pricing'
          : 'Tarification flexible',
      description:
        language === 'tr'
          ? 'Kendi seans ücretinizi belirleyin (önerilen: 750-2000 ₺).'
          : language === 'en'
          ? 'Set your own session fee (recommended: 750-2000 ₺).'
          : 'Fixez vos propres tarifs de séance (recommandé : 750-2000 ₺).',
    },
    {
      title:
        language === 'tr'
          ? 'Kurumsal Anlaşmalar'
          : language === 'en'
          ? 'Corporate Agreements'
          : "Accords d'entreprise",
      description:
        language === 'tr'
          ? 'Şirket anlaşmalarından düzenli gelir fırsatı.'
          : language === 'en'
          ? 'Regular income opportunity from corporate agreements.'
          : "Opportunité de revenus réguliers grâce aux accords d'entreprise.",
    },
    {
      title:
        language === 'tr'
          ? 'Ödeme Güvencesi'
          : language === 'en'
          ? 'Payment Guarantee'
          : 'Garantie de paiement',
      description:
        language === 'tr'
          ? 'Seanslarınızın ödemesi platform tarafından garanti edilir.'
          : language === 'en'
          ? 'Payment for your sessions is guaranteed by the platform.'
          : 'Le paiement de vos séances est garanti par la plateforme.',
    },
  ];

  const qualityCriteria = [
    {
      title:
        language === 'tr'
          ? 'ICF veya MYK Sertifikası'
          : language === 'en'
          ? 'ICF or MYK Certification'
          : 'Certification ICF ou MYK',
      description:
        language === 'tr'
          ? 'Uluslararası veya ulusal geçerliliğe sahip koçluk sertifikası zorunludur.'
          : language === 'en'
          ? 'International or nationally recognized coaching certification is required.'
          : 'Une certification de coaching reconnue internationalement ou nationalement est requise.',
    },
    {
      title:
        language === 'tr'
          ? 'Minimum Deneyim'
          : language === 'en'
          ? 'Minimum Experience'
          : 'Expérience minimale',
      description:
        language === 'tr'
          ? 'En az 2 yıl koçluk deneyimi veya 100 saat koçluk pratiği.'
          : language === 'en'
          ? 'At least 2 years of coaching experience or 100 hours of coaching practice.'
          : "Au moins 2 ans d'expérience en coaching ou 100 heures de pratique de coaching.",
    },
    {
      title:
        language === 'tr'
          ? 'Sürekli Gelişim'
          : language === 'en'
          ? 'Continuous Development'
          : 'Développement continu',
      description:
        language === 'tr'
          ? 'Yıllık süpervizyon ve eğitim gereksinimlerini karşılama taahhüdü.'
          : language === 'en'
          ? 'Commitment to meet annual supervision and training requirements.'
          : 'Engagement à respecter les exigences annuelles de supervision et de formation.',
    },
    {
      title:
        language === 'tr'
          ? 'Kalite Standartları'
          : language === 'en'
          ? 'Quality Standards'
          : 'Normes de qualité',
      description:
        language === 'tr'
          ? 'Minimum 4.0/5.0 puan ortalaması korunmalıdır. 3.5 altı için destek programı uygulanır.'
          : language === 'en'
          ? 'Minimum 4.0/5.0 rating average must be maintained. Support program below 3.5.'
          : 'Une moyenne minimale de 4.0/5.0 doit être maintenue. Programme de soutien en dessous de 3.5.',
    },
  ];

  // 2025 istatistikleri
  const stats2025 = [
    {
      icon: <Users className="h-10 w-10" />,
      value: '120+',
      tr: { title: 'Aktif Koç', desc: 'Türkiye ve MENA bölgesinde' },
      en: { title: 'Active Coaches', desc: 'Across Turkey & MENA' },
      fr: { title: 'Coachs actifs', desc: 'En Turquie et région MENA' },
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      value: '15.000+',
      tr: { title: 'Tamamlanan Seans', desc: '2025 ilk yarı verisi' },
      en: { title: 'Completed Sessions', desc: 'First half of 2025' },
      fr: { title: 'Séances réalisées', desc: 'Premier semestre 2025' },
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      value: '18.500₺',
      tr: { title: 'Aylık Ort. Gelir', desc: 'Aktif koç başına' },
      en: { title: 'Avg. Monthly Income', desc: 'Per active coach' },
      fr: { title: 'Revenu mensuel moyen', desc: 'Par coach actif' },
    },
    {
      icon: <Star className="h-10 w-10" />,
      value: '4.8 / 5',
      tr: { title: 'Memnuniyet Skoru', desc: 'Danışan değerlendirmeleri' },
      en: { title: 'Satisfaction Score', desc: 'Client ratings' },
      fr: { title: 'Score de satisfaction', desc: 'Avis des clients' },
    },
  ];

  const tStats = (item) => {
    if (language === 'en') return item.en;
    if (language === 'fr') return item.fr;
    return item.tr;
  };

  const handleApplyClick = () => {
    navigate('/coach-application');
  };

  const handleSelectionClick = () => {
    navigate('/coach-selection-process');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO – renk aynen bırakıldı */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Sol: metin + CTA */}
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white text-red-600 hover:bg-white">
              {language === 'tr'
                ? 'Koçlar İçin Özel'
                : language === 'en'
                ? 'Exclusive for Coaches'
                : 'Exclusif pour les coachs'}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {language === 'tr'
                ? "Kariyeer Ekosisteminin Bir Parçası Olun"
                : language === 'en'
                ? 'Become Part of the Kariyeer Ecosystem'
                : "Rejoignez l'écosystème Kariyeer"}
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-red-50">
              {language === 'tr'
                ? 'Pasif gelir, profesyonel gelişim ve 2025’te büyüyen koç ekosistemiyle tanınırlık kazanın.'
                : language === 'en'
                ? 'Gain passive income, professional development and growing recognition in the 2025 coach ecosystem.'
                : "Générez des revenus passifs, développez-vous professionnellement et gagnez en visibilité dans l'écosystème des coachs 2025."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-red-50 text-lg px-8"
                onClick={handleApplyClick}
              >
                {language === 'tr'
                  ? 'Hemen Başvur'
                  : language === 'en'
                  ? 'Apply Now'
                  : 'Postuler maintenant'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8"
                onClick={handleSelectionClick}
              >
                {language === 'tr'
                  ? 'Seçim Süreci'
                  : language === 'en'
                  ? 'Selection Process'
                  : 'Processus de sélection'}
              </Button>
            </div>

            {/* Koç görselleri / avatar şeridi */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-[url('https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg')] bg-cover bg-center" />
                <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-[url('https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg')] bg-cover bg-center" />
                <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-[url('https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg')] bg-cover bg-center" />
              </div>
              <p className="text-sm text-red-50">
                {language === 'tr'
                  ? '2025 itibarıyla 120+ aktif koç, 15.000+ tamamlanan seans.'
                  : language === 'en'
                  ? 'As of 2025, 120+ active coaches and 15,000+ completed sessions.'
                  : "En 2025, plus de 120 coachs actifs et 15 000+ séances réalisées."}
              </p>
            </div>
          </div>

          {/* Sağ: küçük istatistik kartı */}
          <div className="hidden md:block">
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] mb-1 opacity-70">
                      2025 Snapshot
                    </p>
                    <p className="text-2xl font-bold">Kariyeer Coach Panel</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-yellow-300" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs opacity-70">
                      {language === 'tr' ? 'Aktif Koç' : language === 'en' ? 'Active Coaches' : 'Coachs actifs'}
                    </p>
                    <p className="text-xl font-bold">120+</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">
                      {language === 'tr' ? 'Aylık Ort. Seans' : language === 'en' ? 'Monthly Sessions' : 'Séances mensuelles'}
                    </p>
                    <p className="text-xl font-bold">1.800</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">
                      {language === 'tr' ? 'Memnuniyet' : language === 'en' ? 'Satisfaction' : 'Satisfaction'}
                    </p>
                    <p className="text-xl font-bold">4.8/5</p>
                  </div>
                </div>
                <p className="text-xs text-red-50/90">
                  {language === 'tr'
                    ? 'Veriler 2025 ilk yarı proje projeksiyonudur ve beta koç grubuna dayanmaktadır.'
                    : language === 'en'
                    ? 'Data reflects 2025 H1 projections based on the beta coach cohort.'
                    : "Les données reflètent les projections du premier semestre 2025 basées sur le groupe de coachs bêta."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Koç olmanın avantajları (benefits) */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr'
                ? 'Kariyeer’de Koç Olmanın Avantajları'
                : language === 'en'
                ? 'Advantages of Being a Coach on Kariyeer'
                : 'Avantages d’être coach sur Kariyeer'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'Sürdürülebilir gelir, güçlü bir topluluk ve görünürlük odaklı bir ekosistem.'
                : language === 'en'
                ? 'A sustainable income, strong community and visibility-focused ecosystem.'
                : "Un revenu durable, une communauté forte et un écosystème axé sur la visibilité."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader>
                  <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl text-red-600">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ekosistemde nasıl aktif olursunuz? */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr'
                ? 'Ekosistemde Nasıl Aktif Olursunuz?'
                : language === 'en'
                ? 'How to Be Active in the Ecosystem?'
                : "Comment être actif dans l'écosystème ?"}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'İçerik, etkileşim ve katılım ile sektörde öne çıkın.'
                : language === 'en'
                ? 'Stand out in the industry with content, engagement and participation.'
                : "Démarquez-vous dans l'industrie avec du contenu, de l'engagement et de la participation."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ecosystem.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      {item.icon}
                    </div>
                    <CardTitle className="text-xl text-red-600">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-600 mb-4">
                  {language === 'tr'
                    ? 'Ayın Koçu veya Haftanın Koçu Olun!'
                    : language === 'en'
                    ? 'Become Coach of the Month or Coach of the Week!'
                    : 'Devenez Coach du Mois ou Coach de la Semaine !'}
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  {language === 'tr'
                    ? 'Aktif katılım, kaliteli içerik üretimi ve yüksek danışan memnuniyeti ile öne çıkan koçlar her hafta ve ay ödüllendirilir. Ana sayfada özel vitrin, rozet ve artan görünürlük kazanın.'
                    : language === 'en'
                    ? 'Coaches who stand out with active participation, quality content and high client satisfaction are rewarded every week and month. Gain special homepage feature, badge and increased visibility.'
                    : "Les coachs qui se distinguent par une participation active, un contenu de qualité et une forte satisfaction client sont récompensés chaque semaine et chaque mois. Gagnez une mise en avant spéciale, un badge et plus de visibilité."}
                </p>
                <Link to="/mentor-circle">
                  <Button className="bg-red-600 hover:bg-red-700">
                    {language === 'tr'
                      ? "MentorCircle'a Katıl"
                      : language === 'en'
                      ? 'Join MentorCircle'
                      : 'Rejoindre MentorCircle'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2025 İSTATİSTİKLERİ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr'
                ? '2025 Kariyeer Koç Ekosistemi İstatistikleri'
                : language === 'en'
                ? '2025 Kariyeer Coach Ecosystem Statistics'
                : "Statistiques de l'écosystème des coachs Kariyeer 2025"}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'Veriler, ekosistemin nereye gittiğini ve koçlar için gelir potansiyelini gösterir.'
                : language === 'en'
                ? 'These numbers show where the ecosystem is heading and the income potential for coaches.'
                : "Ces chiffres montrent la direction de l'écosystème et le potentiel de revenus pour les coachs."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats2025.map((item, index) => {
              const label = tStats(item);
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow border-red-100"
                >
                  <CardHeader>
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                      {item.icon}
                    </div>
                    <CardTitle className="text-2xl text-red-600">
                      {item.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-1">{label.title}</p>
                    <p className="text-sm text-gray-600">{label.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* GELİR MODELİ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr'
                ? 'Gelir Modeli ve 2025 Projeksiyonu'
                : language === 'en'
                ? 'Revenue Model & 2025 Projection'
                : 'Modèle de revenus et projections 2025'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'Şeffaf, adil ve koçların büyümesini merkeze alan bir gelir yapısı.'
                : language === 'en'
                ? 'A transparent, fair revenue model designed around coach growth.'
                : "Un modèle de revenus transparent et équitable centré sur la croissance des coachs."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {revenueModel.map((item, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-red-100"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg text-red-600">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <DollarSign className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">%15-25</h3>
                  <p className="text-red-50">
                    {language === 'tr'
                      ? 'Platform Komisyonu'
                      : language === 'en'
                      ? 'Platform Commission'
                      : 'Commission de plateforme'}
                  </p>
                </div>
                <div>
                  <Briefcase className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">750-2000₺</h3>
                  <p className="text-red-50">
                    {language === 'tr'
                      ? 'Önerilen Seans Ücreti'
                      : language === 'en'
                      ? 'Recommended Session Fee'
                      : 'Tarif de séance recommandé'}
                  </p>
                </div>
                <div>
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">∞</h3>
                  <p className="text-red-50">
                    {language === 'tr'
                      ? 'Sınırsız Gelir Potansiyeli'
                      : language === 'en'
                      ? 'Unlimited Income Potential'
                      : 'Potentiel de revenus illimité'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KOÇ SEÇİM AŞAMALARI / KRİTERLER */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr'
                ? 'Koç Seçim Aşamaları ve Kriterleri'
                : language === 'en'
                ? 'Coach Selection Stages & Criteria'
                : 'Étapes et critères de sélection des coachs'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'Kalite standartlarımız, hem koçların hem danışanların güvenini korumak için tasarlandı.'
                : language === 'en'
                ? 'Our quality standards are designed to protect the trust of both coaches and clients.'
                : "Nos normes de qualité sont conçues pour protéger la confiance des coachs et des clients."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {qualityCriteria.map((criterion, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-red-600">
                      {criterion.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{criterion.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={handleSelectionClick}
            >
              {language === 'tr'
                ? 'Tam Seçim Süreci'
                : language === 'en'
                ? 'Full Selection Process'
                : 'Processus de sélection complet'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'tr'
              ? "Kariyeer Ekosisteminin Bir Parçası Olmaya Hazır mısınız?"
              : language === 'en'
              ? 'Ready to Become Part of the Kariyeer Ecosystem?'
              : "Prêt à rejoindre l'écosystème Kariyeer ?"}
          </h2>
          <p className="text-xl mb-8 text-red-50">
            {language === 'tr'
              ? 'Başvurunuzu yapın, ekosisteme katılın ve kariyer koçluğunda yeni bir sayfa açın.'
              : language === 'en'
              ? 'Submit your application, join the ecosystem and open a new chapter in career coaching.'
              : "Soumettez votre candidature, rejoignez l'écosystème et ouvrez un nouveau chapitre dans le coaching de carrière."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-red-50 text-lg px-8"
              onClick={handleApplyClick}
            >
              {language === 'tr'
                ? 'Koç Başvurusu Yap'
                : language === 'en'
                ? 'Apply as Coach'
                : 'Postuler en tant que coach'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/mentor-circle">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8"
              >
                {language === 'tr'
                  ? "MentorCircle'ı Keşfet"
                  : language === 'en'
                  ? 'Explore MentorCircle'
                  : 'Découvrir MentorCircle'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
