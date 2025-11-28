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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Register() {
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client' as 'client' | 'coach' | 'company',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Registration attempt started:', formData.email);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: language === 'tr' ? 'Şifreler Eşleşmiyor ✗' : language === 'en' ? 'Passwords Do Not Match ✗' : 'Les mots de passe ne correspondent pas ✗',
        description: language === 'tr' ? 'Lütfen aynı şifreyi iki kez girin' : language === 'en' ? 'Please enter the same password twice' : 'Veuillez entrer le même mot de passe deux fois',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast({
        title: language === 'tr' ? 'Şifre Çok Kısa ✗' : language === 'en' ? 'Password Too Short ✗' : 'Mot de passe trop court ✗',
        description: language === 'tr' ? 'Şifre en az 6 karakter olmalıdır' : language === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caractères',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.userType
      );
      
      console.log('Registration result:', result);
      
      if (result.success) {
        toast({
          title: language === 'tr' ? 'Kayıt Başarılı ✓' : language === 'en' ? 'Registration Successful ✓' : 'Inscription réussie ✓',
          description: language === 'tr' ? 'Hesabınız oluşturuldu! Giriş yapabilirsiniz.' : language === 'en' ? 'Your account has been created! You can now log in.' : 'Votre compte a été créé! Vous pouvez maintenant vous connecter.',
          duration: 4000,
        });
        
        console.log('Navigating to login page...');
        
        // Navigate to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast({
          title: language === 'tr' ? 'Kayıt Başarısız ✗' : language === 'en' ? 'Registration Failed ✗' : 'Échec de l\'inscription ✗',
          description: result.message || (language === 'tr' ? 'Kayıt sırasında bir hata oluştu' : language === 'en' ? 'An error occurred during registration' : 'Une erreur s\'est produite lors de l\'inscription'),
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
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
              {language === 'tr' ? 'Kayıt Ol' : language === 'en' ? 'Register' : 'S\'inscrire'}
            </CardTitle>
            <CardDescription>
              {language === 'tr' 
                ? 'Yeni bir Kariyeer hesabı oluşturun' 
                : language === 'en' 
                ? 'Create a new Kariyeer account' 
                : 'Créer un nouveau compte Kariyeer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  {language === 'tr' ? 'Ad Soyad' : language === 'en' ? 'Full Name' : 'Nom complet'}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  disabled={isLoading}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={language === 'tr' ? 'Adınız Soyadınız' : language === 'en' ? 'Your Full Name' : 'Votre nom complet'}
                />
              </div>

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
                <Label htmlFor="password">
                  {language === 'tr' ? 'Şifre (En az 6 karakter)' : language === 'en' ? 'Password (At least 6 characters)' : 'Mot de passe (Au moins 6 caractères)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {language === 'tr' ? 'Şifre Tekrar' : language === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {language === 'tr' ? 'Hesap Türü' : language === 'en' ? 'Account Type' : 'Type de compte'}
                </Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value as 'client' | 'coach' | 'company' })}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client" className="font-normal cursor-pointer">
                      {language === 'tr' ? 'Bireysel Kullanıcı' : language === 'en' ? 'Individual User' : 'Utilisateur individuel'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coach" id="coach" />
                    <Label htmlFor="coach" className="font-normal cursor-pointer">
                      {language === 'tr' ? 'Koç' : language === 'en' ? 'Coach' : 'Coach'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="font-normal cursor-pointer">
                      {language === 'tr' ? 'Şirket' : language === 'en' ? 'Company' : 'Entreprise'}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading
                  ? (language === 'tr' ? 'Kayıt yapılıyor...' : language === 'en' ? 'Registering...' : 'Inscription...')
                  : (language === 'tr' ? 'Kayıt Ol' : language === 'en' ? 'Register' : 'S\'inscrire')
                }
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {language === 'tr' ? 'Zaten hesabınız var mı?' : language === 'en' ? 'Already have an account?' : 'Vous avez déjà un compte?'}
              </span>{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                {language === 'tr' ? 'Giriş Yap' : language === 'en' ? 'Login' : 'Connexion'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}