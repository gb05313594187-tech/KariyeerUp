// src/pages/Login.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
    orDivider: "veya",
    googleLogin: "Google ile Giriş Yap",
    googleError: "Google ile giriş sırasında bir hata oluştu.",
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
    orDivider: "or",
    googleLogin: "Sign in with Google",
    googleError: "An error occurred during Google sign in.",
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
    orDivider: "أو",
    googleLogin: "تسجيل الدخول باستخدام Google",
    googleError: "حدث خطأ أثناء تسجيل الدخول باستخدام Google.",
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
    orDivider: "ou",
    googleLogin: "Se connecter avec Google",
    googleError: "Une erreur s'est produite lors de la connexion avec Google.",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        console.error("Google login error:", error);
        toast.error(t.googleError);
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(t.googleError);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(t.errorCredentials);
        return;
      }

      if (!data.user) {
        toast.error(t.errorNotFound);
        return;
      }

      toast.success(t.success);

      const qs = new URLSearchParams(location.search);
      const next = qs.get("next");
      if (next) {
        navigate(next, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Giriş Hatası:", err);
      toast.error(t.errorGeneral);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#FFF5F2] p-4 ${isRTL ? "rtl text-right" : ""}`}>
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#D32F2F]">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-[#D32F2F] rounded-lg mx-auto flex items-center justify-center mb-2">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#D32F2F]">
            {t.title}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 font-semibold border-gray-300 hover:bg-gray-50"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? "..." : t.googleLogin}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">{t.orDivider}</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                required
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t.password}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#D32F2F] hover:underline font-medium"
                >
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e: any) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={isRTL ? "pl-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none ${isRTL ? "left-3" : "right-3"}`}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
              disabled={isLoading}
            >
              {isLoading ? t.submitting : t.submit}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 justify-center">
          <div className="text-sm text-gray-500">
            {t.noAccount}{" "}
            <Link
              to="/register"
              className="text-[#D32F2F] hover:underline font-semibold"
            >
              {t.register}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
