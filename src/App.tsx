// src/pages/Howitworks.tsx
// @ts-nocheck

import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
  Building2,
  UserCircle2,
  CalendarCheck2,
  LineChart,
  Sparkles,
  MessageSquare,
  BadgeCheck,
  Lock,
  CreditCard,
  ArrowRight,
} from "lucide-react";

/**
 * ✅ Bu sayfa BİLEREK Navbar/Footer import ETMİYOR.
 * Çünkü projende büyük ihtimalle PublicLayout / Layout zaten Navbar+Footer basıyor.
 * (Çift Navbar/Footer -> runtime crash ihtimali yüksek)
 */
export default function HowItWorks() {
  const steps = [
    {
      no: "01",
      title: "Hedefini belirle",
      desc: "Kısa bir onboarding ile hedefini, sektörünü ve deneyim seviyeni seç. Sistem sana uygun koçları öne çıkarır.",
      icon: UserCircle2,
    },
    {
      no: "02",
      title: "Koçunu seç & seans planla",
      desc: "Uzmanlık, ücret ve değerlendirmelere göre filtrele. Uygun saatleri gör ve tek tıkla talep gönder.",
      icon: CalendarCheck2,
    },
    {
      no: "03",
      title: "Gelişimini takip et",
      desc: "Seans notları, aksiyon planı ve hedef takibiyle ilerlemeni net biçimde gör. Geri bildirim döngüsü oluşur.",
      icon: LineChart,
    },
  ];

  const personas = [
    {
      title: "Bireyler için",
      subtitle: "Kariyerini hızlandır",
      icon: Users,
      bullets: [
        "Doğru koç eşleşmesi (hedef + sektör + seviye)",
        "Şeffaf fiyat / değerlendirme / uzmanlık",
        "Seans sonrası net aksiyon listesi",
        "İlerlemeni takip eden sade panel",
      ],
      ctaText: "Koçları incele",
      ctaHref: "/coaches",
    },
    {
      title: "Koçlar için",
      subtitle: "Görünürlüğünü artır",
      icon: Star,
      bullets: [
        "Profil + uzmanlık alanı ile öne çıkma",
        "Seans taleplerini tek yerden yönetme",
        "Değerlendirmelerle güven inşa etme",
        "Premium / doğrulama rozetleri (opsiyonel)",
      ],
      ctaText: "Koç olarak başvur",
      ctaHref: "/for-coaches",
    },
    {
      title: "Şirketler için",
      subtitle: "Takım gelişimini ölç",
      icon: Building2,
      bullets: [
        "Kurumsal talep & koç havuzuna erişim",
        "Demo / tanışma görüşmeleri",
        "Koçluk programı tasarlama desteği",
        "Kurumsal panelde takip (kapsam genişletilebilir)",
      ],
      ctaText: "Kurumsal çözümler",
      ctaHref: "/for-companies",
    },
  ];

  const trust = [
    {
      title: "Doğrulama & kalite",
      desc: "Koç profilleri başvuru sürecinden geçer. Rozetler ve değerlendirmeler şeffaf şekilde görünür.",
      icon: BadgeCheck,
    },
    {
      title: "Gizlilik",
      desc: "Kullanıcı verileri güvenlik prensiplerine uygun şekilde işlenir. İletişim ve süreçler kayıt altında ilerler.",
      icon: Lock,
    },
    {
      title: "Güvenli ödeme",
      desc: "Ödemeler lisanslı ödeme kuruluşları üzerinden alınır. Kart bilgileri platformda saklanmaz.",
      icon: CreditCard,
    },
    {
      title: "Destek",
      desc: "Sorun yaşarsan hızlı destek kanalıyla çözüm üretiriz. Süreçlerin görünür olması önceliğimiz.",
      icon: MessageSquare,
    },
  ];

  const faqs = [
    {
      q: "Koç seçerken nelere bakmalıyım?",
      a: "Uzmanlık alanı, deneyim, değerlendirme puanı ve yaklaşımına bak. Hedefin netse filtrelerle doğru koçu hızlıca bulursun.",
    },
    {
      q: "Koçlar nasıl listeleniyor?",
      a: "Profil bilgileri, onay durumu, uzmanlık alanı ve kullanıcı değerlendirmeleri gibi sinyallerle sıralama yapılır.",
    },
    {
      q: "İptal / iade nasıl işliyor?",
      a: "Koşullar “İptal ve İade Koşulları” sayfasında belirtilir. Zamanlamaya göre iade politikası değişebilir.",
    },
    {
      q: "Şirket olarak nasıl başlarız?",
      a: "Kurumsal formu doldurursun; ihtiyaç, kapsam ve hedeflere göre koç havuzu ve program seçenekleriyle ilerleriz.",
    },
  ];

  return (
    <main className="bg-white text-slate-900">
      {/* ✅ DEBUG: bunu görüyorsan bu dosya render oluyor */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-xl border border-yellow-300 bg-yellow-100 text-yellow-900 px-4 py-3 text-sm font-semibold">
          HOWITWORKS PAGE RENDER ✅
        </div>
      </div>

      {/* HERO */}
      <section className="mt-6 border-b bg-gradient-to-b from-red-600 via-orange-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-16 sm:pb-14">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Kariyer Koçuna Ulaşmanın
              <br />
              <span className="text-yellow-300">En Kolay Yolu</span>
            </h1>

            <p className="mt-4 text-white/90 text-base sm:text-lg">
              3 basit adımda koçunu bul, seansını planla ve gelişimini ölç.
            </p>

            <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                Hemen Başla
              </Link>
              <Link
                to="/coaches"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Koçları İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top value strip */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700">
                <Sparkles className="h-4 w-4 text-red-600" />
                Net, hızlı, ölçülebilir gelişim
              </p>

              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-900">
                Kariyeer’de süreç karmaşık değil.
                <br className="hidden sm:block" />
                <span className="text-gray-900">3 adım, tek akış.</span>
              </h2>

              <p className="mt-3 text-gray-600 leading-relaxed">
                Doğru koçu bul, seansı planla, aksiyon planınla ilerle. Her adım
                şeffaf, sade ve ölçülebilir.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/coaches"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                  Koçları incele <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  Hemen başla
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border bg-gray-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Güven odaklı deneyim
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Profil doğrulama, değerlendirmeler, şeffaf fiyat ve güvenli
                      ödeme ile uçtan uca kontrollü süreç.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white border p-4">
                    <p className="text-xs text-gray-500">Ortalama memnuniyet</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      4.8/5
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border p-4">
                    <p className="text-xs text-gray-500">Aktif koç havuzu</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      120+
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border p-4">
                    <p className="text-xs text-gray-500">Tamamlanan seans</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      15.000+
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border p-4">
                    <p className="text-xs text-gray-500">Sektör çeşitliliği</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      30+
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  *Rakamlar örnektir; gerçek metrikler canlı olarak panelden yönetilebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Nasıl çalışır?
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Her adımın amacı net: doğru eşleşme, doğru planlama, doğru takip.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                to="/coaches"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
              >
                Koçları incele
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black transition"
              >
                Ücretsiz kayıt ol
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.no}
                className="rounded-2xl border bg-white p-6 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    {s.no}
                  </span>
                  <s.icon className="h-6 w-6 text-gray-700" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {s.desc}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-red-600" />
                  Şeffaf ve ölçülebilir akış
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="border-t bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Kimler için?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Platformu üç ayrı ihtiyaç için tasarladık: birey, koç ve şirket.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {personas.map((p) => (
              <div key={p.title} className="rounded-2xl border bg-white p-6">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gray-900 flex items-center justify-center">
                    <p.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-600">{p.subtitle}</p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    to={p.ctaHref}
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition w-full"
                  >
                    {p.ctaText} <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Güven, kalite ve şeffaflık
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Süreç, sadece “koç bul” değil; doğru deneyim için kontrol noktalarıyla tasarlandı.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <div key={t.title} className="rounded-2xl border bg-white p-6">
                <t.icon className="h-6 w-6 text-gray-900" />
                <h3 className="mt-4 font-semibold text-gray-900">{t.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border bg-gray-50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Hızlı başlamak ister misin?
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Koçları incele veya doğrudan kayıt olup hedefini seç.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/coaches"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                  Koçları incele
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  Ücretsiz kayıt ol
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Sık sorulan sorular
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              En çok gelen soruları burada yanıtladık.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border bg-white p-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-600" />
                  {f.q}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gray-900 p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-sm text-white/80">Son adım</p>
                <h3 className="mt-1 text-2xl font-semibold">
                  Bugün başla, 30 gün sonra farkı gör.
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Hedef → Koç → Seans → Aksiyon planı. Bu kadar net.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition"
                >
                  Ücretsiz kayıt ol <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to="/coaches"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Koçları incele
                </Link>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </div>
      </section>
    </main>
  );
}
