// src/lib/matchingService.ts
// @ts-nocheck
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/* =========================================================
   GEMINI API — DOĞRU MODEL
   ========================================================= */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.length > 10;
}

/* =========================================================
   TABLO ADLARI — TEK MERKEZDEN
   ========================================================= */
const TABLE_MATCHES = "matches";
const TABLE_JOBS = "jobs";

/* =========================================================
   TÜM İLANLARI ÇEK
   ========================================================= */
export async function fetchAllJobs(): Promise<any[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from(TABLE_JOBS)
      .select("*");

    if (error) {
      console.error("fetchAllJobs error:", error.message);
      return [];
    }
    console.log(`✅ ${(data || []).length} ilan yüklendi`);
    return data || [];
  } catch (err) {
    console.error("fetchAllJobs exception:", err);
    return [];
  }
}

/* =========================================================
   MEVCUT EŞLEŞMELERİ ÇEK
   ========================================================= */
export async function fetchExistingMatches(userId: string): Promise<any[]> {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from(TABLE_MATCHES)
      .select("*")
      .eq("user_id", userId)
      .order("fit_score", { ascending: false });

    if (error) {
      console.error("fetchExistingMatches error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("fetchExistingMatches exception:", err);
    return [];
  }
}

/* =========================================================
   EŞLEŞMEYİ KAYDET (UPSERT)
   ========================================================= */
async function saveMatch(
  userId: string,
  jobId: string,
  fitScore: number,
  explanation: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !userId || !jobId) return false;

  try {
    const { error } = await supabase
      .from(TABLE_MATCHES)
      .upsert(
        {
          user_id: userId,
          job_id: jobId,
          fit_score: fitScore,
          explanation: explanation,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,job_id",
        }
      );

    if (error) {
      console.error("saveMatch error:", error.message, error.details);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveMatch exception:", err);
    return false;
  }
}

/* =========================================================
   METİN NORMALLEŞTİRME
   ========================================================= */
function normalize(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   KELİME EŞLEŞME SKORU
   ========================================================= */
function wordMatchScore(profileText: string, jobText: string): number {
  const pWords = new Set(normalize(profileText).split(" ").filter(w => w.length >= 3));
  const jWords = new Set(normalize(jobText).split(" ").filter(w => w.length >= 3));

  if (jWords.size === 0) return 0;

  let matchCount = 0;
  for (const jWord of jWords) {
    for (const pWord of pWords) {
      if (pWord.includes(jWord) || jWord.includes(pWord)) {
        matchCount++;
        break;
      }
    }
  }

  return Math.min(100, Math.round((matchCount / jWords.size) * 100));
}

/* =========================================================
   STANDARD MATCHING — Kelime Bazlı
   ========================================================= */
interface MatchDetails {
  skillScore: number;
  locationScore: number;
  levelScore: number;
  languageScore: number;
}

interface MatchResult {
  score: number;
  explanation: string;
  strengths: string[];
  gaps: string[];
  details: MatchDetails;
}

function calculateStandardMatch(profile: any, job: any): MatchResult {
  const cv = profile.cv_data || {};
  const strengths: string[] = [];
  const gaps: string[] = [];

  // ─── 1. YETENEK SKORU (%40) ───
  const profileSkills = (cv.skills || []).join(" ");
  const profileExp = (cv.work_experience || [])
    .map((w: any) => `${w.role || ""} ${w.company || ""} ${w.desc || ""}`)
    .join(" ");
  const profileEdu = (cv.education || [])
    .map((e: any) => `${e.school || ""} ${e.field || ""} ${e.degree || ""}`)
    .join(" ");
  const profileAll = `${profileSkills} ${profileExp} ${profileEdu} ${profile.bio || ""}`;
  const jobText = `${job.position || ""} ${job.description || ""} ${job.custom_title || ""}`;

  const skillScore = wordMatchScore(profileAll, jobText);

  if (skillScore >= 60) {
    strengths.push("Yetenek ve deneyimleriniz ilanla yüksek oranda örtüşüyor.");
  } else if (skillScore >= 30) {
    strengths.push("Bazı yetenekleriniz ilanla uyumlu.");
    gaps.push("İlanda aranan bazı becerileri geliştirmeniz faydalı olabilir.");
  } else {
    gaps.push("İlana ait anahtar yetenekler profilinizde eksik görünüyor.");
  }

  // ─── 2. LOKASYON SKORU (%20) ───
  let locationScore = 50;
  const profileLocation = normalize(`${profile.city || ""} ${profile.country || ""}`);
  const jobLocation = normalize(job.location_text || "");
  const jobWorkType = normalize(job.work_type || "");

  if (jobWorkType.includes("remote") || jobWorkType.includes("uzaktan")) {
    locationScore = 100;
    strengths.push("Uzaktan çalışma — lokasyon engeli yok.");
  } else if (jobLocation && profileLocation) {
    if (profileLocation.includes(jobLocation) || jobLocation.includes(profileLocation)) {
      locationScore = 100;
      strengths.push("Lokasyonunuz ilanla uyumlu.");
    } else {
      const pCountry = normalize(profile.country || "");
      if (pCountry && jobLocation.includes(pCountry)) {
        locationScore = 60;
        gaps.push("Aynı ülkedesiniz ancak farklı şehir — taşınma gerekebilir.");
      } else {
        locationScore = 20;
        gaps.push("Lokasyonunuz ilan lokasyonundan farklı.");
      }
    }
  }

  // ─── 3. DENEYİM SEVİYESİ (%25) ───
  let levelScore = 50;
  let estimatedYears = 0;

  (cv.work_experience || []).forEach((w: any) => {
    const startYear = parseInt(w.start) || 0;
    const endYear = w.isCurrent ? new Date().getFullYear() : (parseInt(w.end) || 0);
    if (startYear > 0 && endYear >= startYear) {
      estimatedYears += (endYear - startYear);
    }
  });

  const jobLevel = normalize(job.level || "");

  if (jobLevel.includes("junior") || jobLevel.includes("entry") || jobLevel.includes("stajyer")) {
    levelScore = estimatedYears <= 3 ? 100 : 70;
    if (estimatedYears <= 3) strengths.push("Junior pozisyon için uygun deneyim seviyesi.");
  } else if (jobLevel.includes("mid") || jobLevel.includes("orta")) {
    if (estimatedYears >= 2 && estimatedYears <= 6) {
      levelScore = 100;
      strengths.push("Mid-Level pozisyona uygun deneyim.");
    } else if (estimatedYears >= 1) {
      levelScore = 60;
    } else {
      levelScore = 30;
      gaps.push("Bu pozisyon için daha fazla deneyim gerekebilir.");
    }
  } else if (jobLevel.includes("senior") || jobLevel.includes("kidemli")) {
    if (estimatedYears >= 5) {
      levelScore = 100;
      strengths.push("Senior seviye deneyiminiz mevcut.");
    } else if (estimatedYears >= 3) {
      levelScore = 50;
      gaps.push("Senior pozisyon için deneyim süreniz sınırda.");
    } else {
      levelScore = 20;
      gaps.push("Senior pozisyon için daha fazla deneyim gerekiyor.");
    }
  } else if (jobLevel.includes("lead") || jobLevel.includes("yonetici") || jobLevel.includes("executive")) {
    levelScore = estimatedYears >= 8 ? 100 : estimatedYears >= 5 ? 50 : 15;
    if (estimatedYears < 5) gaps.push("Yönetici pozisyonu için daha fazla deneyim gerekiyor.");
  } else {
    levelScore = (cv.work_experience || []).length > 0 ? 70 : 40;
  }

  // ─── 4. DİL SKORU (%15) ───
  let languageScore = 80;
  const profileLangs = (cv.languages || []).map((l: any) => normalize(l.lang || ""));
  const jobDesc = normalize(`${job.description || ""} ${job.position || ""}`);

  const langMap: Record<string, string[]> = {
    english: ["english", "ingilizce"],
    turkish: ["turkce", "turkish"],
    arabic: ["arabic", "arapca"],
    french: ["french", "fransizca"],
    german: ["german", "almanca"],
  };

  const requiredLangs: string[] = [];
  for (const [key, variants] of Object.entries(langMap)) {
    if (variants.some((v) => jobDesc.includes(v))) {
      requiredLangs.push(key);
    }
  }

  if (requiredLangs.length > 0) {
    let langMatches = 0;
    for (const req of requiredLangs) {
      const variants = langMap[req] || [req];
      const found = profileLangs.some((pLang) =>
        variants.some((v) => pLang.includes(v) || v.includes(pLang))
      );
      if (found) langMatches++;
    }
    languageScore = Math.round((langMatches / requiredLangs.length) * 100);

    if (langMatches === requiredLangs.length) {
      strengths.push("Tüm dil gereksinimlerini karşılıyorsunuz.");
    } else if (langMatches > 0) {
      gaps.push("Bazı dil gereksinimleri profilinizde eksik.");
    } else {
      gaps.push("İlanda belirtilen dil gereksinimlerini karşılamıyorsunuz.");
    }
  }

  // ─── TOPLAM SKOR ───
  const details: MatchDetails = { skillScore, locationScore, levelScore, languageScore };

  const totalScore = Math.max(0, Math.min(100, Math.round(
    skillScore * 0.40 +
    locationScore * 0.20 +
    levelScore * 0.25 +
    languageScore * 0.15
  )));

  let explanation: string;
  if (totalScore >= 80) {
    explanation = `Profiliniz bu ilan ile yüksek uyum gösteriyor. Yetenek: %${skillScore}, Lokasyon: %${locationScore}, Deneyim: %${levelScore}.`;
  } else if (totalScore >= 50) {
    explanation = `Orta düzeyde uyum. Bazı alanlarda güçlüsünüz ancak geliştirilecek yönler var. Genel: %${totalScore}.`;
  } else {
    explanation = `Düşük uyum. Eksik yetkinliklerinizi geliştirerek skoru artırabilirsiniz. Genel: %${totalScore}.`;
  }

  return { score: totalScore, explanation, strengths, gaps, details };
}

/* =========================================================
   STANDARD MATCHING — ÇALIŞTIR
   ========================================================= */
export async function runStandardMatching(profile: any, userId: string): Promise<any[]> {
  console.log("🔍 Standard matching başlıyor...");

  const jobs = await fetchAllJobs();
  if (jobs.length === 0) {
    console.warn("⚠️ Hiç iş ilanı bulunamadı");
    return [];
  }

  console.log(`📋 ${jobs.length} ilan bulundu, eşleştirme yapılıyor...`);
  const results: any[] = [];

  for (const job of jobs) {
    const { score, explanation, strengths, gaps, details } = calculateStandardMatch(profile, job);

    const saved = await saveMatch(userId, job.post_id, score, `[STANDARD] ${explanation}`);
    if (!saved) {
      console.warn(`⚠️ Eşleşme kaydedilemedi: job=${job.post_id}`);
    }

    results.push({
      job,
      score,
      explanation,
      mode: "standard" as const,
      strengths,
      gaps,
      details,
    });
  }

  results.sort((a, b) => b.score - a.score);
  console.log(`✅ Standard matching tamamlandı: ${results.length} sonuç`);
  return results;
}

/* =========================================================
   GEMINI API ÇAĞRISI
   ========================================================= */
async function callGeminiAPI(prompt: string): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini API Key yapılandırılmamış.");
  }

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  console.log(`🤖 Gemini çağrılıyor: ${GEMINI_MODEL}`);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini API error ${response.status}:`, errorBody);

    if (response.status === 404) {
      console.warn("⚠️ Model bulunamadı, fallback deneniyor...");
      return await callGeminiFallback(prompt);
    }

    throw new Error(`Gemini API hatası: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!text) throw new Error("Gemini boş yanıt döndürdü");

  return text.trim();
}

/* =========================================================
   GEMINI FALLBACK
   ========================================================= */
const FALLBACK_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
];

async function callGeminiFallback(prompt: string): Promise<string> {
  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`🔄 Fallback: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, topP: 0.8, maxOutputTokens: 1024 },
        }),
      });

      if (!response.ok) {
        console.warn(`❌ ${model}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (text) {
        console.log(`✅ Fallback başarılı: ${model}`);
        return text.trim();
      }
    } catch (err) {
      console.warn(`❌ ${model} hata:`, err);
    }
  }

  throw new Error("Tüm Gemini modelleri başarısız oldu.");
}

/* =========================================================
   AI BOOST — PROMPT
   ========================================================= */
function buildBoostPrompt(profile: any, job: any): string {
  const cv = profile.cv_data || {};

  const profileSummary = `
ADAY PROFİLİ:
- İsim: ${profile.full_name || "Belirtilmemiş"}
- Lokasyon: ${profile.city || ""}, ${profile.country || ""}
- Hakkında: ${profile.bio || "Belirtilmemiş"}
- Yetenekler: ${(cv.skills || []).join(", ") || "Belirtilmemiş"}
- İş Deneyimi: ${
    (cv.work_experience || [])
      .map((w: any) => `${w.role || "?"} @ ${w.company || "?"} (${w.start || "?"}-${w.isCurrent ? "Günümüz" : w.end || "?"}): ${w.desc || ""}`)
      .join("; ") || "Belirtilmemiş"
  }
- Eğitim: ${
    (cv.education || [])
      .map((e: any) => `${e.degree || "?"} ${e.field || "?"} @ ${e.school || "?"}`)
      .join("; ") || "Belirtilmemiş"
  }
- Diller: ${
    (cv.languages || [])
      .map((l: any) => `${l.lang || "?"} (${l.level || 1}/5)`)
      .join(", ") || "Belirtilmemiş"
  }
- Sertifikalar: ${
    (cv.certificates || [])
      .map((c: any) => `${c.name || "?"} (${c.issuer || "?"}, ${c.year || "?"})`)
      .join(", ") || "Yok"
  }`.trim();

  const jobSummary = `
İŞ İLANI:
- Pozisyon: ${job.position || job.custom_title || "Belirtilmemiş"}
- Açıklama: ${job.description || "Belirtilmemiş"}
- Seviye: ${job.level || "Belirtilmemiş"}
- Çalışma Tipi: ${job.work_type || "Belirtilmemiş"}
- Lokasyon: ${job.location_text || "Belirtilmemiş"}
- Deneyim: ${job.experience_range || "Belirtilmemiş"}
- Maaş: ${job.salary_min ? `${job.salary_min} - ${job.salary_max || "?"} ₺` : "Belirtilmemiş"}`.trim();

  return `Sen bir kariyer danışmanı ve iş eşleştirme uzmanısın.
Aşağıdaki aday profili ve iş ilanını detaylı analiz et.

${profileSummary}

${jobSummary}

LÜTFEN YANITI SADECE AŞAĞIDAKİ JSON FORMATINDA VER:
{
  "score": <0-100 arası uyum puanı>,
  "explanation": "<2-3 cümle Türkçe genel değerlendirme>",
  "strengths": ["<güçlü yön 1>", "<güçlü yön 2>"],
  "gaps": ["<gelişim alanı 1>", "<gelişim alanı 2>"]
}

Kurallar:
- score: 0-100 arası tam sayı
- explanation: Türkçe, 2-3 cümle
- strengths: en fazla 3 madde
- gaps: en fazla 3 madde
- SADECE JSON döndür, başka hiçbir metin ekleme`;
}

/* =========================================================
   GEMINI YANITI PARSE
   ========================================================= */
function parseGeminiResponse(text: string): {
  score: number;
  explanation: string;
  strengths: string[];
  gaps: string[];
} {
  try {
    let jsonStr = text;

    const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (blockMatch) {
      jsonStr = blockMatch[1];
    } else {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        jsonStr = text.substring(start, end + 1);
      }
    }

    const parsed = JSON.parse(jsonStr);

    return {
      score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
      explanation: String(parsed.explanation || "AI analizi tamamlandı."),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String).slice(0, 3) : [],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps.map(String).slice(0, 3) : [],
    };
  } catch (err) {
    console.error("Gemini parse error:", err);
    return {
      score: 50,
      explanation: "AI analizi tamamlandı ancak detaylı sonuç oluşturulamadı.",
      strengths: [],
      gaps: [],
    };
  }
}

/* =========================================================
   AI BOOST MATCHING — ÇALIŞTIR
   ========================================================= */
export async function runBoostMatching(profile: any, userId: string): Promise<any[]> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini API Key yapılandırılmamış.");
  }

  console.log("🚀 AI Boost başlıyor...");
  console.log(`🔑 Key: ${GEMINI_API_KEY.substring(0, 8)}...`);
  console.log(`🤖 Model: ${GEMINI_MODEL}`);

  const jobs = await fetchAllJobs();
  if (jobs.length === 0) {
    console.warn("⚠️ Hiç iş ilanı bulunamadı");
    return [];
  }

  console.log(`📋 ${jobs.length} ilan, AI analizi yapılıyor...`);
  const results: any[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const jobTitle = job.position || job.custom_title || "Bilinmeyen";
    console.log(`🔄 [${i + 1}/${jobs.length}] ${jobTitle}`);

    try {
      const prompt = buildBoostPrompt(profile, job);
      const rawResponse = await callGeminiAPI(prompt);
      const parsed = parseGeminiResponse(rawResponse);

      console.log(`✅ ${jobTitle}: Skor ${parsed.score}`);

      await saveMatch(userId, job.post_id, parsed.score, `[BOOST] ${parsed.explanation}`);

      results.push({
        job,
        score: parsed.score,
        explanation: parsed.explanation,
        mode: "boost" as const,
        strengths: parsed.strengths,
        gaps: parsed.gaps,
        details: { skillScore: 0, locationScore: 0, levelScore: 0, languageScore: 0 },
      });
    } catch (err: any) {
      console.error(`❌ AI hatası (${jobTitle}):`, err.message);

      const fallback = calculateStandardMatch(profile, job);
      await saveMatch(userId, job.post_id, fallback.score, `[BOOST-FALLBACK] ${fallback.explanation}`);

      results.push({
        job,
        score: fallback.score,
        explanation: `⚠️ AI başarısız, standart kullanıldı: ${fallback.explanation}`,
        mode: "boost" as const,
        strengths: fallback.strengths,
        gaps: [...fallback.gaps, "AI analizi yapılamadı — standart algoritma kullanıldı."],
        details: fallback.details,
      });
    }

    if (i < jobs.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  results.sort((a, b) => b.score - a.score);
  console.log(`🏁 AI Boost tamamlandı: ${results.length} sonuç`);
  return results;
}
