/**
 * AI-Powered Analytics and Quality Control System
 * Provides advanced metrics, sentiment analysis, and coach performance scoring
 */

export interface CoachMetrics {
  coachId: string;
  coachName: string;
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  averageRating: number;
  totalReviews: number;
  reviewRate: number; // Percentage of sessions with reviews
  lowRatedSessions: number; // Sessions with ≤3 stars
  lowRatedRate: number;
  repeatSessionRate: number; // Percentage of returning clients
  totalRevenue: number;
  averageRevenue: number;
  averageSessionDuration: number;
  plannedSessionDuration: number;
  completionRate: number;
  responseRate: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface CoachKPI {
  coachId: string;
  coachName: string;
  kpiScore: number; // 0-100
  performanceLevel: 'excellent' | 'good' | 'average' | 'needs_improvement' | 'at_risk';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  riskFactors: string[];
  isRisky: boolean;
}

export interface SentimentAnalysis {
  reviewId: string;
  rating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  categories: string[];
  keywords: string[];
  issues: string[];
}

export interface PlatformMetrics {
  totalCoaches: number;
  totalSessions: number;
  totalRevenue: number;
  averageRating: number;
  overallReviewRate: number;
  overallCompletionRate: number;
  overallNoShowRate: number;
  riskyCoachCount: number;
  excellentCoachCount: number;
}

/**
 * Calculate Coach Performance Index (KPI Score)
 * Weighted formula based on multiple metrics
 */
export function calculateCoachKPI(metrics: CoachMetrics): CoachKPI {
  // Weights for different metrics
  const weights = {
    rating: 0.25,           // 25% - Customer satisfaction
    completion: 0.20,       // 20% - Session completion rate
    review: 0.15,           // 15% - Review engagement
    repeat: 0.15,           // 15% - Client retention
    noShow: 0.10,           // 10% - Reliability (inverse)
    cancellation: 0.10,     // 10% - Commitment (inverse)
    lowRated: 0.05,         // 5% - Quality consistency (inverse)
  };

  // Normalize metrics to 0-100 scale
  const ratingScore = (metrics.averageRating / 5) * 100;
  const completionScore = metrics.completionRate;
  const reviewScore = metrics.reviewRate;
  const repeatScore = metrics.repeatSessionRate;
  const noShowScore = 100 - metrics.noShowRate;
  const cancellationScore = 100 - metrics.cancellationRate;
  const lowRatedScore = 100 - metrics.lowRatedRate;

  // Calculate weighted KPI score
  const kpiScore = Math.round(
    ratingScore * weights.rating +
    completionScore * weights.completion +
    reviewScore * weights.review +
    repeatScore * weights.repeat +
    noShowScore * weights.noShow +
    cancellationScore * weights.cancellation +
    lowRatedScore * weights.lowRated
  );

  // Determine performance level
  let performanceLevel: CoachKPI['performanceLevel'];
  if (kpiScore >= 90) performanceLevel = 'excellent';
  else if (kpiScore >= 75) performanceLevel = 'good';
  else if (kpiScore >= 60) performanceLevel = 'average';
  else if (kpiScore >= 40) performanceLevel = 'needs_improvement';
  else performanceLevel = 'at_risk';

  // Identify strengths
  const strengths: string[] = [];
  if (metrics.averageRating >= 4.5) strengths.push('Yüksek müşteri memnuniyeti');
  if (metrics.completionRate >= 90) strengths.push('Mükemmel tamamlanma oranı');
  if (metrics.reviewRate >= 70) strengths.push('Yüksek değerlendirme katılımı');
  if (metrics.repeatSessionRate >= 50) strengths.push('Güçlü müşteri sadakati');
  if (metrics.noShowRate <= 5) strengths.push('Yüksek güvenilirlik');

  // Identify weaknesses
  const weaknesses: string[] = [];
  if (metrics.averageRating < 4.0) weaknesses.push('Düşük müşteri memnuniyeti');
  if (metrics.completionRate < 70) weaknesses.push('Düşük tamamlanma oranı');
  if (metrics.reviewRate < 40) weaknesses.push('Yetersiz değerlendirme katılımı');
  if (metrics.repeatSessionRate < 30) weaknesses.push('Düşük müşteri sadakati');
  if (metrics.noShowRate > 15) weaknesses.push('Güvenilirlik sorunları');
  if (metrics.cancellationRate > 20) weaknesses.push('Yüksek iptal oranı');
  if (metrics.lowRatedRate > 15) weaknesses.push('Tutarsız hizmet kalitesi');

  // Generate recommendations
  const recommendations: string[] = [];
  if (metrics.averageRating < 4.5) {
    recommendations.push('Müşteri geri bildirimlerini inceleyin ve hizmet kalitesini artırın');
  }
  if (metrics.reviewRate < 60) {
    recommendations.push('Seanslardan sonra değerlendirme almayı teşvik edin');
  }
  if (metrics.repeatSessionRate < 40) {
    recommendations.push('Müşteri ilişkilerini güçlendirin ve takip seansları önerin');
  }
  if (metrics.noShowRate > 10) {
    recommendations.push('Randevu hatırlatmalarını artırın ve iletişimi iyileştirin');
  }
  if (metrics.cancellationRate > 15) {
    recommendations.push('İptal nedenlerini analiz edin ve önleyici tedbirler alın');
  }

  // Identify risk factors
  const riskFactors: string[] = [];
  if (metrics.averageRating < 3.5) riskFactors.push('Kritik düşük puan');
  if (metrics.lowRatedRate > 20) riskFactors.push('Yüksek düşük puan oranı');
  if (metrics.noShowRate > 20) riskFactors.push('Çok yüksek no-show oranı');
  if (metrics.cancellationRate > 25) riskFactors.push('Aşırı iptal oranı');
  if (metrics.completionRate < 60) riskFactors.push('Çok düşük tamamlanma oranı');

  const isRisky = riskFactors.length >= 2 || kpiScore < 50;

  return {
    coachId: metrics.coachId,
    coachName: metrics.coachName,
    kpiScore,
    performanceLevel,
    strengths,
    weaknesses,
    recommendations,
    riskFactors,
    isRisky,
  };
}

/**
 * Analyze review sentiment using keyword-based NLP
 * In production, this would use a proper NLP API (OpenAI, Google NLP, etc.)
 */
export function analyzeSentiment(reviewText: string, rating: number): SentimentAnalysis {
  const text = reviewText.toLowerCase();

  // Positive keywords
  const positiveKeywords = [
    'harika', 'mükemmel', 'muhteşem', 'profesyonel', 'yardımcı', 'faydalı',
    'başarılı', 'etkili', 'güzel', 'iyi', 'tavsiye', 'teşekkür', 'memnun',
    'deneyimli', 'bilgili', 'anlayışlı', 'empatik', 'samimi', 'güvenilir'
  ];

  // Negative keywords
  const negativeKeywords = [
    'kötü', 'berbat', 'yetersiz', 'başarısız', 'hayal kırıklığı', 'sorun',
    'problem', 'gecikme', 'iptal', 'ilgisiz', 'anlayışsız', 'pahalı',
    'zaman kaybı', 'faydasız', 'etkisiz', 'amatör', 'deneyimsiz'
  ];

  // Issue categories
  const issueCategories = {
    communication: ['iletişim', 'cevap', 'yanıt', 'ulaşmak', 'mesaj'],
    professionalism: ['profesyonel', 'davranış', 'tutum', 'etik'],
    punctuality: ['gecikme', 'geç', 'zamanında', 'erken', 'randevu'],
    effectiveness: ['fayda', 'sonuç', 'etki', 'başarı', 'ilerleme'],
    pricing: ['ücret', 'fiyat', 'pahalı', 'değer', 'para'],
    empathy: ['empati', 'anlayış', 'dinleme', 'ilgi', 'önem'],
  };

  // Count positive and negative keywords
  let positiveCount = 0;
  let negativeCount = 0;
  const foundKeywords: string[] = [];

  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      positiveCount++;
      foundKeywords.push(keyword);
    }
  });

  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      negativeCount++;
      foundKeywords.push(keyword);
    }
  });

  // Calculate sentiment score (-1 to 1)
  const keywordBalance = positiveCount - negativeCount;
  const ratingInfluence = (rating - 3) / 2; // -1 to 1
  const sentimentScore = Math.max(-1, Math.min(1, (keywordBalance * 0.3 + ratingInfluence * 0.7)));

  // Determine sentiment
  let sentiment: SentimentAnalysis['sentiment'];
  if (sentimentScore > 0.3) sentiment = 'positive';
  else if (sentimentScore < -0.3) sentiment = 'negative';
  else sentiment = 'neutral';

  // Identify issue categories
  const categories: string[] = [];
  const issues: string[] = [];

  Object.entries(issueCategories).forEach(([category, keywords]) => {
    const hasIssue = keywords.some(keyword => text.includes(keyword));
    if (hasIssue) {
      categories.push(category);
      if (sentiment === 'negative') {
        issues.push(getCategoryIssue(category));
      }
    }
  });

  return {
    reviewId: Date.now().toString(),
    rating,
    sentiment,
    sentimentScore,
    categories,
    keywords: foundKeywords,
    issues,
  };
}

function getCategoryIssue(category: string): string {
  const issueMap: Record<string, string> = {
    communication: 'İletişim sorunları',
    professionalism: 'Profesyonellik eksikliği',
    punctuality: 'Zaman yönetimi problemleri',
    effectiveness: 'Yetersiz etkinlik',
    pricing: 'Fiyat-değer dengesizliği',
    empathy: 'Empati ve anlayış eksikliği',
  };
  return issueMap[category] || 'Genel sorun';
}

/**
 * Generate smart coach recommendations based on user preferences and behavior
 */
export function generateSmartRecommendations(
  userHistory: { coachId: string; rating: number; specialties: string[] }[],
  allCoaches: { id: string; name: string; specialties: string[]; kpiScore: number; averageRating: number }[]
): string[] {
  if (userHistory.length === 0) {
    // New user - recommend top performers
    return allCoaches
      .filter(coach => coach.kpiScore >= 80)
      .sort((a, b) => b.kpiScore - a.kpiScore)
      .slice(0, 5)
      .map(coach => coach.id);
  }

  // Analyze user preferences
  const preferredSpecialties: Record<string, number> = {};
  let totalRating = 0;

  userHistory.forEach(session => {
    totalRating += session.rating;
    session.specialties.forEach(specialty => {
      preferredSpecialties[specialty] = (preferredSpecialties[specialty] || 0) + 1;
    });
  });

  const avgUserRating = totalRating / userHistory.length;

  // Score coaches based on match
  const scoredCoaches = allCoaches.map(coach => {
    let matchScore = 0;

    // Specialty match (40%)
    const specialtyMatches = coach.specialties.filter(
      s => preferredSpecialties[s]
    ).length;
    matchScore += (specialtyMatches / Math.max(coach.specialties.length, 1)) * 40;

    // Quality match (30%) - prefer coaches with similar or higher rating
    const ratingDiff = Math.abs(coach.averageRating - avgUserRating);
    matchScore += Math.max(0, 30 - ratingDiff * 10);

    // Performance score (30%)
    matchScore += (coach.kpiScore / 100) * 30;

    return {
      coachId: coach.id,
      matchScore,
    };
  });

  // Return top 5 recommendations
  return scoredCoaches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
    .map(coach => coach.coachId);
}

/**
 * Calculate platform-wide metrics
 */
export function calculatePlatformMetrics(allCoachMetrics: CoachMetrics[]): PlatformMetrics {
  const totalCoaches = allCoachMetrics.length;
  const totalSessions = allCoachMetrics.reduce((sum, m) => sum + m.totalSessions, 0);
  const totalRevenue = allCoachMetrics.reduce((sum, m) => sum + m.totalRevenue, 0);
  
  const avgRating = allCoachMetrics.reduce((sum, m) => sum + m.averageRating, 0) / totalCoaches;
  const avgReviewRate = allCoachMetrics.reduce((sum, m) => sum + m.reviewRate, 0) / totalCoaches;
  const avgCompletionRate = allCoachMetrics.reduce((sum, m) => sum + m.completionRate, 0) / totalCoaches;
  const avgNoShowRate = allCoachMetrics.reduce((sum, m) => sum + m.noShowRate, 0) / totalCoaches;

  const coachKPIs = allCoachMetrics.map(calculateCoachKPI);
  const riskyCoachCount = coachKPIs.filter(kpi => kpi.isRisky).length;
  const excellentCoachCount = coachKPIs.filter(kpi => kpi.performanceLevel === 'excellent').length;

  return {
    totalCoaches,
    totalSessions,
    totalRevenue,
    averageRating: Math.round(avgRating * 10) / 10,
    overallReviewRate: Math.round(avgReviewRate),
    overallCompletionRate: Math.round(avgCompletionRate),
    overallNoShowRate: Math.round(avgNoShowRate),
    riskyCoachCount,
    excellentCoachCount,
  };
}

/**
 * Analyze common issues from low-rated reviews
 */
export function analyzeCommonIssues(reviews: { rating: number; review: string }[]): {
  category: string;
  count: number;
  percentage: number;
  examples: string[];
}[] {
  const lowRatedReviews = reviews.filter(r => r.rating <= 3);
  const sentiments = lowRatedReviews.map(r => analyzeSentiment(r.review, r.rating));

  const issueCounts: Record<string, { count: number; examples: string[] }> = {};

  sentiments.forEach(sentiment => {
    sentiment.issues.forEach(issue => {
      if (!issueCounts[issue]) {
        issueCounts[issue] = { count: 0, examples: [] };
      }
      issueCounts[issue].count++;
      if (issueCounts[issue].examples.length < 3) {
        issueCounts[issue].examples.push(sentiment.keywords.join(', '));
      }
    });
  });

  const totalIssues = Object.values(issueCounts).reduce((sum, i) => sum + i.count, 0);

  return Object.entries(issueCounts)
    .map(([category, data]) => ({
      category,
      count: data.count,
      percentage: Math.round((data.count / totalIssues) * 100),
      examples: data.examples,
    }))
    .sort((a, b) => b.count - a.count);
}