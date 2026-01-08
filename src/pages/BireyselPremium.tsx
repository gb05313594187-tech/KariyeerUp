// src/pages/BireyselPremium.tsx
// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";

export default function BireyselPremium() {
  const navigate = useNavigate();

  const features = [
    "ICF sertifikalı koçlarla birebir seans",
    "Hedefine göre koç eşleşmesi",
    "Seans sonrası aksiyon planı",
    "Mülakat simülasyonu + CV/LinkedIn iyileştirme",
    "Öncelikli destek & hızlı randevu",
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-gray-900">
      <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 text-xs font-semibold">
            <Crown className="w-4 h-4" />
            Bireysel Premium
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
            Kariyerinde hızlan.
            <span className="block text-red-50/95">Doğru koçla ilerle.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm md:text-base text-red-50">
            Hedefine göre koç seç, randevunu planla, ödemeyi tamamla. Her şey tek akışta.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              className="rounded-xl bg-white text-red-700 hover:bg-red-50 font-semibold"
              onClick={() => navigate("/coaches")}
            >
              Koçları Gör
            </Button>
            <Button
              className="rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold"
              onClick={() => navigate("/checkout?plan=individual")}
            >
              Premium’a Başla
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold">Neler Dahil?</h2>
            <div className="mt-4 space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-red-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-sm text-gray-800">{f}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold">Nasıl Çalışır?</h2>
            <ol className="mt-4 space-y-3 text-sm text-gray-800 list-decimal pl-5">
              <li>Koçu seç</li>
              <li>Takvimden gün/saat belirle</li>
              <li>Bilgilerini gir</li>
              <li>Ödemeyi tamamla</li>
              <li>Seans dashboard’a düşsün</li>
            </ol>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate("/how-it-works")}
              >
                Detay
              </Button>
              <Button
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                onClick={() => navigate("/coaches")}
              >
                Koç Bul
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
