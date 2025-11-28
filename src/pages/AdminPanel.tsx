import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { exportToExcel, prepareRevenueForExport, prepareUsersForExport } from '@/lib/excelExport';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'coach' | 'client';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
}

interface RevenueData {
  date: string;
  amount: number;
  transactions: number;
  coaches: number;
}

interface CoachPerformance {
  id: string;
  name: string;
  totalSessions: number;
  averageRating: number;
  revenue: number;
  completionRate: number;
  status: 'excellent' | 'good' | 'needs_improvement';
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  user?: string;
  action?: string;
}

export default function AdminPanel() {
  const [dateRange, setDateRange] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'Dr. Ayşe Yılmaz',
      email: 'ayse@example.com',
      role: 'coach',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 saat önce',
    },
    {
      id: '2',
      name: 'Mehmet Admin',
      email: 'admin@kariyeer.com',
      role: 'super_admin',
      status: 'active',
      joinDate: '2023-06-01',
      lastActive: '5 dakika önce',
    },
    {
      id: '3',
      name: 'Zeynep Demir',
      email: 'zeynep@example.com',
      role: 'coach',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '1 gün önce',
    },
    {
      id: '4',
      name: 'Ali Yılmaz',
      email: 'ali@example.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-03-10',
      lastActive: '3 saat önce',
    },
  ];

  const revenueData: RevenueData[] = [
    { date: '2024-11-01', amount: 12500, transactions: 28, coaches: 8 },
    { date: '2024-11-02', amount: 15200, transactions: 34, coaches: 10 },
    { date: '2024-11-03', amount: 18900, transactions: 42, coaches: 12 },
    { date: '2024-11-04', amount: 14300, transactions: 31, coaches: 9 },
    { date: '2024-11-05', amount: 16700, transactions: 37, coaches: 11 },
  ];

  const coachPerformance: CoachPerformance[] = [
    {
      id: '1',
      name: 'Dr. Ayşe Yılmaz',
      totalSessions: 127,
      averageRating: 4.8,
      revenue: 45600,
      completionRate: 95,
      status: 'excellent',
    },
    {
      id: '2',
      name: 'Zeynep Demir',
      totalSessions: 89,
      averageRating: 4.6,
      revenue: 32400,
      completionRate: 88,
      status: 'good',
    },
    {
      id: '3',
      name: 'Mehmet Kaya',
      totalSessions: 45,
      averageRating: 4.2,
      revenue: 18900,
      completionRate: 72,
      status: 'needs_improvement',
    },
  ];

  const systemLogs: SystemLog[] = [
    {
      id: '1',
      timestamp: '2024-11-24 14:32:15',
      level: 'info',
      message: 'Yeni kullanıcı kaydı',
      user: 'ali@example.com',
      action: 'user_registration',
    },
    {
      id: '2',
      timestamp: '2024-11-24 14:28:43',
      level: 'warning',
      message: 'Başarısız ödeme denemesi',
      user: 'mehmet@example.com',
      action: 'payment_failed',
    },
    {
      id: '3',
      timestamp: '2024-11-24 14:15:22',
      level: 'error',
      message: 'Video görüşme bağlantı hatası',
      user: 'zeynep@example.com',
      action: 'video_call_error',
    },
    {
      id: '4',
      timestamp: '2024-11-24 14:05:11',
      level: 'info',
      message: 'Koç profili güncellendi',
      user: 'ayse@example.com',
      action: 'profile_update',
    },
  ];

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.amount, 0);
  const totalTransactions = revenueData.reduce((sum, day) => sum + day.transactions, 0);
  const averageRevenue = Math.round(totalRevenue / revenueData.length);

  // Export functions
  const handleExportRevenue = () => {
    const data = revenueData.map(day => ({
      'Tarih': new Date(day.date).toLocaleDateString('tr-TR'),
      'Gelir (₺)': day.amount,
      'İşlem Sayısı': day.transactions,
      'Koç Sayısı': day.coaches,
      'Ortalama (₺)': Math.round(day.amount / day.transactions)
    }));
    const success = exportToExcel(data, 'Gelir_Raporu', 'Gelir Raporları');
    if (success) {
      toast.success('Gelir raporu Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const handleExportCoaches = () => {
    const data = prepareRevenueForExport(coachPerformance.map(c => ({
      coach_name: c.name,
      total_sessions: c.totalSessions,
      total_revenue: c.revenue,
      average_revenue: c.revenue / c.totalSessions
    })));
    const success = exportToExcel(data, 'Koç_Performansı', 'Koç Performansı');
    if (success) {
      toast.success('Koç performansı Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const handleExportUsers = () => {
    const data = prepareUsersForExport(users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.name,
      user_type: u.role,
      created_at: u.joinDate,
      badge_type: undefined
    })));
    const success = exportToExcel(data, 'Kullanıcı_Listesi', 'Kullanıcılar');
    if (success) {
      toast.success('Kullanıcı listesi Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const handleExportLogs = () => {
    const data = systemLogs.map(log => ({
      'Zaman': log.timestamp,
      'Seviye': log.level,
      'Mesaj': log.message,
      'Kullanıcı': log.user || 'N/A',
      'Aksiyon': log.action || 'N/A'
    }));
    const success = exportToExcel(data, 'Sistem_Logları', 'Sistem Logları');
    if (success) {
      toast.success('Sistem logları Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { label: 'Süper Admin', className: 'bg-purple-100 text-purple-800' },
      admin: { label: 'Admin', className: 'bg-blue-100 text-blue-800' },
      coach: { label: 'Koç', className: 'bg-green-100 text-green-800' },
      client: { label: 'Danışan', className: 'bg-gray-100 text-gray-800' },
    };
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.client;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Aktif', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      suspended: { label: 'Askıya Alındı', icon: XCircle, className: 'bg-red-100 text-red-800' },
      pending: { label: 'Beklemede', icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPerformanceBadge = (status: string) => {
    const statusConfig = {
      excellent: { label: 'Mükemmel', className: 'bg-green-100 text-green-800' },
      good: { label: 'İyi', className: 'bg-blue-100 text-blue-800' },
      needs_improvement: { label: 'Geliştirilmeli', className: 'bg-orange-100 text-orange-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Sistem yönetimi ve performans takibi</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
              <Shield className="h-5 w-5 mr-2" />
              Süper Admin
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Kullanıcı</CardTitle>
              <Users className="h-4 w-4 text-blue-900" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{users.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {users.filter(u => u.role === 'coach').length} koç, {users.filter(u => u.role === 'client').length} danışan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">₺{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Son {revenueData.length} gün
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">İşlem Sayısı</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-900" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalTransactions}</div>
              <p className="text-xs text-gray-500 mt-1">
                Ortalama: {Math.round(totalTransactions / revenueData.length)}/gün
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sistem Durumu</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Çevrimiçi</div>
              <p className="text-xs text-gray-500 mt-1">
                Tüm sistemler çalışıyor
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Gelir Raporları</TabsTrigger>
            <TabsTrigger value="coaches">Koç Performansı</TabsTrigger>
            <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
            <TabsTrigger value="logs">Sistem Logları</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900">Gelir Raporları</CardTitle>
                    <CardDescription>Tarih aralığına göre gelir analizi</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Son 7 Gün</SelectItem>
                        <SelectItem value="30">Son 30 Gün</SelectItem>
                        <SelectItem value="90">Son 90 Gün</SelectItem>
                        <SelectItem value="365">Son 1 Yıl</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExportRevenue}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel'e Aktar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-green-900">₺{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Ortalama Günlük</p>
                      <p className="text-2xl font-bold text-blue-900">₺{averageRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Toplam İşlem</p>
                      <p className="text-2xl font-bold text-purple-900">{totalTransactions}</p>
                    </div>
                  </div>

                  {/* Revenue Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gelir</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Koç Sayısı</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ortalama</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revenueData.map((day) => (
                          <tr key={day.date} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(day.date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ₺{day.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {day.transactions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {day.coaches}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₺{Math.round(day.amount / day.transactions).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coaches Performance Tab */}
          <TabsContent value="coaches" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900">Koç Performans Değerlendirmesi</CardTitle>
                    <CardDescription>Koçların detaylı performans metrikleri</CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleExportCoaches}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel'e Aktar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coachPerformance.map((coach) => (
                    <div key={coach.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-blue-900 mb-1">{coach.name}</h3>
                          {getPerformanceBadge(coach.status)}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Detay
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Toplam Seans</p>
                          <p className="text-2xl font-bold text-blue-900">{coach.totalSessions}</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <p className="text-sm text-gray-600">Ortalama Puan</p>
                          </div>
                          <p className="text-2xl font-bold text-yellow-900">{coach.averageRating}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Toplam Gelir</p>
                          <p className="text-2xl font-bold text-green-900">₺{coach.revenue.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Tamamlanma</p>
                          <p className="text-2xl font-bold text-purple-900">{coach.completionRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900">Kullanıcı Yönetimi</CardTitle>
                    <CardDescription>Tüm kullanıcıları görüntüle ve yönet</CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleExportUsers}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel'e Aktar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="İsim veya e-posta ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Roller</SelectItem>
                        <SelectItem value="super_admin">Süper Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="coach">Koç</SelectItem>
                        <SelectItem value="client">Danışan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Users Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Aktif</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(user.joinDate).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastActive}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900">Sistem Logları</CardTitle>
                    <CardDescription>Sistem aktivitelerini ve hataları izleyin</CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleExportLogs}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel'e Aktar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`border-l-4 p-4 rounded-lg ${
                        log.level === 'error'
                          ? 'border-red-500 bg-red-50'
                          : log.level === 'warning'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-green-500 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getLogIcon(log.level)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{log.message}</p>
                              <Badge variant="outline" className="text-xs">
                                {log.action}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {log.timestamp}
                              </span>
                              {log.user && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {log.user}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}