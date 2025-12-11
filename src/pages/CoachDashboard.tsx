// src/pages/CoachDashboard.tsx
// @ts-nocheck
import { useState } from "react";
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
  CalendarDays,
  Clock,
  User,
  Wallet,
  TrendingUp,
  Star,
  Filter,
  MessageCircle,
  Video,
  Download,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const earningsData = [
  { month: "Tem", amount: 8200 },
  { month: "Ağu", amount: 10400 },
  { month: "Eyl", amount: 9500 },
  { month: "Eki", amount: 11200 },
  { month: "Kas", amount: 13400 },
  { month: "Ara", amount: 14800 },
];

const upcomingSessions = [
  {
    id: 1,
    time: "10:00 - 11:00",
    date: "11 Aralık 2025",
    client: "Mert Y.",
    type: "Kariyer Yolu",
    status: "Ödeme Alındı",
    channel: "Zoom",
  },
  {
    id: 2,
    time: "14:30 - 15:30",
    date: "11 Aralık 2025",
    client: "Zeynep A.",
    type: "Mülakat Provası",
    status: "Onay Bekliyor",
    channel: "Google Meet",
  },
];

const pastSessions = [
  {
    id: 3,
    time: "19:00 - 20:00",
    date: "09 Aralık 2025",
    client: "Ali K.",
    type: "Kariyer Reset",
    status: "Tamamlandı",
    price: 950,
    rating: 5,
  },
  {
    id: 4,
    time: "20:30 - 21:30",
    date: "08 Aralık 2025",
    client: "Duygu T.",
    type: "Liderlik Gelişim",
    status: "Tamamlandı",
    price: 1200,
    rating: 4.8,
  },
];

const topServices = [
  { name: "Kariyer Yolu ve Hedef Belirleme", count: 46, revenue: 43700 },
  { name: "Mülakat Provası & CV Revizyonu", count: 32, revenue: 38400 },
  { name: "4 Haftalık Kariyer Reset", count: 15, revenue: 54000 },
];

export default function CoachDashboard() {
  const [sessionFilter, setSessionFilter] = useState("all");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO TOP BAR */}
      <section className="border-b border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-xl font-semibold">
              EK
            </div>
            <div>
              <p className="text-xs text-slate-400">Koç Kontrol Paneli</p>
              <h1 className="text-xl font-semibold tracking-tight">
                Hoş geldin, Elif
              </h1>
              <p className="text-xs text-slate-400">
                Bugün 2 seansın, 1 yeni mesajın ve 3 yeni profil görüntülemen var.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="border-white/20">
              <Video className="w-3 h-3 mr-2" />
              Tanıtım Videosu Ekle
            </Button>
            <Button
              size="sm"
              className="bg-indigo-500 hover:bg-indigo-400 rounded-full"
            >
              <CalendarDays className="w-3 h-3 mr-2" />
              Takvimimi Düzenle
            </Button>
          </div>
        </div>
      </section>

      {/* ANA İÇERİK */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ÜST ÖZET KARTLARI */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Bugünkü Seanslar</p>
              <p className="text-2xl font-semibold">2</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Dün’e göre +1
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Bu Ayki Kazanç</p>
              <p className="text-2xl font-semibold">14.800 TL</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hedef: 20.000 TL
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Toplam Seans</p>
              <p className="text-2xl font-semibold">780</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Bu ay: 18 seans
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardContent className="py-4">
              <p className="text-xs text-slate-400 mb-1">Ortalama Puan</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <p className="text-2xl font-semibold">4.9</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                128 değerlendirme
              </p>
            </CardContent>
          </Card>
        </div>

        {/* GRAFİK + KAZANÇ ÖZETİ */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="bg-slate-900/80 border-white/10 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Aylık Kazanç Trendi
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" className="h-7 border-white/20">
                  Son 6 Ay
                </Button>
                <Button variant="ghost" size="xs" className="h-7 text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Rapor Al
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={earningsData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                En Çok Tercih Edilen Hizmetler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {topServices.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-100">{item.name}</p>
                    <p className="text-slate-400">{item.count} seans</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400">
                      {item.revenue.toLocaleString("tr-TR")} TL
                    </span>
                    <span className="text-slate-500">
                      Ortalama seans: ~{Math.round(item.revenue / item.count)} TL
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* SEANSLAR BÖLÜMÜ */}
        <Card className="bg-slate-900/80 border-white/10">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              Seans Yönetimi
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sessionFilter === "all" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={() => setSessionFilter("all")}
              >
                Tümü
              </Button>
              <Button
                variant={sessionFilter === "today" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={() => setSessionFilter("today")}
              >
                Bugün
              </Button>
              <Button
                variant={sessionFilter === "week" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={() => setSessionFilter("week")}
              >
                Bu Hafta
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs border-white/20"
              >
                <Filter className="w-3 h-3 mr-1" />
                Gelişmiş Filtre
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="bg-slate-950 border border-white/10">
                <TabsTrigger value="upcoming">Gelecek Seanslar</TabsTrigger>
                <TabsTrigger value="past">Geçmiş Seanslar</TabsTrigger>
              </TabsList>

              {/* Gelecek Seanslar */}
              <TabsContent value="upcoming" className="mt-4 space-y-3">
                {upcomingSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">
                        <User className="w-4 h-4 text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.client}</p>
                        <p className="text-xs text-slate-400">{s.type}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{s.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          <Clock className="w-3 h-3" />
                          {s.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <Badge
                        variant="outline"
                        className="border-emerald-400/40 text-emerald-300 bg-emerald-500/10 text-[11px]"
                      >
                        {s.status}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        Kanal: {s.channel}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px] border-white/20"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Mesaj Gönder
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 text-[11px] bg-indigo-500 hover:bg-indigo-400"
                        >
                          Seans Notu Ekle
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Geçmiş Seanslar */}
              <TabsContent value="past" className="mt-4 space-y-3">
                {pastSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{s.client}</p>
                      <p className="text-xs text-slate-400">{s.type}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{s.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <Clock className="w-3 h-3" />
                        {s.time}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <span className="text-xs text-emerald-400">
                        {s.price.toLocaleString("tr-TR")} TL
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-300">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {s.rating}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[11px] border-white/20"
                      >
                        AI Seans Özeti Oluştur
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[11px] text-slate-400"
                      >
                        Faturayı Görüntüle
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ALT BLOK: Müşteri & Mesaj */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="bg-slate-900/80 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Son Müşteriler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {["Mert Y.", "Zeynep A.", "Ali K."].map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-[11px] text-slate-400">
                      Son seans: {idx === 0 ? "Dün" : `${idx + 2} gün önce`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] border-white/20"
                    >
                      Profil
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] text-slate-300"
                    >
                      Notlar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Son Mesajlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                {
                  from: "Yeni Müşteri",
                  text: "İlk seans öncesi neler hazırlamalıyım?",
                },
                {
                  from: "Mevcut Müşteri",
                  text: "Bu haftaki seansı erteleyebilir miyiz?",
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{m.from}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {m.text}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] border-white/20"
                  >
                    Yanıtla
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
