// @ts-nocheck
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("📨 YENİ İLETİŞİM FORMU:", formData);

    setTimeout(() => {
        toast.success("Mesajınız başarıyla alındı! Ekibimiz en kısa sürede dönüş yapacaktır.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <div className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bize Ulaşın</h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Sorularınız, önerileriniz veya işbirlikleri için yanınızdayız.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 w-full flex-1">
        <div className="grid md:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Kanalları</h2>
                <p className="text-gray-600 mb-8">
                    Aşağıdaki kanallardan bize ulaşabilir veya formu doldurabilirsiniz.
                </p>
            </div>

            <div className="space-y-6">
                <Card className="border-l-4 border-l-red-600 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <Mail className="w-6 h-6"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">E-posta</h3>
                            <p className="text-gray-600">destek@kariyeer.com</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-600 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Phone className="w-6 h-6"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Telefon</h3>
                            <p className="text-gray-600">0850 123 45 67</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-600 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <MapPin className="w-6 h-6"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Ofis</h3>
                            <p className="text-gray-600">Levent, İstanbul</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>

          <div>
            <Card className="shadow-lg border-t-4 border-t-gray-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5"/> Mesaj Gönder
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Adınız Soyadınız</Label>
                            <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>E-posta</Label>
                            <Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Konu</Label>
                            <Input required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Mesajınız</Label>
                            <Textarea required className="min-h-[120px]" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                        </div>
                        <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800" disabled={isSubmitting}>
                            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'} <Send className="ml-2 w-4 h-4"/>
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
