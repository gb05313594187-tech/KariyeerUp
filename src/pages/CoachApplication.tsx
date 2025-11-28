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
  AlertCircle,
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  User,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function CoachApplication() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    
    // Professional Info
    certification: '',
    certificationYear: '',
    experience: '',
    specializations: [] as string[],
    sessionFee: '',
    
    // Documents
    cvFile: null as File | null,
    certificateFile: null as File | null,
    
    // Additional
    bio: '',
    linkedIn: '',
    website: '',
    
    // Agreement
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

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (!formData.termsAccepted || !formData.ethicsAccepted) {
      toast.error('Lütfen kullanım koşullarını ve etik kuralları kabul edin');
      return;
    }

    // Success
    toast.success('Başvurunuz başarıyla alındı! En kısa sürede size dönüş yapacağız.');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Ad Soyad *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="fullName"
              placeholder="Adınız ve soyadınız"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              placeholder="+90 555 123 4567"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            placeholder="İstanbul"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Ülke</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="country"
              placeholder="Türkiye"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
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
          <Label htmlFor="certification">Sertifika Türü *</Label>
          <Select value={formData.certification} onValueChange={(value) => handleInputChange('certification', value)}>
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
          <Label htmlFor="certificationYear">Sertifika Yılı *</Label>
          <Input
            id="certificationYear"
            type="number"
            placeholder="2020"
            value={formData.certificationYear}
            onChange={(e) => handleInputChange('certificationYear', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Koçluk Deneyimi *</Label>
          <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
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
          <Label htmlFor="sessionFee">Önerilen Seans Ücreti (₺) *</Label>
          <Input
            id="sessionFee"
            type="number"
            placeholder="1000"
            value={formData.sessionFee}
            onChange={(e) => handleInputChange('sessionFee', e.target.value)}
          />
          <p className="text-xs text-gray-500">Önerilen: 750-2000 ₺</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Uzmanlık Alanları * (En az 2 seçin)</Label>
        <div className="grid md:grid-cols-2 gap-3">
          {specializations.map((spec) => (
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
        <div className="space-y-2">
          <Label htmlFor="cv">CV / Özgeçmiş *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <Input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('cvFile', e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="cv" className="cursor-pointer">
              <p className="text-sm text-gray-600 mb-1">
                {formData.cvFile ? formData.cvFile.name : 'CV dosyanızı yükleyin'}
              </p>
              <p className="text-xs text-gray-500">PDF, DOC veya DOCX (Max 5MB)</p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificate">Koçluk Sertifikası *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
            <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <Input
              id="certificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('certificateFile', e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="certificate" className="cursor-pointer">
              <p className="text-sm text-gray-600 mb-1">
                {formData.certificateFile ? formData.certificateFile.name : 'Sertifika dosyanızı yükleyin'}
              </p>
              <p className="text-xs text-gray-500">PDF, JPG veya PNG (Max 5MB)</p>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Kısa Biyografi</Label>
          <Textarea
            id="bio"
            placeholder="Kendinizi ve koçluk yaklaşımınızı kısaca tanıtın..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedIn">LinkedIn Profili</Label>
            <Input
              id="linkedIn"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedIn}
              onChange={(e) => handleInputChange('linkedIn', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Kişisel Website</Label>
            <Input
              id="website"
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Geri
        </Button>
        <Button onClick={() => setStep(4)} className="bg-red-600 hover:bg-red-700">
          Sonraki Adım
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Başvuru Özeti</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Ad Soyad:</strong> {formData.fullName}</p>
          <p><strong>E-posta:</strong> {formData.email}</p>
          <p><strong>Telefon:</strong> {formData.phone}</p>
          <p><strong>Sertifika:</strong> {formData.certification}</p>
          <p><strong>Deneyim:</strong> {formData.experience}</p>
          <p><strong>Uzmanlık Alanları:</strong> {formData.specializations.join(', ')}</p>
          <p><strong>Seans Ücreti:</strong> ₺{formData.sessionFee}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm cursor-pointer">
            <a href="#" className="text-red-600 hover:underline">Kullanım Koşulları</a> ve{' '}
            <a href="#" className="text-red-600 hover:underline">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="ethics"
            checked={formData.ethicsAccepted}
            onCheckedChange={(checked) => handleInputChange('ethicsAccepted', checked as boolean)}
          />
          <label htmlFor="ethics" className="text-sm cursor-pointer">
            <a href="#" className="text-red-600 hover:underline">Koçluk Etik Kuralları</a>'nı okudum ve uyacağımı taahhüt ediyorum.
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Başvuru Süreci</p>
            <p>Başvurunuz 3-5 iş günü içinde değerlendirilecektir. Uygun görüldüğü takdirde, mülakat için sizinle iletişime geçilecektir.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(3)}>
          Geri
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-red-600 hover:bg-red-700"
          disabled={!formData.termsAccepted || !formData.ethicsAccepted}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Başvuruyu Gönder
        </Button>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Kişisel Bilgiler', icon: User },
    { number: 2, title: 'Profesyonel Bilgiler', icon: Briefcase },
    { number: 3, title: 'Belgeler', icon: FileText },
    { number: 4, title: 'Onay', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-100 text-red-600">Koç Başvurusu</Badge>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Kariyeer Ekosisteminde Yerinizi Alın
          </h1>
          <p className="text-xl text-gray-600">
            Başvuru formunu doldurun, ekibimiz sizinle iletişime geçsin
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              
              return (
                <div key={s.number} className="flex-1">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted ? 'bg-green-500 border-green-500' :
                      isActive ? 'bg-red-600 border-red-600' :
                      'bg-white border-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${isActive ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                    {s.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
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

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Sorularınız mı var?{' '}
            <a href="mailto:info@kariyeer.com" className="text-red-600 hover:underline">
              info@kariyeer.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}