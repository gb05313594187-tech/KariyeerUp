// @ts-nocheck
import { useState } from 'react';
import { 
  TrendingDown, TrendingUp, Users, Heart, Zap, Building2, Target, 
  CheckCircle2, ArrowRight, AlertTriangle, BedDouble, Frown, Brain, Mail, Phone 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForCompanies() {
  const { language } = useLanguage(); // Dil desteği varsa kullanır, yoksa hata vermez
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Demo request submitted:', formData);
    
    setTimeout(() => {
        toast.success(
          language === 'tr' 
            ? 'Demo talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.' 
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

  const handleSuccessStoriesClick = () => {
    toast.info("Başarı hikayeleri yakında yayında!");
  };

  // --- VERİLER ---
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
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      {/* --- HERO SECTION (TURUNCU/KIRMIZI) --- */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {language === 'en' ? 'For Companies' : 'Şirketler İçin'}
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              {language === 'en' ? 'Increase Employee Well-being, Boost Performance' : 'Çalışan Refahını Artırın, Performansı Yükseltin'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-50 font-light">
              {language === 'en' ? 'Unlock your employees\' potential with professional career coaching' : 'Profesyonel kariyer koçluğu ile çalışanlarınızın potansiyelini ortaya çıkarın'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={handleContactClick}
                    className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                    Hemen İletişime Geçin <ArrowRight className="w-5 h-5"/>
                </button>
                <button 
                    onClick={handleSuccessStoriesClick}
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                >
                    Başarı Hikayeleri
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- ISTATISTIKLER (2025) --- */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full tracking-wider">
                ARAŞTIRMALARA GÖRE
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
              Modern İş Gücü Neden Desteklenmeli?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              2025 verilerine göre çalışan refahı, şirket başarısının en büyük anahtarıdır.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics2025.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-red-100 hover:shadow-xl transition-all text-center group">
                <div className={`w-20 h-20 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
                <h3 className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</h3>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAYDALAR --- */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">KARİYEER NE KAZANDIRIR?</h2>
            <p className="text-xl text-gray-600">Kanıtlanmış sonuçlarla çalışan refahı ve şirket performansı.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROGRAMLAR --- */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kurumsal Koçluk Programları</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-all overflow-hidden hover:-translate-y-1 duration-300">
                <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Zap className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600">{program.title}</h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 text-center mb-6">{program.description}</p>
                  <div className="space-y-3">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEMO TALEP FORMU --- */}
      <section id="contact-form" className="py-16 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-red-600">
            <div className="text-center p-8 border-b border-gray-100">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-2">DEMO TALEP EDİN</h2>
              <p className="text-gray-600">Kurumunuza özel çözümler için formu doldurun.</p>
            </div>
            
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Şirket Adı</label>
                    <input required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                        value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="Şirketiniz A.Ş." />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Yetkili Kişi</label>
                    <input required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                        value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="Adınız Soyadınız" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">E-posta</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="ornek@sirket.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Telefon</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0555 000 00 00" />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Çalışan Sayısı</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" 
                        value={formData.employeeCount} onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })} placeholder="Örn: 50-100" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Mesajınız</label>
                  <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all h-32 resize-none" 
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="İhtiyaçlarınızı kısaca anlatın..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-4 rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? 'Gönderiliyor...' : 'Demo Talep Et'} <ArrowRight className="w-5 h-5" />
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
