// src/pages/SavedItems.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Bookmark, Briefcase, User } from "lucide-react";

export default function SavedItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedCoaches, setSavedCoaches] = useState<any[]>([]);

  useEffect(() => {
    if (!user || authLoading) return;
    loadSaved();
  }, [user, authLoading]);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const userId = user.id;

      // 1) Kaydedilmiş ilanlar (job)
      // saved_items'tan item_id'leri çek
      const { data: jobSaved, error: jobSavedErr } = await supabase
        .from("saved_items")
        .select("item_id, created_at")
        .eq("user_id", userId)
        .eq("item_type", "job")
        .order("created_at", { ascending: false });

      if (jobSavedErr) {
        console.error("saved_items (jobs) error:", jobSavedErr);
      }

      let jobs: any[] = [];
      if (jobSaved && jobSaved.length > 0) {
        const ids = jobSaved.map((r) => r.item_id);
        const { data: jobRows, error: jobErr } = await supabase
          .from("jobs")
          .select("*")
          .in("post_id", ids);

        if (jobErr) {
          console.error("jobs fetch error:", jobErr);
        } else {
          // created_at'e göre sıralamak için join'li dizi oluştur
          jobs = jobSaved.map((s) => ({
            saved_at: s.created_at,
            job: jobRows.find((j) => j.post_id === s.item_id),
          })).filter((x) => x.job);
        }
      }
      setSavedJobs(jobs);

      // 2) Kaydedilmiş koçlar (coach)
      const { data: coachSaved, error: coachSavedErr } = await supabase
        .from("saved_items")
        .select("item_id, created_at")
        .eq("user_id", userId)
        .eq("item_type", "coach")
        .order("created_at", { ascending: false });

      if (coachSavedErr) {
        console.error("saved_items (coach) error:", coachSavedErr);
      }

      let coaches: any[] = [];
      if (coachSaved && coachSaved.length > 0) {
        const ids = coachSaved.map((r) => r.item_id);
        const { data: coachRows, error: coachErr } = await supabase
          .from("app_2dff6511da_coaches")
          .select("*")
          .in("id", ids);

        if (coachErr) {
          console.error("coaches fetch error:", coachErr);
        } else {
          coaches = coachSaved.map((s) => ({
            saved_at: s.created_at,
            coach: coachRows.find((c) => c.id === s.item_id),
          })).filter((x) => x.coach);
        }
      }
      setSavedCoaches(coaches);
    } catch (e) {
      console.error("loadSaved error:", e);
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
        Kaydedilenleri görmek için giriş yapmalısınız.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Kaydedilenlerim</h1>
            <p className="text-xs text-gray-500">
              Favori ilanlarınızı ve koçlarınızı burada görebilirsiniz.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList className="bg-white rounded-full border border-gray-200 p-1">
            <TabsTrigger value="jobs" className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              İlanlar
            </TabsTrigger>
            <TabsTrigger value="coaches" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Koçlar
            </TabsTrigger>
          </TabsList>

          {/* Kaydedilen İlanlar */}
          <TabsContent value="jobs">
            {loading && (
              <div className="py-10 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
              </div>
            )}

            {!loading && savedJobs.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-500">
                Henüz kaydedilmiş ilanınız yok.
              </div>
            )}

            <div className="space-y-3">
              {savedJobs.map((item) => {
                const j = item.job;
                return (
                  <Card key={j.post_id} className="bg-white border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold">
                        {j.position || "İlan"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-600 space-y-1">
                      {j.location_text && (
                        <div>
                          <span className="font-semibold">Lokasyon: </span>
                          {j.location_text}
                        </div>
                      )}
                      {j.level && (
                        <div>
                          <span className="font-semibold">Seviye: </span>
                          {j.level}
                        </div>
                      )}
                      {j.work_type && (
                        <div>
                          <span className="font-semibold">Çalışma Şekli: </span>
                          {j.work_type}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400">
                        Kaydedilme: {new Date(item.saved_at).toLocaleString("tr-TR")}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Kaydedilen Koçlar */}
          <TabsContent value="coaches">
            {loading && (
              <div className="py-10 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
              </div>
            )}

            {!loading && savedCoaches.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-500">
                Henüz kaydedilmiş koçunuz yok.
              </div>
            )}

            <div className="space-y-3">
              {savedCoaches.map((item) => {
                const c = item.coach;
                return (
                  <Card key={c.id} className="bg-white border border-gray-200">
                    <CardHeader className="pb-2 flex flex-row items-center gap-3">
                      {c.avatar_url && (
                        <img
                          src={c.avatar_url}
                          alt={c.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <CardTitle className="text-sm font-semibold">
                          {c.full_name}
                        </CardTitle>
                        <div className="text-[11px] text-gray-500">
                          {c.title || "Kariyer Koçu"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-600 space-y-1">
                      {c.summary && (
                        <p className="line-clamp-2">{c.summary}</p>
                      )}
                      <div className="text-[10px] text-gray-400">
                        Kaydedilme: {new Date(item.saved_at).toLocaleString("tr-TR")}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
