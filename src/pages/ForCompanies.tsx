// @ts-nocheck
import { Building2, TrendingUp, Users, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForCompanies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* HERO SECTION */}
      <div className="bg-blue-900 text-white py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800 text-blue-200 text-sm font-semibold mb-6">
            Kurumsal Çözümler
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Şirketinizin Potansiyelini Ortaya Çıkarın
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve kurum kültürünüzü güçlendirin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
                onClick={() => window.location.href = 'mailto:kurumsal@kariyeer.com'}
            >
              <Mail className="w-5 h-5"/> Teklif Alın
            </button>
            <button 
                className="border border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
                onClick={() => navigate('/coaches')}
            >
                Koçları İncele <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* KART 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">%21</div>
            <div className="font-semibold text-lg mb-3">Performans Artışı</div>
            <p className="text-gray-600">Profesyonel koçluk alan ekiplerde gözlemlenen ortalama verimlilik artışı.</p>
          </div>

          {/* KART 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">3x</div>
            <div className="font-semibold text-lg mb-3">Çalışan Bağlılığı</div>
            <p className="text-gray-600">Gelişimine yatırım yapılan çalışanların şirkete bağlılık oranı üç kat artar.</p>
          </div>

          {/* KART 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">%86</div>
            <div className="font-semibold text-lg mb-3">Yatırım Getirisi</div>
            <p className="text-gray-600">Kurumsal koçluk programlarının sağladığı ortalama geri dönüş (ROI) oranı.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
