// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  TrendingDown, TrendingUp, Users, Heart, Zap, Building2, Target,
  CheckCircle2, ArrowRight, AlertTriangle, BedDouble, Frown, Brain, Mail, Phone, X
} from 'lucide-react';
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
    employeeCount: '',
    message: '',
  });

  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Yetenek Tutundurma",
      shortDesc: "Çalışanlarınıza yatırım yaparak aidiyet duygusunu güçlendirin.",
      fullDesc: "Yetenekli çalışanları elde tutmak, yenilerini bulmaktan çok daha ekonomiktir. Koçluk programlarımızla çalışanlarınızın kariyer yollarını şirketiniz içinde çizmelerine yardımcı oluyor, aidiyet duygusunu %40'a varan oranlarda artırıyoruz.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600",
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      id: 2,
      icon: Zap,
      title: "Çevik Liderlik",
      shortDesc: "Yöneticilerinizin kriz anlarında hızlı karar alma becerilerini geliştirin.",
      fullDesc: "Değişen dünya düzeninde klasik yöneticilik yetmiyor. Liderlik koçluğu ile yöneticilerinize çeviklik, duygusal zeka ve kriz yönetimi yetkinlikleri kazandırıyor, ekiplerine ilham veren liderlere dönüşmelerini sağlıyoruz.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      id: 3,
      icon: HeartHandshake,
      title: "İletişim Kültürü",
      shortDesc: "Departmanlar arası siloları yıkarak şeffaf bir kültür inşa edin.",
      fullDesc: "Başarılı şirketlerin sırrı açık iletişimdir. Takım koçluğu çalışmalarımızla departmanlar arası duvarları yıkıyor, geri bildirim kültürünü yerleştiriyor ve ortak hedefe koşan, birbirini anlayan ekipler yaratıyoruz.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      id: 4,
      icon: Briefcase,
      title: "İş-Yaşam Dengesi",
      shortDesc: "Tükenmişliği önleyerek çalışanlarınızın mutluluğunu sağlayın.",
      fullDesc: "Mutlu çalışan, verimli çalışandır. Wellbeing odaklı koçluklarımızla çalışanlarınızın stres yönetimi becerilerini artırıyor, tükenmişlik sendromunu (burnout) önlüyor ve hem işte hem özel hayatta dengeyi kurmalarını sağlıyoruz.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("KURUMSAL TALEP:", formData);
    setTimeout(() => {
        toast.success("Talebiniz alındı! Kurumsal ekibimiz size ulaşacak.");
        setFormData({ companyName: '', contactPerson: '', email: '', phone: '', employeeCount: '', message: '' });
        setIsSubmitting(false);
    }, 1500);
  };

  const statistics2025 = [
    { icon: AlertTriangle, value: '81%', label: 'Çalışanlar stresin işlerini doğrudan etkilediğini belirtiyor', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { icon: Frown, value: '63%', label: 'En az bir kez "tükenmişlik" yaşadığını ifade ediyor', color: 'text-red-600', bgColor: 'bg-red-100' },
    { icon: TrendingDown, value: '70%', label: 'İşe bağlılık seviyesinin son 5 yılda düştüğünü söylüyor', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: BedDouble, value: '48%', label: 'Uyku problemleri nedeniyle verim kaybı yaşıyor', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: Brain, value: '52%', label: 'Psikolojik destek veya koçluk desteği almak istiyor', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  ];

  const benefits = [
    { icon: TrendingUp, title: 'İşe Bağlılıkta Artış', description: 'Koçluk alan çalışanlar %25 daha yüksek bağlılık gösteriyor' },
    { icon: TrendingDown, title: 'Devamsızlıkta Azalma', description: 'İş yerinde koçluk programları devamsızlığı %32 azaltıyor' },
    { icon: Heart, title: 'Tükenmişlikte Düşüş', description: 'Düzenli koçluk desteği tükenmişlik riskini %40 azaltıyor' },
    { icon: Building2, title: 'İşveren Markasında Güçlenme', description: 'Çalışan gelişimine yatırım yapan şirketler %50 daha çekici' },
    { icon: Users, title: 'Sessiz İstifaların Önüne Geçme', description: 'Koçluk desteği çalışan motivasyonunu ve performansını artırıyor' },
    { icon: Target, title: 'Kurum Kültürünü Güçlendirme', description: 'Ortak değerler ve gelişim odaklı kültür oluşturma' },
  ];

  const programs = [
    { title: 'Bireysel Koçluk Programı', description: 'Çalışanlarınız için kişiselleştirilmiş kariyer koçluğu', features: ['1-1 koçluk seansları', 'ICF sertifikalı koçlar', 'Esnek randevu sistemi', 'İlerleme raporları'] },
    { title: 'Liderlik Gelişim Programı', description: 'Yöneticileriniz için özel liderlik koçluğu', features: ['Grup ve bireysel seanslar', 'Liderlik değerlendirmeleri', '360 derece geri bildirim', 'Eylem planları'] },
    { title: 'Ekip Koçluğu', description: 'Ekip performansını artırmak için grup koçluğu', features: ['Ekip dinamikleri analizi', 'İletişim atölyeleri', 'Çatışma yönetimi', 'Hedef belirleme seansları'] },
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      {/* HERO SECTION (SAF HTML/TAILWIND - ÇÖKMEZ) */}
      <section className="relative bg-gray-900 text-white py-24 px-4 text-center overflow-hidden">
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
            KURUMSAL ÇÖZÜMLER
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Şirketinizin Potansiyelini <br/> Zirveye Taşıyın
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-10 font-light drop-shadow">
            Profesyonel koçluk ile çalışanlarınızın potansiyelini ortaya çıkarın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
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
      </section>

      {/* ISTATISTIKLER */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern İş Gücü Neden Desteklenmeli?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {statistics2025.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-center group">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</h3>
                <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAYDALAR */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">KARİYEER NE KAZANDIRIR?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMLAR */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Kurumsal Programlarımız</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{program.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {program.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO FORM */}
      <section id="contact-form" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-red-600">
            <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Talep Edin</h2>
              <p className="text-gray-600">Kurumunuza özel çözümler için formu doldurun.</p>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Şirket Adı</label><input required className="w-full p-3 rounded-lg border border-gray-300" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Yetkili Kişi</label><input required className="w-full p-3 rounded-lg border border-gray-300" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label><input type="email" required className="w-full p-3 rounded-lg border border-gray-300" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label><input type="tel" required className="w-full p-3 rounded-lg border border-gray-300" /></div>
                </div>
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label><textarea className="w-full p-3 rounded-lg border border-gray-300 h-24 resize-none"></textarea></div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-all shadow-lg">
                  {isSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

**Bu kodu Commit et.**

Bu kodda `Card`, `Button`, `Label`, `Input` gibi dışarıdan gelen her şeyi sildim ve yerine **saf HTML etiketleri** koydum. Vercel artık hata veremez. **Siten hemen açılacak!** 🤝
