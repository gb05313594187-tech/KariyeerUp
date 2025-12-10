// src/pages/Dashboard.tsx
// @ts-nocheck
/* eslint-disable */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  User 
} from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Supabase
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  // -------------------------------
  // 1) Kullanıcı + Randevular
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kullanıcıyı bul
        const { data: auth } = await supabase.auth.getUser();

        if (!auth?.user) {
          navigate("/login");
          return;
        }

        setUser(auth.user);

        // Kullanıcının randevularını getir
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", auth.user.id)
          .order("session_date", { ascending: true });

        if (error) console.log("Bookings Error:", error);

        setAppointments(bookings || []);
      } catch (e) {
        console.log("Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------------------
  // 2) Görüşme linki açma
  // -------------------------------
  const handleJoinMeeting = (url) => {
    if (!url) return toast.error("Görüşme linki henüz hazır değil.");
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* -------------------------------------- */}
        {/* ÜST BANNER */}
        {/* -------------------------------------- */}
        <div className="bg-white shadow-sm p-6 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-900">Kontrol Paneli</h1>
          <p className="text-gray-600 text-sm mt-1">
            Hoş geldiniz, {user?.email}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* -------------------------------------- */}
          {/* SOL TARAF — RANDEVULAR */}
          {/* -------------------------------------- */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="upcoming">Randevularım</TabsTrigger>
                <TabsTrigger value="history">Geçmiş</TabsTrigger>
              </TabsList>

              {/* ——— GELECEK RANDEVULAR ——— */}
              <TabsContent value="upcoming">
                <Card className="border-t-4 border-blue-900 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-900" />
                        Aktif Randevular
                      </div>
                      <Badge variant="outline" className="text-blue-900">
                        {appointments.length} kayıt
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((app) => (
                          <div
                            key={app.id}
                            className="bg-white border p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-md transition"
                          >
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>

                            {/* İçerik */}
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900">
                                Koç Görüşmesi
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(app.session_date).toLocaleDateString("tr-TR")} •{" "}
                                {app.session_time}
                              </p>

                              <Badge
                                className={
                                  app.is_trial
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                              >
                                {app.is_trial ? "Deneme Seansı" : "Standart"}
                              </Badge>
                            </div>

                            {/* Buton */}
                            <Button
                              className="bg-blue-900 hover:bg-blue-800 w-full md:w-auto"
                              onClick={() => handleJoinMeeting(app.meeting_url)}
                            >
                              Görüşmeye Git
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                        <p>Henüz planlanmış bir randevunuz bulunmamaktadır.</p>

                        <Button
                          variant="link"
                          className="text-blue-900 text-sm"
                          onClick={() => navigate("/coaches")}
                        >
                          Koçlara Göz At → 
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ——— GEÇMİŞ ——— */}
              <TabsContent value="history">
                <Card>
                  <CardContent className="py-10 text-center text-gray-500">
                    Henüz geçmiş bir randevunuz yok.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* -------------------------------------- */}
          {/* SAĞ TARAF — İSTATİSTİK + ROZET */}
          {/* -------------------------------------- */}
          <div className="space-y-6">

            {/* İSTATİSTİKLER */}
            <Card>
              <CardHeader>
                <CardTitle>İstatistikler</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span className="text-gray-600 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Toplam Randevu
                  </span>
                  <span className="font-bold">{appointments.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* ROZET */}
            <Card>
              <CardHeader>
                <CardTitle>Rozet Durumu</CardTitle>
              </CardHeader>

              <CardContent className="text-center py-6">
                <User className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Rozetiniz Yok</h3>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/pricing")}
                >
                  Rozet Satın Al
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
