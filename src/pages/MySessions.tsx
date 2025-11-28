import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Video, Star, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface Session {
  id: string;
  coachId: string;
  coachName: string;
  coachPhoto: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  rating?: number;
}

export default function MySessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - gerçek uygulamada Supabase'den gelecek
    const mockSessions: Session[] = [
      {
        id: '1',
        coachId: 'coach1',
        coachName: 'Dr. Ayşe Yılmaz',
        coachPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        date: '2024-01-15',
        time: '14:00',
        duration: 45,
        status: 'upcoming',
        meetingLink: '/video-session/1',
      },
      {
        id: '2',
        coachId: 'coach2',
        coachName: 'Mehmet Kaya',
        coachPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        date: '2024-01-10',
        time: '10:00',
        duration: 60,
        status: 'completed',
        notes: 'Kariyer hedeflerim üzerine çok verimli bir görüşme oldu.',
        rating: 5,
      },
      {
        id: '3',
        coachId: 'coach3',
        coachName: 'Zeynep Demir',
        coachPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        date: '2024-01-20',
        time: '16:00',
        duration: 45,
        status: 'upcoming',
        meetingLink: '/video-session/3',
      },
    ];

    setSessions(mockSessions);
    setLoading(false);
  }, []);

  const canJoinSession = (session: Session) => {
    if (session.status !== 'upcoming') return false;
    
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const now = new Date();
    const diffMinutes = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60);
    
    // Seans saatinden 15 dakika önce katılım açılır
    return diffMinutes <= 15 && diffMinutes >= -session.duration;
  };

  const getSessionStatus = (session: Session) => {
    if (session.status === 'completed') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Tamamlandı</Badge>;
    }
    if (session.status === 'cancelled') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />İptal Edildi</Badge>;
    }
    
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const now = new Date();
    const diffMinutes = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 15 && diffMinutes >= 0) {
      return <Badge className="bg-yellow-500 animate-pulse"><AlertCircle className="h-3 w-3 mr-1" />Yakında Başlıyor</Badge>;
    }
    
    return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />Planlandı</Badge>;
  };

  const handleJoinSession = (session: Session) => {
    if (!canJoinSession(session)) {
      toast.error('Seansa katılım henüz açılmadı. Seans saatinden 15 dakika önce katılabilirsiniz.');
      return;
    }
    
    navigate(session.meetingLink!);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Giriş Gerekli</CardTitle>
              <CardDescription>Seanslarınızı görüntülemek için giriş yapmalısınız</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/login')} className="w-full">
                Giriş Yap
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Seanslarım</h1>
          <p className="text-gray-600">Video görüşmelerinizi yönetin ve geçmiş seanslarınızı görüntüleyin</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="upcoming">
              Yaklaşan ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Tamamlanan ({completedSessions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              İptal ({cancelledSessions.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Yaklaşan seansınız bulunmuyor</p>
                  <Button onClick={() => navigate('/coaches')}>
                    Yeni Seans Rezerve Et
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map(session => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <img
                        src={session.coachPhoto}
                        alt={session.coachName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900 mb-1">
                              {session.coachName}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(session.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {session.time} ({session.duration} dk)
                              </span>
                            </div>
                          </div>
                          {getSessionStatus(session)}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleJoinSession(session)}
                            disabled={!canJoinSession(session)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Seansa Katıl
                          </Button>
                          <Button variant="outline" onClick={() => navigate(`/coach/${session.coachId}`)}>
                            Koç Profili
                          </Button>
                          <Button variant="outline" className="text-red-600 hover:text-red-700">
                            İptal Et
                          </Button>
                        </div>

                        {!canJoinSession(session) && session.status === 'upcoming' && (
                          <p className="text-sm text-gray-500 mt-3">
                            💡 Seansa katılım, seans saatinden 15 dakika önce açılacaktır
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Completed Sessions */}
          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz tamamlanmış seansınız yok</p>
                </CardContent>
              </Card>
            ) : (
              completedSessions.map(session => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <img
                        src={session.coachPhoto}
                        alt={session.coachName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900 mb-1">
                              {session.coachName}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(session.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {session.time} ({session.duration} dk)
                              </span>
                            </div>
                          </div>
                          {session.rating ? (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < session.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-1" />
                              Değerlendir
                            </Button>
                          )}
                        </div>

                        {session.notes && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-700">{session.notes}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => navigate(`/coach/${session.coachId}`)}>
                            Koç Profili
                          </Button>
                          <Button variant="outline" onClick={() => navigate(`/booking/${session.coachId}`)}>
                            Yeni Seans Rezerve Et
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Cancelled Sessions */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">İptal edilmiş seansınız yok</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-gray-600">İptal edilmiş seanslar burada görünecek</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}