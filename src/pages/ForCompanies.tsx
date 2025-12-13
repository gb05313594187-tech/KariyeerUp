// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import {
  Shield,
  Zap,
  HeartHandshake,
  Briefcase,
  ArrowRight,
  X,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ForCompanies() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
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
      shortDesc:
        "Çalışanlarınıza yatırım yaparak aidiyet duygusunu güçlendirin.",
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
      shortDesc:
        "Departmanlar arası siloları yıkarak şeffaf bir kültür inşa edin.",
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
      shortDesc:
        "Tükenmişliği önleyerek çalışanlarınızın mutluluğunu sağlayın.",
      fullDesc:
        "Wellbeing odaklı koçluklarla sürdürülebilir performans sağlıyoruz.",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // ----------------- FORM SUBMIT -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // ✅ 1) Login olan kullanıcıyı al
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Lütfen giriş yapın.");
        console.error(authError || "User not authenticated");
        return;
      }

      // ✅ 2) Insert (artık sahipsiz değil)
      const { error } = await supabase.from("company_requests").insert({
        user_id: user.id,
        created_by: user.id,
        company_name: formData.companyName,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: "new",
      });

      if (error) {
        toast.error("Talep kaydedilemedi.");
        console.error(error);
        return;
      }

      toast.success(
        "Talebiniz alındı. Kurumsal ekibimiz sizinle iletişime geçecek."
      );

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
              document
                .getElementById("contact-form")
                ?.scrollIntoView({ behavior: "smooth" })
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
              <div
                className={`w-12 h-12 ${f.bg} ${f.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.shortDesc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div id="contact-form" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Demo Talep Edin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              required
              placeholder="Şirket Adı"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full border px-4 py-3 rounded-lg"
            />
            <input
              required
              placeholder="Yetkili Kişi"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
              className="w-full border px-4 py-3 rounded-lg"
            />
            <input
              required
              type="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border px-4 py-3 rounded-lg"
            />
            <input
              required
              placeholder="Telefon"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-4 py-3 rounded-lg"
            />
            <textarea
              placeholder="Mesaj"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full border px-4 py-3 rounded-lg h-32"
            />

            <button
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold"
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
