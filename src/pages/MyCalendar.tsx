// src/pages/MyCalendar.tsx
// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Video, Users, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

// --- TAKVİM YARDIMCILARI ---
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Pzt=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  // Boşluklar
  for (let i = 0; i < startDay; i++) days.push(null);
  // Günler
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  
  return days;
};

export default function MyCalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      // 1. Mülakatlar
      const { data: interviews } = await supabase
        .from("interviews")
        .select("*, jobs(position, company_id)")
        .eq("candidate_id", user.id);

      // 2. Koç Seansları
      const { data: sessions } = await supabase
        .from("app_2dff6511da_sessions")
        .select("*, coach:app_2dff6511da_coaches(full_name)")
        .eq("client_id", user.id);

      // Birleştir
      const list = [
        ...(interviews || []).map(i => ({
          id: i.id,
          type: "interview",
          title: `Mülakat: ${i.jobs?.position || "Pozisyon"}`,
          date: new Date(i.scheduled_at),
          desc: "Online Görüşme",
          link: i.meeting_link
        })),
        ...(sessions || []).map(s => ({
          id: s.id,
          type: "session",
          title: `Seans: ${s.coach?.full_name}`,
          date: new Date(s.session_date),
          desc: "Kariyer Koçluğu"
        }))
      ];

      list.sort((a, b) => a.date - b.date);
      setEvents(list);
    }
    loadData();
  }, [user]);

  // Takvim Navigasyonu
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const calendarDays = useMemo(() => generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

  const monthName = currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  // Seçili güne ait etkinlikler
  const selectedEvents = events.filter(e => 
    e.date.getDate() === selectedDate.getDate() &&
    e.date.getMonth() === selectedDate.getMonth() &&
    e.date.getFullYear() === selectedDate.getFullYear()
  );

  // Etkinlik var mı kontrolü (nokta koymak için)
  const hasEvent = (day: Date) => {
    return events.some(e => 
      e.date.getDate() === day.getDate() &&
      e.date.getMonth() === day.getMonth() &&
      e.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* === SOL / ORTA: AJANDA LİSTESİ === */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <CalendarIcon className="text-orange-600" />
            Programım
          </h1>
          <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">
            {selectedDate.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', weekday: 'long' })}
          </span>
        </div>

        {selectedEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-semibold">Bugün için plan yok</h3>
            <p className="text-sm text-gray-500 mt-1">Takvimden başka bir gün seçebilirsin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedEvents.map((e) => (
              <Card key={e.id} className={`border-l-4 ${e.type === 'interview' ? 'border-l-red-500' : 'border-l-purple-500'} shadow-sm hover:shadow-md transition-all`}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${e.type === 'interview' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
                      {e.type === 'interview' ? <Video size={24} /> : <Users size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{e.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Clock size={14}/> {e.date.toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}</span>
                        <span className="flex items-center gap-1"><MapPin size={14}/> Online</span>
                      </div>
                    </div>
                  </div>
                  {e.link && (
                    <Button size="sm" className="bg-gray-900 text-white" onClick={() => window.open(e.link, '_blank')}>
                      Katıl
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tüm Yaklaşan Etkinlikler (Özet) */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Sıradaki Etkinlikler</h3>
          <div className="grid gap-3">
            {events.filter(e => e.date > new Date()).slice(0, 3).map(e => (
              <div key={e.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
                <div className="font-medium">{e.title}</div>
                <div className="text-gray-500">{e.date.toLocaleDateString("tr-TR")}</div>
              </div>
            ))}
            {events.filter(e => e.date > new Date()).length === 0 && (
              <div className="text-sm text-gray-400 italic">Yaklaşan başka etkinlik yok.</div>
            )}
          </div>
        </div>
      </div>

      {/* === SAĞ SÜTUN: TAKVİM WIDGET === */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="bg-white border border-gray-200 shadow-sm sticky top-6">
          <CardHeader className="pb-2 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 capitalize">{monthName}</span>
              <div className="flex gap-1">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={18}/></button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={18}/></button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Gün İsimleri */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-2">
              {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map(d => <div key={d}>{d}</div>)}
            </div>
            
            {/* Günler */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((d, i) => {
                if (!d) return <div key={i} className="h-9"></div>;
                
                const isSelected = d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                const dayHasEvent = hasEvent(d);

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d)}
                    className={`
                      h-9 rounded-lg flex flex-col items-center justify-center relative text-sm font-medium transition-all
                      ${isSelected ? "bg-gray-900 text-white shadow-md" : "hover:bg-gray-100 text-gray-700"}
                      ${isToday && !isSelected ? "bg-orange-50 text-orange-600 border border-orange-200" : ""}
                    `}
                  >
                    {d.getDate()}
                    {dayHasEvent && (
                      <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? "bg-orange-400" : "bg-red-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
