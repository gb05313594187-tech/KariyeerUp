// @ts-nocheck
import { useNavigate } from "react-router-dom";

export default function ForCompanies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* HERO (Zengin Görünüm) */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-700/50 border border-blue-500 text-blue-100 text-sm font-semibold mb-6">
            KURUMSAL ÇÖZÜMLER
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Şirketinizin Potansiyelini <br/><span className="text-blue-200">Zirveye Taşıyın</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve güçlü bir kurum kültürü oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg shadow-lg transition-transform hover:scale-105"
                onClick={() => window.location.href = 'mailto:kurumsal@kariyeer.com'}
            >
              Teklif Alın
            </button>
            <button 
                className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105"
                onClick={() => navigate('/coaches')}
            >
                Koçları İncele
            </button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* KART 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              📈
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">%21</div>
            <div className="font-semibold text-lg mb-3 text-gray-800">Performans Artışı</div>
            <p className="text-gray-600 text-sm">Profesyonel koçluk alan ekiplerde gözlemlenen ortalama verimlilik artışı.</p>
          </div>

          {/* KART 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🤝
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">3x</div>
            <div className="font-semibold text-lg mb-3 text-gray-800">Çalışan Bağlılığı</div>
            <p className="text-gray-600 text-sm">Gelişimine yatırım yapılan çalışanların şirkete bağlılık oranı üç kat artar.</p>
          </div>

          {/* KART 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              💎
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">%86</div>
            <div className="font-semibold text-lg mb-3 text-gray-800">Yatırım Getirisi</div>
            <p className="text-gray-600 text-sm">Kurumsal koçluk programlarının sağladığı ortalama geri dönüş (ROI) oranı.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
