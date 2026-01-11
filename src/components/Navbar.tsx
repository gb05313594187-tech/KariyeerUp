// src/components/Navbar.tsx
// @ts-nocheck
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const auth = useAuth();

  // ⛔ Auth netleşmeden karar verme
  if (auth.loading) {
    return (
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="h-16" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Kariyeer
        </Link>

        <nav className="flex items-center gap-3">
          {!auth.user ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Giriş</Button>
              </Link>
              <Link to="/register">
                <Button>Kayıt Ol</Button>
              </Link>
            </>
          ) : (
            <>
              {auth.role === "coach" && (
                <Link to="/coach/dashboard">
                  <Button variant="ghost">Koç Paneli</Button>
                </Link>
              )}

              {auth.role === "user" && (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}

              <Button
                variant="outline"
                onClick={() => auth.signOut()}
              >
                Çıkış
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
