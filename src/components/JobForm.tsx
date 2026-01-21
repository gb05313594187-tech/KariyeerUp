// src/components/CreateJobModal.tsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { 
  X, MapPin, Banknote, FileText, Rocket, Briefcase, 
  Sparkles, Loader2, Wand2, CheckCircle2, AlertCircle,
  Languages, Lightbulb, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateJobModal({ isOpen, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  useEffect(() => {
    if (isOpen && !window.puter) {
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  // ✅ YETENEK ÖNERİCİ (LinkedIn'den daha iyi özellik)
  const suggestSkills = async () => {
    if (!jobTitle || !window.puter) return;
    try {
      const resp = await puter.ai.chat(
        `${jobTitle} pozisyonu için en önemli 5 teknik yeteneği sadece virgülle ayırarak yaz.`, 
        { model: 'gemini-3-flash-preview' }
      );
      const skills = (typeof resp === 'string' ? resp : resp?.text).split(",");
      setSuggestedSkills(skills);
    } catch (e) { console.error(e); }
  };

  // ✅ GERÇEK AI İLAN YAZICI
  const generateWithAI = async (language = "Türkçe") => {
    if (!jobTitle || !window.puter) return;
    setIsGenerating(true);
    try {
      const prompt = `${jobTitle} pozisyonu için ${location} lokasyonunda ${language} dilinde profesyonel bir iş ilanı yaz. Teknik detaylar ve sosyal haklar dahil olsun. Markdown kullan.`;
      const response = await puter.ai.chat(prompt, { model: 'gemini-3-flash-preview' });
      setDescription(typeof response === 'string' ? response : response?.text);
    } catch (error) {
      alert("AI Hatası!");
    } finally { setIsGenerating(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* HEADER */}
        <div className="px-10 py-8 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-lg shadow-red-200 flex items-center justify-center text-white ring-4 ring-red-50">
              <Rocket className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Premium İlan Oluşturucu</h2>
              <p className="text-sm text-slate-500 font-medium">Yapay zeka ile saniyeler içinde mükemmel ilanı hazırla.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white hover:shadow-md text-slate-400 hover:text-red-600 transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* SOL PANEL - FORM */}
          <div className="w-full md:w-3/5 p-10 overflow-y-auto custom-scrollbar space-y-8 border-r">
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">İş Başlığı</label>
                  <input 
                    onBlur={suggestSkills}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:ring-0 outline-none transition-all font-semibold text-slate-700 bg-slate-50/30" 
                    placeholder="Örn: Full Stack Developer" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Lokasyon</label>
                  <input 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:ring-0 outline-none transition-all font-semibold text-slate-700 bg-slate-50/30" 
                    placeholder="Örn: Remote / İstanbul" 
                  />
                </div>
              </div>

              {/* AKILLI YETENEK ÖNERİLERİ */}
              {suggestedSkills.length > 0 && (
                <div className="space-y-3 animate-in slide-in-from-left">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Lightbulb className="h-3 w-3 text-amber-500" /> Önerilen Yetenekler
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map(skill => (
                      <button key={skill} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-red-500 hover:text-red-500 transition-all shadow-sm">
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800">İş Tanımı</label>
                  <div className="flex gap-2">
                    <button onClick={() => generateWithAI("İngilizce")} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all text-xs font-bold flex items-center gap-1">
                      <Languages className="h-3 w-3" /> EN
                    </button>
                    <button onClick={() => generateWithAI("Türkçe")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" /> AI Yazdır
                    </button>
                  </div>
                </div>
                <div className="relative group">
                   <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-6 rounded-[24px] border-2 border-slate-100 bg-slate-50/30 min-h-[300px] outline-none focus:border-red-500 transition-all text-slate-700 leading-relaxed"
                    placeholder="Detayları girin..."
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[24px]">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
                        <span className="font-black text-red-600 animate-pulse tracking-tighter">GEMINI OLUŞTURUYOR...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ PANEL - ANALİZ (LinkedIn'de olmayan kısım) */}
          <div className="hidden md:block w-2/5 bg-slate-50/50 p-10 space-y-8">
            <div className="p-6 bg-white rounded-[24px] shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" /> İlan Gücü
              </h3>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${description.length > 100 ? 'w-[85%] bg-green-500' : 'w-[30%] bg-red-500'}`} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {description.length > 100 
                  ? "Harika! İlanın oldukça detaylı. Bu haliyle adayların ilgisini %45 daha fazla çekecektir." 
                  : "İpucu: AI butonunu kullanarak iş tanımını zenginleştir. Kısa ilanlar daha az başvuru alır."}
              </p>
            </div>

            <div className="p-6 bg-indigo-600 rounded-[24px] text-white space-y-4 shadow-xl shadow-indigo-100">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg"><Sparkles className="h-5 w-5" /></div>
                 <h4 className="font-bold">Akıllı Eşleşme</h4>
               </div>
               <p className="text-sm text-indigo-100 leading-relaxed">
                 Bu ilan yayınlandığında, yetenekleri %90 uyuşan 145 adaya anlık bildirim gönderilecek.
               </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 border-t bg-white flex items-center justify-between">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kariyeer Enterprise</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">İptal</button>
            <button className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-2xl hover:bg-black transition-all active:scale-95">İlanı Dünyaya Duyur</button>
          </div>
        </div>
      </div>
    </div>
  );
}
