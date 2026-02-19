// src/pages/MyInterviews.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon } from "lucide-react"; // Calendar alias eklendi

export default function MyInterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Mülakatları Çek
    async function loadInterviews() {
      const { data } = await supabase
        .from("interviews")
        .select("*, jobs(position, company_id)")
        .eq("candidate_id", user.id)
        .order("scheduled_at", { ascending: true });
      setInterviews(data || []);
    }

    loadInterviews();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === ORTA ALAN: MÜLAKAT LİSTESİ === */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Video className="text-red-500" /> Mülakatlarım
          </h2>

          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                <Video className="w-10 h-10 mx-auto text-gray-200 mb-2" />
                <p className="text-gray-500">Planlanmış mülakatınız yok.</p>
              </div>
            ) : (
              interviews.map(inv => (
                <Card key={inv.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{inv.jobs?.position || "Pozisyon"}</h3>
                        <p className="text-sm text-gray-500">Online Görüşme</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {new Date(inv.scheduled_at).toLocaleDateString("tr-TR")}
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          {new Date(inv.scheduled_at).toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    
                    {inv.meeting_link && (
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white gap-2">
                        <Video size={16} /> Görüşmeye Katıl
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* === SAĞ ALAN: MİNİ TAKVİM WIDGET === */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border border-gray-200 sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-orange-500" /> Takvim Özeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 text-center text-xs text-gray-500">
                Takvim entegrasyonu aktif.
                <br />
                Tüm mülakatlarınız burada işaretlenir.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
