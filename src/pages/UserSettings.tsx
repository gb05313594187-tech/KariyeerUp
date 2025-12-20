// src/pages/UserSettings.tsx
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ShieldCheck,
  Mail,
  KeyRound,
  Bell,
  LogOut,
  ArrowRight,
  BadgeCheck,
  AlertTriangle,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function UserSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  const [resetLoading, setResetLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!mounted) return;
        setMe(data?.user || null);
      } catch (e) {
        console.error("UserSettings load error:", e);
        setMe(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const email = me?.email || "-";
  const emailVerified = !!me?.email_confirmed_at;
  const lastSignIn = useMemo(() => {
    const raw = me?.last_sign_in_at;
    if (!raw) return "-";
    try {
      return new Date(raw).toLocaleString();
    } catch {
      return raw;
    }
  }, [me]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("signOut error:", e);
    }
    try {
      localStorage.removeItem("kariyeer_user");
    } catch {}
    window.location.href = "/";
  };

  const sendPasswordReset = async () => {
    if (!me?.email) {
      toast.error("Şifre sıfırlama için giriş yapmış olmalısın.");
      return;
    }

    setResetLoading(true);
    try {
      // Not: Prod ortamında redirectTo domainin Supabase Auth ayarlarında allowlist’te olmalı.
      const redirectTo = `${window.location.origin}/login`;

      const { error } = await supabase.auth.resetPasswordForEmail(me.email, {
        redirectTo,
      });

      if (error) {
        console.error("resetPasswordForEmail error:", error);
        toast.error("Şifre sıfırlama maili gönderilemedi.");
        return;
      }

      toast.success("Şifre sıfırlama bağlantısı e-posta adresine gönderildi.");
    } catch (e) {
      console.error(e);
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setResetLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!me?.email) {
      toast.error("Doğrulama için giriş yapmış olmalısın.");
      return;
    }
    if (emailVerified) {
      toast.success("E-posta zaten doğrulanmış.");
      return;
    }

    setResendLoading(true);
    try {
      // Supabase JS v2: resend mevcut; bazı kurulumlarda farklı olabilir.
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: me.email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      } as any);

      if (error) {
        console.error("resend error:", error);
        toast.error("Doğrulama maili tekrar gönderilemedi.");
        return;
      }

      toast.success("Doğrulama maili tekrar gönderildi.");
    } catch (e) {
      console.error(e);
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setResendLoading(false);
    }
  };

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
          <p className="text-xs text-white/90">User Settings</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">
            Ayarlar
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl">
            Hesabın, güvenlik seçeneklerin ve temel tercihlerin burada.
          </p>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Button
              className="rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => navigate("/user/profile")}
            >
              Profile Git <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/70 text-white hover:bg-white/10"
              onClick={() => navigate("/user/dashboard")}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {!me ? (
          <Card className="border-slate-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Ayarları görmek için giriş yap
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Giriş yapınca güvenlik ve hesap seçeneklerin burada görünecek.
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
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Account */}
            <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-600" /> Hesap
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
                      {email}
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

                  <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {emailVerified ? (
                            <BadgeCheck className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">E-posta doğrulama</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {emailVerified ? "Doğrulandı" : "Doğrulanmadı"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Doğrulama, güvenlik ve teslimat (mail/bildirim) kalitesi için önemli.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        disabled={resendLoading || emailVerified}
                        onClick={resendVerification}
                      >
                        {resendLoading ? "Gönderiliyor..." : "Tekrar gönder"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => navigate("/user/profile")}
                  >
                    Profile Git
                  </Button>
                  <Button
                    className="rounded-xl bg-orange-600 hover:bg-orange-500"
                    onClick={() => navigate("/coaches")}
                  >
                    Koçları İncele <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600" /> Güvenlik
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <KeyRound className="h-4 w-4" />
                    Şifre
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    Şifreni sıfırlamak için e-postana güvenli bir bağlantı göndeririz.
                  </p>
                  <Button
                    className="mt-3 w-full rounded-xl"
                    disabled={resetLoading}
                    onClick={sendPasswordReset}
                  >
                    {resetLoading ? "Gönderiliyor..." : "Şifre sıfırlama maili gönder"}
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Bell className="h-4 w-4" />
                    Bildirimler
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    Bildirim tercihleri MVP’de sade tutuldu. (İstersen sonraki adımda ekleriz.)
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 w-full rounded-xl"
                    onClick={() => navigate("/how-it-works")}
                  >
                    Nasıl çalışır?
                  </Button>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-700 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">Tehlikeli Alan</p>
                      <p className="mt-1 text-xs text-red-800">
                        Çıkış yaptığında oturum kapanır ve cihazdaki yerel kullanıcı kaydı temizlenir.
                      </p>
                    </div>
                  </div>

                  <Button
                    className="mt-3 w-full rounded-xl bg-red-600 hover:bg-red-700 text-white"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
