// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Brain, TrendingUp, Users, Briefcase, Video, CheckCircle2,
  XCircle, Clock, Target, Zap, Activity, BarChart3, PieChart,
  ArrowUpRight, ArrowDownRight, Sparkles, Globe, Award,
  UserCheck, FileText, Send, Calendar, Star, AlertTriangle,
  Loader2, Building2, RefreshCw
} from "lucide-react";
/* =========================================================
   TYPES
   ========================================================= */
type AIStats = {
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  totalHired: number;
  totalRejected: number;
  avgAIScore: number;
  hireRate: number;
  interviewRate: number;
  aiAccuracy: number;
  avgTimeToHire: number;
  topSkills: { name: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
  matchScoreDistribution: { range: string; count: number }[];
  weeklyApplications: { week: string; count: number }[];
  jobPerformance: { position: string; apps: number; interviews: number; hired: number; avgScore: number }[];
};
/* =========================================================
   BAR COMPONENT (CSS based)
   ========================================================= */
function MiniBar({ value, max, color = "bg-red-500", height = "h-20" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={`w-full ${height} bg-slate-100 rounded-lg overflow-hidden flex items-end`}>
      <div className={`w-full ${color} rounded-lg transition-all duration-700`} style={{ height: `${pct}%` }} />
    </div>
  );
}
/* =========================================================
   DONUT COMPONENT
   ========================================================= */
function Donut({ value, total, color = "#E63946", size = 120, label = "" }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text x="60" y="55" textAnchor="middle" className="text-2xl font-black" fill="#1e293b">{pct}%</text>
        <text x="60" y="72" textAnchor="middle" className="text-[8px] font-bold uppercase" fill="#94a3b8">{value}/{total}</text>
      </svg>
      {label && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</span>}
    </div>
  );
}
/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function AdvancedAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const fetchStats = async () => {
    setLoading(true);
    try {
      // Parallel data fetch
      const [
        { data: jobs },
        { data: applications },
        { data: interviews },
        { data: matches },
        { data: profiles },
      ] = await Promise.all([
        supabase.from("jobs").select("*"),
        supabase.from("job_applications").select("*"),
        supabase.from("interviews").select("*"),
        supabase.from("job_candidate_matches").select("*"),
        supabase.from("profiles").select("id, full_name, cv_data, city, country").limit(500),
      ]);
      const allJobs = jobs || [];
      const allApps = applications || [];
      const allInterviews = interviews || [];
      const allMatches = matches || [];
      const allProfiles = profiles || [];
      // ─── Temel KPI'lar ───
      const totalJobs = allJobs.length;
      const totalApplications = allApps.length;
      const totalInterviews = allInterviews.length;
      const totalHired = allApps.filter(a => a.status === "accepted").length;
      const totalRejected = allApps.filter(a => a.status === "rejected").length;
      // ─── AI Skor ortalaması ───
      const scores = allMatches.map(m => Number(m.fit_score)).filter(s => s > 0);
      const avgAIScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      // ─── Oranlar ───
      const hireRate = totalApplications > 0 ? Math.round((totalHired / totalApplications) * 100) : 0;
      const interviewRate = totalApplications > 0 ? Math.round((totalInterviews / totalApplications) * 100) : 0;
      // ─── AI Accuracy: Kabul edilenlerin ort. AI skoru vs Reddedilenlerin ort. AI skoru ───
      const hiredCandidateIds = allApps.filter(a => a.status === "accepted").map(a => a.candidate_id);
      const rejectedCandidateIds = allApps.filter(a => a.status === "rejected").map(a => a.candidate_id);
      const hiredScores = allMatches.filter(m => hiredCandidateIds.includes(m.candidate_id)).map(m => Number(m.fit_score));
      const rejectedScores = allMatches.filter(m => rejectedCandidateIds.includes(m.candidate_id)).map(m => Number(m.fit_score));
      const avgHiredScore = hiredScores.length > 0 ? hiredScores.reduce((a, b) => a + b, 0) / hiredScores.length : 0;
      const avgRejectedScore = rejectedScores.length > 0 ? rejectedScores.reduce((a, b) => a + b, 0) / rejectedScores.length : 0;
      const aiAccuracy = avgHiredScore > avgRejectedScore ? Math.min(95, Math.round((avgHiredScore / Math.max(avgHiredScore, avgRejectedScore, 1)) * 100)) : 50;
      // ─── Ortalama işe alım süresi (gün) ───
      let avgTimeToHire = 0;
      const hiredApps = allApps.filter(a => a.status === "accepted" && a.applied_at && a.updated_at);
      if (hiredApps.length > 0) {
        const totalDays = hiredApps.reduce((sum, a) => {
          const days = (new Date(a.updated_at) - new Date(a.applied_at)) / (1000 * 60 * 60 * 24);
          return sum + Math.max(0, days);
        }, 0);
        avgTimeToHire = Math.round(totalDays / hiredApps.length);
      }
      // ─── Top Yetenekler ───
      const skillMap = {};
      allProfiles.forEach(p => {
        const skills = p.cv_data?.skills || [];
        skills.forEach(s => {
          const key = s.toLowerCase().trim();
          if (key) skillMap[key] = (skillMap[key] || 0) + 1;
        });
      });
      const topSkills = Object.entries(skillMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
      // ─── Başvuru durumu dağılımı ───
      const statusMap = {};
      allApps.forEach(a => {
        const s = a.status || "pending";
        statusMap[s] = (statusMap[s] || 0) + 1;
      });
      const applicationsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));
      // ─── AI Skor dağılımı ───
      const ranges = { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
      scores.forEach(s => {
        if (s <= 20) ranges["0-20"]++;
        else if (s <= 40) ranges["21-40"]++;
        else if (s <= 60) ranges["41-60"]++;
        else if (s <= 80) ranges["61-80"]++;
        else ranges["81-100"]++;
      });
      const matchScoreDistribution = Object.entries(ranges).map(([range, count]) => ({ range, count }));
      // ─── Haftalık başvurular (son 8 hafta) ───
      const weeklyApplications = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const count = allApps.filter(a => {
          const d = new Date(a.applied_at);
          return d >= weekStart && d < weekEnd;
        }).length;
        weeklyApplications.push({
          week: `H${8 - i}`,
          count,
        });
      }
      // ─── İlan bazlı performans ───
      const jobPerformance = allJobs.map(job => {
        const jobApps = allApps.filter(a => a.job_id === job.post_id);
        const jobInterviews = allInterviews.filter(i => i.job_id === job.post_id);
        const jobHired = jobApps.filter(a => a.status === "accepted").length;
        const jobMatchScores = allMatches.filter(m => m.job_id === job.post_id).map(m => Number(m.fit_score));
        const avgScore = jobMatchScores.length > 0 ? Math.round(jobMatchScores.reduce((a, b) => a + b, 0) / jobMatchScores.length) : 0;
        return {
          position: job.position,
          apps: jobApps.length,
          interviews: jobInterviews.length,
          hired: jobHired,
          avgScore,
        };
      });
      setStats({
        totalJobs, totalApplications, totalInterviews, totalHired, totalRejected,
        avgAIScore, hireRate, interviewRate, aiAccuracy, avgTimeToHire,
        topSkills, applicationsByStatus, matchScoreDistribution,
        weeklyApplications, jobPerformance,
      });
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchStats(); }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">
            AI Intelligence Yükleniyor...
          </p>
        </div>
      </div>
    );
  }
  if (!stats) {
    return <div className="text-center py-20 text-slate-400 font-bold">Veri yüklenemedi</div>;
  }
  const maxWeekly = Math.max(...stats.weeklyApplications.map(w => w.count), 1);
  const maxScoreDist = Math.max(...stats.matchScoreDistribution.map(d => d.count), 1);
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* BAŞLIK */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            AI Intelligence <span className="text-red-600">Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Gerçek zamanlı işe alım analytics • Yatırımcı raporu
          </p>
        </div>
        <button onClick={fetchStats} className="bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-colors cursor-pointer">
          <RefreshCw size={18} className="text-slate-600" />
        </button>
      </div>
      {/* ═══════ ROW 1: ANA KPI'LAR ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "Toplam İlan", value: stats.totalJobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Toplam Başvuru", value: stats.totalApplications, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Mülakatlar", value: stats.totalInterviews, icon: Video, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "İşe Alınan", value: stats.totalHired, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Reddedilen", value: stats.totalRejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Ort. AI Skoru", value: stats.avgAIScore, icon: Brain, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{kpi.value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>
      {/* ═══════ ROW 2: ORAN KPI'LARI + DONUTLAR ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* İşe Alım Oranı */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white text-center shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">İşe Alım Oranı</h3>
          <Donut value={stats.totalHired} total={stats.totalApplications} color="#10b981" label="Hire Rate" />
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold">
            <ArrowUpRight size={16} /> {stats.hireRate}% dönüşüm
          </div>
        </div>
        {/* Mülakat Oranı */}
        <div className="bg-white p-8 rounded-[2rem] text-center shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Mülakat Oranı</h3>
          <Donut value={stats.totalInterviews} total={stats.totalApplications} color="#6366f1" label="Interview Rate" />
          <div className="mt-4 flex items-center justify-center gap-2 text-indigo-600 text-sm font-bold">
            <TrendingUp size={16} /> {stats.interviewRate}% geçiş
          </div>
        </div>
        {/* AI Accuracy */}
        <div className="bg-white p-8 rounded-[2rem] text-center shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">AI Doğruluk Oranı</h3>
          <Donut value={stats.aiAccuracy} total={100} color="#E63946" label="AI Accuracy" />
          <div className="mt-4 flex items-center justify-center gap-2 text-red-600 text-sm font-bold">
            <Sparkles size={16} /> AI eşleşme doğruluğu
          </div>
        </div>
      </div>
      {/* ═══════ ROW 3: GRAFIKLER ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Haftalık Başvuru Trendi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 size={14} className="text-blue-500" /> Haftalık Başvuru Trendi
          </h3>
          <div className="flex items-end gap-3 h-32">
            {stats.weeklyApplications.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-slate-600">{w.count}</span>
                <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-24 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all duration-700"
                    style={{ height: `${(w.count / maxWeekly) * 100}%`, minHeight: w.count > 0 ? "4px" : "0" }}
                  />
                </div>
                <span className="text-[8px] font-bold text-slate-400">{w.week}</span>
              </div>
            ))}
          </div>
        </div>
        {/* AI Skor Dağılımı */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Brain size={14} className="text-red-500" /> AI Eşleşme Skor Dağılımı
          </h3>
          <div className="flex items-end gap-3 h-32">
            {stats.matchScoreDistribution.map((d, i) => {
              const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-slate-600">{d.count}</span>
                  <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-24 flex items-end">
                    <div
                      className={`w-full ${colors[i]} rounded-lg transition-all duration-700`}
                      style={{ height: `${(d.count / maxScoreDist) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400">{d.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ═══════ ROW 4: BAŞVURU DURUMU + TOP SKILLS ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Başvuru Durumu Dağılımı */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <PieChart size={14} className="text-purple-500" /> Başvuru Hunisi (Funnel)
          </h3>
          <div className="space-y-3">
            {stats.applicationsByStatus.map((item, i) => {
              const colors = {
                pending: { bg: "bg-amber-500", label: "Bekleyen" },
                reviewing: { bg: "bg-blue-500", label: "İncelenen" },
                interview: { bg: "bg-purple-500", label: "Mülakat" },
                accepted: { bg: "bg-emerald-500", label: "İşe Alınan" },
                rejected: { bg: "bg-red-500", label: "Reddedilen" },
              };
              const c = colors[item.status] || { bg: "bg-slate-400", label: item.status };
              const pct = stats.totalApplications > 0 ? Math.round((item.count / stats.totalApplications) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase w-24 truncate">{c.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div className={`h-full ${c.bg} rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(pct, 3)}%` }}>
                      <span className="text-white text-[9px] font-black">{item.count}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Top Yetenekler */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> En Çok Aranan Yetenekler
          </h3>
          <div className="space-y-3">
            {stats.topSkills.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-8 font-bold">Yetenek verisi henüz yok</p>
            ) : (
              stats.topSkills.map((skill, i) => {
                const maxCount = stats.topSkills[0]?.count || 1;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-800 uppercase w-28 truncate">{skill.name}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                        style={{ width: `${(skill.count / maxCount) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 w-8 text-right">{skill.count}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {/* ═══════ ROW 5: İLAN BAZLI PERFORMANS ═══════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Target size={14} className="text-red-500" /> İlan Bazlı Performans Matrisi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">Pozisyon</th>
                <th className="p-4 text-center">Başvuru</th>
                <th className="p-4 text-center">Mülakat</th>
                <th className="p-4 text-center">İşe Alınan</th>
                <th className="p-4 text-center">Ort. AI Skor</th>
                <th className="p-4 text-center">Dönüşüm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.jobPerformance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-bold">Henüz ilan verisi yok</td>
                </tr>
              ) : (
                stats.jobPerformance.map((jp, i) => {
                  const convRate = jp.apps > 0 ? Math.round((jp.hired / jp.apps) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-black text-sm text-slate-800">{jp.position}</td>
                      <td className="p-4 text-center font-bold text-slate-600">{jp.apps}</td>
                      <td className="p-4 text-center font-bold text-purple-600">{jp.interviews}</td>
                      <td className="p-4 text-center font-bold text-emerald-600">{jp.hired}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                          jp.avgScore >= 70 ? "bg-emerald-100 text-emerald-700" :
                          jp.avgScore >= 40 ? "bg-amber-100 text-amber-700" :
                          jp.avgScore > 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-400"
                        }`}>
                          {jp.avgScore || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-black text-sm ${convRate > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                          {convRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ═══════ ROW 6: OPERASYONEL METRİKLER ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-emerald-200" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200">Ort. İşe Alım Süresi</span>
          </div>
          <p className="text-4xl font-black tracking-tighter">{stats.avgTimeToHire || "—"}</p>
          <p className="text-emerald-200 text-xs font-bold mt-1">gün ortalama</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-indigo-200" />
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-200">AI Eşleşme Sayısı</span>
          </div>
          <p className="text-4xl font-black tracking-tighter">{stats.matchScoreDistribution.reduce((s, d) => s + d.count, 0)}</p>
          <p className="text-indigo-200 text-xs font-bold mt-1">toplam analiz</p>
        </div>
        <div className="bg-gradient-to-br from-amber-600 to-orange-500 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-200" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">Aktif İlan Oranı</span>
          </div>
          <p className="text-4xl font-black tracking-tighter">
            {stats.totalJobs > 0 ? Math.round((stats.jobPerformance.filter(j => j.apps > 0).length / stats.totalJobs) * 100) : 0}%
          </p>
          <p className="text-amber-200 text-xs font-bold mt-1">başvuru alan ilanlar</p>
        </div>
      </div>
      {/* INVESTOR FOOTER */}
      <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center">
        <Sparkles size={32} className="mx-auto text-amber-400 mb-4" />
        <h3 className="text-xl font-black italic uppercase tracking-tight">
          Kariyeer AI-Powered Hiring Engine
        </h3>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Gemini AI entegrasyonu ile semantik profil-ilan eşleştirmesi, Jitsi üzerinden canlı mülakat,
          otomatik e-posta bildirimleri ve gerçek zamanlı işe alım analitiği.
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <div>
            <p className="text-2xl font-black text-amber-400">{stats.avgAIScore}/100</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AI Skoru</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-400">{stats.hireRate}%</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Dönüşüm</p>
          </div>
          <div>
            <p className="text-2xl font-black text-indigo-400">{stats.aiAccuracy}%</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AI Doğruluk</p>
          </div>
        </div>
      </div>
    </div>
  );
}
