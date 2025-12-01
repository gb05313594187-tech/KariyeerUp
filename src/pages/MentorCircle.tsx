// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MentorCircle() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <Badge className="mb-4 bg-purple-100 text-purple-700">Topluluk</Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">MentorCircle</h1>
        <p className="text-xl text-gray-600 mb-12">Birlikte öğrenin, birlikte büyüyün.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                    <Users className="h-6 w-6 text-purple-600"/> Networking
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-gray-600">Benzer hedefleri olan profesyonellerle tanışın.</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/register')}>Katıl</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                    <MessageCircle className="h-6 w-6 text-pink-600"/> Soru-Cevap
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-gray-600">Mentorlara sorularınızı sorun, cevaplar alın.</p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/coaches')}>Mentorları Gör</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
