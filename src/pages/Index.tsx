// src/pages/Index.tsx
// @ts-nocheck
import { useState } from "react";
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
  Sparkles,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // Persona: Kullanıcı / Koç / Şirket
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

  // Match filters
  const [goal, setGoal] = useState("interview");
  const [level, setLevel] = useState("mid");
  const [lang, setLang] = useState("tr");

  const onMatch = () => {
    const qs = new URLSearchParams({ goal, level, lang });
    navigate(`/coaches?${qs.toString()}`);
  };

  // ✅ DEMO FORM (Şirket seçilince gösterilecek)
  const [demoCompanyName, setDemoCompanyName] = useState("");
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPhone, setDemoPhone] = useState("");
  const [demoTeamSize, setDemoTeamSize] = useState("1-10");
  const [demoNeed, setDemoNeed] = useState("Mülakat");
  const [demoStartPlan, setDemoStartPlan] = useState("Bu ay"); // ✅ yeni
  const [demoNote, setDemoNote] = useState("");

  const onDemoSubmit = (e: any) => {
    e.preventDefault();
    // Demo amaçlı: şu an sadece kurumsal panele yönlendiriyoruz.
    // Sen DB’ye yazmak istersen burayı kendi mevcut insert akışına bağlarsın.
    navigate("/corporate/dashboard");
  };

  // Featured coaches (statik vitrin)
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
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Trust */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-sm font-semibold text-red-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Doğrulanmış Platform · Hedef Bazlı Takip
            </div>
          </div>

          {/* Persona */}
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

          {/* Title */}
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

            {/* ✅ SADECE KOÇTA: HERO ALTINA GELİR / ÖLÇEK / KURUMSAL X2-X3 PARAGRAFI (EKLENDİ) */}
            {persona === "coach" ? (
              <p className="mt-4 text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kariyeer, koçlar için zamandan bağımsız ve ölçeklenebilir bir
                gelir modeli sunar. Programlar esnek ilerler; ana işinle paralel
                yürütülebilir veya tamamen profesyonel bir kanala
                dönüştürülebilir. Bireysel seanslar düzenli kazanç sağlarken,
                kurumsal iş birlikleriyle gelir 2–3 katına çıkabilir. Talep,
                eşleşme ve seans yönetimi tek panelden ilerler. Sen yalnızca
                uzmanlığına odaklanırsın.
              </p>
            ) : null}

            {/* CTA */}
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

            {/* ✅ SADECE KOÇTA: NET SÜREÇ BLOĞU (EKLENDİ) */}
            {persona === "coach" ? (
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="rounded-2xl border border-orange-200 bg-white shadow-sm px-5 py-4">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-gray-800">
                    <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                      Başvur
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                      Doğrulama
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                      Profil yayında
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                      İlk talep
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                      İlk seans
                    </span>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm text-gray-700">
                    <div className="rounded-xl border bg-gray-50 px-4 py-3">
                      Ödeme güvencesi platform üzerinden sağlanır.
                    </div>
                    <div className="rounded-xl border bg-gray-50 px-4 py-3">
                      Doğrulama rozetiyle görünürlüğün artar.
                    </div>
                    <div className="rounded-xl border bg-gray-50 px-4 py-3">
                      Talep, eşleşme ve seans süreci tek panelden yönetilir.
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Inline stats */}
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

      {/* QUICK MATCH */}
      <section className="relative z-10 -mt-10 pb-14">
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
                  <option value="job_change">İş Değiştirme</option>
                  <option value="salary">Maaş Pazarlığı</option>
                  <option value="cv">CV / LinkedIn</option>
                  <option value="performance">Performans Gelişimi</option>
                  <option value="leadership">Liderlik</option>
                  <option value="confidence">Özgüven & İletişim</option>
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

          {/* mini note */}
          <div className="mt-4 text-center text-xs text-gray-500">
            İpucu: “Öne Çıkan Koçlar” alanı premium slot olarak satılabilir.
          </div>
        </div>
      </section>

      {/* ✅ SADECE KOÇTA: GLOBAL DEĞER ÖNERİSİ + KOMİSYON + ÖNE ÇIKMA (EKLENDİ) */}
      {persona === "coach" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                    <Briefcase className="h-4 w-4" />
                    Koçlar için Global Sistem
                  </div>

                  <h3 className="mt-3 text-2xl font-black text-gray-900">
                    Danışan bul, seanslarını yönet, geliri büyüt
                  </h3>

                  <p className="mt-2 text-gray-600 max-w-3xl">
                    Kariyeer; koçların doğru hedefte, doğru danışanla eşleşmesini
                    ve tüm süreci tek yerden yönetmesini sağlar: profil
                    görünürlüğü → talep/eşleşme → seans → takip/rapor → gelir.
                  </p>

                  <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        Daha çok görünürlük
                      </div>
                      <div className="mt-1 text-gray-600">
                        Hedef/rol bazlı aramalarda listelenme + doğrulama rozeti
                      </div>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        Tek panel yönetim
                      </div>
                      <div className="mt-1 text-gray-600">
                        Seanslar, takvim, talepler, gelir ve performans takibi
                      </div>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        Global ölçek
                      </div>
                      <div className="mt-1 text-gray-600">
                        Dil/ülke kırılımı ile uluslararası danışan akışı
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                      Komisyon: İlk 50 koç için %10 (ilk 6 ay)
                    </span>
                    <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                      Sonrasında standart komisyon: %20
                    </span>
                    <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                      Öne Çıkan Koçlar: ana sayfa görünürlüğü (ekstra ücretli)
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Not: “Öne Çıkan Koçlar” alanı sponsorlu vitrindir. İsteyen
                    koçlar ek ücret ile ana sayfada daha görünür olur.
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Button
                    className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-8 hover:brightness-110"
                    onClick={() => navigate("/coach/application")}
                  >
                    Koç Olarak Başvur <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-orange-200"
                    onClick={() => navigate("/coaches")}
                  >
                    Koçları Görüntüle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ SADECE ŞİRKETTE: DEMO FORM'DAN ÖNCE KURUMSAL AÇIKLAMA BLOĞU (BUTONLAR KALDIRILDI) */}
      {persona === "company" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  Kurumsal Program Mantığı
                </div>

                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  Koçluk, ekip performansına dönüşsün
                </h3>

                <p className="mt-2 text-gray-600 max-w-3xl">
                  Kurumsal tarafta amaç “seans satmak” değil; ekip hedeflerini
                  doğru koçlarla eşleştirip, ilerlemeyi görünür hale getirmek.
                  Süreç; ihtiyaç tanımı → koç eşleşmesi → seans akışı →
                  takip/raporlama şeklinde ilerler.
                </p>

                <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">
                      Hedef & kapsam
                    </div>
                    <div className="mt-1 text-gray-600">
                      Rol/level bazlı program planı
                    </div>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">
                      Doğru koç havuzu
                    </div>
                    <div className="mt-1 text-gray-600">
                      Uzmanlık + doğrulama katmanı
                    </div>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">
                      Takip & görünürlük
                    </div>
                    <div className="mt-1 text-gray-600">
                      Raporlanabilir çıktı (mail / PDF)
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                    SLA: 24 saat içinde dönüş
                  </span>
                  <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                    Pilot: 2 haftada ilk ölçüm raporu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ ŞİRKET SEÇİLİNCE: DEMO FORM (ÖNE ÇIKAN KOÇLAR'DAN ÖNCE) — BUTONLAR KALDIRILDI, ZAMAN PLANI EKLENDİ */}
      {persona === "company" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                  <Building2 className="h-4 w-4" />
                  Kurumsal Demo Talebi
                </div>
                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  Ekibin için koçluk programını başlatalım
                </h3>
                <p className="mt-2 text-gray-600">
                  Formu doldur, hedeflerine uygun planı çıkaralım ve ilk raporu
                  paylaşalım.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
                    SLA: 24 saat içinde dönüş
                  </span>
                  <span className="text-xs rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
                    Pilot: 2 haftada ilk ölçüm raporu
                  </span>
                </div>
              </div>

              <form onSubmit={onDemoSubmit} className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Şirket Adı
                    </label>
                    <input
                      value={demoCompanyName}
                      onChange={(e) => setDemoCompanyName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="Örn: ABC Teknoloji"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Yetkili Ad Soyad
                    </label>
                    <input
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="Örn: Ayşe Yılmaz"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      E-posta
                    </label>
                    <input
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="ornek@firma.com"
                      type="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Telefon
                    </label>
                    <input
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="05xx xxx xx xx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Ekip Büyüklüğü
                    </label>
                    <select
                      value={demoTeamSize}
                      onChange={(e) => setDemoTeamSize(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Öncelikli İhtiyaç
                    </label>
                    <select
                      value={demoNeed}
                      onChange={(e) => setDemoNeed(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="Mülakat">Mülakat</option>
                      <option value="Kariyer Planı">Kariyer Planı</option>
                      <option value="Liderlik">Liderlik</option>
                      <option value="Performans">Performans</option>
                      <option value="CV / LinkedIn">CV / LinkedIn</option>
                    </select>
                  </div>

                  {/* ✅ Başlangıç hedefi (zaman planı) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Başlangıç hedefi
                    </label>
                    <select
                      value={demoStartPlan}
                      onChange={(e) => setDemoStartPlan(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="Bu hafta">Bu hafta</option>
                      <option value="Bu ay">Bu ay</option>
                      <option value="Q1">Q1</option>
                    </select>
                    <div className="mt-2 text-xs text-gray-500">
                      Gönderince 24 saat içinde dönüş yapıp planı netleştiririz.
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Not (opsiyonel)
                    </label>
                    <textarea
                      value={demoNote}
                      onChange={(e) => setDemoNote(e.target.value)}
                      className="w-full min-h-[110px] rounded-xl border border-orange-200 px-4 py-3"
                      placeholder="Kısa bilgi: ekip hedefi, rol dağılımı, tarih aralığı..."
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-xs text-gray-500">
                    Gönderim sonrası: ihtiyaç haritası → koç eşleşmesi → pilot →
                    mail/PDF raporu (isteğe bağlı sunum).
                  </div>

                  <Button
                    type="submit"
                    className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-8 hover:brightness-110"
                  >
                    Demo Talebi Gönder <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ ÖNE ÇIKAN KOÇLAR (EKLENDİ / KORUNDU) */}
      <section className="py-18 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                <Sparkles className="h-4 w-4" />
                Sponsorlu Alan / Premium Slot
              </div>
              <h2 className="mt-3 text-3xl font-black text-gray-900">
                Öne Çıkan Koçlar
              </h2>
              <p className="mt-2 text-gray-600">
                En çok tercih edilen uzmanlar. (Bu alana girmek ücretli olabilir.)
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/pricing">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  Premium’a Geç
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="rounded-xl">
                  Tüm Koçlar
                </Button>
              </Link>
            </div>
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

      {/* 2025 BLOĞU (BURADA) */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            2025’te Ne Problemi Çözüyoruz?
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Kariyer belirsizliği, mülakat performansı ve “hangi yola gideceğim?”
            problemi. Kariyeer, hedef bazlı eşleşme ve takip ile bunu ölçülebilir
            hale getirir.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-orange-600">%37</div>
              <p className="mt-2 text-gray-600">Daha hızlı terfi etkisi</p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-red-600">%42</div>
              <p className="mt-2 text-gray-600">Maaş artışı avantajı</p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-green-600">%58</div>
              <p className="mt-2 text-gray-600">İş değiştirmede başarı</p>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link to="/coaches">
              <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white hover:brightness-110">
                Koçları İncele
              </Button>
            </Link>
            <Link to="/for-companies">
              <Button variant="outline" className="rounded-xl">
                Kurumsal Çözümler
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
// src/pages/Index.tsx
// @ts-nocheck
import { useState } from "react";
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
  Sparkles,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  // Persona: Kullanıcı / Koç / Şirket
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

  // Match filters
  const [goal, setGoal] = useState("interview");
  const [level, setLevel] = useState("mid");
  const [lang, setLang] = useState("tr");

  const onMatch = () => {
    const qs = new URLSearchParams({ goal, level, lang });
    navigate(`/coaches?${qs.toString()}`);
  };

  // ✅ DEMO FORM (Şirket seçilince gösterilecek)
  const [demoCompanyName, setDemoCompanyName] = useState("");
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPhone, setDemoPhone] = useState("");
  const [demoTeamSize, setDemoTeamSize] = useState("1-10");
  const [demoNeed, setDemoNeed] = useState("Mülakat");
  const [demoStartPlan, setDemoStartPlan] = useState("Bu ay"); // ✅ yeni
  const [demoNote, setDemoNote] = useState("");

  const onDemoSubmit = (e: any) => {
    e.preventDefault();
    // Demo amaçlı: şu an sadece kurumsal panele yönlendiriyoruz.
    // Sen DB’ye yazmak istersen burayı kendi mevcut insert akışına bağlarsın.
    navigate("/corporate/dashboard");
  };

  // Featured coaches (statik vitrin)
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
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Trust */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-sm font-semibold text-red-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Doğrulanmış Platform · Hedef Bazlı Takip
            </div>
          </div>

          {/* Persona */}
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

          {/* Title */}
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

            {/* ✅ SADECE KOÇTA: HERO ALTINA GELİR / ÖLÇEK / KURUMSAL X2-X3 PARAGRAFI (EKLENDİ) */}
            {persona === "coach" ? (
              <p className="mt-4 text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kariyeer, koçlar için zamandan bağımsız ve ölçeklenebilir bir
                gelir modeli sunar. Programlar esnek ilerler; ana işinle paralel
                yürütülebilir veya tamamen profesyonel bir kanala
                dönüştürülebilir. Bireysel seanslar düzenli kazanç sağlarken,
                kurumsal iş birlikleriyle gelir 2–3 katına çıkabilir. Talep,
                eşleşme ve seans yönetimi tek panelden ilerler. Sen yalnızca
                uzmanlığına odaklanırsın.
              </p>
            ) : null}

            {/* CTA */}
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

            {/* Inline stats */}
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

      {/* QUICK MATCH */}
      <section className="relative z-10 -mt-10 pb-14">
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
                  <option value="job_change">İş Değiştirme</option>
                  <option value="salary">Maaş Pazarlığı</option>
                  <option value="cv">CV / LinkedIn</option>
                  <option value="performance">Performans Gelişimi</option>
                  <option value="leadership">Liderlik</option>
                  <option value="confidence">Özgüven & İletişim</option>
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

          {/* mini note */}
          <div className="mt-4 text-center text-xs text-gray-500">
            İpucu: “Öne Çıkan Koçlar” alanı premium slot olarak satılabilir.
          </div>
        </div>
      </section>

      {/* ✅ SADECE KOÇTA: GLOBAL DEĞER ÖNERİSİ + KOMİSYON + ÖNE ÇIKMA (EKLENDİ) */}
      {persona === "coach" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                    <Briefcase className="h-4 w-4" />
                    Koçlar için Global Sistem
                  </div>

                  <h3 className="mt-3 text-2xl font-black text-gray-900">
                    Danışan bul, seanslarını yönet, geliri büyüt
                  </h3>

                  <p className="mt-2 text-gray-600 max-w-3xl">
                    Kariyeer; koçların doğru hedefte, doğru danışanla eşleşmesini ve tüm süreci tek yerden yönetmesini sağlar:
                    profil görünürlüğü → talep/eşleşme → seans → takip/rapor → gelir.
                  </p>

                  <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        Daha çok görünürlük
                      </div>
                      <div className="mt-1 text-gray-600">
                        Hedef/rol bazlı aramalarda listelenme + doğrulama rozeti
                      </div>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        Tek panel yönetim
                      </div>
                      <div className="mt-1 text-gray-600">
                        Seanslar, takvim, talepler, gelir ve performans takibi
                      </div>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        Global ölçek
                      </div>
                      <div className="mt-1 text-gray-600">
                        Dil/ülke kırılımı ile uluslararası danışan akışı
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                      Komisyon: İlk 50 koç için %10 (ilk 6 ay)
                    </span>
                    <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                      Sonrasında standart komisyon: %20
                    </span>
                    <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                      Öne Çıkan Koçlar: ana sayfa görünürlüğü (ekstra ücretli)
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Not: “Öne Çıkan Koçlar” alanı sponsorlu vitrindir. İsteyen
                    koçlar ek ücret ile ana sayfada daha görünür olur.
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Button
                    className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-8 hover:brightness-110"
                    onClick={() => navigate("/coach/application")}
                  >
                    Koç Olarak Başvur{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-orange-200"
                    onClick={() => navigate("/coaches")}
                  >
                    Koçları Görüntüle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ SADECE ŞİRKETTE: DEMO FORM'DAN ÖNCE KURUMSAL AÇIKLAMA BLOĞU (BUTONLAR KALDIRILDI) */}
      {persona === "company" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  Kurumsal Program Mantığı
                </div>

                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  Koçluk, ekip performansına dönüşsün
                </h3>

                <p className="mt-2 text-gray-600 max-w-3xl">
                  Kurumsal tarafta amaç “seans satmak” değil; ekip hedeflerini
                  doğru koçlarla eşleştirip, ilerlemeyi görünür hale getirmek.
                  Süreç; ihtiyaç tanımı → koç eşleşmesi → seans akışı →
                  takip/raporlama şeklinde ilerler.
                </p>

                <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">Hedef & kapsam</div>
                    <div className="mt-1 text-gray-600">
                      Rol/level bazlı program planı
                    </div>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">
                      Doğru koç havuzu
                    </div>
                    <div className="mt-1 text-gray-600">
                      Uzmanlık + doğrulama katmanı
                    </div>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">
                      Takip & görünürlük
                    </div>
                    <div className="mt-1 text-gray-600">
                      Raporlanabilir çıktı (mail / PDF)
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                    SLA: 24 saat içinde dönüş
                  </span>
                  <span className="text-xs rounded-full border bg-white px-3 py-1 text-gray-700">
                    Pilot: 2 haftada ilk ölçüm raporu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ ŞİRKET SEÇİLİNCE: DEMO FORM (ÖNE ÇIKAN KOÇLAR'DAN ÖNCE) — BUTONLAR KALDIRILDI, ZAMAN PLANI EKLENDİ */}
      {persona === "company" ? (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-orange-200 bg-white shadow-lg p-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                  <Building2 className="h-4 w-4" />
                  Kurumsal Demo Talebi
                </div>
                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  Ekibin için koçluk programını başlatalım
                </h3>
                <p className="mt-2 text-gray-600">
                  Formu doldur, hedeflerine uygun planı çıkaralım ve ilk raporu
                  paylaşalım.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
                    SLA: 24 saat içinde dönüş
                  </span>
                  <span className="text-xs rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
                    Pilot: 2 haftada ilk ölçüm raporu
                  </span>
                </div>
              </div>

              <form onSubmit={onDemoSubmit} className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Şirket Adı
                    </label>
                    <input
                      value={demoCompanyName}
                      onChange={(e) => setDemoCompanyName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="Örn: ABC Teknoloji"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Yetkili Ad Soyad
                    </label>
                    <input
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="Örn: Ayşe Yılmaz"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      E-posta
                    </label>
                    <input
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="ornek@firma.com"
                      type="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Telefon
                    </label>
                    <input
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                      placeholder="05xx xxx xx xx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Ekip Büyüklüğü
                    </label>
                    <select
                      value={demoTeamSize}
                      onChange={(e) => setDemoTeamSize(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Öncelikli İhtiyaç
                    </label>
                    <select
                      value={demoNeed}
                      onChange={(e) => setDemoNeed(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="Mülakat">Mülakat</option>
                      <option value="Kariyer Planı">Kariyer Planı</option>
                      <option value="Liderlik">Liderlik</option>
                      <option value="Performans">Performans</option>
                      <option value="CV / LinkedIn">CV / LinkedIn</option>
                    </select>
                  </div>

                  {/* ✅ Başlangıç hedefi (zaman planı) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Başlangıç hedefi
                    </label>
                    <select
                      value={demoStartPlan}
                      onChange={(e) => setDemoStartPlan(e.target.value)}
                      className="w-full h-12 rounded-xl border border-orange-200 px-4"
                    >
                      <option value="Bu hafta">Bu hafta</option>
                      <option value="Bu ay">Bu ay</option>
                      <option value="Q1">Q1</option>
                    </select>
                    <div className="mt-2 text-xs text-gray-500">
                      Gönderince 24 saat içinde dönüş yapıp planı netleştiririz.
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Not (opsiyonel)
                    </label>
                    <textarea
                      value={demoNote}
                      onChange={(e) => setDemoNote(e.target.value)}
                      className="w-full min-h-[110px] rounded-xl border border-orange-200 px-4 py-3"
                      placeholder="Kısa bilgi: ekip hedefi, rol dağılımı, tarih aralığı..."
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-xs text-gray-500">
                    Gönderim sonrası: ihtiyaç haritası → koç eşleşmesi → pilot →
                    mail/PDF raporu (isteğe bağlı sunum).
                  </div>

                  <Button
                    type="submit"
                    className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold px-8 hover:brightness-110"
                  >
                    Demo Talebi Gönder <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ ÖNE ÇIKAN KOÇLAR (EKLENDİ / KORUNDU) */}
      <section className="py-18 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-xs font-bold text-orange-700">
                <Sparkles className="h-4 w-4" />
                Sponsorlu Alan / Premium Slot
              </div>
              <h2 className="mt-3 text-3xl font-black text-gray-900">
                Öne Çıkan Koçlar
              </h2>
              <p className="mt-2 text-gray-600">
                En çok tercih edilen uzmanlar. (Bu alana girmek ücretli olabilir.)
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/pricing">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  Premium’a Geç
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="rounded-xl">
                  Tüm Koçlar
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-gray-900">{coach.name}</h3>
                <p className="text-sm text-gray-500">{coach.title}</p>

                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{coach.rating}</span>
                  <span className="text-gray-400">({coach.reviews} yorum)</span>
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

      {/* 2025 BLOĞU (BURADA) */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            2025’te Ne Problemi Çözüyoruz?
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Kariyer belirsizliği, mülakat performansı ve “hangi yola gideceğim?”
            problemi. Kariyeer, hedef bazlı eşleşme ve takip ile bunu ölçülebilir
            hale getirir.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-orange-600">%37</div>
              <p className="mt-2 text-gray-600">Daha hızlı terfi etkisi</p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-red-600">%42</div>
              <p className="mt-2 text-gray-600">Maaş artışı avantajı</p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-200">
              <div className="text-4xl font-black text-green-600">%58</div>
              <p className="mt-2 text-gray-600">İş değiştirmede başarı</p>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link to="/coaches">
              <Button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white hover:brightness-110">
                Koçları İncele
              </Button>
            </Link>
            <Link to="/for-companies">
              <Button variant="outline" className="rounded-xl">
                Kurumsal Çözümler
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
