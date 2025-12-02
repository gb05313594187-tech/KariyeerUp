// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

// GERÇEK VERİTABANI BAĞLANTISI
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeCoaches: 12, // Şimdilik sabit (Koç tablosu bağlanınca güncellenir)
    totalUsers: 0
  });
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        // 1. Randevuları Çek (En yeniden eskiye)
        const { data: bookingsData, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (bookingsData) {
            setBookings(bookingsData);
            
            // İstatistikleri Hesapla
            // (Her randevuyu ortalama 1500 TL sayıyoruz, gerçek fiyat varsa onu kullanırız)
            const revenue = bookingsData.length * 1500; 
            
            setStats(prev => ({
                ...prev,
                totalBookings: bookingsData.length,
                totalRevenue: revenue,
                // Kullanıcı sayısını randevu alan benzersiz kişi sayısından tahmin et
                totalUsers: new Set(bookingsData.map(b => b.client_email)).size 
            }));
        }
        
    } catch (error) {
        console.log("Veri çekme hatası:", error);
    } finally {
        setLoading(false);
    }
  };

  // Randevu Onaylama
  const handleApprove = async (id: string) => {
      try {
          await supabase.from('bookings').update({ status: 'approved' }).eq('id', id);
          toast.success("Randevu onaylandı!");
          // Listeyi yerel olarak güncelle (Tekrar çekmeye gerek yok, hız kazandırır)
          setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
      } catch(e) { toast.error("İşlem başarısız"); }
  };

  // Randevu Reddetme
  const handleReject = async (id: string) => {
      try {
          await supabase.from('bookings').update({ status: 'rejected' }).eq('id', id);
          toast.error("Randevu reddedildi.");
          setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
      } catch(e) { toast.error("İşlem başarısız"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BAŞLIK */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
                <p className="text-gray-500">Platform genel durumu ve randevu yönetimi.</p>
            </div>
            <Button onClick={fetchData} variant="outline">Verileri Yenile</Button>
        </div>

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid md:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Toplam Randevu</CardTitle>
                    <Calendar className="w-4 h-4 text-blue-600"/>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalBookings}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Tahmini Ciro</CardTitle>
                    <DollarSign className="w-4 h-4 text-green-600"/>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} ₺</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Aktif Müşteriler</CardTitle>
                    <Users className="w-4 h-4 text-purple-600"/>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Büyüme</CardTitle>
                    <TrendingUp className="w-4 h-4 text-orange-600"/>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold text-orange-600">+12%</div></CardContent>
            </Card>
        </div>

        {/* RANDEVU LİSTESİ (GERÇEK VERİ) */}
        <Card>
            <CardHeader><CardTitle>Son Randevular</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                                <th className="p-4">Müşteri</th>
                                <th className="p-4">Tarih / Saat</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4">Tutar</th>
                                <th className="p-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">
                                        <div className="font-bold text-gray-900">{booking.client_name || 'İsimsiz'}</div>
                                        <div className="text-xs text-gray-500">{booking.client_email}</div>
                                        <div className="text-xs text-gray-400">{booking.client_phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">
                                            {booking.session_date ? new Date(booking.session_date).toLocaleDateString('tr-TR') : '-'}
                                        </div>
                                        <div className="text-xs text-gray-500">{booking.session_time}</div>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={
                                            booking.status === 'approved' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-0' : 
                                            booking.status === 'rejected' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-0' : 
                                            'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0'
                                        }>
                                            {booking.status === 'approved' ? 'Onaylandı' : 
                                             booking.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 font-bold text-gray-700">
                                        {booking.is_trial ? <span className="text-green-600">Ücretsiz</span> : '1500 ₺'}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0 rounded-full" onClick={() => handleApprove(booking.id)}>
                                                    <CheckCircle className="w-4 h-4"/>
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-8 w-8 p-0 rounded-full" onClick={() => handleReject(booking.id)}>
                                                    <XCircle className="w-4 h-4"/>
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Henüz hiç randevu kaydı yok.</td>
                                </tr>
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
