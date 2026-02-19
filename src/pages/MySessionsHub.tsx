// src/pages/MySessionsHub.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Clock, Star, MessageSquare } from "lucide-react";

export default function MySessionsHubPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [myCoaches, setMyCoaches] = useState([]);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      // 1. Seanslar
      const { data: sessData } = await supabase
        .from("app_2dff6511da_sessions")
        .select("*, coach:app_2dff6511da_coaches(*)")
        .eq("client_id", user.id)
        .order("session_date", { ascending: false });
      setSessions(sessData || []);

      // 2. Kayıtlı Koçlar (saved_items)
      const { data: coachData } = await supabase
        .from("saved_items")
        .select("item_id, coach:app_2dff6511da_coaches(*)")
        .eq("user_id", user.id)
        .eq("item_type", "coach");
      
      setMyCoaches(coachData?.map(c => c.coach).filter(Boolean) || []);
    }
    loadData();
  }, [user]);

  const upcomingSessions = sessions.filter(s => new Date(s.session_date) > new Date());
  const completedSessions = sessions.filter(s => new Date(s.session_date) <= new Date());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Users className="text-purple-600" />
          Seanslarım
        </h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-xl border border-gray-200">
            <TabsTrigger value="upcoming">Gelecek Seanslar</TabsTrigger>
            <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
            <TabsTrigger value="coaches">Koçlarım</TabsTrigger>
            <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
          </TabsList>

          {/* Gelecek */}
          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {upcomingSessions.length === 0 && <div className="text-center py-10 text-gray-500">Planlanmış gelecek seans yok.</div>}
            {upcomingSessions.map(s => (
              <Card key={s.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{s.coach?.full_name}</h3>
                    <p className="text-sm text-gray-500">Kariyer Koçluğu</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold">{new Date(s.session_date).toLocaleDateString("tr-TR")}</div>
                    <div>{new Date(s.session_date).toLocaleTimeString("tr-TR", {hour:'2-digit', minute:'2-digit'})}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tamamlanan */}
          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedSessions.map(s => (
              <Card key={s.id} className="opacity-80">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{s.coach?.full_name}</h3>
                    <p className="text-xs text-gray-500">Tamamlandı</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(s.session_date).toLocaleDateString("tr-TR")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Koçlarım */}
          <TabsContent value="coaches" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCoaches.map(c => (
              <Card key={c.id}>
                <CardHeader className="flex flex-row gap-3 items-center pb-2">
                  <img src={c.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <CardTitle className="text-sm">{c.full_name}</CardTitle>
                    <div className="text-xs text-gray-500">{c.title}</div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          {/* Değerlendirmeler */}
          <TabsContent value="reviews" className="mt-4 text-center py-10 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            Henüz değerlendirme yapmadınız.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
