import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { purchaseBadge } = useSubscription();
  const { t } = useLanguage();

  const badgeType = (searchParams.get('badge') as 'blue' | 'gold') || 'blue';
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const prices = {
    blue: 99,
    gold: 299,
  };

  const amount = prices[badgeType];
  const taxRate = 0.18;
  const taxAmount = amount * taxRate;
  const totalAmount = amount + taxAmount;

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError(t('invalidCardNumber'));
      return false;
    }
    if (!cardDetails.cardHolder || cardDetails.cardHolder.length < 3) {
      setError(t('invalidCardHolder'));
      return false;
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      setError(t('invalidExpiryDate'));
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      setError(t('invalidCVV'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError(t('pleaseLogin'));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await purchaseBadge(badgeType, paymentMethod, cardDetails);
      
      if (result.success) {
        navigate('/payment-success?subscription=' + result.subscriptionId);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('paymentError'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>{t('loginRequired')}</CardTitle>
            <CardDescription>{t('pleaseLoginToContinue')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              {t('goToHomepage')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
              <CardDescription>{t('reviewYourOrder')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-16 h-16 ${badgeType === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                  {badgeType === 'blue' ? '✓' : '★'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {badgeType === 'blue' ? t('blueBadge') : t('goldBadge')}
                  </h3>
                  <p className="text-gray-600">{t('monthlySubscription')}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="font-medium">{amount.toFixed(2)} TRY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('tax')} (18%)</span>
                  <span className="font-medium">{taxAmount.toFixed(2)} TRY</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t('total')}</span>
                  <span>{totalAmount.toFixed(2)} TRY</span>
                </div>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  {t('securePayment')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('paymentDetails')}</CardTitle>
              <CardDescription>{t('enterCardDetails')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Payment Method */}
                <div className="space-y-2">
                  <Label>{t('paymentMethod')}</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'credit_card' | 'debit_card')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="cursor-pointer">
                        {t('creditCard')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit_card" id="debit_card" />
                      <Label htmlFor="debit_card" className="cursor-pointer">
                        {t('debitCard')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                    />
                    <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Card Holder */}
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">{t('cardHolder')}</Label>
                  <Input
                    id="cardHolder"
                    placeholder="JOHN DOE"
                    value={cardDetails.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value.toUpperCase())}
                    required
                  />
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">{t('cvv')}</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Demo Mode Notice */}
                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>{t('demoMode')}:</strong> {t('demoModeDescription')}
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? t('processing') : `${t('pay')} ${totalAmount.toFixed(2)} TRY`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}