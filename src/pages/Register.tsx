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
  },
};

export default function Register() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
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

        <CardContent>
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
