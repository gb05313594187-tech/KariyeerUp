import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Building2, Users, User } from 'lucide-react';
import { savePartnershipRequest } from '@/data/mockData';
import type { PartnershipRequest } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

export default function Partnership() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'company' as 'company' | 'institution' | 'individual',
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    sector: '',
    services: [] as string[],
    participantCount: '',
    startDate: '',
    duration: '',
    message: '',
    consent: false,
  });

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: PartnershipRequest = {
      id: Date.now().toString(),
      type: formData.type,
      companyName: formData.companyName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      sector: formData.sector,
      services: formData.services,
      participantCount: formData.participantCount ? parseInt(formData.participantCount) : undefined,
      startDate: formData.startDate,
      duration: formData.duration,
      message: formData.message,
      date: new Date().toISOString(),
      status: 'pending',
    };

    savePartnershipRequest(request);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">{t('requestSubmitted')}</h2>
            <p className="text-gray-600 mb-6">
              {t('requestSubmittedDesc')}
            </p>
            <Button onClick={() => window.location.href = '/'} className="bg-red-600 hover:bg-red-700">
              {t('backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">{t('partnershipTitle')}</h1>
          <p className="text-lg text-gray-600">{t('partnershipDesc')}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Application Type */}
              <div>
                <Label className="text-base font-semibold mb-3 block">{t('applicationType')} *</Label>
                <RadioGroup value={formData.type} onValueChange={(value: 'company' | 'institution' | 'individual') => setFormData(prev => ({ ...prev, type: value }))}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="flex items-center cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 mr-2 text-red-600" />
                      {t('company')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                    <RadioGroupItem value="institution" id="institution" />
                    <Label htmlFor="institution" className="flex items-center cursor-pointer flex-1">
                      <Users className="h-5 w-5 mr-2 text-red-600" />
                      {t('institution')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="flex items-center cursor-pointer flex-1">
                      <User className="h-5 w-5 mr-2 text-red-600" />
                      {t('individual')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Company Name */}
              {(formData.type === 'company' || formData.type === 'institution') && (
                <div>
                  <Label htmlFor="companyName">{t('companyName')} *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    required
                  />
                </div>
              )}

              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">{t('fullName')} *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              {/* Sector */}
              {(formData.type === 'company' || formData.type === 'institution') && (
                <div>
                  <Label htmlFor="sector">{t('sector')}</Label>
                  <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectSector')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">{t('education')}</SelectItem>
                      <SelectItem value="technology">{t('technology')}</SelectItem>
                      <SelectItem value="hr">{t('humanResources')}</SelectItem>
                      <SelectItem value="consulting">{t('consulting')}</SelectItem>
                      <SelectItem value="health">{t('health')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Services */}
              <div>
                <Label className="text-base font-semibold mb-3 block">{t('interestedServices')}</Label>
                <div className="space-y-3">
                  {[
                    { id: 'assessment', label: t('candidateAssessment') },
                    { id: 'development', label: t('graduateDevelopment') },
                    { id: 'onboarding', label: t('onboardingSupport') },
                    { id: 'internal', label: t('internalCoaching') },
                  ].map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.services.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <Label htmlFor={service.id} className="cursor-pointer">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Scope */}
              <div>
                <Label className="text-base font-semibold mb-3 block">{t('estimatedScope')}</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="participantCount">{t('participantCount')}</Label>
                    <Input
                      id="participantCount"
                      type="number"
                      value={formData.participantCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, participantCount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">{t('estimatedStartDate')}</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">{t('durationPeriod')}</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1week">{t('oneWeek')}</SelectItem>
                        <SelectItem value="1month">{t('oneMonth')}</SelectItem>
                        <SelectItem value="3months">{t('threeMonths')}</SelectItem>
                        <SelectItem value="6months">{t('sixMonths')}</SelectItem>
                        <SelectItem value="longterm">{t('longTerm')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">{t('message')}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder={t('messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked as boolean }))}
                  required
                />
                <Label htmlFor="consent" className="text-sm cursor-pointer">
                  {t('privacyConsent')}
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={!formData.consent}
              >
                📨 {t('submitRequest')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}