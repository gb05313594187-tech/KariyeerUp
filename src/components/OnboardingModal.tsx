// src/components/OnboardingModal.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Brain, Briefcase, MapPin, Rocket } from 'lucide-react';

export const OnboardingModal = ({ isOpen, onClose, userId }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    work_preference: 'hybrid', // ofis, hibrit, uzaktan
    job_title: '',
    bio: '',
    personality_test: '' // Kişilik envanteri cevabı
  });

  const handleSave = async () => {
    // 1. Career Profiles tablosuna kayıt
    const { error } = await supabase
      .from('career_profiles')
      .upsert({ 
        id: userId, 
        work_preference: formData.work_preference,
        title: formData.job_title,
        bio: formData.bio 
      });

    if (!error) {
      alert("Profilin başarıyla güncellendi! Şimdi AI senin için rapor hazırlıyor.");
      onClose(); // Modal'ı kapat
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-t-8 border-orange-500">
        
        {/* Header - Kırmızı/Turuncu Gradyan */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white text-center">
          <Rocket className="mx-auto mb-2" size={32} />
          <h2 className="text-2xl font-bold">KariyeerUp'a Hoş Geldin!</h2>
          <p className="text-sm opacity-90">Senin için en iyi fırsatları hazırlıyoruz.</p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Nasıl bir iş bakıyorsun?</h3>
              <div className="grid grid-cols-3 gap-4">
                {['Ofis', 'Hibrit', 'Uzaktan'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, work_preference: type.toLowerCase()})}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.work_preference === type.toLowerCase() 
                      ? 'border-orange-500 bg-orange-50 text-orange-600' 
                      : 'border-gray-100 hover:border-red-200'
                    }`}
                  >
                    <MapPin className="mx-auto mb-1" size={20} />
                    <span className="text-sm font-medium">{type}</span>
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Hedeflediğin İş Unvanı (Örn: Satış Müdürü)"
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                onChange={(e) => setFormData({...formData, job_title: e.target.value})}
              />
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Sonraki Adım →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-orange-600">
                <Brain size={24} />
                <h3 className="text-lg font-semibold">Kişilik Envanteri (Mini Test)</h3>
              </div>
              <p className="text-sm text-gray-600">Gemini AI'nın seni tanıması için kendini 2 cümlede anlatır mısın?</p>
              <textarea 
                rows={4}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Örn: Sorun çözmeyi seven, ekip çalışmasına yatkın ve detaycı biriyim..."
                onChange={(e) => setFormData({...formData, personality_test: e.target.value})}
              />
              <button 
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition"
              >
                Profilimi Tamamla & Kariyerimi Parlat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
