// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, TrendingUp, Users, Shield, Zap, ArrowRight, 
  CheckCircle2, Globe, Award, PlayCircle 
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // --- VİTRİN KOÇLARI (STATİK VE GARANTİ VERİ) ---
  // Dışarıdan dosya çağırmıyoruz, bu yüzden hata vermez.
  const featuredCoaches = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Liderlik Koçu",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.9",
      reviews: "120+",
      tags: ["Liderlik", "Kariyer"]
    },
    {
      name: "Mehmet Demir",
      title: "Teknoloji Yöneticisi",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "5.0",
      reviews: "85+",
      tags: ["Teknoloji", "Startup"]
    },
    {
      name: "Zeynep Kaya",
      title: "Girişimcilik Mentoru",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.8",
      reviews: "200+",
      tags: ["Girişim", "Pazarlama"]
    }
  ];

  return (
    <div className="bg-white font-sans">
      
      {/* 1. HERO BÖLÜMÜ: KARŞILAMA */}
      <div className="relative bg-[#FFF5F2] py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Yeni Nesil Kariyer Platformu
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                Potansiyelini <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Zirveye Taşı</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Global standartlarda koçlar, mentorlar ve sana özel gelişim programlarıyla kariyer hedeflerine ulaşmak artık hayal değil.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-105" 
                    onClick={() => navigate('/coaches')}
                >
                    Koçunu Bul <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 text-lg h-14 px-8 rounded-xl transition-all" 
                    onClick={() => navigate('/register')}
                >
                    <PlayCircle className="mr-2 h-5 w-5 text-gray-500"/> Nasıl Çalışır?
                </Button>
            </div>

            {/* Güven Logoları (Metin Bazlı - Hata Riski Yok) */}
            <p className="mt-12 text-sm text-gray-400 font-medium uppercase tracking-wider">500+ Şirket Çalışanı Tarafından Tercih Ediliyor</p>
            <div className="mt-6 flex flex-wrap justify-center gap-8 opacity-40 grayscale font-bold text-xl text-gray-600">
               <span>GOOGLE</span>
               <span>AMAZON</span>
               <span>SPOTIFY</span>
               <span>MICROSOFT</span>
               <span>NETFLIX</span>
            </div>
        </div>
      </div>

      {/* 2. İSTATİSTİKLER: GÜVEN */}
      <section className="py-12 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                <div className="p-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">15k+</div>
                    <div className="text-sm text-gray-500 font-medium">Mutlu Danışan</div>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">500+</div>
                    <div className="text-sm text-gray-500 font-medium">Onaylı Koç</div>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">50k+</div>
                    <div className="text-sm text-gray-500 font-medium">Gerçekleşen Seans</div>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">4.9</div>
                    <div className="text-sm text-gray-500 font-medium">Kullanıcı Puanı</div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. DEĞER ÖNERMESİ: NEDEN BİZ? */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kariyerin İçin En İyisi</h2>
                <p className="text-lg text-gray-600">Sadece bir görüşme değil, uçtan uca bir dönüşüm süreci sunuyoruz.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Shield, title: "ICF Onaylı Koçlar", desc: "Sadece uluslararası sertifikasyona sahip, deneyimli ve titizlikle seçilmiş uzmanlar.", color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: Zap, title: "Hızlı Eşleşme", desc: "Akıllı algoritmamız, hedeflerinize ve kişiliğinize en uygun koçu saniyeler içinde bulur.", color: "text-purple-600", bg: "bg-purple-50" },
                    { icon: Globe, title: "Global Erişim", desc: "Dünyanın neresinde olursanız olun, size uygun saat diliminde online seans yapın.", color: "text-green-600", bg: "bg-green-50" }
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-lg hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="pt-8 text-center p-8">
                            <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${item.color}`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* 4. ÖNE ÇIKAN KOÇLAR */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 mb-2">Uzman Kadro</Badge>
                    <h2 className="text-3xl font-bold text-gray-900">Haftanın Öne Çıkanları</h2>
                </div>
                <Button variant="outline" onClick={() => navigate('/coaches')} className="hidden md:flex">Tümünü Gör</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {featuredCoaches.map((coach, i) => (
                    <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate('/coaches')}>
                        <div className="flex items-start gap-4 mb-4">
                            <img src={coach.image} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform" />
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{coach.name}</h3>
                                <p className="text-sm text-blue-600 font-medium">{coach.title}</p>
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                                    <span className="font-bold text-gray-900">{coach.rating}</span>
                                    <span>({coach.reviews} değerlendirme)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {coach.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600">{tag}</Badge>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t flex justify-between items-center">
                            <span className="text-sm text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Müsait</span>
                            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 rounded-lg">Profili İncele</Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" onClick={() => navigate('/coaches')} className="w-full mt-8 md:hidden">Tümünü Gör</Button>
        </div>
      </section>

      {/* 5. TOPLULUK (MENTOR CIRCLE) */}
      <section className="py-24 px-4 bg-[#1e1b4b] text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full bg-blue-900 opacity-20"></div>
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
                <Badge className="mb-4 bg-indigo-500 text-white border-0 hover:bg-indigo-600">MentorCircle</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Yalnız Değilsin.<br/>Birlikte Büyüyoruz.</h2>
                <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
                    Kariyer yolculuğu zorlu olabilir. Binlerce profesyonelin olduğu topluluğumuza katıl, deneyimlerini paylaş ve networkünü genişlet.
                </p>
                <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold h-14 px-8 rounded-xl" onClick={() => navigate('/mentor-circle')}>
                    Topluluğa Katıl <Users className="ml-2 w-5 h-5"/>
                </Button>
            </div>
            <div className="flex-1 w-full max-w-md">
                <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none animate-in slide-in-from-right-10 duration-700 border border-white/10">
                        <p className="text-sm font-medium">👋 Merhaba, ürün yönetimi alanına geçmek istiyorum. Tavsiyeniz var mı?</p>
                    </div>
                    <div className="bg-indigo-500/80 backdrop-blur-md p-4 rounded-2xl rounded-tr-none ml-auto animate-in slide-in-from-left-10 duration-1000 delay-300 border border-indigo-400/50 shadow-lg">
                        <p className="text-sm font-medium text-white">Elbette! Geçen hafta yaptığımız "Kariyer Geçişi" webinarını izlemeni öneririm. 💡</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none animate-in slide-in-from-right-10 duration-1000 delay-700 border border-white/10">
                        <p className="text-sm font-medium">Teşekkürler! Hemen izliyorum. 🚀</p>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* 6. CTA (SON ÇAĞRI) */}
      <section className="py-24 px-4 text-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Harekete Geçmeye Hazır Mısın?</h2>
            <p className="text-xl text-gray-600 mb-10">
                Yarınki sen, bugün attığın adıma teşekkür edecek. İlk adımı şimdi at ve kariyerini dönüştür.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-xl h-16 px-12 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" onClick={() => navigate('/register')}>
                Ücretsiz Başla
            </Button>
            <p className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500"/> Kredi kartı gerekmez 
                <span className="mx-2">•</span> 
                <CheckCircle2 className="w-4 h-4 text-green-500"/> 14 gün deneme
            </p>
        </div>
      </section>

    </div>
  );
}
