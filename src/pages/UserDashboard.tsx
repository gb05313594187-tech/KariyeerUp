// src/pages/UserDashboard.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  CreditCard,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LogIn,
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);
  const [paymentsCount, setPaymentsCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data?.user || null;
        if (!mounted) return;

        setAuthUser(user);

        if (!user) {
          // Giriş yok → dashboard yine render olsun ama “giriş yap” CTA çıksın
          setProfile(null);
          setSessionsCount(null);
          setPaymentsCount(null);
          return;
        }

        // ✅ Profil: tek kaynak profiles (display_name + full_name uyumlu)
        try {
          const { data: pData, error: pErr } = await supabase
            .from("profiles")
            .select("id, full_name, display_name, phone, city, title, sector, industry")
            .eq("id", user.id)
            .maybeSingle();

          if (!pErr) setProfile(pData || null);
        } catch (e) {
          setProfile(null);
        }

        // Sessions (opsiyonel): tablo yoksa hata alabilir, kırmayız
        try {
          const { count, error: sErr } = await supabase
            .from("sessions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (!sErr) setSessionsCount(typeof count === "number" ? count : 0);
        } catch (e) {
          setSessionsCount(null);
        }

        // Payments (opsiyonel): tablo yoksa hata alabilir, kırmayız
        try {
          const { count, error: payErr } = await supabase
            .from("payments")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (!payErr) setPaymentsCount(typeof count === "number" ? count : 0);
        } catch (e) {
          setPaymentsCount(null);
        }
      } catch (err) {
        console.error("UserDashboard load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const displayName =
    profile?.full_name ||
    profile?.display_name ||
    profile?.name ||
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.display_name ||
    authUser?.email?.split("@")?.[0] ||
    "Kullanıcı";

  const completion = useMemo(() => {
    // ✅ UserProfile ile aynı isim zinciri + sector uyumu
    const checks = [
      !!(
        profile?.full_name ||
        profile?.display_name ||
        authUser?.user_metadata?.full_name ||
        authUser?.user_metadata?.display_name
      ),
      !!(profile?.phone || authUser?.phone),
      !!profile?.city,
      !!profile?.title,
      !!(profile?.sector || profile?.industry),
    ];
    const filled = checks.filter(Boolean).length;
    const pct = Math.round((filled / checks.length) * 100);
    return isNaN(pct) ? 0 : pct;
  }, [profile, authUser]);

  const nextStep = useMemo(() => {
    if (!authUser) {
      return {
        title: "Giriş yap ve kaldığın yerden devam et",
        desc: "Dashboard kişiselleştirme ve seans akışı için giriş gerekli.",
        ctaText: "Giriş Yap",
        ctaHref: "/login",
        icon: LogIn,
        tone: "dark",
      };
    }

    if (completion < 60) {
      return {
        title: "Profilini tamamla",
        desc: "Daha iyi koç eşleşmesi için birkaç bilgiyi daha ekle.",
        ctaText: "Profilimi Düzenle",
        ctaHref: "/user/profile",
        icon: BadgeCheck,
        tone: "orange",
      };
    }

    if (sessionsCount === 0) {
      return {
        title: "İlk seansını planla",
        desc: "Koçları incele, sana uygun olanı seç ve seans talebi gönder.",
        ctaText: "Koçları İncele",
        ctaHref: "/coaches",
        icon: Calendar,
        tone: "orange",
      };
    }

    return {
      title: "İlerlemeni güncelle",
      desc: "Seans notlarını gözden geçir, hedeflerini netleştir ve devam planı oluştur.",
      ctaText: "Seanslarım",
      ctaHref: "/book-session",
      icon: Sparkles,
      tone: "dark",
    };
  }, [authUser, completion, sessionsCount]);

  return (
    <div className="bg-white">
      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-white/90">User Panel</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hoş geldin, {displayName}
          </h1>
          <p className="mt-2 text-white/90 max-w-2xl">
            Buradan seanslarını, ödemelerini ve profilini yönetebilirsin.
          </p>

          {/* Completion bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-white/90">
              <span>Profil tamamlanma</span>
              <span className="font-semibold">%{authUser ? completion : 0}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${authUser ? completion : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Next step */}
        <div className="mb-8">
          <Card
            className={`border ${
              nextStep.tone === "orange"
                ? "bg-orange-50 border-orange-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                      nextStep.tone === "orange"
                        ? "bg-white border-orange-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <nextStep.icon className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Bir sonraki adım
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {nextStep.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{nextStep.desc}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Link to={nextStep.ctaHref}>
                    <Button className="rounded-xl">
                      {nextStep.ctaText} <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>

                  {authUser ? (
                    <Link to="/user/settings">
                      <Button variant="outline" className="rounded-xl">
                        Ayarlar
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-orange-600" />
                Hesap
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              ) : authUser ? (
                <>
                  <div>
                    <span className="text-slate-500">Email:</span>{" "}
                    <span className="font-medium">{authUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">User ID:</span>{" "}
                    <span className="font-medium">{authUser.id}</span>
                  </div>
                  <div className="pt-2 flex gap-2 flex-wrap">
                    <Link to="/user/profile">
                      <Button className="rounded-xl">Profile Git</Button>
                    </Link>
                    <Link to="/user/settings">
                      <Button variant="outline" className="rounded-xl">
                        Ayarlara Git
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Bu alanı görmek için giriş yapmalısın.
                  </p>
                  <Link to="/login">
                    <Button className="rounded-xl">Giriş Yap</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-orange-600" />
                Seanslar
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              ) : !authUser ? (
                <p className="text-slate-600">Giriş yapınca seanslarını burada görürsün.</p>
              ) : sessionsCount === null ? (
                <p className="text-slate-600">
                  Seans verisi henüz bağlanmadı. (Tablo yoksa bu normal)
                </p>
              ) : sessionsCount === 0 ? (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Henüz seansın yok. Hemen koçları inceleyip ilk seansını planla.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      className="rounded-xl"
                      onClick={() => navigate("/coaches")}
                    >
                      Koçları İncele <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => navigate("/coach-selection-process")}
                    >
                      Nasıl Seçilir?
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>
                    Toplam seans: <span className="font-semibold">{sessionsCount}</span>
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => navigate("/book-session")}
                  >
                    Seansları Gör
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Ödemeler
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              ) : !authUser ? (
                <p className="text-slate-600">Giriş yapınca ödeme geçmişini burada görürsün.</p>
              ) : paymentsCount === null ? (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Ödeme modülü hazırlanıyor. (iyzico / alternatif sağlayıcı bağlanınca aktif)
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4" />
                    Kart bilgileri platformda saklanmaz.
                  </div>
                </div>
              ) : paymentsCount === 0 ? (
                <p className="text-slate-600">
                  Henüz ödeme kaydın yok. Seans oluşturduğunda burada görünecek.
                </p>
              ) : (
                <p>
                  Toplam ödeme: <span className="font-semibold">{paymentsCount}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary strip */}
        <div className="mt-8">
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Öneri: Doğru koçu daha hızlı bul
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Hedefini netleştir → filtrele → kısa liste yap → ilk görüşme planla.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link to="/how-it-works">
                    <Button variant="outline" className="rounded-xl">
                      Nasıl Çalışır?
                    </Button>
                  </Link>
                  <Link to="/coaches">
                    <Button className="rounded-xl">
                      Koçları İncele <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
