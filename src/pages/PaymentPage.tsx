// src/pages/PaymentPage.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionService } from "@/lib/supabase";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // Premium için query param: /checkout?plan=individual|corporate|coach
  const search = new URLSearchParams(location.search);
  const plan = (search.get("plan") || "").toLowerCase();

  // Booking ödeme akışın (mevcut uyumluluk için)
  const { bookingId } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvc: "",
  });

  const role = auth?.role || null; // user | coach | corporate | admin
  const me = auth?.user || null;

  const isPremiumCheckout = plan === "individual" || plan === "corporate" || plan === "coach";

  // --- plan config (tek kaynak) ---
  const planConfig = useMemo(() => {
    const MAP: any = {
      individual: { title: "Bireysel Premium", price: 299, currency: "TRY", badge: "blue_badge" },
      corporate: { title: "Kurumsal Premium", price: 1999, currency: "TRY", badge: "corporate_badge" },
      coach: { title: "Koç Premium", price: 499, currency: "TRY", badge: "coach_badge" },
    };
    return MAP[plan] || null;
  }, [plan]);

  // --- rol doğrulama ---
  const allowed = useMemo(() => {
    if (!isPremiumCheckout) return true; // booking ödeme vs
    if (!auth?.isAuthenticated) return false; // premium satın almak için login şart
    if (role === "admin") return true; // admin test edebilsin
    if (plan === "individual" && role === "user") return true;
    if (plan === "corporate" && role === "corporate") return true;
    if (plan === "coach" && role === "coach") return true;
    return false;
  }, [isPremiumCheckout, auth?.isAuthenticated, role, plan]);

  useEffect(() => {
    // premium checkout ise ve login yoksa register’a yolla
    if (isPremiumCheckout && !auth?.isAuthenticated) {
      toast.error("Premium satın almak için giriş yapmalısın.");
      navigate("/login");
    }
  }, [isPremiumCheckout, auth?.isAuthenticated, navigate]);

  // Kart format
  const handleCardNumberChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardData({ ...cardData, number: value.substring(0, 19) });
  };

  const total = useMemo(() => {
    // Premium için tek fiyat (KDV gösterimini sonra bağlarız)
    if (isPremiumCheckout && planConfig) return planConfig.price;
    // Booking fallback
    return 1800;
  }, [isPremiumCheckout, planConfig]);

  const handlePayment = async (e: any) => {
    e.preventDefault();

    if (cardData.number.length < 19 || cardData.cvc.length < 3) {
      toast.error("Lütfen kart bilgilerinizi eksiksiz girin.");
      return;
    }

    // Premium checkout ise rol doğrulaması şart
    if (isPremiumCheckout) {
      if (!allowed) {
        toast.error("Bu premium paket rolüne uygun değil.");
        navigate("/pricing");
        return;
      }
      if (!me?.id) {
        toast.error("Kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
        navigate("/login");
        return;
      }
      if (!planConfig) {
        toast.error("Plan bulunamadı.");
        navigate("/pricing");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Simülasyon: 1.2sn
      await new Promise((r) => setTimeout(r, 1200));

      // ✅ Premium satın alma: Supabase’e aktif abonelik kaydı at
      if (isPremiumCheckout && planConfig) {
        const now = new Date();
        const start = now.toISOString();
        const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const created = await subscriptionService.create({
          user_id: me.id,
          subscription_type: plan, // 'individual' | 'corporate' | 'coach'
          status: "active",
          price: Number(planConfig.price),
          currency: planConfig.currency,
          start_date: start,
          end_date: end,
          auto_renew: true,
          iyzico_subscription_id: null,
          badge_type: planConfig.badge,
        });

        if (!created) {
          toast.error("Abonelik kaydı oluşturulamadı (RLS/constraint olabilir).");
          setIsLoading(false);
          return;
        }

        toast.success(`${planConfig.title} aktif edildi ✅`);
        setIsLoading(false);
        navigate(`/payment-success?type=premium&plan=${plan}`);
        return;
      }

      // Booking ödeme başarı
      setIsLoading(false);
      navigate(`/payment-success?bookingId=${bookingId || "new"}`);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      toast.error("Ödeme sırasında hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
        </Button>

        {/* premium checkout üst bilgi */}
        {isPremiumCheckout && (
          <div className="mb-6 rounded-2xl border bg-white p-4">
            <div className="font-bold text-gray-900">
              Checkout: {planConfig?.title || "Premium"}
            </div>
            <div className="text-sm text-gray-600">
              Rol: <b>{role || "-"}</b> • Plan: <b>{plan}</b>
            </div>

            {!allowed && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Bu paket rolüne uygun değil. Pricing’e yönlendirileceksin.
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* SOL: ÖDEME FORMU */}
          <div className="md:col-span-2">
            <Card className="border-t-4 border-t-blue-900 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="w-6 h-6 text-blue-900" /> Güvenli Ödeme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Kart Sahibi</Label>
                    <Input
                      placeholder="Ad Soyad"
                      value={cardData.holder}
                      onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Kart Numarası</Label>
                    <div className="relative">
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        required
                        className="pl-10 font-mono"
                      />
                      <CreditCard className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Son Kullanma (Ay/Yıl)</Label>
                      <Input
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC / CVV</Label>
                      <div className="relative">
                        <Input
                          placeholder="123"
                          type="password"
                          value={cardData.cvc}
                          onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                          maxLength={3}
                          required
                          className="pl-10"
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Ödemeniz SSL ile korunur. Kart bilgileriniz saklanmaz. (Şu an simülasyon modunda)
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg"
                    disabled={isLoading || (isPremiumCheckout && !allowed)}
                  >
                    {isLoading ? "Ödeme İşleniyor..." : "Ödemeyi Tamamla"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* SAĞ: ÖZET */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPremiumCheckout ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-semibold">{planConfig?.title || "-"}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-blue-900">
                      <span>Toplam</span>
                      <span>{Number(total).toFixed(2)} TL</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hizmet Bedeli</span>
                      <span className="font-semibold">1500.00 TL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">KDV (%20)</span>
                      <span className="font-semibold">300.00 TL</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-blue-900">
                      <span>Toplam</span>
                      <span>1800.00 TL</span>
                    </div>
                  </>
                )}

                <div className="flex gap-2 justify-center mt-4">
                  <Badge variant="outline">Visa</Badge>
                  <Badge variant="outline">Mastercard</Badge>
                  <Badge variant="outline">Troy</Badge>
                </div>

                {isPremiumCheckout && (
                  <div className="text-xs text-gray-500 text-center">
                    Premium satın alma: 30 gün aktif + rozet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
