// src/components/JobForm.tsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { 
  X, MapPin, Banknote, FileText, Rocket, Briefcase, 
  Sparkles, Loader2, Wand2, Target, Lightbulb, Languages,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JobForm({ isOpen, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [description, setDescription] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  // Puter.js kontrolü
  useEffect(() => {
    if (isOpen && !window.puter) {
      console.log("Puter.js yükleniyor...");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ GERÇEK AI YETENEK ÖNERİCİ
  const suggestSkills = async () => {
    if (!jobTitle || !window.puter) return;
    try {
      const resp = await puter.ai.chat(
        `${jobTitle} pozisyonu için en kritik 5 teknik yeteneği sadece virgülle ayırarak yaz.`, 
        { model: 'gemini-3-flash-preview' }
      );
      const text = typeof resp === 'string' ? resp : (resp?.text || "");
      setSuggestedSkills(text.split(",").map(s => s.trim()));
    } catch (e) { console.error("Yetenek öneri hatası:", e); }
  };

  // ✅ GERÇEK AI İLAN YAZICI
  const generateWithAI = async (lang = "Türkçe") => {
    if (!jobTitle || !window.puter) return;
    setIsGenerating(true);
    try {
      const prompt = `${jobTitle} pozisyonu için ${location || 'uzaktan çalışma'} lokasyonunda ${lang} dilinde, profesyonel, ilgi çekici bir iş ilanı yaz. 'Nitelikler' ve 'Sunduklarımız' başlıkları olsun. Markdown kullan.`;
      const response = await puter.ai.chat(prompt, { model: 'gemini-3-flash-preview' });
      setDescription(typeof response === 'string' ? response : (response?.text || ""));
    } catch (error) {
      console.error("AI Hatası:", error);
    } finally { setIsGenerating(false); }
  };

  // ✅ GERÇEK AI MÜLAKAT SORULARI ÜRETİCİ
  const generateQuestions = async () => {
    if (!jobTitle || !window.puter) return;
    setIsGeneratingQuestions(true);
    try {
      const prompt = `${jobTitle} pozisyonu için mülakatta sorulacak en kritik 5 teknik ve 3 davranışsal soruyu hazırla.`;
      const response = await puter.ai.chat(prompt, { model: 'gemini-3-flash-preview' });
      setInterviewQuestions(typeof response === 'string' ? response : (response?.text || ""));
    } catch (error) {
      console.error(error);
    } finally { setIsGeneratingQuestions(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* HEADER */}
        <div className="px-10 py-7 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 shadow-lg shadow-red-100 flex items-center justify-center text-white">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">İlan Sihirbazı</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full mt-1">
                <Sparkles className="h-3 w-3" /> GEMINI 3 FLASH AKTİF
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-all text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* SOL: FORM GİRİŞİ */}
          <div className="w-full md:w-3/5 p-10 overflow-y-auto custom-scrollbar space-y-8 border-r">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">İş Başlığı</label>
                <input 
                  onBlur={suggestSkills}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                  placeholder="Örn: AI Engineer" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Lokasyon</label>
                <input 
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                  placeholder="Örn: Remote / İstanbul" 
                />
              </div>
            </div>

            {/* AI YETENEK BULUTU */}
            {suggestedSkills.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                  <Lightbulb className="h-3 w-3 text-amber-500" /> AI Yetenek Önerileri
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 shadow-sm uppercase tracking-tighter cursor-default hover:border-red-200 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">İş Tanımı</label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => generateWithAI("İngilizce")} className="h-8 text-[10px] font-bold border-slate-200 gap-1 rounded-xl uppercase">
                    <Languages className="h-3 w-3" /> EN
                  </Button>
                  <Button onClick={() => generateWithAI("Türkçe")} className="h-8 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 gap-1.5 rounded-xl uppercase tracking-wider shadow-lg shadow-indigo-100">
                    <Sparkles className="h-3 w-3" /> AI Oluştur
                  </Button>
                </div>
              </div>
              <div className="relative">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-6 rounded-[28px] border-2 border-slate-50 bg-slate-50/30 min-h-[320px] outline-none focus:border-red-500 transition-all font-medium text-slate-700 leading-relaxed resize-none"
                  placeholder="Buraya yazın veya AI ile sihirli bir dokunuş yapın..."
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-[28px]">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-2" />
                    <p className="text-indigo-600 font-black text-xs animate-pulse uppercase">Gemini Yazıyor...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SAĞ: ANALİZ PANELİ */}
          <div className="hidden md:flex w-2/5 bg-slate-50/50 p-10 flex-col gap-6 overflow-y-auto custom-scrollbar">
            
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4 text-red-600" /> İlan Kalitesi
              </h3>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${description.length > 50 ? 'w-[90%] bg-green-500' : 'w-[20%] bg-red-500'}`} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {description.length > 50 
                  ? "Harika! AI destekli ilanlar adaylar tarafından %70 daha fazla fark ediliyor." 
                  : "İpucu: AI butonuna basarak iş tanımını saniyeler içinde zenginleştirin."}
              </p>
            </div>

            {/* ✅ MÜLAKAT SORULARI ÜRETME BUTONU VE ALANI */}
            <div className="space-y-4">
                <Button 
                    onClick={generateQuestions} 
                    disabled={isGeneratingQuestions || !jobTitle}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl h-12 gap-2 shadow-lg shadow-amber-100 transition-all active:scale-95"
                >
                    {isGeneratingQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
                    MÜLAKAT SORULARI ÜRET
                </Button>

                {interviewQuestions && (
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3 animate-in slide-in-from-right duration-500">
                        <h4 className="text-[11px] font-black text-amber-700 uppercase flex items-center gap-2 font-black tracking-widest">
                            <Target className="h-4 w-4" /> Önerilen Mülakat Soruları
                        </h4>
                        <div className="text-[11px] text-amber-900 font-semibold leading-relaxed whitespace-pre-wrap bg-white/50 p-4 rounded-xl border border-amber-100/50">
                            {interviewQuestions}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">Tahmini Veri</p>
              <div className="text-center space-y-1">
                <p className="text-3xl font-black tracking-tighter text-red-500">140+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase italic">Potansiyel Aday</p>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 border-t bg-white flex items-center justify-end gap-4">
          <Button variant="ghost" onClick={onClose} className="font-bold text-slate-500 rounded-2xl h-12 px-8 uppercase text-xs tracking-widest">Vazgeç</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl h-12 px-12 shadow-xl shadow-red-100 uppercase text-xs tracking-widest active:scale-95 transition-all">
            Yayınla <Rocket className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
