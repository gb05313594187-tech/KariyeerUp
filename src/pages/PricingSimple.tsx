import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createPayment } from '@/lib/iyzico-simple';
import { useToast } from '@/hooks/use-toast';

export default function PricingSimple() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: 'blue_badge',
      name: 'Mavi Tik',
      price: 99,
      features: [
        'Profil doğrulama rozeti',
        'Arama sonuçlarında öncelik',
        'Güvenilir koç işareti',
        '30 gün geçerli'
      ]
    },
    {
      id: 'gold_badge',
      name: 'Altın Tik',
      price: 299,
      features: [
        'Premium doğrulama rozeti',
        'En üst sırada görünme',
        'VIP koç işareti',
        'Özel destek',
        '90 gün geçerli'
      ]
    }
  ];

  const handlePurchase = async (planId: 'blue_badge' | 'gold_badge', price: number) => {
    setLoading(planId);

    try {
      // 1. Kullanıcı kontrolü
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: 'Hata',
          description: 'Lütfen önce giriş yapın',
          variant: 'destructive'
        });
        setLoading(null);
        return;
      }

      console.log('✅ Kullanıcı:', user.email);

      // 2. İyzico ödeme oluştur
      const userName = user.user_metadata?.full_name || 'Kullanıcı';
      
      console.log('🔵 Ödeme başlatılıyor...', { planId, price, userName });
      
      const paymentData = await createPayment(
        user.id,
        user.email!,
        userName,
        planId,
        price
      );

      console.log('✅ Ödeme URL alındı:', paymentData.paymentUrl);

      // 3. İyzico sayfasına yönlendir
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error('Ödeme URL\'si alınamadı');
      }

    } catch (error) {
      console.error('❌ Ödeme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast({
        title: 'Ödeme Hatası',
        description: errorMessage,
        variant: 'destructive'
      });
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium Rozetler</h1>
          <p className="text-xl text-gray-600">
            Profilinizi doğrulayın ve güvenilirliğinizi artırın
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">₺{plan.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handlePurchase(plan.id as 'blue_badge' | 'gold_badge', plan.price)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? 'Yükleniyor...' : 'Satın Al'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>🔒 Güvenli ödeme - İyzico ile korunmaktasınız</p>
          <p className="mt-2">Test Modu: Gerçek ödeme yapılmayacak</p>
        </div>
      </div>
    </div>
  );
}