// @ts-nocheck
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Globe, Users, Award, Zap, Heart, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-32 px-4 text-center overflow-hidden">
        {/* Arka plan deseni */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm px-4 py-1">
            Hikayemiz & Vizyonumuz
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight drop-shadow-lg">
            Kariyer Yolculuğunuzun <br/> <span className="text-blue-900">Pusulası</span>
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto font-light leading-relaxed">
            Her bireyin ve kurumun potansiyelini en üst seviyeye çıkarmak için teknolojiyi ve insani dokunuşu birleştiriyoruz.
          </p>
        </div>
      </div>

      {/* --- HİKAYEMİZ & MİSYON (Split Section) --- */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-100 rounded-full -z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                    alt="Kariyeer Team" 
                    className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute bottom-8 left-8 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block">
                    <p className="text-gray-900 font-bold text-lg">"Tutkuyla başlayan bir fikir, global bir harekete dönüştü."</p>
                </div>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2">Biz Kimiz?</h2>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">Geleceği Şekillendiren Bir Teknoloji ve İnsan Odaklı Girişim</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Kariyeer.com, 2024 yılında "Herkesin bir mentora ihtiyacı vardır" fikriyle yola çıktı. Amacımız, geleneksel koçluk süreçlerini dijitalleştirerek, dünyanın neresinde olursa olsun herkesin en iyi uzmanlara erişebilmesini sağlamaktır.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mt-4">
                        Bugün, binlerce bireye ve yüzlerce kuruma hizmet veren, sektörün standartlarını belirleyen bir platform olmanın gururunu yaşıyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="border-l-4 border-red-600 pl-4">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Misyonumuz</h4>
                        <p className="text-gray-600">Bireylerin ve kurumların gerçek potansiyellerini keşfetmelerini sağlayan erişilebilir, güvenilir ve yenilikçi bir ekosistem yaratmak.</p>
                    </div>
                    <div className="border-l-4 border-blue-900 pl-4">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Vizyonumuz</h4>
                        <p className="text-gray-600">Global ölçekte kariyer gelişimi ve koçluk denince akla gelen ilk teknoloji şirketi olmak.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- DEĞERLERİMİZ (Grid) --- */}
      <div className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900">Bizi Biz Yapan Değerler</h2>
                <p className="text-gray-500 mt-4">Her kararımızda ve aksiyonumuzda bu prensiplerle hareket ediyoruz.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Globe, title: "Global Standartlar", desc: "Yerel değil, evrensel kalite standartlarında hizmet sunarız.", color: "text-blue-600", bg: "bg-blue-100" },
                    { icon: Users, title: "İnsan Odaklılık", desc: "Teknolojimiz ne kadar gelişirse gelişsin, odağımızda hep insan vardır.", color: "text-red-600", bg: "bg-red-100" },
                    { icon: Zap, title: "İnovasyon", desc: "Sürekli gelişim ve yenilik, DNA'mızın bir parçasıdır.", color: "text-orange-600", bg: "bg-orange-100" },
                    { icon: Award, title: "Mükemmeliyet", desc: "Sıradanlığı kabul etmeyiz, her zaman en iyisini hedefleriz.", color: "text-purple-600", bg: "bg-purple-100" },
                    { icon: Heart, title: "Şeffaflık", desc: "Dürüstlük ve açıklık, tüm ilişkilerimizin temelidir.", color: "text-pink-600", bg: "bg-pink-100" },
                    { icon: Target, title: "Sonuç Odaklılık", desc: "Sadece sürece değil, yarattığımız somut etkiye odaklanırız.", color: "text-green-600", bg: "bg-green-100" }
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-lg hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="pt-8 text-center">
                            <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>

      {/* --- RAKAMLARLA BİZ (Trust Section) --- */}
      <div className="bg-blue-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Rakamlarla Etkimiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <div className="text-5xl font-extrabold text-orange-500 mb-2">500+</div>
                    <div className="text-blue-200 text-lg">Onaylı Koç</div>
                </div>
                <div>
                    <div className="text-5xl font-extrabold text-orange-500 mb-2">10k+</div>
                    <div className="text-blue-200 text-lg">Mutlu Danışan</div>
                </div>
                <div>
                    <div className="text-5xl font-extrabold text-orange-500 mb-2">50k+</div>
                    <div className="text-blue-200 text-lg">Tamamlanan Seans</div>
                </div>
                <div>
                    <div className="text-5xl font-extrabold text-orange-500 mb-2">98%</div>
                    <div className="text-blue-200 text-lg">Memnuniyet Oranı</div>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
