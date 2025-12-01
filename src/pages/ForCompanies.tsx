// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  TrendingDown, TrendingUp, Users, Heart, Zap, Building2, Target, CheckCircle2,
  ArrowRight, AlertTriangle, BedDouble, Frown, Brain, Mail, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForCompanies() {
  const navigate = useNavigate();
  const { language } = useLanguage();
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
    
    // Vercel Loglarına Kayıt
    console.log('KURUMSAL TALEP:', formData);
    
    setTimeout(() => {
      toast.success(
        language === 'tr' 
        ? 'Talebiniz alındı! Kurumsal ekibimiz en kısa sürede sizinle iletişime geçecek.'
        : 'Request received!'
      );
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

  const handleContactClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- İSTATİSTİKLER (2025) ---
  const statistics2025 = [
    { icon: <AlertTriangle className="h-10 w-10" />, value: '81%', label: 'Stres Kaynaklı Verim Kaybı', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { icon: <Frown className="h-10 w-10" />, value: '63%', label: 'Tükenmişlik Hissi', color: 'text-red-600', bgColor: 'bg-red-50' },
    { icon: <TrendingDown className="h-10 w-10" />, value: '70%', label: 'Düşen Bağlılık Oranı', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  // --- FAYDALAR ---
  const benefits = [
    { icon: <TrendingUp className="h-6 w-6" />, title: 'Performans Artışı', description: 'Koçluk alan ekiplerde %21 verimlilik artışı.' },
    { icon: <Users className="h-6 w-6" />, title: 'Yetenek Tutundurma', description: 'Çalışan bağlılığında 3 kata varan artış.' },
    { icon: <Building2 className="h-6 w-6" />, title: 'Yatırım Getirisi (ROI)', description: 'Kurumsal koçlukta %86 oranında ROI.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      {/* --- HERO SECTION (FOTOĞRAFLI & TURUNCU FİLTRELİ) --- */}
      <div className="relative bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat text-white py-24 px-4 text-center overflow-hidden">
        
        {/* Kırmızı/Turuncu Filtre Katmanı */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-orange-800/85 z-0"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm px-4 py-1 text-sm uppercase tracking-widest">
            Kurumsal Çözümler
          </Badge>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Şirketinizin Potansiyelini <br/> <span className="text-yellow-300">Zirveye Taşıyın</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-red-50 max-w-2xl mx-auto font-light drop-shadow">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve sürdürülebilir bir başarı kültürü oluşturun.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-red-50 font-bold py-6 px-10 text-lg shadow-xl transition-transform transform hover:-translate-y-1"
                onClick={handleContactClick}
            >
              Teklif Alın <Mail className="ml-2 h-5 w-5" />
            </Button>
            <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 font-bold py-6 px-10 text-lg"
                onClick={() => navigate('/coaches')}
            >
               Koçları İncele <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- İSTATİSTİKLER --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700">ARAŞTIRMALARA GÖRE</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Neden Kurumsal Destek Şart?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              2025 verilerine göre çalışan refahı, şirket başarısının en büyük anahtarıdır.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {statistics2025.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 group">
                <CardContent className="pt-8 pb-8">
                  <div className={`w-20 h-20 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <h3 className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</h3>
                  <p className="text-gray-700 font-bold text-lg">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- KAZANIMLAR (BENEFITS) --- */}
      <section className="py-20 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-red-600 mb-4">KARİYEER NE KAZANDIRIR?</h2>
            <p className="text-xl text-gray-600">Kanıtlanmış sonuçlarla çalışan refahı ve şirket performansı.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROGRAMLAR --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kurumsal Programlarımız</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Bireysel Koçluk", desc: "Çalışanlarınız için kişiselleştirilmiş gelişim.", feat: ["1-1 Seanslar", "Gizlilik", "Raporlama"] },
                { title: "Liderlik Gelişimi", desc: "Yöneticileriniz için özel yetkinlik programı.", feat: ["Yönetici Koçluğu", "360 Analiz", "Strateji"] },
                { title: "Ekip Koçluğu", desc: "Takım performansını artıran grup çalışmaları.", feat: ["Takım Dinamiği", "İletişim", "Ortak Hedef"] }
            ].map((program, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 border-t-4 border-t-red-600 group hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-red-100 transition-colors">
                    <Zap className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <p className="text-gray-600">{program.desc}</p>
                  <div className="space-y-3 pt-4 border-t">
                    {program.feat.map((f, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-sm text-gray-700 font-medium">
                        <CheckCircle2 className="h-5 w-5 text-green-500" /> {f}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gray-900 hover:bg-black text-white">Detaylı Bilgi</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEMO TALEP FORMU (KIRMIZI TEMA) --- */}
      <section id="contact-form" className="py-20 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-600 p-8 text-center text-white">
              <Target className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-2">DEMO TALEP EDİN</h2>
              <p className="text-red-100">Kurumunuza özel çözümler için formu doldurun, sizi arayalım.</p>
            </div>
            
            <CardContent className="p-8 md:p-10 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Şirket Adı</Label>
                    <Input 
                        required 
                        className="h-12"
                        value={formData.companyName} 
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} 
                        placeholder="Şirketiniz A.Ş."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Yetkili Kişi</Label>
                    <Input 
                        required 
                        className="h-12"
                        value={formData.contactPerson} 
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} 
                        placeholder="Adınız Soyadınız"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">E-posta</Label>
                    <Input 
                        type="email" 
                        required 
                        className="h-12"
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="ornek@sirket.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Telefon</Label>
                    <Input 
                        type="tel" 
                        required 
                        className="h-12"
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        placeholder="0555 000 00 00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Çalışan Sayısı</Label>
                    <Input 
                        className="h-12"
                        value={formData.employeeCount} 
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })} 
                        placeholder="Örn: 50-100"
                    />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-gray-700">Mesajınız</Label>
                  <Textarea 
                    value={formData.message} 
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                    rows={4}
                    placeholder="İhtiyaçlarınızı kısaca anlatın..."
                    className="resize-none"
                  />
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-6 text-lg h-auto shadow-lg transform transition-all hover:-translate-y-1" 
                    disabled={isSubmitting}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder →'}
                </Button>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                    Bu formu doldurarak KVKK Aydınlatma Metni'ni okuduğunuzu kabul edersiniz.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
