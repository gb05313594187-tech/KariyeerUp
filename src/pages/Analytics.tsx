import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Award, Activity } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

interface AnalyticsData {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalCoaches: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  userGrowth: Array<{ month: string; users: number }>;
  subscriptionDistribution: Array<{ name: string; value: number }>;
  coachStatusDistribution: Array<{ name: string; value: number }>;
}

interface Payment {
  payment_date: string;
  amount: string;
}

interface User {
  created_at: string;
}

export default function Analytics() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalCoaches: 0,
    monthlyRevenue: [],
    userGrowth: [],
    subscriptionDistribution: [],
    coachStatusDistribution: [],
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user, isAuthenticated]);

  const checkAdminAccess = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const adminEmails = ['admin@kariyeer.com', 'info@kariyeer.com'];
    if (!adminEmails.includes(user.email)) {
      toast.error(getTranslation('accessDenied'));
      navigate('/');
      return;
    }

    await loadAnalytics();
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get total users
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;
      const totalUsers = users?.length || 0;

      // Get subscriptions data
      const { data: subscriptions, error: subsError } = await supabase
        .from('app_2dff6511da_subscriptions')
        .select('*');
      if (subsError) throw subsError;

      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;

      // Get payments data
      const { data: payments, error: paymentsError } = await supabase
        .from('app_2dff6511da_payments')
        .select('*')
        .eq('payment_status', 'completed');
      if (paymentsError) throw paymentsError;

      const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

      // Get coaches data
      const { data: coaches, error: coachesError } = await supabase
        .from('app_2dff6511da_coaches')
        .select('*');
      if (coachesError) throw coachesError;

      const totalCoaches = coaches?.length || 0;

      // Calculate monthly revenue (last 6 months)
      const monthlyRevenue = calculateMonthlyRevenue(payments || []);

      // Calculate user growth (last 6 months)
      const userGrowth = calculateUserGrowth(users || []);

      // Subscription distribution
      const blueCount = subscriptions?.filter(s => s.badge_type === 'blue' && s.status === 'active').length || 0;
      const goldCount = subscriptions?.filter(s => s.badge_type === 'gold' && s.status === 'active').length || 0;
      const subscriptionDistribution = [
        { name: getTranslation('blueTick'), value: blueCount },
        { name: getTranslation('goldTick'), value: goldCount },
      ];

      // Coach status distribution
      const pendingCoaches = coaches?.filter(c => c.status === 'pending').length || 0;
      const approvedCoaches = coaches?.filter(c => c.status === 'approved').length || 0;
      const rejectedCoaches = coaches?.filter(c => c.status === 'rejected').length || 0;
      const coachStatusDistribution = [
        { name: getTranslation('pending'), value: pendingCoaches },
        { name: getTranslation('approved'), value: approvedCoaches },
        { name: getTranslation('rejected'), value: rejectedCoaches },
      ];

      setAnalytics({
        totalUsers,
        totalRevenue,
        activeSubscriptions,
        totalCoaches,
        monthlyRevenue,
        userGrowth,
        subscriptionDistribution,
        coachStatusDistribution,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error(getTranslation('loadError'));
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyRevenue = (payments: Payment[]) => {
    const months = getLastSixMonths();
    return months.map(month => {
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate.getMonth() === month.index && paymentDate.getFullYear() === month.year;
      });
      const revenue = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      return { month: month.name, revenue };
    });
  };

  const calculateUserGrowth = (users: User[]) => {
    const months = getLastSixMonths();
    return months.map(month => {
      const monthUsers = users.filter(u => {
        const createdDate = new Date(u.created_at);
        return createdDate.getMonth() === month.index && createdDate.getFullYear() === month.year;
      });
      return { month: month.name, users: monthUsers.length };
    });
  };

  const getLastSixMonths = () => {
    const months = [];
    const monthNames = language === 'tr' 
      ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      : language === 'en'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: monthNames[date.getMonth()],
        index: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return months;
  };

  const getTranslation = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      title: { tr: 'Analytics Dashboard', en: 'Analytics Dashboard', fr: 'Tableau de Bord Analytique' },
      overview: { tr: 'Genel Bakış', en: 'Overview', fr: 'Vue d\'Ensemble' },
      revenue: { tr: 'Gelir', en: 'Revenue', fr: 'Revenu' },
      users: { tr: 'Kullanıcılar', en: 'Users', fr: 'Utilisateurs' },
      totalUsers: { tr: 'Toplam Kullanıcı', en: 'Total Users', fr: 'Total Utilisateurs' },
      totalRevenue: { tr: 'Toplam Gelir', en: 'Total Revenue', fr: 'Revenu Total' },
      activeSubscriptions: { tr: 'Aktif Abonelikler', en: 'Active Subscriptions', fr: 'Abonnements Actifs' },
      totalCoaches: { tr: 'Toplam Koç', en: 'Total Coaches', fr: 'Total Coachs' },
      monthlyRevenue: { tr: 'Aylık Gelir', en: 'Monthly Revenue', fr: 'Revenu Mensuel' },
      userGrowth: { tr: 'Kullanıcı Büyümesi', en: 'User Growth', fr: 'Croissance des Utilisateurs' },
      subscriptionDistribution: { tr: 'Abonelik Dağılımı', en: 'Subscription Distribution', fr: 'Distribution des Abonnements' },
      coachStatus: { tr: 'Koç Durumu', en: 'Coach Status', fr: 'Statut du Coach' },
      blueTick: { tr: 'Mavi Tik', en: 'Blue Tick', fr: 'Tick Bleu' },
      goldTick: { tr: 'Altın Tik', en: 'Gold Tick', fr: 'Tick Or' },
      pending: { tr: 'Beklemede', en: 'Pending', fr: 'En Attente' },
      approved: { tr: 'Onaylandı', en: 'Approved', fr: 'Approuvé' },
      rejected: { tr: 'Reddedildi', en: 'Rejected', fr: 'Rejeté' },
      accessDenied: { tr: 'Erişim reddedildi', en: 'Access denied', fr: 'Accès refusé' },
      loadError: { tr: 'Veri yüklenemedi', en: 'Failed to load data', fr: 'Échec du chargement des données' },
    };
    return translations[key]?.[language] || translations[key]?.['tr'] || key;
  };

  const COLORS = ['#dc2626', '#ea580c', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">{getTranslation('title')}</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation('totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {language === 'tr' ? 'Kayıtlı kullanıcı' : language === 'en' ? 'Registered users' : 'Utilisateurs enregistrés'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation('totalRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{analytics.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'tr' ? 'Toplam gelir' : language === 'en' ? 'Total revenue' : 'Revenu total'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation('activeSubscriptions')}</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'tr' ? 'Aktif rozet' : language === 'en' ? 'Active badges' : 'Badges actifs'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation('totalCoaches')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCoaches}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'tr' ? 'Kayıtlı koç' : language === 'en' ? 'Registered coaches' : 'Coachs enregistrés'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">{getTranslation('revenue')}</TabsTrigger>
            <TabsTrigger value="users">{getTranslation('users')}</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{getTranslation('monthlyRevenue')}</CardTitle>
                  <CardDescription>
                    {language === 'tr' ? 'Son 6 aylık gelir trendi' : language === 'en' ? 'Revenue trend for last 6 months' : 'Tendance des revenus des 6 derniers mois'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} name={getTranslation('revenue')} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{getTranslation('subscriptionDistribution')}</CardTitle>
                  <CardDescription>
                    {language === 'tr' ? 'Aktif abonelik türleri' : language === 'en' ? 'Active subscription types' : 'Types d\'abonnements actifs'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.subscriptionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.subscriptionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{getTranslation('userGrowth')}</CardTitle>
                  <CardDescription>
                    {language === 'tr' ? 'Son 6 aylık kullanıcı büyümesi' : language === 'en' ? 'User growth for last 6 months' : 'Croissance des utilisateurs des 6 derniers mois'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" fill="#3b82f6" name={getTranslation('users')} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{getTranslation('coachStatus')}</CardTitle>
                  <CardDescription>
                    {language === 'tr' ? 'Koç başvuru durumları' : language === 'en' ? 'Coach application statuses' : 'Statuts des candidatures de coach'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.coachStatusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.coachStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}