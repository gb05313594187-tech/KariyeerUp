// src/pages/MyApplications.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Star, Clock, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      // 1. Önerilen Gelişim Programları
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setMatches(jobData || []);

      // 2. Takip Edilen Programlar
      const { data: favData } = await supabase
        .from("saved_items")
        .select("created_at, jobs:jobs(*)")
        .eq("user_id", user.id)
        .eq("item_type", "job");
      
      const favs = favData?.map(f => f.jobs).filter(Boolean) || [];
      setFavorites(favs);

      setLoading(false);
    }
    loadData();
  }, [user]);

  const JobCard = ({ job, statusBadge }: any) => (
    <Card className="mb-3 hover:shadow-md transition-all border-slate-200">
      <CardContent className="p-4 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={14} className="text-orange-500" />
            {job.position}
          </h3>
          <div className="text-xs text-slate-500 flex gap-3">
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
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black flex items-center gap-2 text-slate-900 uppercase italic tracking-tighter">
              <GraduationCap className="text-orange-600 w-7 h-7" />
              Gelişim Yolculuğum
            </h1>
            <p className="text-sm text-slate-500">Mentorluk talepleriniz ve katıldığınız gelişim programlarının takibi.</p>
        </div>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-200/50 p-1 rounded-xl border border-slate-200">
            <TabsTrigger value="matches" className="font-bold text-xs uppercase">Programlar</TabsTrigger>
            <TabsTrigger value="favorites" className="font-bold text-xs uppercase">Takip Ettiklerim</TabsTrigger>
            <TabsTrigger value="ongoing" className="font-bold text-xs uppercase">Aktif Talepler</TabsTrigger>
            <TabsTrigger value="closed" className="font-bold text-xs uppercase">Tamamlanan</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="mt-4">
            <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg mb-4">
                <p className="text-[10px] text-orange-800 font-bold uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={12} /> Yetkinliklerinize Uygun Mentorluk Fırsatları
                </p>
            </div>
            {matches.map(job => <JobCard key={job.post_id} job={job} />)}
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            {favorites.length === 0 && (
                <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed">
                    Henüz takibe aldığınız bir program bulunmuyor.
                </div>
            )}
            {favorites.map(job => (
              <JobCard 
                key={job.post_id} 
                job={job} 
                statusBadge={<Star className="text-orange-400 fill-orange-400 w-5 h-5" />} 
              />
            ))}
          </TabsContent>

          <TabsContent value="ongoing" className="mt-4">
            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Henüz aktif bir gelişim veya mentorluk talebiniz bulunmuyor.
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-4">
            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Tamamlanmış veya arşive kaldırılmış bir gelişim süreci bulunmuyor.
            </div>
          </TabsContent>
        </Tabs>

        {/* YASAL BİLGİLENDİRME NOTU */}
        <div className="mt-10 p-5 bg-slate-200/50 rounded-2xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold text-center leading-relaxed uppercase tracking-widest">
                Kariyeer.com bir Özel İstihdam Bürosu değildir. Bu sayfada yer alan bilgiler sadece eğitim ve kariyer mentorluğu süreçlerinin takibi amacıyla kullanıcıya sunulmaktadır. Platformumuz işe yerleştirme garantisi vermez.
            </p>
        </div>
      </div>
    </div>
  );
}
