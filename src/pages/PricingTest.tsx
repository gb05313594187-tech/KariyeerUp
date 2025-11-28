import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function PricingTest() {
  const { user, supabaseUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (type: 'blue_badge' | 'gold_badge', price: number) => {
    if (!supabaseUser) {
      toast.error('Lütfen önce giriş yapın');
      navigate('/login');
      return;
    }

    setLoading(true);
    console.log('=== SIMPLE PAYMENT TEST STARTED ===');
    console.log('User:', supabaseUser.id, supabaseUser.email);
    console.log('Type:', type, 'Price:', price);

    try {
      // Get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast.error('Oturum hatası');
        setLoading(false);
        return;
      }

      console.log('Session OK, calling edge function...');

      // Call the simpler edge function
      const edgeUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_create_payment';
      console.log('Edge function URL:', edgeUrl);

      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subscription_type: type,
          price: price,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Hata: ${response.status} - ${errorText}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);

      if (result.success && result.payment_url) {
        console.log('Redirecting to payment page:', result.payment_url);
        toast.success('Ödeme sayfasına yönlendiriliyorsunuz...');
        
        // Redirect to iyzico payment page
        window.location.href = result.payment_url;
      } else {
        console.error('Invalid response:', result);
        toast.error('Ödeme başlatılamadı');
        setLoading(false);
      }

    } catch (error) {
      console.error('=== PAYMENT ERROR ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('Full error:', error);
      
      toast.error('Bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Ödeme Test Sayfası</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mavi Tik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₺99 / ay</p>
              <Button
                onClick={() => handlePayment('blue_badge', 99)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'İşleniyor...' : 'Satın Al'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Altın Tik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₺299 / ay</p>
              <Button
                onClick={() => handlePayment('gold_badge', 299)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'İşleniyor...' : 'Satın Al'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Test Modu:</strong> Bu sayfa ödeme sistemini test etmek içindir. 
            Console'u (F12) açık tutun ve log'ları takip edin.
          </p>
        </div>
      </div>
    </div>
  );
}