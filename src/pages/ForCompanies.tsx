// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForCompanies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Kurumsal Koçluk Çözümleri</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Çalışanlarınızın potansiyelini ortaya çıkarın, liderlik yetkinliklerini geliştirin ve şirket kültürünüzü güçlendirin.
          </p>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50" onClick={() => window.location.href = 'mailto:kurumsal@kariyeer.com'}>
            Teklif Alın
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Performans Artışı</h3>
              <p className="text-gray-600">
                Koçluk alan ekiplerde %20'ye varan performans artışı ve hedef tutturma oranı.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Çalışan Bağlılığı</h3>
              <p className="text-gray-600">
                Değer verildiğini hisseden çalışanlarda daha yüksek motivasyon ve sadakat.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Liderlik Gelişimi</h3>
              <p className="text-gray-600">
                Yeni nesil liderler yetiştirin ve yönetim kadronuzu güçlendirin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
