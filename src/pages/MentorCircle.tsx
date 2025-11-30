// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Star, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MentorCircle() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">Topluluk</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MentorCircle ile Birlikte Büyüyün</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Benzer hedefleri olan profesyonellerle tanışın, deneyim paylaşın ve birlikte gelişin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-t-4 border-t-purple-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Networking Grupları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Sektörünüze özel gruplara katılın, yeni bağlantılar kurun ve kariyer fırsatlarını yakalayın.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/register')}>
                Hemen Katıl
              </Button>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-pink-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-pink-600" />
                Soru-Cevap Etkinlikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Deneyimli mentorlara sorularınızı sorun, kariyeriniz için en doğru yol haritasını çizin.
              </p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => navigate('/coaches')}>
                Mentorları Keşfet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
