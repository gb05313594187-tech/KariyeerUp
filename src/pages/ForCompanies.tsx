// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { 
  Shield, Zap, HeartHandshake, Briefcase, 
  ArrowRight, X, Mail
} from "lucide-react";
import { toast } from 'sonner';

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

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">

      {/* --- HERO SECTION --- */}
      <div className="relative bg-gray-900 text-white py-24 px-4 text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-orange-800/80 z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1 mb-6 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm border border-white/30">
            Kurumsal Çözümler
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Şirketinizin Potansiyelini <br/> Zirveye Taşıyın
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-10">
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

      {/* --- FORM BÖLÜMÜ --- */}
      <div id="contact-form" className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-red-600">
          <div className="bg-gray-50 p-8 text-center border-b">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Talep Edin</h2>
            <p className="text-gray-500">Kurumunuza özel çözümler için formu doldurun.</p>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-6">

              {/* FORM ALANLARI */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Şirket Adı</label>
                  <input 
                    required 
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Şirketiniz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Yetkili Kişi</label>
                  <input 
                    required 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">E-posta</label>
                  <input 
                    type="email"
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="ornek@sirket.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Telefon</label>
                  <input 
                    type="tel"
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="0555 000 00 00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Mesajınız</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 h-32 resize-none"
                  placeholder="İhtiyaçlarınızı kısaca anlatın..."
                />
              </div>

              {/* ---- GÜNCELLENEN BUTON ---- */}
              <button
                type="button"
                onClick={() => {
                  const mailBody = `
Şirket Adı: ${formData.companyName}
Yetkili Kişi: ${formData.contactPerson}
E-posta: ${formData.email}
Telefon: ${formData.phone}

Mesaj:
${formData.message}
                  `.trim();

                  window.location.href = 
                    `mailto:destek@kariyeer.com?subject=Kurumsal Demo Talebi&body=${encodeURIComponent(mailBody)}`;
                }}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-4 rounded-lg hover:from-red-700 hover:to-orange-600 shadow-lg"
              >
                Talebi Gönder →
              </button>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
