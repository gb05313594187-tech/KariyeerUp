// @ts-nocheck
/* eslint-disable */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Users, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForCompanies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      
      {/* ÜST BANNER (Hero Section) */}
      <div className="bg-blue-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1 mb-6 bg-blue-800 rounded-full text-sm font-semibold text-blue-100">
            Kurumsal Çözümler
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Şirketinizin Potansiyelini Ortaya Çıkarın
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve kurum kültürünüzü güçlendirin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold h-12 px-8" 
                onClick={() => window.location.href = 'mailto:kurumsal@kariyeer.com'}
            >
              <Mail className="mr-2 h-5 w-5"/> Teklif Alın
            </Button>
            <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-blue-800 h-12 px-8" 
                onClick={() => navigate('/coaches')}
            >
                Koçlarımızı İnceleyin <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* KART 1 */}
          <Card className="border shadow-sm hover:shadow-lg transition-all">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">%21</h3>
              <p className="font-semibold text-lg mb-2">Performans Artışı</p>
              <p className="text-gray-600">
                Profesyonel koçluk alan ekiplerde gözlemlenen ortalama performans artışı.
              </p>
            </CardContent>
          </Card>
          
          {/* KART 2 */}
          <Card className="border shadow-sm hover:shadow-lg transition-all">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">3x</h3>
              <p className="font-semibold text-lg mb-2">Çalışan Bağlılığı</p>
              <p className="text-gray-600">
                Gelişimine yatırım yapılan çalışanların şirkete bağlılığı 3 kat artar.
              </p>
            </CardContent>
          </Card>

          {/* KART 3 */}
          <Card className="border shadow-sm hover:shadow-lg transition-all">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">%86</h3>
              <p className="font-semibold text-lg mb-2">ROI (Yatırım Getirisi)</p>
              <p className="text-gray-600">
                Kurumsal koçluk programlarının şirketlere sağladığı ortalama geri dönüş oranı.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
