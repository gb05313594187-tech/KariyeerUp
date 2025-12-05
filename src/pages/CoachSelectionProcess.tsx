import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Video,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Target,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoachSelectionProcess() {
  const navigate = useNavigate();

  const selectionSteps = [
    {
      step: 1,
      title: "Başvuru Formu",
      duration: "10-15 dakika",
      icon: FileText,
      description:
        "Online başvuru formunu doldurun ve gerekli belgeleri yükleyin.",
      requirements: [
        "Kişisel ve iletişim bilgileri",
        "Koçluk sertifikası (ICF, MYK vb.)",
        "CV / Özgeçmiş",
        "Referanslar (opsiyonel)",
      ],
    },
    {
      step: 2,
      title: "Ön Değerlendirme",
      duration: "3-5 iş günü",
      icon: Target,
      description: "Başvurunuz ekibimiz tarafından değerlendirilir.",
      requirements: [
        "Sertifika geçerliliği kontrolü",
        "Deneyim ve uzmanlık alanları incelemesi",
        "Referans kontrolü",
        "Platform uygunluk değerlendirmesi",
      ],
    },
    {
      step: 3,
      title: "Video Mülakat",
      duration: "45-60 dakika",
      icon: Video,
      description: "Ekibimizle online görüşme yapın.",
      requirements: [
        "Koçluk yaklaşımınız ve felsefeniz",
        "Deneyim ve başarı hikayeleri",
        "Platform beklentileri",
        "Örnek koçluk senaryoları",
      ],
    },
    {
      step: 4,
      title: "Demo Seans",
      duration: "30 dakika",
      icon: Users,
      description: "Koçluk becerilerinizi gösterin.",
      requirements: [
        "Gerçek bir koçluk seansı simülasyonu",
        "ICF yetkinliklerinin değerlendirilmesi",
        "İletişim ve empati becerileri",
        "Soru sorma ve dinleme teknikleri",
      ],
    },
    {
      step: 5,
      title: "Eğitim ve Onboarding",
      duration: "1-2 hafta",
      icon: Award,
      description: "Platform eğitimi ve profil oluşturma.",
      requirements: [
        "Platform kullanım eğitimi",
        "Koç profili oluşturma",
        "Sözleşme imzalama",
        "İlk danışan atama",
      ],
    },
    {
      step: 6,
      title: "Aktif Koçluk",
      duration: "Sürekli",
      icon: TrendingUp,
      description: "Ekosistemde aktif olarak koçluk yapın.",
      requirements: [
        "Düzenli seans gerçekleştirme",
        "Kalite standartlarını koruma",
        "MentorCircle'da aktif katılım",
        "Sürekli gelişim ve süpervizyon",
      ],
    },
  ];

  const qualityCriteria = [
    {
      title: "Sertifikasyon",
      description: "ICF (ACC, PCC, MCC) veya MYK sertifikası zorunludur.",
      icon: Award,
    },
    {
      title: "Deneyim",
      description:
        "Minimum 2 yıl koçluk deneyimi veya 100 saat koçluk pratiği.",
      icon: Clock,
    },
    {
      title: "Uzmanlık",
      description: "En az 2 uzmanlık alanında yetkinlik.",
      icon: Target,
    },
    {
      title: "Etik Standartlar",
      description: "ICF Etik Kuralları'na tam uyum.",
      icon: CheckCircle2,
    },
  ];

  const timeline = [
    { phase: "Başvuru", duration: "1 gün" },
    { phase: "Ön Değerlendirme", duration: "3-5 gün" },
    { phase: "Mülakat", duration: "1 hafta" },
    { phase: "Demo Seans", duration: "3-5 gün" },
    { phase: "Onboarding", duration: "1-2 hafta" },
  ];

  const totalDuration = "3-4 hafta";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Badge className="mb-4 bg-white text-red-600 hover:bg-white">
            Koç Seçim Süreci
          </Badge>
          <h1 className="text-5xl font-bold mb-6">Kariyeer Koçu Olma Yolculuğu</h1>
          <p className="text-xl text-red-50 mb-8 max-w-2xl">
            Şeffaf, adil ve profesyonel bir seçim süreci ile ekosistemimize
            katılın
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-red-50"
              onClick={() => navigate("/coach-application")}
            >
              Hemen Başvur
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 bg-red-700 px-6 py-3 rounded-lg">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Toplam Süre: {totalDuration}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ZAMAN ÇİZELGESİ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-12">
            Süreç Zaman Çizelgesi
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="text-center">
                  <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold mb-2 mx-auto">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-gray-900">{item.phase}</p>
                  <p className="text-sm text-gray-500">{item.duration}</p>
                </div>
                {index < timeline.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADIM ADIM SÜREÇ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              Detaylı Seçim Süreci
            </h2>
            <p className="text-xl text-gray-600">
              Her adımda ne yapmanız gerektiğini öğrenin
            </p>
          </div>

          <div className="space-y-8">
            {selectionSteps.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.step}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-red-600">
                            Adım {item.step}
                          </Badge>
                          <Badge variant="outline" className="text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.duration}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl text-red-600 mb-2">
                          {item.title}
                        </CardTitle>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Gereksinimler:
                    </h4>
                    <ul className="space-y-2">
                      {item.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* KALİTE KRİTERLERİ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              Minimum Kalite Kriterleri
            </h2>
            <p className="text-xl text-gray-600">
              Başvuru yapabilmek için bu kriterleri karşılamalısınız
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityCriteria.map((criterion, index) => {
              const Icon = criterion.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-lg text-red-600">
                      {criterion.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {criterion.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ÖNEMLİ NOTLAR */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-900 mb-4">
                    Önemli Notlar
                  </h3>
                  <ul className="space-y-3 text-yellow-800">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Başvuru ücretsizdir ve herhangi bir ön ödeme
                        gerektirmez.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Tüm başvurular gizlilik içinde değerlendirilir.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Olumsuz değerlendirme durumunda detaylı geri bildirim
                        sağlanır.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        İlk 50 koç için %15 komisyon oranı geçerlidir (standart
                        %20 yerine).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Onboarding sürecinde tam destek sağlanır.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Başlamaya Hazır mısınız?</h2>
          <p className="text-xl mb-8 text-red-50">
            Başvuru formunu doldurun ve Kariyeer ekosisteminin bir parçası olun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-red-50 text-lg px-8"
              onClick={() => navigate("/coach-application")}
            >
              Koç Başvurusu Yap
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8"
              onClick={() => navigate("/for-coaches")}
            >
              Koçlar İçin Sayfası
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
