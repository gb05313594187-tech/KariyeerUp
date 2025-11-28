import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, HelpCircle, RefreshCw } from 'lucide-react';

export default function PaymentFailed() {
  const navigate = useNavigate();

  const commonReasons = [
    'Yetersiz bakiye',
    'Kart bilgileri hatalı',
    'Kartın son kullanma tarihi geçmiş',
    'CVV kodu yanlış',
    'Bankanız işlemi reddetti',
    '3D Secure doğrulaması başarısız',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl text-red-600 mb-2">Ödeme Başarısız</CardTitle>
          <CardDescription className="text-lg">
            İşleminiz tamamlanamadı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-900 text-center">
              Ödemeniz işlenirken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.
            </p>
          </div>

          {/* Common Reasons */}
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-900 text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Olası Nedenler:
            </h3>
            <ul className="space-y-2 text-gray-700">
              {commonReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to Do */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-blue-900">Ne Yapmalıyım?</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Kart bilgilerinizi kontrol edin</li>
              <li>• Kartınızda yeterli bakiye olduğundan emin olun</li>
              <li>• Farklı bir kart ile deneyebilirsiniz</li>
              <li>• Bankanızla iletişime geçebilirsiniz</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-900 hover:bg-blue-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tekrar Dene
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            <p className="mb-2">Sorun devam ediyorsa bizimle iletişime geçin:</p>
            <div className="space-y-1">
              <p>
                <a href="mailto:destek@kariyeer.com" className="text-blue-600 hover:underline">
                  destek@kariyeer.com
                </a>
              </p>
              <p>
                <a href="tel:+908501234567" className="text-blue-600 hover:underline">
                  0850 123 45 67
                </a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-center text-gray-500">
            <p>
              Ödeme bilgileriniz güvenli bir şekilde işlenir ve saklanmaz.
              <br />
              Tüm işlemler SSL şifrelemesi ile korunmaktadır.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}