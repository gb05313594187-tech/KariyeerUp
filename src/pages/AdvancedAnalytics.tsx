import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  Target,
  Award,
  Brain,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Shield,
  MessageSquare,
  ArrowLeft,
  Download,
} from 'lucide-react';
import {
  calculateCoachKPI,
  calculatePlatformMetrics,
  analyzeCommonIssues,
  type CoachMetrics,
  type CoachKPI,
  type PlatformMetrics,
} from '@/lib/aiAnalytics';
import { exportToExcel, prepareCoachKPIForExport, prepareCommonIssuesForExport } from '@/lib/excelExport';
import { toast } from 'sonner';

interface CommonIssue {
  category: string;
  count: number;
  percentage: number;
  examples: string[];
}

export default function AdvancedAnalytics() {
  const navigate = useNavigate();
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [coachKPIs, setCoachKPIs] = useState<CoachKPI[]>([]);
  const [commonIssues, setCommonIssues] = useState<CommonIssue[]>([]);

  useEffect(() => {
    // Mock data - In production, this would come from API
    const mockCoachMetrics: CoachMetrics[] = [
      {
        coachId: '1',
        coachName: 'Dr. Ayşe Yılmaz',
        totalSessions: 127,
        completedSessions: 121,
        cancelledSessions: 4,
        noShowSessions: 2,
        averageRating: 4.8,
        totalReviews: 87,
        reviewRate: 68,
        lowRatedSessions: 3,
        lowRatedRate: 2.4,
        repeatSessionRate: 65,
        totalRevenue: 45600,
        averageRevenue: 359,
        averageSessionDuration: 47,
        plannedSessionDuration: 45,
        completionRate: 95,
        responseRate: 98,
        cancellationRate: 3,
        noShowRate: 1.6,
      },
      {
        coachId: '2',
        coachName: 'Zeynep Demir',
        totalSessions: 89,
        completedSessions: 78,
        cancelledSessions: 8,
        noShowSessions: 3,
        averageRating: 4.6,
        totalReviews: 62,
        reviewRate: 70,
        lowRatedSessions: 5,
        lowRatedRate: 5.6,
        repeatSessionRate: 58,
        totalRevenue: 32400,
        averageRevenue: 364,
        averageSessionDuration: 46,
        plannedSessionDuration: 45,
        completionRate: 88,
        responseRate: 95,
        cancellationRate: 9,
        noShowRate: 3.4,
      },
      {
        coachId: '3',
        coachName: 'Mehmet Kaya',
        totalSessions: 45,
        completedSessions: 32,
        cancelledSessions: 10,
        noShowSessions: 3,
        averageRating: 4.2,
        totalReviews: 28,
        reviewRate: 62,
        lowRatedSessions: 8,
        lowRatedRate: 17.8,
        repeatSessionRate: 35,
        totalRevenue: 18900,
        averageRevenue: 420,
        averageSessionDuration: 43,
        plannedSessionDuration: 45,
        completionRate: 71,
        responseRate: 88,
        cancellationRate: 22,
        noShowRate: 6.7,
      },
    ];

    // Calculate KPIs
    const kpis = mockCoachMetrics.map(calculateCoachKPI);
    setCoachKPIs(kpis);

    // Calculate platform metrics
    const metrics = calculatePlatformMetrics(mockCoachMetrics);
    setPlatformMetrics(metrics);

    // Analyze common issues
    const mockReviews = [
      { rating: 2, review: 'İletişim çok kötü, mesajlara geç cevap veriyor' },
      { rating: 3, review: 'Profesyonel ama empati eksikliği var' },
      { rating: 2, review: 'Randevuya geç geldi, zaman yönetimi sorunlu' },
      { rating: 3, review: 'Faydalı oldu ama fiyat çok pahalı' },
      { rating: 1, review: 'Hiç anlayışlı değil, dinleme becerisi yok' },
    ];
    const issues = analyzeCommonIssues(mockReviews);
    setCommonIssues(issues);
  }, []);

  const getPerformanceBadge = (level: CoachKPI['performanceLevel']) => {
    const config = {
      excellent: { label: 'Mükemmel', className: 'bg-green-100 text-green-800', icon: Award },
      good: { label: 'İyi', className: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      average: { label: 'Orta', className: 'bg-yellow-100 text-yellow-800', icon: Activity },
      needs_improvement: { label: 'Geliştirilmeli', className: 'bg-orange-100 text-orange-800', icon: TrendingDown },
      at_risk: { label: 'Riskli', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
    };
    const { label, className, icon: Icon } = config[level];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getKPIColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Export functions
  const handleExportKPIs = () => {
    const data = prepareCoachKPIForExport(coachKPIs);
    const success = exportToExcel(data, 'Koç_KPI_Skorları', 'KPI Skorları');
    if (success) {
      toast.success('KPI skorları Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const handleExportRiskyCoaches = () => {
    const riskyCoaches = coachKPIs.filter(kpi => kpi.isRisky);
    const data = prepareCoachKPIForExport(riskyCoaches);
    const success = exportToExcel(data, 'Riskli_Koçlar', 'Riskli Koçlar');
    if (success) {
      toast.success('Riskli koçlar Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const handleExportCommonIssues = () => {
    const data = prepareCommonIssuesForExport(commonIssues);
    const success = exportToExcel(data, 'Yaygın_Sorunlar', 'Yaygın Sorunlar');
    if (success) {
      toast.success('Yaygın sorunlar Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  // Chart data
  const kpiTrendData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Ortalama KPI Skoru',
        data: [78, 82, 85, 83, 87, 89],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };

  const coachComparisonData = {
    labels: coachKPIs.map(kpi => kpi.coachName.split(' ')[0]),
    datasets: [
      {
        label: 'KPI Skoru',
        data: coachKPIs.map(kpi => kpi.kpiScore),
        backgroundColor: coachKPIs.map(kpi => {
          if (kpi.kpiScore >= 90) return 'rgba(34, 197, 94, 0.8)';
          if (kpi.kpiScore >= 75) return 'rgba(59, 130, 246, 0.8)';
          if (kpi.kpiScore >= 60) return 'rgba(234, 179, 8, 0.8)';
          if (kpi.kpiScore >= 40) return 'rgba(249, 115, 22, 0.8)';
          return 'rgba(239, 68, 68, 0.8)';
        }),
      },
    ],
  };

  const issuesDistributionData = {
    labels: commonIssues.map(issue => issue.category),
    datasets: [
      {
        label: 'Sorun Dağılımı',
        data: commonIssues.map(issue => issue.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-blue-900">AI Destekli Performans Analizi</h1>
          </div>
          <p className="text-gray-600">Gelişmiş metrikler ve yapay zeka destekli kalite kontrol</p>
        </div>

        {/* Platform Overview */}
        {platformMetrics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Toplam Koç</CardTitle>
                <Users className="h-4 w-4 text-blue-900" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{platformMetrics.totalCoaches}</div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <Badge className="bg-green-100 text-green-800">
                    {platformMetrics.excellentCoachCount} Mükemmel
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    {platformMetrics.riskyCoachCount} Riskli
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ortalama Puan</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{platformMetrics.averageRating}</div>
                <p className="text-xs text-gray-500 mt-1">
                  %{platformMetrics.overallReviewRate} değerlendirme oranı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tamamlanma</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">%{platformMetrics.overallCompletionRate}</div>
                <Progress value={platformMetrics.overallCompletionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">No-Show Oranı</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">%{platformMetrics.overallNoShowRate}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {platformMetrics.totalSessions} toplam seans
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                KPI Trend Analizi
              </CardTitle>
              <CardDescription>Son 6 aylık ortalama performans trendi</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={kpiTrendData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Koç Performans Karşılaştırması
              </CardTitle>
              <CardDescription>Güncel KPI skorları</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={coachComparisonData} height={300} />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="kpi" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kpi">KPI Skorları</TabsTrigger>
            <TabsTrigger value="risks">Riskli Koçlar</TabsTrigger>
            <TabsTrigger value="issues">Yaygın Sorunlar</TabsTrigger>
            <TabsTrigger value="charts">Grafikler</TabsTrigger>
          </TabsList>

          {/* KPI Scores Tab */}
          <TabsContent value="kpi" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                      <Target className="h-6 w-6" />
                      Koç Performans Endeksi (KPI)
                    </CardTitle>
                    <CardDescription>
                      AI destekli çok boyutlu performans değerlendirmesi
                    </CardDescription>
                  </div>
                  <Button onClick={handleExportKPIs} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Excel'e Aktar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {coachKPIs.map((kpi) => (
                    <div key={kpi.coachId} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-blue-900 mb-2">{kpi.coachName}</h3>
                          {getPerformanceBadge(kpi.performanceLevel)}
                        </div>
                        <div className="text-right">
                          <div className={`text-4xl font-bold ${getKPIColor(kpi.kpiScore)}`}>
                            {kpi.kpiScore}
                          </div>
                          <p className="text-sm text-gray-600">KPI Skoru</p>
                        </div>
                      </div>

                      {/* KPI Progress */}
                      <div className="mb-4">
                        <Progress value={kpi.kpiScore} className="h-3" />
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Güçlü Yönler
                          </h4>
                          <ul className="space-y-1">
                            {kpi.strengths.map((strength, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-600 mt-1">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            Gelişim Alanları
                          </h4>
                          <ul className="space-y-1">
                            {kpi.weaknesses.map((weakness, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-orange-600 mt-1">!</span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {kpi.recommendations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            AI Önerileri
                          </h4>
                          <ul className="space-y-1">
                            {kpi.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-sm text-blue-800">
                                • {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Risk Factors */}
                      {kpi.isRisky && kpi.riskFactors.length > 0 && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            Risk Faktörleri
                          </h4>
                          <ul className="space-y-1">
                            {kpi.riskFactors.map((risk, idx) => (
                              <li key={idx} className="text-sm text-red-800">
                                ⚠ {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risky Coaches Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      Riskli Koç Uyarı Sistemi
                    </CardTitle>
                    <CardDescription>
                      Otomatik tespit edilen performans sorunları
                    </CardDescription>
                  </div>
                  {coachKPIs.filter(kpi => kpi.isRisky).length > 0 && (
                    <Button onClick={handleExportRiskyCoaches} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Excel'e Aktar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {coachKPIs.filter(kpi => kpi.isRisky).length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
                    <p className="text-xl text-gray-900 mb-2">Tüm Koçlar İyi Durumda</p>
                    <p className="text-gray-600">Şu anda riskli olarak işaretlenmiş koç bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coachKPIs
                      .filter(kpi => kpi.isRisky)
                      .map((kpi) => (
                        <div
                          key={kpi.coachId}
                          className="border-l-4 border-red-500 bg-red-50 p-6 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-red-900 mb-1">{kpi.coachName}</h3>
                              <Badge className="bg-red-100 text-red-800">
                                KPI: {kpi.kpiScore}/100
                              </Badge>
                            </div>
                            <Button variant="destructive" size="sm">
                              Acil Müdahale
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-red-900 mb-2">
                                Tespit Edilen Riskler:
                              </h4>
                              <ul className="space-y-1">
                                {kpi.riskFactors.map((risk, idx) => (
                                  <li key={idx} className="text-sm text-red-800 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-red-900 mb-2">
                                Önerilen Aksiyonlar:
                              </h4>
                              <ul className="space-y-1">
                                {kpi.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-red-800">
                                    → {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                      <MessageSquare className="h-6 w-6" />
                      Yaygın Sorunlar Analizi
                    </CardTitle>
                    <CardDescription>
                      Düşük puanlı yorumlardan AI ile çıkarılan sorun kategorileri
                    </CardDescription>
                  </div>
                  <Button onClick={handleExportCommonIssues} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Excel'e Aktar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonIssues.map((issue, idx) => (
                    <div key={idx} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-blue-900 mb-2">{issue.category}</h3>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{issue.count} şikayet</Badge>
                            <Badge className="bg-orange-100 text-orange-800">
                              %{issue.percentage} oranında
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-orange-600">{issue.percentage}%</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Progress value={issue.percentage} className="h-2" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Örnek Anahtar Kelimeler:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {issue.examples.map((example: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Recommendations */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Önerileri - Öncelikli Aksiyonlar
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">İletişim Eğitimi</p>
                        <p className="text-sm text-blue-800">
                          En yaygın sorun iletişim. Koçlara hızlı yanıt ve etkili iletişim eğitimi verin.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Zaman Yönetimi</p>
                        <p className="text-sm text-blue-800">
                          Randevu hatırlatma sistemini güçlendirin ve koçlara zaman yönetimi desteği sağlayın.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Empati Geliştirme</p>
                        <p className="text-sm text-blue-800">
                          Koçlara aktif dinleme ve empati kurma teknikleri konusunda workshop düzenleyin.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-orange-600" />
                    Sorun Dağılımı
                  </CardTitle>
                  <CardDescription>Müşteri şikayetlerinin kategori bazlı analizi</CardDescription>
                </CardHeader>
                <CardContent>
                  <DoughnutChart data={issuesDistributionData} height={350} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}