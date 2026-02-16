import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const translations = {
  tr: {
    back: "Geri Dön",
    title: "Şifremi Unuttum",
    subtitle: "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.",
    email: "E-posta",
    emailPlaceholder: "ornek@email.com",
    submit: "Sıfırlama Bağlantısı Gönder",
    submitting: "Gönderiliyor...",
    success: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.",
    error: "Bir hata oluştu. Lütfen tekrar deneyin.",
  },
  en: {
    back: "Go Back",
    title: "Forgot Password",
    subtitle: "Enter your email address and we'll send you a password reset link.",
    email: "Email",
    emailPlaceholder: "example@email.com",
    submit: "Send Reset Link",
    submitting: "Sending...",
    success: "A password reset link has been sent to your email address. Please check your inbox.",
    error: "An error occurred. Please try again.",
  },
  ar: {
    back: "رجوع",
    title: "نسيت كلمة المرور",
    subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@email.com",
    submit: "إرسال رابط إعادة التعيين",
    submitting: "جاري الإرسال...",
    success: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },
  fr: {
    back: "Retour",
    title: "Mot de passe oublié",
    subtitle: "Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation du mot de passe.",
    email: "E-mail",
    emailPlaceholder: "exemple@email.com",
    submit: "Envoyer le lien de réinitialisation",
    submitting: "Envoi en cours...",
    success: "Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception.",
    error: "Une erreur s'est produite. Veuillez réessayer.",
  },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 ${isRTL ? "rtl text-right" : ""}`}>
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-4"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
          {t.back}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t.title}
            </CardTitle>
            <CardDescription>
              {t.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {t.success}
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute top-3 h-5 w-5 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={isRTL ? "pr-10" : "pl-10"}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? t.submitting : t.submit}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
