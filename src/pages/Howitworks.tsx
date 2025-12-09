// src/pages/HowItWorks.tsx
// @ts-nocheck
import {
  ArrowRight,
  Sparkles,
  LineChart,
  Users2,
  ShieldCheck,
  Search,
  Clock,
  Target,
  Star,
  Quote,
  Laptop,
  Check,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-[#fff7f2] to-[#f5f5f7]">
        {/* soft turuncu glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-orange-300/40 blur-3xl" />
          <div className="absolute top-40 left-[-10%] h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:py-24 lg:px-8">
          {/* Sol taraf – metin */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-medium text-orange-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Yeni Nesil Kariyer Platformu
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Potansiyelini
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b4b] via-[#ff7a3c] to-[#ffb347]">
                  Zirve Seviyesine Taşı
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Kariyeer, global standartlarda koçları, mentorları ve gelişim
                programlarını tek bir sade platformda buluşturur.
                <br />
                <span className="font-medium text-slate-800">
                  Bilimsel metotlar + gerçek profesyoneller + akıllı eşleşme.
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ff4b4b] via-[#ff7a3c] to-[#ffb347] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-300/40 transition hover:shadow-lg hover:brightness-110"
                onClick={() => (window.location.href = "/coaches")}
              >
                Koçunu Bul
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-5 py-3 text-sm font-medium text-slate-900 shadow-sm backdrop-blur hover:bg-white"
                onClick={() =>
                  document
                    .getElementById("hw-steps")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Nasıl Çalışır?
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-slate-800">500+ </span>
                şirket çalışanı Kariyeer koçlarıyla çalışıyor.
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-400" />
                <span>
                  Ortalama{" "}
                  <span className="font-semibold text-slate-800">4.9/5</span>{" "}
                  koç puanı
                </span>
              </div>
            </div>
          </div>

          {/* Sağ taraf – görsel mockup */}
          <div className="flex-1">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur">
              {/* üst bar */}
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Gerçek zamanlı eşleşme
                </div>
                <Laptop className="h-4 w-4 text-slate-300" />
              </div>

              {/* içerik */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-r from-[#ffede2] via-[#ffe8d4] to-[#ffd3b8] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-orange-700">
                    Akıllı Koç Eşleşmesi
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Hedeflerin: Terfi + Liderlik + İletişim
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Kariyeer, profiline en uygun 3 koçu saniyeler içinde bulur.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      <Target className="h-3 w-3" />
                      Hedef Uyum
                    </div>
                    <p className="text-lg font-semibold text-slate-900">94%</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Kariyer hedeflerinle uyumlu.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      <Users2 className="h-3 w-3" />
                      Deneyim
                    </div>
                    <p className="text-lg font-semibold text-slate-900">12 Yıl</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Ortalama sektör tecrübesi.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      <Star className="h-3 w-3" />
                      Puan
                    </div>
                    <p className="text-lg font-semibold text-slate-900">4.9</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Gerçek kullanıcı yorumları.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-700">
                      İlk seansını 24 saat içinde planla
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Esnek saatler, online görüntülü görüşme.
                    </p>
                  </div>
                  <button className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-black">
                    Seans Planla
                    <Clock className="ml-1.5 h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          <StatCard
            icon={LineChart}
            label="3 ay içinde anlamlı ilerleme"
            value="%87"
            detail="Kariyeer kullanıcılarının %87'si 12 hafta içinde hedeflerine yaklaşıyor."
          />
          <StatCard
            icon={Users2}
            label="Deneyimli koç ve mentor"
            value="150+"
            detail="Global şirketlerde çalışmış seçili profesyonel koç kadrosu."
          />
          <StatCard
            icon={ShieldCheck}
            label="Güven & gizlilik"
            value="ISO seviyesi"
            detail="Verilerin, kurumsal ölçekli güvenlik standartlarıyla korunur."
          />
        </div>
      </section>

      {/* 3 ADIM – NASIL ÇALIŞIR */}
      <section
        id="hw-steps"
        className="border-b border-slate-200/60 bg-[#fdf7f3]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                3 Adımda Kariyeer
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                Potansiyelini ortaya çıkarmak için karmaşık sistemlere değil,
                net ve sade bir yol haritasına ihtiyacın var.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <StepCard
              index="1"
              title="Hedeflerini Belirle"
              icon={Target}
              text="Profilini oluştur, kariyer hedeflerini seç, hangi alanlarda gelişmek istediğini belirt. Kariyeer buradan senin için kişisel yol haritasını başlatır."
            />
            <StepCard
              index="2"
              title="Uzman Koç ile Eşleş"
              icon={Search}
              text="Akıllı eşleşme motoru, hedeflerin ve geçmişinle en uyumlu koçları saniyeler içinde listeler. Arzu edersen koç profillerini kendin de inceleyebilirsin."
            />
            <StepCard
              index="3"
              title="Planlı Görüş, Ölç, Geliş"
              icon={Clock}
              text="Online seanslarını planla, her görüşmeden sonra aksiyon planını takip et ve ilerlemeni net grafiklerle gör. Gelişim yolculuğun şeffaf ve ölçülebilir."
            />
          </div>
        </div>
      </section>

      {/* CUSTOMER JOURNEY / ZAMAN ÇİZELGESİ */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Kullanıcı Yolculuğu
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Kariyeer, ilk girişinden hedeflerine ulaşana kadar yanındadır.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-10 bottom-10 hidden w-px bg-slate-200 sm:block" />

            <div className="space-y-6">
              {[
                {
                  title: "Kayıt & Profil Oluşturma",
                  text: "Dakikalar içinde profilini tamamla, deneyimini ve hedeflerini belirt.",
                },
                {
                  title: "Eşleşme ve İlk Seans",
                  text: "En uygun koçla eşleş ve ilk online seansını planla.",
                },
                {
                  title: "Kişisel Gelişim Planı",
                  text: "Koçunla birlikte 6–12 haftalık net bir aksiyon planı oluştur.",
                },
                {
                  title: "Düzenli Seanslar & Geri Bildirim",
                  text: "Her görüşmeden sonra yazılı notlar, ödevler ve geri bildirim al.",
                },
                {
                  title: "İlerleme Analitiği",
                  text: "Hedef bazlı dashboard ile ilerlemeni grafikler üzerinden takip et.",
                },
                {
                  title: "Zirveye Taşı",
                  text: "Terfi, iş değişimi, iletişim, liderlik… Ne hedeflediysen, oraya ulaştığını net olarak gör.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex gap-4 rounded-2xl bg-slate-50/70 p-4 sm:ml-6 sm:p-5"
                >
                  <div className="hidden sm:block">
                    <div className="absolute left-0 top-5 h-3 w-3 -translate-x-[7px] rounded-full border-2 border-white bg-orange-500 shadow" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
                      Adım {idx + 1}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEKNOLOJİ & GÜVEN */}
      <section className="border-b border-slate-200/60 bg-[#fef8f3]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Kariyeer’in Teknolojisi
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                Basit görünen arayüzün arkasında, seni en doğru koçlarla
                buluşturan güçlü bir altyapı çalışır.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              icon={Search}
              title="Smart Match Engine™"
              text="Koç profilleri, uzmanlık alanları, kariyer hedeflerin ve davranışsal veriler; hepsi akıllı eşleşme motorunda değerlendirilir."
            />
            <InfoCard
              icon={LineChart}
              title="Mentor Analytics Panel™"
              text="Koçlar için performans ve seans analitiği; senin için ilerleme grafikleri ve net metrikler sunar."
            />
            <InfoCard
              icon={ShieldCheck}
              title="SafeCall™ Görüşme"
              text="Platform içi güvenli video görüşmeler, uçtan uca şifreli iletişim ve KVKK uyumlu altyapı."
            />
          </div>
        </div>
      </section>

      {/* KOÇ SEÇİMİ */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Koçlar Nasıl Seçiliyor?
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Kariyeer’deki her koç, çok aşamalı bir değerlendirme sürecinden
              geçer.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Sertifika ve eğitim doğrulaması (ICF, ICC, NLP vb.)",
              "Sektör deneyimi, pozisyon geçmişi ve referans kontrolleri",
              "Deneme seansı ile koçluk kalitesinin değerlendirilmesi",
              "Kullanıcı puanı 4.8’in altına düşen koçlar için ek kalite süreci",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 text-green-500" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-slate-200/60 bg-[#f5f5f7]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Kariyeer ile Neler Değişti?
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Gerçek kullanıcıların, gerçek kariyer dönüşümleri.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              name="Ayşe • Ürün Yöneticisi"
              text="3 ayda terfi aldım. Koçumla net hedefler koyduk, üst yönetimle iletişimimi tamamen değiştirdik."
            />
            <TestimonialCard
              name="Mehmet • Yeni Mezun"
              text="25 gün içinde ilk işime girdim. CV, LinkedIn ve mülakat provası beraber çalıştık."
            />
            <TestimonialCard
              name="Selin • Yazılım Mühendisi"
              text="Yurt dışı mülakatlarına hazırlanırken, özgüven ve story-telling tarafında çok şey öğrendim."
            />
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Sık Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-4">
            <FaqItem
              question="Koçlar gerçekten sertifikalı mı?"
              answer="Evet. Platforma kabul edilen her koç için sertifika doğrulaması, deneyim analizi ve deneme seansı süreçleri uygulanır."
            />
            <FaqItem
              question="Görüşmeler nasıl gerçekleşiyor?"
              answer="Tüm seanslar platform içi güvenli video altyapısı veya koçun sunduğu onaylı görüntülü görüşme araçlarıyla online yapılır."
            />
            <FaqItem
              question="Verilerim güvende mi?"
              answer="Verilerin, uluslararası güvenlik standartları ve KVKK çerçevesinde şifreli olarak saklanır. Hiçbir bilgin üçüncü kişilerle paylaşılmaz."
            />
            <FaqItem
              question="Şirketim için toplu çözüm alabilir miyim?"
              answer="Evet. İnsan kaynakları ve L&D ekipleri için özel kurumsal paketler sunuyoruz. 'Şirketler İçin' sayfasından bize ulaşabilirsin."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#ff4b4b] via-[#ff7a3c] to-[#ffb347]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-14 text-center text-white sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Şimdi Başla
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Kariyerini bir üst seviyeye taşımak için
              <span className="block font-bold">
                bugün ilk adımı atman yeterli.
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              Koçunu seç, ilk seansını planla, geri kalanını Kariyeer ekosistemine
              bırak.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
              onClick={() => (window.location.href = "/coaches")}
            >
              Koçunu Bul
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center rounded-full border border-white/70 bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              onClick={() => (window.location.href = "/register")}
            >
              Ücretsiz Profil Oluştur
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- Küçük komponentler --- */

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/90 px-5 py-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4 text-orange-500" />
        {label}
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-600 sm:text-sm">{detail}</p>
    </div>
  );
}

function StepCard({ index, title, text, icon: Icon }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-orange-100 bg-white/90 px-5 py-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a3c] to-[#ff4b4b] text-[11px] font-semibold text-white shadow-sm">
            {index}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
            {title}
          </h3>
        </div>
        <Icon className="h-5 w-5 text-orange-400" />
      </div>
      <p className="text-xs text-slate-600 sm:text-sm">{text}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/90 px-5 py-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-orange-50">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-xs text-slate-600 sm:text-sm">{text}</p>
    </div>
  );
}

function TestimonialCard({ name, text }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm">
      <Quote className="mb-3 h-5 w-5 text-orange-300" />
      <p className="text-sm text-slate-700">{text}</p>
      <p className="mt-4 text-xs font-semibold text-slate-900">{name}</p>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-5 sm:py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900">{question}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500">
          <ArrowRight className="h-3 w-3 transition-transform group-open:rotate-90" />
        </span>
      </summary>
      <p className="mt-3 text-xs text-slate-600 sm:text-sm">{answer}</p>
    </details>
  );
}
