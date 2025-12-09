// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export default function Index() {
  // --- VİTRİN KOÇLARI (STATİK VE GARANTİ) ---
  const featuredCoaches = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Liderlik Koçu",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.9",
      reviews: "120+",
      tags: ["Liderlik", "Kariyer"],
    },
    {
      name: "Mehmet Demir",
      title: "Teknoloji Yöneticisi",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "5.0",
      reviews: "85+",
      tags: ["Teknoloji", "Startup"],
    },
    {
      name: "Zeynep Kaya",
      title: "Girişimcilik Mentoru",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.8",
      reviews: "200+",
      tags: ["Girişim", "Pazarlama"],
    },
  ];

  return (
    <div className="bg-white font-sans">
      {/* 1. HERO BÖLÜMÜ */}
      <div className="relative bg-[#FFF5F2] py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Yeni Nesil Kariyer Platformu
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Potansiyelini <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Zirveye Taşı
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Global standartlarda koçlar, mentorlar ve sana özel gelişim
            programlarıyla kariyer hedeflerine ulaşmak artık hayal değil.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/coaches">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-105"
              >
                Koçunu Bul <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            {/* 🔴 BURASI DÜZELTİLDİ: /register → /how-it-works */}
            <a href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 text-lg h-14 px-8 rounded-xl transition-all"
              >
                <PlayCircle className="mr-2 h-5 w-5 text-gray-500" /> Nasıl
                Çalışır?
              </Button>
            </a>
          </div>

          <p className="mt-12 text-sm text-gray-400 font-medium uppercase tracking-wider">
            500+ Şirket Çalışanı Tarafından Tercih Ediliyor
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-8 opacity-40 grayscale font-bold text-xl text-gray-600">
            <span>GOOGLE</span>
            <span>AMAZON</span>
            <span>SPOTIFY</span>
            <span>MICROSOFT</span>
            <span>NETFLIX</span>
          </div>
        </div>
      </div>

      {/* 2. İSTATİSTİKLER */}
      <section className="py-12 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-1">15k+</div>
              <div className="text-sm text-gray-500 font-medium">
                Mutlu Danışan
              </div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-500 font-medium">
                Onaylı Koç
              </div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-1">50k+</div>
              <div className="text-sm text-gray-500 font-medium">
                Gerçekleşen Seans
              </div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-1">4.9</div>
              <div className="text-sm text-gray-500 font-medium">
                Kullanıcı Puanı
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEDEN BİZ? */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kariyerin İçin En İyisi
            </h2>
            <p className="text-lg text-gray-600">
              Sadece bir görüşme değil, uçtan uca bir dönüşüm süreci sunuyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "ICF Onaylı Koçlar",
                desc: "Sadece uluslararası sertifikasyona sahip, deneyimli ve titizlikle seçilmiş uzmanlar.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Zap,
                title: "Hızlı Eşleşme",
                desc: "Akıllı algoritmamız, hedeflerinize ve kişiliğinize en uygun koçu saniyeler içinde bulur.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Globe,
                title: "Global Erişim",
                desc: "Dünyanın neresinde olursanız olun, size uygun saat diliminde online seans yapın.",
                color: "text-green-600",
                bg: "bg-green-50",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-none shadow-lg hover:-translate-y-2 transition-transform duration-300"
              >
                <CardContent className="pt-8 text-center p-8">
                  <div
                    className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${item.color}`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {item.title}
                  </h3>
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
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 mb-2">
                Uzman Kadro
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Haftanın Öne Çıkanları
              </h2>
            </div>
            <a href="/coaches" className="hidden md:flex">
              <Button variant="outline">Tümünü Gör</Button>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {coach.name}
                    </h3>
                    <p className="text-sm text-gray-500">{coach.title}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{coach.rating}</span>
                      <span className="text-gray-400">
                        ({coach.reviews} yorum)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {coach.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Doğrulanmış Profil</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
