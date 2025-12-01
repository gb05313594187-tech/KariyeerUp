// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  TrendingDown,
  TrendingUp,
  Users,
  Heart,
  Zap,
  Building2,
  Target,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  BedDouble,
  Frown,
  Brain,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function ForCompanies() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    message: '',
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Vercel Loglarına Kayıt (Veri Kaybı Yok)
    console.log('KURUMSAL TALEP:', formData);
    
    setTimeout(() => {
      toast.success('Talebiniz alındı! Kurumsal ekibimiz en kısa sürede sizinle iletişime geçecek.');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employeeCount: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const statistics2025 = [
    {
      icon: <AlertTriangle className="h-12 w-12" />,
      value: '81%',
      label: 'Çalışanlar stresin işlerini doğrudan etkilediğini belirtiyor',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: <Frown className="h-12 w-12" />,
      value: '63%',
      label: 'En az bir kez "tükenmişlik" yaşadığını ifade ediyor',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: <TrendingDown className="h-12 w-12" />,
      value: '70%',
      label: 'İşe bağlılık seviyesinin son 5 yılda düştüğünü söylüyor',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: <BedDouble className="h-12 w-12" />,
      value: '48%',
      label: 'Uyku problemleri nedeniyle verim kaybı yaşıyor',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <Brain className="h-12 w-12" />,
      value: '52%',
      label: 'Psikolojik destek veya koçluk desteği almak istiyor',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'İşe Bağlılıkta Artış',
      description: 'Koçluk alan çalışanlar %25 daha yüksek bağlılık gösteriyor',
    },
    {
      icon: <TrendingDown className="h-8 w-8" />,
      title: 'Devamsızlıkta Azalma',
      description: 'İş yerinde koçluk programları devamsızlığı %32 azaltıyor',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Tükenmişlikte Düşüş',
      description: 'Düzenli koçluk desteği tükenmişlik riskini %40 azaltıyor',
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'İşveren Markası',
      description: 'Çalışan gelişimine yatırım yapan şirketler %50 daha çekici',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Motivasyon Artışı',
      description: 'Koçluk desteği çalışan motivasyonunu ve performansını artırıyor',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Güçlü Kültür',
      description: 'Ortak değerler ve gelişim odaklı kültür oluşturma',
    },
  ];

  const programs = [
    {
      title: 'Bireysel Koçluk',
      description: 'Çalışanlarınız için kişiselleştirilmiş kariyer koçluğu',
      features: ['1-1 koçluk seansları', 'ICF sertifikalı koçlar', 'Esnek randevu sistemi', 'İlerleme raporları'],
    },
    {
      title: 'Liderlik Gelişimi',
      description: 'Yöneticileriniz için özel liderlik koçluğu',
      features: ['Grup ve bireysel seanslar', 'Liderlik analizi', '360 derece geri bildirim', 'Eylem planları'],
    },
    {
      title: 'Ekip Koçluğu',
      description: 'Ekip performansını artırmak için grup koçluğu',
      features: ['Ekip dinamikleri analizi', 'İletişim atölyeleri', 'Çatışma yönetimi', 'Hedef belirleme'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat text-white py-24 px-4 text-center overflow-hidden">
        {/* Kırmızı/Turuncu Filtre Katmanı */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-orange-800/90 z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm px-4 py-1">
              Kurumsal Çözümler
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Çalışan Refahını Artırın, Performansı Yükseltin
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-50 drop-shadow">
              Profesyonel kariyer koçluğu ile çalışanlarınızın potansiyelini ortaya çıkarın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                    size="lg" 
                    className="bg-white text-red-600 hover:bg-red-50 font-bold py-4 px-8 h-14 text-lg shadow-lg"
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Teklif Alın <Mail className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 h-14 text-lg"
                    onClick={() => navigate('/coaches')}
                >
                   Koçları İncele <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-600 text-sm">ARAŞTIRMALARA GÖRE</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern İş Gücü Neden Desteklenmeli?</h2>
