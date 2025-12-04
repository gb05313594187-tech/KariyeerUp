// @ts-nocheck
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoachProfile {
  id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  user_type: string | null;
}

export default function Coaches() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'en':
        return en;
      case 'fr':
        return fr;
      default:
        return tr;
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'K';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, headline, bio, country, city, user_type')
        .eq('user_type', 'coach')        // sadece koçlar
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Koçları çekerken hata:', error);
      } else if (data) {
        setCoaches(data as CoachProfile[]);
      }

      setLoading(false);
    };

    fetchCoaches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {t('Koçlar yükleniyor...', 'Loading coaches...', 'Chargement des coachs...')}
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Başlık */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t('Koçları İncele', 'Browse Coaches', 'Découvrir les coachs')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t(
                'Kariyer hedeflerinize uygun koçu bulun.',
                'Find a coach that matches your career goals.',
                'Trouvez un coach adapté à vos objectifs de carrière.'
              )}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/coach-application')}>
            {t('Koç olmak ister misiniz?', 'Want to be a coach?', 'Vous voulez devenir coach ?')}
          </Button>
        </div>

        {/* Koç kartları */}
        {coaches.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            {t(
              'Henüz listelenecek koç bulunmuyor.',
              'There are no coaches to display yet.',
              "Il n'y a pas encore de coachs à afficher."
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <Card key={coach.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-red-600 text-white">
                      {getInitials(coach.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {coach.full_name || t('İsim belirtilmemiş', 'No name', 'Nom non renseigné')}
                    </CardTitle>
                    <CardDescription>
                      {coach.headline ||
                        t(
                          'Kariyer koçu',
                          'Career Coach',
                          'Coach de carrière'
                        )}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(coach.country || coach.city) && (
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {[coach.city, coach.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

                  {coach.bio && (
                    <p className="text-sm text-gray-700 line-clamp-3">{coach.bio}</p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {t('Koç', 'Coach', 'Coach')}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => {
                        // ileride koç detay sayfasına gidebilirsin
                        // navigate(`/coaches/${coach.id}`);
                      }}
                    >
                      {t('Detay', 'Details', 'Détails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
