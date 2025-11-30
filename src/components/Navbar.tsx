// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // KULLANICI KONTROLÜ (Login'den gelen veriyi okur)
  useEffect(() => {
    const checkUser = () => {
        const storedUser = localStorage.getItem('kariyeer_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    checkUser();
    // Storage değişirse (giriş/çıkış yapılırsa) anında güncelle
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('kariyeer_user');
      setUser(null);
      navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D32F2F] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Kariyeer</span>
            </Link>
          </div>

          {/* MENÜ (MASAÜSTÜ) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/coaches" className="text-gray-600 hover:text-[#D32F2F] font-medium">Koçlar</Link>
            <Link to="/corporate" className="text-gray-600 hover:text-[#D32F2F] font-medium">Şirketler İçin</Link>
            <Link to="/mentor-circle" className="text-gray-600 hover:text-[#D32F2F] font-medium">MentorCircle</Link>
            
            {/* GİRİŞ DURUMUNA GÖRE DEĞİŞEN KISIM */}
            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#FFF5F2]">
                        <User className="h-4 w-4" />
                        {user.name || 'Hesabım'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Kontrol Paneli
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                    <Link to="/login">
                        <Button variant="ghost" className="text-gray-600 hover:text-[#D32F2F]">Giriş Yap</Button>
                    </Link>
                    <Link to="/register">
                        <Button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white">Kayıt Ol</Button>
                    </Link>
                </div>
            )}
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/coaches" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#D32F2F] hover:bg-gray-50">Koçlar</Link>
            <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#D32F2F] hover:bg-gray-50">Kontrol Paneli</Link>
            {!user && (
                <>
                    <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#D32F2F] hover:bg-gray-50">Giriş Yap</Link>
                    <Link to="/register" className="block px-3 py-2 text-base font-medium text-[#D32F2F] font-bold">Kayıt Ol</Link>
                </>
            )}
            {user && (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">Çıkış Yap</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
