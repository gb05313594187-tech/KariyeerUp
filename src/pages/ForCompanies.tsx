// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Users, CheckCircle, ArrowRight, BarChart3, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForCompanies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-800/50 border border-blue-700 mb-8 backdrop-blur-sm">
            <Award className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-blue-100">Kurumsal Gelişim Partneri</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Şirketinizin Potansiyelini <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Zirveye Taşıyın</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve sürdürülebilir başarı kültürü oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 h-14 px-8 text-lg" onClick={() => window.location.href = 'mailto:kurumsal@kariyeer.com'}>
              Kurumsal Teklif Alın
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg" onClick={() => navigate('/coaches')}>
              Koç havuzunu İncele
            </Button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">%21</div>
                <div className="font-semibold text-lg mb-2">Performans Artışı</div>
                <p className="text-gray-600">Profesyonel koçluk alan ekiplerde ölçümlenen ortalama verimlilik artışı.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">3x</div>
                <div className="font-semibold text-lg mb-2">Çalışan Bağlılığı</div>
                <p className="text-gray-600">Kariyer gelişimine yatırım yapılan çalışanların şirkete bağlılık oranı.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">%86</div>
                <div className="font-semibold text-lg mb-2">Yatırım Getirisi (ROI)</div>
                <p className="text-gray-600">Kurumsal koçluk programlarının sağladığı ortalama geri dönüş.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AVANTAJLAR */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Neden Kariyeer Kurumsal?</h2>
                <div className="space-y-4">
                    {[
                        "ICF Sertifikalı ve Deneyimli Koç Havuzu",
                        "Şirketinize Özel Gelişim Programları",
                        "Detaylı Raporlama ve Analiz Paneli",
                        "Çalışan Memnuniyeti Odaklı Yaklaşım",
                        "Online ve Yüz Yüze Görüşme Seçenekleri"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0"/>
                            <span className="text-lg text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
                <Button className="mt-8 bg-blue-900 hover:bg-blue-800 px-8 h-12">
                    Detaylı Bilgi Alın <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-blue-900/10 rounded-2xl transform translate-x-4 translate-y-4"></div>
                <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" 
                    alt="Office meeting" 
                    className="relative rounded-2xl shadow-xl w-full"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
