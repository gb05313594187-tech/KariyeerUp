// src/layouts/AdminLayout.tsx
// @ts-nocheck
import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar"; 
// Eğer pages içindeyse: "@/pages/AdminNavbar"

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
