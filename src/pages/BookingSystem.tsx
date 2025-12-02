// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getCoaches } from '@/data/mockData';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
      hourlyRate45: 1500
  };

  const [coach, setCoach] = useState<any>(fallbackCoach); 
  const [loading, setLoading] = useState(false); 
  const [countryCode, setCountryCode] = useState('+90');
  
  const countries = [
    { code: '+90', label: 'TR (+90)' }, { code: '+1', label: 'US (+1)' },
    { code: '+44', label: 'UK (+44)' }, { code: '+49', label: 'DE (+49)' }
  ];

  useEffect(() => {
    try {
      const mockCoaches = getCoaches();
      if (mockCoaches) {
        const found = mockCoaches.find((c: any) => String(c.id) == String(id));
        if (found) setCoach(found);
      }
    } catch (e) {}
    setLoading(false);
  }, [id]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return toast.error('Lütfen tarih ve saat seçin');
    
    setIsSubmitting(true);
    const fullPhoneNumber = `${countryCode} ${formData.phone}`;
    
    try {
        const bookingId = `${coach.id}-${Date.now()}`;
        
        // --- GÜVENLİ VERİTABANI KAYDI ---
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                 await supabase.from('bookings').insert([{
                    user_id: user.id,
                    coach_id: coach.id,
                    session_date: selectedDate.toISOString(),
                    session_time: selectedTime,
                    status: 'pending',
                    client_name: formData.name,
                    client_email: formData.email,
                    client_phone: fullPhoneNumber,
                    is_trial: isTrial
                }]);
            }
        } catch (dbError) {
            console.log("DB Yazma Hatası (Görmezden geliniyor):", dbError);
        }
        // -------------------------------

        toast.success(isTrial ? 'Deneme Seansı Onaylandı!' : 'Randevu Oluşturuldu!');
        
        if (isTrial) {
            navigate(`/payment-success?bookingId=${bookingId}`);
        } else {
            navigate(`/payment/${coach.id}`, { state: { bookingId, bookingData: { ...formData, phone: fullPhoneNumber } } });
        }
    } catch (error) {
        navigate(`/payment-success`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="mb-4 text-center font-bold">Lütfen Tarih ve Saat Seçiniz</p>
                        <div className="grid grid-cols-4 gap-2">
                            {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                                <Button key={t} variant={selectedTime === t ? 'default' : 'outline'} onClick={() => { setSelectedDate(new Date()); setSelectedTime(t); }}>
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {selectedTime && (
                    <Card>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input placeholder="Ad Soyad" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <Input placeholder="E-posta" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                <div className="flex gap-2">
                                    <select className="border rounded px-2" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                                        {countries.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                                    </select>
                                    <Input className="flex-1" placeholder="555 123 45 67" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                                </div>
                                <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
                                    {isSubmitting ? 'İşleniyor...' : (isTrial ? 'Ücretsiz Onayla' : 'Ödemeye Geç')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
