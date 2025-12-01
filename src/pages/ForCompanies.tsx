import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  TrendingDown,
  TrendingUp,
  Users,
  Heart,
  Zap,
  Building2,
  Target,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  BedDouble,
  Frown,
  Brain,
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function ForCompanies() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request submitted:', formData);
    alert(
      language === 'tr'
        ? 'Demo talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.'
        : language === 'en'
        ? 'Your demo request has been received! We will contact you as soon as possible.'
        : 'Votre demande de démo a été reçue! Nous vous contacterons dès que possible.'
    );
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      employeeCount: '',
      message: '',
    });
  };

  const handleContactClick = () => {
    alert(
      language === 'tr'
        ? 'İletişim formu yakında aktif olacak!'
        : language === 'en'
        ? 'Contact form will be active soon!'
        : 'Le formulaire de contact sera bientôt actif!'
    );
  };

  const handleSuccessStoriesClick = () => {
    alert(
      language === 'tr'
        ? 'Başarı hikayeleri sayfası yakında yayınlanacak!'
        : language === 'en'
        ? 'Success stories page will be published soon!'
        : 'La page des histoires de réussite sera bientôt publiée!'
    );
  };

  const statistics2025 = [
    {
      icon: <AlertTriangle className="h-12 w-12" />,
      value: '81%',
      label: language === 'tr' ? 'Çalışanlar stresin işlerini doğrudan etkilediğini belirtiyor' : language === 'en' ? 'Employees report stress directly affects their work' : 'Les employés signalent que le stress affecte directement leur travail',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: <Frown className="h-12 w-12" />,
      value: '63%',
      label: language === 'tr' ? 'En az bir kez "tükenmişlik" yaşadığını ifade ediyor' : language === 'en' ? 'Report experiencing burnout at least once' : 'Signalent avoir vécu un épuisement professionnel au moins une fois',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: <TrendingDown className="h-12 w-12" />,
      value: '70%',
      label: language === 'tr' ? 'İşe bağlılık seviyesinin son 5 yılda düştüğünü söylüyor' : language === 'en' ? 'Say engagement levels dropped in the last 5 years' : 'Disent que les niveaux d\'engagement ont baissé au cours des 5 dernières années',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: <BedDouble className="h-12 w-12" />,
      value: '48%',
      label: language === 'tr' ? 'Uyku problemleri nedeniyle verim kaybı yaşıyor' : language === 'en' ? 'Experience productivity loss due to sleep problems' : 'Subissent une perte de productivité due à des problèmes de sommeil',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <Brain className="h-12 w-12" />,
      value: '52%',
      label: language === 'tr' ? 'Psikolojik destek veya koçluk desteği almak istiyor' : language === 'en' ? 'Want psychological support or coaching' : 'Souhaitent un soutien psychologique ou un coaching',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: language === 'tr' ? 'İşe Bağlılıkta Artış' : language === 'en' ? 'Increase in Work Engagement' : 'Augmentation de l\'engagement au travail',
      description:
        language === 'tr'
          ? 'Koçluk alan çalışanlar %25 daha yüksek bağlılık gösteriyor'
          : language === 'en'
          ? 'Employees receiving coaching show 25% higher engagement'
          : 'Les employés bénéficiant de coaching montrent 25% d\'engagement en plus',
    },
    {
      icon: <TrendingDown className="h-8 w-8" />,
      title: language === 'tr' ? 'Devamsızlıkta Azalma' : language === 'en' ? 'Decrease in Absenteeism' : 'Diminution de l\'absentéisme',
      description:
        language === 'tr'
          ? 'İş yerinde koçluk programları devamsızlığı %32 azaltıyor'
          : language === 'en'
          ? 'Workplace coaching programs reduce absenteeism by 32%'
          : 'Les programmes de coaching en entreprise réduisent l\'absentéisme de 32%',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: language === 'tr' ? 'Tükenmişlik Oranlarında Düşüş' : language === 'en' ? 'Decrease in Burnout Rates' : 'Diminution des taux d\'épuisement',
      description:
        language === 'tr'
          ? 'Düzenli koçluk desteği tükenmişlik riskini %40 azaltıyor'
          : language === 'en'
          ? 'Regular coaching support reduces burnout risk by 40%'
          : 'Le soutien régulier en coaching réduit le risque d\'épuisement de 40%',
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: language === 'tr' ? 'İşveren Markasında Güçlenme' : language === 'en' ? 'Strengthening Employer Brand' : 'Renforcement de la marque employeur',
      description:
        language === 'tr'
          ? 'Çalışan gelişimine yatırım yapan şirketler %50 daha çekici'
          : language === 'en'
          ? 'Companies investing in employee development are 50% more attractive'
          : 'Les entreprises investissant dans le développement des employés sont 50% plus attractives',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'tr' ? 'Sessiz İstifaların Önüne Geçme' : language === 'en' ? 'Preventing Quiet Quitting' : 'Prévention du quiet quitting',
      description:
        language === 'tr'
          ? 'Koçluk desteği çalışan motivasyonunu ve performansını artırıyor'
          : language === 'en'
          ? 'Coaching support increases employee motivation and performance'
          : 'Le soutien en coaching augmente la motivation et les performances des employés',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: language === 'tr' ? 'Kurum Kültürünü Güçlendirme' : language === 'en' ? 'Strengthening Corporate Culture' : 'Renforcement de la culture d\'entreprise',
      description:
        language === 'tr'
          ? 'Ortak değerler ve gelişim odaklı kültür oluşturma'
          : language === 'en'
          ? 'Creating a culture focused on shared values and development'
          : 'Création d\'une culture axée sur les valeurs partagées et le développement',
    },
  ];

  const programs = [
    {
      title: language === 'tr' ? 'Bireysel Koçluk Programı' : language === 'en' ? 'Individual Coaching Program' : 'Programme de coaching individuel',
      description:
        language === 'tr'
          ? 'Çalışanlarınız için kişiselleştirilmiş kariyer koçluğu'
          : language === 'en'
          ? 'Personalized career coaching for your employees'
          : 'Coaching de carrière personnalisé pour vos employés',
      features: [
        language === 'tr' ? '1-1 koçluk seansları' : language === 'en' ? '1-1 coaching sessions' : 'Séances de coaching 1-1',
        language === 'tr' ? 'ICF sertifikalı koçlar' : language === 'en' ? 'ICF certified coaches' : 'Coachs certifiés ICF',
        language === 'tr' ? 'Esnek randevu sistemi' : language === 'en' ? 'Flexible appointment system' : 'Système de rendez-vous flexible',
        language === 'tr' ? 'İlerleme raporları' : language === 'en' ? 'Progress reports' : 'Rapports de progression',
      ],
    },
    {
      title: language === 'tr' ? 'Liderlik Gelişim Programı' : language === 'en' ? 'Leadership Development Program' : 'Programme de développement du leadership',
      description:
        language === 'tr'
          ? 'Yöneticileriniz için özel liderlik koçluğu'
          : language === 'en'
          ? 'Special leadership coaching for your managers'
          : 'Coaching de leadership spécial pour vos managers',
      features: [
        language === 'tr' ? 'Grup ve bireysel seanslar' : language === 'en' ? 'Group and individual sessions' : 'Séances de groupe et individuelles',
        language === 'tr' ? 'Liderlik değerlendirmeleri' : language === 'en' ? 'Leadership assessments' : 'Évaluations du leadership',
        language === 'tr' ? '360 derece geri bildirim' : language === 'en' ? '360 degree feedback' : 'Feedback à 360 degrés',
        language === 'tr' ? 'Eylem planları' : language === 'en' ? 'Action plans' : 'Plans d\'action',
      ],
    },
    {
      title: language === 'tr' ? 'Ekip Koçluğu' : language === 'en' ? 'Team Coaching' : 'Coaching d\'équipe',
      description:
        language === 'tr'
          ? 'Ekip performansını artırmak için grup koçluğu'
          : language === 'en'
          ? 'Group coaching to increase team performance'
          : 'Coaching de groupe pour améliorer les performances de l\'équipe',
      features: [
        language === 'tr' ? 'Ekip dinamikleri analizi' : language === 'en' ? 'Team dynamics analysis' : 'Analyse de la dynamique d\'équipe',
        language === 'tr' ? 'İletişim atölyeleri' : language === 'en' ? 'Communication workshops' : 'Ateliers de communication',
        language === 'tr' ? 'Çatışma yönetimi' : language === 'en' ? 'Conflict management' : 'Gestion des conflits',
        language === 'tr' ? 'Hedef belirleme seansları' : language === 'en' ? 'Goal setting sessions' : 'Séances de définition d\'objectifs',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white text-red-600 hover:bg-white">
              {language === 'tr' ? 'Şirketler İçin' : language === 'en' ? 'For Companies' : 'Pour les entreprises'}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {language === 'tr'
                ? 'Çalışan Refahını Artırın, Performansı Yükseltin'
                : language === 'en'
                ? 'Increase Employee Well-being, Boost Performance'
                : 'Augmentez le bien-être des employés, boostez les performances'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-50">
              {language === 'tr'
                ? 'Profesyonel kariyer koçluğu ile çalışanlarınızın potansiyelini ortaya çıkarın'
                : language === 'en'
                ? 'Unlock your employees\' potential with professional career coaching'
                : 'Libérez le potentiel de vos employés avec un coaching de carrière professionnel'}
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section - Updated with 2025 data */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-600 text-sm">
              {language === 'tr' ? 'ARAŞTIRMALARA GÖRE' : language === 'en' ? 'ACCORDING TO RESEARCH' : 'SELON LES RECHERCHES'}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'tr' ? 'Modern İş Gücü Neden Desteklenmeli?' : language === 'en' ? 'Why Should Modern Workforce Be Supported?' : 'Pourquoi la main-d\'œuvre moderne devrait-elle être soutenue?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'tr'
                ? 'Günümüz iş dünyasında çalışanların yalnızca performansı değil, psikolojik dayanıklılığı da sınanıyor. 2025 itibarıyla yapılan yeni analizler, kurumsal yapıların çalışan refahı konusunda yeniden yapılanması gerektiğini açıkça gösteriyor:'
                : language === 'en'
                ? 'In today\'s business world, not only employee performance but also psychological resilience is being tested. New analyses as of 2025 clearly show that corporate structures need to be restructured regarding employee well-being:'
                : 'Dans le monde des affaires d\'aujourd\'hui, non seulement les performances des employés mais aussi leur résilience psychologique sont mises à l\'épreuve. De nouvelles analyses en 2025 montrent clairement que les structures d\'entreprise doivent être restructurées en matière de bien-être des employés:'}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-center text-red-600 mb-6">
              {language === 'tr' ? '📊 Güncel İstatistikler (2025)' : language === 'en' ? '📊 Current Statistics (2025)' : '📊 Statistiques actuelles (2025)'}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics2025.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-2">
                <CardContent className="pt-6">
                  <div className={`w-20 h-20 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <h3 className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                  <p className="text-gray-700 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr' ? 'KARİYEER NE KAZANDIRIR?' : language === 'en' ? 'WHAT DOES KARIYEER OFFER?' : 'QUE PROPOSE KARIYEER?'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'Kanıtlanmış sonuçlarla çalışan refahı ve şirket performansı'
                : language === 'en'
                ? 'Employee well-being and company performance with proven results'
                : 'Bien-être des employés et performances de l\'entreprise avec des résultats prouvés'}
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

      {/* Programs Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              {language === 'tr' ? 'Kurumsal Koçluk Programları' : language === 'en' ? 'Corporate Coaching Programs' : 'Programmes de coaching d\'entreprise'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr'
                ? 'İhtiyaçlarınıza özel esnek çözümler'
                : language === 'en'
                ? 'Flexible solutions tailored to your needs'
                : 'Solutions flexibles adaptées à vos besoins'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-red-100">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl text-red-600 text-center">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-center">{program.description}</p>
                  <div className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-red-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-red-600 mb-2">
                {language === 'tr' ? 'DEMO TALEP EDİN' : language === 'en' ? 'REQUEST A DEMO' : 'DEMANDER UNE DÉMO'}
              </CardTitle>
              <p className="text-gray-600">
                {language === 'tr'
                  ? 'Kurumunuza özel koçluk çözümlerimizi keşfedin'
                  : language === 'en'
                  ? 'Discover our coaching solutions tailored to your organization'
                  : 'Découvrez nos solutions de coaching adaptées à votre organisation'}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      {language === 'tr' ? 'Şirket Adı *' : language === 'en' ? 'Company Name *' : 'Nom de l\'entreprise *'}
                    </Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder={language === 'tr' ? 'Şirket adınız' : language === 'en' ? 'Your company name' : 'Nom de votre entreprise'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">
                      {language === 'tr' ? 'İletişim Kişisi *' : language === 'en' ? 'Contact Person *' : 'Personne de contact *'}
                    </Label>
                    <Input
                      id="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder={language === 'tr' ? 'Adınız Soyadınız' : language === 'en' ? 'Your Name' : 'Votre nom'}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'tr' ? 'E-posta *' : language === 'en' ? 'Email *' : 'Email *'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={language === 'tr' ? 'ornek@sirket.com' : language === 'en' ? 'example@company.com' : 'exemple@entreprise.com'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === 'tr' ? 'Telefon *' : language === 'en' ? 'Phone *' : 'Téléphone *'}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={language === 'tr' ? '0555 123 45 67' : language === 'en' ? '0555 123 45 67' : '0555 123 45 67'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCount">
                    {language === 'tr' ? 'Çalışan Sayısı *' : language === 'en' ? 'Number of Employees *' : 'Nombre d\'employés *'}
                  </Label>
                  <Input
                    id="employeeCount"
                    required
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    placeholder={language === 'tr' ? 'Örn: 50-100' : language === 'en' ? 'e.g., 50-100' : 'par ex., 50-100'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {language === 'tr' ? 'Mesajınız (Opsiyonel)' : language === 'en' ? 'Your Message (Optional)' : 'Votre message (facultatif)'}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      language === 'tr'
                        ? 'İhtiyaçlarınız ve beklentileriniz hakkında bilgi verin...'
                        : language === 'en'
                        ? 'Tell us about your needs and expectations...'
                        : 'Parlez-nous de vos besoins et attentes...'
                    }
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-6">
                  {language === 'tr' ? 'Demo Talep Et' : language === 'en' ? 'Request Demo' : 'Demander une démo'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'tr'
              ? 'Çalışanlarınızın Potansiyelini Ortaya Çıkarın'
              : language === 'en'
              ? 'Unlock Your Employees\' Potential'
              : 'Libérez le potentiel de vos employés'}
          </h2>
          <p className="text-xl mb-8 text-red-50">
            {language === 'tr'
              ? 'Profesyonel koçluk ile çalışan memnuniyetini ve şirket performansını artırın'
              : language === 'en'
              ? 'Increase employee satisfaction and company performance with professional coaching'
              : 'Augmentez la satisfaction des employés et les performances de l\'entreprise avec un coaching professionnel'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8" onClick={handleContactClick}>
              {language === 'tr' ? 'Hemen İletişime Geçin' : language === 'en' ? 'Contact Us Now' : 'Contactez-nous maintenant'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8"
              onClick={handleSuccessStoriesClick}
            >
              {language === 'tr' ? 'Başarı Hikayelerini İnceleyin' : language === 'en' ? 'View Success Stories' : 'Voir les histoires de réussite'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
