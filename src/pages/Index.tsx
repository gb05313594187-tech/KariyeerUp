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
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  Search,
  Star,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  /* =========================
     PERSONA SWITCH
  ========================= */
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

  /* =========================
     CANLI İSTATİSTİKLER (UI)
  ========================= */
  const [live, setLive] = useState({
    onlineCoaches: 34,
    todayMatches: 147,
    plannedSessions: 15,
  });

  useEffect(() => {
    const t = setInterval(() => {
      const bump = (n: number, min: number, max: number) => {
        const d = Math.random() > 0.5 ? 1 : -1;
        const next = n + d;
        return Math.max(min, Math.min(max, next));
      };
      setLive((p) => ({
        onlineCoaches: bump(p.onlineCoaches, 12, 120),
        todayMatches: bump(p.todayMatches, 60, 600),
        plannedSessions: bump(p.plannedSessions, 5, 140),
      }));
    }, 2400);
    return () => clearInterval(t);
  }, []);

  /* =========================
     QUICK SEARCH
  ========================= */
  const [goal, setGoal] = useState("interview");
  const [lang, setLang] = useState("tr");
  const [level, setLevel] = useState("mid");

  const onQuickSearch = () => {
    const qs = new URLSearchParams({ goal, lang, level });
    navigate(`/coaches?${qs.toString()}`);
  };

  /* =========================
     ÖNE ÇIKAN KOÇLAR (VİTRİN)
  ========================= */
  const featuredCoaches = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Liderlik Koçu",
      rating: "4.9",
      sessions: "Bu hafta 12 seans",
      tags: ["Liderlik", "Kariyer"],
    },
    {
      name: "Mehmet Demir",
      title: "Teknoloji & Startup Mentoru",
      rating: "5.0",
      sessions: "Bu hafta 9 seans",
      tags: ["Teknoloji", "Startup"],
    },
    {
      name: "Zeynep Kaya",
      title: "Mülakat & CV Uzmanı",
      rating: "4.8",
      sessions: "Bu hafta 15 seans",
      tags: ["Mülakat", "CV"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section className="relative bg-[#FFF5F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-14 pb-10 text-center">
          {/* Trust line */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-red-200 text-sm font-semibold text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Doğrulanmış Platform • Hedef Bazlı Takip
          </div>

          {/* Persona */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-2xl border bg-white/80 p-1 shadow-sm">
              {personas.map((p) => {
                const Icon = p.icon;
                const activeTab = persona === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition
                      ${
                        activeTab
                          ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            {active.headline}
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-600">
            {active.sub}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={active.primaryCta.to}>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 rounded-xl"
              >
                {active.primaryCta.label}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link to={active.secondaryCta.to}>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl">
                <PlayCircle className="mr-2 h-5 w-5" />
                {active.secondaryCta.label}
              </Button>
            </Link>
          </div>

          {/* Live Stats */}
          <div className="mt-10 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Stat title="Online Koç" value={live.onlineCoaches} color="emerald" icon={Users} />
            <Stat title="Bugün Eşleşme" value={live.todayMatches} color="orange" icon={TrendingUp} />
            <Stat title="Son 1 Saatte" value={live.plannedSessions} color="red" icon={Clock} />
          </div>

          {/* Quick Search */}
          <div className="mt-10 max-w-5xl mx-auto">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center">
                <Select
                  label="Hedef"
                  value={goal}
                  onChange={setGoal}
                  options={[
                    ["interview", "Mülakat"],
                    ["cv", "CV & LinkedIn"],
                    ["promotion", "Terfi & Kariyer Planı"],
                    ["leadership", "Liderlik"],
                    ["startup", "Girişim / Startup"],
                  ]}
                />
                <Select
                  label="Dil"
                  value={lang}
                  onChange={setLang}
                  options={[
                    ["tr", "TR"],
                    ["en", "EN"],
                    ["ar", "AR"],
                    ["fr", "FR"],
                  ]}
                />
                <Select
                  label="Seviye"
                  value={level}
                  onChange={setLevel}
                  options={[
                    ["junior", "Junior"],
                    ["mid", "Mid"],
                    ["senior", "Senior"],
                    ["exec", "Yönetici"],
                  ]}
                />
                <Button
                  onClick={onQuickSearch}
                  className="h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 w-full md:w-auto"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Eşleş
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================
         2025 KARIYER GERÇEĞİ (UNICORN STORY)
      ========================= */}
      <section className="py-16 px-4 bg-white border-t">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            2025’te Kariyerler Neden Tıkanıyor?
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Kariyer gelişimi artık rastgele ilerliyor. İnsanlar neyi, ne zaman,
            kiminle geliştireceğini bilmiyor.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <StatCard
              value="%67"
              title="Hedef Belirsizliği"
              desc="Çalışanların çoğu kariyerinde hangi beceriyi geliştirmesi gerektiğini bilmiyor."
            />
            <StatCard
              value="%54"
              title="Yanlış Yönlenme"
              desc="Junior & Mid seviye çalışanlar yanlış rehberlik nedeniyle iş değiştiriyor."
            />
            <StatCard
              value="%72"
              title="Ölçülemeyen Gelişim"
              desc="Şirketler çalışan gelişimini ölçemediği için bütçe ve zaman kaybediyor."
            />
          </div>

          <p className="mt-10 text-lg font-semibold text-gray-900">
            Kariyeer, kariyer gelişimini rastgele olmaktan çıkarır.
          </p>
          <p className="text-gray-600">Hedef • Uzman • İlerleme aynı yerde.</p>
        </div>
      </section>

      {/* =========================
         ÖNE ÇIKAN KOÇLAR (SATILABİLİR)
      ========================= */}
      <section className="py-16 px-4 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-3">
              Marketplace
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Öne Çıkan Koçlar
            </h2>
            <p className="mt-3 text-gray-600">
              En çok tercih edilen, yüksek puanlı ve aktif koçlar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach, i) => (
              <div
                key={i}
                onClick={() => navigate("/coaches")}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600">
                    Öne Çıkan
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {coach.rating}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="font-black text-lg text-gray-900">{coach.name}</div>
                  <div className="text-sm text-gray-600">{coach.title}</div>
                </div>

                <div className="mt-3 text-sm text-gray-500">{coach.sessions}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {coach.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    Listeleme: <span className="font-semibold text-gray-800">Ücretli</span>
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    Detay →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600">
              Koç musun? Bu liste{" "}
              <span className="font-semibold">ücretlidir</span> ve sınırlıdır.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/coach-application">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-7 h-12">
                  Öne Çıkmak İstiyorum
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="rounded-xl px-7 h-12">
                  Tüm Koçları İncele
                </Button>
              </Link>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Öne çıkan koçlar: görünürlük + daha hızlı dönüşüm için listeleme alanıdır.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= HELPERS ================= */

function Stat({ title, value, color, icon: Icon }) {
  // NOTE: tailwind dynamic class riskini sıfırlamak için mapping kullandım
  const bg = {
    emerald: "bg-emerald-50",
    orange: "bg-orange-50",
    red: "bg-red-50",
  }[color] || "bg-gray-50";

  const txt = {
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    red: "text-red-600",
  }[color] || "text-gray-600";

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="text-left">
          <div className="text-xs uppercase text-gray-500 font-semibold">
            {title}
          </div>
          <div className="text-2xl font-black text-gray-900 mt-1">{value}</div>
        </div>

        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${txt}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex-1 w-full border border-gray-200 rounded-xl px-3 py-2 bg-white">
      <div className="text-xs uppercase text-gray-500 font-semibold">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 bg-transparent outline-none text-gray-900"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ value, title, desc }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left shadow-sm">
      <div className="text-4xl font-black text-red-600">{value}</div>
      <div className="mt-2 font-bold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</div>
    </div>
  );
}
