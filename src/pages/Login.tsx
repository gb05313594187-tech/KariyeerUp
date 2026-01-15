// src/pages/Login.tsx
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react"; // İkonları ekledik

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Şifre görünürlüğü için state
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error("E-posta veya şifre hatalı.");
        return;
      }

      if (!data.user) {
        toast.error("Kullanıcı bulunamadı.");
        return;
      }

      toast.success("Giriş başarılı!");

      const qs = new URLSearchParams(location.search);
      const next = qs.get("next");
      if (next) {
        navigate(next, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Giriş Hatası:", err);
      toast.error("Giriş sırasında bir hata oluştu.");
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
            Giriş Yap
          </CardTitle>
          <CardDescription>
            Devam etmek için hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                {/* Şifremi Unuttum Linki */}
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#D32F2F] hover:underline font-medium"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // State'e göre tip değişiyor
                  required
                  value={formData.password}
                  onChange={(e: any) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-10" // İkon için sağdan boşluk
                />
                {/* Göz İkonu Butonu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 justify-center">
          <div className="text-sm text-gray-500">
            Hesabınız yok mu?{" "}
            <Link
              to="/register"
              className="text-[#D32F2F] hover:underline font-semibold"
            >
              Kayıt Ol
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
