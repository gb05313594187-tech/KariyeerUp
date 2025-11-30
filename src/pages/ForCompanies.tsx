// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Users, CheckCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForCompanies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <div className="bg-blue-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-800 text-blue-100 hover:bg-blue-700">Kurumsal Çözümler</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Şirketinizin Potansiyelini Ortaya Çıkarın</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve kurum kültürünüzü güçlendirin.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-bold" onClick={() => window.location.href = 'mailto:kurumsal@kariyeer.com'}>
              <Mail className="mr-2 h-5 w-5"/> Teklif Alın
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-800 hover:text-white" onClick={() => navigate('/coaches')}>
                Koçlarımızı İnceleyin
            </Button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-green-500">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">%21</h3>
              <p className="font-semibold text-gray-900 mb-2">Performans Artışı</p>
              <p className="text-gray-600 text-sm">
                Profesyonel koçluk alan ekiplerde gözlemlenen ortalama performans artışı.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">3x</h3>
              <p className="font-semibold text-gray-900 mb-2">Çalışan Bağlılığı</p>
              <p className="text-gray-600 text-sm">
                Gelişimine yatırım yapılan çalışanların şirkete bağlılığı 3 kat artar.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-purple-500">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">%86</h3>
              <p className="font-semibold text-gray-900 mb-2">ROI (Yatırım Getirisi)</p>
              <p className="text-gray-600 text-sm">
                Kurumsal koçluk programlarının şirketlere sağladığı ortalama geri dönüş oranı.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
