// src/lib/matchingService.ts
// AI Eşleşme Motoru - Aday↔İlan, Aday↔Koç, Şirket↔Aday
import { supabase, isSupabaseConfigured } from "./supabase";

/* =========================================================
   TYPES
   ========================================================= */
export interface MatchResult {
  id: string;
  type: "job" | "coach" | "candidate";
  targetId: string;
  targetName: string;
  targetTitle: string;
  matchScore: number; // 0-100
  matchReasons: string[];
  matchWeaknesses: string[];
  avatarUrl?: string;
  extra: Record<string, any>;
}

export interface MatchFilters {
  goal?: string;
  level?: string;
  sector?: string;
  language?: string;
  location?: string;
  minScore?: number;
}

/* =========================================================
   SCORING HELPERS
   ========================================================= */

// Metin benzerliği (basit keyword overlap)
function textSimilarity(a: string | null, b: string | null): number {
  if (!a || !b) return 0;
  const wordsA = a.toLowerCase().split(/[\s,;|·•]+/).filter(Boolean);
  const wordsB = b.toLowerCase().split(/[\s,;|·•]+/).filter(Boolean);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  const intersection = wordsA.filter((w) => wordsB.some((wb) => wb.includes(w) || w.includes(wb)));
  return (intersection.length / Math.max(wordsA.length, wordsB.length)) * 100;
}

// JSONB array benzerliği
function jsonbArraySimilarity(a: any, b: any): number {
  const arrA = Array.isArray(a) ? a.map((x: any) => (typeof x === "string" ? x.toLowerCase() : JSON.stringify(x).toLowerCase())) : [];
  const arrB = Array.isArray(b) ? b.map((x: any) => (typeof x === "string" ? x.toLowerCase() : JSON.stringify(x).toLowerCase())) : [];
  if (arrA.length === 0 || arrB.length === 0) return 0;
  const matches = arrA.filter((ia: string) => arrB.some((ib: string) => ib.includes(ia) || ia.includes(ib)));
  return (matches.length / Math.max(arrA.length, arrB.length)) * 100;
}

// Exact match bonus
function exactMatch(a: string | null, b: string | null, bonus = 15): number {
  if (!a || !b) return 0;
  return a.toLowerCase().trim() === b.toLowerCase().trim() ? bonus : 0;
}

// Weighted score calculator
function calculateWeightedScore(scores: { score: number; weight: number }[]): number {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = scores.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight;
  return Math.min(100, Math.round(weighted));
}

/* =========================================================
   ADAY ↔ İLAN EŞLEŞMESİ
   ========================================================= */
export async function matchCandidateToJobs(
  candidateId: string,
  filters?: MatchFilters
): Promise<MatchResult[]> {
  if (!isSupabaseConfigured) return [];

  // Aday profilini çek
  const { data: candidate } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (!candidate) return [];

  // İlanları çek
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!jobs || jobs.length === 0) return [];

  const results: MatchResult[] = jobs.map((job) => {
    const scores = [
      // Sektör uyumu
      { score: exactMatch(candidate.sector, job.sector, 100), weight: 25 },
      // Pozisyon/Title uyumu
      { score: textSimilarity(candidate.title, job.position), weight: 20 },
      // Level uyumu
      { score: exactMatch(candidate.experience_years, job.level, 100), weight: 15 },
      // Konum uyumu
      { score: exactMatch(candidate.city, job.location_text, 100), weight: 10 },
      // Dil uyumu
      { score: jsonbArraySimilarity(candidate.languages, job.required_languages), weight: 10 },
      // Yetkinlik uyumu
      { score: jsonbArraySimilarity(candidate.superpowers, job.required_skills), weight: 15 },
      // Hedef uyumu
      { score: jsonbArraySimilarity(candidate.goals, [job.work_type, job.position]), weight: 5 },
    ];

    const matchScore = calculateWeightedScore(scores);

    // Eşleşme nedenleri
    const reasons: string[] = [];
    const weaknesses: string[] = [];

    if (scores[0].score > 50) reasons.push("Sektör uyumu yüksek");
    else if (scores[0].score === 0) weaknesses.push("Farklı sektör");

    if (scores[1].score > 40) reasons.push("Pozisyon uyumu güçlü");
    if (scores[2].score > 50) reasons.push("Seviye eşleşiyor");
    if (scores[3].score > 50) reasons.push("Konum uyumlu");
    if (scores[5].score > 30) reasons.push("Yetkinlik örtüşmesi var");
    else weaknesses.push("Bazı yetkinlikler eksik");

    return {
      id: `match-${candidateId}-${job.post_id}`,
      type: "job" as const,
      targetId: job.post_id,
      targetName: job.company_name || "Şirket",
      targetTitle: job.position || "Pozisyon",
      matchScore,
      matchReasons: reasons,
      matchWeaknesses: weaknesses,
      extra: {
        location: job.location_text,
        workType: job.work_type,
        level: job.level,
        salary: job.salary_range,
        companyId: job.company_id,
      },
    };
  });

  // Filtrele ve sırala
  let filtered = results.filter((r) => r.matchScore >= (filters?.minScore || 20));

  if (filters?.sector) {
    filtered = filtered.filter((r) => r.extra.sector === filters.sector);
  }

  return filtered.sort((a, b) => b.matchScore - a.matchScore).slice(0, 20);
}

/* =========================================================
   ŞİRKET ↔ ADAY EŞLEŞMESİ
   ========================================================= */
export async function matchJobToCandidates(
  jobId: string,
  filters?: MatchFilters
): Promise<MatchResult[]> {
  if (!isSupabaseConfigured) return [];

  // İlanı çek
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("post_id", jobId)
    .single();

  if (!job) return [];

  // Adayları çek (sadece user rolündekiler)
  const { data: candidates } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["user", null])
    .order("created_at", { ascending: false })
    .limit(200);

  if (!candidates || candidates.length === 0) return [];

  const results: MatchResult[] = candidates
    .filter((c) => c.full_name || c.email) // En azından ismi veya emaili olanlar
    .map((candidate) => {
      const scores = [
        { score: exactMatch(candidate.sector, job.sector, 100), weight: 25 },
        { score: textSimilarity(candidate.title, job.position), weight: 20 },
        { score: exactMatch(candidate.experience_years, job.level, 100), weight: 15 },
        { score: exactMatch(candidate.city, job.location_text, 100), weight: 10 },
        { score: jsonbArraySimilarity(candidate.languages, job.required_languages), weight: 10 },
        { score: jsonbArraySimilarity(candidate.superpowers, job.required_skills), weight: 15 },
        { score: jsonbArraySimilarity(candidate.goals, [job.work_type, job.position]), weight: 5 },
      ];

      const matchScore = calculateWeightedScore(scores);

      const reasons: string[] = [];
      const weaknesses: string[] = [];

      if (scores[0].score > 50) reasons.push("Sektör deneyimi var");
      if (scores[1].score > 40) reasons.push("Pozisyon uyumu güçlü");
      if (scores[2].score > 50) reasons.push("Deneyim seviyesi uygun");
      if (scores[5].score > 30) reasons.push("İstenen yetkinliklere sahip");
      if (scores[0].score === 0) weaknesses.push("Farklı sektörden");
      if (scores[5].score === 0) weaknesses.push("Yetkinlik bilgisi eksik");

      return {
        id: `match-${jobId}-${candidate.id}`,
        type: "candidate" as const,
        targetId: candidate.id,
        targetName: candidate.full_name || candidate.email?.split("@")[0] || "Aday",
        targetTitle: candidate.title || candidate.headline || "—",
        matchScore,
        matchReasons: reasons,
        matchWeaknesses: weaknesses,
        avatarUrl: candidate.avatar_url,
        extra: {
          email: candidate.email,
          city: candidate.city,
          sector: candidate.sector,
          experience: candidate.experience_years,
          isPremium: candidate.is_premium,
        },
      };
    });

  let filtered = results.filter((r) => r.matchScore >= (filters?.minScore || 20));

  return filtered.sort((a, b) => b.matchScore - a.matchScore).slice(0, 30);
}

/* =========================================================
   ADAY ↔ KOÇ EŞLEŞMESİ
   ========================================================= */
export async function matchCandidateToCoaches(
  candidateId: string,
  filters?: MatchFilters
): Promise<MatchResult[]> {
  if (!isSupabaseConfigured) return [];

  const { data: candidate } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (!candidate) return [];

  // Koçları çek
  const { data: coaches } = await supabase
    .from("app_2dff6511da_coaches")
    .select("*")
    .order("rating", { ascending: false });

  if (!coaches || coaches.length === 0) return [];

  const results: MatchResult[] = coaches.map((coach) => {
    const candidateGoals = Array.isArray(candidate.goals)
      ? candidate.goals.map((g: any) => (typeof g === "string" ? g : g.label || g.name || ""))
      : [];

    const scores = [
      // Uzmanlık alanı ↔ Aday hedefi
      {
        score: jsonbArraySimilarity(
          coach.specializations || [coach.specialization],
          candidateGoals
        ),
        weight: 30,
      },
      // Sektör uyumu
      { score: textSimilarity(coach.title, candidate.sector), weight: 15 },
      // Dil uyumu
      {
        score: textSimilarity(
          coach.languages,
          Array.isArray(candidate.languages)
            ? candidate.languages.map((l: any) => (typeof l === "string" ? l : l.name || "")).join(",")
            : ""
        ),
        weight: 15,
      },
      // Rating bonusu
      { score: Math.min(100, (Number(coach.rating) || 0) * 20), weight: 20 },
      // Deneyim bonusu
      { score: Math.min(100, (coach.experience_years || 0) * 10), weight: 10 },
      // Konum (opsiyonel)
      { score: textSimilarity(coach.location, candidate.city), weight: 10 },
    ];

    const matchScore = calculateWeightedScore(scores);

    const reasons: string[] = [];
    if (scores[0].score > 30) reasons.push("Hedeflerinle örtüşen uzmanlık");
    if (scores[1].score > 30) reasons.push("Sektör deneyimi var");
    if (scores[3].score > 80) reasons.push("Yüksek puan");
    if (scores[4].score > 50) reasons.push("Deneyimli koç");

    return {
      id: `match-coach-${candidateId}-${coach.id}`,
      type: "coach" as const,
      targetId: coach.id,
      targetName: coach.full_name || "Koç",
      targetTitle: coach.title || "Kariyer Koçu",
      matchScore,
      matchReasons: reasons,
      matchWeaknesses: [],
      avatarUrl: coach.avatar_url,
      extra: {
        hourlyRate: coach.hourly_rate,
        rating: coach.rating,
        totalReviews: coach.total_reviews,
        userId: coach.user_id,
        slug: coach.slug,
      },
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}

/* =========================================================
   EŞLEŞMEYİ KAYDET (matches tablosu)
   ========================================================= */
export async function saveMatch(
  userId: string,
  targetId: string,
  matchType: "job" | "coach" | "candidate",
  score: number,
  reasons: string[]
): Promise<boolean> {
  try {
    const { error } = await supabase.from("matches").insert({
      user_id: userId,
      target_id: targetId,
      match_type: matchType,
      score,
      reasons,
      status: "new",
    });
    return !error;
  } catch {
    return false;
  }
}

/* =========================================================
   AI RAPOR SERVİSİ (Corporate Dashboard için)
   ========================================================= */
export const aiReportService = {
  // Aday hakkında AI insight getir
  async getCandidateInsight(candidateId: string, jobId: string) {
    const { data } = await supabase
      .from("ai_candidate_insights")
      .select("*")
      .eq("candidate_id", candidateId)
      .eq("job_id", jobId)
      .maybeSingle();
    return data;
  },

  // AI karar açıklanabilirlik raporu
  async getDecisionExplainability(candidateId: string) {
    const { data } = await supabase
      .from("ai_decision_explainability")
      .select("*")
      .eq("candidate_id", candidateId)
      .limit(1);
    return data?.[0] || null;
  },

  // Board kontrol paneli
  async getBoardControlPanel() {
    const { data } = await supabase
      .from("ai_board_control_panel")
      .select("*")
      .limit(1);
    return data?.[0] || null;
  },

  // Recruitment KPI
  async getRecruitmentKPI() {
    const { data } = await supabase
      .from("ai_recruitment_kpi")
      .select("*")
      .limit(1);
    return data?.[0] || null;
  },

  // Drift monitoring
  async getDriftMonitoring() {
    const { data } = await supabase
      .from("ai_drift_monitoring")
      .select("*")
      .order("period", { ascending: false })
      .limit(6);
    return data || [];
  },

  // Bias & Fairness raporu
  async getBiasFairnessReport() {
    const { data } = await supabase
      .from("ai_bias_fairness_report")
      .select("*");
    return data || [];
  },

  // AI raporu email ile gönder
  async sendAIReport(candidateId: string, jobId: string, recipientEmail: string) {
    const insight = await this.getCandidateInsight(candidateId, jobId);
    const explainability = await this.getDecisionExplainability(candidateId);

    if (!insight) return { success: false, error: "AI insight bulunamadı" };

    // Edge function ile email gönder
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-company-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `AI Aday Raporu - ${insight.candidate_id}`,
          templateType: "ai_candidate_report",
          data: {
            insight,
            explainability,
            generatedAt: new Date().toISOString(),
          },
        }),
      }
    );

    return res.json();
  },

  // Olumlu adaya Jitsi link gönder
  async sendInterviewInvite(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    scheduledAt: string,
    jitsiRoom: string
  ) {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const jitsiUrl = `https://meet.jit.si/${jitsiRoom}`;

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-company-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: candidateEmail,
          subject: `Mülakat Daveti - ${jobTitle}`,
          templateType: "interview_invite",
          data: {
            candidateName,
            jobTitle,
            scheduledAt,
            jitsiUrl,
            jitsiRoom,
          },
        }),
      }
    );

    return res.json();
  },
};

/* =========================================================
   BOOST SERVİSİ
   ========================================================= */
export const boostService = {
  // Koç boost satın al
  async purchaseCoachBoost(coachUserId: string, durationDays = 30) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // Profiles tablosunu güncelle
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        is_featured: true,
        featured_until: endDate.toISOString(),
      })
      .eq("id", coachUserId);

    if (profileErr) return { success: false, error: profileErr.message };

    // Coaches tablosunu da güncelle (eğer varsa)
    await supabase
      .from("app_2dff6511da_coaches")
      .update({ status: "featured" })
      .eq("user_id", coachUserId);

    return { success: true, featuredUntil: endDate.toISOString() };
  },

  // Koç boost durumunu kontrol et
  async checkCoachBoost(coachUserId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("is_featured, featured_until")
      .eq("id", coachUserId)
      .single();

    if (!data) return { isFeatured: false };

    const isActive = data.is_featured && data.featured_until && new Date(data.featured_until) > new Date();

    // Süresi geçmişse otomatik kapat
    if (data.is_featured && !isActive) {
      await supabase
        .from("profiles")
        .update({ is_featured: false, featured_until: null })
        .eq("id", coachUserId);
      return { isFeatured: false };
    }

    return {
      isFeatured: isActive,
      featuredUntil: data.featured_until,
    };
  },

  // İlan boost satın al
  async purchaseJobBoost(jobId: string, durationDays = 14) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const { error } = await supabase
      .from("jobs")
      .update({
        is_boosted: true,
        boosted_until: endDate.toISOString(),
      })
      .eq("post_id", jobId);

    if (error) return { success: false, error: error.message };
    return { success: true, boostedUntil: endDate.toISOString() };
  },

  // Boost'lu ilanları getir (üstte gösterilecek)
  async getBoostedJobs() {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_boosted", true)
      .gte("boosted_until", new Date().toISOString())
      .order("boosted_until", { ascending: false });
    return data || [];
  },

  // Öne çıkan koçları getir
  async getFeaturedCoaches() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_featured", true)
      .eq("is_coach", true)
      .gte("featured_until", new Date().toISOString())
      .order("rating", { ascending: false });
    return data || [];
  },
};
// fetchExistingMatches — UserProfile.tsx için gerekli
export async function fetchExistingMatches(userId: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("user_id", userId)
    .order("score", { ascending: false });

  if (error) {
    console.error("fetchExistingMatches error:", error);
    return [];
  }
  return data || [];
}
// =========================================================
// UserProfile.tsx için gerekli eksik fonksiyonlar
// =========================================================

export async function fetchAllJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("fetchAllJobs error:", error);
    return [];
  }
  return data || [];
}

export async function runStandardMatching(userId: string) {
  const results = await matchCandidateToJobs(userId);
  for (const r of results.slice(0, 10)) {
    await saveMatch(userId, r.targetId, "job", r.matchScore, r.matchReasons);
  }
  return results;
}

export async function runBoostMatching(userId: string) {
  const { data: credits } = await supabase
    .from("user_boost_credits")
    .select("balance")
    .eq("user_id", userId)
    .eq("credit_type", "ai_match")
    .maybeSingle();

  if (!credits || credits.balance <= 0) {
    return { success: false, error: "Yetersiz AI Match kredisi" };
  }

  const results = await matchCandidateToJobs(userId, { minScore: 50 });

  await supabase
    .from("user_boost_credits")
    .update({ balance: credits.balance - 1 })
    .eq("user_id", userId)
    .eq("credit_type", "ai_match");

  for (const r of results.slice(0, 20)) {
    await saveMatch(userId, r.targetId, "job", r.matchScore, r.matchReasons);
  }

  return { success: true, results };
}

export function isGeminiConfigured(): boolean {
  return !!(import.meta.env.VITE_GEMINI_API_KEY);
}
