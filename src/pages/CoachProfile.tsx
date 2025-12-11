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
  Heart,
  Users,
  Clock,
  CalendarDays,
  MessageCircle,
  PlayCircle,
  Award,
  Globe2,
} from "lucide-react";

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
  const { id } = useParams(); // ileride Supabase'ten id ile çekersin
  const coach = mockCoach;
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="relative border-b border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#0ea5e9_0,_transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-10 lg:py-14 flex flex-col lg:flex-row gap-10">
          {/* Sol: Koç bilgisi */}
          <div className="flex-1 flex gap-6">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-4xl font-semibold shadow-xl">
              EK
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1" />
                  {coach.isOnline ? "Şu An Uygun" : "Şu An Meşgul"}
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                {coach.name}
              </h1>
              <p className="text-sm lg:text-base text-slate-300 flex items-center gap-2">
                {coach.title}
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                {coach.location}
                <Globe2 className="w-4 h-4" />
              </p>

              <div className="flex flex-wrap gap-2 mt-1">
                {coach.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-indigo-400/40 bg-indigo-500/5 text-indigo-200 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 text-xs lg:text-sm mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{coach.rating.toFixed(1)} / 5</span>
                  <span className="text-slate-400">({coach.reviewCount} değerlendirme)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>{coach.totalSessions}+ seans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>{coach.favoritesCount} favori</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button size="lg" className="rounded-full px-6 bg-indigo-500 hover:bg-indigo-400">
                  Anında Seans Al
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-white/20">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorilere Ekle
                </Button>
              </div>
            </div>
          </div>

          {/* Sağ: Mini özet kartları */}
          <div className="w-full lg:w-80 space-y-3">
            <Card className="bg-slate-900/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-slate-200">
                  Bugün Uygun Saatler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSchedule.map((day) => (
                    <div key={day.day}>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{day.day}</span>
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs border-slate-600 hover:bg-indigo-500/20"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-indigo-500/40">
              <CardContent className="py-3 flex items-center gap-3">
                <PlayCircle className="w-8 h-8 text-indigo-400" />
                <div>
                  <p className="text-xs text-slate-400">Yeni gelenler için</p>
                  <p className="text-sm font-medium">
                    “Koçla Tanışma” 30 dk giriş seansı
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ALT İÇERİK: Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-slate-900 border border-white/10">
            <TabsTrigger value="about">Hakkında</TabsTrigger>
            <TabsTrigger value="services">Hizmetler</TabsTrigger>
            <TabsTrigger value="programs">Program Paketleri</TabsTrigger>
            <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            <TabsTrigger value="content">İçerikler</TabsTrigger>
            <TabsTrigger value="faq">SSS</TabsTrigger>
          </TabsList>

          {/* Hakkında */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-slate-900/80 border-white/10">
              <CardHeader>
                <CardTitle>Koç Hakkında</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-200">
                <p className="whitespace-pre-line">{coach.bio}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/80 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-amber-400" />
                    Eğitim & Sertifikalar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-200">
                  {coach.education.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-slate-900/80 px-3 py-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-sky-400" />
                    Tecrübe & Geçmiş
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-200">
                  {coach.experience.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-slate-900/80 px-3 py-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/80 border-white/10">
              <CardHeader>
                <CardTitle>Koçluk Metodolojisi</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-200 whitespace-pre-line">
                {coach.methodology}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hizmetler */}
          <TabsContent value="services">
            <div className="grid md:grid-cols-2 gap-4">
              {coach.services.map((service) => (
                <Card
                  key={service.id}
                  className={`bg-slate-900/80 border ${
                    selectedService === service.id
                      ? "border-indigo-400"
                      : "border-white/10"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <p className="text-xs text-slate-400 mt-1">
                          {service.desc}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{service.price} TL</p>
                        <p className="text-xs text-slate-400">
                          {service.duration} dk seans
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 mb-1">
                        Bu seans sonunda:
                      </p>
                      <ul className="text-xs text-slate-200 space-y-1">
                        {service.gains.map((g) => (
                          <li key={g} className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="w-full rounded-full bg-indigo-500 hover:bg-indigo-400"
                      onClick={() => setSelectedService(service.id)}
                    >
                      Bu Seansı Seç ve Devam Et
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Program Paketleri */}
          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {coach.programs.map((program) => (
                <Card
                  key={program.id}
                  className="bg-slate-900/80 border border-indigo-500/40"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{program.name}</CardTitle>
                        <p className="text-xs text-indigo-300 mt-1">
                          {program.level}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{program.price} TL</p>
                        <p className="text-xs text-slate-400">
                          {program.sessions} seans · {program.duration}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-200">
                    <p>{program.desc}</p>
                    <Button className="w-full rounded-full bg-indigo-500 hover:bg-indigo-400">
                      Programı Satın Al
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Yorumlar */}
          <TabsContent value="reviews">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">{coach.rating.toFixed(1)} / 5</span>
                <span className="text-slate-400">
                  ({coach.reviewCount} değerlendirme)
                </span>
              </div>
              <Button variant="outline" size="sm" className="border-white/20">
                Filtrele
              </Button>
            </div>

            <div className="space-y-3">
              {mockReviews.map((rev, idx) => (
                <Card
                  key={idx}
                  className="bg-slate-900/80 border-white/10"
                >
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{rev.name}</p>
                        <p className="text-xs text-slate-400">{rev.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{rev.rating}.0</span>
                        <span className="text-slate-500">· {rev.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200">{rev.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-slate-400"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Koç Yanıtı Yaz (yakında)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* İçerikler */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="bg-slate-900/80 border-white/10 flex flex-col"
                >
                  <div className="h-32 rounded-t-xl bg-gradient-to-br from-indigo-500/40 to-sky-500/20 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-indigo-100" />
                  </div>
                  <CardContent className="py-3 space-y-1 text-sm">
                    <p className="font-medium">
                      Kariyer Yönünü Bulmak İçin 3 Ana Soru
                    </p>
                    <p className="text-xs text-slate-400">
                      8 dk · Video · 1.2K görüntülenme
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-0 h-7 text-xs text-indigo-300"
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
                <Card key={idx} className="bg-slate-900/80 border-white/10">
                  <CardContent className="py-3">
                    <p className="text-sm font-medium mb-1">{item.q}</p>
                    <p className="text-xs text-slate-300">{item.a}</p>
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
