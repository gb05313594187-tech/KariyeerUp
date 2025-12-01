// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Kullanıcı Kontrolü
  useEffect(() => {
    const checkUser = () => {
        try {
            const storedUser = localStorage.getItem('kariyeer_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        } catch(e) { setUser(null); }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('kariyeer_user');
      setUser(null);
      setShowProfileMenu(false);
      navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">K</div>
              <span className="font-bold text-xl text-gray-900">Kariyeer</span>
            </Link>
          </div>

          {/* MENÜ LİNKLERİ (DOĞRULANMIŞ) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/coaches" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Koçlar</Link>
            <Link to="/corporate" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Şirketler İçin</Link>
            <Link to="/mentor-circle" className="text-gray-600 hover:text-red-600 font-medium transition-colors">MentorCircle</Link>
            <Link to="/webinars" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Webinar</Link>
            
            {/* GİRİŞ DURUMU */}
            {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{user.name || 'Hesabım'}</span>
                    </button>

                    {/* BASİT PROFİL MENÜSÜ (Hata vermez) */}
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                            <button 
                                onClick={() => { navigate('/dashboard'); setShowProfileMenu(false); }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4"/> Kontrol Paneli
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4"/> Çıkış Yap
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-gray-600 hover:text-red-600 font-medium">Giriş Yap</Link>
                    <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Kayıt Ol
                    </Link>
                </div>
            )}
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ İÇERİĞİ */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-2 space-y-1">
            <Link to="/coaches" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">Koçlar</Link>
            <Link to="/corporate" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">Şirketler İçin</Link>
            <Link to="/mentor-circle" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">MentorCircle</Link>
            <Link to="/webinars" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">Webinar</Link>
            <div className="border-t my-2"></div>
            {user ? (
                <>
                    <Link to="/dashboard" className="block px-3 py-2 font-bold text-gray-900">Kontrol Paneli</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600">Çıkış Yap</button>
                </>
            ) : (
                <>
                    <Link to="/login" className="block px-3 py-2 font-medium text-gray-900">Giriş Yap</Link>
                    <Link to="/register" className="block px-3 py-2 font-bold text-red-600">Kayıt Ol</Link>
                </>
            )}
        </div>
      )}
    </nav>
  );
}
