// src/pages/Pricing.tsx
// @ts-nocheck
import { Button } from "@/components/ui/button";
import {
  Crown,
  Building2,
  User,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  Headphones,
  TicketPercent,
  Newspaper,
  Users2,
  Video,
  Briefcase,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Pricing() {
  const navigate = useNavigate();
  const auth = useAuth();

  const role = auth?.role || null; // user | coach | corporate | admin
  const isLoggedIn = !!auth?.isAuthenticated;

  // --- FEATURES ---
  const individual = [
    "Özel rozet / etiket (Premium kullanıcı simgesi)",
    "Aylık 1 ücretsiz webinar katılımı",
    "Seanslara özel indirim kuponları",
    "Premium’a özel kapalı webinarlar (Kariyeer Kulübü)",
    "Paket seanslarda ekstra indirim",
    "Premium canlı destek hattı",
  ];

  const corporate = [
    "Paket alımlarında %20’ye varan kurumsal indirim",
    "Toplu seans satın alma avantajı",
    "Uzun dönem sözleşmelerde sabit fiyat garantisi",
    "Aylık 3 adet ücretsiz webinar (İK, liderlik, gelişim)",
    "Öncelikli destek hattı",
    "Onaylı Kurumsal Rozet",
    "Kariyeer News Dergi üyeliği ücretsiz",
    "Aylık 1 kez ücretsiz mülakat desteği",
  ];

  const coach = [
    "Koç Premium rozeti (profilde öne çıkar)",
    "Listede öncelik / görünürlük artırma",
    "Daha düşük komisyon (örnek: -%X)",
    "AI destekli profil optimizasyonu (headline, bio, fiyat önerisi)",
    "Aylık 2 webinar: satış, paketleme, itiraz yönetimi",
    "Öncelikli koç destek hattı",
    "Gelişmiş analitik: profil görüntülenme → dönüşüm raporu",
  ];

  // --- VISIBILITY RULE (NET) ---
  const canSeeIndividual = !isLoggedIn || role === "user" || role === "admin";
  const canSeeCorporate = !isLoggedIn || role === "corporate" || role === "admin";
  const canSeeCoach = !isLoggedIn || role === "coach" || role === "admin";

  // Hero CTA
  const primaryCta = () => {
    if (!isLoggedIn) return navigate("/register");
    if (role === "corporate") return navigate("/checkout?plan=corporate");
    if (role === "coach") return navigate("/checkout?plan=coach");
    return navigate("/checkout?plan=individual");
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="border-b bg-gradient-to-b from-red-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-200 text-red-700 font-semibold">
              <Sparkles className="w-4 h-4 text-red-600" />
              Premium’a Geç • Daha hızlı ilerle
            </span>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Premium <span className="text-red-600">Üyelik</span>
          </h1>

          <p className="mt-4 text-center text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Gelişim, satış ve kurumsal dönüşüm. Rolüne uygun paketi görürsün.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Button
              variant="outline"
              className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => {
                const el = document.getElementById("plans");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Paketleri İncele
            </Button>

            <Button
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
              onClick={primaryCta}
            >
              Hemen Başla
            </Button>
          </div>

          {/* mini trust */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <TicketPercent className="w-5 h-5 text-red-600" />
                İndirim & Paket Avantajı
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Seans ve paketlerde premium ayrıcalıkları ile daha uygun maliyet.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Video className="w-5 h-5 text-red-600" />
                Webinar & Kulüp
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Kapalı oturumlar ve premium içerikler.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Headphones className="w-5 h-5 text-red-600" />
                Öncelikli Destek
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Premium destek ile daha hızlı çözüm ve daha iyi deneyim.
              </p>
            </div>
          </div>

          {/* role note */}
          {isLoggedIn && role !== "admin" && (
            <div className="mt-8 rounded-2xl border bg-white p-4 text-sm text-gray-700">
              Şu an rolün: <b>{role}</b>. Bu yüzden sadece sana uygun premium paketi görüyorsun.
            </div>
          )}
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={[
              "grid gap-6",
              // 1 plan görünürse tek kolon, 2-3 plan görünürse responsive grid
              countTrue(canSeeIndividual, canSeeCorporate, canSeeCoach) === 1
                ? "grid-cols-1"
                : "grid-cols-1 lg:grid-cols-2",
            ].join(" ")}
          >
            {/* Individual */}
            {canSeeIndividual && (
              <div className="rounded-3xl border bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold text-sm">
                      <User className="w-4 h-4" />
                      Bireysel Premium
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                      Bireysel gelişim için
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Daha fazla fırsat, kulüp içerikleri, indirimler ve premium destek.
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                    <Crown className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {individual.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="text-gray-800">{t}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex gap-3 flex-wrap">
                  <Button
                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => navigate(isLoggedIn ? "/checkout?plan=individual" : "/register")}
                  >
                    Bireysel Premium’a Geç
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => navigate("/webinars")}
                  >
                    Webinarları Gör
                  </Button>
                </div>

                <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <BadgeCheck className="w-5 h-5 text-red-600" />
                    Not
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    Premium rozet, profilde görünür ve sosyal kanıt etkisi yaratır.
                  </p>
                </div>
              </div>
            )}

            {/* Corporate */}
            {canSeeCorporate && (
              <div className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-red-50" />
                <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-red-50" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-semibold text-sm">
                        <Building2 className="w-4 h-4" />
                        Kurumsal Premium
                      </div>
                      <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                        Şirketler & İK ekipleri için
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Toplu satın alma avantajı, eğitim, görünürlük ve öncelikli destek.
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                      <Users2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {corporate.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="text-gray-800">{t}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex gap-3 flex-wrap">
                    <Button
                      className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => navigate(isLoggedIn ? "/checkout?plan=corporate" : "/register")}
                    >
                      Kurumsal Premium’a Geç
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => navigate("/corporate/dashboard")}
                    >
                      Kurumsal Panel
                    </Button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border bg-white p-4">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Newspaper className="w-5 h-5 text-red-600" />
                        Kariyeer News
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Dergi üyeliği ve ücretsiz görünürlük.
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-white p-4">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Headphones className="w-5 h-5 text-red-600" />
                        Öncelikli Destek
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Kurumsal taleplerde hızlı dönüş.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <BadgeCheck className="w-5 h-5 text-red-600" />
                      Kurumsal Rozet
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      Doğrulanmış işveren algısı + daha yüksek güven dönüşümü.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Coach */}
            {canSeeCoach && (
              <div className="rounded-3xl border bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white font-semibold text-sm">
                      <Briefcase className="w-4 h-4" />
                      Koç Premium
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                      Koçlar için büyüme paketi
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Daha fazla görünürlük, daha yüksek dönüşüm, daha iyi gelir.
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {coach.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gray-900 mt-0.5" />
                      <div className="text-gray-800">{t}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex gap-3 flex-wrap">
                  <Button
                    className="rounded-xl bg-gray-900 hover:bg-black text-white"
                    onClick={() => navigate(isLoggedIn ? "/checkout?plan=coach" : "/register")}
                  >
                    Koç Premium’a Geç
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => navigate("/coach/dashboard")}
                  >
                    Koç Paneli
                  </Button>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50 border p-4">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <ShieldCheck className="w-5 h-5" />
                    Not
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    Koç Premium, listede görünürlüğü artırır ve analitik sağlar.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="mt-10 rounded-3xl border bg-white p-6">
            <h3 className="text-xl font-extrabold text-gray-900">Sık Sorulanlar</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="font-bold text-gray-900">Premium hemen aktif olur mu?</div>
                <div className="mt-1">
                  Ödeme entegrasyonu eklendiğinde, satın alma sonrası anında aktif olacak şekilde kurgulanır.
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="font-bold text-gray-900">Admin hepsini görebilir mi?</div>
                <div className="mt-1">
                  Evet. Admin rolü bu sayfada tüm premium planları görür.
                </div>
              </div>
            </div>
          </div>

          {/* Eğer login olup rolüne göre hiçbir şey göremiyorsa (teoride olmaması lazım) */}
          {isLoggedIn && role !== "admin" && !canSeeIndividual && !canSeeCorporate && !canSeeCoach && (
            <div className="mt-10 rounded-2xl border bg-amber-50 border-amber-200 p-4 text-amber-900">
              Rolün nedeniyle bu sayfada plan görünmüyor. (role: {String(role)})
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function countTrue(...vals: boolean[]) {
  return vals.filter(Boolean).length;
}
