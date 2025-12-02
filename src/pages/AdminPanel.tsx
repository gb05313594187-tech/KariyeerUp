// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Activity, Brain, Lightbulb, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// --- GÜVENLİ BAĞLANTI (ÇÖKMEYİ ÖNLER) ---
// Eğer anahtarlar yoksa boş metin kullan, böylece site beyaz ekrana düşmez.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);
// -----------------------------------------

const ADMIN_EMAILS = ['demo@kariyeer.com', 'gokalp_byc@hotmail.com', 'admin@kariyeer.com'];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, activeCoaches: 12, totalUsers: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
        // 1. Kim Girdi?
        const { data: { user } } = await supabase.auth.getUser();
        
        // 2. Yetki Kontrolü
        if (!user || !ADMIN_EMAILS.includes(user.email)) {
            // Yetkisiz ama siteyi çökertme, sadece yönlendir
            navigate('/'); 
            return;
        }

        setIsAuthorized(true);

        // 3. Verileri Çek
        const { data: bookingsData } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (bookingsData) {
            setBookings(bookingsData);
            const revenue = bookingsData.length * 1500; 
            const userCount = new Set(bookingsData.map(b => b.client_email)).size;

            setStats({
                totalBookings: bookingsData.length,
                totalRevenue: revenue,
                activeCoaches: 15,
                totalUsers: userCount
            });

            const insights = [];
            if (revenue > 0) insights.push("📈 Ciro artışı pozitif trend gösteriyor.");
            else insights.push("⚠️ Henüz ciro girişi yok.");
            
            setAiInsights(insights);
        }
    } catch (error) {
        console.log("Panel hatası:", error);
    } finally {
        setLoading(false);
    }
  };

  // İşlem Fonksiyonları
  const handleApprove = async (id: string) => {
      try {
        await supabase.from('bookings').update({ status: 'approved' }).eq('id', id);
        toast.success("Onaylandı");
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
      } catch(e) {}
  };

  const handleReject = async (id: string) => {
      try {
        await supabase.from('bookings').update({ status: 'rejected' }).eq('id', id);
        toast.error("Reddedildi");
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
      } catch(e) {}
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;
  if (!isAuthorized) return null; 

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
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Lock className="w-3 h-3 mr-1"/> Güvenli Mod</Badge>
                <Button onClick={checkAuthAndFetch} variant="default" className="bg-slate-900 text-white hover:bg-slate-800">Yenile</Button>
            </div>
        </div>

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
                    <div className="text-sm font-medium text-gray-500 mb-1">Toplam Randevu</div>
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
            <CardHeader><CardTitle>Gelen Tüm Randevular</CardTitle></CardHeader>
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
                        <tbody className="divide-y bg-white">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-bold text-slate-900">{booking.client_name}</div>
                                        <div className="text-xs text-gray-500">{booking.client_email}</div>
                                        <div className="text-xs text-gray-400">{booking.client_phone}</div>
                                    </td>
                                    <td className="p-3">
                                        {new Date(booking.created_at).toLocaleDateString('tr-TR')}
                                        <div className="text-xs text-gray-400">{booking.session_time}</div>
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
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 w-16 text-xs" onClick={() => handleApprove(booking.id)}>
                                                    Onayla
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-8 w-16 text-xs" onClick={() => handleReject(booking.id)}>
                                                    Reddet
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {bookings.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Henüz hiç randevu kaydı yok.</td></tr>
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
