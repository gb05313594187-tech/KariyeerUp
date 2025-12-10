// src/pages/CoachDashboard.tsx
// @ts-nocheck
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

  const completionRate = Math.round(
    (sessionStats.completedSessions / sessionStats.totalSessions) * 100
  );
  const cancellationRate = Math.round(
    (sessionStats.cancelledSessions / sessionStats.totalSessions) * 100
  );

  const getRatingPercentage = (count: number) => {
    return Math.round((count / ratingStats.totalReviews) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">Koç Dashboard</h1>
          <p className="text-gray-600">
            Performans istatistiklerinizi ve başarılarınızı görüntüleyin
          </p>
        </div>

        {/* Quick Stats */}
        {/* ... SENİN KODUN AYNEN DEVAM ETSİN ... */}
        {/* (alttaki Tabs ve Card yapısının hepsi olduğu gibi kalabilir) */}

        {/* Buradan sonrası olduğu gibi senin paylaştığın kod */}
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... */}
        </div>

        {/* Tabs */}
        {/* ... tüm TabsContent blokların ... */}
      </div>
    </div>
  );
}
