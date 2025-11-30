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
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { getCoaches } from '@/data/mockData';
import { toast } from 'sonner';

export default function BookingSystem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const isTrial = searchParams.get('type') === 'trial';

  // YEDEK KOÇ
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
  
  // --- YENİ: ÜLKE KODU STATE'İ ---
  const [countryCode, setCountryCode] = useState('+90');

  // POPÜLER ÜLKE KODLARI LİSTESİ
  const countries = [
    { code: '+90', label: '🇹🇷 TR (+90)' },
    { code: '+1', label: '🇺🇸 US (+1)' },
    { code: '+44', label: '🇬🇧 UK (+44)' },
    { code: '+49', label: '🇩🇪 DE (+49)' },
    { code: '+33', label: '🇫🇷 FR (+33)' },
    { code: '+31', label: '🇳🇱 NL (+31)' },
    { code: '+994', label: '🇦🇿 AZ (+994)' },
    { code: '+971', label: '🇦🇪 AE (+971)' },
    { code: '+966', label: '🇸🇦 SA (+966)' },
    { code: '+7', label: '🇷🇺 RU (+7)' },
  ];

  useEffect(() => {
    try {
      const mockCoaches = getCoaches();
      if (mockCoaches) {
        const found = mockCoaches.find((c: any) => String(c.id) == String(id));
        if (found) setCoach(found);
      }
    }
