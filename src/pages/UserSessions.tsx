// src/pages/UserSessions.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Video, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const SESSIONS_TABLE = "app_2dff6511da_sessions";

export default function UserSessions() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data: auth } = await supabase.auth.getUser();
        const user = auth?.user;
        if (!user) {
          toast.error("Giriş yapmalısın.");
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from(SESSIONS_TABLE)
          .select("*")
          .eq("user_id", user.id)
          .order("scheduled_start", { ascending: true });

        if (error) {
          console.error(error);
          toast.error("Seanslar yüklenemedi.");
          return;
        }

        setRows(data || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [navigate]);

  const now = useMemo(() => new Date().getTime(), []);

  const upcoming = useMemo(
    () => (rows || []).filter((r) => new Date(r.scheduled_start).getTime() >= now && r.status === "scheduled"),
    [rows, now]
  );

  const past = useMemo(
    () => (rows || []).filter((r) => new Date(r.scheduled_start).getTime() < now || r.status !== "scheduled"),
    [rows, now]
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold">Seanslarım</h1>
        </div>

        {loading && <div className="text-sm text-gray-500">Yükleniyor...</div>}

        {!loading && (
          <>
            <div className="text-sm font-bold mb-3">Yaklaşan</div>
            {upcoming.length === 0 ? (
              <div className="text-sm text-gray-500">Yaklaşan seans yok.</div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((s) => (
                  <Card key={s.id} className="border border-gray-200">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          {new Date(s.scheduled_start).toLocaleString("tr-TR")}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {s.duration_min || 45} dk · Durum: {s.status}
                        </div>
                      </div>

                      <Link to={`/session/${s.id}/room`}>
                        <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                          <Video className="w-4 h-4 mr-1" />
                          Odaya Git
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-sm font-bold mt-8 mb-3">Geçmiş</div>
            {past.length === 0 ? (
              <div className="text-sm text-gray-500">Geçmiş seans yok.</div>
            ) : (
              <div className="space-y-3">
                {past.map((s) => (
                  <Card key={s.id} className="border border-gray-200">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          {new Date(s.scheduled_start).toLocaleString("tr-TR")}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {s.duration_min || 45} dk · Durum: {s.status}
                        </div>
                      </div>

                      {s.meeting_url ? (
                        <Link to={`/session/${s.id}/room`}>
                          <Button variant="outline" className="rounded-xl">
                            <Video className="w-4 h-4 mr-1" />
                            Link
                          </Button>
                        </Link>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
