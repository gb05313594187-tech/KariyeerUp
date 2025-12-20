// src/pages/Index.tsx
// @ts-nocheck
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  PlayCircle,
  Users,
  TrendingUp,
  Clock,
  GraduationCap,
  Briefcase,
  Building2,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // =========================
  // Persona (UI only)
  // =========================
  const personas = useMemo(
    () => [
      {
        key: "student",
        label: "Öğrenci",
        icon: GraduationCap,
        title: "Staj & İlk İş İçin",
        subtitle: "CV, mülakat, yön seçimi ve doğru planla hızlı ilerle.",
      },
      {
        key: "user",
        label: "Kullanıcı",
        icon: Users,
        title: "Kariyerin İçin",
        subtitle: "Doğru koçla hedefini netleştir, gelişimini ölç, hızlan.",
      },
      {
        key: "coach",
        label: "Koç",
        icon: Briefcase,
        title: "Koçlar İçin",
        subtitle: "Profilini büyüt, daha fazla danışana ulaş, seanslarını yönet.",
      },
      {
        key: "company",
        label: "Şirket",
        icon: Building2,
        title: "Ekipler İçin",
        subtitle: "Hedef bazlı koçluk programlarıyla ölçülebilir gelişim yarat.",
      },
    ],
    []
  );

  const [persona, setPersona] = useState("user");

  // =========================
  // Quick Match
  // =========================
  const [goal, setGoal] = useState("interview");
  const [level, setLevel] = useState("mid");
  const [lang, setLang] = useState("tr");

  const onMatch = () => {
    const qs = new URLSearchParams({ goal, level, lang });
    navigate(`/coaches?${qs.toString()}`);
  };

  const personaCopy = useMemo(() => {
    const p = personas.find((x) => x.key === persona) || personas[1];
    return p;
  }, [persona, personas]);

  // =========================
  // Featured Coaches (sellable area)
  // =========================
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
          HERO (RED / ORANGE)
      ========================= */}
      <section className="relative overflow-hidden">
        {/* very light brand gradient (NOT pink) */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-24 lg:pb-20">
          {/* top trust line */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-sm font-semibold text-red-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Doğrulanmış Platform · Hedef Bazlı Takip
            </div>
          </div>

          {/* persona tabs */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-orange-200 bg-white p-1 shadow-sm">
              {personas.map((p) => {
                const Icon = p.icon;
                const active = p.key === persona;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
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

          {/* headline */}
          <div className="mt-10 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
              Potansiyelini{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Zirveye Taşı
              </span>
            </h1>

            <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {personaCopy.subtitle}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white text-lg h-14 px-8 rounded-xl shadow-lg shadow-orange-200"
                onClick={onMatch}
              >
                Eşleş <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Link to="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-gray-700 border-2 border-orange-200 hover:border-orange-300 text-lg h-14 px-8 rounded-xl"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-gray-500" /> Nasıl
                  Çalışır?
                </Button>
              </Link>
            </div>

            {/* inline stats (no boxes) */}
            <div className="mt-10 flex flex-wrap justify-center gap-7 text-sm font-semibold text-gray-700">
              <InlineStat
                icon={<Users className="h-4 w-4 text-emerald-600" />}
                label="Online Koç"
                value="33"
              />
              <span className="text-gray-300">•</span>
              <InlineStat
                icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
                label="Bugün Eşleşme"
                value="146"
              />
              <span className="text-gray-300">•</span>
              <InlineStat
                icon={<Clock className="h-4 w-4 text-red-600" />}
                label="Son 1 Saatte"
                value="18"
              />
            </div>
          </div>

          {/* quick match bar (ONE BAR) */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="bg-white border border-orange-200 rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <Select
                  label="Hedef"
                  value={goal}
                  onChange={setGoal}
                  options={[
                    ["interview", "Mülakat"],
                    ["cv", "CV & LinkedIn"],
                    ["internship", "Staj / İlk İş"],
                    ["promotion", "Terfi & Kariyer Planı"],
                    ["leadership", "Liderlik"],
                  ]}
                />
                <Select
                  label="Seviye"
                  value={level}
                  onChange={setLevel}
                  options={[
                    ["student", "Öğrenci"],
                    ["junior", "Junior"],
                    ["mid", "Mid"],
                    ["senior", "Senior"],
                    ["yönetici", "Yönetici"],
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
                <Button
                  className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white"
                  onClick={onMatch}
                >
                  Eşleş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          2025 GERÇEĞİ (BACK)
      ========================= */}
      <section className="py-20 px-4 bg-white border-t">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-4">
            2025 Kariyer Gerçeği
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Neden herkes “kariyerimde sıkıştım” diyor?
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Eğitim var ama yön yok. Deneyim var ama ölçüm yok. Kariyeer bu
            kopukluğu tek akışta çözer: hedef → eşleşme → seans → takip.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
            <RealityCard
              value="%67"
              title="Yönsüzlük"
              desc="İnsanların çoğu hangi beceriyi geliştireceğini netleştiremeden zaman kaybediyor."
            />
            <RealityCard
              value="%54"
              title="Yanlış Rehberlik"
              desc="Özellikle Öğrenci/Junior/Mid segmenti, yanlış yönlendirme yüzünden rota değiştiriyor."
            />
            <RealityCard
              value="%72"
              title="Ölçülemeyen Gelişim"
              desc="Şirketler gelişimi ölçemediği için bütçe harcıyor ama etkiyi göremiyor."
            />
          </div>
        </div>
      </section>

      {/* =========================
          ÖNE ÇIKAN KOÇLAR (BACK)
      ========================= */}
      <section className="py-20 px-4 bg-gradient-to-b from-orange-50 to-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-3">
              Satılabilir Listeleme
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Öne Çıkan Koçlar
            </h2>
            <p className="mt-3 text-gray-600">
              En çok tercih edilen, aktif ve yüksek puanlı koçlar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach, i) => (
              <div
                key={i}
                onClick={() => navigate("/coaches")}
                className="group bg-white border border-orange-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white">
                    Öne Çıkan
                  </span>
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {coach.rating}{" "}
                    <span className="text-gray-400">({coach.reviews})</span>
                  </span>
                </div>

                <div className="mt-4">
                  <div className="font-black text-lg text-gray-900">
                    {coach.name}
                  </div>
                  <div className="text-sm text-gray-600">{coach.title}</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {coach.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-orange-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Doğrulanmış Profil
                  </div>
                  <span className="text-red-600 font-semibold group-hover:translate-x-1 transition-transform">
                    İncele →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-700">
              Koç musun? Bu alan <span className="font-semibold">ücretlidir</span>{" "}
              ve sınırlıdır.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/coach-application">
                <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white h-12 px-7">
                  Öne Çıkmak İstiyorum
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="rounded-xl h-12 px-7 border-orange-200">
                  Tüm Koçları İncele
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   HELPERS
========================= */

function InlineStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
      <span className="font-black text-gray-900">{value}</span>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="w-full border border-orange-200 rounded-xl px-3 py-2 bg-white">
      <div className="text-xs uppercase text-gray-500 font-semibold">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 bg-transparent outline-none text-gray-900 font-semibold"
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

function RealityCard({ value, title, desc }) {
  return (
    <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
      <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
        {value}
      </div>
      <div className="mt-2 font-black text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</div>
    </div>
  );
}
