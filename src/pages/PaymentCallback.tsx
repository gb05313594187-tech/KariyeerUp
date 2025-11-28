import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { supabaseUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Ödemeniz işleniyor...');

  useEffect(() => {
    const verifyPayment = async () => {
      console.log('🔄 VERSION 31: PaymentCallback started');
      console.log('Search params:', Object.fromEntries(searchParams.entries()));
      console.log('Supabase user:', supabaseUser?.id);

      try {
        const token = searchParams.get('token');
        
        if (!token) {
          console.error('❌ No token found in URL');
          setStatus('error');
          setMessage('Ödeme doğrulama bilgisi bulunamadı.');
          return;
        }

        console.log('✅ Token found:', token);

        if (!supabaseUser) {
          console.error('❌ No supabase user found');
          setStatus('error');
          setMessage('Kullanıcı oturumu bulunamadı. Lütfen giriş yapın.');
          return;
        }

        console.log('✅ Supabase user found:', supabaseUser.id);
        console.log('🔄 Calling iyzico_callback edge function...');

        // Call the callback edge function
        const { data, error } = await supabase.functions.invoke(
          'app_2dff6511da_iyzico_callback',
          {
            body: {
              token,
              userId: supabaseUser.id
            }
          }
        );

        console.log('📊 Edge function response:', { data, error });

        if (error) {
          console.error('❌ Callback error:', error);
          setStatus('error');
          setMessage(error.message || 'Ödeme doğrulama sırasında bir hata oluştu.');
          return;
        }

        if (data?.success) {
          console.log('✅ Payment verification successful!');
          setStatus('success');
          setMessage('Ödemeniz başarıyla tamamlandı! Rozetiniz aktif edildi.');
          
          // Trigger confetti animation (optional - won't crash if library fails)
          try {
            const confetti = (await import('canvas-confetti')).default;
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min: number, max: number) {
              return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
              const timeLeft = animationEnd - Date.now();

              if (timeLeft <= 0) {
                return clearInterval(interval);
              }

              const particleCount = 50 * (timeLeft / duration);
              
              // Fire confetti from both sides
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
              });
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
              });
            }, 250);
          } catch (confettiError) {
            console.warn('⚠️ Confetti animation failed (non-critical):', confettiError);
          }

          // Redirect to dashboard after 5 seconds
          setTimeout(() => {
            console.log('🔄 Redirecting to dashboard...');
            navigate('/dashboard');
          }, 5000);
        } else {
          console.error('❌ Payment verification failed:', data);
          setStatus('error');
          setMessage(data?.error || 'Ödeme doğrulaması başarısız oldu.');
        }
      } catch (error) {
        console.error('❌ Payment verification error:', error);
        setStatus('error');
        setMessage('Beklenmeyen bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.');
      }
    };

    verifyPayment();
  }, [searchParams, supabaseUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Ödeme İşleniyor'}
            {status === 'success' && '🎉 Tebrikler!'}
            {status === 'error' && 'Ödeme Başarısız'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium mb-2">
                ✨ Rozetiniz Aktif!
              </p>
              <p className="text-green-700 text-sm">
                Artık profilinizde premium rozetiniz görünüyor ve arama sonuçlarında öne çıkıyorsunuz.
              </p>
              <p className="text-green-600 text-xs mt-2">
                5 saniye içinde dashboard'a yönlendirileceksiniz...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Bir sorun oluştu. Lütfen aşağıdaki adımları deneyin:
              </p>
              <ul className="text-red-700 text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Sayfayı yenileyin</li>
                <li>Dashboard'unuzu kontrol edin</li>
                <li>Destek ekibiyle iletişime geçin</li>
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1"
              variant={status === 'success' ? 'default' : 'outline'}
            >
              Dashboard'a Git
            </Button>
            {status === 'error' && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1"
              >
                Tekrar Dene
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}