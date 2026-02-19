// src/pages/MyApplications.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Star, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      // 1. İlanlar (Eşleşmeler) - Jobs tablosundan
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setMatches(jobData || []);

      // 2. Favori İlanlar - Saved Items tablosundan
      const { data: favData } = await supabase
        .from("saved_items")
        .select("created_at, jobs:jobs(*)")
        .eq("user_id", user.id)
        .eq("item_type", "job");
      
      // Saved items yapısını job listesine çevir
      const favs = favData?.map(f => f.jobs).filter(Boolean) || [];
      setFavorites(favs);

      setLoading(false);
    }
    loadData();
  }, [user]);

  const JobCard = ({ job, statusBadge }: any) => (
    <Card className="mb-3 hover:shadow-md transition-all">
      <CardContent className="p-4 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900">{job.position}</h3>
          <div className="text-sm text-gray-500 flex gap-3">
            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location_text}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {job.work_type}</span>
          </div>
        </div>
        {statusBadge}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Briefcase className="text-blue-600" />
          Başvurularım
        </h1>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-xl border border-gray-200">
            <TabsTrigger value="matches">İlanlar</TabsTrigger>
            <TabsTrigger value="favorites">Favori İlanlarım</TabsTrigger>
            <TabsTrigger value="ongoing">Devam Eden</TabsTrigger>
            <TabsTrigger value="closed">Kapanan</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Profilinize uygun güncel ilanlar.</p>
            {matches.map(job => <JobCard key={job.post_id} job={job} />)}
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            {favorites.length === 0 && <div className="text-center py-10 text-gray-500">Henüz favori ilanınız yok.</div>}
            {favorites.map(job => (
              <JobCard 
                key={job.post_id} 
                job={job} 
                statusBadge={<Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />} 
              />
            ))}
          </TabsContent>

          <TabsContent value="ongoing" className="mt-4">
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              Henüz aktif bir başvurunuz bulunmuyor.
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-4">
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              Kapanmış başvurunuz yok.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
