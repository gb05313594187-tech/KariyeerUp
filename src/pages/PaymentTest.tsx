import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TestCard {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  type: 'success' | 'failure' | '3ds';
  description: string;
}

export default function PaymentTest() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<TestCard | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const testCards: TestCard[] = [
    {
      name: 'Başarılı Ödeme',
      number: '5528790000000008',
      expiry: '12/30',
      cvv: '123',
      type: 'success',
      description: 'Bu kart ile yapılan ödemeler başarılı olur',
    },
    {
      name: 'Başarısız Ödeme - Yetersiz Bakiye',
      number: '5406670000000009',
      expiry: '12/30',
      cvv: '123',
      type: 'failure',
      description: 'Yetersiz bakiye hatası verir',
    },
    {
      name: 'Başarısız Ödeme - Genel Hata',
      number: '4543590000000006',
      expiry: '12/30',
      cvv: '123',
      type: 'failure',
      description: 'Genel ödeme hatası verir',
    },
    {
      name: '3D Secure Doğrulama',
      number: '5528790000000008',
      expiry: '12/30',
      cvv: '123',
      type: '3ds',
      description: '3D Secure doğrulama ekranı gösterir',
    },
  ];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} kopyalandı!`);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleTestPayment = (card: TestCard) => {
    setSelectedCard(card);
    toast.info('Test kartı seçildi', {
      description: 'Ödeme sayfasına yönlendiriliyorsunuz...',
    });
    
    setTimeout(() => {
      navigate('/payment/1', { 
        state: { 
          testCard: card,
          isTest: true 
        } 
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Ödeme Sistemi Test Aracı</h1>
          <p className="text-gray-600">İyzico Sandbox test kartları ile ödeme akışını test edin</p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Test Modu</AlertTitle>
          <AlertDescription className="text-blue-800">
            Bu sayfada İyzico Sandbox test kartlarını kullanarak ödeme sistemini test edebilirsiniz. 
            Gerçek para çekilmez, tüm işlemler simülasyondur.
          </AlertDescription>
        </Alert>

        {/* Test Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {testCards.map((card, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                selectedCard?.number === card.number ? 'ring-2 ring-blue-900' : ''
              }`}
              onClick={() => setSelectedCard(card)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-blue-900 mb-2">
                      {card.name}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                  {card.type === 'success' && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Başarılı
                    </Badge>
                  )}
                  {card.type === 'failure' && (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Başarısız
                    </Badge>
                  )}
                  {card.type === '3ds' && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      3D Secure
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Card Number */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Kart Numarası</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {card.number.match(/.{1,4}/g)?.join(' ')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(card.number, 'Kart Numarası');
                    }}
                  >
                    {copiedField === 'Kart Numarası' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Son Kullanma</p>
                      <p className="font-mono font-semibold text-gray-900">{card.expiry}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(card.expiry, 'Son Kullanma');
                      }}
                    >
                      {copiedField === 'Son Kullanma' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">CVV</p>
                      <p className="font-mono font-semibold text-gray-900">{card.cvv}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(card.cvv, 'CVV');
                      }}
                    >
                      {copiedField === 'CVV' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-900 hover:bg-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestPayment(card);
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Bu Kart ile Test Et
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-900">Test Senaryoları</CardTitle>
            <CardDescription>
              Farklı ödeme durumlarını test etmek için aşağıdaki senaryoları kullanın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">✅ Başarılı Ödeme Testi</h4>
                <p className="text-sm text-gray-600">
                  İlk test kartını kullanarak başarılı bir ödeme işlemi gerçekleştirin. 
                  Ödeme onaylandıktan sonra randevu detayları ve video görüşme linki gösterilecektir.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">❌ Başarısız Ödeme Testi</h4>
                <p className="text-sm text-gray-600">
                  İkinci veya üçüncü test kartını kullanarak başarısız ödeme senaryolarını test edin. 
                  Sistem hata mesajı gösterecek ve kullanıcıyı tekrar denemeye yönlendirecektir.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">🔒 3D Secure Doğrulama Testi</h4>
                <p className="text-sm text-gray-600">
                  Dördüncü test kartını kullanarak 3D Secure doğrulama akışını test edin. 
                  Ek güvenlik doğrulaması simülasyonu yapılacaktır.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">💳 Taksit Seçenekleri Testi</h4>
                <p className="text-sm text-gray-600">
                  Ödeme sayfasında farklı taksit seçeneklerini deneyin. 
                  Vade farkı hesaplamaları ve aylık ödeme tutarları otomatik olarak güncellenecektir.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">📊 Premium Üyelik Yükseltme Testi</h4>
                <p className="text-sm text-gray-600">
                  Pricing sayfasından premium plana geçiş yaparak abonelik yükseltme akışını test edin. 
                  Ödeme sonrası profil sayfasında premium rozeti görünecektir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-blue-900 text-blue-900 hover:bg-blue-50"
          >
            ← Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}