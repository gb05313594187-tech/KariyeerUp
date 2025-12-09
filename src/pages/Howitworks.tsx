// src/pages/Howitworks.tsx

import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  UserCircle2,
  CalendarCheck2,
  LineChart,
  ShieldCheck,
  Star,
  Users,
  Briefcase,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-28 lg:pb-24">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Nasıl Çalışır?
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
                Kariyer Koçuna Ulaşmanın{" "}
                <span className="text-emerald-400">En Kolay Yolu</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-6">
                3 basit adımda koçunu bul, seansını planla ve gelişimini ölç.
                Hiçbir gereksiz karmaşa yok, sadece odaklı ilerleme.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Hemen Başla
                </Link>
                <Link
                  to="/coaches"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900/60 transition"
                >
                  Koçları İncele
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-400">
                Apple gibi sade, net ve odaklı: her adımın ne işe yaradığını tam
                olarak bilerek ilerlersin.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Adımda Kariyeer Deneyimi */}
        <section className="border-b border-slate-800 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-start gap-10 mb-8">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                  3 Adımda Kariyeer Deneyimi
                </h2>
                <p className="text-slate-300 text-sm sm:text-base">
                  Kayıt ol, koçunu seç, seansını planla ve ilerlemeni takip et.
                  Hepsi tek bir sade ve akıcı deneyim içinde.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Adım 1 */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 border border-emerald-500/40">
                    1
                  </span>
                  <UserCircle2 className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Profilini Oluştur
                </h3>
                <p className="text-sm text-slate-300 mb-3">
                  Kısa bir kayıt formu ile kariyer hedeflerini, sektörünü ve
                  deneyim seviyeni belirt. Sadece birkaç dakikanı alır.
                </p>
                <p className="text-xs text-slate-400 mt-auto">
                  Böylece sistem sana en uygun koçları öne çıkarır.
                </p>
              </div>

              {/* Adım 2 */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 border border-emerald-500/40">
                    2
                  </span>
                  <CalendarCheck2 className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Koçunu Seç &amp; Seans Planla
                </h3>
                <p className="text-sm text-slate-300 mb-3">
                  Uzmanlık alanı, fiyat ve değerlendirmelere göre koçunu seç.
                  Uygun saatleri gör ve tek tıkla online seans oluştur.
                </p>
                <p className="text-xs text-slate-400 mt-auto">
                  Tüm süreç şeffaf, sürpriz yok. Ne alacağını, ne ödeyeceğini
                  baştan bilirsin.
                </p>
              </div>

              {/* Adım 3 */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 border border-emerald-500/40">
                    3
                  </span>
                  <LineChart className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Gelişimini Takip Et
                </h3>
                <p className="text-sm text-slate-300 mb-3">
                  Her seans sonrası notlarını kaydet, hedeflerini güncelle ve
                  ilerlemeni temiz bir dashboard üzerinden takip et.
                </p>
                <p className="text-xs text-slate-400 mt-auto">
                  Kariyer yolculuğunu somut verilerle görmek için tasarlandı.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Neden Kariyeer'e Güvenebilirsin? */}
        <section className="border-b border-slate-800 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr] items-start">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                  Neden Kariyeer&apos;e Güvenebilirsin?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mb-5 max-w-xl">
                  Amacımız sadece randevu platformu olmak değil; kariyer
                  yolculuğunu uçtan uca tasarlayan uzun vadeli bir partner
                  olmak.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-500/10 p-1.5 border border-emerald-500/40">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Akredite koç ağı
                      </p>
                      <p className="text-xs text-slate-400">
                        ICF veya ulusal akreditasyona sahip koçlar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-500/10 p-1.5 border border-emerald-500/40">
                      <Star className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Gerçek değerlendirmeler
                      </p>
                      <p className="text-xs text-slate-400">
                        Her seans sonrası gerçek kullanıcı yorumları.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-500/10 p-1.5 border border-emerald-500/40">
                      <Briefcase className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Şeffaf fiyatlandırma
                      </p>
                      <p className="text-xs text-slate-400">
                        Gizli ücret yok, tüm ücretler seans öncesi net.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-500/10 p-1.5 border border-emerald-500/40">
                      <Users className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Güvenli altyapı
                      </p>
                      <p className="text-xs text-slate-400">
                        Veri güvenliği ve KVKK uyumlu teknoloji altyapısı.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                        Tamamlanan seans
                      </dt>
                      <dd className="text-2xl font-semibold text-slate-50">
                        15k+
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                        Ortalama puan
                      </dt>
                      <dd className="text-2xl font-semibold text-emerald-400 flex items-center gap-1">
                        4.9
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                        Onaylı koç &amp; mentor
                      </dt>
                      <dd className="text-2xl font-semibold text-slate-50">
                        500+
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                        Farklı sektör
                      </dt>
                      <dd className="text-2xl font-semibold text-slate-50">
                        30+
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-200 mb-3">
                    Hazırsan, biz de hazırız.
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    İster ilk işine başlayacak ol, ister C-level hedefle; senin
                    için doğru koç ve doğru hızda bir yol haritası tasarlıyoruz.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/auth"
                      className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400 transition"
                    >
                      Hemen Ücretsiz Kayıt Ol
                    </Link>
                    <Link
                      to="/coaches"
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900/60 transition"
                    >
                      Koç Listesini Gör
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
