// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Activity, Brain, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeCoaches: 12, 
    totalUsers: 0
  });
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        // 1. Randevuları Çek
        const { data: bookingsData } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (bookingsData) {
            setBookings(bookingsData);
            
            // İstatistikler
            const revenue = bookingsData.length * 1500; 
            const userCount = new Set(bookingsData.map(b => b.client_email)).size;

            setStats({
                totalBookings: bookingsData.length,
                totalRevenue: revenue,
                activeCoaches: 15,
                totalUsers: userCount
            });

            // AI Yorumları
            const insights = [];
            if (revenue > 0) insights.push("📈 Ciro artışı pozitif.");
            if (bookingsData.length < 5) insights.push("💡 Öneri: Reklam bütçesini artırın.");
            else insights.push("🔥 Talep yüksek, yeni koç ekleyin.");
            setAiInsights(insights);
        }
    } catch (error) {
        console.log("Veri çekme hatası:", error);
    } finally {
        setLoading(false);
    }
  };

  // Onaylama İşlemi
  const handleApprove = async (id: string) => {
      await supabase.from('bookings').update({ status: 'approved' }).eq('id', id);
      toast.success("Onaylandı");
      // Listeyi güncelle (Local)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
  };

  const handleReject = async (id: string) => {
      await supabase.from('bookings').update({ status: 'rejected' }).eq('id', id);
      toast.error("Reddedildi");
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Admin Paneli Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BAŞLIK */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="text-blue-600"/> Yönetici Paneli
                </h1>
                <p className="text-slate-500">CEO Dashboard & KPI Takibi</p>
            </div>
            <Button onClick={fetchData} variant="default" className="bg-slate-900">Verileri Yenile</Button>
        </div>

        {/* AI ANALİZ KUTUSU */}
        <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <Brain className="w-5 h-5"/> Kariyeer AI Asistanı
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-indigo-800 bg-white/50 p-2 rounded">
                            <Lightbulb className="w-4 h-4 text-yellow-500"/> {insight}
                        </div>
                    )) : <span className="text-gray-400">Analiz yapılıyor...</span>}
                </div>
            </CardContent>
        </Card>

        {/* KPI KARTLARI */}
        <div className="grid md:grid-cols-4 gap-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Toplam Ciro</div>
                    <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} ₺</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Randevular</div>
                    <div className="text-3xl font-bold text-blue-900">{stats.totalBookings}</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Müşteriler</div>
                    <div className="text-3xl font-bold text-purple-900">{stats.totalUsers}</div>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="pt-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Aktif Koçlar</div>
                    <div className="text-3xl font-bold text-orange-600">{stats.activeCoaches}</div>
                </CardContent>
            </Card>
        </div>

        {/* RANDEVU LİSTESİ */}
        <Card>
            <CardHeader><CardTitle>Son İşlemler</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                            <tr>
                                <th className="p-3">Müşteri</th>
                                <th className="p-3">Tarih</th>
                                <th className="p-3">Durum</th>
                                <th className="p-3">Tutar</th>
                                <th className="p-3 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-bold">{booking.client_name}</div>
                                        <div className="text-xs text-gray-400">{booking.client_email}</div>
                                    </td>
                                    <td className="p-3">
                                        {new Date(booking.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-3">
                                        <Badge className={
                                            booking.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                            booking.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                            'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                        }>
                                            {booking.status === 'approved' ? 'Onaylandı' : 
                                             booking.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                                        </Badge>
                                    </td>
                                    <td className="p-3 font-bold text-slate-700">
                                        {booking.is_trial ? 'Ücretsiz' : '1500 ₺'}
                                    </td>
                                    <td className="p-3 text-right flex justify-end gap-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(booking.id)}>
                                                    <CheckCircle className="w-4 h-4"/>
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(booking.id)}>
                                                    <XCircle className="w-4 h-4"/>
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {bookings.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Kayıt bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
