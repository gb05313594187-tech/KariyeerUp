// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { 
  Shield, Zap, HeartHandshake, Briefcase, 
  ArrowRight, X, Mail
} from "lucide-react";
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";

// Supabase Functions base URL (Vite env'den okunuyor)
const FUNCTIONS_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export default function ForCompanies() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: ''
  });

  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Yetenek Tutundurma",
      shortDesc: "Çalışanlarınıza yatırım yaparak aidiyet duygusunu güçlendirin.",
      fullDesc: "Yetenekli çalışanları elde tutmak, yenilerini bulmaktan çok daha ekonomiktir. Koçluk programlarımızla çalışanlarınızın kariyer yollarını şirketiniz içinde çizmelerine yardımcı oluyor, aidiyet duygusunu artırıyoruz.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600",
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      id: 2,
      icon: Zap,
      title: "Çevik Liderlik",
      shortDesc: "Yöneticilerinizin kriz anlarında hızlı karar alma becerilerini geliştirin.",
      fullDesc: "Liderlik koçluğu ile yöneticilerinize çeviklik, duygusal zeka ve kriz yönetimi yetkinlikleri kazandırıyor, ekiplerine ilham veren liderlere dönüşmelerini sağlıyoruz.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      id: 3,
      icon: HeartHandshake,
      title: "İletişim Kültürü",
      shortDesc: "Departmanlar arası siloları yıkarak şeffaf bir kültür inşa edin.",
      fullDesc: "Takım koçluğu çalışmalarımızla departmanlar arası duvarları yıkıyor, geri bildirim kültürünü yerleştiriyor ve ortak hedefe koşan ekipler yaratıyoruz.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      id: 4,
      icon: Briefcase,
      title: "İş-Yaşam Dengesi",
      shortDesc: "Tükenmişliği önleyerek çalışanlarınızın mutluluğunu sağlayın.",
      fullDesc: "Wellbeing odaklı koçluklarımızla çalışanlarınızın stres yönetimi becerilerini artırıyor, tükenmişlik sendromunu önlüyor ve dengeyi kurmalarını sağlıyoruz.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  // ----------------- FORM SUBMIT (SUPABASE + EDGE FUNCTION) -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { companyName, contactPerson, email, phone, message } = formData;

    try {
      // 1) Supabase'e kaydet
      const { error } = await supabase
        .from("company_requests") // Supabase tablon
        .insert({
          company_name: companyName,
          contact_person: contactPerson,
          email,
          phone,
          message,
          source: "for-companies-page",
        });

      if (error) {
        console.error("Kurumsal talep kaydedilemedi:", error);
        toast.error("Talebiniz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }

      // 2) Mail gönderen Edge Function çağrısı
      try {
        await fetch(`${FUNCTIONS_BASE_URL}/send-company-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            contactPerson,
            email,
            phone,
            message,
          }),
        });
      } catch (mailErr) {
        console.error("Mail gönderilemedi:", mailErr);
        // İstersen buraya ayrıca uyarı toast'ı ekleyebilirsin:
        // toast.error("Talep kaydedildi ancak mail bildirimi gönderilemedi.");
      }

      toast.success("Talebiniz alındı! Kurumsal ekibimiz en kısa sürede sizinle iletişime geçecek.");
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* HERO SECTION (GÖRSELLİ & TURUNCU/KIRMIZI FİLTRELİ) */}
      <div className="relative bg-gray-900 text-white py-24 px-4 text-center overflow-hidden">
        {/* Arka Plan Resmi */}
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* Kırmızı/Turuncu Filtre Katmanı */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-orange-800/80 z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1 mb-6 bg-white/20 text-white rounded-full text-sm font-bold backdrop-blur-sm border border-white/30">
            Kurumsal Çözümler
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Şirketinizin Potansiyelini <br/> Zirveye Taşıyın
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-10 font-light drop-shadow">
            Çalışanlarınızın yetkinliklerini geliştirin, liderlik becerilerini artırın ve sürdürülebilir bir başarı kültürü oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-red-600 hover:bg-red-50 font-bold py-4 px-10 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" /> Teklif Alın
            </button>
            <button
              onClick={() => navigate('/coaches')}
              className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl transition-all"
            >
              Koçları İncele
            </button>
          </div>
        </div>
      </div>

      {/* --- İNTERAKTİF KAZANIMLAR BÖLÜMÜ --- */}
      <div className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 font-bold tracking-wider text-sm uppercase">Değer Önerimiz</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">İşbirliğimizin Katacağı Değerler</h2>
            <p className="text-gray-500 mt-4">Detayları görmek için kutulara tıklayın.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7"/>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.shortDesc}
                </p>
                <div className="mt-4 text-red-600 text-sm font-bold flex items:center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Detayları Gör <ArrowRight className="w-4 h-4"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- DETAY POPUP --- */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>

            <div className="h-48 w-full relative">
              <img src={selectedFeature.image} alt={selectedFeature.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items=end p-6">
                <h2 className="text-white text-2xl font-bold">{selectedFeature.title}</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${selectedFeature.bg} ${selectedFeature.color}`}>
                <selectedFeature.icon className="w-4 h-4" />
                <span>Kariyeer.com Çözümü</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {selectedFeature.fullDesc}
              </p>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors font-medium"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- İLETİŞİM FORMU --- */}
      <div id="contact-form" className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-red-600">
          <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Talep Edin</h2>
            <p className="text-gray-500">Kurumunuza özel çözümler için formu doldurun.</p>
          </div>
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Şirket Adı</label>
                  <input 
                    required 
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    placeholder="Şirketiniz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Yetkili Kişi</label>
                  <input 
                    required 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    placeholder="ornek@sirket.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    placeholder="0555 000 00 00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all h-32 resize-none"
                  placeholder="İhtiyaçlarınızı kısaca anlatın..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-4 rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
