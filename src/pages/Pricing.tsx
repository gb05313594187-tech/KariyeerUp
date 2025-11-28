import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Check,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Star,
  Award,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';

export default function Pricing() {
  const { language } = useLanguage();
  const { user, supabaseUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const handleSubscribe = async (type: 'blue_badge' | 'gold_badge', price: number) => {
    if (!supabaseUser) {
      toast.error(getNavText('Lütfen önce giriş yapın', 'Please login first', 'Veuillez vous connecter d\'abord'));
      navigate('/login');
      return;
    }

    setLoading(type);
    const toastId = toast.loading(getNavText('Ödeme başlatılıyor...', 'Starting payment...', 'Paiement en cours...'));

    try {
      console.log('Starting payment process for:', type, price);

      // Get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Session error');
      }

      // Call the simple create_payment edge function
      const edgeUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_create_payment';
      
      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subscription_type: type,
          price: price,
          return_url: window.location.origin + '/payment-callback' // Send current origin
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorText;
        } catch (e) {
            // ignore json parse error
        }
        throw new Error(`Payment API Error: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Payment API Result:', result);

      if (result.success && result.payment_url) {
        toast.success(getNavText('Ödeme sayfasına yönlendiriliyorsunuz...', 'Redirecting to payment page...', 'Redirection vers la page de paiement...'), { id: toastId });
        // Redirect to iyzico payment page
        window.location.href = result.payment_url;
      } else {
        throw new Error('Invalid payment response');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(errorMessage || getNavText('Ödeme başlatılamadı', 'Payment failed to start', 'Échec du paiement'), { id: toastId });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: getNavText('Ücretsiz', 'Free', 'Gratuit'),
      price: 0,
      period: getNavText('Ücretsiz', 'Free', 'Gratuit'),
      description: getNavText('Temel özellikler', 'Basic features', 'Fonctionnalités de base'),
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: [
        getNavText('Profil oluşturma', 'Profile creation', 'Création de profil'),
        getNavText('Temel görünürlük', 'Basic visibility', 'Visibilité de base'),
        getNavText('Mesajlaşma', 'Messaging', 'Messagerie'),
        getNavText('5 bağlantı/ay', '5 connections/month', '5 connexions/mois'),
      ],
      notIncluded: [
        getNavText('Doğrulama rozeti', 'Verification badge', 'Badge de vérification'),
        getNavText('Öncelikli listeleme', 'Priority listing', 'Liste prioritaire'),
        getNavText('Analitik dashboard', 'Analytics dashboard', 'Tableau de bord analytique'),
      ]
    },
    {
      id: 'blue_badge',
      name: getNavText('Mavi Tik', 'Blue Badge', 'Badge Bleu'),
      price: 99,
      period: getNavText('ay', 'month', 'mois'),
      description: getNavText('Doğrulanmış profesyonel', 'Verified professional', 'Professionnel vérifié'),
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      popular: false,
      features: [
        getNavText('✓ Tüm ücretsiz özellikler', '✓ All free features', '✓ Toutes les fonctionnalités gratuites'),
        getNavText('Mavi doğrulama rozeti', 'Blue verification badge', 'Badge de vérification bleu'),
        getNavText('Profilde öne çıkma', 'Profile highlighting', 'Mise en avant du profil'),
        getNavText('20 bağlantı/ay', '20 connections/month', '20 connexions/mois'),
        getNavText('Temel analitikler', 'Basic analytics', 'Analyses de base'),
      ],
      notIncluded: [
        getNavText('Altın rozet özellikleri', 'Gold badge features', 'Fonctionnalités du badge or'),
      ]
    },
    {
      id: 'gold_badge',
      name: getNavText('Altın Tik', 'Gold Badge', 'Badge Or'),
      price: 299,
      period: getNavText('ay', 'month', 'mois'),
      description: getNavText('Premium profesyonel', 'Premium professional', 'Professionnel premium'),
      icon: Crown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      popular: true,
      features: [
        getNavText('✓ Tüm mavi tik özellikleri', '✓ All blue badge features', '✓ Toutes les fonctionnalités du badge bleu'),
        getNavText('Altın premium rozeti', 'Gold premium badge', 'Badge premium or'),
        getNavText('En üstte listeleme', 'Top listing', 'Liste en haut'),
        getNavText('Sınırsız bağlantı', 'Unlimited connections', 'Connexions illimitées'),
        getNavText('Gelişmiş analitikler', 'Advanced analytics', 'Analyses avancées'),
        getNavText('Öncelikli destek', 'Priority support', 'Support prioritaire'),
        getNavText('Özel profil teması', 'Custom profile theme', 'Thème de profil personnalisé'),
      ],
      notIncluded: []
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-white text-purple-600 hover:bg-white">
            <Sparkles className="h-3 w-3 mr-1" />
            {getNavText('Fiyatlandırma', 'Pricing', 'Tarification')}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {getNavText(
              'Profilinizi Öne Çıkarın',
              'Highlight Your Profile',
              'Mettez en avant votre profil'
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-3xl mx-auto">
            {getNavText(
              'Doğrulama rozetleriyle güvenilirliğinizi artırın ve daha fazla müşteriye ulaşın',
              'Increase your credibility with verification badges and reach more clients',
              'Augmentez votre crédibilité avec des badges de vérification et atteignez plus de clients'
            )}
          </p>
        </div>
      </section>

      {/* Test Mode Warning */}
      <section className="py-4 px-4 bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            {getNavText(
              'Test Modu: Gerçek ödeme yapılmayacaktır',
              'Test Mode: No real payment will be processed',
              'Mode Test: Aucun paiement réel ne sera traité'
            )}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">%300</p>
              <p className="text-gray-600">{getNavText('Daha Fazla Görünürlük', 'More Visibility', 'Plus de visibilité')}</p>
            </div>
            <div>
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">%250</p>
              <p className="text-gray-600">{getNavText('Daha Fazla Bağlantı', 'More Connections', 'Plus de connexions')}</p>
            </div>
            <div>
              <Star className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">%400</p>
              <p className="text-gray-600">{getNavText('Daha Fazla Güven', 'More Trust', 'Plus de confiance')}</p>
            </div>
            <div>
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">%180</p>
              <p className="text-gray-600">{getNavText('Daha Fazla Dönüşüm', 'More Conversion', 'Plus de conversion')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4" id="pricing-cards">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative ${
                    isPopular 
                      ? 'border-4 border-amber-400 shadow-2xl scale-105' 
                      : 'border-2 hover:shadow-lg'
                  } transition-all duration-300`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-1 text-sm font-bold">
                        <Star className="h-3 w-3 mr-1" />
                        {getNavText('En Popüler', 'Most Popular', 'Le plus populaire')}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price === 0 ? getNavText('Ücretsiz', 'Free', 'Gratuit') : `₺${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 ml-2">/ {plan.period}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 opacity-50">
                          <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.id === 'free' ? (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate('/register')}
                      >
                        {getNavText('Ücretsiz Başla', 'Start Free', 'Commencer gratuitement')}
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${
                          isPopular
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                        onClick={() => handleSubscribe(plan.id as 'blue_badge' | 'gold_badge', plan.price)}
                        disabled={loading === plan.id}
                      >
                        {loading === plan.id ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {getNavText('İşleniyor...', 'Processing...', 'Traitement...')}
                          </span>
                        ) : (
                          <>
                            {isPopular && <Crown className="h-4 w-4 mr-2" />}
                            {getNavText('Hemen Başla', 'Get Started', 'Commencer')}
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {getNavText('Özellik Karşılaştırması', 'Feature Comparison', 'Comparaison des fonctionnalités')}
            </h2>
            <p className="text-xl text-gray-600">
              {getNavText('Size en uygun planı seçin', 'Choose the plan that suits you best', 'Choisissez le plan qui vous convient le mieux')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    {getNavText('Özellikler', 'Features', 'Fonctionnalités')}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600">
                    {getNavText('Ücretsiz', 'Free', 'Gratuit')}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-600">
                    {getNavText('Mavi Tik', 'Blue Badge', 'Badge Bleu')}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-amber-600">
                    {getNavText('Altın Tik', 'Gold Badge', 'Badge Or')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: getNavText('Profil Oluşturma', 'Profile Creation', 'Création de profil'), free: true, blue: true, gold: true },
                  { feature: getNavText('Doğrulama Rozeti', 'Verification Badge', 'Badge de vérification'), free: false, blue: true, gold: true },
                  { feature: getNavText('Öncelikli Listeleme', 'Priority Listing', 'Liste prioritaire'), free: false, blue: true, gold: true },
                  { feature: getNavText('En Üstte Görünme', 'Top Visibility', 'Visibilité en haut'), free: false, blue: false, gold: true },
                  { feature: getNavText('Aylık Bağlantı', 'Monthly Connections', 'Connexions mensuelles'), free: '5', blue: '20', gold: getNavText('Sınırsız', 'Unlimited', 'Illimité') },
                  { feature: getNavText('Analitik Dashboard', 'Analytics Dashboard', 'Tableau de bord analytique'), free: false, blue: getNavText('Temel', 'Basic', 'Base'), gold: getNavText('Gelişmiş', 'Advanced', 'Avancé') },
                  { feature: getNavText('Öncelikli Destek', 'Priority Support', 'Support prioritaire'), free: false, blue: false, gold: true },
                  { feature: getNavText('Özel Profil Teması', 'Custom Profile Theme', 'Thème de profil personnalisé'), free: false, blue: false, gold: true },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-gray-600">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.blue === 'boolean' ? (
                        row.blue ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-blue-600 font-semibold">{row.blue}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.gold === 'boolean' ? (
                        row.gold ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-amber-600 font-semibold">{row.gold}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {getNavText('Sık Sorulan Sorular', 'Frequently Asked Questions', 'Questions fréquemment posées')}
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: getNavText('Doğrulama rozeti nedir?', 'What is a verification badge?', 'Qu\'est-ce qu\'un badge de vérification?'),
                a: getNavText(
                  'Doğrulama rozeti, profilinizin gerçek ve güvenilir olduğunu gösteren bir işarettir. Mavi tik temel doğrulama, altın tik ise premium doğrulama sağlar.',
                  'A verification badge is a mark that shows your profile is authentic and trustworthy. Blue badge provides basic verification, gold badge provides premium verification.',
                  'Un badge de vérification est une marque qui montre que votre profil est authentique et digne de confiance. Le badge bleu fournit une vérification de base, le badge or fournit une vérification premium.'
                )
              },
              {
                q: getNavText('İptal edebilir miyim?', 'Can I cancel?', 'Puis-je annuler?'),
                a: getNavText(
                  'Evet, istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar özelliklerden yararlanmaya devam edersiniz.',
                  'Yes, you can cancel anytime. When you cancel, you\'ll continue to have access to features until the end of your current billing period.',
                  'Oui, vous pouvez annuler à tout moment. Lorsque vous annulez, vous continuerez à avoir accès aux fonctionnalités jusqu\'à la fin de votre période de facturation actuelle.'
                )
              },
              {
                q: getNavText('Ödeme güvenli mi?', 'Is payment secure?', 'Le paiement est-il sécurisé?'),
                a: getNavText(
                  'Evet, tüm ödemeler Iyzico güvenli ödeme sistemi üzerinden işlenir. Kredi kartı bilgileriniz bizimle paylaşılmaz.',
                  'Yes, all payments are processed through Iyzico secure payment system. Your credit card information is not shared with us.',
                  'Oui, tous les paiements sont traités via le système de paiement sécurisé Iyzico. Vos informations de carte de crédit ne sont pas partagées avec nous.'
                )
              }
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            {getNavText(
              'Güvenilirliğinizi Artırın',
              'Increase Your Credibility',
              'Augmentez votre crédibilité'
            )}
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            {getNavText(
              'Doğrulama rozetinizi alın ve profesyonel kariyerinizi bir üst seviyeye taşıyın',
              'Get your verification badge and take your professional career to the next level',
              'Obtenez votre badge de vérification et faites passer votre carrière professionnelle au niveau supérieur'
            )}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8"
            onClick={() => document.querySelector('#pricing-cards')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Award className="h-5 w-5 mr-2" />
            {getNavText('Planları İncele', 'View Plans', 'Voir les plans')}
          </Button>
        </div>
      </section>
    </div>
  );
}