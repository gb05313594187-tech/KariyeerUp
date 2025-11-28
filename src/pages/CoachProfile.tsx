import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, Award, Calendar, CheckCircle, MapPin, Heart, Share2, 
  Video, Globe, Briefcase, GraduationCap, Trophy, Users, TrendingUp,
  Clock, DollarSign, Languages, UserPlus, UserMinus
} from 'lucide-react';
import { getCoaches, getReviews } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFollow } from '@/contexts/FollowContext';
import { PremiumPromotionToast } from '@/components/PremiumPromotionToast';
import CoachBadges from '@/components/CoachBadges';

interface UserReview {
  id: string;
  bookingId: string;
  coachId: string;
  coachName: string;
  clientName: string;
  rating: number;
  review: string;
  createdAt: string;
  verified: boolean;
}

export default function CoachProfile() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { isFollowing, followCoach, unfollowCoach, getFollowCount } = useFollow();
  const [isFavorite, setIsFavorite] = useState(false);
  const [coachReviews, setCoachReviews] = useState<UserReview[]>([]);
  
  const coaches = getCoaches();
  const coach = coaches.find(c => c.id === id);
  const reviews = getReviews(id);

  useEffect(() => {
    // Load reviews from localStorage
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]') as UserReview[];
    const filteredReviews = allReviews.filter((r: UserReview) => r.coachId === id);
    setCoachReviews(filteredReviews);
  }, [id]);

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Koç bulunamadı</p>
      </div>
    );
  }

  const isPremium = coach.isPremium;
  const isVerified = coach.isVerified;
  const premiumBorderClass = isPremium ? 'border-2 border-yellow-400 shadow-2xl' : '';
  const premiumBgClass = isPremium ? 'bg-gradient-to-br from-yellow-50 to-white' : 'bg-white';
  const following = isFollowing(coach.id);
  const followerCount = getFollowCount(coach.id);

  const handleFollowToggle = () => {
    if (following) {
      unfollowCoach(coach.id);
    } else {
      followCoach(coach.id);
    }
  };

  // Combine mock reviews with user reviews
  const allReviews = [...reviews, ...coachReviews].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Premium Promotion Toast - Only shows for non-premium coaches */}
      <PremiumPromotionToast 
        coachId={coach.id} 
        coachName={coach.name}
        isPremium={isPremium}
      />

      <div className="max-w-7xl mx-auto">
        {/* Premium Badge Banner */}
        {isPremium && (
          <div className="mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg">
            <Trophy className="h-5 w-5" />
            <span className="font-bold">Premium Koç</span>
          </div>
        )}

        {/* Main Profile Card */}
        <Card className={`${premiumBorderClass} ${premiumBgClass} mb-6`}>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column - Photo and Quick Actions */}
              <div className="md:col-span-1">
                <div className="relative">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className={`w-full h-80 object-cover rounded-xl shadow-lg ${isPremium ? 'ring-4 ring-yellow-400' : ''}`}
                  />
                  {isPremium && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      Premium
                    </div>
                  )}
                </div>

                {/* Follow Stats */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-blue-900">{followerCount}</p>
                      <p className="text-sm text-gray-600">Takipçi</p>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-blue-900">{Math.floor(followerCount * 0.6)}</p>
                      <p className="text-sm text-gray-600">Takip</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-blue-900">{coach.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({allReviews.length} değerlendirme)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-900">{coach.totalSessions}+</span>
                    </div>
                    <span className="text-sm text-gray-600">Tamamlanan Seans</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">{coach.communityScore}/100</span>
                    </div>
                    <span className="text-sm text-gray-600">Topluluk Puanı</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Button 
                    className={`w-full ${following ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    onClick={handleFollowToggle}
                  >
                    {following ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        Takibi Bırak
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Takip Et
                      </>
                    )}
                  </Button>

                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    onClick={() => window.location.href = `/booking/${coach.id}`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Hemen Rezervasyon Yap
                  </Button>

                  {coach.hasTrialSession && (
                    <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                      <Clock className="mr-2 h-4 w-4" />
                      Deneme Seansı ({coach.trialPrice}₺)
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Main Info */}
              <div className="md:col-span-2">
                {/* Name and Title */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-4xl font-bold text-blue-900 mb-2">{coach.name}</h1>
                      <CoachBadges isPremium={isPremium} isVerified={isVerified} size="lg" />
                    </div>
                    <Badge className="bg-yellow-400 text-blue-900 text-lg px-4 py-1">
                      ICF {coach.icfLevel}
                    </Badge>
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{coach.title}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.badges?.map((badge, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        <Trophy className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Languages className="h-5 w-5" />
                    <span>{coach.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Uzmanlık Alanları</h3>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-900 hover:bg-blue-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience Summary */}
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

                {/* Pricing */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Seans Ücretleri
                  </h3>
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

        {/* Tabbed Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="about">Hakkımda</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="certificates">Sertifikalar</TabsTrigger>
            <TabsTrigger value="packages">Paketler</TabsTrigger>
            <TabsTrigger value="reviews">Yorumlar ({allReviews.length})</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Hakkımda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {language === 'tr' ? coach.aboutMe : coach.aboutMeEn || coach.aboutMe}
                  </p>
                </div>

                {/* Sector Experience */}
                {coach.sectorExperience && coach.sectorExperience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Sektör Deneyimi
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {coach.sectorExperience.map((sector, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {coach.education && coach.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Eğitim ve Sertifikalar
                    </h3>
                    <ul className="space-y-2">
                      {coach.education.map((edu, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tab */}
          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                  <Video className="h-6 w-6" />
                  Tanıtım Videosu
                </CardTitle>
                <CardDescription>
                  {coach.name} ile tanışın ve koçluk yaklaşımını öğrenin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coach.videoUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      src={coach.videoUrl}
                      title="Coach Introduction Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Video yakında eklenecek</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Sertifikalar ve Belgeler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {coach.certificates?.map((cert, idx) => (
                    <div key={idx} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Award className="h-8 w-8 text-blue-900" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-blue-900 mb-1">{cert.name}</h4>
                          <p className="text-gray-600 mb-2">{cert.issuer}</p>
                          <Badge variant="outline">{cert.year}</Badge>
                        </div>
                      </div>
                      {cert.imageUrl && (
                        <img 
                          src={cert.imageUrl} 
                          alt={cert.name}
                          className="mt-4 w-full h-32 object-contain bg-gray-50 rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Seans Paketleri</CardTitle>
                <CardDescription>
                  Size uygun paketi seçin ve tasarruf edin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {coach.packages?.map((pkg) => (
                    <Card key={pkg.id} className="border-2 hover:border-blue-900 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl text-blue-900">
                          {language === 'tr' ? pkg.name : pkg.nameEn}
                        </CardTitle>
                        <CardDescription>
                          {language === 'tr' ? pkg.description : pkg.descriptionEn}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-blue-900">{pkg.price}₺</p>
                          <p className="text-sm text-gray-600">{pkg.sessions} seans</p>
                          <p className="text-sm text-green-600 font-semibold mt-1">
                            Seans başı {Math.round(pkg.price / pkg.sessions)}₺
                          </p>
                        </div>
                        <Button className="w-full bg-blue-900 hover:bg-blue-800">
                          Bu Paketi Seç
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Değerlendirmeler</CardTitle>
                <CardDescription>
                  {allReviews.length} danışandan ortalama {coach.rating} puan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600">Henüz değerlendirme yapılmamış</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {allReviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                              <span className="font-bold text-blue-900">
                                {(review.clientName || review.name || 'A').charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.clientName || review.name}</p>
                              <p className="text-sm text-gray-500">
                                {review.createdAt 
                                  ? new Date(review.createdAt).toLocaleDateString('tr-TR')
                                  : review.date
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment || review.review}</p>
                        {(review.verified || review.createdAt) && (
                          <Badge variant="outline" className="mt-2">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                            Doğrulanmış Seans
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link to="/coaches">
            <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
              ← Tüm Koçlara Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}