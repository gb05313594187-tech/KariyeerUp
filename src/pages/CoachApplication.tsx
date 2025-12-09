// src/pages/CoachApplication.tsx
// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  CheckCircle2,
  Award,
  Briefcase,
  Mail,
  Phone,
  User,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase'; // 🔴 Supabase import

export default function CoachApplication() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // loading state

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    certification: '',
    certificationYear: '',
    experience: '',
    specializations: [] as string[],
    sessionFee: '',
    cvFile: null as File | null,
    certificateFile: null as File | null,
    bio: '',
    linkedIn: '',
    website: '',
    termsAccepted: false,
    ethicsAccepted: false,
  });

  const specializations = [
    'Kariyer Geçişi',
    'Liderlik Koçluğu',
    'Yönetici Koçluğu',
    'Girişimcilik',
    'İş-Yaşam Dengesi',
    'Performans Koçluğu',
    'Takım Koçluğu',
    'Kişisel Gelişim',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  // 🔥 Supabase'e kayıt atan yeni handleSubmit
  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (!formData.termsAccepted || !formData.ethicsAccepted) {
      toast.error('Lütfen koşulları kabul edin');
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionFeeNumber =
        formData.sessionFee && !Number.isNaN(Number(formData.sessionFee))
          ? Number(formData.sessionFee)
          : null;

      const { error } = await supabase.from('coach_applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          certification: formData.certification,
          certification_year: formData.certificationYear,
          experience: formData.experience,
          specializations: formData.specializations, // text[] kolonuna array olarak gider
          session_fee: sessionFeeNumber,
          bio: formData.bio,
          linkedin: formData.linkedIn,
          website: formData.website,
          cv_path: formData.cvFile ? formData.cvFile.name : null,
          certificate_path: formData.certificateFile ? formData.certificateFile.name : null,
          // created_at otomatik now() ise göndermeye gerek yok
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error);
        toast.error('Başvuru kaydedilirken bir hata oluştu');
        return;
      }

      toast.success('Başvurunuz başarıyla alındı!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Kişisel Bilgiler', icon: User },
    { number: 2, title: 'Profesyonel Bilgiler', icon: Briefcase },
    { number: 3, title: 'Belgeler', icon: FileText },
    { number: 4, title: 'Onay', icon: CheckCircle2 },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Ad Soyad *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Adınız ve soyadınız"
              value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>E-posta *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Telefon *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="+90 555 123 4567"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Şehir</Label>
          <Input
            placeholder="İstanbul"
            value={formData.city}
            onChange={e => handleInputChange('city', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Ülke</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Türkiye"
              value={formData.country}
              onChange={e => handleInputChange('country', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setStep(2)} className="bg-red-600 hover:bg-red-700">
          Sonraki Adım
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Sertifika Türü *</Label>
          <Select
            value={formData.certification}
            onValueChange={v => handleInputChange('certification', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sertifika seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icf-acc">ICF ACC</SelectItem>
              <SelectItem value="icf-pcc">ICF PCC</SelectItem>
              <SelectItem value="icf-mcc">ICF MCC</SelectItem>
              <SelectItem value="myk">MYK Sertifikası</SelectItem>
              <SelectItem value="other">Diğer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sertifika Yılı *</Label>
          <Input
            type="number"
            placeholder="2020"
            value={formData.certificationYear}
            onChange={e => handleInputChange('certificationYear', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Koçluk Deneyimi *</Label>
          <Select value={formData.experience} onValueChange={v => handleInputChange('experience', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Deneyim seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 yıl</SelectItem>
              <SelectItem value="2-5">2-5 yıl</SelectItem>
              <SelectItem value="5-10">5-10 yıl</SelectItem>
              <SelectItem value="10+">10+ yıl</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Önerilen Seans Ücreti *</Label>
          <Input
            type="number"
            placeholder="1000"
            value={formData.sessionFee}
            onChange={e => handleInputChange('sessionFee', e.target.value)}
          />
          <p className="text-xs text-gray-500">Önerilen: 750–2000 ₺</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Uzmanlık Alanları *</Label>
        <div className="grid md:grid-cols-2 gap-3">
          {specializations.map(spec => (
            <div key={spec} className="flex items-center space-x-2">
              <Checkbox
                id={spec}
                checked={formData.specializations.includes(spec)}
                onCheckedChange={() => handleSpecializationToggle(spec)}
              />
              <label htmlFor={spec} className="text-sm cursor-pointer">
                {spec}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Geri
        </Button>
        <Button onClick={() => setStep(3)} className="bg-red-600 hover:bg-red-700">
          Sonraki Adım
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>CV / Özgeçmiş *</Label>
          <div className="border-2 border-dashed p-6 text-center rounded-lg">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => handleFileChange('cvFile', e.target.files?.[0] || null)}
              className="hidden"
              id="cv"
            />
            <label htmlFor="cv" className="cursor-pointer text-sm">
              {formData.cvFile ? formData.cvFile.name : 'CV yükleyin'}
            </label>
          </div>
        </div>

        <div>
          <Label>Koçluk Sertifikası *</Label>
          <div className="border-2 border-dashed p-6 text-center rounded-lg">
            <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <Input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={e =>
                handleFileChange('certificateFile', e.target.files?.[0] || null)
              }
              className="hidden"
              id="certificate"
            />
            <label htmlFor="certificate" className="cursor-pointer text-sm">
              {formData.certificateFile ? formData.certificateFile.name : 'Sertifika yükleyin'}
            </label>
          </div>
        </div>
      </div>

      <div>
        <Label>Kısa Biyografi</Label>
        <Textarea
          rows={4}
          placeholder="Kendinizi kısaca tanıtın..."
          value={formData.bio}
          onChange={e => handleInputChange('bio', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>LinkedIn</Label>
          <Input
            placeholder="https://linkedin.com/in/..."
            value={formData.linkedIn}
            onChange={e => handleInputChange('linkedIn', e.target.value)}
          />
        </div>

        <div>
          <Label>Website</Label>
          <Input
            placeholder="https://..."
            value={formData.website}
            onChange={e => handleInputChange('website', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Geri
        </Button>
        <Button onClick={() => setStep(4)} className="bg-red-600 hover:bg-red-700">
          Sonraki Adım <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-sm">
        <p>
          <strong>Ad Soyad:</strong> {formData.fullName}
        </p>
        <p>
          <strong>E-posta:</strong> {formData.email}
        </p>
        <p>
          <strong>Telefon:</strong> {formData.phone}
        </p>
        <p>
          <strong>Sertifika:</strong> {formData.certification}
        </p>
        <p>
          <strong>Deneyim:</strong> {formData.experience}
        </p>
        <p>
          <strong>Uzmanlık:</strong> {formData.specializations.join(', ')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <Checkbox
            checked={formData.termsAccepted}
            onCheckedChange={v => handleInputChange('termsAccepted', v)}
          />
          <label className="text-sm cursor-pointer">
            Kullanım Koşulları ve Gizlilik Politikasını kabul ediyorum.
          </label>
        </div>

        <div className="flex space-x-3">
          <Checkbox
            checked={formData.ethicsAccepted}
            onCheckedChange={v => handleInputChange('ethicsAccepted', v)}
          />
          <label className="text-sm cursor-pointer">
            Etik Kurallara uyacağımı onaylıyorum.
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(3)}>
          Geri
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting || !formData.termsAccepted || !formData.ethicsAccepted}
          onClick={handleSubmit}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-100 text-red-600">Koç Başvurusu</Badge>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Kariyeer Ekosisteminde Yerinizi Alın
          </h1>
          <p className="text-xl text-gray-600">
            Başvuru formunu doldurun, ekibimiz sizinle iletişime geçsin
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : isActive
                          ? 'bg-red-600 border-red-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>

                  <p
                    className={`text-xs mt-2 ${
                      isActive ? 'text-red-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {s.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">
              {steps[step - 1].title}
            </CardTitle>
            <CardDescription>
              Adım {step} / {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Sorularınız mı var?{' '}
            <a href="mailto:destek@kariyeer.com" className="text-red-600 hover:underline">
              info@kariyeer.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
