// src/pages/CoachProfile.tsx
// @ts-nocheck
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Heart,
  CalendarDays,
  Clock,
  MessageCircle,
  Award,
  Globe2,
  PlayCircle,
} from "lucide-react";

// Şimdilik mock veri – sonra Supabase'e bağlarız
const mockCoach = {
  id: 1,
  name: "Elif Kara",
  title: "Executive & Kariyer Koçu",
  location: "İstanbul, TR",
  rating: 4.9,
  reviewCount: 128,
  totalSessions: 780,
  favoritesCount: 364,
  isOnline: true,
  tags: ["Kariyer", "Liderlik", "Mülakat", "CV", "Yeni Mezun"],
  photo_url:
    "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: `
10+ yıllık kurumsal deneyime sahip Executive ve Kariyer Koçu. 
Unilever, Google, Trendyol gibi şirketlerde liderlik gelişimi, kariyer geçişi ve performans koçluğu alanlarında birebir ve grup çalışmaları yürüttü.

Özellikle:
- Kariyer yön bulma
- Yönetici pozisyonuna geçiş
- Mülakat ve sunum performansı
- Kariyer reset & yurt dışına açılma

alanlarında uzmanlaşmıştır.
  `,
  methodology: `
Seanslarımda çözüm odaklı koçluk, pozitif psikoloji ve aksiyon planı odaklı çalışma yöntemlerini kullanıyorum. 
Her seans sonunda net aksiyon maddeleri ve takip planı ile ilerliyoruz.
  `,
  education: [
    "ICF Onaylı Profesyonel Koçluk Programı (PCC Track)",
    "Boğaziçi Üniversitesi – İşletme",
    "ICF – Etik ve Mesleki Standartlar Eğitimi",
  ],
  experience: [
    "Kıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi",
    "Liderlik Gelişim Programları Eğitmeni",
    "Yurt dışı kariyer geçişi danışmanlığı",
  ],
  services: [
    {
      id: 1,
      name: "Kariyer Yolu ve Hedef Belirleme",
      duration: 60,
      price: 950,
      desc: "Kariyerinde kaybolmuş, yönünü tekrar çizmek isteyen profesyoneller için.",
      gains: [
        "Net kariyer yönü",
        "Güçlü yönlerini keşfetme",
        "Somut aksiyon planı",
      ],
    },
    {
      id: 2,
      name: "Mülakat Provası & CV Revizyonu",
      duration: 75,
      price: 1200,
      desc: "Önemli bir mülakat ya da terfi süreci öncesi odaklı hazırlık.",
      gains: [
        "Mülakat provası",
        "CV & LinkedIn incelemesi",
        "Net geri bildirim ve iyileştirme",
      ],
    },
  ],
  programs: [
    {
      id: 1,
      name: "4 Haftalık Kariyer Reset Programı",
      sessions: 4,
      duration: "4 Hafta",
      price: 3600,
      level: "Önerilen",
      desc: "Kariyerine sıfırdan, daha net ve güçlü bir başlangıç yapmak isteyenler için yapılandırılmış program.",
    },
    {
      id: 2,
      name: "8 Seanslık Liderlik Gelişim Programı",
      sessions: 8,
      duration: "8 Hafta",
      price: 7200,
      level: "Premium",
      desc: "Yönetici veya yönetici adayı profesyoneller için, liderlik kaslarını güçlendirmeye odaklı derinlikli çalışma.",
    },
  ],
  faqs: [
    {
      q: "Seanslar online mı gerçekleşiyor?",
      a: "Evet, tüm seanslar Zoom veya Google Meet üzerinden online olarak gerçekleşmektedir.",
    },
    {
      q: "Seans öncesi nasıl hazırlanmalıyım?",
      a: "Güncel durumunuzu, hedeflerinizi ve zorlandığınız alanları ana başlıklar halinde not almanız yeterlidir.",
    },
  ],
};

const mockSchedule = [
  { day: "Bugün", slots: ["19:00", "20:30"] },
  { day: "Yarın", slots: ["10:00", "11:30", "21:00"] },
  { day: "Cuma", slots: ["18:00", "19:30"] },
];

const mockReviews = [
  {
    name: "Mert Y.",
    role: "Ürün Yöneticisi",
    rating: 5,
    date: "02 Aralık 2025",
    text: "3 aydır birlikte çalışıyoruz. Kariyerimdeki tıkanıklığı aşmamda çok yardımcı oldu, yönüm netleşti.",
  },
  {
    name: "Zeynep A.",
    role: "Yeni Mezun",
    rating: 5,
    date: "28 Kasım 2025",
    text: "Mülakat provaları sayesinde 2 farklı yerden teklif aldım. Çok sistematik ve destekleyici bir yaklaşımı var.",
  },
];

export default function CoachProfile() {
  const { id } = useParams(); // ileride Supabase'ten kullanacağız
  const coach = mockCoach;
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      {/* HERO – BEYAZ / TURUNCU / KIRMIZI */}
      <section className="w-full bg-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-10">
          {/* Profil Fotoğrafı */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={coach.photo_url}
                alt={coach.name}
                className="w-36 h-36 rounded-2xl object-cover shadow-md border border-gray-200"
              />
              {coach.isOnline && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white" />
                </span>
              )}
            </div>

            <button className="mt-4 px-4 py-1.5 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
              {coach.isOnline ? "• Şu An Uygun" : "• Şu An Meşgul"}
            </button>
          </div>

          {/* Koç Bilgisi */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
              <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs">
                Öne Çıkan Koç
              </Badge>
            </div>

            <p className="text-lg text-gray-700 flex items-center gap-2">
              {coach.title}
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <Globe2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{coach.location}</span>
            </p>

            {/* Etiketler */}
            <div className="flex flex-wrap gap-2 mt-2">
              {coach.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* İstatistikler */}
            <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">{coach.rating}</span>
                <span className="text-gray-500">
                  ({coach.reviewCount} değerlendirme)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{coach.totalSessions}</span>
                <span className="text-gray-500">seans</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{coach.favoritesCount}</span>
                <span className="text-gray-500">favori</span>
              </div>
            </div>

            {/* CTA Butonlar */}
            <div className="flex flex-wrap gap-3 mt-5">
              <Button className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow">
                Hemen Seans Al
              </Button>
              <Button
                variant="outline"
                className="px-6 py-3 rounded-xl border-gray-300 text-gray-800 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Favorilere Ekle
              </Button>
            </div>
          </div>

          {/* Sağ Özet Kartı – Uygun Saatler */}
          <div className="w-full md:w-72">
            <Card className="bg-[#FFF8F5] border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  En Yakın Uygun Saatler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {mockSchedule.map((day) => (
                  <div key={day.day}>
                    <div className="flex items-center justify-between text-gray-500 mb-1">
                      <span>{day.day}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot) => (
                        <Button
                          key={slot}
                          variant="outline"
                          size="sm"
                          className="rounded-full h-8 text-[11px] border-orange-200 text-gray-700 hover:bg-orange-50"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ALT İÇERİK – TABS */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-white border border-orange-100 rounded-full p-1">
            <TabsTrigger value="about">Hakkında</TabsTrigger>
            <TabsTrigger value="services">Hizmetler</TabsTrigger>
            <TabsTrigger value="programs">Program Paketleri</TabsTrigger>
            <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            <TabsTrigger value="content">İçerikler</TabsTrigger>
            <TabsTrigger value="faq">SSS</TabsTrigger>
          </TabsList>

          {/* HAKKINDA */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-white border border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Koç Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-800">
                <p className="whitespace-pre-line">{coach.bio}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white border border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
                    <Award className="w-4 h-4 text-orange-500" />
                    Eğitim & Sertifikalar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-800">
                  {coach.education.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-[#FFF8F5] px-3 py-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-gray-900">
                    <Users className="w-4 h-4 text-red-500" />
                    Tecrübe & Geçmiş
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-800">
                  {coach.experience.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-[#FFF8F5] px-3 py-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Koçluk Metodolojisi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-800 whitespace-pre-line">
                {coach.methodology}
              </CardContent>
            </Card>
          </TabsContent>

          {/* HİZMETLER */}
          <TabsContent value="services">
            <div className="grid md:grid-cols-2 gap-4">
              {coach.services.map((service) => (
                <Card
                  key={service.id}
                  className={`bg-white border shadow-sm ${
                    selectedService === service.id
                      ? "border-red-400"
                      : "border-orange-100"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base text-gray-900">
                          {service.name}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {service.desc}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {service.price} TL
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.duration} dk
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-800">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Bu seans sonunda:
                      </p>
                      <ul className="space-y-1">
                        {service.gains.map((g) => (
                          <li key={g} className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm"
                      onClick={() => setSelectedService(service.id)}
                    >
                      Bu Seansı Seç ve Devam Et
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PROGRAM PAKETLERİ */}
          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {coach.programs.map((program) => (
                <Card
                  key={program.id}
                  className="bg-white border border-orange-200 shadow-sm"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base text-gray-900">
                          {program.name}
                        </CardTitle>
                        <p className="text-xs text-orange-600 mt-1">
                          {program.level}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {program.price} TL
                        </p>
                        <p className="text-xs text-gray-500">
                          {program.sessions} seans · {program.duration}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-800">
                    <p>{program.desc}</p>
                    <Button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm">
                      Programı Satın Al
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* YORUMLAR */}
          <TabsContent value="reviews">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-gray-900">
                  {coach.rating.toFixed(1)} / 5
                </span>
                <span className="text-gray-500">
                  ({coach.reviewCount} değerlendirme)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 text-xs"
              >
                Filtrele
              </Button>
            </div>

            <div className="space-y-3">
              {mockReviews.map((rev, idx) => (
                <Card
                  key={idx}
                  className="bg-white border border-orange-100 shadow-sm"
                >
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {rev.name}
                        </p>
                        <p className="text-xs text-gray-500">{rev.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-900">{rev.rating}.0</span>
                        <span className="text-gray-400">· {rev.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{rev.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-gray-500"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Koç Yanıtı Yaz (yakında)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* İÇERİKLER */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="bg-white border border-orange-100 shadow-sm flex flex-col"
                >
                  <div className="h-32 rounded-t-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <CardContent className="py-3 space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">
                      Kariyer Yönünü Bulmak İçin 3 Ana Soru
                    </p>
                    <p className="text-xs text-gray-500">
                      8 dk · Video · 1.2K görüntülenme
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-0 h-7 text-xs text-red-600"
                    >
                      İçeriği Görüntüle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SSS */}
          <TabsContent value="faq">
            <div className="space-y-3">
              {coach.faqs.map((item, idx) => (
                <Card
                  key={idx}
                  className="bg-white border border-orange-100 shadow-sm"
                >
                  <CardContent className="py-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {item.q}
                    </p>
                    <p className="text-xs text-gray-600">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
