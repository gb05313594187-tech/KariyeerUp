import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Star, Filter, UserPlus, UserCheck } from 'lucide-react';
import { coaches, categories, getCoaches } from '@/data/mockData';
import type { Coach } from '@/data/mockData';
import { useFollow } from '@/contexts/FollowContext';
import CoachBadges from '@/components/CoachBadges';

export default function CoachList() {
  const [searchParams] = useSearchParams();
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>(coaches);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [minExperience, setMinExperience] = useState<number>(0);
  const { isFollowing, followCoach, unfollowCoach, getFollowCount } = useFollow();

  useEffect(() => {
    let filtered = getCoaches();

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(coach => coach.categories?.includes(selectedCategory));
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(coach => coach.icfLevel === selectedLevel);
    }

    // Price filter
    filtered = filtered.filter(coach => 
      coach.hourlyRate45 && coach.hourlyRate45 >= priceRange[0] && coach.hourlyRate45 <= priceRange[1]
    );

    // Experience filter
    filtered = filtered.filter(coach => coach.experience >= minExperience);

    setFilteredCoaches(filtered);
  }, [selectedCategory, selectedLevel, priceRange, minExperience]);

  const handleFollowToggle = (e: React.MouseEvent, coachId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFollowing(coachId)) {
      unfollowCoach(coachId);
    } else {
      followCoach(coachId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Koçlarımız</h1>
          <p className="text-gray-600">ICF sertifikalı profesyonel koçlarımızı keşfedin</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Filter className="mr-2 h-5 w-5" />
                  Filtreler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Hizmet Alanı</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ICF Level Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">ICF Sertifika Seviyesi</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="ACC">ACC</SelectItem>
                      <SelectItem value="PCC">PCC</SelectItem>
                      <SelectItem value="MCC">MCC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Fiyat Aralığı (45 dk): {priceRange[0]} ₺ - {priceRange[1]} ₺
                  </label>
                  <Slider
                    min={0}
                    max={2000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Minimum Deneyim: {minExperience} yıl
                  </label>
                  <Slider
                    min={0}
                    max={15}
                    step={1}
                    value={[minExperience]}
                    onValueChange={(val) => setMinExperience(val[0])}
                    className="mt-2"
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setPriceRange([0, 2000]);
                    setMinExperience(0);
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Coaches Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-gray-600">
              {filteredCoaches.length} koç bulundu
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredCoaches.map((coach) => {
                const following = isFollowing(coach.id);
                const followerCount = getFollowCount(coach.id);
                
                return (
                  <Link key={coach.id} to={`/coach/${coach.id}`}>
                    <Card className="hover:shadow-xl transition-all cursor-pointer h-full">
                      <CardHeader>
                        <div className="relative">
                          <img
                            src={coach.photo}
                            alt={coach.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <Badge className="bg-yellow-400 text-blue-900">
                              ICF {coach.icfLevel}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant={following ? "secondary" : "default"}
                            className={`absolute top-2 left-2 ${following ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                            onClick={(e) => handleFollowToggle(e, coach.id)}
                          >
                            {following ? (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                Takip Ediliyor
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 mr-1" />
                                Takip Et
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-xl text-blue-900">{coach.name}</CardTitle>
                            <CardDescription className="text-gray-600">{coach.title}</CardDescription>
                          </div>
                          <CoachBadges isPremium={coach.isPremium} isVerified={coach.isVerified} size="sm" />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                          <span className="font-semibold">{followerCount} takipçi</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-3">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 font-semibold text-blue-900">{coach.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({coach.reviewCount})</span>
                          <span className="ml-auto text-sm text-gray-600">{coach.experience} yıl deneyim</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {coach.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{coach.bio}</p>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <div className="text-xs text-gray-500">45 dk</div>
                            <div className="font-bold text-blue-900">{coach.hourlyRate45} ₺</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">60 dk</div>
                            <div className="font-bold text-blue-900">{coach.hourlyRate60} ₺</div>
                          </div>
                          <Button className="bg-blue-900 hover:bg-blue-800">
                            Profil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {filteredCoaches.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Seçtiğiniz kriterlere uygun koç bulunamadı.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setPriceRange([0, 2000]);
                    setMinExperience(0);
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}