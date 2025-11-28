import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Star, 
  DollarSign, 
  Calendar, 
  Award,
  Target,
  Clock,
  MessageSquare,
  Trophy,
  Zap,
  Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  cancelledSessions: number;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  averageSessionPrice: number;
  topPackage: string;
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export default function CoachDashboard() {
  const { user } = useAuth();
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalSessions: 127,
    completedSessions: 98,
    upcomingSessions: 15,
    cancelledSessions: 14,
  });

  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 45600,
    monthlyRevenue: 8900,
    averageSessionPrice: 465,
    topPackage: '3 Seans Paketi',
  });

  const [ratingStats, setRatingStats] = useState<RatingStats>({
    averageRating: 4.8,
    totalReviews: 87,
    fiveStars: 72,
    fourStars: 12,
    threeStars: 2,
    twoStars: 1,
    oneStar: 0,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'İlk Adım',
      description: 'İlk seansınızı tamamlayın',
      icon: '🎯',
      unlocked: true,
      progress: 1,
      target: 1,
    },
    {
      id: '2',
      title: 'Yükselen Yıldız',
      description: '10 seans tamamlayın',
      icon: '⭐',
      unlocked: true,
      progress: 10,
      target: 10,
    },
    {
      id: '3',
      title: 'Deneyimli Koç',
      description: '50 seans tamamlayın',
      icon: '🏆',
      unlocked: true,
      progress: 50,
      target: 50,
    },
    {
      id: '4',
      title: 'Usta Koç',
      description: '100 seans tamamlayın',
      icon: '👑',
      unlocked: false,
      progress: 98,
      target: 100,
    },
    {
      id: '5',
      title: 'Mükemmellik',
      description: '4.5+ ortalama puan alın',
      icon: '💎',
      unlocked: true,
      progress: 4.8,
      target: 4.5,
    },
    {
      id: '6',
      title: 'Popüler Koç',
      description: '50 değerlendirme alın',
      icon: '🌟',
      unlocked: true,
      progress: 87,
      target: 50,
    },
  ]);

  const completionRate = Math.round((sessionStats.completedSessions / sessionStats.totalSessions) * 100);
  const cancellationRate = Math.round((sessionStats.cancelledSessions / sessionStats.totalSessions) * 100);

  const getRatingPercentage = (count: number) => {
    return Math.round((count / ratingStats.totalReviews) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Koç Dashboard</h1>
          <p className="text-gray-600">Performans istatistiklerinizi ve başarılarınızı görüntüleyin</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Seans</CardTitle>
              <Calendar className="h-4 w-4 text-blue-900" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{sessionStats.totalSessions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {sessionStats.completedSessions} tamamlandı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ortalama Puan</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{ratingStats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {ratingStats.totalReviews} değerlendirme
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">₺{revenueStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Bu ay: ₺{revenueStats.monthlyRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tamamlanma Oranı</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-900" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="ratings">Değerlendirmeler</TabsTrigger>
            <TabsTrigger value="revenue">Gelir</TabsTrigger>
            <TabsTrigger value="achievements">Başarılar</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Session Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-900" />
                    Seans İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tamamlanan</span>
                    <span className="font-semibold text-green-600">{sessionStats.completedSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Yaklaşan</span>
                    <span className="font-semibold text-blue-600">{sessionStats.upcomingSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">İptal Edilen</span>
                    <span className="font-semibold text-red-600">{sessionStats.cancelledSessions}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">İptal Oranı</span>
                      <span className="font-semibold">{cancellationRate}%</span>
                    </div>
                    <Progress value={cancellationRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-900" />
                    Performans Metrikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                      <span className="font-semibold">{Math.round((ratingStats.averageRating / 5) * 100)}%</span>
                    </div>
                    <Progress value={(ratingStats.averageRating / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Tamamlanma Oranı</span>
                      <span className="font-semibold">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Yanıt Hızı</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Zap className="h-4 w-4" />
                      <span className="font-semibold">Harika performans! Böyle devam edin 🎉</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Değerlendirme Dağılımı
                </CardTitle>
                <CardDescription>
                  Toplam {ratingStats.totalReviews} değerlendirme • Ortalama {ratingStats.averageRating.toFixed(1)} yıldız
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stars: 5, count: ratingStats.fiveStars, color: 'bg-green-500' },
                  { stars: 4, count: ratingStats.fourStars, color: 'bg-blue-500' },
                  { stars: 3, count: ratingStats.threeStars, color: 'bg-yellow-500' },
                  { stars: 2, count: ratingStats.twoStars, color: 'bg-orange-500' },
                  { stars: 1, count: ratingStats.oneStar, color: 'bg-red-500' },
                ].map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium">{rating.stars}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${rating.color}`}
                          style={{ width: `${getRatingPercentage(rating.count)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {rating.count} ({getRatingPercentage(rating.count)}%)
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-900" />
                  Son Yorumlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: 'Ahmet Y.',
                    rating: 5,
                    date: '2 gün önce',
                    comment: 'Harika bir deneyimdi! Çok profesyonel ve yardımcı bir koç.',
                  },
                  {
                    name: 'Zeynep K.',
                    rating: 5,
                    date: '1 hafta önce',
                    comment: 'Kariyer hedeflerime ulaşmamda çok yardımcı oldu. Kesinlikle tavsiye ederim.',
                  },
                  {
                    name: 'Mehmet S.',
                    rating: 4,
                    date: '2 hafta önce',
                    comment: 'İyi bir koç, ancak bazen randevular gecikmeli başlıyor.',
                  },
                ].map((review, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Gelir Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Toplam Gelir</span>
                    <span className="text-xl font-bold text-green-600">
                      ₺{revenueStats.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bu Ay</span>
                    <span className="font-semibold">₺{revenueStats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ortalama Seans Ücreti</span>
                    <span className="font-semibold">₺{revenueStats.averageSessionPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En Popüler Paket</span>
                    <Badge variant="outline">{revenueStats.topPackage}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-900" />
                    Aylık Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: 'Kasım', amount: 8900, growth: 12 },
                      { month: 'Ekim', amount: 7950, growth: 8 },
                      { month: 'Eylül', amount: 7350, growth: 15 },
                      { month: 'Ağustos', amount: 6400, growth: -5 },
                    ].map((item) => (
                      <div key={item.month} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">₺{item.amount.toLocaleString()}</span>
                          <Badge
                            variant={item.growth > 0 ? 'default' : 'destructive'}
                            className={item.growth > 0 ? 'bg-green-100 text-green-800' : ''}
                          >
                            {item.growth > 0 ? '+' : ''}{item.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Başarılar ve Rozetler
                </CardTitle>
                <CardDescription>
                  Kilidi açılan başarılar: {achievements.filter((a) => a.unlocked).length} / {achievements.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`border rounded-lg p-4 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                            {achievement.unlocked && (
                              <Badge className="bg-yellow-500 text-white">
                                <Award className="h-3 w-3 mr-1" />
                                Kazanıldı
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {!achievement.unlocked && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>İlerleme</span>
                                <span>
                                  {achievement.progress} / {achievement.target}
                                </span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.target) * 100}
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gamification Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Seviye Sistemi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Mevcut Seviye: Usta Koç</span>
                      <span className="text-sm text-gray-600">Seviye 7</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <p className="text-xs text-gray-600 mt-1">
                      Bir sonraki seviyeye 25 seans kaldı
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🌱</div>
                      <p className="text-xs text-gray-600">Başlangıç</p>
                      <p className="text-xs font-semibold">0-10 seans</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">⭐</div>
                      <p className="text-xs text-gray-600">Yükselen</p>
                      <p className="text-xs font-semibold">11-50 seans</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">👑</div>
                      <p className="text-xs text-gray-600">Usta</p>
                      <p className="text-xs font-semibold">51+ seans</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}