// src/pages/AdminHireDashboard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAllMeetings, getHireDecisions, getEmailLogs } from "@/lib/meeting-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Video,
  Mail,
  UserCheck,
  UserX,
  Pause,
  Calendar,
  Clock,
  Building2,
  Users,
  Briefcase,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";

type TabKey = "meetings" | "hiring" | "emails";

export default function AdminHireDashboard() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("meetings");
  const [meetings, setMeetings] = useState<any[]>([]);
  const [hireDecisions, setHireDecisions] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, h, e] = await Promise.all([
        getAllMeetings(),
        getHireDecisions(),
        getEmailLogs(100),
      ]);
      setMeetings(m.data || []);
      setHireDecisions(h.data || []);
      setEmailLogs(e.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // KPI'lar
  const totalMeetings = meetings.length;
  const activeMeetings = meetings.filter(m => m.status === "active" || m.status === "created").length;
  const completedMeetings = meetings.filter(m => m.status === "completed").length;
  const totalHired = hireDecisions.filter(h => h.decision === "hired").length;
  const totalRejected = hireDecisions.filter(h => h.decision === "rejected").length;
  const totalEmails = emailLogs.length;
  const sentEmails = emailLogs.filter(e => e.status === "sent").length;
  const coachingSessions = meetings.filter(m => m.room_type === "coaching_session").length;
  const interviewSessions = meetings.filter(m => m.room_type === "interview").length;

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 w-1/3 rounded" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-blue-600" />
            Görüşme & İşe Alım Merkezi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm toplantılar, mülakatlar, işe alım kararları ve email logları
          </p>
        </div>
        <Button onClick={fetchAll} variant="outline" className="rounded-lg">
          <RefreshCw className="h-4 w-4 mr-2" /> Yenile
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Toplam Toplantı" value={totalMeetings} icon={<Video className="h-4 w-4" />} color="blue" />
        <KpiCard label="Aktif" value={activeMeetings} icon={<Clock className="h-4 w-4" />} color="green" />
        <KpiCard label="Tamamlanan" value={completedMeetings} icon={<CheckCircle2 className="h-4 w-4" />} color="gray" />
        <KpiCard label="Koçluk" value={coachingSessions} icon={<Users className="h-4 w-4" />} color="purple" />
        <KpiCard label="Mülakat" value={interviewSessions} icon={<Briefcase className="h-4 w-4" />} color="orange" />
        <KpiCard label="İşe Alınan" value={totalHired} icon={<UserCheck className="h-4 w-4" />} color="green" />
        <KpiCard label="Reddedilen" value={totalRejected} icon={<UserX className="h-4 w-4" />} color="red" />
        <KpiCard label="Email Gönderilen" value={`${sentEmails}/${totalEmails}`} icon={<Mail className="h-4 w-4" />} color="blue" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-1">
        <TabBtn active={tab === "meetings"} onClick={() => setTab("meetings")} icon={<Video className="h-4 w-4" />}>Toplantılar</TabBtn>
        <TabBtn active={tab === "hiring"} onClick={() => setTab("hiring")} icon={<UserCheck className="h-4 w-4" />}>İşe Alımlar</TabBtn>
        <TabBtn active={tab === "emails"} onClick={() => setTab("emails")} icon={<Mail className="h-4 w-4" />}>Email Logları</TabBtn>
      </div>

      {/* Toplantılar */}
      {tab === "meetings" && (
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <EmptyState icon={<Video className="h-12 w-12" />} text="Henüz toplantı kaydı yok" />
          ) : (
            meetings.map(m => (
              <Card key={m.id} className="rounded-xl border-none shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      m.room_type === "interview" ? "bg-orange-100" : "bg-blue-100"
                    }`}>
                      {m.room_type === "interview" 
                        ? <Briefcase className="h-5 w-5 text-orange-600" />
                        : <Users className="h-5 w-5 text-blue-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{m.meeting_type_label || m.room_type}</p>
                        <StatusBadge status={m.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {m.host_name || "—"} ↔ {m.participant_name || "—"}
                      </p>
                      {m.scheduled_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          📅 {new Date(m.scheduled_at).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" })}
                          {" "}🕐 {new Date(m.scheduled_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                          {" "}⏱ {m.duration_minutes || 45}dk
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.room_url && (
                      <a href={m.room_url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg">
                          <ExternalLink className="h-3 w-3 mr-1" /> Link
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
                {(m.started_at || m.ended_at) && (
                  <div className="mt-2 text-xs text-gray-400 flex gap-4">
                    {m.started_at && <span>Başladı: {new Date(m.started_at).toLocaleTimeString("tr-TR")}</span>}
                    {m.ended_at && <span>Bitti: {new Date(m.ended_at).toLocaleTimeString("tr-TR")}</span>}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* İşe Alımlar */}
      {tab === "hiring" && (
        <div className="space-y-3">
          {hireDecisions.length === 0 ? (
            <EmptyState icon={<UserCheck className="h-12 w-12" />} text="Henüz işe alım kararı yok" />
          ) : (
            hireDecisions.map(h => (
              <Card key={h.decision_id} className="rounded-xl border-none shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      h.decision === "hired" ? "bg-green-100" :
                      h.decision === "rejected" ? "bg-red-100" : "bg-yellow-100"
                    }`}>
                      {h.decision === "hired" ? <UserCheck className="h-5 w-5 text-green-600" /> :
                       h.decision === "rejected" ? <UserX className="h-5 w-5 text-red-600" /> :
                       <Pause className="h-5 w-5 text-yellow-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{h.candidate_name || "Aday"}</p>
                      <p className="text-xs text-gray-500">
                        {h.job_position || "Pozisyon"} • {h.company_name || "Şirket"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {h.candidate_email} • Karar: {new Date(h.decision_date).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      h.decision === "hired" ? "bg-green-100 text-green-700" :
                      h.decision === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {h.decision === "hired" ? "✅ İşe Alındı" :
                       h.decision === "rejected" ? "❌ Reddedildi" : "⏸ Beklemede"}
                    </span>
                    {h.salary_offered && (
                      <p className="text-xs text-gray-500 mt-1">💰 {h.salary_offered} TL</p>
                    )}
                    {h.start_date && (
                      <p className="text-xs text-gray-500">📅 Başlangıç: {h.start_date}</p>
                    )}
                  </div>
                </div>
                {h.notes && (
                  <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">📝 {h.notes}</p>
                )}
                {h.jitsi_url && (
                  <a href={h.jitsi_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 mt-1 inline-block">
                    🎥 Mülakat kaydı
                  </a>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Email Logları */}
      {tab === "emails" && (
        <div className="space-y-2">
          {emailLogs.length === 0 ? (
            <EmptyState icon={<Mail className="h-12 w-12" />} text="Henüz email gönderilmemiş" />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">Alıcı</th>
                    <th className="text-left p-3 font-medium text-gray-600">Konu</th>
                    <th className="text-left p-3 font-medium text-gray-600">Tip</th>
                    <th className="text-left p-3 font-medium text-gray-600">Durum</th>
                    <th className="text-left p-3 font-medium text-gray-600">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map(e => (
                    <tr key={e.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <p className="font-medium text-xs">{e.to_name || "—"}</p>
                        <p className="text-xs text-gray-400">{e.to_email}</p>
                      </td>
                      <td className="p-3 text-xs text-gray-600 max-w-[200px] truncate">{e.subject}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{e.template_type}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          e.status === "sent" ? "bg-green-100 text-green-700" :
                          e.status === "failed" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {e.status === "sent" ? "✅ Gönderildi" : e.status === "failed" ? "❌ Başarısız" : "⏳ Bekliyor"}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-400">
                        {e.created_at ? new Date(e.created_at).toLocaleString("tr-TR") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Alt Bileşenler ───

function KpiCard({ label, value, icon, color = "blue" }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };
  return (
    <Card className="rounded-xl border-none shadow-sm p-3">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-[10px] text-gray-500">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function TabBtn({ active, onClick, icon, children }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${active ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
      {icon} {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    created: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    created: "Oluşturuldu",
    active: "Aktif",
    completed: "Tamamlandı",
    cancelled: "İptal",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}

function EmptyState({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="p-10 text-center border-2 border-dashed rounded-3xl text-gray-400">
      <div className="mx-auto mb-3 text-gray-300">{icon}</div>
      <p className="font-medium">{text}</p>
    </div>
  );
}
