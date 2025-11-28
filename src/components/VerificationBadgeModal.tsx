import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, Zap, Crown, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface VerificationBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationBadgeModal({ isOpen, onClose }: VerificationBadgeModalProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, supabaseUser } = useAuth();
  const { activeSubscription } = useSubscription();
  const { t, language } = useLanguage();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState<'blue' | 'gold' | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptsRef = useRef(0);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  // Polling function to check payment status
  const checkPaymentStatus = async (token: string) => {
    try {
      console.log(`[Polling] Checking payment status for token: ${token}, attempt: ${pollingAttemptsRef.current + 1}`);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('[Polling] No session found');
        return false;
      }

      console.log('[Polling] Session valid, querying database...');

      // Query payment transaction status
      const { data: transaction, error } = await supabase
        .from('app_2dff6511da_payment_transactions')
        .select('status, amount, currency')
        .eq('iyzico_payment_id', token)
        .single();

      if (error) {
        console.error('[Polling] Database error:', error);
        console.error('[Polling] Error details:', JSON.stringify(error, null, 2));
        
        // If it's a RLS error, show user-friendly message
        if (error.code === 'PGRST116' || error.message.includes('row-level security')) {
          console.error('[Polling] ❌ RLS Policy Error: User cannot read payment transactions');
          toast.error(
            getNavText(
              'Veritabanı erişim hatası. Lütfen tekrar deneyin.',
              'Database access error. Please try again.',
              'Erreur d\'accès à la base de données. Veuillez réessayer.'
            )
          );
        }
        return false;
      }

      console.log('[Polling] Transaction status:', transaction?.status);

      if (transaction && transaction.status === 'completed') {
        console.log('[Polling] ✅ Payment completed! Redirecting to dashboard...');
        
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        // Show success message
        toast.success(
          getNavText(
            '🎉 Ödeme başarılı! Dashboard\'a yönlendiriliyorsunuz...',
            '🎉 Payment successful! Redirecting to dashboard...',
            '🎉 Paiement réussi! Redirection vers le tableau de bord...'
          )
        );

        // Close modal
        onClose();
        setLoading(null);
        setPaymentToken(null);

        // Redirect to dashboard with success parameters
        setTimeout(() => {
          navigate(`/dashboard?payment=success&amount=${transaction.amount}&currency=${transaction.currency}`);
        }, 1000);

        return true;
      }

      return false;
    } catch (error) {
      console.error('[Polling] Error checking payment status:', error);
      console.error('[Polling] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return false;
    }
  };

  // Start polling when payment token is set
  useEffect(() => {
    if (!paymentToken) return;

    console.log('[Polling] Starting payment status polling for token:', paymentToken);
    console.log('[Polling] VERSION 52: Enhanced error handling and RLS policy fix');
    pollingAttemptsRef.current = 0;

    // Initial check
    checkPaymentStatus(paymentToken);

    // Set up polling interval (every 3 seconds)
    pollingIntervalRef.current = setInterval(async () => {
      pollingAttemptsRef.current += 1;

      // Check payment status
      const completed = await checkPaymentStatus(paymentToken);

      // Stop after 20 attempts (60 seconds)
      if (completed || pollingAttemptsRef.current >= 20) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        if (!completed && pollingAttemptsRef.current >= 20) {
          console.log('[Polling] ⏱️ Timeout reached (60 seconds)');
          toast.info(
            getNavText(
              'Ödeme işlemi devam ediyor. Lütfen dashboard\'unuzu kontrol edin.',
              'Payment processing continues. Please check your dashboard.',
              'Le traitement du paiement continue. Veuillez vérifier votre tableau de bord.'
            )
          );
          setLoading(null);
          setPaymentToken(null);
        }
      }
    }, 3000); // 3 seconds

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [paymentToken, navigate, onClose, getNavText]);

  const handlePurchase = async (badgeType: 'blue' | 'gold') => {
    if (!isAuthenticated || !supabaseUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (activeSubscription) {
      toast.error(getNavText('Zaten aktif bir aboneliğiniz var', 'You already have an active subscription', 'Vous avez déjà un abonnement actif'));
      return;
    }

    setLoading(badgeType);
    const toastId = toast.loading(getNavText('Ödeme başlatılıyor...', 'Starting payment...', 'Paiement en cours...'));

    try {
      // VERSION 52: Enhanced error handling and RLS policy fix
      const price = badgeType === 'blue' ? 99 : 299;
      const subscriptionType = badgeType === 'blue' ? 'blue_badge' : 'gold_badge';

      console.log('Starting payment process for:', subscriptionType, price);
      console.log('🔄 VERSION 52: Enhanced error handling and RLS policy fix');

      // Get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Session error');
      }

      // Build return URL - pointing directly to Edge Function
      const returnUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_iyzico_callback';
      console.log('Return URL (Edge Function):', returnUrl);

      // Call the create_payment edge function
      const edgeUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_create_payment';
      
      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subscription_type: subscriptionType,
          price: price,
          return_url: returnUrl
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

      if (result.success && result.payment_url && result.token) {
        toast.success(getNavText('Ödeme sayfasına yönlendiriliyorsunuz...', 'Redirecting to payment page...', 'Redirection vers la page de paiement...'), { id: toastId });
        
        // Store payment token for polling
        setPaymentToken(result.token);
        console.log('[Polling] Payment token stored:', result.token);
        
        // Keep loading state and modal open for polling
        // Redirect to iyzico payment page in new tab
        window.open(result.payment_url, '_blank');
        
        // Update toast to show polling status
        toast.loading(
          getNavText(
            'Ödeme durumu kontrol ediliyor... Ödeme sayfasında işlemi tamamlayın.',
            'Checking payment status... Please complete the payment on the payment page.',
            'Vérification du statut du paiement... Veuillez compléter le paiement sur la page de paiement.'
          ),
          { id: toastId }
        );
      } else {
        throw new Error('Invalid payment response');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(errorMessage || getNavText('Ödeme başlatılamadı', 'Payment failed to start', 'Échec du paiement'), { id: toastId });
      setLoading(null);
    }
  };

  const handleQuickLogin = async () => {
    toast.info(getNavText('Lütfen giriş yapın veya kayıt olun', 'Please login or register', 'Veuillez vous connecter ou vous inscrire'));
    onClose();
    navigate('/login');
  };

  if (showLoginPrompt) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('loginRequired')}</DialogTitle>
            <DialogDescription>{t('pleaseLoginToContinue')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {getNavText(
                'Rozet satın almak için giriş yapmanız gerekiyor.',
                'You need to login to purchase a badge.',
                'Vous devez vous connecter pour acheter un badge.'
              )}
            </p>
            <Button onClick={handleQuickLogin} className="w-full">
              {getNavText('Giriş Yap', 'Login', 'Se connecter')}
            </Button>
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="w-full">
              {t('cancel')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('verificationBadges')}</DialogTitle>
          <DialogDescription>{t('chooseYourBadge')}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Blue Badge */}
          <div className="border-2 border-blue-500 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('blueBadge')}</h3>
                  <Badge variant="secondary">{t('verified')}</Badge>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold text-blue-600">99 TRY</p>
              <p className="text-gray-600">{t('perMonth')}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('blueFeature1')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('blueFeature2')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('blueFeature3')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('blueFeature4')}</span>
              </div>
            </div>

            <Button 
              onClick={() => handlePurchase('blue')} 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading === 'blue'}
            >
              {loading === 'blue' ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {getNavText('Ödeme kontrol ediliyor...', 'Checking payment...', 'Vérification du paiement...')}
                </span>
              ) : (
                t('purchaseBlueBadge')
              )}
            </Button>
          </div>

          {/* Gold Badge */}
          <div className="border-2 border-yellow-500 rounded-lg p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 text-xs font-bold">
              {t('popular')}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  ★
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('goldBadge')}</h3>
                  <Badge className="bg-yellow-500">{t('premium')}</Badge>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold text-yellow-600">299 TRY</p>
              <p className="text-gray-600">{t('perMonth')}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-semibold">{t('allBlueFeatures')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Crown className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('goldFeature1')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('goldFeature2')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('goldFeature3')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('goldFeature4')}</span>
              </div>
            </div>

            <Button 
              onClick={() => handlePurchase('gold')} 
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              disabled={loading === 'gold'}
            >
              {loading === 'gold' ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {getNavText('Ödeme kontrol ediliyor...', 'Checking payment...', 'Vérification du paiement...')}
                </span>
              ) : (
                t('purchaseGoldBadge')
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            {t('cancelAnytime')} • {t('securePayment')} • {t('monthlyBilling')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}