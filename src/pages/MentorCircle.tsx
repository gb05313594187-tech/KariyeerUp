// @ts-nocheck
import { useNavigate } from "react-router-dom";

export default function MentorCircle() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
            Topluluk
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MentorCircle</h1>
          <p className="text-xl text-gray-600">Birlikte öğrenin, birlikte büyüyün.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* KART 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-600">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🤝 Networking Grupları
            </h3>
            <p className="text-gray-600 mb-6">
              Sektörünüze özel gruplara katılın, yeni bağlantılar kurun ve kariyer fırsatlarını yakalayın.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Hemen Katıl
            </button>
          </div>

          {/* KART 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-pink-600">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              💬 Soru-Cevap Etkinlikleri
            </h3>
            <p className="text-gray-600 mb-6">
              Deneyimli mentorlara sorularınızı sorun, kariyeriniz için en doğru yol haritasını çizin.
            </p>
            <button 
              onClick={() => navigate('/coaches')}
              className="w-full border-2 border-pink-600 text-pink-600 py-3 rounded-lg font-bold hover:bg-pink-50 transition-colors"
            >
              Mentorları Keşfet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
