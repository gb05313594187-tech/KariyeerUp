// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Activity, Brain, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// GERÇEK VERİTABANI BAĞLANTISI
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
        // 1. TÜM Randevuları Çek (En yeniden eskiye)
        const { data: bookingsData, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (bookingsData) {
            setBookings(bookingsData);
            
            // İstatistikleri Hesapla
            // (Sadece onaylı veya bekleyenleri ciroya dahil edebilirsin, şimdilik hepsini sayıyoruz)
            const revenue = bookingsData.length * 1500; 
            
            // Benzersiz müşteri sayısını bul
            const uniqueUsers = new Set(bookingsData.map(b => b.client_email)).size;

            setStats({
                totalBookings: bookingsData.length,
                totalRevenue: revenue,
                activeCoaches: 15, // Sabit değer (veya coaches tablosundan çekilebilir)
                totalUsers: uniqueUsers
            });

            // AI Yorumları (Basit Mantık)
            const insights = [];
            if (revenue > 0) insights.push("📈 Ciro artışı pozitif trend gösteriyor.");
            else insights.push("⚠️ Henüz ciro girişi yok, trafik çekmeye odaklanın.");
            
            if (bookingsData.length > 0) {
                insights.push(`🔥 Son randevu: ${new Date(bookingsData[0].created_at).toLocaleDateString('tr-TR')}`);
            }
            
            setAiInsights(insights);
        }
    } catch (error) {
        console.log("Veri çekme hatası:", error);
        toast.error("Veriler yüklenirken bir sorun oluştu.");
    } finally {
        setLoading(false);
    }
  };

  // Onaylama İşlemi
  const handleApprove = async (id: string) => {
      try {
        await supabase.from('bookings').update({ status: 'approved' }).eq('id', id);
        toast.success("Randevu onaylandı!");
        // Listeyi yerel olarak güncelle (Hız için)
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
      } catch(e) {
        toast.error("İşlem başarısız oldu");
      }
  };

  // Reddetme İşlemi
  const handleReject = async (id: string) => {
      try {
        await supabase.from('bookings').update({ status: 'rejected' }).eq('id', id);
        toast.error("Randevu reddedildi.");
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
      } catch(e) {
        toast.error("İşlem başarısız oldu");
      }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-slate-600">Admin Paneli Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BAŞLIK */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="text-blue-600"/> Yönetici Paneli
                </h1>
                <p className="text-slate-500">CEO Dashboard & KPI Takibi</p>
            </div>
            <Button onClick={fetchData} variant="default" className="bg-slate-900 text-white hover:bg-slate-800">
                Verileri Yenile
            </Button>
        </div>

        {/* AI ANALİZ KUTUSU */}
        <Card className="bg-indigo-50 border-indigo-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <Brain className="w-5 h-5"/> Kariyeer AI Asistanı
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-indigo-800 bg-white/60 p-2 rounded border border-indigo-100">
                            <Lightbulb className="w-4 h-4 text-yellow-500"/> {insight}
                        </div>
                    )) : <span className="text-gray-400 italic">Veri toplanıyor...</span>}
                </div>
            </CardContent>
        </Card>

        {/* KPI KARTLARI */}
        <div className="grid md:grid-cols-4 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Toplam Ciro</p>
                            <h3 className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} ₺</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded text-green-600"><DollarSign className="w-5 h-5"/></div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Toplam Randevu</p>
                            <h3 className="text-3xl font-bold text-blue-900">{stats.totalBookings}</h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded text-blue-600"><Calendar className="w-5 h-5"/></div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Müşteriler</p>
                            <h3 className="text-3xl font-bold text-purple-900">{stats.totalUsers}</h3>
                        </div>
                        <div className="p-2 bg-purple-100 rounded text-purple-600"><Users className="w-5 h-5"/></div>
                    </div>
                </CardContent>
            </Card>
             <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Aktif Koçlar</p>
                            <h3 className="text-3xl font-bold text-orange-600">{stats.activeCoaches}</h3>
                        </div>
                        <div className="p-2 bg-orange-100 rounded text-orange-600"><TrendingUp className="w-5 h-5"/></div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* RANDEVU LİSTESİ */}
        <Card className="shadow-md border-t-4 border-t-slate-900">
            <CardHeader><CardTitle>Gelen Tüm Randevular</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Müşteri</th>
                                <th className="p-4">Tarih / Saat</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4">Tutar</th>
                                <th className="p-4 text-right rounded-tr-lg">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{booking.client_name || 'İsimsiz'}</div>
                                        <div className="text-xs text-slate-500">{booking.client_email}</div>
                                        <div className="text-xs text-slate-400">{booking.client_phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-700">
                                            {new Date(booking.created_at).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="text-xs text-slate-500">{booking.session_time}</div>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={
                                            booking.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-0' : 
                                            booking.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200 border-0' : 
                                            'bg-blue-100 text-blue-800 hover:bg-blue-200 border-0'
                                        }>
                                            {booking.status === 'approved' ? 'Onaylandı' : 
                                             booking.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">
                                        {booking.is_trial ? <span className="text-green-600">Ücretsiz</span> : '1500 ₺'}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 w-24" onClick={() => handleApprove(booking.id)}>
                                                    <CheckCircle className="w-4 h-4 mr-2"/> Onayla
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-8 w-24" onClick={() => handleReject(booking.id)}>
                                                    <XCircle className="w-4 h-4 mr-2"/> Reddet
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {bookings.length === 0 && (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400 italic">Henüz hiç randevu kaydı yok.</td></tr>
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
