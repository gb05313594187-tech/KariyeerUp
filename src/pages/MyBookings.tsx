import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, ExternalLink, Copy, Check, Download } from 'lucide-react';
import { openJitsiMeeting, getMeetingInstructions } from '@/lib/jitsiMeet';
import CalendarIntegrationButtons from '@/components/CalendarIntegrationButtons';
import { exportToExcel, prepareBookingsForExport } from '@/lib/excelExport';
import { toast } from 'sonner';

interface Booking {
  id: string;
  coachId: string;
  coachName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  notes: string;
  meetingUrl: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  const handleCopyLink = (meetingUrl: string, bookingId: string) => {
    navigator.clipboard.writeText(meetingUrl);
    setCopiedId(bookingId);
    toast.success('Video görüşme linki kopyalandı!');
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleJoinMeeting = (meetingUrl: string) => {
    openJitsiMeeting(meetingUrl);
    toast.info('Video görüşme yeni pencerede açılıyor...');
  };

  const handleExportBookings = () => {
    const data = prepareBookingsForExport(bookings.map(b => ({
      id: b.id,
      coach_name: b.coachName,
      user_name: b.clientName,
      date: b.date,
      time: b.time,
      status: b.status,
      notes: b.notes
    })));
    const success = exportToExcel(data, 'Randevularım', 'Randevular');
    if (success) {
      toast.success('Randevular Excel dosyasına aktarıldı!');
    } else {
      toast.error('Excel dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Onaylandı', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Tamamlandı', className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'İptal Edildi', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Randevularım</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 mb-2">Henüz randevunuz yok</p>
              <p className="text-gray-500 mb-6">Bir koç seçerek ilk randevunuzu oluşturun</p>
              <Button 
                className="bg-blue-900 hover:bg-blue-800"
                onClick={() => window.location.href = '/coaches'}
              >
                Koçları Keşfet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Randevularım</h1>
            <p className="text-gray-600">{bookings.length} aktif randevu</p>
          </div>
          <Button onClick={handleExportBookings} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Excel'e Aktar
          </Button>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-blue-900 mb-1">
                      {booking.coachName}
                    </CardTitle>
                    <CardDescription>
                      Randevu ID: {booking.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Tarih</p>
                      <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Saat</p>
                      <p className="font-semibold text-gray-900">{booking.time}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Notlar:</p>
                    <p className="text-gray-900">{booking.notes}</p>
                  </div>
                )}

                {/* Calendar Integration */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <CalendarIntegrationButtons
                    coachName={booking.coachName}
                    clientName={booking.clientName}
                    date={booking.date}
                    time={booking.time}
                    duration={45}
                    meetingUrl={booking.meetingUrl}
                  />
                </div>

                {/* Video Meeting Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Video className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">Video Görüşme</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Randevu saatinde aşağıdaki butona tıklayarak görüşmeye katılabilirsiniz
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-900 hover:bg-blue-800"
                          onClick={() => handleJoinMeeting(booking.meetingUrl)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Görüşmeye Katıl
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(booking.meetingUrl, booking.id)}
                        >
                          {copiedId === booking.id ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Kopyalandı
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Linki Kopyala
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(booking.meetingUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Yeni Sekmede Aç
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Meeting Instructions */}
                  <details className="mt-3">
                    <summary className="text-sm text-blue-900 cursor-pointer hover:underline">
                      Video görüşme talimatlarını görüntüle
                    </summary>
                    <div className="mt-2 text-xs text-gray-700 whitespace-pre-line bg-white p-3 rounded">
                      {getMeetingInstructions('tr')}
                    </div>
                  </details>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t text-sm text-gray-600">
                  <p><strong>İletişim:</strong> {booking.clientEmail} • {booking.clientPhone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}