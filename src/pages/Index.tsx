// src/pages/Index.tsx
// @ts-nocheck
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF1EC] via-[#FFE6DC] to-[#FFF1EC]">
      {/* =========================
          HERO – SINGLE SURFACE
      ========================= */}
      <section className="pt-28 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* TEK ANA PANEL */}
          <div className="rounded-[36px] bg-gradient-to-br from-white/90 to-white/80 backdrop-blur px-8 md:px-16 py-20 shadow-[0_40px_120px_-60px_rgba(234,88,12,0.45)]">
            {/* Trust */}
            <div className="flex justify-center mb-8">
              <div className="px-5 py-2 rounded-full text-sm font-semibold text-red-600 bg-red-100/70">
                ● Doğrulanmış Platform · Hedef Bazlı Takip
              </div>
            </div>

            {/* PERSONA */}
            <div className="flex justify-center mb-12">
              <div className="flex bg-red-50 rounded-2xl p-1 gap-1">
                {[
                  { label: "Öğrenci", icon: GraduationCap },
                  { label: "Kullanıcı", icon: Users },
                  { label: "Koç", icon: Users },
                  { label: "Şirket", icon: Users },
                ].map((p, i) => (
                  <button
                    key={i}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition
                    ${
                      i === 0
                        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow"
                        : "text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <p.icon className="h-4 w-4" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* HEADLINE */}
            <h1 className="text-center text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Potansiyelini{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
                Zirveye Taşı
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-center text-lg text-gray-700">
              Öğrenci, junior, mid veya yönetici olman fark etmez.  
              Doğru koçla hedefini netleştir, gelişimini ölç, hızlan.
            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-10 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white text-lg"
                onClick={() => navigate("/coaches")}
              >
                Eşleş <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Link to="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-xl text-lg border-red-300 text-red-700"
                >
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>

            {/* INLINE STATS – NO BOX */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-800">
              <InlineStat
                icon={<Users className="h-4 w-4 text-green-600" />}
                label="Online Koç"
                value="33"
              />
              <InlineStat
                icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
                label="Bugün Eşleşme"
                value="146"
              />
              <InlineStat
                icon={<Clock className="h-4 w-4 text-red-600" />}
                label="Son 1 Saatte"
                value="18"
              />
            </div>

            {/* QUICK MATCH – TEK BAR */}
            <div className="mt-14">
              <div className="flex flex-wrap gap-4 items-center justify-between bg-red-50/60 rounded-2xl p-4">
                <select className="rounded-xl px-4 py-3 font-semibold text-sm border border-red-200 bg-white">
                  <option>Hedef: Mülakat</option>
                </select>
                <select className="rounded-xl px-4 py-3 font-semibold text-sm border border-red-200 bg-white">
                  <option>Seviye: Öğrenci / Junior / Mid</option>
                </select>
                <select className="rounded-xl px-4 py-3 font-semibold text-sm border border-red-200 bg-white">
                  <option>Dil: TR</option>
                </select>

                <Button
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white hover:brightness-110"
                  onClick={() => navigate("/coaches")}
                >
                  Eşleş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          2025 GERÇEĞİ
      ========================= */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            2025’te Kariyerler Neden Tıkanıyor?
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            Eğitim var ama yön yok. Deneyim var ama ölçüm yok.
            Kariyeer bu kopukluğu çözer.
          </p>

          <div className="mt-14 grid md:grid-cols-3 gap-10">
            <Reality value="%67" title="Yönsüzlük" />
            <Reality value="%54" title="Yanlış Rehberlik" />
            <Reality value="%72" title="Ölçülemeyen Gelişim" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* HELPERS */

function InlineStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
      <span className="font-black text-gray-900">{value}</span>
    </div>
  );
}

function Reality({ value, title }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
        {value}
      </div>
      <div className="mt-3 font-semibold text-gray-800">{title}</div>
    </div>
  );
}
