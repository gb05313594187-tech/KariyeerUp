// src/pages/ForCompanies.tsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Shield, Zap, HeartHandshake, Briefcase, Mail } from "lucide-react";
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

  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Yetenek Tutundurma",
      shortDesc: "Çalışanlarınıza yatırım yaparak aidiyet duygusunu güçlendirin.",
      fullDesc:
        "Koçluk programlarımızla çalışanlarınızın kariyer yollarını şirketiniz içinde çizmelerine yardımcı oluyor, aidiyet duygusunu artırıyoruz.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      id: 2,
      icon: Zap,
      title: "Çevik Liderlik",
      shortDesc:
        "Yöneticilerinizin kriz anlarında hızlı karar alma becerilerini geliştirin.",
      fullDesc:
        "Liderlik koçluğu ile yöneticilerinize çeviklik ve kriz yönetimi yetkinlikleri kazandırıyoruz.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: 3,
      icon: HeartHandshake,
      title: "İletişim Kültürü",
      shortDesc: "Departmanlar arası siloları yıkarak şeffaf bir kültür inşa edin.",
      fullDesc: "Takım koçluğu ile geri bildirim kültürünü güçlendiriyoruz.",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 4,
      icon: Briefcase,
      title: "İş-Yaşam Dengesi",
      shortDesc: "Tükenmişliği önleyerek çalışanlarınızın mutluluğunu sağlayın.",
      fullDesc: "Wellbeing odaklı koçluklarla sürdürülebilir performans sağlıyoruz.",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HERO */}
      <div className="bg-gray-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Şirketinizin Potansiyelini Zirveye Taşıyın
        </h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
          Kurumlara özel koçluk çözümleriyle sürdürülebilir başarı.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-red-600 font-bold px-8 py-4 rounded-xl"
          >
            <Mail className="inline w-5 h-5 mr-2" />
            Teklif Al
          </button>
          <button
            onClick={() => navigate("/coaches")}
            className="border border-white px-8 py-4 rounded-xl"
          >
            Koçları İncele
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFeature(f)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl cursor-pointer"
            >
              <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-lg flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.shortDesc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE MODAL (basit) */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative">
              <img src={selectedFeature.image} className="w-full h-56 object-cover" />
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
                <div className={`w-10 h-10 ${selectedFeature.bg} ${selectedFeature.color} rounded-lg flex items-center justify-center`}>
                  <selectedFeature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{selectedFeature.title}</h3>
              </div>
              <p className="mt-3 text-gray-700">{selectedFeature.fullDesc}</p>
              <button
                onClick={() => {
                  setSelectedFeature(null);
                  document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl font-bold"
              >
                Teklif Al
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <div id="contact-form" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Demo Talep Edin</h2>

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
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold disabled:opacity-70"
            >
              {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
