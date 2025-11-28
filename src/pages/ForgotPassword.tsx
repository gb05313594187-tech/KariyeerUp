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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

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
      setError(getNavText(
        'Bir hata oluştu. Lütfen tekrar deneyin.',
        'An error occurred. Please try again.',
        'Une erreur s\'est produite. Veuillez réessayer.'
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {getNavText('Geri Dön', 'Go Back', 'Retour')}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {getNavText('Şifremi Unuttum', 'Forgot Password', 'Mot de passe oublié')}
            </CardTitle>
            <CardDescription>
              {getNavText(
                'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.',
                'Enter your email address and we\'ll send you a password reset link.',
                'Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation du mot de passe.'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {getNavText(
                    'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.',
                    'A password reset link has been sent to your email address. Please check your inbox.',
                    'Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception.'
                  )}
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
                    {getNavText('E-posta', 'Email', 'E-mail')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={getNavText('ornek@email.com', 'example@email.com', 'exemple@email.com')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? (
                    getNavText('Gönderiliyor...', 'Sending...', 'Envoi en cours...')
                  ) : (
                    getNavText('Sıfırlama Bağlantısı Gönder', 'Send Reset Link', 'Envoyer le lien de réinitialisation')
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}