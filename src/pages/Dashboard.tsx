// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Shield, CreditCard, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Kullanıcıyı Bul
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUser(user);

        // 2. Bu kullanıcının randevularını çek
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Randevu çekme hatası:', error);
        }

        if (bookings) {
          setAppointments(bookings);
        }
      } catch (e) {
        console.log('Veri çekme hatası:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleJoinMeeting = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Görüşme linki henüz oluşmamış.');
    }
  };

  const handleBuyBadge = () => navigate('/pricing');

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Üst Başlık (sadece başlık + hoş geldiniz) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kontrol Paneli</h1>
            <p className="text-sm text-gray-500">Hoş geldiniz, {user?.email}</p>
          </div>
          {/* Buradaki Ana Sayfa / Çıkış butonları kaldırıldı.
              Artık çıkış ve yönlendirme Navbar üzerinden yapılacak. */}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* SOL KOLON: GERÇEK RANDEVULAR */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">Randevularım</TabsTrigger>
                <TabsTrigger value="history">Geçmiş</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <Card className="border-t-4 border-t-blue-900 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-900" /> Aktif Randevular
                    </CardTitle>
                    <Badge variant="outline" className="text-blue-900">
                      {appointments.length} Kayıt
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((app) => (
                          <div
                            key={app.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                          >
                            {/* Koç resmi yoksa varsayılan göster */}
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-900">Koç Görüşmesi</h3>
                                <Badge
                                  className={
                                    app.is_trial
                                      ? 'bg-green-100 text-green-700 border-0'
                                      : 'bg-blue-100 text-blue-700'
                                  }
                                >
                                  {app.is_trial ? 'Deneme Seansı' : 'Standart'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {new Date(app.session_date).toLocaleDateString('tr-TR')} • {app.session_time}
                              </p>
                              <div className="text-xs text-gray-400">ID: {app.id.slice(0, 8)}...</div>
                            </div>

                            <Button
                              className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800"
                              onClick={() => handleJoinMeeting(app.meeting_url)}
                            >
                              Görüşmeye Git <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Henüz planlanmış bir randevunuz yok.</p>
                        <Button
                          variant="link"
                          onClick={() => navigate('/coaches')}
                          className="text-blue-900"
                        >
                          Hemen Randevu Al
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    Henüz geçmiş randevunuz bulunmamaktadır.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* SAĞ KOLON: İSTATİSTİK + ROZET */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">İstatistikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" /> <span>Toplam Randevu</span>
                  </div>
                  <span className="font-bold">{appointments.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rozet Durumu</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6">
                <Shield className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Rozetiniz Yok</h3>
                <Button variant="outline" className="w-full mt-4" onClick={handleBuyBadge}>
                  Rozet Satın Al
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
