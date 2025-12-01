// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, PlayCircle, ArrowRight, CheckCircle2, Users, Radio } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Webinars() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

  // --- WEBINAR VERİLERİ (SAYFA İÇİNDE) ---
  const upcomingWebinars = [
    {
      id: 1,
      title: "Kariyer Geçişinde Stratejik Planlama",
      speaker: "Dr. Ayşe Yılmaz",
      role: "Kariyer Koçu",
      date: "15 Aralık 2024",
      time: "20:00",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600&h=400",
      tags: ["Kariyer", "Planlama"],
      attendees: 154
    },
    {
      id: 2,
      title: "Liderlik ve Etkili İletişim",
      speaker: "Mehmet Demir",
      role: "Yazılım Müdürü",
      date: "18 Aralık 2024",
      time: "19:00",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600&h=400",
      tags: ["Liderlik", "Soft Skills"],
      attendees: 89
    },
    {
      id: 3,
      title: "Global Şirketlerde Mülakat Teknikleri",
      speaker: "Sarah Jenkins",
      role: "İK Direktörü",
      date: "22 Aralık 2024",
      time: "21:00",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600&h=400",
      tags: ["Mülakat", "Global"],
      attendees: 230
    }
  ];

  const pastWebinars = [
    {
      id: 101,
      title: "CV Hazırlama Teknikleri",
      speaker: "Zeynep Kaya",
      date: "10 Kasım 2024",
      views: "1.2k İzlenme",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600&h=400",
      tags: ["İş Arama"]
    },
    {
      id: 102,
      title: "LinkedIn Profil Optimizasyonu",
      speaker: "Ali Vural",
      date: "5 Kasım 2024",
      views: "850 İzlenme",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600&h=400",
      tags: ["LinkedIn", "Personal Branding"]
    }
  ];

  const handleRegister = (id: number, title: string) => {
      if (registeredEvents.includes(id)) return;
      
      toast.success(`${title} için kaydınız alındı! Link e-posta adresinize gönderilecek.`);
      setRegisteredEvents([...registeredEvents, id]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      {/* HERO SECTION (Şirketler Sayfasıyla Aynı Stil) */}
      <div className="relative bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat text-white py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-orange-800/90 z-0"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm px-4 py-1">
            <Radio className="w-4 h-4 mr-2 animate-pulse text-red-400" /> Canlı Yayınlar
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Kariyer Sohbetleri & <br/> Webinarlar
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-10 font-light drop-shadow">
            Sektör liderlerinden ilham alın, yeni beceriler öğrenin ve kariyerinize yön verin. Tamamen ücretsiz.
          </p>
          
          {/* SEKME BUTONLARI */}
          <div className="flex justify-center gap-4">
            <Button 
                size="lg"
                onClick={() => setActiveTab('upcoming')}
                className={`${activeTab === 'upcoming' ? 'bg-white text-red-600' : 'bg-red-800/50 text-white border border-white/20'} font-bold h-14 px-8 text-lg hover:bg-white hover:text-red-600 transition-all`}
            >
                Gelecek Etkinlikler
            </Button>
            <Button 
                size="lg"
                onClick={() => setActiveTab('past')}
                className={`${activeTab === 'past' ? 'bg-white text-red-600' : 'bg-red-800/50 text-white border border-white/20'} font-bold h-14 px-8 text-lg hover:bg-white hover:text-red-600 transition-all`}
            >
                Geçmiş Kayıtlar
            </Button>
          </div>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        
        {/* GELECEK ETKİNLİKLER */}
        {activeTab === 'upcoming' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingWebinars.map((webinar) => (
                    <Card key={webinar.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-t-4 border-t-red-500 group">
                        <div className="relative h-48 overflow-hidden">
                            <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            <Badge className="absolute top-4 right-4 bg-white/90 text-red-600 font-bold shadow-sm">Canlı</Badge>
                        </div>
                        <CardHeader>
                            <div className="flex gap-2 mb-3">
                                {webinar.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">#{tag}</Badge>)}
                            </div>
                            <CardTitle className="text-xl line-clamp-2 h-14">{webinar.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <User className="w-4 h-4 text-red-500"/> 
                                <span className="font-medium">{webinar.speaker}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">{webinar.role}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500"/> {webinar.date}</div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-500"/> {webinar.time}</div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                <Users className="w-3 h-3"/> {webinar.attendees} kişi kayıt oldu
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className={`w-full h-11 font-bold ${registeredEvents.includes(webinar.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                onClick={() => handleRegister(webinar.id, webinar.title)}
                                disabled={registeredEvents.includes(webinar.id)}
                            >
                                {registeredEvents.includes(webinar.id) ? (
                                    <><CheckCircle2 className="w-4 h-4 mr-2"/> Kayıtlı</>
                                ) : (
                                    <><Video className="w-4 h-4 mr-2"/> Ücretsiz Kayıt Ol</>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        {/* GEÇMİŞ KAYITLAR */}
        {activeTab === 'past' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastWebinars.map((webinar) => (
                    <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-90 group">
                        <div className="relative h-48">
                            <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform"/>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{webinar.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <User className="w-4 h-4"/> {webinar.speaker}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                                <span>{webinar.date}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {webinar.views}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full group-hover:border-red-500 group-hover:text-red-600">
                                Kaydı İzle
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
