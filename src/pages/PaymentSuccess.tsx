// src/pages/PaymentSuccess.tsx
// @ts-nocheck
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Calendar, Home, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  const bookingId = searchParams.get("bookingId");

  const me = auth?.user ?? null;
  const role = me?.userType ?? null; // client | coach | company | admin | super_admin

  const dashboardPath = useMemo(() => {
    if (role === "coach") return "/coach/dashboard";
    if (role === "company") return "/corporate/dashboard";
    if (role === "admin" || role === "super_admin") return "/admin";
    if (role === "client") return "/user/dashboard";
    return "/login";
  }, [role]);

  const primaryCtaLabel = useMemo(() => {
    if (role === "coach") return "Panele Git";
    if (role === "company") return "Kurumsal Panele Git";
    if (role === "admin" || role === "super_admin") return "Admin Paneline Git";
    return "Randevularıma Git";
  }, [role]);

  const handlePrimary = () => {
    // Kullanıcı yoksa login
    if (!me) {
      navigate("/login");
      return;
    }

    // Client için opsiyonel: bookingId ile dashboard'a git
    if (role === "client") {
      const url = bookingId
        ? `${dashboardPath}?bookingId=${encodeURIComponent(bookingId)}`
        : dashboardPath;
      navigate(url);
      return;
    }

    navigate(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-t-4 border-t-green-500 shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            Ödeme Başarılı!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Tebrikler! İşleminiz başarıyla tamamlandı.
          </p>

          {bookingId && (
            <div className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-700">
              <div className="font-semibold text-gray-900 mb-1">
                İşlem Referansı
              </div>
              <div className="font-mono break-all">{bookingId}</div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">Bundan Sonra Ne Olacak?</p>
            <ul className="space-y-2 text-left list-disc pl-4">
              <li>Talebiniz sisteme kaydedildi.</li>
              <li>Koç/ekip onayladığında bildirim alacaksınız.</li>
              <li>Seans saati geldiğinde panelinizden görüşmeye katılabilirsiniz.</li>
            </ul>
          </div>

          {!me && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 text-left">
              Devam etmek için giriş yapmanız gerekiyor.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-blue-900 hover:bg-blue-800"
            onClick={handlePrimary}
          >
            {me ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                {primaryCtaLabel}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Giriş Yap
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>

          {/* küçük yardımcı link */}
          {me && role === "client" && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/coaches")}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Diğer Koçları Gör
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
