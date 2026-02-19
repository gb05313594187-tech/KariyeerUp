// src/pages/MyAssessments.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Brain, BarChart3 } from "lucide-react";

interface Assessment {
  language: string;
  summary: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  created_at: string;
}

function scoreToPercent(v: number | null | undefined) {
  if (v == null) return 0;
  // 0–1 aralığında varsayıyoruz, yüzdeye çevir
  const p = Math.round(Number(v) * 100);
  return Math.min(100, Math.max(0, p));
}

export default function MyAssessmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!user || authLoading) return;
    loadAssessments();
  }, [user, authLoading]);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const userId = user.id;

      const { data, error } = await supabase
        .from("personality_ai_summaries")
        .select(
          "language, summary, openness, conscientiousness, extraversion, agreeableness, neuroticism, created_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("personality_ai_summaries error:", error);
        setAssessments([]);
      } else {
        setAssessments(data || []);
      }
    } catch (e) {
      console.error("loadAssessments error:", e);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
        Kişilik envanteri raporlarını görmek için giriş yapmalısınız.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Kişilik Envanteri Raporlarım
            </h1>
            <p className="text-xs text-gray-500">
              Tamamladığınız envanterlerin AI özetlerini ve skorlarını burada
              görebilirsiniz.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {loading && (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-red-600" />
          </div>
        )}

        {!loading && assessments.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            Henüz kayıtlı bir kişilik envanteri raporunuz yok.
          </div>
        )}

        {!loading &&
          assessments.map((a, idx) => {
            const created = new Date(a.created_at);
            const dateStr = created.toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const timeStr = created.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const bars = [
              { key: "openness", label: "Açıklık", value: a.openness },
              {
                key: "conscientiousness",
                label: "Sorumluluk",
                value: a.conscientiousness,
              },
              { key: "extraversion", label: "Dışadönüklük", value: a.extraversion },
              { key: "agreeableness", label: "Uyumluluk", value: a.agreeableness },
              {
                key: "neuroticism",
                label: "Duygusal Dalgalanma",
                value: a.neuroticism,
              },
            ];

            return (
              <Card key={idx} className="bg-white border border-gray-200">
                <CardHeader className="pb-2 flex flex-row items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                      Envanter Raporu #{idx + 1}
                    </CardTitle>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {dateStr} · {timeStr} · Dil:{" "}
                      <span className="uppercase font-semibold">
                        {a.language || "tr"}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-sm text-gray-700">
                  {/* Summary */}
                  <div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {a.summary}
                    </p>
                  </div>

                  {/* Scores */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Boyut Skorları
                    </div>
                    <div className="space-y-2">
                      {bars.map((b) => {
                        const percent = scoreToPercent(b.value);
                        return (
                          <div key={b.key} className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-600">
                              <span>{b.label}</span>
                              <span className="font-semibold">{percent}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </main>
    </div>
  );
}
