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
  const isRTL = language === "ar";

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

        <CardContent>
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
