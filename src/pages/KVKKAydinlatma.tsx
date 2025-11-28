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
        ? 'Kariyeer platformu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan kapsamda işlemekteyiz.'
        : 'As the Kariyeer platform, we process your personal data as the data controller in accordance with the Personal Data Protection Law No. 6698 ("KVKK") as described below.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: language === 'tr' ? 'İşlenen Kişisel Veriler' : 'Personal Data Processed',
      content: language === 'tr'
        ? 'Kimlik bilgileri (ad, soyad, T.C. kimlik no), iletişim bilgileri (e-posta, telefon, adres), özgeçmiş ve kariyer bilgileri, sertifika ve eğitim bilgileri, finansal bilgiler (ödeme ve fatura bilgileri), platform kullanım verileri (IP adresi, çerez bilgileri, oturum kayıtları).'
        : 'Identity information (name, surname, ID number), contact information (email, phone, address), CV and career information, certificate and education information, financial information (payment and invoice details), platform usage data (IP address, cookie information, session logs).',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: language === 'tr' ? 'Veri İşleme Amaçları' : 'Data Processing Purposes',
      content: language === 'tr'
        ? 'Platform üyelik işlemlerinin yürütülmesi, koç-danışan eşleştirme hizmetinin sağlanması, randevu ve seans yönetimi, ödeme işlemlerinin gerçekleştirilmesi, iletişim faaliyetlerinin yürütülmesi, hizmet kalitesinin artırılması ve kullanıcı deneyiminin iyileştirilmesi, yasal yükümlülüklerin yerine getirilmesi, güvenlik ve dolandırıcılık önleme.'
        : 'Managing platform membership processes, providing coach-client matching services, appointment and session management, processing payments, conducting communication activities, improving service quality and user experience, fulfilling legal obligations, security and fraud prevention.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: language === 'tr' ? 'Veri Aktarımı' : 'Data Transfer',
      content: language === 'tr'
        ? 'Kişisel verileriniz, hizmetin gereği olarak koçlar ile paylaşılabilir, ödeme işlemleri için anlaşmalı ödeme kuruluşlarına aktarılabilir, yasal zorunluluklar çerçevesinde yetkili kamu kurum ve kuruluşları ile paylaşılabilir, teknik altyapı hizmet sağlayıcılarına (sunucu, bulut depolama) aktarılabilir. Verileriniz yurt dışına aktarılmaz, ancak kullanılan bulut hizmetlerinin sunucuları yurt dışında olabilir (KVKK uyumlu sözleşmelerle korunur).'
        : 'Your personal data may be shared with coaches as required by the service, transferred to contracted payment institutions for payment processing, shared with authorized public institutions and organizations within the framework of legal obligations, transferred to technical infrastructure service providers (server, cloud storage). Your data is not transferred abroad, but the servers of cloud services used may be abroad (protected by KVKK-compliant contracts).',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: language === 'tr' ? 'Saklama Süresi' : 'Retention Period',
      content: language === 'tr'
        ? 'Kişisel verileriniz, işleme amacının gerekli kıldığı süre boyunca saklanır. Üyelik sona erdiğinde veya silme talebi geldiğinde, yasal saklama yükümlülükleri (örn. vergi mevzuatı için 10 yıl) hariç olmak üzere verileriniz silinir veya anonim hale getirilir.'
        : 'Your personal data is stored for as long as the processing purpose requires. When membership ends or a deletion request is received, your data will be deleted or anonymized, except for legal retention obligations (e.g., 10 years for tax legislation).',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: language === 'tr' ? 'Haklarınız' : 'Your Rights',
      content: language === 'tr'
        ? 'KVKK\'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz: Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, KVKK\'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme, düzeltme, silme veya yok edilme işlemlerinin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonuç doğmasına itiraz etme, kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.'
        : 'In accordance with Article 11 of the KVKK, you have the following rights: To learn whether your personal data is processed, to request information if processed, to learn the purpose of processing and whether it is used appropriately, to know the third parties to whom it is transferred domestically or abroad, to request correction if processed incompletely or incorrectly, to request deletion or destruction within the framework of the conditions stipulated in the KVKK, to request notification of correction, deletion or destruction operations to third parties to whom personal data has been transferred, to object to the occurrence of a result against you due to analysis exclusively by automated systems, to request compensation for damages if you suffer damage due to illegal processing.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'KVKK Aydınlatma Metni' : 'KVKK Information Text'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr'
              ? 'Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme'
              : 'Information within the Scope of Personal Data Protection Law'}
          </p>
        </div>

        <Card className="mb-8 border-red-200">
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              {language === 'tr'
                ? 'Kariyeer platformu olarak, kişisel verilerinizin güvenliği bizim için önceliklidir. Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verilerinizin nasıl işlendiği, saklandığı ve korunduğu hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.'
                : 'As the Kariyeer platform, the security of your personal data is our priority. This information text has been prepared in accordance with the Personal Data Protection Law No. 6698 to inform you about how your personal data is processed, stored and protected.'}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? 'İletişim' : 'Contact'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              {language === 'tr'
                ? 'Kişisel verilerinizle ilgili taleplerinizi aşağıdaki iletişim kanalları üzerinden bize iletebilirsiniz:'
                : 'You can submit your requests regarding your personal data through the following contact channels:'}
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>{language === 'tr' ? 'E-posta:' : 'Email:'}</strong> kvkk@kariyeer.com</p>
              <p><strong>{language === 'tr' ? 'Adres:' : 'Address:'}</strong> [Platform Adresi]</p>
              <p className="text-sm text-gray-600 mt-4">
                {language === 'tr'
                  ? 'Talepleriniz en geç 30 gün içinde değerlendirilecek ve sonuçlandırılacaktır.'
                  : 'Your requests will be evaluated and finalized within 30 days at the latest.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}