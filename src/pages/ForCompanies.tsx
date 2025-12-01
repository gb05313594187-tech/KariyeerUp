// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar"; // NAVBAR EKLENDİ

export default function ForCompanies() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simülasyon
    setTimeout(() => {
        alert("Talebiniz alındı! Kurumsal ekibimiz size ulaşacak.");
        setFormData({ companyName: '', contactPerson: '', email: '', phone: '', message: '' });
        setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar /> {/* NAVBAR BURAYA GELDİ */}
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block py-1 px-4 rounded-full bg-white/20 text-white text-sm font-bold mb-6 backdrop-blur-sm border border-white/30">
            KURUMSAL ÇÖZÜMLER
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Şirketinizin Potansiyelini <br/> Zirveye Taşıyın
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-10 font-light">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve sürdürülebilir bir başarı kültürü oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-red-600 hover:bg-red-50 font-bold py-4 px-10 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
            >
              Teklif Alın
            </button>
            <button 
                onClick={() => navigate('/coaches')}
                className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl transition-all"
            >
              Koçları İncele
            </button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Neden Kurumsal Koçluk?</h2>
            <p className="text-gray-500 mt-2">Verilerle kanıtlanmış başarı.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* KART 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:border-red-200 transition-colors group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📈</div>
            <div className="text-5xl font-black text-gray-900 mb-2">%21</div>
            <div className="font-bold text-xl text-red-600 mb-3">Performans Artışı</div>
            <p className="text-gray-600 leading-relaxed">Profesyonel koçluk alan ekiplerde gözlemlenen ortalama verimlilik artışı.</p>
          </div>
          {/* KART 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:border-orange-200 transition-colors group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
            <div className="text-5xl font-black text-gray-900 mb-2">3x</div>
            <div className="font-bold text-xl text-orange-600 mb-3">Çalışan Bağlılığı</div>
            <p className="text-gray-600 leading-relaxed">Gelişimine yatırım yapılan çalışanların şirkete bağlılık oranı üç kat artar.</p>
          </div>
          {/* KART 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:border-red-200 transition-colors group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💰</div>
            <div className="text-5xl font-black text-gray-900 mb-2">%86</div>
            <div className="font-bold text-xl text-red-600 mb-3">Yatırım Getirisi</div>
            <p className="text-gray-600 leading-relaxed">Kurumsal koçluk programlarının sağladığı ortalama geri dönüş (ROI).</p>
          </div>
        </div>
      </div>

      {/* İLETİŞİM FORMU */}
      <div id="contact-form" className="bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-red-600">
            <div className="bg-white p-8 text-center border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Talep Edin</h2>
                <p className="text-gray-500">Kurumunuza özel çözümler için formu doldurun.</p>
            </div>
            <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Şirket Adı</label>
                            <input 
                                required 
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                                placeholder="Şirketiniz"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Yetkili Kişi</label>
                            <input 
                                required 
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                                placeholder="Adınız Soyadınız"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                            <input 
                                type="email" 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                                placeholder="ornek@sirket.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                            <input 
                                type="tel" 
                                required 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                                placeholder="0555 000 00 00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
                        <textarea 
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all h-32 resize-none" 
                            placeholder="İhtiyaçlarınızı kısaca anlatın..."
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-4 rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder →'}
                    </button>
                </form>
            </div>
        </div>
      </div>

    </div>
  );
}
