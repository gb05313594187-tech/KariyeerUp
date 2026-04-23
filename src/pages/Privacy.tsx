// src/pages/Privacy.tsx
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  tr: {
    heroTitle: "Gizlilik Politikası",
    heroSubtitle: "Kişisel verilerinizin korunması bizim için önceliktir",
    lastUpdate: "Son Güncelleme",
    intro: 'İşbu Gizlilik Politikası, Kariyeer.com ("Platform") tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin mentorluk ve eğitim hizmetleri çerçevesinde nasıl işlendiğini açıklamaktadır.',
    s1Title: "1. Veri Sorumlusu",
    s1Company: "Salih Gökalp Büyükçelebi (Şahıs Şirketi)",
    s1Brand: "Kariyeer.com",
    s1Address: "Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / İstanbul 34310",
    s2Title: "2. Toplanan Kişisel Veriler",
    s2Identity: "Kimlik Bilgileri",
    s2IdentityItems: ["Ad, soyad", "E-posta adresi", "Telefon numarası"],
    s2Transaction: "İşlem Bilgileri",
    s2TransactionItems: ["Satın alma geçmişi", "Mentorluk randevu kayıtları", "Ödeme bilgileri*"],
    s2Technical: "Teknik Bilgiler",
    s2TechnicalItems: ["IP adresi", "Tarayıcı bilgileri", "Çerez verileri"],
    s2Profile: "Eğitim ve Gelişim Bilgileri",
    s2ProfileItems: ["Öğrenim durumu", "Kariyer gelişim hedefleri", "Mentorluk seans notları"],
    s2Note: "* Ödeme bilgileri iyzico altyapısı tarafından işlenir, platformumuzda saklanmaz.",
    s3Title: "3. Kişisel Verilerin İşlenme Amaçları",
    s3Items: [
      "Üyelik işlemlerinin mentorluk sistemi kapsamında yönetilmesi",
      "Kariyer eğitim ve mentorluk hizmetlerinin sunulması",
      "Eğitim randevularının organize edilmesi",
      "Ödeme işlemlerinin (Eğitim Bedeli) gerçekleştirilmesi",
      "Yasal yükümlülüklerin yerine getirilmesi",
      "Platformun mentorluk kalitesinin artırılması",
    ],
    s4Title: "4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri",
    s4Intro: "Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:",
    s4Items: [
      "Açık rızanızın bulunması",
      "Eğitim/Mentorluk sözleşmesinin kurulması veya ifası",
      "Hukuki yükümlülüğün yerine getirilmesi",
      "Meşru menfaatlerimiz (güvenlik ve hizmet kalitesi) için zorunlu olması",
    ],
    s5Title: "5. Kişisel Verilerin Aktarılması",
    s5Intro: "Kişisel verileriniz, işe yerleştirme amacı gütmeksizin aşağıdaki taraflarla paylaşılabilir:",
    s5Items: [
      "Ödeme kuruluşları: iyzico (işlem güvenliği için)",
      "Teknik altyapı: Supabase, Vercel",
      "Mentorlar: Hizmet aldığınız bağımsız mentorlarla sınırlı eğitim bilgisi paylaşımı",
      "Yasal merciler: Kanuni zorunluluk halinde yetkili kurumlar",
    ],
    s6Title: "6. Saklama Süresi",
    s6Text: "Verileriniz, eğitim ve mentorluk hizmet süreci boyunca ve yasal zaman aşımı süreleri dikkate alınarak saklanır. Kariyeer, bir istihdam bürosu olmadığı için özgeçmiş havuzu oluşturma amacıyla veri saklamaz.",
    s7Title: "7. Çerez (Cookie) Politikası",
    s7Intro: "Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır:",
    s7Required: "Zorunlu Çerezler",
    s7RequiredDesc: "Site işlevselliği için gerekli",
    s7Analytics: "Analitik Çerezler",
    s7AnalyticsDesc: "Kullanım istatistikleri",
    s7Preference: "Tercih Çerezleri",
    s7PreferenceDesc: "Kullanıcı tercihleri",
    s8Title: "8. KVKK Kapsamındaki Haklarınız",
    s8Intro: "KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:",
    s8Items: [
      "Verilerinizin işlenip işlenmediğini öğrenme",
      "Düzeltme veya silinmesini talep etme",
      "İşlenme amacına uygun kullanılıp kullanılmadığını denetleme",
      "Zarar halinde giderim talep etme",
    ],
    s9Title: "9. Başvuru Yöntemi",
    s9Intro: "Haklarınızı kullanmak için destek@kariyeer.com adresine yazılı başvuru yapabilirsiniz.",
    s9Note: "Başvurularınız en geç 30 gün içinde sonuçlandırılacaktır.",
    s10Title: "10. Önemli Beyan",
    s10Text: "Platformumuz 4904 sayılı Kanun kapsamında bir Özel İstihdam Bürosu değildir. Verileriniz hiçbir şekilde işe yerleştirme veya personel tedariki amacıyla işlenmez ve üçüncü taraf işverenlerle paylaşılmaz.",
  },
  en: {
    heroTitle: "Privacy Policy",
    heroSubtitle: "Your data protection is our priority",
    lastUpdate: "Last Updated",
    intro: 'This Privacy Policy explains how Kariyeer.com ("Platform") processes your data within the scope of mentoring and training services.',
    s1Title: "1. Data Controller",
    s1Company: "Salih Gokalp Buyukcelebi",
    s1Brand: "Kariyeer.com",
    s1Address: "Cihangir Mah. Candarli Sok. No: 12/8, Avcilar / Istanbul",
    s2Title: "2. Data Collected",
    s2Identity: "Identity",
    s2IdentityItems: ["Name, Surname", "Email", "Phone"],
    s2Transaction: "Transactions",
    s2TransactionItems: ["Purchase history", "Mentoring records"],
    s2Technical: "Technical",
    s2TechnicalItems: ["IP address", "Cookies"],
    s2Profile: "Education & Growth",
    s2ProfileItems: ["Educational background", "Career goals"],
    s2Note: "* Payments are processed by iyzico.",
    s3Title: "3. Purpose",
    s3Items: [
      "Account management for mentoring",
      "Providing career education services",
      "Organizing mentoring sessions",
      "Processing educational fees",
    ],
    s4Title: "4. Legal Basis",
    s4Intro: "Data is processed based on contract performance and explicit consent.",
    s4Items: ["Consent", "Contract Performance", "Legal Obligation"],
    s5Title: "5. Transfers",
    s5Intro: "Data is shared with technical providers and mentors only.",
    s5Items: ["iyzico", "Hosting providers", "Mentors"],
    s6Title: "6. Retention",
    s6Text: "We do not store data for recruitment purposes. Data is kept only for the duration of the mentoring service.",
    s7Title: "7. Cookies",
    s7Intro: "We use essential and analytics cookies.",
    s7Required: "Essential",
    s7RequiredDesc: "Site functionality",
    s7Analytics: "Analytics",
    s7AnalyticsDesc: "Usage stats",
    s7Preference: "Preferences",
    s7PreferenceDesc: "User choices",
    s8Title: "8. Your Rights",
    s8Intro: "You have the right to access, correct, and delete your data.",
    s8Items: ["Access", "Correction", "Deletion"],
    s9Title: "9. Contact",
    s9Intro: "Email us at destek@kariyeer.com",
    s9Note: "Replies within 30 days.",
    s10Title: "10. Legal Notice",
    s10Text: "Kariyeer is not a recruitment agency. Data is never shared with employers for hiring purposes.",
  },
};

export default function Privacy() {
  const { language } = useLanguage();
  const t = translations[language] || translations.tr;
  const isRTL = language === "ar";
  const dateLocale = language === "tr" ? "tr-TR" : language === "ar" ? "ar-SA" : language === "fr" ? "fr-FR" : "en-US";

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl text-right" : ""}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">{t.heroTitle}</h1>
          <p className="text-gray-300 text-lg">{t.heroSubtitle}</p>
          <p className="text-gray-400 text-sm mt-4">
            {t.lastUpdate}: {new Date().toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{t.intro}</p>
            </div>

            {/* ÖNEMLİ BEYAN - İŞKUR KORUMASI */}
            <div className="border-2 border-orange-200 bg-orange-50 p-6 rounded-xl">
              <h2 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" /> {t.s10Title}
              </h2>
              <p className="text-orange-800 text-sm leading-relaxed">{t.s10Text}</p>
            </div>

            {/* 1. Veri Sorumlusu */}
            <div className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 rounded-r-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                {t.s1Title}
              </h2>
              <div className="text-gray-700 space-y-1">
                <p><strong>Unvan:</strong> {t.s1Company}</p>
                <p><strong>Marka:</strong> {t.s1Brand}</p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{t.s1Address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>destek@kariyeer.com</span>
                </p>
              </div>
            </div>

            {/* 2. Toplanan Veriler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-600" />
                {t.s2Title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: t.s2Identity, items: t.s2IdentityItems },
                  { title: t.s2Transaction, items: t.s2TransactionItems },
                  { title: t.s2Technical, items: t.s2TechnicalItems },
                  { title: t.s2Profile, items: t.s2ProfileItems },
                ].map((block, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{block.title}</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {block.items.map((item, j) => (
                        <li key={j}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">{t.s2Note}</p>
            </div>

            {/* 3. İşlenme Amaçları */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-600" />
                {t.s3Title}
              </h2>
              <ul className="space-y-2 text-gray-600">
                {t.s3Items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Hukuki Sebepler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s4Title}</h2>
              <p className="text-gray-600 mb-3">{t.s4Intro}</p>
              <ul className="space-y-2 text-gray-600">
                {t.s4Items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* 6. Saklama Süresi */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s6Title}</h2>
              <p className="text-gray-600 leading-relaxed">{t.s6Text}</p>
            </div>

            {/* 8. Haklar */}
            <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                {t.s8Title}
              </h2>
              <p className="text-gray-600 mb-3">{t.s8Intro}</p>
              <ul className="space-y-2 text-gray-600">
                {t.s8Items.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>

            {/* 9. Başvuru */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s9Title}</h2>
              <p className="text-gray-600 mb-4">{t.s9Intro}</p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-red-600" />
                  <strong>E-posta:</strong> destek@kariyeer.com
                </p>
              </div>
              <p className="text-gray-500 text-sm mt-3">{t.s9Note}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
