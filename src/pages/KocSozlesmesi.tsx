import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Award, DollarSign, Star, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function KocSozlesmesi() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {language === 'tr' ? 'Koç Hizmet Sözleşmesi' : 'Coach Service Agreement'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr' ? 'Koç ve Platform Arasındaki Sözleşme' : 'Agreement Between Coach and Platform'}
          </p>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Award className="mr-3 h-6 w-6" />
              {language === 'tr' ? '1. Sertifika Beyanı ve Doğruluk Yükümlülüğü' : '1. Certificate Declaration and Accuracy Obligation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Koç, platformda yer alabilmek için ICF (ACC, PCC veya MCC) veya MYK Seviye 6 sertifikasına sahip olduğunu beyan eder ve belgeler.'
                : 'The coach declares and documents that they have an ICF (ACC, PCC or MCC) or MYK Level 6 certificate to be included on the platform.'}
            </p>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm">
                <strong>{language === 'tr' ? 'Önemli:' : 'Important:'}</strong>{' '}
                {language === 'tr'
                  ? 'Sahte veya geçersiz sertifika sunulması durumunda koçun hesabı derhal kapatılır ve yasal işlem başlatılır. Koç, sertifika bilgilerinin güncel tutulmasından sorumludur.'
                  : 'In case of submission of fake or invalid certificate, the coach\'s account will be closed immediately and legal action will be initiated. The coach is responsible for keeping certificate information up to date.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <DollarSign className="mr-3 h-6 w-6" />
              {language === 'tr' ? '2. Komisyon Oranı ve Ödeme Planı' : '2. Commission Rate and Payment Plan'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p className="font-semibold">{language === 'tr' ? 'Komisyon Yapısı:' : 'Commission Structure:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Standart komisyon oranı: Her seans ücretinin %20\'si'
                  : 'Standard commission rate: 20% of each session fee'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Kurucu koçlar için ilk 6 ay: %15 veya ücretsiz'
                  : 'For founding coaches, first 6 months: 15% or free'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Premium üyelik: Aylık sabit ücret karşılığında komisyonsuz'
                  : 'Premium membership: Commission-free for monthly fixed fee'}
              </li>
            </ul>
            <p className="font-semibold mt-4">{language === 'tr' ? 'Ödeme Koşulları:' : 'Payment Terms:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Ödemeler her ayın 15\'inde banka hesabına aktarılır'
                  : 'Payments are transferred to bank account on the 15th of each month'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Minimum ödeme tutarı: 500 TL (altında birikir)'
                  : 'Minimum payment amount: 500 TL (accumulates below)'}
              </li>
              <li>
                {language === 'tr'
                  ? 'İptal edilen seanslar için komisyon alınmaz'
                  : 'No commission for cancelled sessions'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '3. Seans Düzenleme, İptal ve Geri Bildirim' : '3. Session Scheduling, Cancellation and Feedback'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p className="font-semibold">{language === 'tr' ? 'Seans Yönetimi:' : 'Session Management:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Koç, müsaitlik takvimini güncel tutmakla yükümlüdür'
                  : 'Coach is obliged to keep availability calendar up to date'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Seans süresi minimum 45 dakika, maksimum 90 dakika olmalıdır'
                  : 'Session duration must be minimum 45 minutes, maximum 90 minutes'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Seans başlangıcından 15 dakika önce hatırlatma gönderilir'
                  : 'Reminder is sent 15 minutes before session start'}
              </li>
            </ul>
            <p className="font-semibold mt-4">{language === 'tr' ? 'İptal Politikası:' : 'Cancellation Policy:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Koç tarafından iptal: 24 saat önceden bildirilmelidir, aksi halde ceza uygulanır'
                  : 'Cancellation by coach: Must be notified 24 hours in advance, otherwise penalty applies'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Danışan tarafından iptal: 12 saat öncesine kadar ücretsiz, sonrası %50 ücret kesilir'
                  : 'Cancellation by client: Free until 12 hours before, 50% fee after that'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Acil durumlarda (hastalık, vefat vb.) esneklik gösterilir'
                  : 'Flexibility is shown in emergencies (illness, death, etc.)'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '4. Profil İçeriği ve Doğruluk' : '4. Profile Content and Accuracy'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Koç, profil bilgilerinin (özgeçmiş, eğitim, deneyim, referanslar) doğru ve güncel olmasından sorumludur. Yanıltıcı veya yanlış bilgi tespit edilmesi durumunda:'
                : 'Coach is responsible for ensuring that profile information (CV, education, experience, references) is accurate and up to date. In case of misleading or false information:'}
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>{language === 'tr' ? 'İlk ihlal: Uyarı ve düzeltme süresi (7 gün)' : 'First violation: Warning and correction period (7 days)'}</li>
              <li>{language === 'tr' ? 'İkinci ihlal: Profil askıya alınır (30 gün)' : 'Second violation: Profile suspended (30 days)'}</li>
              <li>{language === 'tr' ? 'Üçüncü ihlal: Hesap kalıcı olarak kapatılır' : 'Third violation: Account permanently closed'}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Star className="mr-3 h-6 w-6" />
              {language === 'tr' ? '5. Hizmet Kalitesi ve Düşük Puan Yönetimi' : '5. Service Quality and Low Rating Management'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Platform, danışan memnuniyetini ön planda tutar. Koçların performansı düzenli olarak değerlendirilir:'
                : 'Platform prioritizes client satisfaction. Coaches\' performance is regularly evaluated:'}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>{language === 'tr' ? 'Kalite Standartları:' : 'Quality Standards:'}</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  {language === 'tr'
                    ? 'Minimum ortalama puan: 4.0/5.0'
                    : 'Minimum average rating: 4.0/5.0'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Ortalama 3.5-4.0 arası: Uyarı ve iyileştirme planı'
                    : 'Average 3.5-4.0: Warning and improvement plan'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Ortalama 3.5 altı (3 ay süreyle): Profil askıya alınır'
                    : 'Average below 3.5 (for 3 months): Profile suspended'}
                </li>
                <li>
                  {language === 'tr'
                    ? 'Tekrarlanan şikayetler: Hesap kapatma yetkisi platformdadır'
                    : 'Repeated complaints: Platform has authority to close account'}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">
              {language === 'tr' ? '6. Gizlilik ve Etik Kurallar' : '6. Confidentiality and Ethical Rules'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Koç, ICF Etik Kuralları ve Mesleki Standartlar\'a uymayı taahhüt eder:'
                : 'Coach commits to comply with ICF Code of Ethics and Professional Standards:'}
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Danışan bilgilerinin gizliliğini korumak'
                  : 'Protect confidentiality of client information'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Çıkar çatışmasından kaçınmak'
                  : 'Avoid conflicts of interest'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Profesyonel sınırları korumak'
                  : 'Maintain professional boundaries'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Yetkinlik alanı dışında hizmet vermemek'
                  : 'Not provide services outside area of competence'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-3 h-6 w-6" />
              {language === 'tr' ? 'Sözleşme Feshi' : 'Contract Termination'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              {language === 'tr'
                ? 'Her iki taraf da 30 gün önceden bildirimde bulunarak sözleşmeyi feshedebilir. Platform, etik ihlal veya kalite standartlarının karşılanmaması durumunda sözleşmeyi derhal feshetme hakkını saklı tutar. Son güncelleme: 2024'
                : 'Either party may terminate the agreement by giving 30 days\' notice. Platform reserves the right to terminate the agreement immediately in case of ethical violations or failure to meet quality standards. Last update: 2024'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}