// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, Users, Award, CheckCircle2, ArrowRight, 
  Star, Shield, Zap, Globe, MessageCircle 
} from "lucide-react";

// NOT: Bu sayfada Navbar ve Footer'ı App.tsx'ten otomatik alıyor.
// Burası sadece orta içerik (Hero ve Footer arası).

export default function Index() {
  const navigate = useNavigate();

  // Örnek Koç Verisi (Vitrin İçin)
  const featuredCoaches = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Liderlik Koçu",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.9",
      reviews: "120+"
    },
    {
      name: "Mehmet Demir",
      title: "Teknoloji Yöneticisi",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "5.0",
      reviews: "85+"
    },
    {
      name: "Zeynep Kaya",
      title: "Girişimcilik Mentoru",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.8",
      reviews: "200+"
    }
  ];

  return (
    <div className="bg-white font-sans">
      
      {/* --- HERO BÖLÜMÜ (SENİN MEVCUT TASARIMIN BURADA OLACAK) --- */}
      {/* Burayı değiştirmedim, senin mevcut Hero kodun buranın üstünde kalacak */}
      <div className="relative bg-[#FFF5F2] py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Badge className="mb-6 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-1 text-sm">🚀 Kariyerini Şansa Bırakma</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                Potansiyelini <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Zirveye</span> Taşı
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                Dünya standartlarında koçlar, mentorlar ve sana özel gelişim programlarıyla hedeflerine sandığından daha yakınsın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg h-14 px-8 rounded-xl shadow-lg shadow-red-200" onClick={() => navigate('/coaches')}>
                    Koçunu Bul
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-xl border-2" onClick={() => navigate('/register')}>
                    Ücretsiz Dene
                </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-red-100 flex flex-wrap justify-center gap-8 opacity-60 grayscale">
               {/* Buraya şirket logoları gelebilir */}
               <span className="text-xl font-bold">Google</span>
               <span className="text-xl font-bold">Spotify</span>
               <span className="text-xl font-bold">Amazon</span>
               <span className="text-xl font-bold">Microsoft</span>
            </div>
        </div>
        
        {/* Dekoratif Arkaplan */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-red-200 rounded-full blur-3xl opacity-30"></div>
        </div>
      </div>
      {/* ---------------------------------------------------------- */}


      {/* 1. BÖLÜM: İSTATİSTİKLER (Güven Verir) */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">15k+</div>
                <div className="text-sm text-gray-500 font-medium">Aktif Danışan</div>
            </div>
            <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-sm text-gray-500 font-medium">Onaylı Koç</div>
            </div>
            <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">50k+</div>
                <div className="text-sm text-gray-500 font-medium">Gerçekleşen Seans</div>
            </div>
            <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">4.9</div>
                <div className="text-sm text-gray-500 font-medium">Müşteri Memnuniyeti</div>
            </div>
        </div>
      </section>


      {/* 2. BÖLÜM: NEDEN BİZ? (Value Proposition) */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kariyerin İçin En İyisi</h2>
                <p className="text-lg text-gray-600">Standartların ötesinde bir deneyim. Sadece bir görüşme değil, bir dönüşüm süreci.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="pt-8 text-center p-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">ICF Onaylı Koçlar</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Sadece uluslararası sertifikasyona sahip, deneyimli ve titizlikle seçilmiş koçlarla çalışıyoruz.
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="pt-8 text-center p-8">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <Brain className="w-8 h-8" /> {/* Brain ikonu yoksa Zap kullan */}
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Destekli Eşleşme</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Akıllı algoritmamız, hedeflerinize ve kişiliğinize en uygun koçu saniyeler içinde bulur.
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="pt-8 text-center p-8">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Globe className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Global Erişim</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Dünyanın neresinde olursanız olun, size uygun saat diliminde online seans yapın.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>


      {/* 3. BÖLÜM: ÖNE ÇIKAN KOÇLAR (Vitrin) */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Haftanın Öne Çıkanları</h2>
                    <p className="text-gray-600">Kullanıcılarımızdan en yüksek puanı alan uzmanlar.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/coaches')} className="hidden md:flex">Tümünü Gör</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {featuredCoaches.map((coach, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/coaches')}>
                        <div className="flex items-start gap-4">
                            <img src={coach.image} className="w-16 h-16 rounded-full object-cover" />
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
                        <div className="mt-6 pt-4 border-t flex justify-between items-center">
                            <span className="text-sm text-gray-500">Müsaitlik: Bugün</span>
                            <Button size="sm" className="bg-gray-900 hover:bg-gray-800">Profili İncele</Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" onClick={() => navigate('/coaches')} className="w-full mt-8 md:hidden">Tümünü Gör</Button>
        </div>
      </section>


      {/* 4. BÖLÜM: NASIL ÇALIŞIR? (Adımlar) */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Başarıya Giden 3 Adım</h2>
             <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Bağlantı Çizgisi (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                <div className="text-center">
                    <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-red-600 shadow-sm">1</div>
                    <h3 className="text-xl font-bold mb-3">Koçunu Seç</h3>
                    <p className="text-gray-500">Uzmanlık alanlarına ve yorumlara göre sana en uygun mentoru bul.</p>
                </div>
                <div className="text-center">
                    <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-red-600 shadow-sm">2</div>
                    <h3 className="text-xl font-bold mb-3">Randevunu Al</h3>
                    <p className="text-gray-500">Takvimden sana uygun saati seç ve güvenli ödeme ile yerini ayırt.</p>
                </div>
                <div className="text-center">
                    <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-red-600 shadow-sm">3</div>
                    <h3 className="text-xl font-bold mb-3">Gelişime Başla</h3>
                    <p className="text-gray-500">Video görüşme ile seansını gerçekleştir ve kariyer basamaklarını tırman.</p>
                </div>
             </div>
        </div>
      </section>


      {/* 5. BÖLÜM: TOPLULUK (MentorCircle) */}
      <section className="py-24 px-4 bg-[#1e1b4b] text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover opacity-10"></div>
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
                <Badge className="mb-4 bg-indigo-500 text-white border-0">MentorCircle</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Yalnız Değilsin.</h2>
                <p className="text-xl text-indigo-200 mb-8">
                    Kariyer yolculuğu zorlu olabilir. Binlerce profesyonelin olduğu topluluğumuza katıl, deneyimlerini paylaş ve networkünü genişlet.
                </p>
                <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold h-14 px-8" onClick={() => navigate('/mentor-circle')}>
                    Topluluğa Katıl <Users className="ml-2 w-5 h-5"/>
                </Button>
            </div>
            <div className="flex-1">
                {/* Chat Balonları Görseli (CSS ile) */}
                <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none max-w-md animate-in slide-in-from-right-10 duration-700">
                        <p className="text-sm">👋 Merhaba, ürün yönetimi alanına geçmek istiyorum. Tavsiyeniz var mı?</p>
                    </div>
                    <div className="bg-indigo-500/20 backdrop-blur-md p-4 rounded-2xl rounded-tr-none max-w-md ml-auto animate-in slide-in-from-left-10 duration-1000 delay-300">
                        <p className="text-sm">Elbette! Geçen hafta yaptığımız "Kariyer Geçişi" webinarını izlemeni öneririm.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none max-w-md animate-in slide-in-from-right-10 duration-1000 delay-700">
                        <p className="text-sm">Teşekkürler! Hemen izliyorum. 🚀</p>
                    </div>
                </div>
            </div>
         </div>
      </section>


      {/* 6. BÖLÜM: CTA (Son Çağrı) */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Harekete Geçmeye Hazır Mısın?</h2>
            <p className="text-xl text-gray-600 mb-10">
                Yarınki sen, bugün attığın adıma teşekkür edecek. İlk adımı şimdi at.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-xl h-16 px-12 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" onClick={() => navigate('/register')}>
                Ücretsiz Başla
            </Button>
            <p className="mt-4 text-sm text-gray-400">Kredi kartı gerekmez • 14 gün deneme</p>
        </div>
      </section>

    </div>
  );
}
