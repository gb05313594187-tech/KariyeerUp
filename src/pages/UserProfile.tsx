// src/pages/UserProfile.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Calendar,
  ArrowRight,
  LogIn,
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data?.user || null;
        if (!mounted) return;

        setMe(user);

        if (!user) {
          setProfile(null);
          return;
        }

        // profiles tablon varsa alır. Yoksa hata alsa da sayfa kırılmaz.
        try {
          const { data: pData, error: pErr } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (!pErr) setProfile(pData || null);
        } catch (e) {
          setProfile(null);
        }
      } catch (e) {
        console.error("UserProfile load error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const displayName =
    profile?.full_name ||
    profile?.name ||
    me?.user_metadata?.full_name ||
    me?.email?.split("@")?.[0] ||
    "Kullanıcı";

  const completion = useMemo(() => {
    if (!me) return 0;
    const checks = [
      !!(profile?.full_name || profile?.name || me?.user_metadata?.full_name),
      !!(profile?.phone || me?.phone),
      !!(profile?.city || profile?.location),
      !!(profile?.title || profile?.job_title),
      !!(profile?.industry),
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [me, profile]);

  const lastSignIn = useMemo(() => {
    const raw = me?.last_sign_in_at;
    if (!raw) return "-";
    try {
      const d = new Date(raw);
      return d.toLocaleString();
    } catch {
      return raw;
    }
  }, [me]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-700">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-xs text-white/90">User Profile</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">
            {displayName}
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Profil bilgilerin, koç eşleşmelerini ve seans deneyimini doğrudan etkiler.
            Ne kadar net olursan, sonuç o kadar hızlı gelir.
          </p>

          {/* Completion */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-white/90">
              <span>Profil tamamlanma</span>
              <span className="font-semibold">%{me ? completion : 0}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/25 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${me ? completion : 0}%` }} />
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-6 flex gap-2 flex-wrap">
            <Button
              className="rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => navigate("/user/dashboard")}
            >
              Dashboard <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="rounded-xl border-white/70 text-white hover:bg-white/10"
              onClick={() => navigate("/coaches")}
            >
              Koçları İncele
            </Button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Not logged in */}
        {!me ? (
          <Card className="border-slate-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Profilini görmek için giriş yap
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Giriş yapınca hesap bilgilerin ve profil alanların burada görünecek.
                  </p>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Link to="/login">
                      <Button className="rounded-xl">Giriş Yap</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="rounded-xl">
                        Kayıt Ol
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Account */}
              <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" /> Hesap Bilgileri
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-slate-700">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {me?.email || "-"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <BadgeCheck className="h-4 w-4" />
                        User ID
                      </div>
                      <div className="mt-1 font-mono text-xs text-slate-900 break-all">
                        {me?.id || "-"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <ShieldCheck className="h-4 w-4" />
                        Son giriş
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {lastSignIn}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Phone className="h-4 w-4" />
                        Telefon
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {profile?.phone || me?.phone || "-"}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        *Profil tablon yoksa bu alan boş görünebilir.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2 flex-wrap">
                    <Button
                      className="rounded-xl"
                      onClick={() => navigate("/user/settings")}
                    >
                      Ayarlar
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => navigate("/how-it-works")}
                    >
                      Nasıl çalışır?
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile snapshot */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-600" /> Profil Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 space-y-3">
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Unvan</p>
                      <p className="font-semibold text-slate-900">
                        {profile?.title || profile?.job_title || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Sektör</p>
                      <p className="font-semibold text-slate-900">
                        {profile?.industry || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Şehir</p>
                      <p className="font-semibold text-slate-900">
                        {profile?.city || profile?.location || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Önerilen</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Profilin %{completion}. %{completion < 70 ? "Biraz daha tamamla, eşleşme kalitesi yükselsin." : "Gayet iyi. Seans planlamaya hazırsın."}
                    </p>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button
                        className="rounded-xl w-full"
                        onClick={() => navigate("/coaches")}
                      >
                        Koçları İncele <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl w-full"
                        onClick={() => navigate("/book-session")}
                      >
                        Seanslar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom strip */}
            <div className="mt-6">
              <Card className="border-slate-200 bg-slate-50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-slate-900" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Hızlı akış
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Hedefini netleştir → koçları filtrele → ilk seansı planla → aksiyon planı oluştur.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="rounded-xl"
                        onClick={() => navigate("/coach-selection-process")}
                      >
                        Koç seçimi rehberi
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate("/user/dashboard")}
                      >
                        Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
