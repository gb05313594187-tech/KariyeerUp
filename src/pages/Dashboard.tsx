// src/pages/Dashboard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Clock,
  User,
  Star,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SESSION_TABLE = "app_2dff6511da_session_requests";
const COACHES_TABLE = "app_2dff6511da_coaches";

// Duruma göre rozet
const renderStatusBadge = (status: string) => {
  const s = status || "pending";
  if (s === "approved") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
        Onaylandı
      </Badge>
    );
  }
  if (s === "rejected") {
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-200 text-[11px]">
        Reddedildi
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
      Beklemede
    </Badge>
  );
};

// TR tarih formatı
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [coachMap, setCoachMap] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) Kullanıcı
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth?.user?.id;
        if (!userId) {
          setRequests([]);
          setCoachMap({});
          setLoading(false);
          return;
        }

        // 2) Bu kullanıcıya ait seans talepleri
        const { data: reqs, error } = await supabase
          .from(SESSION_TABLE)
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error || !reqs) {
          console.error("User session requests error:", error);
          setRequests([]);
          setCoachMap({});
          setLoading(false);
          return;
        }

        setRequests(reqs);

        // 3) İlgili koçları tek seferde çek
        const coachIds = Array.from(
          new Set(reqs.map((r) => r.coach_id).filter(Boolean))
        );

        if (coachIds.length > 0) {
          const { data: coaches, error: coachErr } = await supabase
            .from(COACHES_TABLE)
            .select("id, full_name, title, rating")
            .in("id", coachIds);

          if (!coachErr && coaches) {
            const map: Record<string, any> = {};
            coaches.forEach((c) => {
              map[c.id] = c;
            });
            setCoachMap(map);
          }
        }
      } catch (err) {
        console.error("User dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gelecek / geçmiş ayrımı
  const today = new Date();

  const upcoming = requests.filter((req) => {
    const dStr = req.selected_date || req.session_date;
    if (!dStr) return false;
    const d = new Date(dStr);
    // Gelecek + beklemede olanlar
    return d >= today || req.status === "pending";
  });

  const past = requests.filter((req) => {
    const dStr = req.selected_date || req.session_date;
    if (!dStr) return false;
    const d = new Date(dStr);
    return d < today && req.status === "approved";
  });

  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm">Panelin yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      {/* HERO */}
      <header className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-1">
              Kariyeer Paneli
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Kariyer Yolculuğun Tek Ekranda
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Gönderdiğin seans taleplerini, durumlarını ve yaklaşan görüşmeleri
              buradan takip edebilirsin.
            </p>
          </div>
        </div>
      </header>

      {/* İÇERİK */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ÖZET KARTLAR */}
        <section className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/90 border-slate-800">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Toplam Seans Talebin</p>
              <p className="text-2xl font-semibold">{totalCount}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Hedef: düzenli 2 seans / ay
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Bekleyen Talepler</p>
              <p className="text-2xl font-semibold">{pendingCount}</p>
              <p className="text-[11px] text-amber-400 mt-1">
                Koç onayladığında e-posta ile bilgi verilecek.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Onaylanmış Seanslar</p>
              <p className="text-2xl font-semibold">{approvedCount}</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                Her seans sonrası kısa bir not almayı unutma.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* SEANSLAR TABS */}
        <section>
          <Card className="bg-slate-900/90 border-slate-800">
            <Tabs
              value={activeTab}
              onValueChange={(v: any) => setActiveTab(v)}
            >
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-sky-400" />
                  Seansların
                </CardTitle>
                <TabsList className="bg-slate-950 border border-slate-800">
                  <TabsTrigger value="upcoming">
                    Yaklaşan &amp; Bekleyen
                  </TabsTrigger>
                  <TabsTrigger value="past">Geçmiş Seanslar</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                {/* YAKLAŞAN / BEKLEYEN */}
                <TabsContent value="upcoming" className="space-y-3">
                  {upcoming.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Henüz yaklaşan veya bekleyen seans talebin yok. Bir koç
                      profiline giderek “Hemen Seans Al” butonunu
                      kullanabilirsin.
                    </p>
                  )}

                  {upcoming.map((req) => {
                    const coach = coachMap[req.coach_id] || null;
                    return (
                      <div
                        key={req.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-500/20 flex items-center justify-center text-xs">
                            <User className="w-4 h-4 text-sky-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {coach?.full_name || "Koç"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {coach?.title || "Kariyer Koçu"}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                              <span>{formatDate(req.selected_date)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <Clock className="w-3 h-3" />
                              {req.selected_time}
                            </p>
                            {req.note && (
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                Notun: {req.note}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {renderStatusBadge(req.status)}
                          {coach?.rating && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-300">
                              <Star className="w-3 h-3 text-yellow-400" />
                              {coach.rating.toFixed(1)} ortalama puan
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                {/* GEÇMİŞ SEANSLAR */}
                <TabsContent value="past" className="space-y-3">
                  {past.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Henüz tamamlanmış onaylı seansın yok.
                    </p>
                  )}

                  {past.map((req) => {
                    const coach = coachMap[req.coach_id] || null;
                    return (
                      <div
                        key={req.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {coach?.full_name || "Koç"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {coach?.title || "Kariyer Koçu"}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                            <span>{formatDate(req.selected_date)}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <Clock className="w-3 h-3" />
                            {req.selected_time}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {renderStatusBadge(req.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[11px] border-slate-700"
                          >
                            Seans Notu Ekle (yakında)
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </section>
      </main>
    </div>
  );
}
