// src/pages/Interview.tsx
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MeetingRoom from '../components/MeetingRoom';
import { 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Timer, 
  AlertCircle,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function InterviewPage() {
  const { roomName } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewData, setInterviewData] = useState<any>(null);

  useEffect(() => {
    const fetchInterviewData = async () => {
      setLoading(true);
      try {
        // Değerlendirme seansı verilerini çekiyoruz
        const { data, error } = await supabase
          .from('interviews')
          .select('*, candidates(full_name)')
          .eq('meeting_link', roomName)
          .single();

        if (error) throw error;

        if (data) {
          setInterviewData(data);
          setQuestions(data.interview_questions || []);
        }
      } catch (err: any) {
        toast.error("Seans verisi alınamadı: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (roomName) fetchInterviewData();
  }, [roomName]);

  const progress = questions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
    : 0;

  const handleFinishInterview = async () => {
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('meeting_link', roomName);

      if (error) throw error;

      toast.success("Değerlendirme seansı tamamlandı. Gelişim raporu oluşturuluyor...");
      setTimeout(() => navigate('/corporate'), 2000);
    } catch (err: any) {
      toast.error("Hata: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Gelişim Odası Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sol Taraf: Video Konferans Alanı */}
      <div className="flex-1 relative bg-black">
        <MeetingRoom roomName={roomName} displayName="Katılımcı" />
        
        {/* Üst Bilgi Barı */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="text-white text-xs font-bold tracking-tight uppercase">Gelişim & Değerlendirme Odası</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-2xl">
            <span className="text-slate-300 text-xs font-medium">Katılımcı: {interviewData?.candidates?.full_name || "Bilinmiyor"}</span>
          </div>
        </div>
      </div>

      {/* Sağ Taraf: AI Mentor Rehberi Paneli */}
      <div className="w-full md:w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
        
        {/* Panel Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-white font-black text-lg tracking-tight">Mentor Rehberi</h2>
            </div>
            <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-1 rounded-md uppercase">AI ANALİZ v2.0</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span>Seans İlerlemesi</span>
              <span>%{progress}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Soru Alanı */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {questions.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Timer size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Vaka Analizi Sorusu {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 shadow-inner">
                <p className="text-white text-base font-medium leading-relaxed italic">
                  "{questions[currentQuestionIndex]}"
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
                <AlertCircle className="text-blue-500 shrink-0" size={18} />
                <p className="text-[11px] text-slate-400 leading-normal">
                  <b>AI Mentor Notu:</b> Katılımcının bu soruya verdiği cevabı, kariyer hedefleriyle ne kadar örtüştüğünü ölçmek için kullanın.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <LayoutDashboard className="text-slate-700" size={48} />
              <p className="text-slate-500 text-sm">Bu seans için değerlendirme sorusu atanmamış.</p>
            </div>
          )}
        </div>

        {/* Panel Footer: Aksiyon Butonları */}
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 space-y-3">
          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="w-full py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Sıradaki Konuya Geç <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleFinishInterview}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-900/20"
            >
              Seansı Tamamla <CheckCircle2 size={16} />
            </button>
          )}
          
          <button 
            onClick={() => navigate('/corporate')}
            className="w-full py-3 bg-transparent hover:bg-slate-800 text-slate-500 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            Seans Odasından Ayrıl
          </button>
        </div>
      </div>
    </div>
  );
}
