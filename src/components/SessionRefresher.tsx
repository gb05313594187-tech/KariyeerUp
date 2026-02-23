// src/components/SessionRefresher.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function SessionRefresher() {
  const location = useLocation();

  useEffect(() => {
    // Her sayfa değişiminde sessizce token kontrol et
    supabase.auth.getSession();
  }, [location.pathname]);

  return null;
}
