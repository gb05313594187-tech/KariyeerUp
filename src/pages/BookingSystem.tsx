// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCoaches } from '@/data/mockData';

export default function BookingSystem() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // YEDEK KOÇ VERİSİ
  const fallbackCoach = {
      id: id || '1',
      name: 'Kariyer Koçu', 
      title: 'Uzman Koç',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      hourlyRate45: 1500,
      languages: ['Türkçe']
  };

  const [coach, setCoach] = useState<any>(fallbackCoach); 
  const [loading, setLoading] = useState(false); 
  const [countryCode, setCountryCode] = useState('+90');
  const [step, setStep] = useState(1); // 1: Tarih, 2: Form, 3: Başarılı

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    try {
      const mockCoaches = getCoaches();
      if (mockCoaches) {
        const found = mockCoaches.find((c: any) => String(c.id) == String(id));
        if (found) setCoach(found);
      }
    } catch (e) {}
    setLoading(false);
  }, [id]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Simülasyon Başarısı
    setTimeout(() => {
        navigate('/payment-success');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* BAŞLIK KARTI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 flex items-center gap-4">
            <img src={coach.photo} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"/>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{coach.name}</h1>
                <p className="text-gray-500">{coach.title}</p>
            </div>
            <div className="ml-auto text-right">
                <div className="text-sm text-gray-500">Seans Ücreti</div>
                <div className="text-xl font-bold text-blue-600">{coach.hourlyRate45} TL</div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            
            {/* SOL: İŞLEM ALANI */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-lg font-bold mb-4">📅 Randevu Oluştur</h2>
                
                {/* SAAT SEÇİMİ */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                        <button 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-4 rounded border text-sm font-medium transition-colors
                                ${selectedTime === time ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                {/* FORM ALANI */}
                {selectedTime && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input 
                                type="email" 
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <div className="flex gap-2">
                                <select 
                                    className="p-3 border rounded-lg bg-white"
                                    value={countryCode}
                                    onChange={e => setCountryCode(e.target.value)}
                                >
                                    <option value="+90">🇹🇷 TR (+90)</option>
                                    <option value="+1">🇺🇸 US (+1)</option>
                                    <option value="+49">🇩🇪 DE (+49)</option>
                                </select>
                                <input 
                                    type="tel" 
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="555 123 45 67"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ödemeye Geç ({coach.hourlyRate45} TL)
                        </button>
                    </form>
                )}
            </div>

            {/* SAĞ: BİLGİ */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit">
                <h3 className="font-bold text-blue-900 mb-2">ℹ️ Nasıl Çalışır?</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>1. Uygun saati seçin.</li>
                    <li>2. Bilgilerinizi girin.</li>
                    <li>3. Ödemeyi güvenle tamamlayın.</li>
                    <li>4. Görüşme linki e-postanıza gelsin.</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-blue-200">
                    <div className="flex justify-between text-sm font-bold text-blue-900">
                        <span>Seçilen Saat:</span>
                        <span>{selectedTime || '-'}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
