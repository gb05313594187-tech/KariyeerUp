// src/components/admin/AdminNavbar.tsx
// @ts-nocheck
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: any) =>
  `px-3 py-2 rounded-lg text-sm font-medium ${
    isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function AdminNavbar() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
            K
          </div>
          <div className="font-bold text-gray-900">Admin</div>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink to="/admin" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/coaches" className={linkClass}>
            Koçlar
          </NavLink>
          <NavLink to="/admin/companies" className={linkClass}>
            Şirketler
          </NavLink>
          <NavLink to="/admin/requests" className={linkClass}>
            Talepler
          </NavLink>
          <NavLink to="/admin/settings" className={linkClass}>
            Ayarlar
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
