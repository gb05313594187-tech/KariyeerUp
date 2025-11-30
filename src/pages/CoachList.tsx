// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, MapPin, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCoaches } from '@/data/mockData';

export default function CoachList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const data = getCoaches();
        setCoaches(data);
    } catch (e) { console.log(e); }
    setLoading(false);
  }, []);

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* ARAMA */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Koçları Keşfedin</h1>
          <div className="max-w-xl mx-auto flex gap-2">
            <Input 
                placeholder="İsim ara..." 
                className="bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button>Ara</Button>
          </div>
        </div>

        {/* LİSTE */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <Card key={coach.id} className="overflow-hidden border shadow-sm hover:shadow-md">
              <div className="h-48 bg-gray-200 relative">
                <img src={coach.photo} alt={coach.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-white text-black">{coach.isPremium ? 'Premium' : 'Uzman'}</Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{coach.name}</h3>
                    <div className="flex items-center text-yellow-500 font-bold text-sm">
                        <Star className="w-4 h-4 fill-current mr-1"/> {coach.rating}
                    </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{coach.title}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="font-bold text-blue-900">{coach.hourlyRate45} ₺ / seans</span>
                    <Link to={`/coach/${coach.id}`}>
                        <Button size="sm">İncele <ArrowRight className="ml-1 w-3 h-3"/></Button>
                    </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
