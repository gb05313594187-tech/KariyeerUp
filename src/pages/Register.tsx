// src/pages/Register.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false); // KVKK onayı için state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "individual", // individual | coach | company
  });

  const mapRole = (userType: string) => {
    if (userType === "coach") return "coach";
    if (userType === "company") return "corporate";
    return "user";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // KVKK Kontrolü
    if (!kvkkAccepted) {
      toast.error("Devam etmek için KVKK Aydınlatma Metni'ni onaylamalısınız.");
      return;
    }

    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      setIsLoading(false);
      return;
    }

    try {
      const role = mapRole(formData.userType);

      // 1) Supabase Auth'a kayıt (metadata)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.fullName,
            role, // ✅ user | coach | corporate
            user_type: formData.userType, // ✅ senin mevcut mantığın (individual/coach/company) kalabilir
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // 2) profiles tablosuna insert (senin kolonlara göre)
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            display_name: formData.fullName,
            role, // ✅ asıl yetki kaynağın bu olsun
            user_type: formData.userType, // individual/coach/company
            phone: null,
            country: null,
          },
        ]);

        if (profileError) {
          console.error("Profil insert hatası:", profileError);
          // auth kaydı var, devam edebiliriz
        }
      }

      toast.success("Kayıt başarılı!");

      if (formData.userType === "coach") {
        navigate("/coach-application");
      } else {
        setTimeout(() => navigate("/login"), 300);
      }
    } catch (err: any) {
      console.error("Kayıt hatası:", err);
      toast.error(`Kayıt başarısız: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F2] p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#D32F2F]">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-[#D32F2F] rounded-lg mx-auto flex items-center justify-center mb-2">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#D32F2F]">
            Kayıt Ol
          </CardTitle>
          <CardDescription>Yeni bir Kariyeer hesabı oluşturun</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad *</Label>
              <Input
                id="fullName"
                placeholder="Adınız Soyadınız"
                required
                value={formData.fullName}
                onChange={(e: any) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                required
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre * (En az 6 karakter)</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e: any) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e: any) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Hesap Türü</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) =>
                  setFormData({ ...formData, userType: value })
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Bireysel Kullanıcı</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coach" id="coach" />
                  <Label htmlFor="coach">Koç</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company">Şirket</Label>
                </div>
              </RadioGroup>
            </div>

            {/* KVKK Onay Kutusu eklendi */}
            <div className="flex items-start space-x-2 py-2">
              <input
                type="checkbox"
                id="kvkk"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#D32F2F] focus:ring-[#D32F2F]"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
              />
              <label htmlFor="kvkk" className="text-xs text-gray-600 leading-tight">
                <Link to="/privacy" className="text-[#D32F2F] hover:underline font-semibold">KVKK Aydınlatma Metni</Link>'ni okudum ve kişisel verilerimin işlenmesini onaylıyorum. *
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
              disabled={isLoading || !kvkkAccepted} // Onaylanmadan buton aktif olmaz
            >
              {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Zaten hesabınız var mı?{" "}
            <Link
              to="/login"
              className="text-[#D32F2F] hover:underline font-semibold"
            >
              Giriş Yap
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
