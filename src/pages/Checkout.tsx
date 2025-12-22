// src/pages/Checkout.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, CreditCard, Lock, ArrowLeft } from "lucide-react";

import {
  supabase,
  subscriptionService,
  SUBSCRIPTION_TYPES,
  SUBSCRIPTION_STATUS,
} from "@/lib/supabase";

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function formatMoney(amount: number, currency = "TRY") {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<any>(null);

  // Demo kart UI (mock)
  const [cardData, setCardData] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvc: "",
  });

  const plan = (params.get("plan") || "").toLowerCase();

  const selectedType = useMemo(() => {
    if (plan === SUBSCRIPTION_TYPES.INDIVIDUAL) return SUBSCRIPTION_TYPES.INDIVIDUAL;
    if (plan === SUBSCRIPTION_TYPES.CORPORATE) return SUBSCRIPTION_TYPES.CORPORATE;
    if (plan === SUBSCRIPTION_TYPES.COACH) return SUBSCRIPTION_TYPES.COACH;
    return SUBSCRIPTION_TYPES.INDIVIDUAL;
  }, [plan]);

  // Fiyatlar (şimdilik sabit)
  const pricing = useMemo(() => {
    if (selectedType === SUBSCRIPTION_TYPES.CORPORATE) {
      return { price: 2999, currency: "TRY", title: "Kurumsal Premium", periodDays: 30 };
    }
    if (selectedType === SUBSCRIPTION_TYPES.COACH) {
      return { price: 499, currency: "TRY", title: "Koç Premium", periodDays: 30 };
    }
    return { price: 299, currency: "TRY", title: "Bireysel Premium", periodDays: 30 };
  }, [selectedType]);

  const vatRate = 0.2;
  const vatAmount = useMemo(() => pricing.price * vatRate, [pricing.price]);
  const total = useMemo(() => pricing.price + vatAmount, [pricing.price, vatAmount]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (!u) {
        toast.error("Ödeme için önce giriş yapmalısın.");
        navigate("/login", { replace: true });
        return;
      }
      setMe(u);
    })();
  }, [navigate]);

  const handleCardNumberChange = (e: any) => {
    let value = (e.target.value || "").replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardData((s) => ({ ...s, number: value.substring(0, 19) }));
  };

  const validateCard = () => {
    if (!cardData.holder?.trim()) return false;
    if ((cardData.number || "").length < 19) return false;
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry || "")) return false;
    if ((cardData.cvc || "").length < 3) return false;
    return true;
  };

  const handlePay = async () => {
    if (!me?.id) return;

    if (!validateCard()) {
      toast.error("Lütfen kart bilgilerini eksiksiz gir.");
      return;
    }

    setLoading(true);

    try {
      // 1) Aktif premium var mı?
      const active = await subscriptionService.getActiveByUserId(me.id);

      // end_date null ise “süresiz” kabul edebilirsin; bu ekranda basitçe active varsa engelliyoruz.
      if (active?.id && active?.status === SUBSCRIPTION_STATUS.ACTIVE) {
        toast.message("Zaten aktif bir premium üyeliğin var. Yönlendiriyorum…");
        navigate(`/payment-success?existing=1&type=${active.subscription_type}`);
        return;
      }

      // 2) Mock ödeme
      await new Promise((r) => setTimeout(r, 1500));

      // 3) DB’ye subscription aç (✅ badge_type YAZMIYORUZ)
      const created = await subscriptionService.create({
        user_id: me.id,
        subscription_type: selectedType,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        price: pricing.price,
        currency: pricing.currency,
        start_date: new Date().toISOString(),
        end_date: addDaysISO(pricing.periodDays),
        auto_renew: true,
        // badge_type: undefined -> insertRow'a hiç girmeyecek (senin istediğin)
      });

      if (!created?.id) {
        toast.error("Abonelik kaydı oluşturulamadı (RLS/Policy olabilir).");
        return;
      }

      toast.success("Ödeme başarılı! Premium aktif edildi.");
      navigate(`/payment-success?sub=${created.id}&type=${created.subscription_type}`);
    } catch (e: any) {
      console.error(e);
      toast.error("Ödeme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!me) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* SOL: ÖDEME FORMU */}
          <div className="md:col-span-2">
            <Card className="border-t-4 border-t-red-600 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="w-6 h-6 text-red-600" />
                  Checkout — {pricing.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedType}</Badge>
                  <Badge className="bg-red-600">30 Gün</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kart Sahibi</Label>
                    <Input
                      placeholder="Ad Soyad"
                      value={cardData.holder}
                      onChange={(e) => setCardData((s) => ({ ...s, holder: e.target.value }))}
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
                        className="pl-10 font-mono"
                      />
                      <CreditCard className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Son Kullanma (MM/YY)</Label>
                    <Input
                      placeholder="12/28"
                      value={cardData.expiry}
                      onChange={(e) =>
                        setCardData((s) => ({ ...s, expiry: (e.target.value || "").substring(0, 5) }))
                      }
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <div className="relative">
                      <Input
                        placeholder="123"
                        type="password"
                        value={cardData.cvc}
                        onChange={(e) =>
                          setCardData((s) => ({
                            ...s,
                            cvc: (e.target.value || "").replace(/\D/g, "").substring(0, 3),
                          }))
                        }
                        maxLength={3}
                        className="pl-10"
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Bu ekran şu an demo (mock) ödeme. Kart bilgileri saklanmaz. İyzico/Stripe bağlayınca sadece ödeme
                    kısmı gerçek olur.
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handlePay}
                  className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? "İşleniyor..." : `Ödemeyi Tamamla (${formatMoney(total, pricing.currency)})`}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* SAĞ: ÖZET */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paket</span>
                  <span className="font-semibold">{pricing.title}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hizmet Bedeli</span>
                  <span className="font-semibold">{formatMoney(pricing.price, pricing.currency)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">KDV (%20)</span>
                  <span className="font-semibold">{formatMoney(vatAmount, pricing.currency)}</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold text-red-600">
                  <span>Toplam</span>
                  <span>{formatMoney(total, pricing.currency)}</span>
                </div>

                <div className="text-xs text-gray-500">
                  Not: Bu işlem <b>premium abonelik</b> kaydı açar. Rozet (badge_type) kullanılmaz/boş kalır.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
