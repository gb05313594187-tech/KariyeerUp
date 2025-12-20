// src/pages/Index.tsx
// @ts-nocheck
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  PlayCircle,
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  /* =========================
     PERSONA (UI only)
  ========================= */
  const personas = [
    {
      key: "user",
      label: "Kullanıcı",
      icon: Users,
      subtitle:
        "Öğrenci, junior, mid veya yönetici olman fark etmez. Doğru koçla hedefini netleştir, gelişimini ölç, hızlan.",
    },
    {
      key: "coach",
      label: "Koç",
      icon: Briefcase,
      subtitle:
        "Profilini büyüt, daha fazla danışana ulaş, seanslarını ve gelirini tek panelden yönet.",
    },
    {
      key: "company",
      label: "Şirket",
      icon: Building2,
      subtitle:
        "Hedef bazlı koçluk programlarıyla ekip gelişimini ölç, raporla ve ölçekle.",
    },
  ];

  const [persona, setPersona] = useState("user");
  const personaCopy = personas.find((p) => p.key === persona) ?? personas[0];

  /* =========================
     MATCH FILTERS
  ========================= */
  const [goal, setGoal] = useState("interview");
  const [level, setLevel] = useState("mid");
  const [lang, setLang] = useState("tr");

  const onMatch = () => {
    const qs = new URLSearchParams({
      goal,
      level,
      lang,
    });
    navigate(`/coaches?${qs.toString()}`);
  };

  /* =========================
     FEATURED COACHES (SELLABLE)
  ========================= */
  const featuredCoaches = [
    {
      name: "Dr. Ayşe Yılmaz",
      title: "Kariyer & Liderlik Koçu",
      rating: "4.9",
      reviews: "120+",
      tags: ["Liderlik", "Kariyer"],
    },
    {
      name: "Mehmet Demir",
      title: "Teknoloji & Startup Mentoru",
      rating: "5.0",
      reviews: "85+",
      tags: ["Teknoloji", "Startup"],
    },
    {
      name: "Zeynep Kaya",
      title: "Mülakat & CV Uzmanı",
      rating: "4.8",
      reviews: "200+",
      tags: ["Mülakat", "CV"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          HERO
      ========================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Trust badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-sm font-semibold text-red-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Doğrulanmış Platform · Hedef Bazlı Takip
            </div>
          </div>

          {/* Persona switch */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-orange-200 bg-white p-1 shadow-sm">
              {personas.map((p) => {
                const Icon = p.icon;
                const active = p.key === persona;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow"
                        : "text-gray-700 hover:bg-orange-50"
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
          <div className="mt-10 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
              Potansiyelini{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Zirveye Taşı
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {personaCopy.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={onMatch}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white text-lg h-14 px-8 rounded-xl shadow-lg"
              >
                Eşleş <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Link to="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white border-2 border-orange-200 text-gray-700 text-lg h-14 px-8 rounded-xl"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>

            {/* Live stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                Online Koç <span className="font-black">33</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                Bugün Eşleşme <span className="font-black">146</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                Son 1 Saatte <span className="font-black">18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          QUICK MATCH
      ========================= */}
      <section className="relative z-10 -mt-10 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-orange-200 rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Hedef
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-12 rounded-xl border border-orange-200 px-4"
                >
                  <option value="interview">Mülakat</option>
                  <option value="career">Kariyer Planı</option>
                  <option value="promotion">Terfi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Seviye
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-12 rounded-xl border border-orange-200 px-4"
                >
                  <option value="student">Öğrenci / Yeni Mezun</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Dil
                </label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full h-12 rounded-xl border border-orange-200 px-4"
                >
                  <option value="tr">TR</option>
                  <option value="en">EN</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={onMatch}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold"
                >
                  Eşleş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURED COACHES
      ========================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Öne Çıkan Koçlar
              </h2>
              <p className="text-gray-600 mt-2">
                En yüksek puanlı ve en çok tercih edilen koçlar
              </p>
            </div>
            <Link to="/coaches">
              <Button variant="outline">Tümünü Gör</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {coach.name}
                </h3>
                <p className="text-sm text-gray-500">{coach.title}</p>

                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{coach.rating}</span>
                  <span className="text-gray-400">
                    ({coach.reviews} yorum)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {coach.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Doğrulanmış
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          2025 INSIGHT
      ========================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            2025’te Kariyer Gelişimi Nasıl Kazandırıyor?
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            2025 itibarıyla bireysel koçluk alan profesyoneller, almayanlara göre
            daha hızlı terfi ediyor, daha yüksek maaş artışı yakalıyor ve iş
            değişimlerinde avantaj sağlıyor.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-orange-600">%37</div>
              <p className="mt-2 text-gray-600">
                Daha hızlı terfi oranı
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-red-600">%42</div>
              <p className="mt-2 text-gray-600">
                Maaş artışı avantajı
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-green-600">%58</div>
              <p className="mt-2 text-gray-600">
                İş değiştirmede başarı
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
