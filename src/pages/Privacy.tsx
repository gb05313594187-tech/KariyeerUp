// src/pages/Privacy.tsx
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  tr: {
    heroTitle: "Gizlilik Politikası",
    heroSubtitle: "Kişisel verilerinizin korunması bizim için önceliktir",
    lastUpdate: "Son Güncelleme",
    intro: 'İşbu Gizlilik Politikası, Kariyeer.com ("Platform") tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklamaktadır.',
    s1Title: "1. Veri Sorumlusu",
    s1Company: "Salih Gökalp Büyükçelebi (Şahıs Şirketi)",
    s1Brand: "Kariyeer.com",
    s1Address: "Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / İstanbul 34310",
    s2Title: "2. Toplanan Kişisel Veriler",
    s2Identity: "Kimlik Bilgileri",
    s2IdentityItems: ["Ad, soyad", "E-posta adresi", "Telefon numarası"],
    s2Transaction: "İşlem Bilgileri",
    s2TransactionItems: ["Satın alma geçmişi", "Randevu kayıtları", "Ödeme bilgileri*"],
    s2Technical: "Teknik Bilgiler",
    s2TechnicalItems: ["IP adresi", "Tarayıcı bilgileri", "Çerez verileri"],
    s2Profile: "Profil Bilgileri",
    s2ProfileItems: ["Meslek bilgisi", "Kariyer hedefleri", "Seans notları"],
    s2Note: "* Ödeme bilgileri iyzico altyapısı tarafından işlenir, platformumuzda saklanmaz.",
    s3Title: "3. Kişisel Verilerin İşlenme Amaçları",
    s3Items: [
      "Üyelik işlemlerinin gerçekleştirilmesi ve hesap yönetimi",
      "Koçluk hizmetlerinin sunulması ve randevu yönetimi",
      "Ödeme işlemlerinin gerçekleştirilmesi",
      "Yasal yükümlülüklerin yerine getirilmesi",
      "Müşteri memnuniyeti ve hizmet kalitesinin artırılması",
      "İletişim ve bilgilendirme faaliyetleri (onayınız dahilinde)",
    ],
    s4Title: "4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri",
    s4Intro: "Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:",
    s4Items: [
      "Açık rızanızın bulunması",
      "Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması",
      "Hukuki yükümlülüğün yerine getirilmesi",
      "Meşru menfaatlerimiz için zorunlu olması",
    ],
    s5Title: "5. Kişisel Verilerin Aktarılması",
    s5Intro: "Kişisel verileriniz, aşağıdaki taraflarla paylaşılabilir:",
    s5Items: [
      "Ödeme kuruluşları: iyzico (ödeme işlemleri için)",
      "Hosting sağlayıcıları: Supabase, Vercel",
      "Yasal merciler: Kanuni zorunluluk halinde yetkili kurumlar",
      "Koçlar: Randevu aldığınız koçlarla sınırlı bilgi paylaşımı",
    ],
    s6Title: "6. Kişisel Verilerin Saklanma Süresi",
    s6Text: "Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal saklama yükümlülüklerimiz çerçevesinde saklanır. Üyelik sonlandırıldığında, yasal zorunluluklar saklı kalmak kaydıyla verileriniz silinir veya anonim hale getirilir.",
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
      "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
      "İşlenmişse buna ilişkin bilgi talep etme",
      "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
      "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
      "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
      "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini isteme",
      "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
      "Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
    ],
    s9Title: "9. Başvuru Yöntemi",
    s9Intro: "Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:",
    s9Note: "Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.",
    s10Title: "10. Politika Değişiklikleri",
    s10Text: "Bu Gizlilik Politikası, yasal düzenlemeler veya hizmetlerimizdeki değişiklikler doğrultusunda güncellenebilir. Değişiklikler bu sayfada yayınlandığı tarihte yürürlüğe girer. Önemli değişikliklerde e-posta ile bilgilendirileceksiniz.",
  },
  en: {
    heroTitle: "Privacy Policy",
    heroSubtitle: "Protecting your personal data is our priority",
    lastUpdate: "Last Updated",
    intro: 'This Privacy Policy explains how Kariyeer.com ("Platform") collects, processes, stores and protects your personal data in accordance with Turkish Personal Data Protection Law No. 6698 ("KVKK").',
    s1Title: "1. Data Controller",
    s1Company: "Salih Gökalp Büyükçelebi (Sole Proprietorship)",
    s1Brand: "Kariyeer.com",
    s1Address: "Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / Istanbul 34310",
    s2Title: "2. Personal Data Collected",
    s2Identity: "Identity Information",
    s2IdentityItems: ["Full name", "Email address", "Phone number"],
    s2Transaction: "Transaction Information",
    s2TransactionItems: ["Purchase history", "Appointment records", "Payment information*"],
    s2Technical: "Technical Information",
    s2TechnicalItems: ["IP address", "Browser information", "Cookie data"],
    s2Profile: "Profile Information",
    s2ProfileItems: ["Profession", "Career goals", "Session notes"],
    s2Note: "* Payment information is processed by iyzico and is not stored on our platform.",
    s3Title: "3. Purposes of Processing Personal Data",
    s3Items: [
      "Membership procedures and account management",
      "Providing coaching services and appointment management",
      "Processing payment transactions",
      "Fulfilling legal obligations",
      "Improving customer satisfaction and service quality",
      "Communication and informational activities (with your consent)",
    ],
    s4Title: "4. Legal Basis for Processing Personal Data",
    s4Intro: "Your personal data is processed based on the following legal grounds specified in Articles 5 and 6 of KVKK:",
    s4Items: [
      "Your explicit consent",
      "Directly related to the establishment or performance of a contract",
      "Fulfillment of legal obligations",
      "Necessary for our legitimate interests",
    ],
    s5Title: "5. Transfer of Personal Data",
    s5Intro: "Your personal data may be shared with the following parties:",
    s5Items: [
      "Payment providers: iyzico (for payment processing)",
      "Hosting providers: Supabase, Vercel",
      "Legal authorities: Authorized institutions when legally required",
      "Coaches: Limited information sharing with your appointed coaches",
    ],
    s6Title: "6. Data Retention Period",
    s6Text: "Your personal data is retained for the duration required by the processing purposes and within the framework of our legal retention obligations. When membership is terminated, your data is deleted or anonymized, subject to legal obligations.",
    s7Title: "7. Cookie Policy",
    s7Intro: "Our platform uses cookies to improve user experience:",
    s7Required: "Essential Cookies",
    s7RequiredDesc: "Required for site functionality",
    s7Analytics: "Analytics Cookies",
    s7AnalyticsDesc: "Usage statistics",
    s7Preference: "Preference Cookies",
    s7PreferenceDesc: "User preferences",
    s8Title: "8. Your Rights Under KVKK",
    s8Intro: "You have the following rights under Article 11 of KVKK:",
    s8Items: [
      "Learning whether your personal data is processed",
      "Requesting information if it has been processed",
      "Learning the purpose of processing and whether it is used accordingly",
      "Knowing the third parties to whom it is transferred domestically or abroad",
      "Requesting correction if it is incomplete or incorrectly processed",
      "Requesting deletion under the conditions set forth in Article 7 of KVKK",
      "Objecting to a result against you through analysis exclusively by automated systems",
      "Requesting compensation for damages caused by unlawful processing",
    ],
    s9Title: "9. Application Method",
    s9Intro: "You can apply using the following methods to exercise your rights stated above:",
    s9Note: "Your applications will be concluded free of charge within 30 days at the latest.",
    s10Title: "10. Policy Changes",
    s10Text: "This Privacy Policy may be updated in line with legal regulations or changes in our services. Changes take effect on the date they are published on this page. You will be notified by email for significant changes.",
  },
  ar: {
    heroTitle: "سياسة الخصوصية",
    heroSubtitle: "حماية بياناتك الشخصية هي أولويتنا",
    lastUpdate: "آخر تحديث",
    intro: 'توضح سياسة الخصوصية هذه كيف يقوم Kariyeer.com ("المنصة") بجمع ومعالجة وتخزين وحماية بياناتك الشخصية وفقًا لقانون حماية البيانات الشخصية التركي رقم 6698.',
    s1Title: "1. مسؤول البيانات",
    s1Company: "صالح غوكالب بويوكتشيليبي (مؤسسة فردية)",
    s1Brand: "Kariyeer.com",
    s1Address: "جيهانغير محلة، جاندارلي سوكاك رقم: 12/8، أفجيلار / إسطنبول 34310",
    s2Title: "2. البيانات الشخصية المجمعة",
    s2Identity: "معلومات الهوية",
    s2IdentityItems: ["الاسم الكامل", "البريد الإلكتروني", "رقم الهاتف"],
    s2Transaction: "معلومات المعاملات",
    s2TransactionItems: ["سجل المشتريات", "سجلات المواعيد", "معلومات الدفع*"],
    s2Technical: "المعلومات التقنية",
    s2TechnicalItems: ["عنوان IP", "معلومات المتصفح", "بيانات ملفات تعريف الارتباط"],
    s2Profile: "معلومات الملف الشخصي",
    s2ProfileItems: ["المهنة", "الأهداف المهنية", "ملاحظات الجلسات"],
    s2Note: "* تتم معالجة معلومات الدفع بواسطة iyzico ولا يتم تخزينها على منصتنا.",
    s3Title: "3. أغراض معالجة البيانات الشخصية",
    s3Items: [
      "إجراءات العضوية وإدارة الحساب",
      "تقديم خدمات التدريب وإدارة المواعيد",
      "معالجة عمليات الدفع",
      "الوفاء بالالتزامات القانونية",
      "تحسين رضا العملاء وجودة الخدمة",
      "أنشطة الاتصال والإعلام (بموافقتك)",
    ],
    s4Title: "4. الأساس القانوني لمعالجة البيانات الشخصية",
    s4Intro: "تتم معالجة بياناتك الشخصية بناءً على الأسس القانونية التالية:",
    s4Items: [
      "موافقتك الصريحة",
      "ارتباطها المباشر بإبرام أو تنفيذ العقد",
      "الوفاء بالالتزامات القانونية",
      "ضرورتها لمصالحنا المشروعة",
    ],
    s5Title: "5. نقل البيانات الشخصية",
    s5Intro: "يمكن مشاركة بياناتك الشخصية مع الأطراف التالية:",
    s5Items: [
      "مزودو الدفع: iyzico (لمعالجة المدفوعات)",
      "مزودو الاستضافة: Supabase, Vercel",
      "السلطات القانونية: المؤسسات المختصة عند الحاجة القانونية",
      "المدربون: مشاركة محدودة للمعلومات مع المدربين المعينين",
    ],
    s6Title: "6. فترة الاحتفاظ بالبيانات",
    s6Text: "يتم الاحتفاظ ببياناتك الشخصية للمدة التي تتطلبها أغراض المعالجة. عند إنهاء العضوية، يتم حذف بياناتك أو جعلها مجهولة الهوية.",
    s7Title: "7. سياسة ملفات تعريف الارتباط",
    s7Intro: "تستخدم منصتنا ملفات تعريف الارتباط لتحسين تجربة المستخدم:",
    s7Required: "ملفات تعريف الارتباط الضرورية",
    s7RequiredDesc: "مطلوبة لوظائف الموقع",
    s7Analytics: "ملفات تعريف الارتباط التحليلية",
    s7AnalyticsDesc: "إحصائيات الاستخدام",
    s7Preference: "ملفات تعريف الارتباط المفضلة",
    s7PreferenceDesc: "تفضيلات المستخدم",
    s8Title: "8. حقوقك",
    s8Intro: "لديك الحقوق التالية:",
    s8Items: [
      "معرفة ما إذا كانت بياناتك الشخصية تتم معالجتها",
      "طلب المعلومات إذا تمت معالجتها",
      "معرفة غرض المعالجة",
      "معرفة الأطراف الثالثة التي تم نقلها إليها",
      "طلب التصحيح إذا كانت غير مكتملة أو غير صحيحة",
      "طلب الحذف",
      "الاعتراض على نتيجة ضدك من خلال التحليل الآلي",
      "طلب التعويض عن الأضرار",
    ],
    s9Title: "9. طريقة التقديم",
    s9Intro: "يمكنك التقديم باستخدام الطرق التالية:",
    s9Note: "سيتم الانتهاء من طلباتك مجانًا خلال 30 يومًا كحد أقصى.",
    s10Title: "10. تغييرات السياسة",
    s10Text: "قد يتم تحديث سياسة الخصوصية هذه. تسري التغييرات في تاريخ نشرها على هذه الصفحة.",
  },
  fr: {
    heroTitle: "Politique de confidentialité",
    heroSubtitle: "La protection de vos données personnelles est notre priorité",
    lastUpdate: "Dernière mise à jour",
    intro: 'Cette Politique de confidentialité explique comment Kariyeer.com ("Plateforme") collecte, traite, stocke et protège vos données personnelles conformément à la loi turque n° 6698 sur la protection des données personnelles ("KVKK").',
    s1Title: "1. Responsable du traitement",
    s1Company: "Salih Gökalp Büyükçelebi (Entreprise individuelle)",
    s1Brand: "Kariyeer.com",
    s1Address: "Cihangir Mahallesi, Candarlı Sokak No: 12/8, Avcılar / Istanbul 34310",
    s2Title: "2. Données personnelles collectées",
    s2Identity: "Informations d'identité",
    s2IdentityItems: ["Nom complet", "Adresse e-mail", "Numéro de téléphone"],
    s2Transaction: "Informations de transaction",
    s2TransactionItems: ["Historique des achats", "Registres de rendez-vous", "Informations de paiement*"],
    s2Technical: "Informations techniques",
    s2TechnicalItems: ["Adresse IP", "Informations du navigateur", "Données de cookies"],
    s2Profile: "Informations de profil",
    s2ProfileItems: ["Profession", "Objectifs de carrière", "Notes de session"],
    s2Note: "* Les informations de paiement sont traitées par iyzico et ne sont pas stockées sur notre plateforme.",
    s3Title: "3. Finalités du traitement des données personnelles",
    s3Items: [
      "Procédures d'adhésion et gestion de compte",
      "Fourniture de services de coaching et gestion des rendez-vous",
      "Traitement des transactions de paiement",
      "Respect des obligations légales",
      "Amélioration de la satisfaction client et de la qualité du service",
      "Activités de communication et d'information (avec votre consentement)",
    ],
    s4Title: "4. Base juridique du traitement",
    s4Intro: "Vos données personnelles sont traitées sur les bases juridiques suivantes :",
    s4Items: [
      "Votre consentement explicite",
      "Directement lié à l'établissement ou l'exécution d'un contrat",
      "Respect des obligations légales",
      "Nécessaire pour nos intérêts légitimes",
    ],
    s5Title: "5. Transfert des données personnelles",
    s5Intro: "Vos données personnelles peuvent être partagées avec les parties suivantes :",
    s5Items: [
      "Prestataires de paiement : iyzico (pour le traitement des paiements)",
      "Hébergeurs : Supabase, Vercel",
      "Autorités légales : Institutions autorisées en cas d'obligation légale",
      "Coachs : Partage limité d'informations avec vos coachs désignés",
    ],
    s6Title: "6. Durée de conservation des données",
    s6Text: "Vos données personnelles sont conservées pendant la durée requise par les finalités du traitement. En cas de résiliation de l'adhésion, vos données sont supprimées ou anonymisées.",
    s7Title: "7. Politique de cookies",
    s7Intro: "Notre plateforme utilise des cookies pour améliorer l'expérience utilisateur :",
    s7Required: "Cookies essentiels",
    s7RequiredDesc: "Requis pour le fonctionnement du site",
    s7Analytics: "Cookies analytiques",
    s7AnalyticsDesc: "Statistiques d'utilisation",
    s7Preference: "Cookies de préférence",
    s7PreferenceDesc: "Préférences utilisateur",
    s8Title: "8. Vos droits",
    s8Intro: "Vous disposez des droits suivants :",
    s8Items: [
      "Savoir si vos données personnelles sont traitées",
      "Demander des informations si elles ont été traitées",
      "Connaître la finalité du traitement",
      "Connaître les tiers auxquels elles sont transférées",
      "Demander la correction si elles sont incomplètes ou inexactes",
      "Demander la suppression",
      "S'opposer à un résultat défavorable par analyse automatisée",
      "Demander réparation des dommages causés par un traitement illégal",
    ],
    s9Title: "9. Méthode de demande",
    s9Intro: "Vous pouvez exercer vos droits par les méthodes suivantes :",
    s9Note: "Vos demandes seront traitées gratuitement dans un délai maximum de 30 jours.",
    s10Title: "10. Modifications de la politique",
    s10Text: "Cette Politique de confidentialité peut être mise à jour. Les modifications prennent effet à la date de leur publication sur cette page.",
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

            {/* Giriş */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{t.intro}</p>
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
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>0531 359 41 87</span>
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

            {/* 5. Veri Aktarımı */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s5Title}</h2>
              <p className="text-gray-600 mb-3">{t.s5Intro}</p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-600">
                {t.s5Items.map((item, i) => (
                  <p key={i}>• {item}</p>
                ))}
              </div>
            </div>

            {/* 6. Saklama Süresi */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s6Title}</h2>
              <p className="text-gray-600">{t.s6Text}</p>
            </div>

            {/* 7. Çerezler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s7Title}</h2>
              <p className="text-gray-600 mb-3">{t.s7Intro}</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm">{t.s7Required}</h4>
                  <p className="text-green-700 text-xs mt-1">{t.s7RequiredDesc}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm">{t.s7Analytics}</h4>
                  <p className="text-blue-700 text-xs mt-1">{t.s7AnalyticsDesc}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm">{t.s7Preference}</h4>
                  <p className="text-orange-700 text-xs mt-1">{t.s7PreferenceDesc}</p>
                </div>
              </div>
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
                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <strong>Adres:</strong> {t.s1Address}
                </p>
              </div>
              <p className="text-gray-500 text-sm mt-3">{t.s9Note}</p>
            </div>

            {/* 10. Değişiklikler */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.s10Title}</h2>
              <p className="text-gray-600">{t.s10Text}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
