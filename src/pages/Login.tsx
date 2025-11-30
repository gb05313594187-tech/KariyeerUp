// @ts-nocheck
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // SİMÜLASYON GİRİŞİ + HAFIZAYA KAYIT
    setTimeout(() => {
        // BU SATIR ÇOK ÖNEMLİ: Tarayıcıya "Ben girdim" diye not bırakıyoruz.
        localStorage.setItem('kariyeer_user', JSON.stringify({ 
            email: formData.email, 
            name: 'Kullanıcı', 
            isLoggedIn: true 
        }));
        
        // Navbar'ı tetikle (sayfa yenilenmeden algılasın diye)
        window.dispatchEvent(new Event("storage"));

        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
        navigate('/dashboard'); 
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F2] p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#D32F2F]">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-[#D32F2F] rounded-lg mx-auto flex items-center justify-center mb-2">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#D32F2F]">Giriş Yap</CardTitle>
          <CardDescription>
            Kariyeer hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ornek@email.com"
                required
                value={formData.email}
                onChange={(e: any) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link to="/forgot-password" class="text-sm text-[#D32F2F] hover:underline">
                  Şifremi Unuttum?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required
                value={formData.password}
                onChange={(e: any) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold" disabled={isLoading}>
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FFF5F2] px-2 text-gray-500">veya</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                  // DEMO GİRİŞİ İÇİN DE KAYIT
                  localStorage.setItem('kariyeer_user', JSON.stringify({ email: 'demo@kariyeer.com', name: 'Demo Kullanıcı', isLoggedIn: true }));
                  window.dispatchEvent(new Event("storage"));
                  toast.success("Demo hesabıyla giriş yapıldı");
                  navigate('/dashboard');
              }}
            >
              Demo Hesabıyla Giriş Yap
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-[#D32F2F] hover:underline font-semibold">
              Kayıt Ol
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
