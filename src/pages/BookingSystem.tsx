// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  CheckCircle2, Globe, ShieldCheck, CreditCard, Info, Star,
  ArrowRight, Video, Lock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase, bookingService, coachService } from '@/lib/supabase';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, addMinutes, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function BookingSystem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTrial = searchParams.get('type') === 'trial';

  // State Management
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [coachSettings, setCoachSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Load Coach & Availability
  useEffect(() => {
    async function loadInitialData() {
      if (!id) return;
      setLoading(true);
      try {
        const [coachData, settings] = await Promise.all([
          coachService.getById(id),
          bookingService.getCoachAvailability(id)
        ]);

        if (coachData) setCoach(coachData);
        if (settings) setCoachSettings(settings);
        
        // Auth check - user bilgilerini form'a önceden doldur
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || '',
            email: user.email || ''
          }));
        }
      } catch (error) {
        toast.error("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [id]);

  // Load Busy Slots when date changes
  useEffect(() => {
    async function checkBusySlots() {
      if (!selectedDate || !id) return;
      const start = startOfDay(selectedDate).toISOString();
      const end = endOfMonth(selectedDate).toISOString();
      const busy = await bookingService.getGoogleBusySlots(id, start, end);
      setBusySlots(busy.map(slot => format(parseISO(slot.start), 'HH:mm')));
    }
    checkBusySlots();
  }, [selectedDate, id]);

  // Calendar Logic
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Time Slot Logic (Koçun working_hours verisine göre)
  const availableSlots = useMemo(() => {
    if (!selectedDate || !coachSettings?.working_hours) return [];
    
    // Basitçe 09:00 - 18:00 arası üret (Working hours entegrasyonu için şablon)
    const slots = [];
    let current = new Date(selectedDate);
    current.setHours(9, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(18, 0, 0);

    while (current < end) {
      const timeStr = format(current, 'HH:mm');
      if (!busySlots.includes(timeStr)) {
        slots.push(timeStr);
      }
      current = addMinutes(current, 60); // 1 saatlik seanslar
    }
    return slots;
  }, [selectedDate, coachSettings, busySlots]);

  const handleBooking = async (e: any) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return toast.error("Lütfen tarih ve saat seçin.");
    
    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      const request = await bookingService.createRequest({
        coach_id: id,
        client_id: (await supabase.auth.getUser()).data.user?.id,
        scheduled_at: scheduledAt.toISOString(),
        duration: 60,
        price: isTrial ? 0 : (coach?.hourly_rate || 1500)
      });

      if (request) {
        toast.success("Randevu talebi oluşturuldu!");
        navigate(isTrial ? '/dashboard' : `/payment/${request.id}`);
      }
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-rose-500">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={coach?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'} 
                className="w-24 h-24 rounded-3xl object-cover border-2 border-rose-600/30 shadow-2xl shadow-rose-600/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-rose-600 p-1.5 rounded-xl shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">{coach?.full_name}</h1>
              <p className="text-rose-500 font-medium tracking-widest text-xs uppercase mb-2">{coach?.title || 'Kariyer Koçu'}</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9 (120+)</span>
                <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Online Seans</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <Badge className="bg-rose-600/10 text-rose-500 border-rose-600/20 mb-2 px-4 py-1">Secure Booking</Badge>
             <div className="text-2xl font-black italic">{isTrial ? 'ÜCRETSİZ' : `${coach?.hourly_rate || 1500} TL`} <span className="text-xs text-gray-500 not-italic">/ 60 dk</span></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Calendar & Slots Column */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-rose-600" />
                    Tarih Seçimi
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 hover:bg-rose-600" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 hover:bg-rose-600" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="text-center mb-4 text-rose-500 font-bold uppercase tracking-widest text-sm">
                  {format(currentMonth, 'MMMM yyyy', { locale: tr })}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                    <div key={day} className="text-[10px] uppercase font-black text-gray-500 pb-4">{day}</div>
                  ))}
                  {days.map((date, idx) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isPast = isBefore(date, startOfDay(new Date()));
                    return (
                      <button
                        key={idx}
                        disabled={isPast}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative
                          ${isPast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-rose-600/20 hover:scale-105'}
                          ${isSelected ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/40 scale-110 z-10' : 'bg-white/5'}
                        `}
                      >
                        <span className="text-lg font-bold">{format(date, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2rem]">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                          <Clock className="w-6 h-6 text-rose-600" />
                          Müsait Saatler
                        </h3>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Timezone: {coachSettings?.timezone || 'Europe/Istanbul'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {availableSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`
                              py-3 rounded-xl font-bold transition-all border
                              ${selectedTime === time 
                                ? 'bg-rose-600 border-rose-500 shadow-lg shadow-rose-600/30 scale-105' 
                                : 'bg-white/5 border-white/10 hover:border-rose-600/50 text-gray-300'}
                            `}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form & Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-rose-600 rounded-[2rem] border-none shadow-2xl shadow-rose-600/20 overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Lock className="w-24 h-24" />
                </div>
                <h3 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2">
                  Özet <ArrowRight className="w-5 h-5" />
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-rose-200 uppercase font-bold">Tarih</span>
                    <span className="font-bold">{selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: tr }) : 'Seçilmedi'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-rose-200 uppercase font-bold">Saat</span>
                    <span className="font-bold">{selectedTime || 'Seçilmedi'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-rose-200 uppercase font-bold">Süre</span>
                    <span className="font-bold">60 Dakika</span>
                  </div>
                  <div className="pt-4 border-t border-rose-500/30 flex justify-between items-end">
                    <span className="text-rose-200 uppercase font-black text-xs">Toplam Tutar</span>
                    <span className="text-3xl font-black italic leading-none">{isTrial ? '0.00 TL' : `${coach?.hourly_rate || 1500} TL`}</span>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-rose-200">Ad Soyad</Label>
                    <Input 
                      className="bg-white/20 border-none rounded-xl placeholder:text-rose-300 h-12 text-white" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-rose-200">E-Posta</Label>
                    <Input 
                      type="email"
                      className="bg-white/20 border-none rounded-xl placeholder:text-rose-300 h-12 text-white" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      required 
                    />
                  </div>
                  <Button 
                    type="submit"
