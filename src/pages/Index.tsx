// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Users, TrendingUp, Target, 
  CheckCircle2, ArrowRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Footer eklendi

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30 mb-6 px-4 py-1 text-sm backdrop-blur-sm border-none">
            🚀 Kariyerinizde Yeni Bir Dönem
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Potansiyelinizi <br/>Keşfedin
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-10 max-w-2xl mx-auto">
            Türkiye'nin en iyi koçlarıyla tanışın, hedeflerinize daha hızlı ulaşın.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-red-50 h-14 px-8 text-lg font-bold shadow-xl"
                onClick={() => navigate('/coaches')}
            >
              <Search className="mr-2 h-5 w-5"/> Koç Bul
            </Button>
            <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-bold"
                onClick={() => navigate('/mentor-circle')}
            >
              <Users className="mr-2 h-5 w-5"/> Topluluğa Katıl
            </Button>
          </div>

          {/* İstatistikler */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/20 pt-8">
            <div><div className="text-3xl font-bold">500+</div><div className="text-red-100 text-sm">Onaylı Koç</div></div>
            <div><div className="text-3xl font-bold">10k+</div><div className="text-red-100 text-sm">Mutlu Danışan</div></div>
            <div><div className="text-3xl font-bold">50k+</div><div className="text-red-100 text-sm">Seans</div></div>
            <div><div className="text-3xl font-bold">4.9/5</div><div className="text-red-100 text-sm">Memnuniyet</div></div>
          </div>
        </div>
      </div>

      {/* NEDEN BİZ? */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Kariyeer.com?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Kariyer yolculuğunuzdaki en güçlü destekçiniziz.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: CheckCircle2, title: "ICF Onaylı Koçlar", desc: "Uluslararası sertifikalı uzmanlar.", color: "text-green-600" },
                    { icon: Target, title: "Hedef Odaklı", desc: "Size özel hazırlanan gelişim planları.", color: "text-blue-600" },
                    { icon: TrendingUp, title: "Sürdürülebilir Başarı", desc: "Hayat boyu sürecek yetkinlikler.", color: "text-purple-600" }
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-lg hover:-translate-y-1 transition-transform">
                        <CardContent className="pt-8 text-center">
                            <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>

      {/* FOOTER BURADA */}
      <Footer />
    </div>
  );
}
