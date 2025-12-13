// src/components/admin/AdminNavbar.tsx
// @ts-nocheck

import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-bold text-red-600">
          Kariyeer Admin
        </div>

        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/admin" className="hover:text-red-600">
            Dashboard
          </Link>
          <Link to="/admin/profile" className="hover:text-red-600">
            Profil
          </Link>
          <Link to="/admin/settings" className="hover:text-red-600">
            Ayarlar
          </Link>
        </nav>
      </div>
    </div>
  );
}
