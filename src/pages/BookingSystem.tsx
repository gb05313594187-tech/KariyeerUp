import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getCoaches } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateJitsiRoomUrl, getMeetingInstructions } from '@/lib/jitsiMeet';
import { toast } from 'sonner';

export default function BookingSystem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const coaches = getCoaches();
  const coach = coaches.find(c => c.id === id);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Koç bulunamadı</p>
      </div>
    );
  }

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Generate available time slots (9:00 - 18:00)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break; // Stop at 18:00
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const calendarDays = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly >= today;
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error('Lütfen tarih ve saat seçin');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Generate unique booking ID
    const bookingId = `${coach.id}-${Date.now()}`;
    
    // Generate Jitsi Meet URL
    const meetingUrl = generateJitsiRoomUrl(bookingId, coach.name, formData.name);
    
    // Store booking data in localStorage (in real app, this would be saved to database)
    const bookingData = {
      id: bookingId,
      coachId: coach.id,
      coachName: coach.name,
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      date: selectedDate.toISOString(),
      time: selectedTime,
      notes: formData.notes,
      meetingUrl: meetingUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
    
    // Show success message with meeting link
    toast.success('Randevu oluşturuldu!', {
      description: 'Video görüşme linki e-posta adresinize gönderildi.',
      duration: 5000,
    });
    
    // Navigate to payment page
    navigate(`/payment/${coach.id}`, { 
      state: { 
        bookingId,
        meetingUrl,
        bookingData 
      } 
    });
  };

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Randevu Oluştur</h1>
          <p className="text-gray-600">Uygun tarih ve saati seçin</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar and Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousMonth}
                    disabled={
                      currentMonth.getMonth() === today.getMonth() &&
                      currentMonth.getFullYear() === today.getFullYear()
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-xl text-blue-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers */}
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((date, index) => {
                    const isAvailable = isDateAvailable(date);
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = date && isSameDay(date, today);

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        disabled={!isAvailable}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all
                          ${!date ? 'invisible' : ''}
                          ${!isAvailable ? 'text-gray-300 cursor-not-allowed' : ''}
                          ${isAvailable && !isSelected ? 'text-gray-900 hover:bg-blue-50 border border-gray-200' : ''}
                          ${isSelected ? 'bg-blue-900 text-white border-2 border-blue-900' : ''}
                          ${isToday && !isSelected ? 'border-2 border-blue-400' : ''}
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-400 rounded"></div>
                    <span>Bugün</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-900 rounded"></div>
                    <span>Seçili</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Saat Seçin
                  </CardTitle>
                  <CardDescription>
                    {selectedDate.toLocaleDateString('tr-TR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = time === selectedTime;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-3 px-2 rounded-lg text-sm font-medium transition-all
                            ${isSelected
                              ? 'bg-blue-900 text-white border-2 border-blue-900'
                              : 'bg-white text-gray-900 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                            }
                          `}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            {selectedDate && selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">İletişim Bilgileri</CardTitle>
                  <CardDescription>Sizinle iletişime geçebilmemiz için bilgilerinizi girin</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notlar (İsteğe bağlı)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Koçunuza iletmek istediğiniz özel notlar..."
                        rows={4}
                      />
                    </div>
                    
                    {/* Video Call Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-2">Ücretsiz Video Görüşme</h4>
                          <p className="text-sm text-gray-700 mb-2">
                            Randevunuz onaylandıktan sonra, video görüşme linki e-posta adresinize gönderilecektir.
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>✓ Kurulum gerektirmez, tarayıcıdan katılın</li>
                            <li>✓ Ekran paylaşımı ve sohbet özellikleri</li>
                            <li>✓ Güvenli ve şifreli bağlantı</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg">
                      Ödemeye Geç
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coach Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Randevu Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coach Info */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-blue-900">{coach.name}</p>
                    <p className="text-sm text-gray-600">{coach.title}</p>
                  </div>
                </div>

                {/* Selected Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Tarih</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDate
                          ? selectedDate.toLocaleDateString('tr-TR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Seçilmedi'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Saat</p>
                      <p className="font-semibold text-gray-900">
                        {selectedTime || 'Seçilmedi'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Seans Türü</p>
                      <p className="font-semibold text-gray-900">Online Video</p>
                      <p className="text-xs text-green-600 mt-1">✓ Ücretsiz Jitsi Meet</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">45 Dakika Seans</span>
                    <span className="font-semibold">{coach.hourlyRate45}₺</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-blue-900">Toplam</span>
                    <span className="text-blue-900">{coach.hourlyRate45}₺</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Diller</p>
                  <div className="flex flex-wrap gap-2">
                    {coach.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}