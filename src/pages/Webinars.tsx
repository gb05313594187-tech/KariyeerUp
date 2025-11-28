import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Users, CheckCircle, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

export default function Webinars() {
  const { language } = useLanguage();

  const [selectedWebinar, setSelectedWebinar] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    source: '',
    kvkkConsent: false,
    confirmConsent: false,
  });

  const upcomingWebinars = [
    {
      id: 'webinar-1',
      title: 'Kariyer Geçişinde İlk Adımlar',
      description: 'Farklı bir sektöre geçiş yapmak isteyenler için pratik stratejiler ve ipuçları.',
      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
      date: '2024-12-15',
      time: '19:00',
      duration: '90 dakika',
      speakers: [
        {
          name: 'Ayşe Demir',
          title: 'ICF PCC Sertifikalı Koç',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
          bio: '15 yıllık İK deneyimi ve 500+ başarılı kariyer geçişi koçluğu.',
          profileLink: '/coach/1',
        },
      ],
      registeredCount: 87,
      maxCapacity: 100,
    },
    {
      id: 'webinar-2',
      title: 'Startup Dünyasında Liderlik',
      description: 'Hızlı büyüyen startup ekiplerinde etkili liderlik ve takım yönetimi.',
      banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop',
      date: '2024-12-20',
      time: '20:00',
      duration: '60 dakika',
      speakers: [
        {
          name: 'Mehmet Kaya',
          title: 'Executive Coach & Startup Mentor',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
          bio: '3 başarılı startup kurucusu, 200+ girişimci mentorluğu.',
          profileLink: '/coach/2',
        },
      ],
      registeredCount: 45,
      maxCapacity: 80,
    },
    {
      id: 'webinar-3',
      title: 'Mülakat Hazırlığında STAR Tekniği',
      description: 'Davranışsal mülakatlarda başarılı olmanın sırları ve pratik örnekler.',
      banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop',
      date: '2024-12-25',
      time: '18:00',
      duration: '75 dakika',
      speakers: [
        {
          name: 'Zeynep Arslan',
          title: 'Öğrenci Koçluğu Uzmanı',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
          bio: 'Üniversite öğrencilerine kariyer başlangıcında rehberlik.',
          profileLink: '/coach/3',
        },
      ],
      registeredCount: 62,
      maxCapacity: 100,
    },
  ];

  const handleWebinarRegistration = (webinarId: string) => {
    setSelectedWebinar(webinarId);
    setRegistrationSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      purpose: '',
      source: '',
      kvkkConsent: false,
      confirmConsent: false,
    });
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.kvkkConsent || !formData.confirmConsent) {
      alert('Lütfen tüm onayları işaretleyin');
      return;
    }

    setRegistrationSuccess(true);

    setTimeout(() => {
      setSelectedWebinar(null);
      setRegistrationSuccess(false);
    }, 5000);
  };

  const getTimeUntilWebinar = (date: string, time: string) => {
    const webinarDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = webinarDate.getTime() - now.getTime();

    if (diff < 0) return 'Başladı';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} gün ${hours} saat`;
    if (hours > 0) return `${hours} saat ${minutes} dakika`;
    return `${minutes} dakika`;
  };

  const shareWebinar = (webinar: typeof upcomingWebinars[0], platform: 'twitter' | 'linkedin' | 'facebook' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${webinar.title} - ${webinar.description}`);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {language === 'tr' ? 'Yaklaşan Webinarlar' : 'Upcoming Webinars'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'tr'
              ? 'Uzman koçlarımızdan öğrenin, kariyerinizi geliştirin ve profesyonel ağınızı genişletin'
              : 'Learn from expert coaches, develop your career, and expand your professional network'}
          </p>
        </div>

        {/* Webinars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingWebinars.map((webinar) => (
            <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Banner Image */}
              <div className="relative h-48 overflow-hidden">
                <img src={webinar.banner} alt={webinar.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  CANLI
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-blue-900">{webinar.title}</CardTitle>
                <CardDescription className="text-base">{webinar.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">
                      {new Date(webinar.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">{webinar.time}</span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Etkinliğe Kalan Süre</p>
                  <p className="text-xl font-bold text-yellow-700">{getTimeUntilWebinar(webinar.date, webinar.time)}</p>
                </div>

                {/* Speakers */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Konuşmacı</h4>
                  {webinar.speakers.map((speaker, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <img src={speaker.photo} alt={speaker.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-blue-900">{speaker.name}</p>
                        <p className="text-xs text-gray-600">{speaker.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Registration Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">
                      {webinar.registeredCount}/{webinar.maxCapacity}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {webinar.maxCapacity - webinar.registeredCount} kontenjan
                  </Badge>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleWebinarRegistration(webinar.id)}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    disabled={webinar.registeredCount >= webinar.maxCapacity}
                  >
                    {webinar.registeredCount >= webinar.maxCapacity ? 'Kontenjan Doldu' : 'Kayıt Ol'}
                  </Button>

                  {/* Share Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => shareWebinar(webinar, 'linkedin')}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => shareWebinar(webinar, 'twitter')}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      X
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">
                {registrationSuccess ? 'Kayıt Başarılı!' : 'Webinar Kayıt Formu'}
              </CardTitle>
              <CardDescription>
                {registrationSuccess
                  ? 'Katılım bilgileriniz e-posta adresinize gönderildi.'
                  : upcomingWebinars.find((w) => w.id === selectedWebinar)?.title}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {registrationSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-4">Kaydınız Alındı!</h3>
                  <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
                    <h4 className="font-semibold text-blue-900 mb-3">Sonraki Adımlar:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>E-postanızı kontrol edin (Zoom linki gönderildi)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Takvim dosyasını indirin ve hatırlatıcı kurun</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Webinar başlamadan 10 dakika önce bağlantıya tıklayın</span>
                      </li>
                    </ul>
                  </div>
                  <Button onClick={() => setSelectedWebinar(null)} className="bg-blue-900 hover:bg-blue-800">
                    Kapat
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ad Soyad *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon (İsteğe bağlı)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">Katılım Amacınız / İlgi Alanınız *</Label>
                    <Select
                      value={formData.purpose}
                      onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Öğrenci</SelectItem>
                        <SelectItem value="graduate">Yeni Mezun</SelectItem>
                        <SelectItem value="coach-candidate">Koç Adayı</SelectItem>
                        <SelectItem value="hr">İK Uzmanı</SelectItem>
                        <SelectItem value="career-change">Kariyer Değişimi</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="source">Webinara Nereden Ulaştınız? *</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) => setFormData({ ...formData, source: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="email">E-posta</SelectItem>
                        <SelectItem value="friend">Arkadaş Önerisi</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="google">Google Arama</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="kvkk"
                        checked={formData.kvkkConsent}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, kvkkConsent: checked as boolean })
                        }
                      />
                      <Label htmlFor="kvkk" className="text-sm leading-relaxed cursor-pointer">
                        KVKK kapsamında kişisel verilerimin işlenmesine ve tarafıma bilgilendirme yapılmasına açık
                        rıza veriyorum.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="confirm"
                        checked={formData.confirmConsent}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, confirmConsent: checked as boolean })
                        }
                      />
                      <Label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
                        Kayıt bilgilerimi onaylıyorum ve webinar katılım koşullarını kabul ediyorum.
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedWebinar(null)}
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-900 hover:bg-blue-800"
                      disabled={
                        !formData.name ||
                        !formData.email ||
                        !formData.purpose ||
                        !formData.source ||
                        !formData.kvkkConsent ||
                        !formData.confirmConsent
                      }
                    >
                      Kaydı Tamamla
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}