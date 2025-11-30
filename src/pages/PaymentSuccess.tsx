// @ts-nocheck
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Calendar, Home } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL'den bookingId'yi al
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      
      <Card className="w-full max-w-md text-center border-t-4 border-t-green-500 shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Randevunuz Başarıyla Alındı!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Tebrikler! Kariyer yolculuğunuzda harika bir adım attınız.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">Bundan Sonra Ne Olacak?</p>
            <ul className="space-y-2 text-left list-disc pl-4">
              <li>Randevu detayları işleme alındı.</li>
              <li>Koçunuz onayladığında size bildirim gelecektir.</li>
              <li>Seans saati geldiğinde panelinizden görüşmeye katılabilirsiniz.</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button 
            className="w-full bg-blue-900 hover:bg-blue-800" 
            onClick={() => navigate('/dashboard')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Randevularıma Git
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
