// src/pages/Index.tsx
// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  Search,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Crown,
  Sparkles,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // =========================
  // Persona Switch
  // =========================
  const personas = useMemo(
    () => [
      {
        key: "user",
        label: "Kullanıcı",
        icon: Users,
        headline: (
          <>
            Potansiyelini <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Zirveye Taşı
            </span>
          </>
        ),
        sub: "Global standartlarda koç ve mentorlarla hedefini netleştir, planını oluştur, gelişimini takip et.",
        primaryCta: { label: "Koçunu Bul", to: "/coaches" },
        secondaryCta: { label: "Nasıl Çalışır?", to: "/how-it-works" },
      },
      {
        key: "coach",
        label: "Koç",
        icon: Briefcase,
        headline: (
          <>
            Uzmanlığını <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Gelire Dönüştür
            </span>
          </>
        ),
        sub: "Profilini oluştur, doğrulan, takvimini aç. Görünürlüğünü artır, seanslarını yönet.",
        primaryCta: { label: "Koç Olarak Başvur", to: "/coach-application" },
        secondaryCta: { label: "Nasıl Çalışır?", to: "/how-it-works" },
      },
      {
        key: "company",
        label: "Şirket",
        icon: Building2,
        headline: (
          <>
            Ekibin İçin <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Ölçeklenebilir Gelişim
            </span>
          </>
        ),
        sub: "Hedef bazlı koçluk programları, ölçümleme ve raporlama ile kurumsal etki yarat.",
        primaryCta: { label: "Kurumsal Çözüm", to: "/for-companies" },
        secondaryCta: { label: "Demo Akışını Gör", to: "/how-it-works" },
      },
    ],
    []
  );

  const [persona, setPersona] = useState("user");
  const active = useMemo(
    () => personas.find((p) => p.key === persona) || personas[0],
    [persona, personas]
  );

  // =========================
  // Live hissi (Supa'ya dokunmaz)
  // =========================
  const [live, setLive] = useState({
    onlineCoaches: 27,
    todayMatches: 148,
    plannedSessions: 19,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setLive((prev) => {
        const bump = (n: number, min: number, max: number) => {
          const d = Math.floor(Math.random() * 3) - 1;
          const next = n + d;
          return Math.max(min, Math.min(max, next));
        };
        return {
          onlineCoaches: bump(prev.onlineCoaches, 8, 99),
          todayMatches: bump(prev.todayMatches, 40, 399),
          plannedSessions: bump(prev.plannedSessions, 5, 89),
        };
      });
    }, 2400);
    return () => clearInterval(t);
  }, []);

  // =========================
  // Mini search
  // =========================
  const GOALS = [
    { id: "interview", label: "Mülakat Hazırlığı" },
    { id: "cv", label: "CV & LinkedIn" },
    { id: "promotion", label: "Terfi & Kariyer Planı" },
    { id: "leadership", label: "Liderlik" },
    { id: "startup", label: "Girişim / Startup" },
  ];
  const LANGS = [
    { id: "tr", label: "Türkçe" },
    { id: "en", label: "English" },
    { id: "ar", label: "العربية" },
    { id: "fr", label: "Français" },
  ];

  const [goal, setGoal] = useState(GOALS[0].id);
  const [lang, setLang] = useState(LANGS[0].id);
  const [level, setLevel] = useState("mid");

  const onQuickSearch = () => {
    const qs = new URLSearchParams();
    qs.set("goal", goal);
    qs.set("lang", lang);
    qs.set("level", level);
    navigate(`/coaches?${qs.toString()}`);
  };

  // =========================
  // Featured coaches (vitrin)
  // =========================
  const featuredCoaches = [
    {
      id: "featured-1",
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Liderlik Koçu",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "4.9",
      reviews: "120+",
      tags: ["Liderlik", "Kariyer"],
    },
    {
      id: "featured-2",
      name: "Mehmet Demir",
      title: "Teknoloji Yöneticisi",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
      rating: "5.0",
      reviews: "85+",
      tags: ["Teknoloji", "Startup"],
    },
    {
      id: "featured-3",
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
    <div className="min-h-screen bg-white font-sans">
      {/* =========================
          HERO (daha sade / daha premium)
         ========================= */}
      <section className="relative overflow-hidden bg-[#FFF5F2]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-200/50 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-red-200/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 pb-10 lg:pt-16 lg:pb-12">
          {/* Top trust line (tek satır, premium) */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-red-200/60 backdrop-blur text-sm font-semibold text-red-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Doğrulanmış Platform • Hedef Bazlı Takip
            </div>
          </div>

          {/* Persona switch (daha ince) */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-2xl border border-gray-200 bg-white/80 backdrop-blur px-1.5 py-1.5 shadow-sm">
              {personas.map((p) => {
                const Icon = p.icon;
                const activeTab = persona === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={[
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition",
                      activeTab
                        ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Headline */}
          <div className="mt-8 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
              {active.headline}
            </h1>

            <p className="mt-5 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {active.sub}
            </p>

            {/* CTA row (daha net) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={active.primaryCta.to}>
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-[1.02]"
                >
                  {active.primaryCta.label} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to={active.secondaryCta.to}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 text-lg h-14 px-8 rounded-xl"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-gray-500" />
                  {active.secondaryCta.label}
                </Button>
              </Link>
            </div>

            {/* Trust bar (güven kanıtı) */}
            <div className="mt-8 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Doğrulama & Şeffaf Profil",
                    desc: "Rozetler, yorumlar ve kanıtlı uzmanlık.",
                  },
                  {
                    icon: Zap,
                    title: "Hızlı Eşleşme",
                    desc: "Hedeflerine göre doğru uzman.",
                  },
                  {
                    icon: Globe,
                    title: "Global & Online",
                    desc: "Saat dilimi uyumlu seanslar.",
                  },
                ].map((x, i) => {
                  const Ico = x.icon;
                  return (
                    <Card key={i} className="border border-gray-200 bg-white/80 backdrop-blur shadow-sm">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                          <Ico className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-900">{x.title}</div>
                          <div className="text-sm text-gray-600 mt-0.5">{x.desc}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Premium value prop (ilk ekranda net) */}
            <div className="mt-6 max-w-3xl mx-auto">
              <Card className="border border-red-200 bg-white/85 backdrop-blur shadow-sm">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-gray-900">
                        Premium ile daha hızlı sonuç
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        Öncelikli eşleşme • Üst sıralama • Gelişim takibi
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/pricing">
                      <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                        Premium’u Gör
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="rounded-xl">
                        Ücretsiz Başla
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live activity (daha aşağı, daha sakin) */}
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-3">
                <Card className="border border-gray-200 bg-white/80 backdrop-blur">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        Online koç
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        <span className="text-emerald-600">●</span> {live.onlineCoaches}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white/80 backdrop-blur">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        Bugün eşleşme
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {live.todayMatches}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white/80 backdrop-blur">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        Son 1 saatte planlanan
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {live.plannedSessions}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Mini Search */}
          <div className="mt-10 max-w-5xl mx-auto">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                        Hedef
                      </div>
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full mt-1 outline-none bg-transparent text-sm text-gray-900"
                      >
                        {GOALS.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                        Dil
                      </div>
                      <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="w-full mt-1 outline-none bg-transparent text-sm text-gray-900"
                      >
                        {LANGS.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                        Seviye
                      </div>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full mt-1 outline-none bg-transparent text-sm text-gray-900"
                      >
                        <option value="junior">Junior</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="exec">Yönetici</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={onQuickSearch}
                    className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white px-6"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Eşleş
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sosyal proof (iddiasız) */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              Profesyonellerin kullandığı hedef odaklı gelişim deneyimi
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Teknoloji", "Fintech", "E-ticaret", "Sağlık", "Eğitim", "Danışmanlık"].map((x) => (
                <span
                  key={x}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 text-gray-700"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Neden Biz? (daha kısa, daha net)
         ========================= */}
      <section className="py-14 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Net akış. Net sonuç.
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Hedefini seç → doğru uzmanı bul → seans planla → gelişimini takip et.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, t: "Doğrulama", d: "Rozet + yorum + şeffaflık" },
              { icon: Zap, t: "Hız", d: "Dakikalar içinde eşleşme" },
              { icon: Globe, t: "Global", d: "Online, saat dilimi uyumlu" },
              { icon: Star, t: "Kalite", d: "Puanlama ve geri bildirim" },
            ].map((x, i) => {
              const Ico = x.icon;
              return (
                <Card key={i} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                      <Ico className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 font-bold text-gray-900">{x.t}</div>
                    <div className="mt-1 text-sm text-gray-600">{x.d}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          Öne Çıkan Koçlar
         ========================= */}
      <section className="py-18 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 mb-2">
                Uzman Kadro
              </Badge>
              <h2 className="text-3xl font-black text-gray-900">Haftanın Öne Çıkanları</h2>
              <p className="mt-2 text-gray-600">
                Doğrulanmış profil, yorumlar ve uzmanlık alanlarına göre vitrin.
              </p>
            </div>
            <Link to="/coaches" className="hidden md:flex">
              <Button variant="outline" className="rounded-xl">
                Tümünü Gör
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach) => (
              <div
                key={coach.id}
                onClick={() => navigate("/coaches")}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{coach.name}</h3>
                    <p className="text-sm text-gray-500">{coach.title}</p>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{coach.rating}</span>
                      <span className="text-gray-400">({coach.reviews} yorum)</span>
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

          <div className="mt-10 flex md:hidden justify-center">
            <Link to="/coaches">
              <Button variant="outline" className="rounded-xl">
                Tüm Koçları Gör
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          Premium alt bölüm (pasif gelir için tekrar)
         ========================= */}
      <section className="py-14 px-4 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="max-w-2xl">
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-3">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                    Daha hızlı ilerlemek için Premium
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Öncelikli eşleşme, üst sıralama, gelişim takibi ve özel içerikler.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Öncelikli eşleşme", "Üst sıralama", "Plan & takip", "Özel içerikler"].map((x) => (
                      <span
                        key={x}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {x}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/pricing">
                    <Button className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white px-7">
                      Premium’u Gör <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" className="h-12 rounded-xl px-7">
                      Ücretsiz Başla
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Premium satın alma sayfası: /pricing
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
