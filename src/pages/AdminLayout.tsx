// src/layouts/AdminLayout.tsx
// @ts-nocheck
import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAuth } from "@/contexts/AuthContext"; // sende yoksa aşağıdaki notu oku

export default function AdminLayout() {
  const { user, profile, loading } = useAuth?.() || {}; // güvenli çağrı

  // auth context yoksa bile layout render etsin (en azından UI bozulmasın)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  // Eğer login zorunlu yapmak istiyorsan:
  // if (!user) return <Navigate to="/login" replace />;

  // Role kontrolü istiyorsan (profile.role = 'admin'):
  // if (!user || profile?.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
