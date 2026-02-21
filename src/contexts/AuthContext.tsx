// src/contexts/AuthContext.tsx
// @ts-nocheck
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type Role = "user" | "coach" | "corporate" | "admin";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  country?: string | null;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(v: any): Role {
  if (!v) return "user";
  const s = String(v).toLowerCase().trim();
  if (s === "company" || s === "corporate") return "corporate";
  if (s === "coach") return "coach";
  if (s === "admin" || s === "super_admin") return "admin";
  return "user";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);

  const clearAuth = useCallback(() => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  const loadUserProfile = useCallback(async (supabaseUserData: SupabaseUser) => {
    if (!mountedRef.current) return;

    try {
      console.log("📥 Loading user profile for:", supabaseUserData.email);
      
      setSupabaseUser(supabaseUserData);
      const meta = supabaseUserData.user_metadata || {};

      // ✅ Email için fallback'ler
      const userEmail = supabaseUserData.email || meta.email || "";
      // ✅ URL'den role yakalama (Google OAuth için)
const urlParams = new URLSearchParams(window.location.search);
const roleFromUrl = urlParams.get("role");

if (roleFromUrl && !meta.role) {
  try {
    await supabase
      .from("profiles")
      .update({ role: normalizeRole(roleFromUrl) })
      .eq("id", supabaseUserData.id);

    // URL'yi temizle (role parametresi kalmasın)
    window.history.replaceState({}, document.title, window.location.pathname);
    
    console.log("✅ Role updated from URL:", roleFromUrl);
  } catch (e) {
    console.warn("Role update from URL failed:", e);
  }
}
      // ✅ FullName için çoklu fallback
      const userFullName = 
        meta.full_name || 
        meta.fullName || 
        meta.display_name || 
        meta.name ||
        (userEmail ? userEmail.split("@")[0] : "User");

      const quickUser: User = {
        id: supabaseUserData.id,
        email: userEmail,
        fullName: userFullName,
        role: normalizeRole(roleFromUrl || meta.role || meta.user_type),
        phone: meta.phone || null,
        country: meta.country || null,
      };

      console.log("👤 Quick user created:", quickUser);

      setUser(quickUser);
      setRole(quickUser.role);
      setIsAuthenticated(true);
      setLoading(false);

      // Arka planda profiles tablosundan detaylı bilgi al
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, display_name, role, phone, country, user_type, email")
          .eq("id", supabaseUserData.id)
          .maybeSingle();

        if (profileError) {
          console.warn("Profile fetch warning:", profileError.message);
        }

        if (profile && mountedRef.current) {
          const finalRole = normalizeRole(profile.role || profile.user_type || quickUser.role);
          const finalUser: User = {
            id: supabaseUserData.id,
            email: profile.email || quickUser.email,
            fullName: profile.full_name || profile.display_name || quickUser.fullName,
            role: finalRole,
            phone: profile.phone || quickUser.phone,
            country: profile.country || quickUser.country,
          };
          
          console.log("👤 Final user from profile:", finalUser);
          setUser(finalUser);
          setRole(finalRole);
        }
      } catch (e) {
        console.warn("Profile fetch error:", e);
      }
    } catch (e) {
      console.error("Error loading user profile:", e);
      if (mountedRef.current) {
        clearAuth();
        setLoading(false);
      }
    }
  }, [clearAuth]);

  // ✅ Geliştirilmiş session kontrolü
  const checkSession = useCallback(async () => {
    if (initializedRef.current) return;
    
    try {
      console.log("🔍 Checking session...");
      
      // Önce getSession dene (timeout ile)
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("getSession timeout")), 3000)
      );

      let session = null;
      
      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        session = result?.data?.session;
        console.log("✅ getSession successful:", !!session);
      } catch (e) {
        console.log("⚠️ getSession timeout, trying getUser...");
        
        // getSession başarısız olursa getUser dene
        try {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (!userError && userData?.user) {
            console.log("✅ getUser successful");
            await loadUserProfile(userData.user);
            initializedRef.current = true;
            return;
          }
        } catch (getUserError) {
          console.warn("getUser also failed:", getUserError);
        }
      }

      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        console.log("📭 No session found");
        clearAuth();
        setLoading(false);
      }
      
      initializedRef.current = true;
    } catch (e) {
      console.error("Session check error:", e);
      if (mountedRef.current) {
        clearAuth();
        setLoading(false);
      }
      initializedRef.current = true;
    }
  }, [loadUserProfile, clearAuth]);

  const refresh = useCallback(async () => {
    initializedRef.current = false;
    setLoading(true);
    await checkSession();
  }, [checkSession]);

  useEffect(() => {
    mountedRef.current = true;
    initializedRef.current = false;

    // ✅ 5 saniye sonra zorla loading'i kapat (emergency fallback)
    const emergencyTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn("⚠️ Auth loading timeout - forcing false");
        setLoading(false);
      }
    }, 5000);

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      console.log("🔐 Auth event:", event);

      if (event === "SIGNED_IN" && session?.user) {
  // Eğer zaten aynı kullanıcı yüklüyse tekrar yükleme
  if (user?.id !== session.user.id) {
    await loadUserProfile(session.user);
  }
} else if (event === "SIGNED_OUT") {
        clearAuth();
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === "INITIAL_SESSION") {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(emergencyTimeout);
      authListener?.subscription?.unsubscribe();
    };
  }, [checkSession, loadUserProfile, clearAuth]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setLoading(false);
        return { success: false, message: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true, message: "Giriş başarılı!" };
      }

      setLoading(false);
      return { success: false, message: "Giriş başarısız oldu" };
    } catch (e) {
      console.error("Login error:", e);
      setLoading(false);
      return { success: false, message: "Bir hata oluştu" };
    }
  }, [loadUserProfile]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      // Manuel temizlik
      try {
        localStorage.removeItem('kariyeerup-auth-token');
        localStorage.removeItem('kariyerup-profile-data');
        localStorage.removeItem('sb-wzadnstzslxvuwmmjmwn-auth-token');
      } catch {}
      
      clearAuth();
    } catch (e) {
      console.error("Logout error:", e);
      clearAuth();
    } finally {
      setLoading(false);
      initializedRef.current = false;
    }
  }, [clearAuth]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const nextRole = updates.role ? normalizeRole(updates.role) : user.role;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updates.fullName ?? user.fullName,
          role: nextRole,
          phone: updates.phone ?? user.phone ?? null,
          country: updates.country ?? user.country ?? null,
        })
        .eq("id", user.id);

      if (error) return false;

      setUser({ ...user, ...updates, role: nextRole });
      setRole(nextRole);
      return true;
    } catch (e) {
      console.error("updateProfile error:", e);
      return false;
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, supabaseUser, role, isAuthenticated, loading, refresh, login, logout, updateProfile }),
    [user, supabaseUser, role, isAuthenticated, loading, refresh, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      supabaseUser: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      refresh: async () => {},
      login: async () => ({ success: false, message: "AuthProvider missing" }),
      logout: async () => {},
      updateProfile: async () => false,
    } as AuthContextType;
  }
  return context;
};
