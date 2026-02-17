// src/pages/Boost.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initiateBoostPayment, PRICING } from "@/lib/boostPayment";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Crown, Zap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Boost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const t = {
    tr: {
      title: "Boost & Premium Paketler",
      subtitle: "Profilini veya ilanını öne çıkar, daha fazla görün!",
      jobBoost: "İlanını Boost'la",
      coachBoost: "Koç Profilini Öne Çıkar",
      individualPremium: "Bireysel Premium",
      buy: "Satın Al",
      redirecting: "Yönlendiriliyor...",
      notLoggedIn: "Giriş Yapmanız Gerekiyor",
      loginToContinue: "Boost paketlerinden yararlanmak için giriş yapmalısınız.",
      login: "Giriş Yap",
      secured: "Tüm ödemeler PayTR güvencesiyle 256-bit SSL ile korunmaktadır.",
    },
    en: {
      title: "Boost & Premium Packages",
      subtitle: "Get more visibility for your profile or job post!",
      jobBoost: "Boost Your Job Post",
      coachBoost: "Feature Your Coach Profile",
      individualPremium: "Individual Premium",
      buy: "Buy Now",
      redirecting: "Redirecting...",
      notLoggedIn: "Login Required",
      loginToContinue: "You need to be logged in to purchase boost packages.",
      login: "Login",
      secured: "All payments are secured with PayTR 256-bit SSL.",
    },
    ar: {
      title: "حزم Boost & Premium",
      subtitle: "ارفع ظهور ملفك أو إعلانك!",
      jobBoost: "تعزيز إعلان الوظيفة",
      coachBoost: "إبراز ملف المدرب",
      individualPremium: "بريميوم فردي",
      buy: "اشترِ الآن",
      redirecting: "جارٍ التوجيه...",
      notLoggedIn: "يتطلب تسجيل الدخول",
      loginToContinue: "يجب عليك تسجيل الدخول لشراء حزم التعزيز.",
      login: "تسجيل الدخول",
      secured: "جميع المدفوعات محمية بتشفير PayTR 256-bit SSL.",
    },
    fr: {
      title: "Boost & Premium",
      subtitle: "Mettez en avant votre profil ou votre annonce !",
      jobBoost: "Booster votre annonce",
      coachBoost: "Mettre en avant votre profil coach",
      individualPremium: "Premium Individuel",
      buy: "Acheter",
      redirecting: "Redirection en cours...",
      notLoggedIn: "Connexion requise",
      loginToContinue: "Vous devez être connecté pour acheter un boost.",
      login: "Se connecter",
      secured: "Tous les paiements sont sécurisés avec PayTR 256-bit SSL.",
    },
  }[language || "tr"];

  const me = user;
  if (!me) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center p-6">
        <Card className="p-10 text-center max-w-lg shadow-2xl border border-orange-200">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">{t.notLoggedIn}</h2>
          <p className="text-gray-600 mb-8">{t.loginToContinue}</p>
          <Button onClick={() => (window.location.href = "/login")} className="h-12 px-8 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold">
            {t.login}
          </Button>
        </Card>
      </div>
    );
  }

  const handlePayment = async (type: keyof typeof PRICING, price: any) => {
    if (!me?.email || !me?.fullName) {
      toast({ title: "Hata", description: "Profilinizde isim ve email eksik.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const result = await initiateBoostPayment({
      userId: me.id,
      email: me.email,
      fullName: me.fullName || me.email.split("@")[0],
      type,
      amount: price.amount,
      durationDays: price.duration,
    });

    if (result.success && result.token) {
      const paytrForm = document.createElement("form");
      paytrForm.action = "https://www.paytr.com/odeme";
      paytrForm.method = "POST";
      paytrForm.target = "_blank";

      const inputs = {
        merchant_id: import.meta.env.VITE_PAYTR_MERCHANT_ID,
        merchant_key: import.meta.env.VITE_PAYTR_MERCHANT_KEY,
        merchant_salt: import.meta.env.VITE_PAYTR_MERCHANT_SALT,
        email: me.email,
        payment_amount: price.amount,
        merchant_oid: result.merchantOid,
        user_name: me.fullName || me.email.split("@")[0],
        user_basket: JSON.stringify([[PRICING[type].name + " - " + price.label, (price.amount / 100).toFixed(2), "1"]]),
        user_ip: "85.34.78.112",
        timeout_limit: "30",
        currency: "TL",
        test_mode: import.meta.env.DEV ? "1" : "0",
        token: result.token,
      };

      Object.entries(inputs).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        paytrForm.appendChild(input);
      });

      document.body.appendChild(paytrForm);
      paytrForm.submit();
      document.body.removeChild(paytrForm);

      toast({ title: "Başarılı", description: "Ödeme sayfasına yönlendiriliyorsunuz..." });
    } else {
      toast({ title: "Hata", description: result.error || "Ödeme başlatılamadı.", variant: "destructive" });
    }
    setLoading(false);
  };

  const packages = [
    { type: "job_boost" as const, title: t.jobBoost, icon: Zap, gradient: "from-orange-500 to-red-600" },
    { type: "coach_boost" as const, title: t.coachBoost, icon: Crown, gradient: "from-red-600 to-orange-600" },
    { type: "premium_individual" as const, title: t.individualPremium, icon: Sparkles, gradient: "from-red-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-700 font-medium">{t.subtitle}</p>
        </div>

        {/* Packages */}
        <div className="grid lg:grid-cols-3 gap-10">
          {packages.map(({ type, title, icon: Icon, gradient }) => (
            <Card key={type} className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
              <div className="absolute inset-0 bg-black opacity-10" />
              
              <div className="relative z-10 p-10 text-white">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
                  <Icon size={48} className="drop-shadow-lg" />
                </div>
                
                <h3 className="text-3xl font-black mb-10 drop-shadow-lg">{title}</h3>
                
                <div className="space-y-6">
                  {PRICING[type].prices.map((price) => (
                    <div key={price.duration} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-lg font-bold">{price.label}</p>
                          <p className="text-sm opacity-90">{price.duration === 1 ? "Tek Seferlik" : price.duration + " Gün"}</p>
                        </div>
                        <p className="text-4xl font-black">
                          {(price.amount / 100).toFixed(0)}<span className="text-xl">₺</span>
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handlePayment(type, price)}
                        disabled={loading}
                        className="w-full h-14 text-lg font-bold bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                      >
                        {loading ? t.redirecting : t.buy}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm shadow-xl border border-orange-200">
            <CheckCircle2 className="h-6 w-6 text-red-600" />
            <p className="text-gray-700 font-medium">{t.secured}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
