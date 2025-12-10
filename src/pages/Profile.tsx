// src/pages/Profile.tsx
// @ts-nocheck
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Koç Profilim</h1>

        <Card>
          <CardHeader>
            <CardTitle>{user.full_name || user.email}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">E-posta: </span>
              {user.email}
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-sm text-gray-600">Rol:</span>
              <Badge variant="outline">
                {user.role || "Koç"}
              </Badge>
            </div>
            {/* Buraya sonra: uzmanlık alanları, fiyat, bio, takvim linki vs ekleriz */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
