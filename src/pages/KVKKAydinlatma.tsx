// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Clock, Users, FileText, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function KVKKAydinlatma() {
  const { language } = useLanguage();

  const sections = [
    {
      icon: <Database className="h-6 w-6" />,
      title: language === 'tr' ? 'Veri Sorumlusu' : 'Data Controller',
      content: language === 'tr'
        ? 'Kariyeer (Eğitim Teknolojileri ve Mentorluk Platformu) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla, kişisel verilerinizi gelişim odaklı hizmetlerimizin sunulması kapsamında işlemekteyiz.'
        : 'As the Kariyeer (Educational Technology and Mentoring Platform), we process your personal data as the data controller in accordance with the Personal Data Protection Law No. 6698 ("KVKK") within the scope of offering development-oriented services.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: language === 'tr' ? 'İşlenen Kişisel Veriler' : 'Personal Data Processed',
      content: language === 'tr'
        ? 'Kimlik bilgileri, iletişim bilgileri, eğitim geçmişi, yetkinlik ve gelişim puanları, katılım sağlanan mentorluk seans kayıtları, finansal bilgiler (ödeme ve fatura), platform kullanım verileri (IP, çerez, oturum kayıtları).'
        : 'Identity information, contact details, educational background, competence and development scores, records of attended mentoring sessions, financial information (payment and invoice), platform usage data (IP, cookies, session logs).',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: language === 'tr' ? 'Veri İşleme Amaçları' : 'Data Processing Purposes',
      content: language === 'tr'
        ? 'Platform gelişim üyeliğinin yönetilmesi, katılımcı-mentor eşleşmesi üzerinden eğitim danışmanlığı sağlanması, vaka analizleri ve yetkinlik ölçüm süreçlerinin yürütülmesi, gelişim planlarının takibi, ödeme işlemlerinin gerçekleştirilmesi, hizmet kalitesinin artırılması ve akademik/sektörel rehberlik faaliyetlerinin iyileştirilmesi, yasal yükümlülüklerin yerine getirilmesi.'
        : 'Managing platform development membership, providing educational consultancy through participant-mentor matching, conducting case studies and competence measurement processes, following up development plans, processing payments, improving service quality and academic/sectoral guidance activities, fulfilling legal obligations.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: language === 'tr' ? 'Veri Aktarımı' : 'Data Transfer',
      content: language === 'tr'
        ? 'Kişisel verileriniz, eğitim hizmetinin gereği olarak mentorlar ile paylaşılabilir, ödeme altyapısı için anlaşmalı kuruluşlara aktarılabilir. Kariyeer, bir Özel İstihdam Bürosu değildir; bu nedenle verileriniz üçüncü kişilere işe yerleştirme veya istihdam aracılığı amacıyla aktarılmaz. Paylaşımlar sadece gelişim takibi ve mentorluk faaliyetleri ile sınırlıdır.'
        : 'Your personal data may be shared with mentors as required by the educational service or transferred to contracted payment providers. Kariyeer is not a Private Employment Agency; therefore, your data is not transferred to third parties for job placement or recruitment intermediation. Sharing is limited to development tracking and mentoring activities.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: language === 'tr' ? 'Saklama Süresi' : 'Retention Period',
      content: language === 'tr'
        ? 'Kişisel verileriniz, gelişim takip sürecinizin ve yasal yükümlülüklerin gerektirdiği süre boyunca saklanır. Eğitim ve mentorluk ilişkiniz sona erdiğinde, vergi ve ticari mevzuat uyarınca saklanması zorunlu olanlar hariç verileriniz silinir veya anonim hale getirilir.'
        : 'Your personal data is stored for as long as required by your development tracking process and legal obligations. Upon termination of the educational and mentoring relationship, your data will be deleted or anonymized, except for those required to be kept under tax and commercial legislation.',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: language === 'tr' ? 'Haklarınız' : 'Your Rights',
      content: language === 'tr'
        ? 'KVKK\'nın 11. maddesi uyarınca; verilerinizin işlenme amacını öğrenme, eksik verilerin düzeltilmesini talep etme ve verilerinizin mentorluk hizmeti dışında kullanılmamasını isteme haklarına sahipsiniz. Detaylı taleplerinizi kvkk@kariyeer.com adresine iletebilirsiniz.'
        : 'Pursuant to Article 11 of the KVKK; you have the right to learn the purpose of processing, request correction of incomplete data, and demand that your data not be used outside of mentoring services. You can send your detailed requests to kvkk@kariyeer.com.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-100">
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter uppercase italic">
            {language === 'tr' ? 'KVKK Aydınlatma Metni' : 'KVKK Information Text'}
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {language === 'tr'
              ? 'Mentorluk ve Gelişim Faaliyetleri Bilgilendirmesi'
              : 'Information on Mentoring and Development Activities'}
          </p>
        </div>

        <Card className="mb-8 border-none shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-600 to-amber-500" />
          <CardContent className="pt-8">
            <p className="text-slate-700 leading-relaxed font-medium">
              {language === 'tr'
                ? 'Kariyeer platformu olarak, kişisel verilerinizin güvenliği ve gizliliği en temel önceliğimizdir. Bu metin, platformumuzun sunduğu mentorluk, yetkinlik ölçümü ve eğitim planlama hizmetleri kapsamında verilerinizin nasıl işlendiğini açıklamak üzere KVKK uyarınca hazırlanmıştır.'
                : 'As the Kariyeer platform, the security and privacy of your personal data is our primary priority. This text has been prepared in accordance with KVKK to explain how your data is processed within the scope of mentoring, competence measurement, and education planning services offered by our platform.'}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl bg-white group">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 text-lg font-black uppercase tracking-tight">
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-orange-50 rounded-2xl flex items-center justify-center mr-4 transition-colors">
                    <span className="text-orange-600">{section.icon}</span>
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed font-medium text-sm italic">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-slate-900 border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="pt-10 px-10">
            <CardTitle className="text-white font-black italic uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-8 bg-orange-600 rounded-full" />
              {language === 'tr' ? 'İletişim Masası' : 'Contact Desk'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-slate-300 font-bold uppercase text-xs tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-500" />
                  </div>
                  <p><span className="text-slate-500">{language === 'tr' ? 'E-posta:' : 'Email:'}</span> kvkk@kariyeer.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-500" />
                  </div>
                  <p><span className="text-slate-500">{language === 'tr' ? 'Birim:' : 'Dept:'}</span> KVKK Uyum Birimi</p>
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xs text-slate-400 leading-relaxed font-bold italic">
                  {language === 'tr'
                    ? 'Kariyeer platformu bir Özel İstihdam Bürosu değildir. Verileriniz hiçbir koşulda istihdam aracılığı amacıyla işlenmemektedir.'
                    : 'Kariyeer platform is not a Private Employment Agency. Your data is under no circumstances processed for employment intermediation purposes.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
