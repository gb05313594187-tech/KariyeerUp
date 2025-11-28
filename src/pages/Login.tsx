import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Login attempt started:', formData.email);
    
    try {
      const result = await login(formData.email, formData.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        toast({
          title: language === 'tr' ? 'Giriş Başarılı ✓' : language === 'en' ? 'Login Successful ✓' : 'Connexion réussie ✓',
          description: language === 'tr' ? 'Hoş geldiniz!' : language === 'en' ? 'Welcome back!' : 'Bienvenue!',
          duration: 3000,
        });
        
        console.log('Navigating to home page...');
        
        // Navigate immediately
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Force reload to ensure auth state is updated
        }, 1000);
      } else {
        toast({
          title: language === 'tr' ? 'Giriş Başarısız ✗' : language === 'en' ? 'Login Failed ✗' : 'Échec de la connexion ✗',
          description: result.message || (language === 'tr' ? 'E-posta veya şifre hatalı' : language === 'en' ? 'Invalid email or password' : 'Email ou mot de passe invalide'),
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: language === 'tr' ? 'Hata ✗' : language === 'en' ? 'Error ✗' : 'Erreur ✗',
        description: language === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : language === 'en' ? 'An error occurred. Please try again.' : 'Une erreur s\'est produite. Veuillez réessayer.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    
    console.log('Quick login attempt with demo account');
    
    try {
      const result = await login('demo@kariyeer.com', 'demo123');
      
      console.log('Quick login result:', result);
      
      if (result.success) {
        toast({
          title: language === 'tr' ? 'Demo Girişi Başarılı ✓' : language === 'en' ? 'Demo Login Successful ✓' : 'Connexion démo réussie ✓',
          description: language === 'tr' ? 'Demo hesabıyla giriş yaptınız' : language === 'en' ? 'Logged in with demo account' : 'Connecté avec le compte démo',
          duration: 3000,
        });
        
        console.log('Navigating to home page...');
        
        // Navigate immediately
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Force reload to ensure auth state is updated
        }, 1000);
      } else {
        toast({
          title: language === 'tr' ? 'Demo Hesabı Bulunamadı ✗' : language === 'en' ? 'Demo Account Not Found ✗' : 'Compte démo introuvable ✗',
          description: language === 'tr' ? 'Lütfen önce /register sayfasından demo hesabını oluşturun (demo@kariyeer.com / demo123)' : language === 'en' ? 'Please create the demo account first at /register (demo@kariyeer.com / demo123)' : 'Veuillez d\'abord créer le compte démo sur /register (demo@kariyeer.com / demo123)',
          variant: 'destructive',
          duration: 7000,
        });
      }
    } catch (error) {
      console.error('Quick login error:', error);
      toast({
        title: language === 'tr' ? 'Hata ✗' : language === 'en' ? 'Error ✗' : 'Erreur ✗',
        description: language === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : language === 'en' ? 'An error occurred. Please try again.' : 'Une erreur s\'est produite. Veuillez réessayer.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'tr' ? 'Ana Sayfaya Dön' : language === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}
        </Link>

        <Card className="border-2 border-red-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">K</span>
            </div>
            <CardTitle className="text-3xl text-red-600">
              {language === 'tr' ? 'Giriş Yap' : language === 'en' ? 'Login' : 'Connexion'}
            </CardTitle>
            <CardDescription>
              {language === 'tr' 
                ? 'Kariyeer hesabınıza giriş yapın' 
                : language === 'en' 
                ? 'Sign in to your Kariyeer account' 
                : 'Connectez-vous à votre compte Kariyeer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === 'tr' ? 'E-posta' : language === 'en' ? 'Email' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={language === 'tr' ? 'ornek@email.com' : language === 'en' ? 'example@email.com' : 'exemple@email.com'}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    {language === 'tr' ? 'Şifre' : language === 'en' ? 'Password' : 'Mot de passe'}
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {language === 'tr' ? 'Şifremi Unuttum?' : language === 'en' ? 'Forgot Password?' : 'Mot de passe oublié?'}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading 
                  ? (language === 'tr' ? 'Giriş yapılıyor...' : language === 'en' ? 'Logging in...' : 'Connexion...')
                  : (language === 'tr' ? 'Giriş Yap' : language === 'en' ? 'Login' : 'Connexion')
                }
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {language === 'tr' ? 'veya' : language === 'en' ? 'or' : 'ou'}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleQuickLogin}
                disabled={isLoading}
              >
                {language === 'tr' ? 'Demo Hesabıyla Giriş Yap' : language === 'en' ? 'Login with Demo Account' : 'Connexion avec compte démo'}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {language === 'tr' ? 'Hesabınız yok mu?' : language === 'en' ? 'Don\'t have an account?' : 'Vous n\'avez pas de compte?'}
              </span>{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
                {language === 'tr' ? 'Kayıt Ol' : language === 'en' ? 'Register' : 'S\'inscrire'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}