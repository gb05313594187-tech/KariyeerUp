// src/pages/Register.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Eye, EyeOff, Sparkles, Rocket, ShieldCheck, Phone, Briefcase } from "lucide-react";
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
  
  // Modal States
  const [showIntro, setShowIntro] = useState(true); 
  const [showSetup, setShowSetup] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "", 
  });

  const t = {
    tr: {
      title: "Kayıt Ol",
      subtitle: "Yeni bir Kariyeer hesabı oluşturun",
      fullName: "AD SOYAD",
      email: "E-POSTA",
      password: "ŞİFRE (EN AZ 6 KARAKTER)",
      confirmPassword: "ŞİFRE TEKRAR",
      accountType: "Hesap Türü",
      individual: "Bireysel Kullanıcı",
      coach: "Koç",
      company: "Şirket",
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
      or: "VEYA",
      roleRequired: "Lütfen hesap türünü seçin.",
      introTitle: "Kariyeer'e Hoş Geldin!",
      introSub: "Yapay zeka destekli kariyer yolculuğuna başlamadan önce kısa bir tur atalım.",
      introBtn: "Hadi Başlayalım!",
      setupTitle: "Profilini Tamamla",
      setupSub: "Sana daha iyi hizmet verebilmemiz için bu bilgiler önemli.",
      phone: "Telefon Numaran",
      industry: "Uzmanlık Alanın / Sektör",
      saveBtn: "Kaydet ve Devam Et",
      laterBtn: "Daha Sonra"
    },
    en: {
      title: "Register",
      subtitle: "Create a new Kariyeer account",
      fullName: "FULL NAME",
      email: "EMAIL",
      password: "PASSWORD (MIN. 6 CHARS)",
      confirmPassword: "CONFIRM PASSWORD",
      accountType: "Account Type",
      individual: "Individual",
      coach: "Coach",
      company: "Company",
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
      or: "OR",
      roleRequired: "Please select account type.",
      introTitle: "Welcome to Kariyeer!",
      introSub: "Let's take a quick tour before starting.",
      introBtn: "Let's Start!",
      setupTitle: "Complete Your Profile",
      setupSub: "This info is important for us.",
      phone: "Phone Number",
      industry: "Expertise / Industry",
      saveBtn: "Save and Continue",
      laterBtn: "Later"
    }
  }[language || "tr"] || {};

  const accountTypes = [
    { value: "individual", label: t.individual, icon: "👤", gradient: "from-blue-500 to-cyan-500", ring: "ring-blue-400" },
    { value: "coach", label: t.coach, icon: "🎯", gradient: "from-purple-500 to-pink-500", ring: "ring-purple-400" },
    { value: "company", label: t.company, icon: "🏢", gradient: "from-emerald-500 to-teal-500", ring: "ring-emerald-400" },
  ];

  const getRole = (type: string) => {
    if (type === "coach") return "coach";
    if (type === "company") return "company"; 
    return "client";
  };

  const handleSocialLogin = async (provider: "google" | "linkedin_oidc") => {
    if (!formData.userType) {
      toast.error(t.roleRequired);
      return;
    }
    try {
      const role = getRole(formData.userType);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
          queryParams: { access_type: 'offline', prompt: 'select_account' }
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error("Sosyal giriş hatası.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userType) { toast.error(t.roleRequired); return; }
    if (!kvkkAccepted) { toast.error(t.kvkkError); return; }
    if (formData.password.length < 6) { toast.error(t.passwordLength); return; }
    if (formData.password !== formData.confirmPassword) { toast.error(t.passwordMismatch); return; }

    setIsLoading(true);
    try {
      const selectedRole = getRole(formData.userType);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { 
          data: { 
            full_name: formData.fullName, 
            role: selectedRole // Supabase Trigger'ı bu 'role' anahtarını bekliyor
          } 
        },
      });

      if (error) throw error;

      toast.success(t.success);
      setShowSetup(true); // Başarılıysa Setup modalını aç
    } catch (err: any) {
      console.error("Register Error:", err);
      toast.error(t.error + ": " + (err.message || "Veritabanı hatası"));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* --- TANITIM MODALI --- */}
      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl animate-in fade-in zoom-in duration-300">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Rocket className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{t.introTitle}</h2>
              <p className="text-sm text-gray-500 mt-2">{t.introSub}</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-2xl">
                <Sparkles className="w-6 h-6 text-orange-600 shrink-0" />
                <p className="text-sm font-medium text-orange-900">Yapay Zeka ile CV Analizi ve Eşleşme</p>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                <p className="text-sm font-medium text-blue-900">Güvenilir Koçlar ve Doğrulanmış Şirketler</p>
              </div>
              <Button 
                onClick={() => setShowIntro(false)} 
                className="w-full h-14 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-black rounded-2xl shadow-lg shadow-red-500/30 hover:scale-[1.02] transition-transform"
              >
                {t.introBtn}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- KAYIT SONRASI KURULUM MODALI --- */}
      {showSetup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-xl p-4">
          <Card className="w-full max-w-lg border-2 border-orange-100 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">{t.setupTitle}</h2>
              <p className="text-sm text-gray-500">{t.setupSub}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Phone className="w-4 h-4" /> {t.phone}</Label>
                <Input placeholder="+90 5xx xxx xx xx" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {t.industry}</Label>
                <Input placeholder="Örn: Frontend Developer" className="h-12 rounded-xl" />
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-gray-800"
                >
                  {t.saveBtn}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")} 
                  className="w-full h-12 text-gray-500 font-semibold"
                >
                  {t.laterBtn}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- ANA KAYIT FORMU --- */}
      <Card className="relative w-full max-w-lg shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 uppercase tracking-tighter italic">
            KARIYEER<span className="text-orange-500">UP</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500 font-medium">{t.subtitle}</p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-3 mb-6">
            <Label className="text-xs font-bold text-gray-700 uppercase">{t.accountType} *</Label>
            <RadioGroup
              value={formData.userType}
              onValueChange={(v) => setFormData({ ...formData, userType: v })}
              className="grid grid-cols-3 gap-3"
            >
              {accountTypes.map((item) => {
                const isSelected = formData.userType === item.value;
                return (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={item.value} className="sr-only" />
                    <label
                      htmlFor={item.value}
                      className={`relative flex flex-col items-center justify-center gap-2 h-24 rounded-2xl cursor-pointer select-none overflow-hidden transition-all duration-200 ${
                        isSelected ? `ring-2 ${item.ring} shadow-lg scale-[1.03]` : "border border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {isSelected && <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90`} />}
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${isSelected ? "bg-white/25" : "bg-gray-100"}`}>
                          {item.icon}
                        </span>
                        <span className={`text-[10px] md:text-xs font-bold leading-tight text-center ${isSelected ? "text-white" : "text-gray-700"}`}>
                          {item.label}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-white z-20" />}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" type="button" className="h-10 text-xs font-bold border-gray-200 hover:bg-gray-50" onClick={() => handleSocialLogin("google")}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {t.google}
            </Button>
            <Button variant="outline" type="button" className="h-10 text-xs font-bold border-gray-200 hover:bg-gray-50" onClick={() => handleSocialLogin("linkedin_oidc")}>
              <svg className="w-4 h-4 mr-2" fill="#0A66C2" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              {t.linkedin}
            </Button>
          </div>

          <div className="relative mb-6 text-center">
            <span className="px-4 bg-white relative z-10 text-[10px] text-gray-400 font-bold tracking-widest">{t.or}</span>
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-gray-500 uppercase ml-1">{t.fullName}</Label>
                <Input required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="h-11 text-sm focus:ring-red-500 rounded-xl bg-gray-50/50 border-gray-200" placeholder="AD SOYAD" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-gray-500 uppercase ml-1">{t.email}</Label>
                <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 text-sm focus:ring-red-500 rounded-xl bg-gray-50/50 border-gray-200" placeholder="EMAIL@ADRES.COM" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-gray-500 uppercase ml-1">{t.password}</Label>
                <div className="relative">
                  <Input required type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="h-11 text-sm pr-10 rounded-xl bg-gray-50/50 border-gray-200" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-gray-500 uppercase ml-1">{t.confirmPassword}</Label>
                <div className="relative">
                  <Input required type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="h-11 text-sm pr-10 rounded-xl bg-gray-50/50 border-gray-200" />
                  <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 py-2">
              <input type="checkbox" id="kvkk" checked={kvkkAccepted} onChange={(e) => setKvkkAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-red-600 cursor-pointer shrink-0" />
              <label htmlFor="kvkk" className="text-[10px] text-gray-500 leading-tight select-none">
                <Link to="/privacy" className="font-bold text-red-600 hover:underline">KVKK Aydınlatma Metni</Link>'ni okudum ve kabul ediyorum. *
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !kvkkAccepted || !formData.userType} 
              className="w-full h-14 text-base font-black bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl shadow-xl shadow-red-500/20 hover:scale-[1.01] transition-transform disabled:opacity-70"
            >
              {isLoading ? t.submitting : t.submit}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            {t.alreadyHaveAccount} <Link to="/login" className="font-black text-red-600 hover:underline">{t.login}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
