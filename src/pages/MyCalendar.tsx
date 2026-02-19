// src/pages/MyCalendar.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalIcon, Video, Users } from "lucide-react";

export default function MyCalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      // 1. Mülakatlar
      const { data: interviews } = await supabase
        .from("interviews")
        .select("*")
        .eq("candidate_id", user.id);

      // 2. Koç Seansları
      const { data: sessions } = await supabase
        .from("app_2dff6511da_sessions")
        .select("*, coach:app_2dff6511da_coaches(full_name)")
        .eq("client_id", user.id);

      // Verileri birleştir
      const list = [
        ...(interviews || []).map(i => ({
          id: i.id,
          type: "interview",
          title: "İş Mülakatı",
          date: i.scheduled_at,
          desc: i.meeting_link ? "Online Görüşme" : "Planlandı"
        })),
        ...(sessions || []).map(s => ({
          id: s.id,
          type: "session",
          title: `${s.coach?.full_name} ile Seans`,
          date: s.session_date,
          desc: "Kariyer Koçluğu"
        }))
      ];

      // Tarihe göre sırala
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(list);
    }
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalIcon className="text-orange-600" />
          Takvimim
        </h1>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-500">Planlanmış bir etkinliğiniz yok.</p>
          ) : (
            events.map((e) => (
              <Card key={e.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {e.type === 'interview' ? <Video size={20} className="text-blue-500"/> : <Users size={20} className="text-purple-500"/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{e.title}</h3>
                      <p className="text-xs text-gray-500">{e.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{new Date(e.date).toLocaleDateString("tr-TR")}</div>
                    <div className="text-xs text-gray-500">{new Date(e.date).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
