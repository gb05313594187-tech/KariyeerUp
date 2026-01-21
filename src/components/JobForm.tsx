// src/components/JobForm.tsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { 
  X, MapPin, Rocket, Briefcase, Sparkles, Loader2, 
  Target, Lightbulb, Languages, HelpCircle, CheckCircle2,
  BrainCircuit, LayoutPanelLeft, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JobForm({ isOpen, onClose }) {
  // --- STATE YÖNETİMİ ---
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  useEffect(() => {
    if (isOpen && !window.puter) console.log("Puter.js bekleniyor...");
  }, [isOpen]);

  if (!isOpen) return null;

  // --- AI FONKSİYONLARI (MEVCUT MANTIK KORUNDU) ---
  
  const suggestSkills = async () => {
    if (!jobTitle || !window.puter) return;
    try {
      const resp = await puter.ai.chat(
        `${jobTitle} pozisyonu için en kritik 5 teknik yeteneği sadece virgülle ayırarak yaz.`, 
        { model: 'gemini-3-flash-preview' }
      );
      const text = typeof resp === 'string' ? resp : (resp?.text || "");
      setSuggestedSkills(text.split(",").map(s => s.trim()));
    } catch (e) { console.error(e); }
  };

  const generateWithAI = async (lang = "Türkçe") => {
    if (!jobTitle || !window.puter) return;
    setIsGenerating(true);
    try {
      const prompt = `${jobTitle} pozisyonu için ${location || 'uzaktan çalışma'} lokasyonunda ${lang} dilinde, profesyonel bir iş ilanı yaz. Markdown kullan.`;
      const response = await puter.ai.chat(prompt, { model: 'gemini-3-flash-preview' });
      setDescription(typeof response === 'string' ? response : (response?.text || ""));
      toast.success("İlan içeriği üretildi!");
    } catch (error) { toast.error("AI Hatası"); }
    finally { setIsGenerating(false); }
  };

  const generateQuestions = async () => {
    if (!jobTitle || !window.puter) return;
    setIsGeneratingQuestions(true);
    try {
      const prompt = `${jobTitle} pozisyonu için mülakatta sorulacak en kritik 5 teknik soruyu liste olarak hazırla.`;
      const response = await puter.ai.chat(prompt, { model: 'gemini-3-flash-preview' });
      setInterviewQuestions(typeof response === 'string' ? response : (response?.text || ""));
      setCurrentStep(3); // Sorular hazır olunca otomatik 3. adıma geç
    } catch (error) { toast.error("Soru üretim hatası"); }
    finally { setIsGeneratingQuestions(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* MODAL HEADER & PROGRESS */}
        <div className="px-12 py-8 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-12">
            <StepItem step={1} current={currentStep} label="Tanımlama" />
            <StepItem step={2} current={currentStep} label="AI İçerik" />
            <StepItem step={3} current={currentStep} label="Mülakat Stratejisi" />
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-slate-100 transition-all group">
            <X className="h-6 w-6 text-slate-400 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* SOL PANEL: FORM AKIŞI */}
          <div className="w-full md:w-3/5 p-12 overflow-y-auto custom-scrollbar space-y-10 border-r bg-white">
            
            {/* ADIM 1: TEMEL BİLGİLER */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in slide-in-from-left duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kimi arıyorsunuz?</h2>
                  <p className="text-slate-500 font-medium italic">Temel bilgileri girin, gerisini AI halletsin.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pozisyon Başlığı</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-red-500 transition-colors" />
                      <input 
                        onBlur={suggestSkills}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full pl-12 pr-6 py-5 rounded-[24px] border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-slate-800" 
                        placeholder="Örn: Senior Product Designer" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Çalışma Lokasyonu</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-red-500 transition-colors" />
                      <input 
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-12 pr-6 py-5 rounded-[24px] border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-slate-800" 
                        placeholder="Örn: Remote / London" 
                      />
                    </div>
                  </div>
                </div>

                {suggestedSkills.length > 0 && (
                  <div className="p-6 bg-slate-50 rounded-[32px] space-y-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-indigo-500" /> Önerilen Yetkinlikler
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 shadow-sm hover:border-red-200 transition-colors cursor-pointer">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button onClick={() => setCurrentStep(2)} className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-red-600 transition-all group">
                  İçeriği Hazırla <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* ADIM 2: AI İÇERİK TASARIMI */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">İş Tanımı Üretimi</h2>
                    <p className="text-sm text-slate-500">AI sizin için profesyonel bir metin hazırlar.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => generateWithAI("İngilizce")} className="h-10 rounded-xl font-bold border-slate-200">EN</Button>
                    <Button onClick={() => generateWithAI("Türkçe")} className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
                      {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />} AI YAZDIR
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-8 rounded-[32px] bg-slate-50 border-2 border-transparent focus:border-red-500 min-h-[400px] outline-none transition-all font-medium text-slate-700 leading-relaxed resize-none"
                    placeholder="AI ile sihirli bir dokunuş yapın veya kendiniz yazın..."
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[32px] flex flex-col items-center justify-center">
                      <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
                      <p className="font-black text-red-600 animate-pulse uppercase tracking-widest text-xs">Gemini Yazıyor...</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)} className="h-14 flex-1 rounded-2xl font-bold uppercase text-xs tracking-widest"><ArrowLeft className="mr-2" /> Geri</Button>
                  <Button onClick={generateQuestions} disabled={isGeneratingQuestions} className="h-14 flex-[2] bg-red-600 hover:bg-red-700 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100">
                    Mülakat Sorularını Üret
                  </Button>
                </div>
              </div>
            )}

            {/* ADIM 3: MÜLAKAT KURGUSU */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center py-10">
                <div className="w-20 h-20 bg-amber-100 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                  <BrainCircuit className="h-10 w-10 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900">Mülakat Stratejisi Hazır</h2>
                  <p className="text-slate-500 px-10">Gemini, {jobTitle} pozisyonu için en kritik soruları hazırladı. Bu sorular AI mülakat odasında kullanılacaktır.</p>
                </div>
                
                <div className="max-w-md mx-auto p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium italic">
                    {interviewQuestions || "Sorular yükleniyor..."}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)} className="h-14 flex-1 rounded-2xl font-bold uppercase text-xs tracking-widest">Düzenle</Button>
                  <Button className="h-14 flex-[2] bg-green-600 hover:bg-green-700 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-100">
                    İlanı Yayına Al <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ PANEL: CANLI ÖNİZLEME (PREVIEW) */}
          <div className="hidden md:flex w-2/5 bg-slate-50 p-12 flex-col gap-8 overflow-y-auto">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <LayoutPanelLeft className="h-4 w-4" /> Canlı Önizleme
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col min-h-[600px] animate-in fade-in duration-1000">
              {/* Şirket Banner */}
              <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800 p-8 flex items-end">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border-4 border-white translate-y-8 flex items-center justify-center">
                  <Briefcase className="text-slate-900" size={24} />
                </div>
              </div>

              <div className="p-8 pt-12 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {jobTitle || "İlan Başlığı"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-red-500 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={12} /> {location || "Lokasyon"}
                  </div>
                </div>

                <div className="h-[2px] w-full bg-slate-50" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                    <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-10 font-medium">
                    {description || "İş tanımı oluşturulduğunda burada görünecek..."}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto p-8 border-t border-slate-50 bg-slate-50/50">
                <div className="h-10 w-full bg-slate-900 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---

function StepItem({ step, current, label }) {
  const isActive = current >= step;
  const isPast = current > step;
  return (
    <div className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
        isPast ? 'bg-green-500 text-white' : 
        isActive ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-slate-100 text-slate-400'
      }`}>
        {isPast ? <CheckCircle2 size={20} /> : step}
      </div>
      <div className="hidden lg:block">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ADIM {step}</p>
        <p className={`text-xs font-bold uppercase tracking-tighter ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
      </div>
    </div>
  );
}
