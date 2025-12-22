// src/layouts/AdminLayout.tsx
// @ts-nocheck
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        navigate("/user/dashboard");
        return;
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
