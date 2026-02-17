// src/pages/Register.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Register() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "individual",
  });

  const t = {
    tr: {
      title: "Kayıt Ol",
      subtitle: "Yeni bir Kariyeer hesabı oluşturun",
      fullName: "Ad Soyad",
      email: "E-posta",
      password: "Şifre (En az 6 karakter)",
      confirmPassword: "Şifre Tekrar",
      accountType: "Hesap Türü",
      individual: "Bireysel Kullanıcı",
      coach: "Koç",
      company: "Şirket",
      kvkk: "KVKK Aydınlatma Metni'ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.",
      submit: "Kayıt Ol",
      submitting: "Kaydediliyor...",
      alreadyHaveAccount: "Zaten hesabınız var mı?",
      login: "Giriş Yap",
      kvkkError: "Lütfen KVKK metnini onaylayın.",
      passwordMismatch: "Şifreler eşleşmiyor!",
      passwordLength: "Şifre en az 6 karakter olmalı!",
      success: "Kayıt başarılı! Hoş geldin 👋",
      error: "Kayıt başarısız oldu",
      google: "Google ile Kayıt Ol",
      linkedin: "LinkedIn ile Kayıt Ol",
      or: "veya",
    },
    en: {
      title: "Register",
      subtitle: "Create a new Kariyeer account",
      fullName: "Full Name",
      email: "Email",
      password: "Password (Min. 6 characters)",
      confirmPassword: "Confirm Password",
      accountType: "Account Type",
      individual: "Individual User",
      coach: "Coach",
      company: "Company",
      kvkk: "I have read the Privacy Policy and consent to the processing of my personal data.",
      submit: "Register",
      submitting: "Registering...",
      alreadyHaveAccount: "Already have an account?",
      login: "Login",
      kvkkError: "Please accept the Privacy Policy.",
      passwordMismatch: "Passwords do not match!",
      passwordLength: "Password must be at least 6 characters!",
      success: "Registration successful! Welcome 👋",
      error: "Registration failed",
      google: "Sign up with Google",
      linkedin: "Sign up with LinkedIn",
      or: "or",
    },
    ar: {
      title: "إنشاء حساب",
      subtitle: "أنشئ حساب Kariyeer جديد",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور (6 أحرف على الأقل)",
      confirmPassword: "تأكيد كلمة المرور",
      accountType: "نوع الحساب",
      individual: "مستخدم فردي",
      coach: "مدرب",
      company: "شركة",
      kvkk: "لقد قرأت سياسة الخصوصية وأوافق على معالجة بياناتي الشخصية.",
      submit: "إنشاء حساب",
      submitting: "جاري التسجيل...",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      kvkkError: "يرجى الموافقة على سياسة الخصوصية.",
      passwordMismatch: "كلمات المرور غير متطابقة!",
      passwordLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل!",
      success: "تم التسجيل بنجاح! مرحباً بك 👋",
      error: "فشل التسجيل",
      google: "التسجيل باستخدام Google",
      linkedin: "التسجيل باستخدام LinkedIn",
      or: "أو",
    },
    fr: {
      title: "S'inscrire",
      subtitle: "Créer un nouveau compte Kariyeer",
      fullName: "Nom complet",
      email: "E-mail",
      password: "Mot de passe (Min. 6 caractères)",
      confirmPassword: "Confirmer le mot de passe",
      accountType: "Type de compte",
      individual: "Utilisateur individuel",
      coach: "Coach",
      company: "Entreprise",
      kvkk: "J'ai lu la Politique de confidentialité et j'accepte le traitement de mes données personnelles.",
      submit: "S'inscrire",
      submitting: "Inscription en cours...",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      login: "Se connecter",
      kvkkError: "Veuillez accepter la Politique de confidentialité.",
      passwordMismatch: "Les mots de passe ne correspondent pas !",
      passwordLength: "Le mot de passe doit contenir au moins 6 caractères !",
      success: "Inscription réussie ! Bienvenue 👋",
      error: "Échec de l'inscription",
      google: "S'inscrire avec Google",
      linkedin: "S'inscrire avec LinkedIn",
      or: "ou",
    },
  }[language || "tr"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kvkkAccepted) {
      toast.error(t.kvkkError);
      return;
    }
    if (formData.password.length < 6) {
      toast.error(t.passwordLength);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    try {
      const role =
        formData.userType === "coach"
          ? "coach"
          : formData.userType === "company"
          ? "corporate"
          : "user";

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName, role },
        },
      });

      if (error) throw error;

      await supabase.from("profiles").insert({
        id: data.user?.id,
        full_name: formData.fullName,
        email: formData.email,
        role,
      });

      toast.success(t.success);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(t.error + ": " + (err.message || "Bilinmeyen hata"));
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      value: "individual",
      label: t.individual,
      icon: "👤",
      gradient: "from-blue-500 to-cyan-500",
      ring: "ring-blue-400",
    },
    {
      value: "coach",
      label: t.coach,
      icon: "🎯",
      gradient: "from-purple-500 to-pink-500",
      ring: "ring-purple-400",
    },
    {
      value: "company",
      label: t.company,
      icon: "🏢",
      gradient: "from-emerald-500 to-teal-500",
      ring: "ring-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <Card className="relative w-full max-w-2xl shadow-2xl border-0 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

        <CardHeader className="text-center pt-12 pb-8 bg-gradient-to-b from-white/80 to-transparent">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl font-black">K</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
            {t.title}
          </h1>
          <p className="mt-3 text-lg text-gray-600 font-medium">{t.subtitle}</p>
        </CardHeader>

        <CardContent className="px-10 pb-12">
          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button
              variant="outline"
              className="h-14 text-base font-bold border-2 border-gray-200 hover:border-red-300 hover:bg-red-50/50"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: window.location.origin },
                })
              }
            >
              <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.google}
            </Button>
            <Button
              variant="outline"
              className="h-14 text-base font-bold border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50/50"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: "linkedin_oidc",
                  options: { redirectTo: window.location.origin },
                })
              }
            >
              <svg className="w-5 h-5 mr-2 shrink-0" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t.linkedin}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-bold">{t.or}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-bold text-gray-700">
                  {t.fullName} *
                </Label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="h-14 text-base border-2 border-gray-200 focus:border-red-500"
                  placeholder={t.fullName}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-bold text-gray-700">
                  {t.email} *
                </Label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-14 text-base border-2 border-gray-200 focus:border-red-500"
                  placeholder={t.email}
                />
              </div>
            </div>

            {/* Password + Confirm — with show/hide toggle */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-bold text-gray-700">
                  {t.password} *
                </Label>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-14 text-base border-2 border-gray-200 focus:border-red-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-bold text-gray-700">
                  {t.confirmPassword} *
                </Label>
                <div className="relative">
                  <Input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="h-14 text-base border-2 border-gray-200 focus:border-red-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* HESAP TÜRÜ */}
            <div className="space-y-4">
              <Label className="text-base font-bold text-gray-700">
                {t.accountType}
              </Label>

              <RadioGroup
                value={formData.userType}
                onValueChange={(v) =>
                  setFormData({ ...formData, userType: v })
                }
                className="grid grid-cols-3 gap-4"
              >
                {accountTypes.map((item) => {
                  const isSelected = formData.userType === item.value;
                  return (
                    <div key={item.value} className="relative group">
                      {/* Hidden radio for a11y */}
                      <RadioGroupItem
                        value={item.value}
                        id={item.value}
                        className="sr-only"
                      />

                      <label
                        htmlFor={item.value}
                        className={`
                          relative flex flex-col items-center justify-center
                          h-44 rounded-3xl cursor-pointer select-none
                          transition-all duration-300 overflow-hidden
                          ${
                            isSelected
                              ? `ring-4 ${item.ring} shadow-2xl -translate-y-1`
                              : "border-2 border-gray-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1"
                          }
                        `}
                      >
                        {/* Gradient background when selected */}
                        {isSelected && (
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                          />
                        )}

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center gap-3 p-4 text-center">
                          {/* Icon bubble */}
                          <div
                            className={`
                              w-16 h-16 rounded-2xl flex items-center justify-center text-4xl
                              transition-all duration-300 group-hover:scale-110
                              ${isSelected ? "bg-white/25" : "bg-gray-100"}
                            `}
                          >
                            {item.icon}
                          </div>

                          {/* Label text — always readable */}
                          <span
                            className={`
                              text-sm font-black tracking-tight leading-tight
                              ${isSelected ? "text-white" : "text-gray-800"}
                            `}
                          >
                            {item.label}
                          </span>
                        </div>

                        {/* Check badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle2 className="w-5 h-5 text-red-600" />
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* KVKK */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                id="kvkk"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-gray-300 accent-red-600 cursor-pointer"
              />
              <label
                htmlFor="kvkk"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                <Link
                  to="/privacy"
                  className="font-bold text-red-600 hover:underline"
                >
                  KVKK Aydınlatma Metni
                </Link>
                'ni okudum ve kişisel verilerimin işlenmesini onaylıyorum. *
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || !kvkkAccepted}
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-2xl shadow-red-500/30 disabled:opacity-60"
            >
              {isLoading ? t.submitting : t.submit}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t.alreadyHaveAccount}{" "}
              <Link
                to="/login"
                className="font-bold text-red-600 hover:underline"
              >
                {t.login}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
