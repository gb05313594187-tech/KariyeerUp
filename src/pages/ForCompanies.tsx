// @ts-nocheck
import { useState } from 'react';
import { Building2, TrendingUp, Users, Mail, ArrowRight, CheckCircle, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Bildirim için
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ForCompanies() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // FORM SİMÜLASYONU
    setTimeout(() => {
        console.log("📨 YENİ İLETİŞİM MESAJI:", formData);
        
        toast.success("Mesajınız destek@kariyeer.com adresine başarıyla iletildi! En kısa sürede dönüş yapacağız.");
        
        setFormData({ name: '', email: '', phone: '', message: '' });
        setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* HERO SECTION */}
      <div className="bg-blue-900 text-white py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800 text-blue-200 text-sm font-semibold mb-6">
            🏢 Kurumsal Çözümler
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Şirketinizin Potansiyelini Ortaya Çıkarın
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve kurum kültürünüzü güçlendirin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="w-5 h-5"/> İletişime Geçin
            </button>
            <button 
                className="border border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg transition-colors"
                onClick={() => navigate('/coaches')}
            >
                🔍 Koçları İncele
            </button>
          </div>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-4">📈</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">%21</div>
            <div className="font-semibold text-lg mb-3">Performans Artışı</div>
            <p className="text-gray-600">Profesyonel koçluk alan ekiplerde gözlemlenen ortalama verimlilik artışı.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-4">🤝</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">3x</div>
            <div className="font-semibold text-lg mb-3">Çalışan Bağlılığı</div>
            <p className="text-gray-600">Gelişimine yatırım yapılan çalışanların şirkete bağlılık oranı artar.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-4">💰</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">%86</div>
            <div className="font-semibold text-lg mb-3">Yatırım Getirisi</div>
            <p className="text-gray-600">Kurumsal koçluk programlarının geri dönüş oranı.</p>
          </div>
        </div>
      </div>

      {/* İLETİŞİM FORMU BÖLÜMÜ */}
      <div id="contact-form" className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Bizimle İletişime Geçin</h2>
                <p className="text-gray-600">Kurumunuza özel çözümler için formu doldurun, size ulaşalım.</p>
            </div>

            <Card className="shadow-xl border-t-4 border-t-blue-900">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Ad Soyad / Yetkili</Label>
                                <Input 
                                    required 
                                    placeholder="Adınız Soyadınız" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Şirket Adı</Label>
                                <Input placeholder="Şirketinizin Adı" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>E-posta Adresi</Label>
                                <Input 
                                    type="email" 
                                    required 
                                    placeholder="ornek@sirket.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Telefon Numarası</Label>
                                <Input 
                                    type="tel" 
                                    required 
                                    placeholder="0555 000 00 00" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Mesajınız</Label>
                            <Textarea 
                                required 
                                placeholder="İhtiyaçlarınızı kısaca anlatın..." 
                                className="h-32"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg font-bold" disabled={isSubmitting}>
                            {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'} <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                        
                        <p className="text-xs text-center text-gray-500 mt-4">
                            Bu formu doldurarak <a href="#" className="underline text-blue-900">Aydınlatma Metni</a>'ni okuduğunuzu kabul edersiniz.
                        </p>
                    </form>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-600">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900"><Mail className="w-6 h-6"/></div>
                    <p className="font-medium">destek@kariyeer.com</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-600">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900"><Phone className="w-6 h-6"/></div>
                    <p className="font-medium">0850 123 45 67</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-600">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900"><MessageSquare className="w-6 h-6"/></div>
                    <p className="font-medium">Canlı Destek (09:00 - 18:00)</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}
