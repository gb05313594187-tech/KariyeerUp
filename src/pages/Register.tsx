// @ts-nocheck
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

// @ts-ignore
import { supabase } from '@/lib/supabase'; 

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'individual'
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor!');
      setIsLoading(false);
      return;
    }

    try {
      // --- AŞAMA 1: KULLANICIYI AUTH TABLOSUNA KAYDET (Minimum Bilgi) ---
      // Sadece email ve password gönderiyoruz. Options bloğu kaldırıldı.
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });
      // ------------------------------------------

      if (error) {
        throw new Error(error.message);
      }

      // --- AŞAMA 2: PROFILES TABLOSUNA KAYIT (SADECE GEREKLİ ALANLAR) ---
      if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
              { 
                // Zorunlu alanları gönderiyoruz
                id: data.user.id, 
                full_name: formData.fullName,
                user_type: formData.userType,
                // Ekstra email/metadata alanlarını sildik
              }
          ]);
          
          if (profileError) {
              console.error("Profiles Insert Hatası:", profileError);
              throw new Error("Profil kaydı başarısız oldu.");
          }
      }


      toast.success('Kayıt başarılı! Lütfen e-postanıza gelen linki onaylayın.');
      navigate('/login');

    } catch (error: any) {
      console.error("Nihai Kayıt Hatası:", error);
      toast.error(`Kayıt başarısız oldu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Geri kalan JSX aynı) ...
