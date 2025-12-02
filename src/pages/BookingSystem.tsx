// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getCoaches } from '@/data/mockData';
import { toast } from 'sonner';

export default function BookingSystem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const isTrial = searchParams.get('type') === 'trial';

  const fallbackCoach = {
      id: id || '1',
      name: 'Kariyer Koçu', 
      title: 'Uzman Koç',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      hourlyRate45: 1500,
      languages: ['Türkçe']
  };

  const [coach, setCoach] = useState<any>(fallbackCoach); 
  const [loading, setLoading] = useState(false); 
  
  // --- YENİ: DİNAMİK PLACEHOLDER SİSTEMİ ---
  const [countryCode, setCountryCode] = useState('+90');
  const [phonePlaceholder, setPhonePlaceholder] = useState('555 123 45 67');

  const countries = [
    { code: '+90', label: 'TR (+90)', placeholder: '555 123 45 67' },
    { code: '+1', label: 'US (+1)', placeholder: '202 555 0123' },
    { code: '+44', label: 'UK (+44)', placeholder: '7911 123456' },
    { code: '+49', label: 'DE (+49)', placeholder: '151 12345678' },
    { code: '+33', label: 'FR (+33)', placeholder: '6 12 34 56 78' },
    { code: '+31', label: 'NL (+31)', placeholder: '6 12345678' },
    { code: '+994', label: 'AZ (+994)', placeholder: '50 123 45 67' },
    { code: '+971', label: 'AE (+971)', placeholder: '50 123 4567' },
    { code: '+966', label: 'SA (+966)', placeholder: '50 123 4567' },
    { code: '+7', label: 'RU (+7)', placeholder: '999 123-45-67' },
  ];

  // Ülke değişince örnek numarayı değiştir
  const handleCountryChange = (e: any) => {
      const code = e.target.value;
      setCountryCode(code);
      const selected = countries.find(c => c.code === code);
      if (selected) setPhonePlaceholder(selected.placeholder);
  };
  // ------------------------------------------

  useEffect(() => {
    try {
      const mockCoaches = getCoaches();
      if (mockCoaches) {
        const found = mockCoaches.find((c: any) => String(c.id) == String(id));
        if (found) setCoach(found);
      }
    } catch (e) { console.log(e); }
    setLoading(false);
  }, [id]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
    return days;
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const calendarDays = getDaysInMonth(currentMonth);
  const timeSlots = generateTimeSlots();
  const today = new Date();
  today.setHours(0,0,0,0);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return toast.error('Lütfen tarih ve saat seçin');
    
    setIsSubmitting(true);
    const fullPhoneNumber = `${countryCode} ${formData.phone}`;
    console.log("Telefon:", fullPhoneNumber);

    setTimeout(() => {
        const bookingId = `${coach.id}-${Date.now()}`;

        if (isTrial) {
            toast.success('Deneme Seansı Onaylandı!');
            navigate(`/payment-success?bookingId=${bookingId}`);
        } else {
            toast.success('Ödeme sayfasına yönlendiriliyorsunuz...');
            navigate(`/payment/${coach.id}`, { state: { bookingId, bookingData: { ...formData, phone: fullPhoneNumber } } });
        }
        
        setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
               <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}><ChevronLeft className="h-4 w-4"/></Button>
               <CardTitle className="text-base">{currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</CardTitle>
               <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}><ChevronRight className="h-4 w-4"/></Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Pz','Pt','Sa','Ça','Pe','Cu','Ct'].map(d => <div key={d} className="text-xs font-bold text-gray-500">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, i) => (
                  <button key={i} disabled={!date || date < today} onClick={() => date && setSelectedDate(date)} 
                    className={`p-2 rounded text-sm w-full aspect-square flex items-center justify-center 
                    ${!date ? 'invisible' : ''} 
                    ${selectedDate?.toDateString() === date?.toDateString() ? 'bg-blue-900 text-white' : 'hover:bg-gray-100'}
                    ${date && date < today ? 'text-gray-300' : ''}`}>
                    {date?.getDate()}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="animate-in fade-in slide-in-from-top-4">
              <CardHeader className="py-4"><CardTitle className="text-base flex gap-2"><Clock className="w-5 h-5"/> Saat Seçin</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map(t => (
                  <Button key={t} variant={selectedTime === t ? "default" : "outline"} className={selectedTime === t ? "bg-blue-900" : "text-xs"} onClick={() => setSelectedTime(t)}>{t}</Button>
                ))}
              </CardContent>
            </Card>
          )}

          {selectedDate && selectedTime && (
            <Card className="animate-in fade-in slide-in-from-top-4">
              <CardHeader className="py-4"><CardTitle className="text-base">İletişim Bilgileri</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2"><Label>Ad Soyad</Label><Input value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} required /></div>
                  <div className="grid gap-2"><Label>E-posta</Label><Input type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} required /></div>
                  
                  {/* --- YENİ: AKILLI TELEFON ALANI --- */}
                  <div className="grid gap-2">
                    <Label>Telefon</Label>
                    <div className="flex gap-2">
                        <select 
                            className="flex h-10 w-[110px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={countryCode}
                            onChange={handleCountryChange}
                        >
                            {countries.map((c) => (
                                <option key={c.code} value={c.code}>{c.label}</option>
                            ))}
                        </select>
                        <Input 
                            className="flex-1"
                            type="tel" 
                            // DİNAMİK PLACEHOLDER
                            placeholder={phonePlaceholder} 
                            value={formData.phone} 
                            onChange={(e: any) => setFormData({...formData, phone: e.target.value})} 
                            required 
                        />
                    </div>
                  </div>
                  {/* ---------------------------------- */}

                  <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg font-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'İşleniyor...' : (isTrial ? 'Ücretsiz Randevuyu Onayla' : 'Ödemeye Geç')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-4 border-t-4 border-t-blue-900">
            <CardHeader className="pb-2"><CardTitle>Randevu Özeti</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <img src={coach.photo} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                <div>
                  <div className="font-bold text-blue-900">{coach.name}</div>
                  <div className="text-xs text-gray-500">{coach.title}</div>
                  {isTrial && <Badge className="mt-1 bg-green-500 hover:bg-green-600 text-white border-0"><CheckCircle2 className="w-3 h-3 mr-1"/> Ücretsiz Deneme</Badge>}
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t mt-2">
                <span>Toplam:</span>
                <span className={isTrial ? "text-green-600" : "text-blue-900"}>
                    {isTrial ? '0.00 TL' : `${coach.hourlyRate45} TL`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
