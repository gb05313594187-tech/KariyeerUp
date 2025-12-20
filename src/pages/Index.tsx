// src/pages/Index.tsx
// @ts-nocheck
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export default function Index() {
  return (
    <div className="bg-[#FFF7F4]">
      {/* =========================
          HERO – ONE SURFACE
      ========================= */}
      <section className="pt-24 pb-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[32px] px-8 md:px-14 py-16 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.15)]">
            {/* Trust pill */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold">
                ● Doğrulanmış Platform · Hedef Bazlı Takip
              </div>
            </div>

            {/* Persona */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-gray-100 rounded-2xl p-1">
                {["Kullanıcı", "Koç", "Şirket"].map((item, i) => (
                  <button
                    key={i}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold ${
                      i === 0
                        ? "bg-red-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-center text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Potansiyelini{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Zirveye Taşı
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-center text-lg text-gray-600">
              Global standartlarda koç ve mentorlarla hedefini netleştir,
              planını oluştur, gelişimini ölç ve takip et.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/coaches">
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white text-lg"
                >
                  Koçunu Bul <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-xl text-lg"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>

            {/* INLINE STATS (NO BOXES) */}
            <div className="mt-14 flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-700">
              <StatInline
                icon={<Users className="h-4 w-4 text-green-600" />}
                label="Online Koç"
                value="33"
              />
              <Dot />
              <StatInline
                icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
                label="Bugün Eşleşme"
                value="146"
              />
              <Dot />
              <StatInline
                icon={<Clock className="h-4 w-4 text-red-600" />}
                label="Son 1 Saatte"
                value="18"
              />
            </div>

            {/* QUICK SEARCH – SINGLE BAR */}
            <div className="mt-16">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold">
                  <option>Hedef: Mülakat</option>
                </select>
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold">
                  <option>Dil: TR</option>
                </select>
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold">
                  <option>Seviye: Mid</option>
                </select>
                <Button className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white">
                  Eşleş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          2025 CAREER REALITY
      ========================= */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            2025’te Kariyerler Neden Tıkanıyor?
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Kariyer gelişimi artık rastgele ilerliyor. İnsanlar neyi,
            ne zaman ve kiminle geliştireceğini bilmiyor.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <RealityCard
              value="%67"
              title="Hedef Belirsizliği"
              text="Çalışanların çoğu hangi beceriyi geliştirmesi gerektiğini bilmiyor."
            />
            <RealityCard
              value="%54"
              title="Yanlış Yönlenme"
              text="Junior ve Mid seviye çalışanlar yanlış rehberlikle yön değiştiriyor."
            />
            <RealityCard
              value="%72"
              title="Ölçülemeyen Gelişim"
              text="Şirketler gelişimi ölçemediği için zaman ve bütçe kaybediyor."
            />
          </div>

          <p className="mt-12 text-lg font-semibold text-gray-800">
            Kariyeer, kariyer gelişimini rastgele olmaktan çıkarır.
          </p>
          <p className="text-gray-600">Hedef · Uzman · İlerleme</p>
        </div>
      </section>

      {/* =========================
          FEATURED COACHES (PAID)
      ========================= */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900">
            Öne Çıkan Koçlar
          </h2>
          <p className="mt-3 text-center text-gray-600">
            En çok tercih edilen ve aktif koçlar
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Ayşe Yılmaz", role: "Kariyer & Liderlik", stat: "⭐ 4.9 · Bu hafta 12 seans" },
              { name: "Mehmet Demir", role: "Teknoloji & Startup", stat: "⭐ 5.0 · Bu hafta 9 seans" },
              { name: "Zeynep Kaya", role: "Mülakat & CV", stat: "⭐ 4.8 · Bu hafta 15 seans" },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="text-xs font-bold text-red-600 mb-2">
                  Öne Çıkan
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {c.name}
                </div>
                <div className="text-sm text-gray-600">{c.role}</div>
                <div className="mt-4 text-sm text-gray-500">{c.stat}</div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            Koç musun? Bu alan <strong>ücretlidir</strong> ve sınırlıdır.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================
   SMALL HELPERS
========================= */

function StatInline({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-semibold">{label}</span>
      <span className="font-black text-gray-900">{value}</span>
    </div>
  );
}

function Dot() {
  return <span className="text-gray-300">•</span>;
}

function RealityCard({ value, title, text }) {
  return (
    <div className="text-left bg-gray-50 border border-gray-200 rounded-2xl p-6">
      <div className="text-4xl font-black text-red-600">{value}</div>
      <div className="mt-2 font-bold text-gray-900">{title}</div>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </div>
  );
}
