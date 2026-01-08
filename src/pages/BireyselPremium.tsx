// src/pages/BireyselPremium.tsx
// @ts-nocheck
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Crown, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function BireyselPremium() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const authed = !!auth?.user;

  const features = useMemo(
    () => [
      "Premium koçlara erişim",
      "Öncelikli rezervasyon",
      "Gelişmiş profil ve CV optimizasyonu",
      "Webinar ve içerik arşivi",
      "Öncelikli destek",
    ],
    []
  );

  const handleBuy = () => {
    // ✅ Ödeme akışı buradan başlar
    // Giriş yoksa login’e at ve geri dön
    if (!authed) {
      toast.error("Satın almak için giriş yapmalısın.");
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    // ✅ PayTR checkout’a plan ile git
    navigate(`/paytr/checkout?plan=individual`);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-red-600 to-orange-500">
        <div className="max-w-6xl mx-auto px-4 py-14 text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm">
            <Crown className="w-4 h-4" />
            Bireysel Premium
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
            Kariyerinde hızlan.
            <br />
            Premium ile öne geç.
          </h1>

          <p className="mt-4 max-w-2xl text-white/90 text-lg">
            Daha iyi koçlara eriş, daha hızlı rezervasyon al, daha net bir planla ilerle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              className="h-12 px-6 rounded-2xl bg-white text-red-700 hover:bg-white/90 font-bold"
              onClick={handleBuy}
            >
              Premium Satın Al
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 rounded-2xl border-white/40 text-white hover:bg-white/10"
              onClick={() => navigate("/coaches")}
            >
              Koçları İncele
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Sparkles className="w-5 h-5 text-red-600" />
              Premium ayrıcalıklar
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Koçluk deneyimini daha hızlı ve daha etkili hale getirir.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              Güvenli ödeme
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Ödeme PayTR altyapısında tamamlanır. Kart bilgisi platformda tutulmaz.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Crown className="w-5 h-5 text-red-600" />
              Tek tıkla başla
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Satın aldıktan sonra premium koçlara anında eriş.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 p-6">
          <div className="text-lg font-extrabold text-gray-900">Neler dahil?</div>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">Aylık</div>
              <div className="text-3xl font-extrabold text-gray-900">
                199 ₺ <span className="text-base font-semibold text-gray-500">/ ay</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                *Fiyat bilgilendirme amaçlı. Plan fiyatını PayTR tarafında plan’a göre netleştir.
              </div>
            </div>

            <Button
              className="h-12 px-7 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={handleBuy}
            >
              Premium Satın Al
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
