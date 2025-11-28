import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { getCoaches } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const packageId = searchParams.get('package');
  const coaches = getCoaches();
  const coach = coaches.find(c => c.id === id);
  const selectedPackage = coach?.packages?.find(p => p.id === packageId);

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    installment: '1',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Koç bulunamadı</p>
      </div>
    );
  }

  const amount = selectedPackage ? selectedPackage.price : coach.hourlyRate45 || 0;
  const installmentOptions = [
    { value: '1', label: 'Tek Çekim', rate: 0 },
    { value: '2', label: '2 Taksit', rate: 0.02 },
    { value: '3', label: '3 Taksit', rate: 0.03 },
    { value: '6', label: '6 Taksit', rate: 0.05 },
    { value: '9', label: '9 Taksit', rate: 0.07 },
    { value: '12', label: '12 Taksit', rate: 0.09 },
  ];

  const selectedInstallment = installmentOptions.find(opt => opt.value === formData.installment);
  const totalAmount = amount * (1 + (selectedInstallment?.rate || 0));
  const monthlyPayment = totalAmount / parseInt(formData.installment);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Kart üzerindeki isim gerekli';
    }

    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      newErrors.cardNumber = 'Geçerli bir kart numarası girin (16 haneli)';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!formData.expiry || !expiryRegex.test(formData.expiry)) {
      newErrors.expiry = 'Geçerli bir tarih girin (AA/YY)';
    }

    if (!formData.cvv || formData.cvv.length !== 3 || !/^\d+$/.test(formData.cvv)) {
      newErrors.cvv = 'Geçerli bir CVV girin (3 haneli)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate success (90% success rate)
      if (Math.random() > 0.1) {
        navigate(`/payment-success?amount=${totalAmount}&coach=${coach.name}`);
      } else {
        navigate('/payment-failed');
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cardNumber: formatCardNumber(value) });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setFormData({ ...formData, expiry: value });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cvv: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Güvenli Ödeme</h1>
          <p className="text-gray-600">İyzico ile güvenli ödeme yapın</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Kart Bilgileri
                </CardTitle>
                <CardDescription>
                  Ödeme bilgileriniz SSL ile şifrelenir ve güvenle saklanır
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Name */}
                  <div>
                    <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
                    <Input
                      id="cardName"
                      placeholder="AHMET YILMAZ"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                      className={errors.cardName ? 'border-red-500' : ''}
                    />
                    {errors.cardName && (
                      <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div>
                    <Label htmlFor="cardNumber">Kart Numarası</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      className={errors.cardNumber ? 'border-red-500' : ''}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
                      <Input
                        id="expiry"
                        placeholder="AA/YY"
                        value={formData.expiry}
                        onChange={handleExpiryChange}
                        className={errors.expiry ? 'border-red-500' : ''}
                      />
                      {errors.expiry && (
                        <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleCvvChange}
                        className={errors.cvv ? 'border-red-500' : ''}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Installment Options */}
                  <div>
                    <Label htmlFor="installment">Taksit Seçeneği</Label>
                    <Select value={formData.installment} onValueChange={(value) => setFormData({ ...formData, installment: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {installmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            {option.rate > 0 && ` (+%${(option.rate * 100).toFixed(0)} vade farkı)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Güvenli Ödeme</p>
                      <p className="text-blue-700">
                        Ödemeniz 256-bit SSL şifrelemesi ile korunmaktadır. Kart bilgileriniz saklanmaz.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white h-12 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        İşleminiz Gerçekleştiriliyor...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        {totalAmount.toFixed(2)}₺ Öde
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    Ödeme yaparak{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Kullanım Koşulları
                    </a>
                    'nı ve{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Gizlilik Politikası
                    </a>
                    'nı kabul etmiş olursunuz.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coach Info */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-blue-900">{coach.name}</p>
                    <p className="text-sm text-gray-600">{coach.title}</p>
                  </div>
                </div>

                {/* Package/Session Details */}
                <div className="space-y-2">
                  {selectedPackage ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paket:</span>
                        <span className="font-semibold">
                          {language === 'tr' ? selectedPackage.name : selectedPackage.nameEn}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seans Sayısı:</span>
                        <span className="font-semibold">{selectedPackage.sessions}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tek Seans:</span>
                      <span className="font-semibold">45 Dakika</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span>{amount.toFixed(2)}₺</span>
                  </div>
                  {selectedInstallment && selectedInstallment.rate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vade Farkı:</span>
                      <span className="text-orange-600">
                        +{(amount * selectedInstallment.rate).toFixed(2)}₺
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-blue-900">Toplam:</span>
                    <span className="text-blue-900">{totalAmount.toFixed(2)}₺</span>
                  </div>
                  {parseInt(formData.installment) > 1 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                      <p className="text-yellow-900">
                        <span className="font-semibold">{formData.installment} taksit</span> x{' '}
                        <span className="font-semibold">{monthlyPayment.toFixed(2)}₺</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>SSL Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>256-bit Şifreleme</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span>İyzico Güvencesi</span>
                  </div>
                </div>

                {/* Powered by iyzico */}
                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-gray-500 mb-2">Ödeme Altyapısı</p>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Powered by İyzico
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}