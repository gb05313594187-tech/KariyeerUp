// @ts-nocheck
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

// SUPABASE BAĞLANTISINI AÇIYORUZ
// @ts-ignore
import { supabase } from '@/lib/supabase';
// @ts-ignore
import { useAuth } from '@/contexts/AuthContext'; // AuthContext'i de kullanıyoruz

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext'ten login fonksiyonunu al
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // --- GERÇEK GİRİŞ İŞLEMİ (Supabase Auth) ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      // ------------------------------------------

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // AuthContext'e kullanıcı bilgisini kaydet
        login(data.user); 
        toast.success('Giriş başarılı!');
        navigate('/dashboard'); // Başarılı girişte dashboard'a yönlendir
      } else {
         // Bu kısım normalde çalışmamalı, ama güvenlik için
        toast.error('Giriş başarısız oldu. Kullanıcı bulunamadı.');
      }

    } catch (error: any) {
      console.error("Giriş Hatası:", error);
      // Hata mesajlarını kullanıcıya daha anlaşılır göster
      if (error.message.includes('Invalid login credentials')) {
         toast.error('E-posta veya şifre hatalı. Lütfen kontrol edin.');
      } else {
         toast.error(`Giriş başarısız oldu: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
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
            Devam etmek için hesabınıza giriş yapın
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
              <Label htmlFor="password">Şifre</Label>
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
