// @ts-nocheck
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, bookingData } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvc: ''
  });

  // Kredi kartı formatlama (Görsel Güzellik)
  const handleCardNumberChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, number: value.substring(0, 19) });
  };

  const handlePayment = async (e: any) => {
    e.preventDefault();
    
    if (cardData.number.length < 19 || cardData.cvc.length < 3) {
      toast.error('Lütfen kart bilgilerinizi eksiksiz girin.');
      return;
    }

    setIsLoading(true);

    // --- BURAYA İLERİDE GERÇEK POS (IYZICO/STRIPE) GELECEK ---
    // Şimdilik 2 saniye bekleyip onaylıyor (Simülasyon)
    setTimeout(() => {
        setIsLoading(false);
        navigate(`/payment-success?bookingId=${bookingId || 'new'}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2"/> Geri Dön
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* SOL: ÖDEME FORMU */}
          <div className="md:col-span-2">
            <Card className="border-t-4 border-t-blue-900 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="w-6 h-6 text-blue-900"/> Güvenli Ödeme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                    
                    <div className="space-y-2">
                        <Label>Kart Sahibi</Label>
                        <Input 
                            placeholder="Ad Soyad" 
                            value={cardData.holder}
                            onChange={(e) => setCardData({...cardData, holder: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Kart Numarası</Label>
                        <div className="relative">
                            <Input 
                                placeholder="0000 0000 0000 0000" 
                                value={cardData.number}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                                required
                                className="pl-10 font-mono"
                            />
                            <CreditCard className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Son Kullanma (Ay/Yıl)</Label>
                            <Input 
                                placeholder="MM/YY" 
                                value={cardData.expiry}
                                onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                maxLength={5}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CVC / CVV</Label>
                            <div className="relative">
                                <Input 
                                    placeholder="123" 
                                    type="password"
                                    value={cardData.cvc}
                                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                                    maxLength={3}
                                    required
                                    className="pl-10"
                                />
                                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                        <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0"/>
                        <p className="text-sm text-gray-600">
                            Ödemeniz 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz sunucularımızda saklanmaz.
                        </p>
                    </div>

                    <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg" disabled={isLoading}>
                        {isLoading ? 'Ödeme İşleniyor...' : 'Ödemeyi Tamamla'}
                    </Button>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* SAĞ: SİPARİŞ ÖZETİ */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
                <CardHeader><CardTitle>Sipariş Özeti</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hizmet Bedeli</span>
                        <span className="font-semibold">1500.00 TL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">KDV (%20)</span>
                        <span className="font-semibold">300.00 TL</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-blue-900">
                        <span>Toplam</span>
                        <span>1800.00 TL</span>
                    </div>
                    
                    <div className="flex gap-2 justify-center mt-4">
                        <Badge variant="outline">Visa</Badge>
                        <Badge variant="outline">Mastercard</Badge>
                        <Badge variant="outline">Troy</Badge>
                    </div>
                </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
