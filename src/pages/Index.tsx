// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, TrendingUp, Users, Shield, Zap, ArrowRight, 
  CheckCircle2, Globe, Award, PlayCircle, Target, Rocket
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // --- VİTRİN KOÇLARI (STATİK VE GARANTİ VERİ) ---
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
    <div className="bg-white font-sans selection:bg-red-100">
      
      {/* 1. HERO BÖLÜMÜ: KARŞILAMA */}
      <div className="relative bg-gradient-to-b from-[#FFF5F2] to-white py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-100 shadow-sm text-red-600 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Yeni Nesil Kariyer Platformu
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                Potansiyelini <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Zirveye Taşı</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Global standartlarda koçlar, mentorlar ve sana özel gelişim programlarıyla kariyer hedeflerine ulaşmak artık hayal değil.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 rounded-full shadow-lg shadow-red-200 transition-all hover:scale-105 font-bold" 
                    onClick={() => navigate('/coaches')}
                >
                    Koçunu Bul <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white text-gray-700 border-2 border-gray-200 hover:border-red-200 hover:text-red-600 text-lg h-14 px-8 rounded-full transition-all font-medium" 
                    onClick={() => navigate('/register')}
                >
                    <PlayCircle className="mr-2 h-5 w-5"/> Nasıl Çalışır?
                </Button>
            </div>

            {/* GÜVEN LOGOLARI */}
            <div className="mt-16 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-6">Bu Şirketlerin Çalışanları Tarafından Tercih Ediliyor</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-40 grayscale font-bold text-xl text-gray-600 items-center">
                   <span className="hover:opacity-100 transition-opacity">GOOGLE</span>
                   <span className="hover:opacity-100 transition-opacity">AMAZON</span>
                   <span className="hover:opacity-100 transition-opacity">SPOTIFY</span>
                   <span className="hover:opacity-100 transition-opacity">MICROSOFT</span>
                   <span className="hover:opacity-100 transition-opacity">NETFLIX</span>
                </div>
            </div>
        </div>
      </div>

      {/* 2. İSTATİSTİKLER: GÜVEN VEREN RAKAMLAR */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-700/50">
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">15k+</div>
                        <div className="text-sm md:text-base text-gray-400 font-medium">Mutlu Danışan</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">500+</div>
                        <div className="text-sm md:text-base text-gray-400 font-medium">Onaylı Koç</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">50k+</div>
                        <div className="text-sm md:text-base text-gray-400 font-medium">Gerçekleşen Seans</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.9</div>
                        <div className="text-sm md:text-base text-gray-400 font-medium">Kullanıcı Puanı</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. DEĞER ÖNERMESİ: NEDEN BİZ? */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-4">NEDEN KARİYEER?</Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Kariyerin İçin En İyisi</h2>
                <p className="text-xl text-gray-600">Sadece bir görüşme değil, uçtan uca bir dönüşüm süreci sunuyoruz.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Shield, title: "ICF Onaylı Koçlar", desc: "Sadece uluslararası sertifikasyona sahip, deneyimli ve titizlikle seçilmiş uzmanlar.", color: "text-red-600", bg: "bg-red-50" },
                    { icon: Zap, title: "Yapay Zeka Eşleşmesi", desc: "Akıllı algoritmamız, hedeflerinize ve kişiliğinize en uygun koçu saniyeler içinde bulur.", color: "text-orange-600", bg: "bg-orange-50" },
                    { icon: Globe, title: "Global Erişim", desc: "Dünyanın neresinde olursanız olun, size uygun saat diliminde online seans yapın.", color: "text-blue-600", bg: "bg-blue-50" }
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <CardContent className="pt-10 text-center p-8">
                            <div className={`w-20 h-20 ${item.bg} rounded-3xl flex items-center justify-center mx-auto mb-8 ${item.color} shadow-inner`}>
                                <item.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* 4. ÖNE ÇIKAN KOÇLAR */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-3">UZMAN KADRO</Badge>
                    <h2 className="text-4xl font-bold text-gray-900">Haftanın Öne Çıkanları</h2>
                </div>
                <Button variant="ghost" onClick={() => navigate('/coaches')} className="text-red-600 hover:text-red-700 hover:bg-red-50 text-lg font-medium hidden md:flex group">
                    Tümünü Gör <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {featuredCoaches.map((coach, i) => (
                    <div key={i} className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-red-100" onClick={() => navigate('/coaches')}>
                        <div className="flex items-center gap-5 mb-6">
                            <img src={coach.image} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform" />
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">{coach.name}</h3>
                                <p className="text-sm text-red-600 font-medium mb-1">{coach.title}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                                    <span className="text-gray-900">{coach.rating}</span>
                                    <span>({coach.reviews})</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {coach.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                <CheckCircle2 className="w-3 h-3"/> Müsait
                            </span>
                            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 rounded-lg px-4">İncele</Button>
                        </div>
                    </div>
                ))}
            </div>
            
            <Button variant="outline" onClick={() => navigate('/coaches')} className="w-full mt-8 md:hidden h-12 text-lg border-2">Tümünü Gör</Button>
        </div>
      </section>

      {/* 5. NASIL ÇALIŞIR (Adımlar) */}
      <section className="py-24 px-4 bg-white border-t">
        <div className="max-w-7xl mx-auto text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-16">Başarıya Giden 3 Adım</h2>
             <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Bağlantı Çizgisi */}
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-red-100 via-orange-100 to-red-100 -z-10"></div>

                <div className="relative group">
                    <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Koçunu Seç</h3>
                    <p className="text-gray-500 leading-relaxed px-4">Uzmanlık alanlarına ve yorumlara göre sana en uygun mentoru bul.</p>
                </div>
                <div className="relative group">
                    <div className="w-24 h-24 bg-white border-4 border-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Randevunu Al</h3>
                    <p className="text-gray-500 leading-relaxed px-4">Takvimden sana uygun saati seç ve güvenli ödeme ile yerini ayırt.</p>
                </div>
                <div className="relative group">
                    <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Gelişime Başla</h3>
                    <p className="text-gray-500 leading-relaxed px-4">Video görüşme ile seansını gerçekleştir ve kariyer basamaklarını tırman.</p>
                </div>
             </div>
        </div>
      </section>

      {/* 6. SON ÇAĞRI (CTA) */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-red-600 to-orange-600 rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Harekete Geçmeye Hazır Mısın?</h2>
                <p className="text-xl md:text-2xl text-red-50 mb-12 max-w-2xl mx-auto">
                    Yarınki sen, bugün attığın adıma teşekkür edecek. İlk adımı şimdi at ve kariyerini dönüştür.
                </p>
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-50 text-xl h-16 px-12 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 font-bold" onClick={() => navigate('/register')}>
                    Ücretsiz Başla
                </Button>
                <p className="mt-8 text-sm text-red-100 flex items-center justify-center gap-6 font-medium">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Kredi kartı gerekmez</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> 14 gün deneme</span>
                </p>
            </div>
        </div>
      </section>

    </div>
  );
}
