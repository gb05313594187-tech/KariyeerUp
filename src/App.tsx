// @ts-nocheck
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Globe, Users, Award, Zap, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm px-4 py-1">
            Hikayemiz & Vizyonumuz
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight drop-shadow-lg">
            Kariyer Yolculuğunuzun <br/> <span className="text-yellow-300">Pusulası</span>
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto font-light leading-relaxed">
            Her bireyin ve kurumun potansiyelini en üst seviyeye çıkarmak için teknolojiyi ve insani dokunuşu birleştiriyoruz.
          </p>
        </div>
      </div>

      {/* --- HİKAYEMİZ & MİSYON --- */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                    alt="Kariyeer Team" 
                    className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute bottom-8 left-8 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block border-l-4 border-red-600">
                    <p className="text-gray-900 font-bold text-lg">"Tutkuyla başlayan bir fikir, global bir harekete dönüştü."</p>
                </div>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2">Biz Kimiz?</h2>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">Geleceği Şekillendiren Bir Teknoloji ve İnsan Odaklı Girişim</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Kariyeer.com, "Herkesin bir mentora ihtiyacı vardır" fikriyle yola çıktı. Amacımız, geleneksel koçluk süreçlerini dijitalleştirerek, dünyanın neresinde olursa olsun herkesin en iyi uzmanlara erişebilmesini sağlamaktır.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-600">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Misyonumuz</h4>
                        <p className="text-gray-600 text-sm">Potansiyelleri keşfetmeyi sağlayan erişilebilir ve güvenilir bir ekosistem yaratmak.</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-900">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Vizyonumuz</h4>
                        <p className="text-gray-600 text-sm">Global ölçekte kariyer gelişimi denince akla gelen ilk teknoloji şirketi olmak.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- DEĞERLERİMİZ --- */}
      <div className="bg-gray-900 py-24 px-4 text-white">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold">Bizi Biz Yapan Değerler</h2>
                <p className="text-gray-400 mt-4">Her kararımızda bu prensiplerle hareket ediyoruz.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Globe, title: "Global Standartlar", desc: "Yerel değil, evrensel kalite standartlarında hizmet sunarız.", color: "text-blue-400" },
                    { icon: Users, title: "İnsan Odaklılık", desc: "Teknolojimiz ne kadar gelişirse gelişsin, odağımızda hep insan vardır.", color: "text-red-400" },
                    { icon: Zap, title: "İnovasyon", desc: "Sürekli gelişim ve yenilik, DNA'mızın bir parçasıdır.", color: "text-yellow-400" },
                    { icon: Award, title: "Mükemmeliyet", desc: "Sıradanlığı kabul etmeyiz, her zaman en iyisini hedefleriz.", color: "text-purple-400" },
                    { icon: Heart, title: "Şeffaflık", desc: "Dürüstlük ve açıklık, tüm ilişkilerimizin temelidir.", color: "text-pink-400" },
                    { icon: Target, title: "Sonuç Odaklılık", desc: "Sadece sürece değil, yarattığımız somut etkiye odaklanırız.", color: "text-green-400" }
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <item.icon className={`w-10 h-10 ${item.color} mb-4`} />
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
