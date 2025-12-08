import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Star,
  Award,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';

export default function Pricing() {
  const { language } = useLanguage();
  const { supabaseUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr':
        return tr;
      case 'en':
        return en;
      case 'fr':
        return fr;
      default:
        return tr;
    }
  };

  const handleSubscribe = async (type: 'blue_badge' | 'gold_badge', price: number) => {
    if (!supabaseUser) {
      toast.error(
        getNavText(
          'Lütfen önce giriş yapın',
          'Please login first',
          "Veuillez vous connecter d'abord"
        )
      );
      navigate('/login');
      return;
    }

    setLoading(type);
    const toastId = toast.loading(
      getNavText('Ödeme başlatılıyor...', 'Starting payment...', 'Paiement en cours...')
    );

    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Session error');
      }

      const edgeUrl =
        'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_create_payment';

      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          subscription_type: type,
          price,
          return_url: window.location.origin + '/payment-callback'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorText;
        } catch {
          // ignore
        }
        throw new Error(`Payment API Error: ${errorMessage}`);
      }

      const result = await response.json();

      if (result.success && result.payment_url) {
        toast.success(
          getNavText(
            'Ödeme sayfasına yönlendiriliyorsunuz...',
            'Redirecting to payment page...',
            'Redirection vers la page de paiement...'
          ),
          { id: toastId }
        );
        window.location.href = result.payment_url;
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(
        errorMessage ||
          getNavText(
            'Ödeme başlatılamadı',
            'Payment failed to start',
            'Échec du paiement'
          ),
        { id: toastId }
      );
    } finally {
      setLoading(null);
    }
  };

  // PLANLAR
  const plans = [
    {
      id: 'free',
      name: getNavText('Ücretsiz', 'Free', 'Gratuit'),
      price: 0,
      period: getNavText('Ücretsiz', 'Free', 'Gratuit'),
      description: getNavText(
        'Başlamak için temel özellikler',
        'Core features to get started',
        'Fonctionnalités de base pour démarrer'
      ),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      glow: 'from-orange-200/60 via-orange-100/0 to-transparent',
      features: [
        getNavText('Profil oluşturma', 'Profile creation', 'Création de profil'),
        getNavText('Temel görünürlük', 'Basic visibility', 'Visibilité de base'),
        getNavText('Mesajlaşma', 'Messaging', 'Messagerie'),
        getNavText('5 bağlantı/ay', '5 connections/month', '5 connexions/mois')
      ],
      notIncluded: [
        getNavText('Doğrulama rozeti', 'Verification badge', 'Badge de vérification'),
        getNavText('Öncelikli listeleme', 'Priority listing', 'Liste prioritaire'),
        getNavText('Analitik dashboard', 'Analytics dashboard', 'Tableau de bord analytique')
      ]
    },
    {
      id: 'blue_badge',
      name: getNavText('Mavi Tik', 'Blue Badge', 'Badge Bleu'),
      price: 99,
      period: getNavText('ay', 'month', 'mois'),
      description: getNavText(
        'Güven veren doğrulanmış profil',
        'Trusted verified profile',
        'Profil vérifié et fiable'
      ),
      icon: CheckCircle,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      glow: 'from-sky-200/60 via-sky-100/0 to-transparent',
      popular: false,
      features: [
        getNavText('✓ Tüm ücretsiz özellikler', '✓ All free features', '✓ Toutes les fonctionnalités gratuites'),
        getNavText('Mavi doğrulama rozeti', 'Blue verification badge', 'Badge de vérification bleu'),
        getNavText('Profilde öne çıkma', 'Profile highlighting', 'Mise en avant du profil'),
        getNavText('20 bağlantı/ay', '20 connections/month', '20 connexions/mois'),
        getNavText('Temel analitikler', 'Basic analytics', 'Analyses de base')
      ],
      notIncluded: [
        getNavText('Altın rozet özellikleri', 'Gold badge features', 'Fonctionnalités du badge or')
      ]
    },
    {
      id: 'gold_badge',
      name: getNavText('Altın Tik', 'Gold Badge', 'Badge Or'),
      price: 299,
      period: getNavText('ay', 'month', 'mois'),
      description: getNavText(
        'Zirve seviyesinde görünürlük',
        'Top-level visibility',
        'Visibilité niveau premium'
      ),
      icon: Crown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      glow: 'from-amber-300/60 via-orange-100/0 to-transparent',
      popular: true,
      features: [
        getNavText(
          '✓ Tüm mavi tik özellikleri',
          '✓ All blue badge features',
          '✓ Toutes les fonctionnalités du badge bleu'
        ),
        getNavText('Altın premium rozeti', 'Gold premium badge', 'Badge premium or'),
        getNavText('En üstte listeleme', 'Top listing', 'Liste en haut'),
        getNavText('Sınırsız bağlantı', 'Unlimited connections', 'Connexions illimitées'),
        getNavText('Gelişmiş analitikler', 'Advanced analytics', 'Analyses avancées'),
        getNavText('Öncelikli destek', 'Priority support', 'Support prioritaire'),
        getNavText(
          'Özel Zirve profil teması',
          'Custom profile theme',
          'Thème de profil personnalisé'
        )
      ],
      notIncluded: []
    }
  ];

  const roadmapSteps = [
    {
      id: 1,
      title: getNavText('1. Adım: Profilini Aç', 'Step 1: Create Profile', 'Étape 1 : Crée ton profil'),
      text: getNavText(
        'Ücretsiz profilini oluştur, güçlü bir bio yaz, uzmanlık alanlarını ekle.',
        'Create your free profile, write a strong bio, add your specialties.',
        'Crée ton profil gratuit, écris une bio forte et ajoute tes spécialités.'
      )
    },
    {
      id: 2,
      title: getNavText('2. Adım: Mavi Tik ile Güven İnşa Et', 'Step 2: Add Blue Badge', 'Étape 2 : Ajoute le badge bleu'),
      text: getNavText(
        'Doğrulama rozeti ile danışanların gözünde güven ve profesyonellik yarat.',
        'Use verification to build trust and professionalism.',
        'Utilise la vérification pour inspirer confiance et professionnalisme.'
      )
    },
    {
      id: 3,
      title: getNavText('3. Adım: Altın Tik ile Zirveye Çık', 'Step 3: Go Gold', 'Étape 3 : Passe en or'),
      text: getNavText(
        'Aramalarda üst sıralara çık, sınırsız bağlantı ve premium görünürlük kazan.',
        'Get top ranking, unlimited connections and premium visibility.',
        'Sois en haut des résultats, connexions illimitées et visibilité premium.'
      )
    },
    {
      id: 4,
      title: getNavText('4. Adım: Zirve Marka Ol', 'Step 4: Become a Zirve Brand', 'Étape 4 : Deviens une marque forte'),
      text: getNavText(
        'Kariyeer ekosisteminde aranan, prestijli ve sürekli önerilen koç ol.',
        'Become a highly recommended, sought-after coach in the ecosystem.',
        'Deviens un coach très recommandé et recherché dans l’écosystème.'
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hafif turuncu arka plan */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-orange-100 via-white to-white" />

      {/* HERO */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="mb-5 border border-white/40 bg-white/20 text-white backdrop-blur">
            <Sparkles className="h-3 w-3 mr-1" />
            {getNavText('Zirve Planlar', 'Zirve Plans', 'Plans Premium')}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {getNavText(
              'Profilini Zirve Seviyesine Taşı',
              'Take Your Profile to the Next Level',
              'Fais passer ton profil au niveau supérieur'
            )}
          </h1>

          <p className="text-lg md:text-xl mb-8 text-orange-50 max-w-3xl mx-auto">
            {getNavText(
              'Doğrulama rozetleri, premium görünürlük ve güçlü analitiklerle koçluk kariyerini bir üst seviyeye taşı.',
              'Use verification badges, premium visibility and analytics to level up your coaching career.',
              'Utilise badges, visibilité premium et analyses pour booster ta carrière de coach.'
            )}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-white text-orange-600 font-semibold shadow-lg hover:bg-orange-50"
              onClick={() => {
                document
                  .getElementById('pricing-cards')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Star className="h-5 w-5 mr-2" />
              {getNavText('Planları Gör', 'View Plans', 'Voir les plans')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/70 text-white hover:bg-white/10"
              onClick={() => {
                document
                  .getElementById('Zirve-roadmap')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {getNavText('Nasıl Başarılı Olurum?', 'See the Roadmap', 'Voir la feuille de route')}
            </Button>
          </div>
        </div>
      </section>

      {/* TEST MODE UYARISI */}
      <section className="py-3 px-4 bg-orange-50 border-y border-orange-200">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-orange-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>
            {getNavText(
              'Test Modu: Şu an yapılan ödemeler gerçek değildir.',
              'Test Mode: Payments are not real right now.',
              'Mode Test : Aucun paiement réel pour le moment.'
            )}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          <Card className="bg-white border-orange-100 shadow-sm">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-7 w-7 text-orange-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">%300</p>
              <p className="text-sm text-slate-600">
                {getNavText('Daha Fazla Görünürlük', 'More Visibility', 'Plus de visibilité')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-orange-100 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Users className="h-7 w-7 text-red-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">%250</p>
              <p className="text-sm text-slate-600">
                {getNavText('Daha Fazla Bağlantı', 'More Connections', 'Plus de connexions')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-orange-100 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Star className="h-7 w-7 text-amber-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">%400</p>
              <p className="text-sm text-slate-600">
                {getNavText('Daha Fazla Güven', 'More Trust', 'Plus de confiance')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-orange-100 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Zap className="h-7 w-7 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">%180</p>
              <p className="text-sm text-slate-600">
                {getNavText('Daha Fazla Dönüşüm', 'More Conversion', 'Plus de conversion')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PRICING KARTLARI */}
      <section className="py-16 px-4 bg-gray-50" id="pricing-cards">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              {getNavText('Öne Çıkan Planlarını Seç', 'Choose Your Plan', 'Choisis ton plan')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {getNavText(
                'İster yeni başla, ister zaten yıldız ol – rozetlerinle profilini bir üst seviyeye taşı.',
                'Whether you are just starting or already a star – boost your profile with badges.',
                'Que tu commences ou que tu sois déjà une star – booste ton profil avec des badges.'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;

              return (
                <div key={plan.id} className="relative group">
                  {/* Glow */}
                  <div
                    className={`pointer-events-none absolute inset-x-6 -bottom-4 h-16 bg-gradient-to-t ${plan.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
                  />
                  <Card
                    className={`relative h-full overflow-hidden border-2 transition-all duration-500 bg-white ${
                      isPopular
                        ? 'border-amber-400 shadow-2xl scale-[1.03] translate-y-[-4px]'
                        : 'border-gray-200 hover:border-orange-400 hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          {getNavText('En Popüler', 'Most Popular', 'Le plus populaire')}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-6 pt-10">
                      <div
                        className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className={`h-8 w-8 ${plan.color}`} />
                      </div>
                      <CardTitle className="text-2xl text-slate-900 mb-1">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-sm">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-5">
                        <span className="text-4xl font-extrabold text-slate-900">
                          {plan.price === 0
                            ? getNavText('Ücretsiz', 'Free', 'Gratuit')
                            : `₺${plan.price}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-slate-600 ml-1 text-sm">/ {plan.period}</span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-6 px-6">
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-800">{feature}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-xs opacity-70">
                            <X className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {plan.id === 'free' ? (
                        <Button
                          className="w-full border border-gray-300 bg-white text-slate-900 hover:bg-gray-50"
                          variant="outline"
                          onClick={() => navigate('/register')}
                        >
                          {getNavText(
                            'Ücretsiz Başla',
                            'Start for Free',
                            'Commencer gratuitement'
                          )}
                        </Button>
                      ) : (
                        <Button
                          className={`w-full text-white font-semibold ${
                            isPopular
                              ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 hover:brightness-110'
                              : 'bg-gradient-to-r from-red-500 to-orange-500 hover:brightness-110'
                          }`}
                          onClick={() =>
                            handleSubscribe(plan.id as 'blue_badge' | 'gold_badge', plan.price)
                          }
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section
        id="Zirve-roadmap"
        className="py-16 px-4 bg-white border-t border-orange-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              {getNavText('Zirve Yol Haritası', 'Roadmap', 'Feuille de route')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {getNavText(
                'Profil açmaktan zirve marka olmaya kadar net, uygulanabilir 4 adım.',
                'Clear 4 steps from creating a profile to becoming a strong brand.',
                '4 étapes claires : de la création du profil à la marque forte.'
              )}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
            <div className="grid md:grid-cols-4 gap-6 relative">
              {roadmapSteps.map((step) => (
                <Card
                  key={step.id}
                  className="bg-white border border-orange-100 shadow-sm"
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow">
                        {step.id}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA – kalkan yok! */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white">
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {getNavText(
              'Güvenilirliğini ve görünürlüğünü öne çıkar',
              'Boost your trust and visibility',
              'Augmente ta confiance et ta visibilité'
            )}
          </h2>
          <p className="text-orange-50 max-w-2xl mx-auto mb-8">
            {getNavText(
              'Bugün doğrulama rozetini al, Kariyeer ekosisteminde en çok önerilen koçlar arasına gir.',
              'Get your badge today and join the most recommended coaches in the Kariyeer ecosystem.',
              'Obtiens ton badge aujourd’hui et rejoins les coachs les plus recommandés de Kariyeer.'
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-orange-600 font-semibold shadow-lg hover:bg-orange-50"
              onClick={() => {
                document
                  .getElementById('pricing-cards')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Award className="h-5 w-5 mr-2" />
              {getNavText('Altın Tik ile Başla', 'Start with Gold Badge', 'Commencer avec le badge or')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/80 text-white hover:bg-white/10"
              onClick={() => navigate('/register')}
            >
              {getNavText('Önce Ücretsiz Dene', 'Try Free First', 'Essayer gratuitement d’abord')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
