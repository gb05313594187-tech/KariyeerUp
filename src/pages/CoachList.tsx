// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, MapPin, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCoaches } from '@/data/mockData';

export default function CoachList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SADECE MOCK DATA KULLAN (HATA VERMEMESİ İÇİN)
    try {
        const data = getCoaches();
        setCoaches(data);
    } catch (e) {
        console.log(e);
    }
    setLoading(false);
  }, []);

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* BAŞLIK VE ARAMA */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hayalinizdeki Koçu Bulun</h1>
          <p className="text-xl text-gray-600 mb-8">Kariyer hedeflerinize ulaşmak için uzman desteği alın.</p>
          
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="İsim veya uzmanlık ara..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-12 bg-blue-900 hover:bg-blue-800">
                <Filter className="mr-2 h-4 w-4"/> Filtrele
            </Button>
          </div>
        </div>

        {/* KOÇ LİSTESİ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <Card key={coach.id} className="hover:shadow-lg transition-shadow overflow-hidden border-t-4 border-t-blue-500">
              <div className="relative h-48">
                <img src={coach.photo} alt={coach.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-4 right-4 bg-white/90 text-blue-900 font-bold hover:bg-white">
                    {coach.isPremium ? 'Premium' : 'Onaylı'}
                </Badge>
              </div>
              
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900">{coach.name}</h3>
                        <p className="text-sm text-gray-600">{coach.title}</p>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1"/>
                        <span className="font-bold text-sm">{coach.rating}</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties?.slice(0, 2).map((s: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                </div>

                <div className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4"/> Online / Türkçe
                </div>
              </CardContent>

              <CardFooter className="border-t bg-gray-50 p-4">
                <div className="w-full flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-500 block">Seans Ücreti</span>
                        <span className="font-bold text-blue-900">{coach.hourlyRate45} ₺</span>
                    </div>
                    <Link to={`/coach/${coach.id}`}>
                        <Button className="bg-blue-900 hover:bg-blue-800">
                            Profili İncele <ArrowRight className="ml-2 w-4 h-4"/>
                        </Button>
                    </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
