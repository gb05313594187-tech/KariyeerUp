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
  FileSearch
} from "lucide-react";

type TabKey = "meetings" | "assessments" | "emails";

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
  const assessmentSessions = meetings.filter(m => m.room_type === "interview").length;

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
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Video className="h-6 w-6 text-orange-600" />
            Gelişim ve Mentorluk Takip Merkezi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistem genelindeki mentorluk seansları, vaka değerlendirmeleri ve bilgilendirme günlükleri
          </p>
        </div>
        <Button onClick={fetchAll} variant="outline" className="rounded-lg border-orange-200 text-orange-700">
          <RefreshCw className="h-4 w-4 mr-2" /> Verileri Yenile
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Toplam Seans" value={totalMeetings} icon={<Video className="h-4 w-4" />} color="blue" />
        <KpiCard label="Aktif" value={activeMeetings} icon={<Clock className="h-4 w-4" />} color="green" />
        <KpiCard label="Tamamlanan" value={completedMeetings} icon={<CheckCircle2 className="h-4 w-4" />} color="gray" />
        <KpiCard label="Mentorluk" value={coachingSessions} icon={<Users className="h-4 w-4" />} color="purple" />
        <KpiCard label="Değerlendirme" value={assessmentSessions} icon={<FileSearch className="h-4 w-4" />} color="orange" />
        <KpiCard label="Olumlu Çıktı" value={totalHired} icon={<UserCheck className="h-4 w-4" />} color="green" />
        <KpiCard label="Gelişmeli" value={totalRejected} icon={<UserX className="h-4 w-4" />} color="red" />
        <KpiCard label="Email Günlüğü" value={`${sentEmails}/${totalEmails}`} icon={<Mail className="h-4 w-4" />} color="blue" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-1">
        <TabBtn active={tab === "meetings"} onClick={() => setTab("meetings")} icon={<Video className="h-4 w-4" />}>Mentorluk Seansları</TabBtn>
        <TabBtn active={tab === "assessments"} onClick={() => setTab("assessments")} icon={<FileSearch className="h-4 w-4" />}>Vaka Değerlendirmeleri</TabBtn>
        <TabBtn active={tab === "emails"} onClick={() => setTab("emails")} icon={<Mail className="h-4 w-4" />}>İletişim Logları</TabBtn>
      </div>

      {/* Mentorluk Seansları */}
      {tab === "meetings" && (
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <EmptyState icon={<Video className="h-12 w-12" />} text="Henüz seans kaydı bulunmuyor" />
          ) : (
            meetings.map(m => (
              <Card key={m.id} className="rounded-xl border-none shadow-sm p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      m.room_type === "interview" ? "bg-orange-100" : "bg-blue-100"
                    }`}>
                      {m.room_type === "interview" 
                        ? <FileSearch className="h-5 w-5 text-orange-600" />
                        : <Users className="h-5 w-5 text-blue-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{m.meeting_type_label || (m.room_type === 'interview' ? 'Değerlendirme Seansı' : 'Mentorluk Gelişimi')}</p>
                        <StatusBadge status={m.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {m.host_name || "Mentor"} ↔ {m.participant_name || "Danışan"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    {m.scheduled_at && (
                      <p className="text-xs text-gray-400">
                        📅 {new Date(m.scheduled_at).toLocaleDateString("tr-TR")} | ⏱ {m.duration_minutes || 45}dk
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Vaka Değerlendirmeleri (Eski İşe Alımlar) */}
      {tab === "assessments" && (
        <div className="space-y-3">
          {hireDecisions.length === 0 ? (
            <EmptyState icon={<UserCheck className="h-12 w-12" />} text="Henüz vaka değerlendirme sonucu yok" />
          ) : (
            hireDecisions.map(h => (
              <Card key={h.decision_id} className="rounded-xl border-none shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      h.decision === "hired" ? "bg-green-100" :
                      h.decision === "rejected" ? "bg-red-100" : "bg-yellow-100"
                    }`}>
                      {h.decision === "hired" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> :
                       h.decision === "rejected" ? <UserX className="h-5 w-5 text-red-600" /> :
                       <Pause className="h-5 w-5 text-yellow-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{h.candidate_name || "Kullanıcı"}</p>
                      <p className="text-xs text-gray-500">
                        Program: {h.job_position || "Genel Gelişim"} • Mentor Kurum: {h.company_name || "Bağımsız Mentor"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                      h.decision === "hired" ? "bg-green-100 text-green-700" :
                      h.decision === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {h.decision === "hired" ? "Başarılı Tamamlandı" :
                       h.decision === "rejected" ? "Ek Gelişim Gerekli" : "İncelemede"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(h.decision_date).toLocaleDateString("tr-TR")}</p>
                  </div>
                </div>
                {h.notes && (
                  <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg italic">📝 Mentor Notu: {h.notes}</p>
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
            <EmptyState icon={<Mail className="h-12 w-12" />} text="Henüz iletişim günlüğü kaydı bulunmuyor" />
          ) : (
            <div className="rounded-xl border overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="text-left p-4 font-bold">Alıcı</th>
                    <th className="text-left p-4 font-bold">İçerik Başlığı</th>
                    <th className="text-left p-4 font-bold">Kategori</th>
                    <th className="text-left p-4 font-bold">Durum</th>
                    <th className="text-left p-4 font-bold">Zaman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {emailLogs.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-xs text-slate-700">{e.to_name || "—"}</p>
                        <p className="text-[10px] text-gray-400">{e.to_email}</p>
                      </td>
                      <td className="p-4 text-xs text-gray-600 max-w-[200px] truncate">{e.subject}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{e.template_type}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          e.status === "sent" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        }`}>
                          {e.status === "sent" ? "İletildi" : "Hata"}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] text-gray-400">
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
      
      {/* Footer Legal Warning */}
      <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
        <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
          <strong>Önemli Yönetici Notu:</strong> Bu panel üzerinden takip edilen veriler münhasıran "Kariyer Mentorluğu ve Eğitim" faaliyetlerine ilişkindir. Kariyeer.com bir Özel İstihdam Bürosu değildir; dolayısıyla bu panel "Personel Seçme ve Yerleştirme" amacıyla kullanılamaz. Tüm sonuçlar kullanıcı gelişim raporu niteliğindedir.
        </p>
      </div>
    </div>
  );
}

// ─── Alt Bileşenler (KPI, Tab, Badge) ───

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
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{label}</p>
          <p className="text-lg font-black text-slate-800">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function TabBtn({ active, onClick, icon, children }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${active ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-400 hover:text-gray-600"}`}>
      {icon} {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    created: "bg-blue-50 text-blue-600",
    active: "bg-emerald-50 text-emerald-600",
    completed: "bg-slate-100 text-slate-500",
    cancelled: "bg-red-50 text-red-600",
  };
  const labels: Record<string, string> = {
    created: "Planlandı",
    active: "Yayında",
    completed: "Bitti",
    cancelled: "İptal",
  };
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}

function EmptyState({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 bg-white/50">
      <div className="mx-auto mb-3 text-slate-200">{icon}</div>
      <p className="text-sm font-bold uppercase tracking-widest">{text}</p>
    </div>
  );
}
