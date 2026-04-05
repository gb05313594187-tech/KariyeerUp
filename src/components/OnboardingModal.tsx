// src/components/OnboardingModal.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { notionAIService } from '../lib/notionAI';
import { Rocket, Briefcase, Brain, Star, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

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
    work_preference: 'hibrit',
    personality_intro: '',
  });

  const handleFinalSubmit = async () => {
    if (!formData.personality_intro) return alert("Lütfen kendinizden biraz bahsedin.");
    setLoading(true);
    try {
      const { error: sbError } = await supabase
        .from('career_profiles')
        .upsert({
          id: userId,
          title: formData.title,
          work_preference: formData.work_preference,
          bio: formData.personality_intro,
          updated_at: new Date().toISOString(),
        });

      if (sbError) throw sbError;

      await notionAIService.createCandidateReport(
        "Yeni Aday", 
        formData.personality_intro, 
        [formData.title, formData.work_preference]
      );

      onComplete();
    } catch (err) {
      console.error("Onboarding Hatası:", err);
      alert("Bir hata oluştu ama profilin kaydedilmiş olabilir.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col font-sans overflow-y-auto">
      {/* Üst Header / Progress */}
      <div className="sticky top-0 w-full bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Rocket size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl italic text-slate-900">KARIYEER<span className="text-orange-500">UP</span></span>
          </div>
          <div className="flex gap-1">
            {[1, 2].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-500' : 'bg-slate-100'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-10 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Adım 01 / Hedef Belirleme</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                  Kariyer yolculuğun <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">burada başlıyor.</span>
                </h1>
                <p className="text-slate-500 font-medium text-lg italic">Seni en doğru işlerle eşleştirmemiz için hedefini söyle.</p>
              </div>

              <div className="space-y-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-400 mb-3 uppercase tracking-tighter group-focus-within:text-orange-500 transition-colors">
                    <Briefcase size={16} /> Hedeflediğin Rol
                  </label>
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Örn: Full Stack Developer, Pazarlama Müdürü..."
                    className="w-full text-xl md:text-2xl p-6 bg-slate-50 border-b-4 border-slate-100 focus:border-orange-500 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-200 rounded-2xl"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-400 mb-4 uppercase tracking-tighter block">Çalışma Tercihin</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Ofis', 'Hibrit', 'Uzaktan'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setFormData({...formData, work_preference: m.toLowerCase()})}
                        className={`group relative p-6 rounded-3xl border-2 transition-all text-left overflow-hidden ${
                          formData.work_preference === m.toLowerCase() 
                          ? 'border-orange-500 bg-orange-50/50 shadow-xl shadow-orange-100' 
                          : 'border-slate-100 hover:border-orange-200'
                        }`}
                      >
                        <div className={`font-black text-lg transition-colors ${formData.work_preference === m.toLowerCase() ? 'text-orange-600' : 'text-slate-400'}`}>{m}</div>
                        {formData.work_preference === m.toLowerCase() && <CheckCircle2 className="absolute top-4 right-4 text-orange-500" size={20} />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!formData.title}
                  onClick={() => setStep(2)}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-orange-500 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:bg-slate-900 disabled:hover:translate-y-0"
                >
                  Devam Et <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-10 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Adım 02 / Karakter Analizi</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 text-balance">
                  Yapay Zeka seni <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 text-italic italic">tanımak istiyor.</span>
                </h1>
                <p className="text-slate-500 font-medium text-lg italic">Güçlü yanlarından ve çalışma kültüründen bahset.</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute -top-3 -right-3 p-3 bg-amber-100 text-amber-600 rounded-2xl animate-pulse">
                    <Sparkles size={20} />
                  </div>
                  <textarea 
                    rows={6}
                    autoFocus
                    placeholder="Örn: Problemleri analitik çözerim, startup dinamiklerine hakimim ve hızlı öğrenirim..."
                    className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-orange-500 focus:bg-white outline-none transition-all font-medium text-lg leading-relaxed shadow-inner"
                    value={formData.personality_intro}
                    onChange={(e) => setFormData({...formData, personality_intro: e.target.value})}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <button onClick={() => setStep(1)} className="w-full md:w-auto px-10 py-6 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-400 hover:bg-slate-50 transition-colors">Geri</button>
                  <button 
                    disabled={loading || !formData.personality_intro}
                    onClick={handleFinalSubmit}
                    className="w-full flex-1 py-6 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Analiz Ediliyor...
                      </div>
                    ) : 'Kariyerimi Başlat ✨'}
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-300">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white" />)}
                   </div>
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-400 italic">500+ Aday Yapay Zeka ile Eşleşti</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
