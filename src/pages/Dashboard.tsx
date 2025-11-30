// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Video, Shield, CreditCard, ArrowRight, LogOut, Settings, Home, CheckCircle2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();

  // --- 1. GELECEK RANDEVULAR (Mock) ---
  const upcomingAppointments = [
    {
      id: 1,
      coachName: "Dr. Ayşe Yılmaz",
      title: "Kariyer Geçiş Uzmanı",
      date: "Bugün",
      time: "15:30",
      type: "Deneme Seansı",
      status: "Onaylandı",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  // --- 2. GEÇMİŞ RANDEVULAR (Mock) ---
  const pastAppointments = [
    {
      id: 99,
      coachName: "Mehmet Demir",
      title: "Liderlik Koçu",
      date: "12 Kasım 2024",
      time: "10:00",
      type: "Standart Seans",
      status: "Tamamlandı",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  const handleJoinMeeting = () => {
    window.open('https://meet.jit.si/kariyeer-deneme-seansi-demo', '_blank');
  };

  const handleLogout = () => {
      toast.success("Çıkış yapıldı");
      navigate('/');
  };

  const handleBuyBadge = () => {
      navigate('/pricing'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Üst Başlık */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kontrol Paneli</h1>
            <p className="text-sm text-gray-500">Hoş geldiniz, randevularınızı buradan yönetebilirsiniz.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="ghost" onClick={() => navigate('/')} className="flex-1 md:flex-none">
                <Home className="w-4 h-4 mr-2"/> Ana Sayfa
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="flex-1 md:flex-none">
                <LogOut className="w-4 h-4 mr-2"/> Çıkış
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* SOL KOLON: SEKME YAPISI (YENİ) */}
          <div className="md:col-span-2 space-y-6">
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">Yaklaşan Randevular</TabsTrigger>
                <TabsTrigger value="history">Geçmiş Randevular</TabsTrigger>
              </TabsList>

              {/* SEKME 1: YAKLAŞANLAR */}
              <TabsContent value="upcoming">
                <Card className="border-t-4 border-t-blue-900 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-900"/> Aktif Randevular
                    </CardTitle>
                    <Badge variant="outline" className="text-blue-900">{upcomingAppointments.length} Aktif</Badge>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((app) => (
                          <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                            <img src={app.image} alt={app.coachName} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" />
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-900">{app.coachName}</h3>
                                <Badge className="bg-green-100 text-green-700 border-0">{app.status}</Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{app.title}</p>
                              
                              <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-700">
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-blue-500"/> {app.date}</div>
                                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500"/> {app.time}</div>
                                <div className="flex items-center gap-1"><Video className="w-4 h-4 text-purple-500"/> Online Görüşme</div>
                              </div>
                            </div>

                            <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800" onClick={handleJoinMeeting}>
                              Görüşmeye Git <ArrowRight className="ml-2 w-4 h-4"/>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                        <p>Planlanmış randevunuz bulunmuyor.</p>
                        <Button variant="link" onClick={() => navigate('/')} className="text-blue-900">Hemen Randevu Al</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEKME 2: GEÇMİŞ */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <History className="w-5 h-5 text-gray-500"/> Geçmiş Aktiviteler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                        {pastAppointments.map((app) => (
                          <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg opacity-75">
                            <img src={app.image} alt={app.coachName} className="w-12 h-12 rounded-full object-cover grayscale" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">{app.coachName}</h3>
                                    <Badge variant="secondary" className="bg-gray-200 text-gray-700"><CheckCircle2 className="w-3 h-3 mr-1"/> {app.status}</Badge>
                                </div>
                                <p className="text-sm text-gray-500">{app.date} • {app.time}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* SAĞ KOLON */}
          <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="text-lg">İstatistikler</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-500"/> <span>Toplam Ödeme</span></div>
                        <span className="font-bold">0.00 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-2"><Video className="w-4 h-4 text-gray-500"/> <span>Tamamlanan</span></div>
                        <span className="font-bold">1 Seans</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Rozet Durumu</CardTitle></CardHeader>
              <CardContent className="text-center py-6">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900">Henüz Rozet Yok</h3>
                <p className="text-sm text-gray-500 mb-4">Profilinizi öne çıkarmak için rozet alın.</p>
                <Button variant="outline" className="w-full" onClick={handleBuyBadge}>
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
