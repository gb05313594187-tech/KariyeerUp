// src/layouts/AdminLayout.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    const checkAdmin = async () => {
      try {
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr) {
          console.error("auth.getUser error:", userErr);
        }

        if (!user) {
          navigate("/login", { replace: true });
          return;
        }

        const { data: profile, error: profErr } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profErr) {
          console.error("profiles select error:", profErr);
          navigate("/user/dashboard", { replace: true });
          return;
        }

        if (!profile || profile.role !== "admin") {
          navigate("/user/dashboard", { replace: true });
          return;
        }
      } catch (e) {
        console.error("AdminLayout guard error:", e);
        navigate("/user/dashboard", { replace: true });
      } finally {
        if (alive) setChecking(false);
      }
    };

    checkAdmin();

    return () => {
      alive = false;
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-600">
          Yetki kontrol ediliyor…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
