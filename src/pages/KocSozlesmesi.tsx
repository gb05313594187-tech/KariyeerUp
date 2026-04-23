// src/pages/KocSozlesmesi.tsx
// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Award, DollarSign, Star, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
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
            {language === 'tr' ? 'Bağımsız Mentor ve Eğitimci Sözleşmesi' : 'Independent Mentor and Educator Agreement'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'tr' ? 'Mentor ve Teknoloji Platformu İş Birliği Şartları' : 'Terms of Cooperation Between Mentor and Technology Platform'}
          </p>
        </div>

        {/* İŞKUR VE YASAL STATÜ KORUMASI */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700 text-base uppercase font-black">
              <ShieldCheck className="mr-3 h-5 w-5" />
              {language === 'tr' ? 'Yasal Statü ve Hizmet Tanımı' : 'Legal Status and Service Definition'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-900 leading-relaxed space-y-2">
            <p>
              {language === 'tr' 
                ? '1. Kariyeer.com, 4904 sayılı kanun kapsamında bir Özel İstihdam Bürosu değildir. Platform, yalnızca eğitimci/mentorlar ile kullanıcıları buluşturan bir teknoloji altyapısıdır.'
                : '1. Kariyeer.com is not a Private Employment Agency under Law No. 4904. The platform is merely a technology infrastructure connecting educators/mentors with users.'}
            </p>
            <p>
              {language === 'tr'
                ? '2. Mentor, platform üzerinden kesinlikle İŞ BULMA veya İŞE YERLEŞTİRME vaadinde bulunamaz. Verilen hizmet münhasıran "Kariyer Mentorluğu, Mülakat Hazırlığı ve Yetkinlik Eğitimi" kapsamındadır.'
                : '2. The Mentor shall strictly not promise JOB PLACEMENT or RECRUITMENT via the platform. Services are exclusively within "Career Mentoring, Interview Prep, and Competency Training".'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Award className="mr-3 h-6 w-6" />
              {language === 'tr' ? '1. Sertifika ve Yetkinlik Beyanı' : '1. Certificate and Competency Declaration'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Mentor, platformda eğitim verebilmek için gerekli profesyonel yetkinlik belgelerine (ICF, MYK veya ilgili alan sertifikaları) sahip olduğunu taahhüt eder.'
                : 'The mentor undertakes that they have the necessary professional competency documents (ICF, MYK or relevant field certificates) to provide training on the platform.'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <DollarSign className="mr-3 h-6 w-6" />
              {language === 'tr' ? '2. Hizmet Bedeli ve Hak Ediş' : '2. Service Fee and Entitlement'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p className="font-semibold">{language === 'tr' ? 'Mali Şartlar:' : 'Financial Terms:'}</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                {language === 'tr'
                  ? 'Yapılan tahsilatlar "Eğitim ve Mentorluk Hizmet Bedeli" olarak adlandırılır.'
                  : 'Collections are defined as "Education and Mentoring Service Fee".'}
              </li>
              <li>
                {language === 'tr'
                  ? 'Platform, teknoloji kullanım ve aracılık bedeli olarak %20 komisyon uygular.'
                  : 'The platform applies a 20% commission as a technology usage and brokerage fee.'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-3 h-6 w-6" />
              {language === 'tr' ? '3. Kesin Yasaklar ve Etik Kurallar' : '3. Strict Prohibitions and Ethical Rules'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
              <p className="text-sm font-bold text-red-800">
                {language === 'tr' ? 'Aşağıdaki eylemler sözleşmenin derhal feshine yol açar:' : 'The following actions lead to immediate termination of the contract:'}
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm text-red-700">
                <li>{language === 'tr' ? 'Danışana işe yerleştirme garantisi vermek' : 'Giving a job placement guarantee to the client'}</li>
                <li>{language === 'tr' ? 'Üçüncü taraf şirketlere personel tedariki için aracılık yapmak' : 'Mediating personnel supply to third-party companies'}</li>
                <li>{language === 'tr' ? 'Platform dışı ödeme talep etmek' : 'Requesting off-platform payments'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Star className="mr-3 h-6 w-6" />
              {language === 'tr' ? '4. Hizmet Kalitesi' : '4. Service Quality'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-3">
            <p>
              {language === 'tr'
                ? 'Mentor, verdiği kariyer gelişim eğitimlerinin içeriğinden bizzat sorumludur. Kariyeer, eğitimin pedagojik veya teknik içeriğine müdahale etmez.'
                : 'The mentor is personally responsible for the content of the career development trainings they provide. Kariyeer does not interfere with the pedagogical or technical content of the training.'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 border-gray-300">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm italic">
              {language === 'tr'
                ? 'Bu sözleşme, mentorun platform profilini onaylamasıyla yürürlüğe girer. Mentor, bir iş bulma aracısı olmadığını ve sadece bağımsız eğitimci sıfatıyla platformda yer aldığını beyan ve kabul eder. Son güncelleme: 23.04.2026'
                : 'This agreement comes into effect upon the mentor confirming their platform profile. The mentor declares and accepts that they are not a job finder and are on the platform only as an independent educator. Last update: 23.04.2026'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
