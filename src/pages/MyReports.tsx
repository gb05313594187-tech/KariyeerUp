// src/pages/MyReports.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, BarChart3, FileText } from "lucide-react";

export default function MyReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!user) return;
    async function loadReports() {
      const { data } = await supabase
        .from("personality_ai_summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setReports(data || []);
    }
    loadReports();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <FileText className="text-indigo-600" />
          Raporlar & Kişilik Envanterleri
        </h1>

        {reports.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center border border-gray-200">
            <Brain className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Henüz oluşturulmuş bir raporunuz yok.</p>
          </div>
        ) : (
          reports.map((report, idx) => (
            <Card key={idx} className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-base flex justify-between">
                  <span>Kişilik Analiz Raporu</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(report.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {report.summary}
                </p>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { l: "Açıklık", v: report.openness },
                    { l: "Sorumluluk", v: report.conscientiousness },
                    { l: "Dışadönüklük", v: report.extraversion },
                    { l: "Uyumluluk", v: report.agreeableness },
                    { l: "Duygusal", v: report.neuroticism }
                  ].map(s => (
                    <div key={s.l} className="bg-indigo-50 p-2 rounded">
                      <div className="font-bold text-indigo-700">%{Math.round(s.v * 100)}</div>
                      <div className="text-[10px] text-gray-500">{s.l}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
