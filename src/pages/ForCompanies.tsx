// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  TrendingDown, TrendingUp, Users, Heart, Zap, Building2, Target, CheckCircle2,
  ArrowRight, AlertTriangle, BedDouble, Frown, Brain
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner'; // Profesyonel bildirim

export default function ForCompanies() {
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

    // --- VERCEL LOGLARINA KAYIT (VERİ KAYBOLMAZ) ---
    console.log("🚨 [YENİ KURUMSAL TEKLİF] 🚨");
    console.log("Şirket:", formData.companyName);
    console.log("Yetkili:", formData.contactPerson);
    console.log("İletişim:", formData.phone, formData.email);
    console.log("Mesaj:", formData.message);
    // -----------------------------------------------

    setTimeout(() => {
        toast.success(
          language === 'tr'
            ? 'Talebiniz başarıyla alındı! Kurumsal ekibimiz en kısa sürede size ulaşacak.'
            : 'Request received! Our corporate team will contact you shortly.'
        );
        
        // Formu temizle
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          employeeCount: '',
          message: '',
        });
        setIsSubmitting(false);
    }, 1000);
  };

  const handleContactClick = () => {
    const formElement = document.getElementById('demo-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const statistics2025 = [
    { icon: <AlertTriangle className="h-12 w-12" />, value: '81%', label: language === 'tr' ? 'Çalışanlar stresin işlerini doğrudan etkilediğini belirtiyor' : 'Employees report stress directly affects their work', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { icon: <Frown className="h-12 w-12" />, value: '63%', label: language === 'tr' ? 'En az bir kez "tükenmişlik" yaşadığını ifade ediyor' : 'Report experiencing burnout at least once', color: 'text-red-600', bgColor: 'bg-red-100' },
    { icon: <TrendingDown className="h-12 w-12" />, value: '70%', label: language === 'tr' ? 'İşe bağlılık seviyesinin son 5 yılda düştüğünü söylüyor' : 'Say engagement levels dropped in the last 5 years', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: <BedDouble className="h-12 w-12" />, value: '48%', label: language === 'tr' ? 'Uyku problemleri nedeniyle verim kaybı yaşıyor' : 'Experience productivity loss due to sleep problems', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: <Brain className="h-12 w-12" />, value: '52%', label: language === 'tr' ? 'Psikolojik destek veya koçluk desteği almak istiyor' : 'Want psychological support or coaching', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  ];

  const benefits = [
    { icon: <TrendingUp className="h-8 w-8" />, title: 'İşe Bağlılıkta Artış', description: 'Koçluk alan çalışanlar %25 daha yüksek bağlılık gösteriyor' },
    { icon: <TrendingDown className="h-8 w-8" />, title: 'Devamsızlıkta Azalma', description: 'İş yerinde koçluk programları devamsızlığı %32 azaltıyor' },
    { icon: <Heart className="h-8 w-8" />, title: 'Tükenmişlikte Düşüş', description: 'Düzenli koçluk desteği tükenmişlik riskini %40 azaltıyor' },
    { icon: <Building2 className="h-8 w-8" />, title: 'İşveren Markası', description: 'Çalışan gelişimine yatırım yapan şirketler %50 daha çekici' },
    { icon: <Users className="h-8 w-8" />, title: 'Motivasyon Artışı', description: 'Koçluk desteği çalışan motivasyonunu ve performansını artırıyor' },
    { icon: <Target className="h-8 w-8" />, title: 'Güçlü Kültür', description: 'Ortak değerler ve gelişim odaklı kültür oluşturma' },
  ];

  const programs = [
    { title: 'Bireysel Koçluk', description: 'Çalışanlarınız için kişiselleştirilmiş kariyer koçluğu', features: ['1-1 seanslar', 'ICF koçlar', 'Esnek randevu', 'Raporlama'] },
    { title: 'Liderlik Gelişimi', description: 'Yöneticileriniz için özel liderlik koçluğu', features: ['Grup/Bireysel', 'Liderlik analizi', '360 derece geri bildirim', 'Eylem planları'] },
    { title: 'Ekip Koçluğu', description: 'Ekip performansını artırmak için grup koçluğu', features: ['Ekip dinamiği', 'İletişim atölyesi', 'Çatışma yönetimi', 'Hedef belirleme'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white text-red-600 hover:bg-white">Kurumsal Çözümler</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Çalışan Refahını Artırın, Performansı Yükseltin
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-50">
              Profesyonel kariyer koçluğu ile çalışanlarınızın potansiyelini ortaya çıkarın.
            </p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 font-bold" onClick={handleContactClick}>
                Teklif Alın <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Neden Kurumsal Koçluk?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics2025.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-2">
                <CardContent className="pt-6">
                    <div className={`w-20 h-20 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${stat.color}`}>
                    {stat.icon}
                    </div>
                    <h3 className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                    <p className="text-gray-700 font-medium">{stat.label}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-red-600">Kariyeer Size Ne Kazandırır?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader>
                    <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                    {benefit.icon}
                    </div>
                    <CardTitle className="text-xl text-red-600">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Programlarımız</h2>
            <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow border-red-100">
                <CardHeader>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Zap className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-red-600 text-center">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center">{program.description}</p>
                    <div className="space-y-2">
                    {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
      </section>

      {/* Demo Form */}
      <section id="demo-form" className="py-16 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-red-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-red-600 mb-2">DEMO TALEP EDİN</CardTitle>
              <p className="text-gray-600">Kurumunuza özel çözümler için formu doldurun.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Şirket Adı *</Label>
                    <Input required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Yetkili Kişi *</Label>
                    <Input required value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-posta *</Label>
                    <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon *</Label>
                    <Input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label>Çalışan Sayısı</Label>
                    <Input value={formData.employeeCount} onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })} placeholder="Örn: 50-100"/>
                </div>
                <div className="space-y-2">
                    <Label>Mesajınız</Label>
                    <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-6" disabled={isSubmitting}>
                  {isSubmitting ? 'Gönderiliyor...' : 'Demo Talep Et'} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
