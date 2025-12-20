// src/pages/ForCompanies.tsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  HeartHandshake,
  Briefcase,
  Mail,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  MessageSquare,
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

  // =========================
  // ✅ KALDIRMA: FORM/DB AKIŞI AYNI
  // =========================
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

  // =========================
  // ✅ DÖNÜŞÜM ODAKLI İÇERİK
  // =========================
  const outcomes = [
    {
      icon: LineChart,
      title: "Performans & liderlik",
      desc: "Yöneticilerde net hedef, karar alma, iletişim ve kriz yönetimi kası.",
    },
    {
      icon: Users,
      title: "Retention & bağlılık",
      desc: "Yetenek kaybını azaltan gelişim planları ve kişisel yol haritası.",
    },
    {
      icon: ShieldCheck,
      title: "Ölçülebilir program",
      desc: "Program hedefleri, seans çıktıları ve aksiyon planı ile izlenebilir ilerleme.",
    },
    {
      icon: Clock,
      title: "Hızlı kurulum",
      desc: "İhtiyaç analizi → koç havuzu → pilot → ölçekleme. Süreç net ve hızlı.",
    },
  ];

  const steps = [
    {
      no: "01",
      title: "İhtiyacı netleştir",
      desc: "Hedef rol grubu, yetkinlik alanı, süre ve başarı kriterleri belirlenir.",
    },
    {
      no: "02",
      title: "Koç havuzunu eşleştir",
      desc: "Sektör + seviye + hedefe göre uygun koçlar shortlist edilir.",
    },
    {
      no: "03",
      title: "Pilot başlat",
      desc: "Kısa pilot ile hızlı geri bildirim alınır, program iyileştirilir.",
    },
    {
      no: "04",
      title: "Ölçekle & raporla",
      desc: "Program genişler; ilerleme ve çıktılar düzenli raporlanır (kapsam opsiyonel).",
    },
  ];

  const packages = [
    {
      name: "Pilot",
      badge: "Hızlı başlangıç",
      price: "İhtiyaca göre",
      bullets: [
        "1 hedef alan + pilot planı",
        "Koç shortlist + eşleştirme",
        "Seans çıktısı & aksiyon planı",
        "2 haftada pilot başlangıcı",
      ],
      cta: "Pilot demo talep et",
    },
    {
      name: "Growth",
      badge: "Takım geliştirme",
      price: "İhtiyaca göre",
      bullets: [
        "Çoklu hedef alan (liderlik/iletişim vs.)",
        "Rol bazlı program tasarımı",
        "Düzenli takip & iyileştirme",
        "İK ile koordinasyon akışı",
      ],
      cta: "Program önerisi al",
      featured: true,
    },
    {
      name: "Enterprise",
      badge: "Kurumsal ölçek",
      price: "İhtiyaca göre",
      bullets: [
        "Geniş koç havuzu & SLA",
        "Özel onboarding + süreç tasarımı",
        "Gelişmiş takip/raporlama (opsiyonel)",
        "Uzun dönem partnerlik modeli",
      ],
      cta: "Kurumsal görüşme ayarla",
    },
  ];

  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Yetenek Tutundurma",
      shortDesc: "Yetenek kaybını azaltan gelişim planı ve bağlılık artışı.",
      fullDesc:
        "Koçluk programı ile çalışanlarınızın hedefleri netleşir, aksiyon planı oluşur ve şirket içinde gelişim yolu görünür hale gelir. Bu da bağlılık ve tutundurmaya doğrudan etki eder.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      id: 2,
      icon: Zap,
      title: "Çevik Liderlik",
      shortDesc: "Karar alma, delegasyon, kriz yönetimi ve net iletişim.",
      fullDesc:
        "Liderlik koçluğu ile yöneticilerinizin belirsizlikte karar alma, ekip yönetimi ve performans görüşmeleri gibi kritik becerilerini güçlendirirsiniz.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: 3,
      icon: HeartHandshake,
      title: "İletişim Kültürü",
      shortDesc: "Silo kırma, geri bildirim kültürü ve psikolojik güven.",
      fullDesc:
        "Takım koçluğu ile departmanlar arası iletişim güçlenir, geri bildirim kalitesi artar ve sağlıklı işbirliği kültürü oluşur.",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 4,
      icon: Briefcase,
      title: "İş-Yaşam Dengesi",
      shortDesc: "Tükenmişliği azaltan sürdürülebilir performans.",
      fullDesc:
        "Wellbeing odaklı koçluklarla tükenmişlik riskini azaltır, sürdürülebilir performans ve motivasyonu desteklersiniz.",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const faqs = [
    {
      q: "Bu bir eğitim mi, koçluk mu?",
      a: "Koçluk; kişiye özel hedef, aksiyon planı ve takip odaklıdır. Eğitimden farklı olarak standart içerikten çok, bireyin hedefleri ve performans bariyerleri üzerinde çalışır.",
    },
    {
      q: "Ne kadar sürede başlayabiliriz?",
      a: "İhtiyaç netleştiğinde pilot süreci hızlıca başlatılabilir. İlk görüşmeden sonra program taslağı ve koç shortlist’i oluşturulur.",
    },
    {
      q: "Hangi departmanlar için uygun?",
      a: "Liderlik, iletişim, performans, kariyer gelişimi ve wellbeing başlıkları; operasyon, satış, ürün, yazılım, İK gibi birçok fonksiyonda uygulanabilir.",
    },
    {
      q: "Raporlama / takip var mı?",
      a: "Seans çıktıları ve aksiyon planı bazında takip kurgulanır. Kurumsal raporlama kapsamı ihtiyaç ve sözleşmeye göre genişletilebilir.",
    },
  ];

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-600/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/90">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Kurumlar için koçluk programı
              </div>

              <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Performansı artır.
                <br />
                <span className="text-yellow-300">Yetenekleri tut.</span>
                <br />
                Süreci ölç.
              </h1>

              <p className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl">
                Kariyeer, kurumların liderlik, iletişim, performans ve wellbeing hedeflerine göre
                koç havuzunu eşleştirir. Pilotla başlar, ölçer, sonra ölçekler.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center rounded-xl bg-white text-gray-900 px-6 py-3 font-semibold hover:bg-gray-100 transition"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Demo / teklif al
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>

                <button
                  onClick={() => navigate("/coaches")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/0 text-white px-6 py-3 font-semibold hover:bg-white/10 transition"
                >
                  Koç havuzunu gör
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Başlangıç modeli", value: "Pilot" },
                  { label: "Odak", value: "Çıktı + takip" },
                  { label: "Kurulum", value: "Hızlı" },
                  { label: "Kapsam", value: "Esnek" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/5 border border-white/10 p-4"
                  >
                    <p className="text-xs text-white/60">{m.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Programı “başlat-ölç-iyileştir”
                    </h3>
                    <p className="mt-1 text-sm text-white/70 leading-relaxed">
                      Kurumsal koçlukta en kritik nokta: doğru hedef + doğru eşleşme +
                      seans sonrası aksiyon planı + takip.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "İhtiyaç analizi + program taslağı",
                    "Koç shortlist + eşleştirme",
                    "Pilot + hızlı geri bildirim",
                    "Ölçekleme (opsiyonel raporlama)",
                  ].map((x, i) => (
                    <div key={i} className="flex items-start gap-2 text-white/85">
                      <CheckCircle2 className="h-5 w-5 text-yellow-300 mt-0.5" />
                      <p className="text-sm leading-relaxed">{x}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollToForm}
                  className="mt-7 w-full rounded-2xl bg-red-600 text-white px-5 py-3 font-semibold hover:bg-red-700 transition"
                >
                  Kurumsal görüşme talep et
                </button>

                <p className="mt-3 text-xs text-white/60 text-center">
                  Ortalama yanıt süresi: aynı gün / 24 saat içinde dönüş
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="py-14 sm:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Şirket olarak ne kazanırsın?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Koçluğu “faydalı bir hizmet” değil, net hedefleri olan bir gelişim süreci
              olarak kurgularız.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((o, idx) => {
              const Icon = o.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border bg-white p-6 hover:shadow-sm transition"
                >
                  <div className="h-11 w-11 rounded-2xl bg-gray-900 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{o.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {o.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl bg-gray-50 border p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
                <BadgeCheck className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pilot ile risksiz başla</p>
                <p className="text-sm text-gray-600">
                  Küçük başlayıp hızlı öğren, işe yarayan modeli ölçekle.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Demo al <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <button
                onClick={() => navigate("/coaches")}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-white transition"
              >
                Koç havuzunu gör <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Süreç nasıl ilerler?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Karmaşa yok: ihtiyaç → eşleşme → pilot → ölçekleme.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={i} className="rounded-2xl border bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                    {s.no}
                  </span>
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-14 sm:py-16 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Program seçenekleri
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              İhtiyaca göre tasarlarız. En hızlı yol: Pilot → Growth → Enterprise.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {packages.map((p, i) => (
              <div
                key={i}
                className={`rounded-3xl border bg-white p-7 ${
                  p.featured ? "ring-2 ring-red-600/20 shadow-sm" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500">{p.badge}</p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900">{p.name}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-gray-900 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{p.price}</span>
                </p>

                <ul className="mt-6 space-y-3">
                  {p.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToForm}
                  className={`mt-7 w-full rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    p.featured
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "border border-gray-300 text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4 inline ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES (CLICKABLE) */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                En sık kullanılan kurumsal senaryolar
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Kutulardan birine tıkla; kapsamı ve hedefi net gör, sonra demo talep et.
              </p>
            </div>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black transition w-fit"
            >
              Demo al <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFeature(f)}
                className="bg-white p-6 rounded-2xl border hover:shadow-sm cursor-pointer transition"
              >
                <div
                  className={`w-12 h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.shortDesc}</p>

                <div className="mt-4 text-sm font-semibold text-red-600 inline-flex items-center">
                  Detayı gör <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE MODAL */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border">
            <div className="relative">
              <img
                src={selectedFeature.image}
                className="w-full h-60 object-cover"
                alt={selectedFeature.title}
              />
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-2 text-sm font-semibold shadow"
                aria-label="Kapat"
              >
                Kapat ✕
              </button>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 ${selectedFeature.bg} ${selectedFeature.color} rounded-2xl flex items-center justify-center`}
                >
                  <selectedFeature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hedefe göre program tasarımı + pilot + ölçekleme
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {selectedFeature.fullDesc}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: LineChart, text: "Çıktı ve aksiyon planı odaklı" },
                  { icon: ShieldCheck, text: "Süreç net ve ölçülebilir" },
                  { icon: Users, text: "Rol/seviye bazlı eşleştirme" },
                  { icon: Clock, text: "Pilot ile hızlı başlangıç" },
                ].map((x, i) => {
                  const Icon = x.icon;
                  return (
                    <div key={i} className="rounded-2xl border bg-gray-50 p-4 flex gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-900" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{x.text}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setSelectedFeature(null);
                  scrollToForm();
                }}
                className="mt-7 w-full bg-red-600 text-white py-3.5 rounded-2xl font-bold hover:bg-red-700 transition"
              >
                Demo / teklif al <ArrowRight className="h-4 w-4 inline ml-2" />
              </button>

              <p className="mt-3 text-xs text-gray-500 text-center">
                Aynı gün dönüş hedefi • İlk görüşme sonrası hızlı program taslağı
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <section className="py-14 sm:py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sık sorulan sorular
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Kurumsal ekiplerin en çok sorduğu noktaları netleştirdik.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {faqs.map((f, idx) => (
              <div key={idx} className="rounded-2xl border bg-white p-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-600" />
                  {f.q}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-gray-900 p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-white/70 text-sm font-semibold">Son adım</p>
                <h3 className="mt-2 text-2xl font-bold">
                  15 dakikalık görüşmeyle başlayalım.
                </h3>
                <p className="mt-2 text-white/75 text-sm leading-relaxed">
                  İhtiyaç → pilot → ölçekleme. En hızlı yolu birlikte çıkaralım.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
                >
                  Demo al <ArrowRight className="h-4 w-4 ml-2" />
                </button>
                <button
                  onClick={() => navigate("/coaches")}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Koç havuzunu gör <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM (AYNEN KALDI) */}
      <div id="contact-form" className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 border">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-bold">
              <Mail className="h-4 w-4" />
              Demo / Teklif Talebi
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              24 saat içinde dönüş
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bilgileri bırakın; ihtiyaç + kapsam + hedefe göre hızlı bir öneri hazırlayalım.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-gray-50 border p-4 text-sm text-gray-700 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-gray-900" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Beklediğin çıktı</p>
              <p className="text-gray-600">
                Program taslağı + pilot önerisi + koç shortlist yaklaşımı (ihtiyaca göre).
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
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
              Gönderdiğiniz bilgiler sadece talebinizi yönetmek için kullanılır.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
