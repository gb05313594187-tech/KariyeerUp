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
    onlineCoaches: 30,
    todayMatches: 145,
    plannedSessions: 17,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setLive((p) => ({
        onlineCoaches: Math.max(10, p.onlineCoaches + (Math.random() > 0.5 ? 1 : -1)),
        todayMatches: Math.max(50, p.todayMatches + (Math.random() > 0.5 ? 1 : -1)),
        plannedSessions: Math.max(5, p.plannedSessions + (Math.random() > 0.5 ? 1 : -1)),
      }));
    }, 2500);
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

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section className="relative bg-[#FFF5F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-14 pb-12 text-center">
          {/* Trust line */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-red-200 text-sm font-semibold text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Doğrulanmış Platform • Hedef Bazlı Takip
          </div>

          {/* Persona */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-2xl border bg-white/80 p-1">
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
                          ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
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
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 rounded-xl">
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
            <Card>
              <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center">
                <Select label="Hedef" value={goal} onChange={setGoal} options={[
                  ["interview","Mülakat"],["cv","CV"],["promotion","Terfi"]
                ]}/>
                <Select label="Dil" value={lang} onChange={setLang} options={[
                  ["tr","TR"],["en","EN"],["ar","AR"]
                ]}/>
                <Select label="Seviye" value={level} onChange={setLevel} options={[
                  ["junior","Junior"],["mid","Mid"],["senior","Senior"]
                ]}/>
                <Button onClick={onQuickSearch} className="h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
                  <Search className="mr-2 h-4 w-4" />
                  Eşleş
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= HELPERS ================= */
function Stat({ title, value, color, icon: Icon }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-gray-500 font-semibold">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex-1 border rounded-xl px-3 py-2">
      <div className="text-xs uppercase text-gray-500 font-semibold">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 bg-transparent outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}
