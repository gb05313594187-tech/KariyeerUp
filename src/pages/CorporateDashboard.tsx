// src/pages/CorporateDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2, Users, Briefcase, CalendarCheck2, TrendingUp, Search,
  Filter, PlusCircle, Sparkles, ArrowRight, CheckCircle2, Clock,
  X, Mail, Phone, Globe, BadgeCheck, Star, Video, ChevronRight,
} from "lucide-react";

// ✅ YENİ MODAL BİLEŞENİNİ IMPORT EDİYORUZ
import JobForm from "@/components/JobForm";

type TabKey = "find_coach" | "requests" | "active_sessions";

export default function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<TabKey>("find_coach");

  // UI data
  const [coaches, setCoaches] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  // Filters
  const [q, setQ] = useState("");
  const [goal, setGoal] = useState("Mülakat");
  const [level, setLevel] = useState("Mid");
  const [lang, setLang] = useState("TR");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isPlanningInterview, setIsPlanningInterview] = useState(false);

  // Veri çekme fonksiyonları (Bootstrap)
  const bootstrap = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const u = auth?.user;
      setMe(u || null);
      if (!u?.id) return;

      const { data: p } = await supabase.from("profiles").select("*").eq("id", u.id).single();
      setProfile(p);

      // Koçları ve Talepleri çek
      const { data: cData } = await supabase.from("profiles").select("id, email, role, full_name").ilike("role", "coach");
      const mappedCoaches = (cData || []).map((c, idx) => ({
        ...c,
        ...defaultCoachMeta(idx, c.full_name || "Koç")
      }));
      setCoaches(mappedCoaches);

      const { data: rData } = await supabase.from("corporate_session_requests").select("*").eq("corporate_user_id", u.id).order("created_at", { ascending: false });
      setRequests(rData || []);

    } catch (e: any) {
      toast.error("Yükleme hatası: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { bootstrap(); }, []);

  // Filtreleme ve KPI hesaplamaları
  const kpis = useMemo(() => {
    return {
      totalCoaches: coaches.length,
      openRequests: requests.filter(r => r.status === "new" || r.status === "reviewing").length,
      approved: requests.filter(r => r.status === "approved").length,
      slaMinutes: 24,
      impact: 85
    };
  }, [coaches, requests]);

  const filteredCoaches = useMemo(() => {
    return coaches.filter(c => 
      (c.full_name || "").toLowerCase().includes(q.toLowerCase()) && 
      (lang ? c.languages.includes(lang) : true)
    );
  }, [coaches, q, lang]);

  const openRequestModal = (coach: any) => {
    setSelectedCoach(coach);
    setModalOpen(true);
  };

  // Yeni Talep Oluşturma (JobForm'dan gelecek verilerle)
  const handleCreateRequest = async (formData: any) => {
    setActionLoading(true);
    try {
      const { error } = await supabase.from("corporate_session_requests").insert([{
        corporate_user_id: me.id,
        coach_user_id: selectedCoach.id,
        coach_name: selectedCoach.full_name,
        goal: formData.goal || goal,
        level: formData.level || level,
        notes: formData.notes,
        status: "new"
      }]);

      if (error) throw error;
      toast.success("Talep başarıyla iletildi!");
      setModalOpen(false);
      bootstrap(); // Listeyi tazele
    } catch (e: any) {
      toast.error("Hata: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };
  // ... (Parça 1'in devamı)
  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header & KPI Seksiyonu */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="text-red-600" /> Kurumsal Panel
          </h1>
          <p className="text-sm text-gray-500">{profile?.company_name || "Şirket Yönetimi"}</p>
        </div>
        <Button onClick={() => setTab("find_coach")} className="rounded-xl bg-red-600 hover:bg-red-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Koç Bul
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard title="Koç Havuzu" value={kpis.totalCoaches} icon={<Users />} />
        <KpiCard title="Açık Talep" value={kpis.openRequests} icon={<Clock />} />
        <KpiCard title="Onaylanan" value={kpis.approved} icon={<CheckCircle2 />} />
        <KpiCard title="Yanıt Hızı" value="24s" icon={<TrendingUp />} />
        <KpiCard title="Impact" value="%85" icon={<Sparkles />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-4">
        <TabButton active={tab === "find_coach"} onClick={() => setTab("find_coach")} icon={<Briefcase />}>Koç Bul</TabButton>
        <TabButton active={tab === "requests"} onClick={() => setTab("requests")} icon={<CalendarCheck2 />}>Taleplerim</TabButton>
      </div>

      {/* Main Content */}
      <div className="mt-6">
        {tab === "find_coach" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map(coach => (
              <div key={coach.id} className="bg-white p-5 rounded-2xl border hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{coach.full_name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{coach.headline}</p>
                  </div>
                  {coach.verified && <BadgeCheck className="text-green-500 h-5 w-5" />}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specializations.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] bg-gray-100 px-2 py-1 rounded-full uppercase font-medium">{s}</span>
                  ))}
                </div>
                <Button onClick={() => openRequestModal(coach)} className="w-full rounded-xl" variant="outline">
                  Seans Talep Et <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-4">
            {requests.map(r => (
              <Card key={r.id} className="rounded-2xl border-none shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{r.coach_name}</p>
                    <p className="text-xs text-gray-500">{r.goal} • {r.level} • {new Date(r.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <StatusPill status={r.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ✅ KRİTİK NOKTA: ESKİ MODAL GİTTİ, YENİ UNICORN FORM GELDİ */}
      <JobForm 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        selectedCoach={selectedCoach}
        onSubmit={handleCreateRequest}
        loading={actionLoading}
      />
    </div>
  );
}

/* --- HELPERS --- */
function KpiCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border flex items-center gap-4">
      <div className="p-2 bg-red-50 text-red-600 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
      {icon} {children}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: any = { new: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
  return <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${colors[status] || "bg-gray-100"}`}>{status}</span>;
}

function defaultCoachMeta(idx: number, name: string) {
  return {
    headline: "Kıdemli Kariyer Koçu & Mülakat Danışmanı",
    specializations: ["Mülakat", "Liderlik", "Kariyer"],
    languages: ["TR", "EN"],
    verified: true
  };
}
