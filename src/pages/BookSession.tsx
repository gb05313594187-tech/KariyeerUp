// src/pages/BookSession.tsx
// @ts-nocheck
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Shield,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const coachId = searchParams.get("coachId");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // TODO: Buraya Supabase insert + ödeme entegrasyonu gelecek
    alert(
      "Rezervasyon isteğin alındı. Bir sonraki adımda bu formu Supabase'e kaydedip koça ve sana mail/sms gönderebiliriz."
    );
  };

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      {/* HERO */}
      <header className="border-b border-slate-800 bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-4 text-white/90 hover:text-white text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri dön
          </button>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Seansını Planla
          </h1>
          <p className="mt-2 text-sm md:text-base text-red-50 max-w-xl">
            Seçtiğin koç ile sana en uygun tarih ve saati belirle. Kariyeer,
            koçun takvimi, onay süreci ve hatırlatmaları senin yerine yönetir.
          </p>

          {/* Adım göstergesi */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 font-bold">
                1
              </div>
              <span className="font-semibold text-white">
                Koç Seçimi Tamamlandı
              </span>
            </div>

            <span className="h-px w-8 bg-red-200/70" />

            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 border border-white/40 text-white font-semibold">
                2
              </div>
              <span className="font-semibold text-white/90">
                Seans Bilgileri
              </span>
            </div>

            <span className="h-px w-8 bg-red-200/40" />

            <div className="flex items-center gap-2 opacity-60">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40 text-white font-semibold">
                3
              </div>
              <span className="font-semibold text-white/80">
                Ödeme & Onay (yakında)
              </span>
            </div>
          </div>

          {coachId && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 text-[11px] text-red-50 border border-white/15">
              <CheckCircle2 className="w-3 h-3" />
              <span>Seçilen Koç ID: {coachId}</span>
              <span className="text-white/40">
                (İleride burada koç adı & fotoğrafı görünecek)
              </span>
            </div>
          )}
        </div>
      </header>

      {/* MAİN */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="grid md:grid-cols-[minmax(0,2fr),minmax(260px,1fr)] gap-8">
          {/* FORM */}
          <section>
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.45)] space-y-7"
            >
              {/* Tarih */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.12em]">
                  Tarih Seç
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Koçunun takvimine göre sana en uygun günü seç.
                </p>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-700">
                    <Calendar className="w-4 h-4 text-slate-300" />
                  </span>
                  <input
                    type="date"
                    className="border border-slate-700 bg-slate-950/60 rounded-xl px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-50"
                    required
                  />
                </div>
              </div>

              {/* Saat Slotları */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.12em]">
                  Saat Aralığı
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Yoğunluk durumuna göre bazı saatler kapalı görünebilir.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    "09:00",
                    "10:30",
                    "12:00",
                    "14:00",
                    "15:30",
                    "17:00",
                    "19:00",
                    "21:00",
                  ].map((slot) => (
                    <label
                      key={slot}
                      className="group relative cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot}
                        className="peer sr-only"
                        required
                      />
                      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 group-hover:border-red-500 group-hover:bg-red-500/10 transition-colors peer-checked:border-red-500 peer-checked:bg-red-500/20 peer-checked:text-red-50">
                        <Clock className="w-3 h-3" />
                        <span>{slot}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* İletişim bilgisi */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.12em]">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Adın ve soyadın"
                    className="border border-slate-700 bg-slate-950/60 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-50 placeholder:text-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.12em]">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="ornek@mail.com"
                    className="border border-slate-700 bg-slate-950/60 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-50 placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Hedef / beklenti */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.12em]">
                  Kısaca hedefin / gündemin
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Koçun seansa hazırlıklı gelsin; ilk görüşmeden maksimum verim
                  al.
                </p>
                <textarea
                  name="note"
                  className="border border-slate-700 bg-slate-950/60 rounded-xl px-3 py-2 text-sm w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-50 placeholder:text-slate-500"
                  placeholder="Örneğin: kariyer geçişi planlıyorum, mülakatlara hazırlanmak istiyorum, özgüvenimi güçlendirmek istiyorum..."
                />
              </div>

              {/* Alt satır */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Seans süresi: 45 dakika</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Gizlilik & KVKK koruması</span>
                  </span>
                </div>

                <Button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-red-900/40"
                >
                  <CreditCard className="w-4 h-4" />
                  Rezervasyonu Tamamla
                </Button>
              </div>
            </form>
          </section>

          {/* SAĞ TARAF: Güven kartı / özet */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-sm font-semibold text-slate-100 mb-2">
                Neden Kariyeer üzerinden rezervasyon?
              </h2>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <span>
                    Koçların sertifika ve deneyimleri elle doğrulanır; sadece
                    ilk 100 koç platforma kabul edilir.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <span>
                    Tüm seanslar kayıt altına alınmaz; paylaşılmayan, güvenli bir
                    alan sağlanır.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <span>
                    Yakında: Tek tıkla online ödeme, otomatik takvim entegrasyonu
                    ve seans hatırlatmaları.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-[11px] text-slate-400">
              <p className="mb-2 font-semibold text-slate-200 text-xs">
                Unicorn vizyonu olan platform
              </p>
              <p>
                Kariyeer, sadece randevu arayüzü değil; koçlar, şirketler ve
                bireyler için uçtan uca kariyer gelişim altyapısı kurmayı
                hedefleyen bir teknoloji girişimi. Burada planladığın her seans,
                bu vizyonun bir parçası.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
