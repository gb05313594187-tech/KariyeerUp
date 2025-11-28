import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { supabaseUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Ödemeniz işleniyor...');

  useEffect(() => {
    const verifyPayment = async () => {
      console.log('🔄 VERSION 54: PaymentSuccess - FIXED URL path with direct fetch');
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
        console.log('🔄 Calling iyzico_callback edge function with direct fetch...');

        // Get session for authorization
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('❌ No session found');
          setStatus('error');
          setMessage('Oturum bulunamadı. Lütfen giriş yapın.');
          return;
        }

        // FIXED: Use direct fetch instead of supabase.functions.invoke
        const edgeUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_iyzico_callback';
        console.log('🔗 Edge Function URL:', edgeUrl);

        const response = await fetch(edgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            token,
            userId: supabaseUser.id
          }),
        });

        console.log('📊 Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error:', errorText);
          throw new Error(`Edge Function Error: ${errorText}`);
        }

        const data = await response.json();
        console.log('📊 Edge function response:', data);

        if (data?.success) {
          console.log('✅ Payment verification successful!');
          setStatus('success');
          setMessage('Ödemeniz başarıyla tamamlandı! Rozetiniz aktif edildi.');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            console.log('🔄 Redirecting to dashboard...');
            navigate('/dashboard');
          }, 3000);
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
                3 saniye içinde dashboard'a yönlendirileceksiniz...
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