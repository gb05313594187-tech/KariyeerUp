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
  Shield,
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
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      glow: 'from-orange-300/40 via-orange-100/0 to-transparent',
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
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      glow: 'from-red-400/40 via-red-100/0 to-transparent',
      popular: false,
      features: [
        getNavText(
          '✓ Tüm ücretsiz özellikler',
          '✓ All free features',
          '✓ Toutes les fonctionnalités gratuites'
        ),
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
        'Peak-level visibility',
        'Visibilité au niveau sommet'
      ),
      icon: Crown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      glow: 'from-amber-500/50 via-orange-200/10 to-transparent',
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
          'Custom peak profile theme',
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
      title: getNavText('4. Adım: Zirve Marka Ol', 'Step 4: Become a Peak Brand', 'Étape 4 : Deviens une marque de référence'),
      text: getNavText(
        'Kariyeer ekosisteminde aranan, prestijli ve sürekli önerilen koç ol.',
        'Become a highly recommended, sought-after coach in the ecosystem.',
        'Deviens un coach très recommandé et recherché dans l’écosystème.'
      )
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50">
      {/* Arkaplan turuncu/kırmızı glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-[-10%] h-80 w-80 rounded-full bg-orange-500/35 blur-3xl" />
        <div className="absolute top-40 right-[-5%] h-96 w-96 rounded-full bg-red-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="mb-5 border border-white/20 bg-white/10 text-amber-100 backdrop-blur">
            <Sparkles className="h-3 w-3 mr-1" />
            {getNavText('Zirve Planlar', 'Premium Plans', 'Plans Premium')}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-red-300 via-orange-200 to-amber-200 bg-clip-text text-transparent">
              {getNavText(
                'Profilini Zirve Seviyesine Taşı',
                'Take Your Profile to the Top',
                'Amène ton profil au sommet'
              )}
            </span>
          </h1>

          <p className="text-lg md:text-2xl mb-8 text-orange-50 max-w-3xl mx-auto">
            {getNavText(
              'Doğrulama rozetleri, premium görünürlük ve güçlü analitiklerle koçluk kariyerini bir üst seviyeye taşı.',
              'Use verification badges, premium visibility and advanced analytics to level up your coaching career.',
              'Utilise badges de vérification, visibilité premium et analyses avancées pour booster ta carrière de coach.'
            )}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-semibold shadow-xl shadow-orange-500/40 hover:brightness-110 transition-all"
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
              className="border-orange-300/70 bg-neutral-900/60 text-orange-100 hover:bg-neutral-800/80 backdrop-blur"
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
      <section className="py-3 px-4 bg-amber-500/10 border-y border-amber-400/40 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-amber-100 text-sm">
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

      {/* İSTATİSTİKLER */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          <Card className="bg-neutral-900/70 border-orange-500/30 backdrop-blur shadow-lg shadow-orange-500/20">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-7 w-7 text-orange-300 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-50">%300</p>
              <p className="text-sm text-orange-100">
                {getNavText('Daha Fazla Görünürlük', 'More Visibility', 'Plus de visibilité')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/70 border-red-500/30 backdrop-blur shadow-lg shadow-red-500/20">
            <CardContent className="pt-6 text-center">
              <Users className="h-7 w-7 text-red-300 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-50">%250</p>
              <p className="text-sm text-orange-100">
                {getNavText('Daha Fazla Bağlantı', 'More Connections', 'Plus de connexions')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/70 border-amber-400/40 backdrop-blur shadow-lg shadow-amber-400/20">
            <CardContent className="pt-6 text-center">
              <Star className="h-7 w-7 text-amber-300 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-50">%400</p>
              <p className="text-sm text-orange-100">
                {getNavText('Daha Fazla Güven', 'More Trust', 'Plus de confiance')}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/70 border-emerald-400/30 backdrop-blur shadow-lg shadow-emerald-400/20">
            <CardContent className="pt-6 text-center">
              <Zap className="h-7 w-7 text-emerald-300 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-50">%180</p>
              <p className="text-sm text-orange-100">
                {getNavText('Daha Fazla Dönüşüm', 'More Conversion', 'Plus de conversion')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PRICING KARTLARI */}
      <section className="py-16 px-4" id="pricing-cards">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 mb-3">
              {getNavText(
                'Öne Çıkan Planlarını Seç',
                'Choose Your Premium Plan',
                'Choisis ton plan premium'
              )}
            </h2>
            <p className="text-orange-100 max-w-2xl mx-auto">
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
                    className={`pointer-events-none absolute inset-x-6 -bottom-4 h-24 bg-gradient-to-t ${plan.glow} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`}
                  />
                  <Card
                    className={`relative h-full overflow-hidden border-2 transition-all duration-500 backdrop-blur-xl bg-neutral-900/80 ${
                      isPopular
                        ? 'border-amber-400/80 shadow-2xl shadow-amber-500/40 scale-[1.03] translate-y-[-4px]'
                        : 'border-neutral-700 hover:border-orange-400/80 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-red-500 to-amber-400 text-white font-bold shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          {getNavText('En Popüler', 'Most Popular', 'Le plus populaire')}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-6 pt-10">
                      <div
                        className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner shadow-white/40`}
                      >
                        <Icon className={`h-8 w-8 ${plan.color}`} />
                      </div>
                      <CardTitle className="text-2xl text-slate-50 mb-1">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-orange-100 text-sm">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-5">
                        <span className="text-4xl font-extrabold text-slate-50">
                          {plan.price === 0
                            ? getNavText('Ücretsiz', 'Free', 'Gratuit')
                            : `₺${plan.price}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-orange-100 ml-1 text-sm">/ {plan.period}</span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-6 px-6">
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-100">{feature}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-xs opacity-60">
                            <X className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="text-orange-100">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {plan.id === 'free' ? (
                        <Button
                          className="w-full border border-neutral-600 bg-neutral-900 text-slate-50 hover:bg-neutral-800"
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
                              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 hover:brightness-110'
                              : 'bg-gradient-to-r from-orange-500 to-amber-400 hover:brightness-110'
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
        className="py-16 px-4 border-t border-neutral-800 bg-neutral-950/95"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 mb-3">
              {getNavText('Zirve Yol Haritası', 'Roadmap to the Top', 'Feuille de route')}
            </h2>
            <p className="text-orange-100 max-w-2xl mx-auto">
              {getNavText(
                'Profil açmaktan zirve marka olmaya kadar net, uygulanabilir 4 adım.',
                'Clear 4 steps from creating a profile to becoming a top brand.',
                '4 étapes claires : de la création du profil à la marque de référence.'
              )}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
            <div className="grid md:grid-cols-4 gap-6 relative">
              {roadmapSteps.map((step) => (
                <Card
                  key={step.id}
                  className="bg-neutral-900/80 border-neutral-700 backdrop-blur shadow-lg shadow-neutral-900/70 relative"
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-amber-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {step.id}
                      </div>
                      <p className="text-sm font-semibold text-slate-50">{step.title}</p>
                    </div>
                    <p className="text-xs text-orange-100 leading-relaxed">{step.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-700 via-orange-700 to-amber-600">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-80">
            <Shield className="h-20 w-20 text-amber-200 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]" />
          </div>
          <h2 className="mt-10 text-3xl md:text-4xl font-extrabold text-white mb-4">
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
              className="bg-white text-red-600 font-semibold shadow-xl shadow-neutral-900/40 hover:bg-orange-50"
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
              className="border-white/80 text-white bg-transparent hover:bg-white/10"
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
