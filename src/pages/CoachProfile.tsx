// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, Award, Calendar, Heart, Share2, 
  Video, Globe, Briefcase, GraduationCap, Trophy, Users, TrendingUp,
  Clock, DollarSign, Languages, UserPlus, UserMinus
} from 'lucide-react';
import { getCoaches, getReviews } from '@/data/mockData';
import { useFollow } from '@/contexts/FollowContext';
import { useToast } from "@/components/ui/use-toast";
import { PremiumPromotionToast } from '@/components/PremiumPromotionToast';
import CoachBadges from '@/components/CoachBadges';

interface UserReview {
  id: string;
  coachId: string;
  clientName: string;
  rating: number;
  review: string;
  createdAt: string;
  verified: boolean;
}

export default function CoachProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isFollowing, followCoach, unfollowCoach, getFollowCount } = useFollow();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const coaches = getCoaches();
  // ID eşleşmesini gevşek yapıyoruz (string/number hatası olmasın diye)
  const coach = coaches.find(c => String(c.id) === String(id));
  
  // Yorumları güvenli çek
  const [coachReviews, setCoachReviews] = useState([]);
  const reviews = getReviews(id) || [];

  useEffect(() => {
    try {
        const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]') ;
        const filteredReviews = allReviews.filter((r: any) => String(r.coachId) === String(id));
        setCoachReviews(filteredReviews);
    } catch(e) {}
  }, [id]);

  if (!coach) return <div className="min-h-screen flex items-center justify-center">Koç bulunamadı</div>;

  // BUTON YÖNLENDİRMELERİ (DÜZELTİLDİ)
  const handleBooking = () => navigate(`/booking/${coach.id}`);
  const handleTrial = () => navigate(`/booking/${coach.id}?type=trial`);

  const following = isFollowing(coach.id);
  const allReviews = [...reviews, ...coachReviews];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <PremiumPromotionToast coachId={coach.id} coachName={coach.name} isPremium={coach.isPremium} />

      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 overflow-hidden border-2 border-blue-100">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* FOTOĞRAF VE BUTONLAR */}
              <div className="md:col-span-1">
                <div className="relative">
                  <img src={coach.photo} alt={coach.name} className="w-full h-80 object-cover rounded-xl shadow-lg mb-6" />
                </div>

                <div className="space-y-3">
                  {/* DÜZELTİLMİŞ BUTONLAR */}
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={handleBooking}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Hemen Rezervasyon Yap
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-blue-900 text-blue-900 hover:bg-blue-50 h-12 text-lg font-bold"
                    onClick={handleTrial}
                  >
                    {/* BURASI DÜZELTİLDİ */}
                    Deneme Seansı (Ücretsiz)
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsFavorite(!isFavorite)}>
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" className="flex-1"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>

              {/* BİLGİLER */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-blue-900 mb-2">{coach.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{coach.title}</p>
                  <div className="flex gap-2">
                    <Badge className="bg-yellow-400 text-blue-900">ICF {coach.icfLevel}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <Briefcase className="mx-auto mb-2 text-blue-900"/>
                    <div className="font-bold">{coach.experience} Yıl</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <Award className="mx-auto mb-2 text-blue-900"/>
                    <div className="font-bold">{coach.certificates?.length || 0} Sertifika</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <Globe className="mx-auto mb-2 text-blue-900"/>
                    <div className="font-bold">{coach.languages.length} Dil</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2"><DollarSign/> Seans Ücretleri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <div className="text-sm text-gray-600">45 Dakika</div>
                      <div className="text-2xl font-bold text-blue-900">{coach.hourlyRate45}₺</div>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <div className="text-sm text-gray-600">60 Dakika</div>
                      <div className="text-2xl font-bold text-blue-900">{coach.hourlyRate60}₺</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ALT KISIMLAR */}
        <Tabs defaultValue="about">
          <TabsList><TabsTrigger value="about">Hakkımda</TabsTrigger><TabsTrigger value="reviews">Yorumlar</TabsTrigger></TabsList>
          <TabsContent value="about">
            <Card><CardContent className="pt-6"><p className="whitespace-pre-line">{coach.aboutMe}</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card><CardContent className="pt-6">
                {allReviews.map((r, i) => (
                    <div key={i} className="mb-4 border-b pb-4">
                        <div className="font-bold">{r.clientName || 'Misafir'}</div>
                        <div className="flex text-yellow-400">{[...Array(5)].map((_,j) => <Star key={j} className={`h-4 w-4 ${j < r.rating ? 'fill-current' : 'text-gray-300'}`}/>)}</div>
                        <p>{r.review || r.comment}</p>
                    </div>
                ))}
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
