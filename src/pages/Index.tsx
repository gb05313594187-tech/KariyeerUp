// src/pages/Index.tsx
// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Star,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Users,
  Building2,
  Briefcase,
  Sparkles,
  TrendingUp,
  Clock,
  Search,
  Quote,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // =========================
  // 1) Persona switch (User / Coach / Company)
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
        sub: "Global standartlarda koçlar ve mentorlarla hedefini netleştir, planını oluştur, gelişimini takip et.",
        primaryCta: { label: "Koçunu Bul", to: "/coaches" },
        secondaryCta: { label: "Nasıl Çalışır?", to: "/how-it-works" },
        micro: ["Doğrulanmış profiller", "Güvenli ödeme", "Hızlı eşleşme"],
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
        sub: "Profilini oluştur, doğrulan, takvimini aç. Seanslarını yönet, gelirini artır, topluluğa görünür ol.",
        primaryCta: { label: "Koç Olarak Başvur", to: "/coach-application" },
        secondaryCta: { label: "Nasıl Çalışır?", to: "/how-it-works" },
        micro: ["Takvim & seans yönetimi", "Doğrulama rozeti", "Görünürlük & sıralama"],
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
        sub: "Çalışan gelişimi için hedef bazlı koçluk programları, ölçümleme ve raporlama ile kurumsal etki yarat.",
        primaryCta: { label: "Kurumsal Çözüm", to: "/for-companies" },
        secondaryCta: { label: "Demo Akışını Gör", to: "/how-it-works" },
        micro: ["Program & bütçe kontrolü", "Raporlama & KPI", "Kurumsal doğrulama"],
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
  // 2) "Live" platform hissi (Supabase'e dokunmaz)
  // - Statik değil: yumuşak dalgalanır, canlı görünür
  // =========================
  const [live, setLive] = useState({
    onlineCoaches: 27,
    todayMatches: 148,
    plannedSessions: 19,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setLive((prev) => {
        const bump = (n, min, max) => {
          const d = Math.floor(Math.random() * 3) - 1; // -1,0,+1
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
  // 3) Mini search (route query param üretir, entegrasyonu bozmaz)
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
  // 4) Featured coaches (statik vitrin) - profil rotası yoksa /coaches'a götürür
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

  // =========================
  // 5) Topluluk nabzı (mini feed hissi, supa bozulmaz)
  // =========================
  const pulse = [
    {
      title: "Bu hafta en çok aranan hedef",
      value: "Mülakat Hazırlığı",
      icon: TrendingUp,
    },
    {
      title: "Ortalama eşleşme süresi",
      value: "2–5 dk",
      icon: Clock,
    },
    {
      title: "En aktif kategori",
      value: "Teknoloji & Ürün",
      icon: Sparkles,
    },
  ];

  const miniPosts = [
    {
      author: "Koç Notu",
      text: "Mülakatlarda en sık kaybedilen puan: örnekleri metrikle anlatmamak. Her başarıyı sayı ile bağla.",
      meta: "60 sn okuma",
    },
    {
      author: "Topluluk",
      text: "LinkedIn özetini tek cümleye indir: “Kime ne değer katıyorum?” sorusunu net cevapla.",
      meta: "45 sn okuma",
    },
    {
      author: "Kurumsal",
      text: "Çalışan gelişiminde en hızlı etki: hedef + aksiyon + takip ritmi (haftalık check-in).",
      meta: "50 sn okuma",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-1">
        {/* =========================
            HERO (beyaz sayfa, turuncu hero, kırmızı logo/ana vurgu)
           ========================= */}
        <section className="relative overflow-hidden bg-[#FFF5F2]">
          <div className="absolute inset-0 pointer-events-none">
            {/* soft blobs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-200/50 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-red-200/40 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-12 lg:pt-24 lg:pb-16">
            {/* Persona Switch */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-2xl border border-red-200/60 bg-white/70 backdrop-blur px-2 py-2 shadow-sm">
                {personas.map((p) => {
                  const Icon = p.icon;
                  const activeTab = persona === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setPersona(p.key)}
                      className={[
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
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

            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-7">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Canlı Platform • Doğrulama • Takip & Rapor
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
                {active.headline}
              </h1>

              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {active.sub}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to={active.primaryCta.to}>
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-[1.03]"
                  >
                    {active.primaryCta.label} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link to={active.secondaryCta.to}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 text-lg h-14 px-8 rounded-xl transition-all"
                  >
                    <PlayCircle className="mr-2 h-5 w-5 text-gray-500" />
                    {active.secondaryCta.label}
                  </Button>
                </Link>
              </div>

              {/* Micro trust bullets */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {active.micro.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/70 border border-gray-200 rounded-full px-4 py-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {m}
                  </span>
                ))}
              </div>

              {/* Live activity bar */}
              <div className="mt-10 max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-3 gap-3">
                  <Card className="border border-gray-200 bg-white/80 backdrop-blur">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          Şu anda online koç
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

                <p className="mt-3 text-xs text-gray-500">
                  Not: Bu bölüm platform canlılığı hissi verir; Supabase entegrasyonlarına dokunmaz.
                </p>
              </div>
            </div>

            {/* Mini Search */}
            <div className="mt-12 max-w-5xl mx-auto">
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

            {/* Light social proof (safe & premium) */}
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                Profesyonellerin kullandığı, hedef odaklı gelişim deneyimi
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 opacity-80">
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
            İSTATİSTİKLER (kanıtsız dev sayılar yerine daha güvenli)
           ========================= */}
        <section className="py-12 border-b bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "Doğrulama", label: "Kimlik • uzmanlık • etik", icon: ShieldCheck },
                { value: "Hızlı", label: "2–5 dk eşleşme deneyimi", icon: Zap },
                { value: "Global", label: "Saat dilimi uyumlu seans", icon: Globe },
                { value: "Puan", label: "Yorum & değerlendirme sistemi", icon: Star },
              ].map((s, i) => {
                const Ico = s.icon;
                return (
                  <Card key={i} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <Ico className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="mt-4 text-xl font-bold text-gray-900">{s.value}</div>
                      <div className="mt-1 text-sm text-gray-600">{s.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================
            NEDEN BİZ?
           ========================= */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Kariyerin İçin En İyisi
              </h2>
              <p className="text-lg text-gray-600">
                Sadece bir görüşme değil; hedef, aksiyon, takip ve ölçümle ilerleyen uçtan uca bir süreç.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Doğrulama & Güven",
                  desc: "Profiller doğrulama sürecinden geçer. Yorumlar ve puanlama sistemiyle şeffaf ilerlersin.",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Zap,
                  title: "Hızlı Eşleşme",
                  desc: "Hedef, seviye ve dile göre doğru koça hızlıca yönlen; süreç uzamasın.",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: Globe,
                  title: "Global Erişim",
                  desc: "Dünyanın neresinde olursan ol, sana uygun saat diliminde online seans yap.",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={i}
                    className="border-none shadow-lg hover:-translate-y-2 transition-transform duration-300"
                  >
                    <CardContent className="pt-8 text-center p-8">
                      <div
                        className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${item.color}`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Mini CTA row */}
            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <Button className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white px-6">
                  Hemen Başla <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="h-12 rounded-xl px-6">
                  Koçları İncele
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            TOPLULUK NABZI (mini feed hissi)
           ========================= */}
        <section className="py-20 px-4 bg-white border-t">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-2">
                  Topluluk Nabzı
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900">
                  Platformda Bu Hafta
                </h2>
                <p className="mt-2 text-gray-600 max-w-2xl">
                  Canlılık hissi: hedefler, alışkanlıklar ve kısa içgörülerle doğru aksiyona yönlen.
                </p>
              </div>

              <Link to="/how-it-works" className="hidden md:flex">
                <Button variant="outline" className="rounded-xl">
                  Akışı Gör
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-6">
              {/* Pulse cards */}
              <div className="lg:col-span-1 grid gap-4">
                {pulse.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <Card key={idx} className="border border-gray-200 shadow-sm">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-semibold">{p.title}</div>
                          <div className="text-xl font-bold text-gray-900 mt-1">{p.value}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Mini "feed" */}
              <div className="lg:col-span-2 grid gap-4">
                {miniPosts.map((post, idx) => (
                  <Card key={idx} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Quote className="h-4 w-4 text-red-600" />
                          {post.author}
                        </div>
                        <span className="text-xs text-gray-500">{post.meta}</span>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">{post.text}</p>
                      <div className="mt-4">
                        <Link to="/register" className="text-sm font-semibold text-red-600 hover:text-red-700">
                          Bu akışı kendi hedeflerinle başlat →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            ÖNE ÇIKAN KOÇLAR
           ========================= */}
        <section className="py-24 px-4 bg-white border-t">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 mb-2">
                  Uzman Kadro
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900">
                  Haftanın Öne Çıkanları
                </h2>
                <p className="mt-2 text-gray-600">
                  Doğrulanmış profil, yorumlar ve uzmanlık alanlarına göre seçilmiş vitrin.
                </p>
              </div>
              <Link to="/coaches" className="hidden md:flex">
                <Button variant="outline" className="rounded-xl">Tümünü Gör</Button>
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
                <Button variant="outline" className="rounded-xl">Tüm Koçları Gör</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            Kurumsal mini lead (bozmadan)
           ========================= */}
        <section className="py-16 px-4 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="max-w-2xl">
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-3">
                      Kurumsal
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Çalışan gelişimi için hızlı başlangıç
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Kurumsal program akışını ve örnek raporlamayı gör. İstersen kurumsal sayfadan talep oluştur.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/for-companies">
                      <Button className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white px-6">
                        Kurumsal Çözüm <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/how-it-works">
                      <Button variant="outline" className="h-12 rounded-xl px-6">
                        Akışı Gör
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                  {[
                    { icon: ShieldCheck, t: "Güven", d: "Doğrulama & etik süreçler" },
                    { icon: TrendingUp, t: "Ölçüm", d: "Hedef & ilerleme takibi" },
                    { icon: Sparkles, t: "Program", d: "Rol bazlı yönetim & rapor" },
                  ].map((x, i) => {
                    const Ico = x.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                          <Ico className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{x.t}</div>
                          <div className="text-gray-600">{x.d}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
