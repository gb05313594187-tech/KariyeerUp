// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, Award, Calendar, CheckCircle, Heart, Share2, 
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
  const [coachReviews, setCoachReviews] = useState<UserReview[]>([]);
  
  const coaches = getCoaches();
  // ID eşleşmesini gevşek yapıyoruz (string/number hatası olmasın diye)
  const coach = coaches.find(c => String(c.id) === String(id));
  const reviews = getReviews(id);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]') as UserReview[];
    const filteredReviews = allReviews.filter((r: UserReview) => r.coachId === id);
    setCoachReviews(filteredReviews);
  }, [id]);

  if (!coach) return <div className="min-h-screen flex items-center justify-center">Koç bulunamadı</div>;

  const handleBooking = () => {
    // DOĞRU YÖNLENDİRME
    navigate(`/booking/${coach.id}`);
  };

  const handleTrial = () => {
    // DENEME SEANSI PARAMETRESİ
    navigate(`/booking/${coach.id}?type=trial`);
  };

  const following = isFollowing(coach.id);
  const followerCount = getFollowCount(coach.id);
  const allReviews = [...reviews, ...coachReviews];

  const isPremium = coach.isPremium;
  const isVerified = coach.isVerified;
  const premiumBorderClass = isPremium ? 'border-2 border-yellow-400 shadow-2xl' : '';
  const premiumBgClass = isPremium ? 'bg-gradient-to-br from-yellow-50 to-white' : 'bg-white';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <PremiumPromotionToast coachId={coach.id} coachName={coach.name} isPremium={isPremium} />

      <div className="max-w-7xl mx-auto">
        {isPremium && (
          <div className="mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg">
            <Trophy className="h-5 w-5" />
            <span className="font-bold">Premium Koç</span>
          </div>
        )}

        <Card className={`${premiumBorderClass} ${premiumBgClass} mb-6`}>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* SOL KOLON */}
              <div className="md:col-span-1">
                <div className="relative">
                  <img src={coach.photo} alt={coach.name} className={`w-full h-80 object-cover rounded-xl shadow-lg ${isPremium ? 'ring-4 ring-yellow-400' : ''}`} />
                  {isPremium && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                      <Trophy className="h-4 w-4" /> Premium
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    className={`w-full ${following ? 'bg-gray-600' : 'bg-blue-600'} text-white`}
                    onClick={() => following ? unfollowCoach(coach.id) : followCoach(coach.id)}
                  >
                    {following ? <><UserMinus className="mr-2 h-4 w-4"/> Takibi Bırak</> : <><UserPlus className="mr-2 h-4 w-4"/> Takip Et</>}
                  </Button>

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
                    className="w-full border-blue-900 text-blue-900 hover:bg-blue-50"
                    onClick={handleTrial}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Deneme Seansı (Ücretsiz)
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsFavorite(!isFavorite)}>
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* SAĞ KOLON: Bilgiler */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-4xl font-bold text-blue-900 mb-2">{coach.name}</h1>
                      <CoachBadges isPremium={isPremium} isVerified={isVerified} size="lg" />
                    </div>
                    <Badge className="bg-yellow-400 text-blue-900 text-lg px-4 py-1">ICF {coach.icfLevel}</Badge>
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{coach.title}</p>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="h-6 w-6 mx-auto mb-2 text-blue-900" />
                    <p className="text-2xl font-bold text-blue-900">{coach.experience}</p>
                    <p className="text-sm text-gray-600">Yıl Deneyim</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Award className="h-6 w-6 mx-auto mb-2 text-blue-900" />
                    <p className="text-2xl font-bold text-blue-900">{coach.certificates?.length || 0}</p>
                    <p className="text-sm text-gray-600">Sertifika</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Globe className="h-6 w-6 mx-auto mb-2 text-blue-900" />
                    <p className="text-2xl font-bold text-blue-900">{coach.languages.length}</p>
                    <p className="text-sm text-gray-600">Dil</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5" /> Seans Ücretleri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">45 Dakika</p>
                      <p className="text-3xl font-bold text-blue-900">{coach.hourlyRate45}₺</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">60 Dakika</p>
                      <p className="text-3xl font-bold text-blue-900">{coach.hourlyRate60}₺</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
