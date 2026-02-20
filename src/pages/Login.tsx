// src/pages/Login.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  tr: {
    title: "Giriş Yap",
    subtitle: "Devam etmek için hesabınıza giriş yapın",
    email: "E-posta",
    emailPlaceholder: "ornek@email.com",
    password: "Şifre",
    forgotPassword: "Şifremi Unuttum",
    submit: "Giriş Yap",
    submitting: "Giriş Yapılıyor...",
    noAccount: "Hesabınız yok mu?",
    register: "Kayıt Ol",
    errorCredentials: "E-posta veya şifre hatalı.",
    errorNotFound: "Kullanıcı bulunamadı.",
    errorGeneral: "Giriş sırasında bir hata oluştu.",
    success: "Giriş başarılı!",
    or: "veya",
    google: "Google ile Giriş Yap",
    linkedin: "LinkedIn ile Giriş Yap",
    socialError: "Giriş sırasında bir hata oluştu.",
  },
  en: {
    title: "Login",
    subtitle: "Sign in to your account to continue",
    email: "Email",
    emailPlaceholder: "example@email.com",
    password: "Password",
    forgotPassword: "Forgot Password",
    submit: "Login",
    submitting: "Logging in...",
    noAccount: "Don't have an account?",
    register: "Register",
    errorCredentials: "Invalid email or password.",
    errorNotFound: "User not found.",
    errorGeneral: "An error occurred during login.",
    success: "Login successful!",
    or: "or",
    google: "Sign in with Google",
    linkedin: "Sign in with LinkedIn",
    socialError: "An error occurred during sign in.",
  },
  ar: {
    title: "تسجيل الدخول",
    subtitle: "قم بتسجيل الدخول إلى حسابك للمتابعة",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@email.com",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور",
    submit: "تسجيل الدخول",
    submitting: "جاري تسجيل الدخول...",
    noAccount: "ليس لديك حساب؟",
    register: "إنشاء حساب",
    errorCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    errorNotFound: "المستخدم غير موجود.",
    errorGeneral: "حدث خطأ أثناء تسجيل الدخول.",
    success: "تم تسجيل الدخول بنجاح!",
    or: "أو",
    google: "تسجيل الدخول باستخدام Google",
    linkedin: "تسجيل الدخول باستخدام LinkedIn",
    socialError: "حدث خطأ أثناء تسجيل الدخول.",
  },
  fr: {
    title: "Connexion",
    subtitle: "Connectez-vous à votre compte pour continuer",
    email: "E-mail",
    emailPlaceholder: "exemple@email.com",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié",
    submit: "Se connecter",
    submitting: "Connexion en cours...",
    noAccount: "Vous n'avez pas de compte ?",
    register: "S'inscrire",
    errorCredentials: "E-mail ou mot de passe incorrect.",
    errorNotFound: "Utilisateur introuvable.",
    errorGeneral: "Une erreur s'est produite lors de la connexion.",
    success: "Connexion réussie !",
    or: "ou",
    google: "Se connecter avec Google",
    linkedin: "Se connecter avec LinkedIn",
    socialError: "Une erreur s'est produite lors de la connexion.",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const t = translations[language] || translations.tr;

  const handleSocialLogin = async (provider: "google" | "linkedin_oidc") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) toast.error(t.socialError);
    } catch {
      toast.error(t.socialError);
    }
  };

  // ✅ DÜZELTME: Session'ın yüklenmesini bekle ve window.location ile yönlendir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(t.errorCredentials);
        return;
      }

      if (!data.user) {
        toast.error(t.errorNotFound);
        return;
      }

      toast.success(t.success);

      // ✅ Session'ın tamamen yüklenmesini bekle
      await new Promise(resolve => setTimeout(resolve, 500));

      const qs = new URLSearchParams(location.search);
      const next = qs.get("next");
      
      // ✅ window.location ile yönlendir (React Router bazen session'ı kaçırıyor)
      window.location.href = next || "/";
    } catch {
      toast.error(t.errorGeneral);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
      {/* Arka plan blob'ları */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <Card className="relative w-full max-w-lg shadow-2xl border-0 overflow-hidden">
        {/* Üst renk şeridi */}
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

        {/* ── HEADER ── */}
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t.subtitle}</p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* ── SOSYAL BUTONLAR ── */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Button
              variant="outline"
              className="h-10 text-sm font-semibold border border-gray-200 hover:border-red-300 hover:bg-red-50/50"
              onClick={() => handleSocialLogin("google")}
            >
              <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.google}
            </Button>
            <Button
              variant="outline"
              className="h-10 text-sm font-semibold border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
              onClick={() => handleSocialLogin("linkedin_oidc")}
            >
              <svg className="w-4 h-4 mr-2 shrink-0" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t.linkedin}
            </Button>
          </div>

          {/* ── AYRAÇ ── */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-400">{t.or}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-posta */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                {t.email} *
              </Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-10 text-sm"
                placeholder={t.emailPlaceholder}
              />
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700">
                  {t.password} *
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-10 text-sm pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ── SUBMIT ── */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-500/20 disabled:opacity-60"
            >
              {isLoading ? t.submitting : t.submit}
            </Button>
          </form>

          {/* ── ALT LİNK ── */}
          <p className="mt-5 text-center text-sm text-gray-500">
            {t.noAccount}{" "}
            <Link to="/register" className="font-semibold text-red-600 hover:underline">
              {t.register}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
