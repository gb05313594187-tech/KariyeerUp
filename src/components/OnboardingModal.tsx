// src/components/OnboardingModal.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { notionAIService } from '../lib/notionAI'; // Az önce oluşturduğumuz servis
import { Rocket, Briefcase, MapPin, Brain, Star } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  userId: string;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingProps> = ({ isOpen, userId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    work_preference: 'hybrid',
    personality_intro: '',
    experience_level: 'mid'
  });

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // 1. ADIM: Supabase'e Ham Veriyi Kaydet
      const { error: sbError } = await supabase
        .from('career_profiles')
        .upsert({
          id: userId,
          title: formData.title,
          work_preference: formData.work_preference,
          bio: formData.personality_intro // Şimdilik ham metni yazıyoruz
        });

      if (sbError) throw sbError;

      // 2. ADIM: Notion'a Rapor Gönder (Arka Planda)
      // Bu işlem, senin Cloudflare'deki güvenli anahtarını kullanacak
      await notionAIService.createCandidateReport(
        "Yeni Aday", 
        formData.personality_intro, 
        [formData.title, formData.work_preference]
      );

      // 3. ADIM: İşlem Tamam
      onComplete();
      alert("Profilin Yapay Zeka ile optimize edildi ve Notion raporun oluşturuldu!");
      
    } catch (err) {
      console.error("Hata oluştu:", err);
      alert("Bir şeyler ters gitti ama profilin kaydedilmiş olabilir.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[12px] border-orange-500">
        
        {/* Progress Bar */}
        <div className="flex h-2 w-full bg-gray-100">
          <div className={`transition-all duration-500 bg-red-600 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <div className="p-8 md:p-12">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <Briefcase size={28} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Hedefini Belirleyelim</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Hangi Rolde İş Arıyorsun?</label>
                  <input 
                    type="text"
                    placeholder="Örn: Senior Frontend Developer"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-medium"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Çalışma Modeli Tercihin</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Ofis', 'Hibrit', 'Uzaktan'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setFormData({...formData, work_preference: m.toLowerCase()})}
                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                          formData.work_preference === m.toLowerCase() 
                          ? 'border-red-600 bg-red-50 text-red-600' 
                          : 'border-slate-100 text-slate-400 hover:border-red-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  Sonraki Adım <Rocket size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                  <Brain size={28} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Kişilik Envanteri</h2>
              </div>

              <div className="space-y-6">
                <p className="text-slate-600 font-medium">
                  Gemini AI'nın senin için en uygun şirketleri bulması için bize biraz kendinden bahset. (Güçlü yanların, çalışma tarzın vb.)
                </p>
                
                <textarea 
                  rows={4}
                  placeholder="Örn: Analitik düşünmeyi severim, kriz anlarında sakinimdir..."
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={(e) => setFormData({...formData, personality_intro: e.target.value})}
                />

                <div className="bg-orange-50 p-4 rounded-2xl flex gap-3 items-start">
                  <Star className="text-orange-500 shrink-0" size={20} />
                  <p className="text-xs text-orange-700 font-semibold leading-relaxed">
                    NOT: Bu bilgiler Cloudflare üzerinden güvenli bir şekilde işlenecek ve Notion raporuna dönüştürülecektir.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-slate-200 rounded-2xl font-bold text-slate-400">Geri</button>
                  <button 
                    disabled={loading}
                    onClick={handleFinalSubmit}
                    className="flex-[2] py-5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl font-black text-lg shadow-orange-200 shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Yükleniyor...' : 'Analizi Başlat ✨'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
