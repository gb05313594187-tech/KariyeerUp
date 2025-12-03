// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Activity, Brain, Lightbulb, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, activeCoaches: 12, totalUsers: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
        }
    } catch (error) {
        console.log("Hata:", error);
    } finally {
        setLoading(false);
    }
  };

  // Onaylama
  const handleApprove = async (id: string) => {
      await supabase.from('bookings').update({ status: 'approved' }).eq('id', id);
      toast.success("Onaylandı");
      fetchData();
  };

  // Reddetme
  const handleReject = async (id: string) => {
      await supabase.from('bookings').update({ status: 'rejected' }).eq('id', id);
      toast.error("Reddedildi");
      fetchData();
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-800 p-8 font-sans"> {/* AYIRT EDİLMESİ İÇİN KOYU TEMA YAPTIM */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BAŞLIK - CEO PANELİ OLDUĞU BELLİ OLSUN */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Activity className="text-red-600 w-8 h-8"/> CEO / YÖNETİCİ PANELİ
                </h1>
                <p className="text-slate-500 mt-1">Şirket finansalları ve randevu yönetimi.</p>
            </div>
            <Button onClick={fetchData} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Verileri Yenile
            </Button>
        </div>

        {/* KPI KARTLARI */}
        <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-xl border-none">
                <CardContent className="pt-6">
                    <div className="text-sm font-bold text-gray-400 mb-1 uppercase">Toplam Ciro</div>
                    <div className="text-4xl font-extrabold text-green-600">{stats.totalRevenue.toLocaleString()} ₺</div>
                    <DollarSign className="w-8 h-8 text-green-100 absolute top-6 right-6"/>
                </CardContent>
            </Card>
            <Card className="bg-white shadow-xl border-none">
                <CardContent className="pt-6">
                    <div className="text-sm font-bold text-gray-400 mb-1 uppercase">Toplam Randevu</div>
                    <div className="text-4xl font-extrabold text-blue-900">{stats.totalBookings}</div>
                    <Calendar className="w-8 h-8 text-blue-100 absolute top-6 right-6"/>
                </CardContent>
            </Card>
             <Card className="bg-white shadow-xl border-none">
                <CardContent className="pt-6">
                    <div className="text-sm font-bold text-gray-400 mb-1 uppercase">Müşteriler</div>
                    <div className="text-4xl font-extrabold text-purple-900">{stats.totalUsers}</div>
                    <Users className="w-8 h-8 text-purple-100 absolute top-6 right-6"/>
                </CardContent>
            </Card>
             <Card className="bg-white shadow-xl border-none">
                <CardContent className="pt-6">
                    <div className="text-sm font-bold text-gray-400 mb-1 uppercase">Aktif Koçlar</div>
                    <div className="text-4xl font-extrabold text-orange-600">{stats.activeCoaches}</div>
                    <TrendingUp className="w-8 h-8 text-orange-100 absolute top-6 right-6"/>
                </CardContent>
            </Card>
        </div>

        {/* RANDEVU LİSTESİ */}
        <Card className="shadow-xl border-none">
            <CardHeader className="border-b bg-gray-50 rounded-t-xl"><CardTitle>Gelen Tüm Randevular</CardTitle></CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 border-b">
                            <tr>
                                <th className="p-4">Müşteri</th>
                                <th className="p-4">Tarih</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4">Tutar</th>
                                <th className="p-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-bold text-lg">{booking.client_name}</div>
                                        <div className="text-gray-500">{booking.client_email}</div>
                                    </td>
                                    <td className="p-4 font-medium">
                                        {new Date(booking.created_at).toLocaleDateString('tr-TR')} <br/>
                                        <span className="text-gray-400 text-xs">{booking.session_time}</span>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={
                                            booking.status === 'approved' ? 'bg-green-500' : 
                                            booking.status === 'rejected' ? 'bg-red-500' : 
                                            'bg-yellow-500'
                                        }>
                                            {booking.status === 'approved' ? 'ONAYLANDI' : 
                                             booking.status === 'rejected' ? 'REDDEDİLDİ' : 'BEKLİYOR'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 font-bold text-lg text-slate-700">
                                        {booking.is_trial ? '0 ₺' : '1500 ₺'}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(booking.id)}>
                                                    <CheckCircle className="w-4 h-4 mr-1"/> Onayla
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleReject(booking.id)}>
                                                    <XCircle className="w-4 h-4 mr-1"/> Reddet
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
