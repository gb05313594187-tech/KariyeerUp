// src/pages/PersonalityTest.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Brain, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const questions = [
  { id: 1, text: "Yeni insanlarla tanışmaktan hoşlanırım", trait: "extraversion" },
  { id: 2, text: "Planlı ve organize çalışmayı tercih ederim", trait: "conscientiousness" },
  { id: 3, text: "Genelde sakin ve stressiz hissederim", trait: "neuroticism", reverse: true },
  { id: 4, text: "Başkalarının duygularını kolayca anlarım", trait: "agreeableness" },
  { id: 5, text: "Yeni fikirlere ve deneyimlere açığım", trait: "openness" },
  { id: 6, text: "Detaylara dikkat ederim", trait: "conscientiousness" },
  { id: 7, text: "Parti ve kalabalık ortamları severim", trait: "extraversion" },
  { id: 8, text: "Kolayca endişelenirim", trait: "neuroticism", reverse: true },
  { id: 9, text: "Sanat ve müzikle ilgilenirim", trait: "openness" },
  { id: 10, text: "Başkalarına yardım etmekten mutluluk duyarım", trait: "agreeableness" },
];

export default function PersonalityTest() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast.error("Giriş yapmalısınız");

      // Cevapları kaydet
      const answersToInsert = Object.entries(answers).map(([qid, score]) => ({
        user_id: user.id,
        question_id: Number(qid),
        answer_score: score,
      }));

      await supabase.from("personality_answers").upsert(answersToInsert, { onConflict: "user_id,question_id" });

      // AI analizi tetikle (edge function yoksa direkt burada basit hesaplama)
      const scores = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0,
      };

      questions.forEach(q => {
        const ans = answers[q.id];
        if (ans) {
          const score = q.reverse ? 6 - ans : ans;
          scores[q.trait as keyof typeof scores] += score;
        }
      });

      const summary = `Sen yüksek dışa dönüklük ve vicdanlılık gösteriyorsun. 
      ${scores.extraversion > 8 ? "Sosyal ortamlarda parlıyorsun!" : "Daha sakin ve derin ilişkileri tercih ediyorsun."}
      ${scores.conscientiousness > 8 ? "Hedeflerine disiplinle ulaşıyorsun." : "Esnek ve yaratıcı yaklaşıyorsun."}
      ${scores.openness > 8 ? "Yeni deneyimlere çok açıksın!" : "Güvenilir ve geleneksel yapıda enerji buluyorsun."}`;

      const resultData = {
        user_id: user.id,
        language: "tr",
        summary,
        openness: Math.round((scores.openness / 10) * 100),
        conscientiousness: Math.round((scores.conscientiousness / 12) * 100),
        extraversion: Math.round((scores.extraversion / 10) * 100),
        agreeableness: Math.round((scores.agreeableness / 10) * 100),
        neuroticism: 100 - Math.round((scores.neuroticism / 10) * 100),
      };

      await supabase.from("personality_ai_summaries").upsert(resultData, { onConflict: "user_id" });

      setResult(resultData);
      toast.success("Kişilik analizin hazır! 🎉");
    } catch (err) {
      toast.error("Test tamamlanamadı");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg">
              <Brain className="w-10 h-10" />
              Kişilik Analizin Hazır!
            </div>
          </div>

          <Card className="p-10 rounded-3xl shadow-xl border-red-200">
            <div className="text-center mb-8">
              <Sparkles className="w-20 h-20 mx-auto text-red-600 mb-4" />
              <p className="text-xl text-gray-700 leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {Object.entries({
                Açıklık: result.openness,
                Sorumluluk: result.conscientiousness,
                Dışa Dönüklük: result.extraversion,
                Uyumluluk: result.agreeableness,
                Duygusal Dengesizlik: result.neuroticism,
              }).map(([trait, score]) => (
                <div key={trait} className="text-center">
                  <p className="font-semibold text-gray-700 mb-2">{trait}</p>
                  <div className="text-4xl font-bold text-red-600">{score}%</div>
                  <Progress value={score} className="mt-3 h-4 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Kişilik Envanteri</h1>
          <p className="text-gray-600 text-lg">10 soruda seni tanıyalım</p>
        </div>

        <Card className="p-10 rounded-3xl shadow-xl">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Soru {step + 1} / {questions.length}</span>
              <span>%{Math.round(progress)}</span>
            </div>
            <Progress value={progress} className="h-3 rounded-full" />
          </div>

          <div className="text-center mb-10">
            <p className="text-2xl font-medium text-gray-800 leading-relaxed">
              {current.text}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {["Hiç Katılmıyorum", "", "Nötr", "", "Tamamen Katılıyorum"].map((label, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(i + 1)}
                disabled={loading}
                variant={answers[current.id] === i + 1 ? "default" : "outline"}
                className={`h-20 rounded-2xl transition-all ${answers[current.id] === i + 1 ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
              >
                {i + 1}
                {label && <span className="block text-xs mt-1">{label}</span>}
              </Button>
            ))}
          </div>

          {loading && (
            <div className="text-center mt-10">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-red-600" />
              <p className="mt-4 text-gray-600">AI analizini hazırlıyor...</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
