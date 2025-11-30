// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, PlayCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Webinars() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // --- ÖRNEK WEBINAR VERİLERİ (Mock Data) ---
  const upcomingWebinars = [
    {
      id: 1,
      title: "Kariyer Geçişinde Stratejik Planlama",
      speaker: "Dr. Ayşe Yılmaz",
      date: "15 Aralık 2024",
      time: "20:00",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300&h=200",
      tags: ["Kariyer", "Planlama"]
    },
    {
      id: 2,
      title: "Liderlik ve Etkili İletişim",
      speaker: "Mehmet Demir",
      date: "18 Aralık 2024",
      time: "19:00",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300&h=200",
      tags: ["Liderlik", "Soft Skills"]
    }
  ];

  const pastWebinars = [
    {
      id: 3,
      title: "CV Hazırlama Teknikleri",
      speaker: "Zeynep Kaya",
      date: "10 Kasım 2024",
      views: "1.2k İzlenme",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=300&h=200",
      tags: ["İş Arama"]
    }
  ];

  const handleRegister = (title) => {
      toast.success(`${title} için kaydınız alındı!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* BAŞLIK */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-100 text-red-600 hover:bg-red-200">Canlı Etkinlikler</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kariyer Sohbetleri & Webinarlar</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sektör liderlerinden ilham alın, yeni beceriler öğrenin ve kariyerinize yön verin.
          </p>
        </div>

        {/* SEKMELER */}
        <div className="flex justify-center gap-4 mb-8">
            <Button 
                variant={activeTab === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setActiveTab('upcoming')}
                className={activeTab === 'upcoming' ? 'bg-blue-900' : ''}
            >
                Gelecek Etkinlikler
            </Button>
            <Button 
                variant={activeTab === 'past' ? 'default' : 'outline'}
                onClick={() => setActiveTab('past')}
                className={activeTab === 'past' ? 'bg-blue-900' : ''}
            >
                Geçmiş Kayıtlar
            </Button>
        </div>

        {/* İÇERİK LİSTESİ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'upcoming' ? (
                upcomingWebinars.map((webinar) => (
                    <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <img src={webinar.image} alt={webinar.title} className="w-full h-48 object-cover"/>
                        <CardHeader>
                            <div className="flex gap-2 mb-2">
                                {webinar.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                            <CardTitle className="text-xl">{webinar.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                                <User className="w-4 h-4"/> {webinar.speaker}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {webinar.date}</div>
                                <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {webinar.time}</div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-blue-900 hover:bg-blue-800" onClick={() => handleRegister(webinar.title)}>
                                <Video className="w-4 h-4 mr-2"/> Kayıt Ol
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                pastWebinars.map((webinar) => (
                    <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-90">
                        <div className="relative">
                            <img src={webinar.image} alt={webinar.title} className="w-full h-48 object-cover grayscale"/>
                            <div
