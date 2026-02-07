// @ts-nocheck
import { supabase, isSupabaseConfigured } from "./supabase";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

/* =========================================================
   TYPES
   ========================================================= */
export interface JobData {
  post_id: string;
  company_id: string;
  position: string;
  description: string;
  level: string;
  work_type: string;
  location_text: string;
  experience_range: string;
  salary_min: number;
  salary_max: number;
  custom_title: string;
  apply_deadline: string;
}

export interface MatchResult {
  job: JobData;
  score: number;
  explanation: string;
  mode: "standard" | "boost";
  strengths: string[];
  gaps: string[];
  details: {
    skillScore: number;
    locationScore: number;
    levelScore: number;
    languageScore: number;
  };
}

/* =========================================================
   FETCH JOBS
   ========================================================= */
export async function fetchAllJobs(): Promise<JobData[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("apply_deadline", { ascending: false });

  if (error) {
    console.error("Jobs fetch error:", error);
    return [];
  }
  return data || [];
}

/* =========================================================
   FETCH EXISTING MATCHES (DB'den kayıtlı eşleşmeler)
   ========================================================= */
export async function fetchExistingMatches(candidateId: string) {
  if (!isSupabaseConfigured) return [];

  const { data } = await supabase
    .from("job_candidate_matches")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("fit_score", { ascending: false });

  return data || [];
}

/* =========================================================
   STANDARD MATCH — Kelime/Kriter bazlı eşleşme
   ========================================================= */
export function standardMatch(profile: any, job: JobData): MatchResult {
  const skills: string[] = profile.cv_data?.skills || profile.skills || [];
  const jobText = `${job.position || ""} ${job.description || ""} ${job.custom_title || ""}`.toLowerCase();

  // ─── 1. SKILL MATCH (Ağırlık: %40) ───
  let skillHits = 0;
  const matchedSkills: string[] = [];
  skills.forEach((skill: string) => {
    const s = skill.toLowerCase().trim();
    if (s && jobText.includes(s)) {
      skillHits++;
      matchedSkills.push(skill);
    }
  });
  const skillScore =
    skills.length > 0
      ? Math.min(100, Math.round((skillHits / Math.max(skills.length * 0.5, 1)) * 100))
      : 0;

  // ─── 2. LOCATION MATCH (Ağırlık: %20) ───
  let locationScore = 0;
  const userCity = (profile.city || "").toLowerCase();
  const userCountry = (profile.country || "").toLowerCase();
  const jobLocation = (job.location_text || "").toLowerCase();
  const jobWorkType = (job.work_type || "").toLowerCase();

  if (
    jobWorkType.includes("remote") ||
    jobWorkType.includes("uzaktan") ||
    jobLocation.includes("remote") ||
    jobLocation.includes("uzaktan")
  ) {
    locationScore = 100;
  } else {
    if (userCity && jobLocation.includes(userCity)) locationScore = 100;
    else if (userCountry && (jobLocation.includes(userCountry) || jobLocation.includes("türkiye") || jobLocation.includes("turkey")))
      locationScore = 70;
    else locationScore = 15;
  }

  // ─── 3. LEVEL / EXPERIENCE MATCH (Ağırlık: %25) ───
  let levelScore = 0;
  const workExp = profile.cv_data?.work_experience || profile.work_experience || [];
  let totalYears = 0;
  workExp.forEach((w: any) => {
    const start = parseInt(w.start) || 0;
    const end = w.isCurrent ? new Date().getFullYear() : parseInt(w.end) || 0;
    if (start > 0 && end >= start) totalYears += end - start;
  });

  const jobLevel = (job.level || "").toLowerCase();
  const expRange = (job.experience_range || "").toLowerCase();
  const expNumbers = expRange.match(/(\d+)/g);
  const minExp = expNumbers ? parseInt(expNumbers[0]) : 0;

  if (jobLevel.includes("junior") || jobLevel.includes("entry")) {
    levelScore = totalYears <= 3 ? 100 : Math.max(50, 100 - (totalYears - 3) * 10);
  } else if (jobLevel.includes("mid")) {
    levelScore =
      totalYears >= 2 && totalYears <= 6
        ? 100
        : totalYears > 6
        ? 80
        : Math.max(30, totalYears * 30);
  } else if (jobLevel.includes("senior")) {
    levelScore =
      totalYears >= minExp
        ? 100
        : totalYears >= minExp * 0.6
        ? 70
        : Math.max(20, totalYears * 15);
  } else if (jobLevel.includes("executive") || jobLevel.includes("lead")) {
    levelScore = totalYears >= 8 ? 100 : Math.max(15, totalYears * 10);
  } else {
    levelScore = Math.min(80, totalYears * 12 + 20);
  }

  // ─── 4. LANGUAGE MATCH (Ağırlık: %15) ───
  let languageScore = 0;
  const userLangs = (profile.cv_data?.languages || profile.languages || []).map((l: any) =>
    (typeof l === "string" ? l : l.lang || "").toLowerCase()
  );

  if (userLangs.length > 0) {
    const hasEnglish = userLangs.some(
      (l: string) => l.includes("english") || l.includes("ingilizce") || l.includes("eng")
    );
    const hasTurkish = userLangs.some(
      (l: string) => l.includes("türkçe") || l.includes("turkish")
    );
    if (hasEnglish) languageScore += 50;
    if (hasTurkish) languageScore += 30;
    languageScore = Math.min(100, languageScore + userLangs.length * 10);
  }

  // ─── COMPOSITE SCORE ───
  const score = Math.round(
    skillScore * 0.4 + locationScore * 0.2 + levelScore * 0.25 + languageScore * 0.15
  );

  // ─── EXPLANATION ───
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (matchedSkills.length > 0) {
    strengths.push(`${matchedSkills.length} yetenek eşleşti: ${matchedSkills.join(", ")}`);
  } else if (skills.length > 0) {
    gaps.push("İlan gereksinimleriyle yetenek eşleşmesi düşük");
  } else {
    gaps.push("Profilde yetenek bilgisi yok — ekleyin");
  }

  if (locationScore >= 80) strengths.push("Lokasyon uyumlu");
  else if (locationScore < 50) gaps.push("Lokasyon farklı");

  if (levelScore >= 70) strengths.push(`${totalYears} yıl deneyim — seviye uygun`);
  else gaps.push(`İlan ${job.experience_range || job.level} istiyor, ${totalYears} yıl deneyiminiz var`);

  if (languageScore >= 60) strengths.push("Dil yetkinliği yeterli");
  else if (userLangs.length === 0) gaps.push("Profilde dil bilgisi yok");

  const explanation =
    strengths.length > 0 ? strengths.join(" • ") : "Detaylı analiz için AI Boost kullanın";

  return {
    job,
    score: Math.min(100, Math.max(0, score)),
    explanation,
    mode: "standard",
    strengths,
    gaps,
    details: { skillScore, locationScore, levelScore, languageScore },
  };
}

/* =========================================================
   BOOST MATCH — Gemini AI semantik analiz
   ========================================================= */
export async function boostMatch(profile: any, job: JobData): Promise<MatchResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API anahtarı bulunamadı");
  }

  const skills = profile.cv_data?.skills || profile.skills || [];
  const bio = profile.bio || profile.cv_data?.about || "";
  const workExp = profile.cv_data?.work_experience || profile.work_experience || [];
  const education = profile.cv_data?.education || profile.education || [];
  const languages = profile.cv_data?.languages || profile.languages || [];
  const certificates = profile.cv_data?.certificates || profile.certificates || [];

  const prompt = `Sen bir işe alım uzmanısın. Aşağıdaki aday profilini iş ilanıyla karşılaştır ve uygunluk analizi yap.

## ADAY PROFİLİ:
- Ad: ${profile.full_name || "Belirtilmemiş"}
- Hakkında: ${bio || "Belirtilmemiş"}
- Lokasyon: ${profile.city || ""}, ${profile.country || ""}
- Yetenekler: ${skills.join(", ") || "Belirtilmemiş"}
- İş Deneyimi: ${JSON.stringify(workExp)}
- Eğitim: ${JSON.stringify(education)}
- Diller: ${JSON.stringify(languages)}
- Sertifikalar: ${JSON.stringify(certificates)}

## İŞ İLANI:
- Pozisyon: ${job.position}
- Seviye: ${job.level}
- Açıklama: ${job.description}
- Lokasyon: ${job.location_text}
- Çalışma Tipi: ${job.work_type}
- Deneyim: ${job.experience_range}
- Maaş: ${job.salary_min || "?"} - ${job.salary_max || "?"} TL

## GÖREV:
1. Adayın bu ilana uygunluk puanını 0-100 arası ver
2. Neden bu puanı verdiğini 2-3 cümleyle Türkçe açıkla
3. Güçlü yönleri ve eksikleri Türkçe listele

SADECE aşağıdaki JSON formatında cevap ver, başka hiçbir şey yazma:
{"score": 75, "explanation": "Türkçe açıklama", "strengths": ["güçlü yön 1", "güçlü yön 2"], "gaps": ["eksik 1"]}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", response.status, errText);
    throw new Error(`Gemini API hatası: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("AI response not parseable:", text);
    throw new Error("AI yanıtı parse edilemedi");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    job,
    score: Math.min(100, Math.max(0, parsed.score || 0)),
    explanation: parsed.explanation || "AI analizi tamamlandı",
    mode: "boost",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    details: { skillScore: 0, locationScore: 0, levelScore: 0, languageScore: 0 },
  };
}

/* =========================================================
   SAVE MATCH TO DB
   ========================================================= */
export async function saveMatchToDB(
  candidateId: string,
  jobId: string,
  score: number,
  explanation: string,
  mode: "standard" | "boost"
) {
  if (!isSupabaseConfigured) return;

  const label = `[${mode.toUpperCase()}] ${explanation}`;

  try {
    // Delete existing match for this job+candidate combo
    await supabase
      .from("job_candidate_matches")
      .delete()
      .eq("job_id", jobId)
      .eq("candidate_id", candidateId);

    // Insert new match
    await supabase.from("job_candidate_matches").insert({
      job_id: jobId,
      candidate_id: candidateId,
      fit_score: score,
      explanation: label,
      language: "tr",
    });

    // If boost → also save to job_fit_explanations
    if (mode === "boost") {
      await supabase
        .from("job_fit_explanations")
        .delete()
        .eq("job_id", jobId)
        .eq("candidate_id", candidateId);

      await supabase.from("job_fit_explanations").insert({
        job_id: jobId,
        candidate_id: candidateId,
        fit_score: score,
        explanation: explanation,
        language: "tr",
      });
    }
  } catch (err) {
    console.error("Match save error:", err);
  }
}

/* =========================================================
   RUN ALL STANDARD MATCHES
   ========================================================= */
export async function runStandardMatching(
  profile: any,
  candidateId: string
): Promise<MatchResult[]> {
  const jobs = await fetchAllJobs();
  if (jobs.length === 0) return [];

  const results: MatchResult[] = [];

  for (const job of jobs) {
    const result = standardMatch(profile, job);
    results.push(result);
    await saveMatchToDB(candidateId, job.post_id, result.score, result.explanation, "standard");
  }

  return results.sort((a, b) => b.score - a.score);
}

/* =========================================================
   RUN ALL BOOST (AI) MATCHES
   ========================================================= */
export async function runBoostMatching(
  profile: any,
  candidateId: string
): Promise<MatchResult[]> {
  const jobs = await fetchAllJobs();
  if (jobs.length === 0) return [];

  const results: MatchResult[] = [];

  for (const job of jobs) {
    try {
      const result = await boostMatch(profile, job);
      results.push(result);
      await saveMatchToDB(candidateId, job.post_id, result.score, result.explanation, "boost");
    } catch (err) {
      console.error(`Boost match error for ${job.position}:`, err);
      // Fallback to standard if AI fails
      const fallback = standardMatch(profile, job);
      fallback.mode = "boost";
      fallback.explanation = "AI analizi başarısız, standart skor kullanıldı";
      results.push(fallback);
      await saveMatchToDB(candidateId, job.post_id, fallback.score, fallback.explanation, "standard");
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/* =========================================================
   HELPER
   ========================================================= */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}
