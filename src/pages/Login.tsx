// src/pages/Login.tsx
// @ts-nocheck

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, role } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    console.log("LOGIN START");

    try {
      const res = await login(formData.email, formData.password);
      console.log("LOGIN RESPONSE:", res);

      if (!res?.success) {
        toast.error(res?.message || "Giriş başarısız");
        setIsLoading(false);
        return;
      }

      toast.success("Giriş başarılı!");

      // ⬇️ Rol bazlı yönlendirme
      if (role === "corporate") {
        navigate("/corporate/dashboard", { replace: true });
      } else if (role === "coach") {
        navigate("/coach/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error("Beklenmeyen hata oluştu");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
      <Card className="relative w-full max-w-lg shadow-2xl border-0 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
            Giriş Yap
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Devam etmek için hesabınıza giriş yapın
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>E-posta *</Label>
              <Input
                required
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Şifre *</Label>
              <div className="relative">
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-bold"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
