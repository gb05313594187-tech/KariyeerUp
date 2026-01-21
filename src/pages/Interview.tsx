import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MeetingRoom from '../components/MeetingRoom';
import { supabase } from '../lib/supabase'; // Supabase bağlantın

export default function InterviewPage() {
  const { roomName } = useParams(); 
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Veritabanından o odaya ait AI sorularını çek
    const fetchInterviewData = async () => {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('interview_questions')
          .eq('meeting_link', roomName)
          .single();

        if (data) {
          setQuestions(data.interview_questions);
        }
      } catch (err) {
        console.error("Sorular yüklenirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roomName) fetchInterviewData();
  }, [roomName]);

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* SOL TARAF: CANLI VİDEO ODASI */}
      <div className="flex-1 relative h-full">
        <MeetingRoom roomName={roomName} displayName="Katılımcı" />
      </div>
      
      {/* SAĞ TARAF: AI MÜLAKAT ASİSTANI PANELİ */}
      <div className="w-full md:w-80 bg-slate-800 border-l border-slate-700 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            AI Mülakat Rehberi
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="text-slate-500 text-xs font-bold animate-pulse">Sorular hazırlanıyor...</div>
          ) : (
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {questions || "Bu görüşme için henüz AI sorusu oluşturulmamış."}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/50">
           <p className="text-[10px] text-slate-500 text-center font-bold">
             Kariyeer Intelligence © 2026
           </p>
        </div>
      </div>
    </div>
  );
}
