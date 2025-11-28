import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/forgot-password');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage(
        language === 'tr'
          ? 'Şifreler eşleşmiyor. Lütfen tekrar deneyin.'
          : language === 'en'
          ? 'Passwords do not match. Please try again.'
          : 'Les mots de passe ne correspondent pas. Veuillez réessayer.'
      );
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage(
        language === 'tr'
          ? 'Şifre en az 6 karakter olmalıdır.'
          : language === 'en'
          ? 'Password must be at least 6 characters.'
          : 'Le mot de passe doit contenir au moins 6 caractères.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setStatus('error');
        setMessage(
          language === 'tr'
            ? 'Şifre güncellenemedi. Lütfen tekrar deneyin.'
            : language === 'en'
            ? 'Failed to update password. Please try again.'
            : 'Échec de la mise à jour du mot de passe. Veuillez réessayer.'
        );
      } else {
        setStatus('success');
        setMessage(
          language === 'tr'
            ? 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...'
            : language === 'en'
            ? 'Your password has been successfully updated. Redirecting to login...'
            : 'Votre mot de passe a été mis à jour avec succès. Redirection vers la connexion...'
        );
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setStatus('error');
      setMessage(
        language === 'tr'
          ? 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
          : language === 'en'
          ? 'An error occurred. Please try again later.'
          : 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    title: {
      tr: 'Yeni Şifre Oluştur',
      en: 'Create New Password',
      fr: 'Créer un nouveau mot de passe',
    },
    description: {
      tr: 'Lütfen yeni şifrenizi girin',
      en: 'Please enter your new password',
      fr: 'Veuillez entrer votre nouveau mot de passe',
    },
    passwordLabel: {
      tr: 'Yeni Şifre',
      en: 'New Password',
      fr: 'Nouveau mot de passe',
    },
    confirmPasswordLabel: {
      tr: 'Şifre Tekrar',
      en: 'Confirm Password',
      fr: 'Confirmer le mot de passe',
    },
    passwordPlaceholder: {
      tr: 'En az 6 karakter',
      en: 'At least 6 characters',
      fr: 'Au moins 6 caractères',
    },
    updateButton: {
      tr: 'Şifreyi Güncelle',
      en: 'Update Password',
      fr: 'Mettre à jour le mot de passe',
    },
    updating: {
      tr: 'Güncelleniyor...',
      en: 'Updating...',
      fr: 'Mise à jour en cours...',
    },
  };

  const t = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[typeof key]];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-red-100 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{t('title')}</CardTitle>
            <CardDescription className="text-gray-600">{t('description')}</CardDescription>
          </CardHeader>

          <CardContent>
            {status === 'success' && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('passwordLabel')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPasswordLabel')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? t('updating') : t('updateButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}