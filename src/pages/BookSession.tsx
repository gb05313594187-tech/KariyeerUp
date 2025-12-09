// src/pages/BookSession.tsx
// @ts-nocheck
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const coachId = searchParams.get("coachId"); // Şimdilik sadece backend için elde tutuyoruz

  // Düzenli, premium saat slotları
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Buraya ileride Supabase insert + mail / sms entegrasyonu gelecek
    alert(
      "Rezervasyon isteğin alındı. Takvim ve ödeme akışı yakında koç takvimiyle entegre edilecek."
    );
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* HERO - turuncu/kırmızı gradient */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-400 text-white pt-8 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-4 text-white/90 hover:text-white text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri dön
          </button>

          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            Seans Planla
          </h1>
          <p className="mt-3 text-sm md:text-base text-red-50 max-w-xl">
            Uygun tarih ve saati seç, koçun onayladığında seans detayları
            e-posta ve SMS ile iletilecektir.
          </p>
        </div>
      </div>

      {/* FORM KARTI */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-20 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-8"
        >
          {/* TARİH SEÇİMİ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Tarih Seç
            </label>
            <div className="flex items-center gap-3 mt-1">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full max-w-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* SAAT SEÇİMİ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Saat Aralığı
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {timeSlots.map((slot) => (
                <label key={slot} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    className="peer sr-only"
                    required
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-700 peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-700 hover:border-red-400 transition">
                    <Clock className="w-4 h-4" />
                    {slot}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* İLETİŞİM BİLGİLERİ */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Ad Soyad
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Adınız Soyadınız"
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                placeholder="ornek@mail.com"
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* HEDEF / BEKLENTİ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Hedefiniz / Beklentiniz
            </label>
            <textarea
              name="note"
              placeholder="Örn: kariyer geçişi planlıyorum, mülakatlara hazırlanmak istiyorum..."
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full h-24 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* ALT ÇUBUK */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-4 h-4" />
              45 dk seans süresi
            </div>

            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Rezervasyonu Tamamla
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
