// src/pages/CoachProfile.tsx
// @ts-nocheck
import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";

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

// Elif sadece KAYIT BULUNAMAZSA fallback olsun
const fallbackCoach = {
  name: "Elif Kara",
  title: "Kariyer Koçu",
  location: "Online",
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
  `,
  methodology: `
Seanslarımda çözüm odaklı koçluk, pozitif psikoloji ve aksiyon planı odaklı çalışma yöntemlerini kullanıyorum.
  `,
  education: ["ICF Onaylı Profesyonel Koçluk Programı (PCC Track)"],
  experience: ["Kıdemli İnsan Kaynakları İş Ortağı – Global Teknoloji Şirketi"],
  cv_url: null,
};

export default function CoachProfile() {
  const { id } = useParams(); // /coach/:id buradan geliyor
  const [coachRow, setCoachRow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // 🔥 1) SUPABASE'TEN TEK KOÇU ÇEK
  useEffect(() => {
    if (!id) return;

    const fetchCoach = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("app_2dff6511da_coaches") // 👈 Coaches.tsx ile AYNI TABLO
          .select("*")
          .eq("id", id) // 👈 navigate(`/coach/${coach.id}`) —> burada id kolonu kullanılıyor
          .single();

        console.log("CoachProfile Supabase:", { id, data, error });

        if (error) {
          console.error("Coach fetch error:", error);
          setCoachRow(null);
        } else {
          setCoachRow(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setCoachRow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  // 🔁 2) TABLODAN GELEN ALANLARI UI FORMATINA ÇEVİR
  const c = (() => {
    const coach = coachRow;
    if (!coach) return fallbackCoach; // kayıt bulunamazsa Elif

    return {
      name: coach.full_name || fallbackCoach.name,
      title: coach.title || "Kariyer Koçu",
      location: coach.location || "Online",
      rating: coach.rating ?? 5,
      reviewCount: coach.total_reviews ?? 0,
      totalSessions: coach.total_sessions ?? 0,
      favoritesCount: coach.favorites_count ?? 0,
      isOnline: coach.is_online ?? true,
      photo_url:
        coach.avatar_url ||
        coach.photo_url ||
        fallbackCoach.photo_url,
      tags:
        (coach.specializations as string[]) ||
        fallbackCoach.tags,
      bio: coach.bio || fallbackCoach.bio,
      methodology: coach.methodology || fallbackCoach.methodology,
      education: coach.education_list || fallbackCoach.education,
      experience: coach.experience_list || fallbackCoach.experience,
      services: coach.services || [], // ileride tablo bağlarız
      programs: coach.programs || [],
      faqs: coach.faqs || [
        {
          q: "Seanslar online mı gerçekleşiyor?",
          a: "Evet, tüm seanslar Zoom veya Google Meet üzerinden online olarak gerçekleşmektedir.",
        },
        {
          q: "Seans öncesi nasıl hazırlanmalıyım?",
          a: "Güncel durumunuzu, hedeflerinizi ve zorlandığınız alanları ana başlıklar halinde not almanız yeterlidir.",
        },
      ],
      // ⭐ Yeni: Özgeçmiş linki
      cv_url: coach.cv_url || fallbackCoach.cv_url || null,
    };
  })();

  // YÜKLENİYOR EKRANI
  if (loading && !coachRow) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600">
        Koç profili yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      {/* HERO */}
      <section className="w-full bg-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-10">
          {/* Profil Fotoğrafı */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={c.photo_url}
                alt={c.name}
                className="w-36 h-36 rounded-2xl object-cover shadow-md border border-gray-200"
              />
              {c.isOnline && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white" />
                </span>
              )}
            </div>

            <button className="mt-4 px-4 py-1.5 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
              {c.isOnline ? "• Şu An Uygun" : "• Şu An Meşgul"}
            </button>
          </div>

          {/* Koç Bilgisi */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{c.name}</h1>
              <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs">
                Öne Çıkan Koç
              </Badge>
            </div>

            <p className="text-lg text-gray-700 flex items-center gap-2">
              {c.title}
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <Globe2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{c.location}</span>
            </p>

            {/* Etiketler */}
            <div className="flex flex-wrap gap-2 mt-2">
              {c.tags?.map((tag: string) => (
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
                <span className="font-semibold">
                  {Number(c.rating || 0).toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({c.reviewCount || 0} değerlendirme)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{c.totalSessions || 0}</span>
                <span className="text-gray-500">seans</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{c.favoritesCount || 0}</span>
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
            <TabsTrigger value="cv">Özgeçmiş</TabsTrigger>
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
                <p className="whitespace-pre-line">{c.bio}</p>
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
                  {(c.education || []).map((item: string) => (
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
                  {(c.experience || []).map((item: string) => (
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
                {c.methodology}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ÖZGEÇMİŞ */}
          <TabsContent value="cv">
            <div className="space-y-4">
              {c.cv_url ? (
                <Card className="bg-white border border-orange-100 shadow-sm">
                  <CardContent className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Koçun Özgeçmişi (CV)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF formatında detaylı eğitim ve iş deneyimlerini inceleyebilirsiniz.
                      </p>
                    </div>
                    <a
                      href={c.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm">
                        Özgeçmişi Görüntüle / İndir
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white border border-orange-100 shadow-sm">
                  <CardContent className="py-4">
                    <p className="text-sm text-gray-600">
                      Bu koç henüz özgeçmişini eklemedi. Yakında burada görüntüleyebiliyor olacaksınız.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PROGRAM PAKETLERİ */}
          <TabsContent value="programs">
            <div className="grid md:grid-cols-2 gap-4">
              {(c.programs || []).length === 0 && (
                <p className="text-sm text-gray-500">
                  Bu koç henüz program paketi eklemedi.
                </p>
              )}
            </div>
          </TabsContent>

          {/* YORUMLAR (mock) */}
          <TabsContent value="reviews">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-gray-900">
                  {Number(c.rating || 0).toFixed(1)} / 5
                </span>
                <span className="text-gray-500">
                  ({c.reviewCount || 0} değerlendirme)
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

          {/* İÇERİKLER – şimdilik dummy */}
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
              {(c.faqs || []).map((item: any, idx: number) => (
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
