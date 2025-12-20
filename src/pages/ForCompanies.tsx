// src/pages/ForCompanies.tsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Footer importunu kaldırdım (PublicLayout basıyorsa çift olmaması için)
// import Footer from "@/components/Footer";

import {
  Shield,
  Zap,
  HeartHandshake,
  Briefcase,
  Mail,
  BarChart3,
  Target,
  Timer,
  FileText,
  CheckCircle2,
  Lock,
} from "lucide-react";

import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ForCompanies() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    message: "",
  });

  // ✅ Bu bölüm: “programlar” gibi dursa da kullanıcı gözünde faydaya çevirdik
  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Yetenek Tutundurma",
      shortDesc: "Çalışan bağlılığını artır, ayrılma riskini düşür.",
      fullDesc:
        "Koçluk süreci; hedef, aksiyon ve takip ile ilerler. Çalışanlar şirket içinde kariyer yolunu daha net görür, aidiyet güçlenir.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      id: 2,
      icon: Zap,
      title: "Çevik Liderlik",
      shortDesc: "Yöneticiler daha hızlı karar alır, daha net yönetir.",
      fullDesc:
        "Liderlik koçluğu; kriz yönetimi, önceliklendirme ve karar alma yetkinliklerini geliştirir. Süreç ölçülebilir hedeflerle desteklenir.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: 3,
      icon: HeartHandshake,
      title: "İletişim Kültürü",
      shortDesc: "Ekipler arası silo azalır, geri bildirim kültürü güçlenir.",
      fullDesc:
        "Takım koçluğu ile iletişim standartları oluşur, geri bildirim pratikleri yerleşir. İş birliği artar, sürtünme azalır.",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 4,
      icon: Briefcase,
      title: "İş-Yaşam Dengesi",
      shortDesc: "Tükenmişliği azalt, sürdürülebilir performans yarat.",
      fullDesc:
        "Wellbeing odaklı koçluklar; stres yönetimi, sınır koyma ve sürdürülebilir çalışma alışkanlıklarına destek olur.",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Login zorunlu kalsın istiyorsan bu blok kalsın:
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Lütfen giriş yapın.");
        console.error(authError || "User not authenticated");
        return;
      }

      // ✅ DB kolonlarıyla uyumlu insert
      const payload: any = {
        company_name: formData.companyName,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        // Bu kolonlar sende varsa kalsın; yoksa DB hata verirse çıkarırız.
        user_id: user.id,
        status: "new",
      };

      const { error } = await supabase.from("company_requests").insert(payload);

      if (error) {
        toast.error("Talep kaydedilemedi.");
        console.error("company_requests insert error:", error);
        return;
      }

      toast.success("Talebiniz alındı. Kurumsal ekibimiz sizinle iletişime geçecek.");

      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HERO */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">
              <span className="h-2 w-2 rounded-full bg-lime-300 animate-pulse" />
              Kurumsal Koçluk • Ölçülebilir Gelişim
            </p>

            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight">
              Koçluk harcamanız
              <br />
              <span className="text-yellow-300">gerçekten sonuç üretiyor mu?</span>
            </h1>

            <p className="mt-5 text-lg text-gray-200">
              Kariyeer, koçluk sürecini “iyi hissettiren” olmaktan çıkarır; hedef, aksiyon ve
              takip ile <span className="text-white font-semibold">ölçülebilir</span> hale getirir.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <button
                onClick={scrollToForm}
                className="bg-white text-gray-900 font-semibold px-7 py-3 rounded-xl hover:bg-gray-100 transition inline-flex items-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Kurumsal ihtiyacımı paylaş
              </button>

              <button
                onClick={() => navigate("/coaches")}
                className="border border-white/40 text-white px-7 py-3 rounded-xl hover:bg-white/10 transition"
              >
                Koç havuzunu incele
              </button>
            </div>

            {/* Mini trust row */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="w-5 h-5 text-yellow-300" />
                  Ölçülebilir süreç
                </div>
                <p className="mt-1 text-sm text-gray-200">
                  Hedef → aksiyon → takip yaklaşımıyla ilerler.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Timer className="w-5 h-5 text-yellow-300" />
                  İK için zaman kazancı
                </div>
                <p className="mt-1 text-sm text-gray-200">
                  Talep, eşleşme ve süreç tek yerden yönetilir.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="w-5 h-5 text-yellow-300" />
                  Raporlanabilir etki
                </div>
                <p className="mt-1 text-sm text-gray-200">
                  Program çıktıları görünür ve izlenebilir olur.
                </p>
              </div>
            </div>

            {/* Risk reducer */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-lime-300" />
                </div>
                <div>
                  <p className="font-semibold">Risk yok. Baskı yok.</p>
                  <p className="mt-1 text-sm text-gray-200">
                    Kurumsal talep ücretsizdir. Zorunlu paket/taahhüt yoktur. Önce ihtiyaç analizi yapılır,
                    uygunsa birlikte ilerlenir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* “Neden” – kısa problem çerçevesi */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Koçluk “hizmet” değil, <span className="text-red-600">sonuç</span> olmalı
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Birçok şirket koçluk hizmeti alıyor; ancak çok azı şu sorulara net cevap verebiliyor:
              hangi çalışan ne kazandı, hangi koç gerçekten etki yarattı, bütçenin geri dönüşü ne?
              Kariyeer bu belirsizliği azaltmak için tasarlandı.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Target,
                title: "Doğru eşleşme",
                desc: "Hedef, rol ve deneyime göre doğru koç havuzu.",
              },
              {
                icon: BarChart3,
                title: "Ölçülebilir takip",
                desc: "Hedefler, aksiyonlar ve çıktıların görünürlüğü.",
              },
              {
                icon: Timer,
                title: "Operasyon azalır",
                desc: "İK ekibi için daha az takip, daha çok odak.",
              },
              {
                icon: CheckCircle2,
                title: "Net çıktı",
                desc: "Program sonunda “ne değişti?” sorusuna cevap.",
              },
            ].map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="rounded-2xl border bg-white p-6">
                  <Icon className="w-6 h-6 text-gray-900" />
                  <h3 className="mt-4 font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Hangi hedef için koçluk?
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Aşağıdaki başlıklar örnek program alanlarıdır. Her birinin amacı aynı: ölçülebilir gelişim.
                Detay için karta tıkla.
              </p>
            </div>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-6 py-3 font-semibold hover:bg-black transition"
            >
              Kurumsal talep oluştur <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFeature(f)}
                className="bg-white p-6 rounded-2xl border hover:shadow-md cursor-pointer transition"
              >
                <div
                  className={`w-12 h-12 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.shortDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE MODAL (basit) */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative">
              <img
                src={selectedFeature.image}
                className="w-full h-56 object-cover"
                alt={selectedFeature.title}
              />
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-3 right-3 bg-white/90 rounded-full p-2"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${selectedFeature.bg} ${selectedFeature.color} rounded-lg flex items-center justify-center`}
                >
                  <selectedFeature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedFeature.title}</h3>
              </div>

              <p className="mt-3 text-gray-700 leading-relaxed">{selectedFeature.fullDesc}</p>

              <div className="mt-6 rounded-xl bg-gray-50 border p-4">
                <p className="text-sm font-semibold text-gray-900">Başlamadan önce</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    Kurumsal talep ücretsizdir; taahhüt yoktur.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    Önce ihtiyaç analizi yapar, uygun yaklaşımı netleştiririz.
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedFeature(null);
                  scrollToForm();
                }}
                className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Kurumsal talep oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM (DOKUNMADIM) */}
      <div id="contact-form" className="py-12 sm:py-16 px-4 bg-white border-t">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Kurumsal Talep</h2>
          <p className="text-center text-gray-600 mb-8">
            İhtiyacınızı paylaşın; uygun kapsam ve koç havuzuyla geri dönüş yapalım.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              required
              placeholder="Şirket Adı"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full border px-4 py-3 rounded-lg"
            />
            <input
              required
              placeholder="Yetkili Kişi"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full border px-4 py-3 rounded-lg"
            />
            <input
              required
              type="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border px-4 py-3 rounded-lg"
            />
            <input
              required
              placeholder="Telefon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border px-4 py-3 rounded-lg"
            />
            <textarea
              placeholder="Mesaj"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border px-4 py-3 rounded-lg h-32"
            />

            <button
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold disabled:opacity-70 hover:bg-red-700 transition"
            >
              {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Talep göndermek ücretsizdir. Taahhüt/paket zorunluluğu yoktur.
            </p>
          </form>
        </div>
      </div>

      {/* Footer kaldırıldı (Layout basıyorsa çift olmasın) */}
      {/* <Footer /> */}
    </div>
  );
}
