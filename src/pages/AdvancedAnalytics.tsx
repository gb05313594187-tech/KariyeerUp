// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Brain, TrendingUp, Users, Briefcase, Video, CheckCircle2,
  XCircle, Clock, Target, Zap, Activity, BarChart3, PieChart,
  ArrowUpRight, Sparkles, Globe, Award,
  UserCheck, FileText, Send, Calendar, Star,
  Loader2, Building2, RefreshCw, DollarSign, CreditCard,
  Crown, Heart, Wallet, GraduationCap, BadgeCheck,
  UserPlus, TrendingDown, Percent
} from "lucide-react";

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
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
        <text x="60" y="55" textAnchor="middle" className="text-2xl font-black" fill="#1e293b">{pct}%</text>
        <text x="60" y="72" textAnchor="middle" className="text-[8px] font-bold uppercase" fill="#94a3b8">{value}/{total}</text>
      </svg>
      {label && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</span>}
    </div>
  );
}

/* =========================================================
   FORMAT HELPERS
   ========================================================= */
function formatMoney(n) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatNumber(n) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function AdvancedAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        { data: profiles },
        { data: coaches },
        { data: bookings },
        { data: payments },
        { data: subscriptions },
        { data: corpEntitlements },
        { data: jobs },
        { data: applications },
        { data: interviews },
        { data: matches },
      ] = await Promise.all([
        supabase.from("profiles").select("id, full_name, role, created_at, city, country, cv_data, is_premium, is_featured, is_verified"),
        supabase.from("coaches").select("*"),
        supabase.from("bookings").select("*"),
        supabase.from("payments").select("*"),
        supabase.from("subscriptions").select("*"),
        supabase.from("corporate_entitlements").select("*"),
        supabase.from("jobs").select("*"),
        supabase.from("job_applications").select("*"),
        supabase.from("interviews").select("*"),
        supabase.from("job_candidate_matches").select("*"),
      ]);

      const allProfiles = profiles || [];
      const allCoaches = coaches || [];
      const allBookings = bookings || [];
      const allPayments = payments || [];
      const allSubs = subscriptions || [];
      const allCorpEnt = corpEntitlements || [];
      const allJobs = jobs || [];
      const allApps = applications || [];
      const allInterviews = interviews || [];
      const allMatches = matches || [];

      /* ═══════════════════════════════════════════
         1. KULLANICI METRİKLERİ
         ═══════════════════════════════════════════ */
      const totalUsers = allProfiles.length;
      const usersByRole = {
        user: allProfiles.filter(p => p.role === "user").length,
        coach: allProfiles.filter(p => p.role === "coach").length,
        corporate: allProfiles.filter(p => p.role === "corporate").length,
        admin: allProfiles.filter(p => p.role === "admin").length,
      };
      const premiumUsers = allProfiles.filter(p => p.is_premium).length;
      const featuredUsers = allProfiles.filter(p => p.is_featured).length;
      const verifiedUsers = allProfiles.filter(p => p.is_verified).length;

      // Aylık üye büyümesi (son 6 ay)
      const monthlyGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const count = allProfiles.filter(p => {
          const cd = new Date(p.created_at);
          return cd >= monthStart && cd <= monthEnd;
        }).length;
        const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
        monthlyGrowth.push({ month: monthNames[d.getMonth()], count });
      }

      // Lokasyon dağılımı
      const locationMap = {};
      allProfiles.forEach(p => {
        const loc = p.country || p.city || "Bilinmiyor";
        locationMap[loc] = (locationMap[loc] || 0) + 1;
      });
      const topLocations = Object.entries(locationMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      /* ═══════════════════════════════════════════
         2. GELİR METRİKLERİ
         ═══════════════════════════════════════════ */
      // Ödeme gelirleri (PayTR vs.)
      const successPayments = allPayments.filter(p => (p.status || "").toLowerCase() === "success" || (p.status || "").toLowerCase() === "completed");
      const totalPaymentRevenue = successPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      // Abonelik/Rozet gelirleri
      const activeSubs = allSubs.filter(s => (s.status || "").toLowerCase() === "active");
      const totalSubRevenue = allSubs.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
      const blueTicks = allSubs.filter(s => s.badge_type === "blue").length;
      const goldTicks = allSubs.filter(s => s.badge_type === "gold").length;
      const activeBlue = activeSubs.filter(s => s.badge_type === "blue").length;
      const activeGold = activeSubs.filter(s => s.badge_type === "gold").length;

      // Koç seans gelirleri ve komisyonlar
      const approvedBookings = allBookings.filter(b => (b.status || "").toLowerCase() === "approved" || (b.status || "").toLowerCase() === "completed");
      const totalBookings = allBookings.length;
      const pendingBookings = allBookings.filter(b => (b.status || "").toLowerCase() === "pending").length;

      // Koç bazlı gelir hesaplama
      const coachRevenueMap = {};
      let totalCoachRevenue = 0;
      let totalPlatformCommission = 0;
      const COMMISSION_RATE = 0.20; // %20 platform komisyonu

      approvedBookings.forEach(b => {
        const coach = allCoaches.find(c => c.id === b.coach_id || c.user_id === b.coach_id);
        const sessionPrice = coach?.session_price || 1500; // varsayılan 1500 TL
        const commission = sessionPrice * COMMISSION_RATE;

        totalCoachRevenue += sessionPrice;
        totalPlatformCommission += commission;

        const coachName = coach?.full_name || "Bilinmiyor";
        if (!coachRevenueMap[coachName]) {
          coachRevenueMap[coachName] = { sessions: 0, revenue: 0, commission: 0, price: sessionPrice };
        }
        coachRevenueMap[coachName].sessions++;
        coachRevenueMap[coachName].revenue += sessionPrice;
        coachRevenueMap[coachName].commission += commission;
      });

      const coachPerformance = Object.entries(coachRevenueMap)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .map(([name, data]) => ({ name, ...data }));

      // Öne çıkan koç geliri
      const featuredCoaches = allCoaches.filter(c => {
        const profile = allProfiles.find(p => p.id === c.user_id);
        return profile?.is_featured;
      });
      const FEATURED_FEE = 2500; // öne çıkan koç ücreti
      const featuredRevenue = featuredCoaches.length * FEATURED_FEE;

      // Toplam platform geliri
      const totalRevenue = totalPaymentRevenue + totalSubRevenue + totalPlatformCommission + featuredRevenue;

      // Aylık gelir trendi
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        let rev = 0;
        // Ödemeler
        successPayments.forEach(p => {
          const pd = new Date(p.created_at);
          if (pd >= monthStart && pd <= monthEnd) rev += Number(p.amount) || 0;
        });
        // Abonelikler
        allSubs.forEach(s => {
          const sd = new Date(s.created_at);
          if (sd >= monthStart && sd <= monthEnd) rev += Number(s.amount) || 0;
        });
        // Koç komisyonları
        approvedBookings.forEach(b => {
          const bd = new Date(b.created_at);
          if (bd >= monthStart && bd <= monthEnd) {
            const coach = allCoaches.find(c => c.id === b.coach_id || c.user_id === b.coach_id);
            rev += (coach?.session_price || 1500) * COMMISSION_RATE;
          }
        });

        const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
        monthlyRevenue.push({ month: monthNames[d.getMonth()], revenue: Math.round(rev) });
      }

      /* ═══════════════════════════════════════════
         3. KOÇ METRİKLERİ
         ═══════════════════════════════════════════ */
      const activeCoaches = allCoaches.filter(c => c.is_active).length;
      const totalCoaches = allCoaches.length;
      const avgSessionPrice = allCoaches.length > 0
        ? Math.round(allCoaches.reduce((s, c) => s + (Number(c.session_price) || 0), 0) / allCoaches.length)
        : 0;
      const bookingFulfillmentRate = totalBookings > 0
        ? Math.round((approvedBookings.length / totalBookings) * 100)
        : 0;

      /* ═══════════════════════════════════════════
         4. KURUMSAL METRİKLER
         ═══════════════════════════════════════════ */
      const totalCorpSeats = allCorpEnt.reduce((s, e) => s + (e.seats_total || 0), 0);
      const usedCorpSeats = allCorpEnt.reduce((s, e) => s + (e.seats_used || 0), 0);
      const totalCorpSessions = allCorpEnt.reduce((s, e) => s + (e.sessions_total || 0), 0);
      const usedCorpSessions = allCorpEnt.reduce((s, e) => s + (e.sessions_used || 0), 0);
      const corpUtilization = totalCorpSeats > 0 ? Math.round((usedCorpSeats / totalCorpSeats) * 100) : 0;

      /* ═══════════════════════════════════════════
         5. İŞE ALIM & AI METRİKLERİ
         ═══════════════════════════════════════════ */
      const totalJobListings = allJobs.length;
      const totalApplications = allApps.length;
      const totalInterviewsCount = allInterviews.length;
      const totalHired = allApps.filter(a => a.status === "accepted").length;
      const totalRejected = allApps.filter(a => a.status === "rejected").length;

      const scores = allMatches.map(m => Number(m.fit_score)).filter(s => s > 0);
      const avgAIScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const hireRate = totalApplications > 0 ? Math.round((totalHired / totalApplications) * 100) : 0;
      const interviewRate = totalApplications > 0 ? Math.round((totalInterviewsCount / totalApplications) * 100) : 0;

      // AI Accuracy
      const hiredCandidateIds = allApps.filter(a => a.status === "accepted").map(a => a.candidate_id);
      const rejectedCandidateIds = allApps.filter(a => a.status === "rejected").map(a => a.candidate_id);
      const hiredScores = allMatches.filter(m => hiredCandidateIds.includes(m.candidate_id)).map(m => Number(m.fit_score));
      const rejectedScores = allMatches.filter(m => rejectedCandidateIds.includes(m.candidate_id)).map(m => Number(m.fit_score));
      const avgHiredScore = hiredScores.length > 0 ? hiredScores.reduce((a, b) => a + b, 0) / hiredScores.length : 0;
      const avgRejectedScore = rejectedScores.length > 0 ? rejectedScores.reduce((a, b) => a + b, 0) / rejectedScores.length : 0;
      const aiAccuracy = avgHiredScore > avgRejectedScore ? Math.min(95, Math.round((avgHiredScore / Math.max(avgHiredScore, avgRejectedScore, 1)) * 100)) : 50;

      // Skor dağılımı
      const scoreRanges = { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
      scores.forEach(s => {
        if (s <= 20) scoreRanges["0-20"]++;
        else if (s <= 40) scoreRanges["21-40"]++;
        else if (s <= 60) scoreRanges["41-60"]++;
        else if (s <= 80) scoreRanges["61-80"]++;
        else scoreRanges["81-100"]++;
      });
      const matchScoreDistribution = Object.entries(scoreRanges).map(([range, count]) => ({ range, count }));

      // Haftalık başvurular
      const weeklyApplications = [];
      for (let i = 7; i >= 0; i--) {
        const ws = new Date(); ws.setDate(ws.getDate() - i * 7);
        const we = new Date(ws); we.setDate(we.getDate() + 7);
        const count = allApps.filter(a => { const d = new Date(a.applied_at); return d >= ws && d < we; }).length;
        weeklyApplications.push({ week: `H${8 - i}`, count });
      }

      // Top skills
      const skillMap = {};
      allProfiles.forEach(p => {
        (p.cv_data?.skills || []).forEach(s => {
          const key = s.toLowerCase().trim();
          if (key) skillMap[key] = (skillMap[key] || 0) + 1;
        });
      });
      const topSkills = Object.entries(skillMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

      // Başvuru durumu
      const statusMap = {};
      allApps.forEach(a => { const s = a.status || "pending"; statusMap[s] = (statusMap[s] || 0) + 1; });
      const applicationsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

      // İlan bazlı performans
      const jobPerformance = allJobs.map(job => {
        const jApps = allApps.filter(a => a.job_id === job.post_id);
        const jInt = allInterviews.filter(i => i.job_id === job.post_id);
        const jHired = jApps.filter(a => a.status === "accepted").length;
        const jScores = allMatches.filter(m => m.job_id === job.post_id).map(m => Number(m.fit_score));
        const avgS = jScores.length > 0 ? Math.round(jScores.reduce((a, b) => a + b, 0) / jScores.length) : 0;
        return { position: job.position, apps: jApps.length, interviews: jInt.length, hired: jHired, avgScore: avgS };
      });

      // Ort. işe alım süresi
      let avgTimeToHire = 0;
      const hiredApps = allApps.filter(a => a.status === "accepted" && a.applied_at && a.updated_at);
      if (hiredApps.length > 0) {
        const td = hiredApps.reduce((sum, a) => sum + Math.max(0, (new Date(a.updated_at) - new Date(a.applied_at)) / 86400000), 0);
        avgTimeToHire = Math.round(td / hiredApps.length);
      }

      /* ═══════════════════════════════════════════
         SET STATE
         ═══════════════════════════════════════════ */
      setStats({
        // Users
        totalUsers, usersByRole, premiumUsers, featuredUsers, verifiedUsers,
        monthlyGrowth, topLocations,
        // Revenue
        totalRevenue, totalPaymentRevenue, totalSubRevenue, totalPlatformCommission,
        featuredRevenue, monthlyRevenue, COMMISSION_RATE,
        // Subscriptions
        blueTicks, goldTicks, activeBlue, activeGold, activeSubs: activeSubs.length, totalSubs: allSubs.length,
        // Coach
        totalCoaches, activeCoaches, avgSessionPrice, totalBookings,
        approvedBookings: approvedBookings.length, pendingBookings,
        bookingFulfillmentRate, coachPerformance, totalCoachRevenue,
        // Corporate
        totalCorpSeats, usedCorpSeats, totalCorpSessions, usedCorpSessions, corpUtilization,
        corpCount: usersByRole.corporate,
        // Hiring & AI
        totalJobListings, totalApplications, totalInterviewsCount, totalHired, totalRejected,
        avgAIScore, hireRate, interviewRate, aiAccuracy, avgTimeToHire,
        topSkills, applicationsByStatus, matchScoreDistribution,
        weeklyApplications, jobPerformance, totalMatches: allMatches.length,
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
            Investor Dashboard Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="text-center py-20 text-slate-400 font-bold">Veri yüklenemedi</div>;

  const maxMonthlyGrowth = Math.max(...stats.monthlyGrowth.map(m => m.count), 1);
  const maxMonthlyRev = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1);
  const maxWeekly = Math.max(...stats.weeklyApplications.map(w => w.count), 1);
  const maxScoreDist = Math.max(...stats.matchScoreDistribution.map(d => d.count), 1);

  const tabs = [
    { id: "overview", label: "Genel Bakış", icon: Activity },
    { id: "revenue", label: "Gelir & Finans", icon: DollarSign },
    { id: "coaches", label: "Koç Metrikleri", icon: GraduationCap },
    { id: "hiring", label: "İşe Alım & AI", icon: Brain },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            Investor <span className="text-red-600">Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Kariyeer Platform Analytics • Gerçek Zamanlı Veri
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}>
                <t.icon size={14} className={activeTab === t.id ? "text-red-600" : ""} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <button onClick={fetchStats} className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-xl transition-colors">
            <RefreshCw size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
         TAB: GENEL BAKIŞ
         ═══════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Hero KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HeroKPI label="Toplam Gelir" value={formatMoney(stats.totalRevenue)} icon={DollarSign} color="bg-emerald-600" subtext={`${stats.monthlyRevenue[5]?.revenue > 0 ? "Bu ay: " + formatMoney(stats.monthlyRevenue[5].revenue) : "Gelir bekleniyor"}`} />
            <HeroKPI label="Toplam Üye" value={formatNumber(stats.totalUsers)} icon={Users} color="bg-blue-600" subtext={`${stats.monthlyGrowth[5]?.count || 0} yeni bu ay`} />
            <HeroKPI label="Aktif Koçlar" value={`${stats.activeCoaches}/${stats.totalCoaches}`} icon={GraduationCap} color="bg-purple-600" subtext={`Ort. ${formatMoney(stats.avgSessionPrice)}/seans`} />
            <HeroKPI label="AI Eşleşme" value={stats.totalMatches} icon={Brain} color="bg-red-600" subtext={`Ort. skor: ${stats.avgAIScore}/100`} />
          </div>

          {/* Üye Dağılımı + Büyüme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Üye Rolleri */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users size={14} className="text-blue-500" /> Üye Dağılımı
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Bireysel", count: stats.usersByRole.user, icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
                  { label: "Koç", count: stats.usersByRole.coach, icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" },
                  { label: "Kurumsal", count: stats.usersByRole.corporate, icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Admin", count: stats.usersByRole.admin, icon: Crown, color: "text-amber-500", bg: "bg-amber-50" },
                ].map((r, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                    <div className={`w-10 h-10 ${r.bg} rounded-xl flex items-center justify-center`}>
                      <r.icon size={18} className={r.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800">{r.count}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-center">
                <div className="flex-1 p-3 bg-blue-50 rounded-xl">
                  <p className="text-lg font-black text-blue-600">{stats.premiumUsers}</p>
                  <p className="text-[8px] font-black text-blue-400 uppercase">Premium</p>
                </div>
                <div className="flex-1 p-3 bg-amber-50 rounded-xl">
                  <p className="text-lg font-black text-amber-600">{stats.featuredUsers}</p>
                  <p className="text-[8px] font-black text-amber-400 uppercase">Öne Çıkan</p>
                </div>
                <div className="flex-1 p-3 bg-emerald-50 rounded-xl">
                  <p className="text-lg font-black text-emerald-600">{stats.verifiedUsers}</p>
                  <p className="text-[8px] font-black text-emerald-400 uppercase">Onaylı</p>
                </div>
              </div>
            </div>

            {/* Aylık Üye Büyümesi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-500" /> Aylık Üye Büyümesi
              </h3>
              <div className="flex items-end gap-3 h-40">
                {stats.monthlyGrowth.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-black text-slate-600">{m.count}</span>
                    <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-28 flex items-end">
                      <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg transition-all duration-700"
                        style={{ height: `${(m.count / maxMonthlyGrowth) * 100}%`, minHeight: m.count > 0 ? "4px" : "0" }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lokasyon + Platform Özeti */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lokasyon */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe size={14} className="text-indigo-500" /> Top Lokasyonlar
              </h3>
              <div className="space-y-3">
                {stats.topLocations.map((loc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-black text-slate-700">{loc.name}</span>
                    <span className="text-xs font-black text-indigo-600">{loc.count} üye</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rozet Dağılımı */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BadgeCheck size={14} className="text-blue-500" /> Rozet & Abonelik
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-800">Mavi Tik</p>
                      <p className="text-[9px] text-blue-500">{stats.activeBlue} aktif</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-blue-600">{stats.blueTicks}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Crown size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-amber-800">Altın Tik</p>
                      <p className="text-[9px] text-amber-500">{stats.activeGold} aktif</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-amber-600">{stats.goldTicks}</span>
                </div>
              </div>
            </div>

            {/* Kurumsal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Building2 size={14} className="text-blue-500" /> Kurumsal Kullanım
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-3xl font-black text-slate-800">{stats.corpCount}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Kurumsal Müşteri</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-lg font-black text-blue-600">{stats.usedCorpSeats}/{stats.totalCorpSeats}</p>
                    <p className="text-[8px] font-black text-blue-400 uppercase">Koltuk</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <p className="text-lg font-black text-purple-600">{stats.usedCorpSessions}/{stats.totalCorpSessions}</p>
                    <p className="text-[8px] font-black text-purple-400 uppercase">Seans</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Kullanım: <span className="font-black text-slate-700">{stats.corpUtilization}%</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
         TAB: GELİR & FİNANS
         ═══════════════════════════════════════════════════ */}
      {activeTab === "revenue" && (
        <div className="space-y-8">
          {/* Gelir KPI */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <RevenueKPI label="Toplam Gelir" value={formatMoney(stats.totalRevenue)} icon={Wallet} color="from-emerald-600 to-emerald-500" />
            <RevenueKPI label="Ödeme Gelirleri" value={formatMoney(stats.totalPaymentRevenue)} icon={CreditCard} color="from-blue-600 to-blue-500" />
            <RevenueKPI label="Rozet Gelirleri" value={formatMoney(stats.totalSubRevenue)} icon={Award} color="from-amber-600 to-amber-500" />
            <RevenueKPI label="Koç Komisyonu" value={formatMoney(stats.totalPlatformCommission)} icon={Percent} color="from-purple-600 to-purple-500" />
            <RevenueKPI label="Öne Çıkan Gelir" value={formatMoney(stats.featuredRevenue)} icon={Star} color="from-pink-600 to-pink-500" />
          </div>

          {/* Gelir Dağılımı Donut + Aylık Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gelir Kaynakları */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-6">Gelir Dağılımı</h3>
              <div className="space-y-4">
                {[
                  { label: "Ödeme Sistemi (PayTR)", value: stats.totalPaymentRevenue, total: stats.totalRevenue, color: "#3b82f6" },
                  { label: "Premium Rozetler", value: stats.totalSubRevenue, total: stats.totalRevenue, color: "#f59e0b" },
                  { label: "Koç Komisyonu (%20)", value: stats.totalPlatformCommission, total: stats.totalRevenue, color: "#8b5cf6" },
                  { label: "Öne Çıkan Koçlar", value: stats.featuredRevenue, total: stats.totalRevenue, color: "#ec4899" },
                ].map((item, i) => {
                  const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 font-bold">{item.label}</span>
                        <span className="font-black">{formatMoney(item.value)} ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aylık Gelir Trendi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 size={14} className="text-emerald-500" /> Aylık Gelir Trendi
              </h3>
              <div className="flex items-end gap-3 h-40">
                {stats.monthlyRevenue.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black text-slate-500">{m.revenue > 0 ? formatMoney(m.revenue) : "—"}</span>
                    <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-28 flex items-end">
                      <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg transition-all duration-700"
                        style={{ height: `${(m.revenue / maxMonthlyRev) * 100}%`, minHeight: m.revenue > 0 ? "4px" : "0" }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Komisyon Modeli Açıklaması */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 p-6 rounded-2xl">
            <h3 className="text-sm font-black text-purple-800 mb-3">💰 Gelir Modeli</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-purple-100">
                <p className="font-black text-purple-600">%{Math.round(stats.COMMISSION_RATE * 100)} Komisyon</p>
                <p className="text-slate-500 mt-1">Her koç seansından platform komisyonu</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-purple-100">
                <p className="font-black text-amber-600">Mavi/Altın Tik</p>
                <p className="text-slate-500 mt-1">Aylık abonelik rozet satışı</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-purple-100">
                <p className="font-black text-pink-600">{formatMoney(2500)}/ay</p>
                <p className="text-slate-500 mt-1">Öne çıkan koç sponsorluk ücreti</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-purple-100">
                <p className="font-black text-blue-600">Kurumsal Paket</p>
                <p className="text-slate-500 mt-1">Koltuk + seans bazlı kurumsal satış</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
         TAB: KOÇ METRİKLERİ
         ═══════════════════════════════════════════════════ */}
      {activeTab === "coaches" && (
        <div className="space-y-8">
          {/* Koç KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Toplam Koç", value: stats.totalCoaches, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Aktif Koç", value: stats.activeCoaches, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Toplam Randevu", value: stats.totalBookings, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Karşılama Oranı", value: `${stats.bookingFulfillmentRate}%`, icon: Target, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <kpi.icon size={18} className={kpi.color} />
                </div>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{kpi.value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Randevu Durumu + Karşılama */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2rem] text-center shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Randevu Karşılama</h3>
              <Donut value={stats.approvedBookings} total={stats.totalBookings} color="#8b5cf6" label="Onaylanan" />
            </div>
            <div className="bg-white p-8 rounded-[2rem] text-center shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Bekleyen Randevu</h3>
              <Donut value={stats.pendingBookings} total={stats.totalBookings} color="#f59e0b" label="Bekliyor" />
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-500 p-8 rounded-[2rem] text-white text-center shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-200 mb-4">Toplam Koç Cirosu</h3>
              <p className="text-3xl font-black">{formatMoney(stats.totalCoachRevenue)}</p>
              <p className="text-purple-200 text-xs font-bold mt-2">Platform komisyonu: {formatMoney(stats.totalPlatformCommission)}</p>
            </div>
          </div>

          {/* Koç Performans Tablosu */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Star size={14} className="text-amber-500" /> Koç Bazlı Performans & Komisyon
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Koç</th>
                    <th className="p-4 text-center">Seans Sayısı</th>
                    <th className="p-4 text-center">Seans Ücreti</th>
                    <th className="p-4 text-center">Toplam Ciro</th>
                    <th className="p-4 text-center">Platform Komisyonu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.coachPerformance.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-bold">Henüz koç performans verisi yok</td></tr>
                  ) : (
                    stats.coachPerformance.map((cp, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-black text-sm text-slate-800">{cp.name}</td>
                        <td className="p-4 text-center font-bold text-slate-600">{cp.sessions}</td>
                        <td className="p-4 text-center font-bold text-slate-600">{formatMoney(cp.price)}</td>
                        <td className="p-4 text-center font-bold text-emerald-600">{formatMoney(cp.revenue)}</td>
                        <td className="p-4 text-center font-black text-purple-600">{formatMoney(cp.commission)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
         TAB: İŞE ALIM & AI
         ═══════════════════════════════════════════════════ */}
      {activeTab === "hiring" && (
        <div className="space-y-8">
          {/* AI KPI */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "Toplam İlan", value: stats.totalJobListings, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Başvuru", value: stats.totalApplications, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Mülakat", value: stats.totalInterviewsCount, icon: Video, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "İşe Alınan", value: stats.totalHired, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Reddedilen", value: stats.totalRejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
              { label: "Ort. AI Skor", value: stats.avgAIScore, icon: Brain, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <kpi.icon size={18} className={kpi.color} />
                </div>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{kpi.value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Oran Donutları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white text-center shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">İşe Alım Oranı</h3>
              <Donut value={stats.totalHired} total={stats.totalApplications} color="#10b981" label="Hire Rate" />
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold">
                <ArrowUpRight size={16} /> {stats.hireRate}% dönüşüm
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] text-center shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Mülakat Oranı</h3>
              <Donut value={stats.totalInterviewsCount} total={stats.totalApplications} color="#6366f1" label="Interview Rate" />
              <div className="mt-4 flex items-center justify-center gap-2 text-indigo-600 text-sm font-bold">
                <TrendingUp size={16} /> {stats.interviewRate}% geçiş
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] text-center shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">AI Doğruluk</h3>
              <Donut value={stats.aiAccuracy} total={100} color="#E63946" label="AI Accuracy" />
              <div className="mt-4 flex items-center justify-center gap-2 text-red-600 text-sm font-bold">
                <Sparkles size={16} /> Eşleşme doğruluğu
              </div>
            </div>
          </div>

          {/* Grafikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 size={14} className="text-blue-500" /> Haftalık Başvuru Trendi
              </h3>
              <div className="flex items-end gap-3 h-32">
                {stats.weeklyApplications.map((w, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black text-slate-600">{w.count}</span>
                    <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-24 flex items-end">
                      <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all duration-700"
                        style={{ height: `${(w.count / maxWeekly) * 100}%`, minHeight: w.count > 0 ? "4px" : "0" }} />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400">{w.week}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Brain size={14} className="text-red-500" /> AI Skor Dağılımı
              </h3>
              <div className="flex items-end gap-3 h-32">
                {stats.matchScoreDistribution.map((d, i) => {
                  const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"];
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] font-black text-slate-600">{d.count}</span>
                      <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-24 flex items-end">
                        <div className={`w-full ${colors[i]} rounded-lg transition-all duration-700`}
                          style={{ height: `${(d.count / maxScoreDist) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }} />
                      </div>
                      <span className="text-[8px] font-bold text-slate-400">{d.range}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Funnel + Top Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <PieChart size={14} className="text-purple-500" /> Başvuru Hunisi
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap size={14} className="text-amber-500" /> En Çok Aranan Yetenekler
              </h3>
              <div className="space-y-3">
                {stats.topSkills.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-8 font-bold">Yetenek verisi henüz yok</p>
                ) : stats.topSkills.map((skill, i) => {
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
                })}
              </div>
            </div>
          </div>

          {/* İlan Bazlı Performans */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} className="text-red-500" /> İlan Bazlı Performans
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
                    <th className="p-4 text-center">AI Skor</th>
                    <th className="p-4 text-center">Dönüşüm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.jobPerformance.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-bold">Henüz ilan verisi yok</td></tr>
                  ) : stats.jobPerformance.map((jp, i) => {
                    const conv = jp.apps > 0 ? Math.round((jp.hired / jp.apps) * 100) : 0;
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
                          }`}>{jp.avgScore || "—"}</span>
                        </td>
                        <td className="p-4 text-center font-black text-sm">{conv}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operasyonel */}
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
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-200">AI Eşleşme</span>
              </div>
              <p className="text-4xl font-black tracking-tighter">{stats.totalMatches}</p>
              <p className="text-indigo-200 text-xs font-bold mt-1">toplam analiz</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-500 p-6 rounded-2xl text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-amber-200" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">Aktif İlan Oranı</span>
              </div>
              <p className="text-4xl font-black tracking-tighter">
                {stats.totalJobListings > 0 ? Math.round((stats.jobPerformance.filter(j => j.apps > 0).length / stats.totalJobListings) * 100) : 0}%
              </p>
              <p className="text-amber-200 text-xs font-bold mt-1">başvuru alan ilanlar</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
         INVESTOR FOOTER
         ═══════════════════════════════════════════════════ */}
      <div className="bg-slate-900 text-white p-10 rounded-[2rem]">
        <div className="text-center mb-8">
          <Sparkles size={32} className="mx-auto text-amber-400 mb-4" />
          <h3 className="text-2xl font-black italic uppercase tracking-tight">
            Kariyeer AI-Powered Platform
          </h3>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl mx-auto">
            Türkiye'nin ilk AI destekli kariyer koçluğu ve işe alım platformu.
            Gemini AI ile semantik eşleştirme, Jitsi ile canlı mülakat, otomatik e-posta bildirimleri
            ve gerçek zamanlı yatırımcı analitiği.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          <div>
            <p className="text-2xl font-black text-emerald-400">{formatMoney(stats.totalRevenue)}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Toplam Gelir</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-400">{stats.totalUsers}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Toplam Üye</p>
          </div>
          <div>
            <p className="text-2xl font-black text-purple-400">{stats.totalCoaches}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Koç Sayısı</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">{stats.avgAIScore}/100</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">AI Skoru</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-400">{stats.hireRate}%</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Dönüşüm</p>
          </div>
          <div>
            <p className="text-2xl font-black text-red-400">{stats.aiAccuracy}%</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">AI Doğruluk</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   YARDIMCI BİLEŞENLER
   ========================================================= */
function HeroKPI({ label, value, icon: Icon, color, subtext }) {
  return (
    <div className={`${color} text-white p-6 rounded-[2rem] shadow-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</p>
          <p className="text-3xl font-black tracking-tighter mt-2">{value}</p>
          <p className="text-[10px] font-bold opacity-60 mt-1">{subtext}</p>
        </div>
        <div className="p-3 bg-white/10 rounded-xl">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function RevenueKPI({ label, value, icon: Icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white p-5 rounded-2xl shadow-lg`}>
      <Icon size={18} className="opacity-60 mb-2" />
      <p className="text-xl font-black tracking-tighter">{value}</p>
      <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mt-1">{label}</p>
    </div>
  );
}
