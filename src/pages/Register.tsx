// src/pages/Register.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  tr: {
    title: "Kayıt Ol",
    subtitle: "Yeni bir Kariyeer hesabı oluşturun",
    fullName: "Ad Soyad",
    fullNamePlaceholder: "Adınız Soyadınız",
    email: "E-posta",
    emailPlaceholder: "ornek@email.com",
    password: "Şifre (En az 6 karakter)",
    confirmPassword: "Şifre Tekrar",
    accountType: "Hesap Türü",
    individual: "Bireysel Kullanıcı",
    coach: "Koç",
    company: "Şirket",
    kvkkText: "'ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.",
    kvkkLink: "KVKK Aydınlatma Metni",
    submit: "Kayıt Ol",
    submitting: "Kaydediliyor...",
    alreadyHaveAccount: "Zaten hesabınız var mı?",
    login: "Giriş Yap",
    kvkkError: "Devam etmek için KVKK Aydınlatma Metni'ni onaylamalısınız.",
    passwordMismatch: "Şifreler eşleşmiyor!",
    success: "Kayıt başarılı!",
    error: "Kayıt başarısız",
    orDivider: "veya",
    googleRegister: "Google ile Kayıt Ol",
    googleError: "Google ile kayıt sırasında bir hata oluştu.",
  },
  en: {
    title: "Register",
    subtitle: "Create a new Kariyeer account",
    fullName: "Full Name",
    fullNamePlaceholder: "Your Full Name",
    email: "Email",
    emailPlaceholder: "example@email.com",
    password: "Password (At least 6 characters)",
    confirmPassword: "Confirm Password",
    accountType: "Account Type",
    individual: "Individual User",
    coach: "Coach",
    company: "Company",
    kvkkText: " and I consent to the processing of my personal data.",
    kvkkLink: "Privacy Policy",
    submit: "Register",
    submitting: "Registering...",
    alreadyHaveAccount: "Already have an account?",
    login: "Login",
    kvkkError: "You must accept the Privacy Policy to continue.",
    passwordMismatch: "Passwords do not match!",
    success: "Registration successful!",
    error: "Registration failed",
    orDivider: "or",
    googleRegister: "Sign up with Google",
    googleError: "An error occurred during Google sign up.",
  },
  ar: {
    title: "إنشاء حساب",
    subtitle: "أنشئ حساب Kariyeer جديد",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@email.com",
    password: "كلمة المرور (6 أحرف على الأقل)",
    confirmPassword: "تأكيد كلمة المرور",
    accountType: "نوع الحساب",
    individual: "مستخدم فردي",
    coach: "مدرب",
    company: "شركة",
    kvkkText: " وأوافق على معالجة بياناتي الشخصية.",
    kvkkLink: "سياسة الخصوصية",
    submit: "إنشاء حساب",
    submitting: "جاري التسجيل...",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    kvkkError: "يجب الموافقة على سياسة الخصوصية للمتابعة.",
    passwordMismatch: "كلمات المرور غير متطابقة!",
    success: "تم التسجيل بنجاح!",
    error: "فشل التسجيل",
    orDivider: "أو",
    googleRegister: "التسجيل باستخدام Google",
    googleError: "حدث خطأ أثناء التسجيل باستخدام Google.",
  },
  fr: {
    title: "S'inscrire",
    subtitle: "Créez un nouveau compte Kariyeer",
    fullName: "Nom complet",
    fullNamePlaceholder: "Votre nom complet",
    email: "E-mail",
    emailPlaceholder: "exemple@email.com",
    password: "Mot de passe (Au moins 6 caractères)",
    confirmPassword: "Confirmer le mot de passe",
    accountType: "Type de compte",
    individual: "Utilisateur individuel",
    coach: "Coach",
    company: "Entreprise",
    kvkkText: " et je consens au traitement de mes données personnelles.",
    kvkkLink: "Politique de confidentialité",
    submit: "S'inscrire",
    submitting: "Inscription en cours...",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
    kvkkError: "Vous devez accepter la Politique de confidentialité pour continuer.",
    passwordMismatch: "Les mots de passe ne correspondent pas !",
    success: "Inscription réussie !",
    error: "Échec de l'inscription",
    orDivider: "ou",
    googleRegister: "S'inscrire avec Google",
    googleError: "Une erreur s'est produite lors de l'inscription avec Google.",
  },
};

export default function Register() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "individual",
  });

  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  const mapRole = (userType: string) => {
    if (userType === "coach") return "coach";
    if (userType === "company") return "corporate";
    return "user";
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        console.error("Google register error:", error);
        toast.error(t.googleError);
      }
    } catch (err) {
      console.error("Google register error:", err);
      toast.error(t.googleError);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!kvkkAccepted) {
      toast.error(t.kvkkError);
      return;
    }

    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error(t.passwordMismatch);
      setIsLoading(false);
      return;
    }

    try {
      const role = mapRole(formData.userType);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.fullName,
            role,
            user_type: formData.userType,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            display_name: formData.fullName,
            role,
            user_type: formData.userType,
            kvkk_consent: true,
            consent_date: new Date().toISOString(),
            phone: null,
            country: null,
          },
        ]);

        if (profileError) {
          console.error("Profil insert hatası:", profileError);
        }
      }

      toast.success(t.success);

      if (formData.userType === "coach") {
        navigate("/coach-application");
      } else {
        setTimeout(() => navigate("/login"), 300);
      }
    } catch (err: any) {
      console.error("Kayıt hatası:", err);
      toast.error(`${t.error}: ${err.message}`);
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
          {/* Google Register Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 font-semibold border-gray-300 hover:bg-gray-50"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? "..." : t.googleRegister}
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
              <Label htmlFor="fullName">{t.fullName} *</Label>
              <Input
                id="fullName"
                placeholder={t.fullNamePlaceholder}
                required
                value={formData.fullName}
                onChange={(e: any) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email} *</Label>
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
              <Label htmlFor="password">{t.password} *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e: any) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword} *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e: any) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>{t.accountType}</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) =>
                  setFormData({ ...formData, userType: value })
                }
                className="flex flex-col space-y-1"
              >
                <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">{t.individual}</Label>
                </div>
                <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                  <RadioGroupItem value="coach" id="coach" />
                  <Label htmlFor="coach">{t.coach}</Label>
                </div>
                <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company">{t.company}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* KVKK Onay Kutusu */}
            <div className={`flex items-start py-2 ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
              <input
                type="checkbox"
                id="kvkk"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#D32F2F] focus:ring-[#D32F2F]"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
              />
              <label htmlFor="kvkk" className="text-xs text-gray-600 leading-tight">
                <Link to="/privacy" className="text-[#D32F2F] hover:underline font-semibold underline">
                  {t.kvkkLink}
                </Link>
                {t.kvkkText} *
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
              disabled={isLoading || !kvkkAccepted}
            >
              {isLoading ? t.submitting : t.submit}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            {t.alreadyHaveAccount}{" "}
            <Link
              to="/login"
              className="text-[#D32F2F] hover:underline font-semibold"
            >
              {t.login}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
