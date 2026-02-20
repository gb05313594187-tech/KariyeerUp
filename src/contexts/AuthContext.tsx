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

  const clearAuth = useCallback(() => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  const loadUserProfile = useCallback(async (supabaseUserData: SupabaseUser) => {
    if (!mountedRef.current) return;

    try {
      setSupabaseUser(supabaseUserData);
      const meta = supabaseUserData.user_metadata || {};

      const quickUser: User = {
        id: supabaseUserData.id,
        email: supabaseUserData.email || "",
        fullName: meta.full_name || meta.fullName || meta.display_name || supabaseUserData.email?.split("@")[0] || "User",
        role: normalizeRole(meta.role || meta.user_type),
        phone: null,
        country: null,
      };

      setUser(quickUser);
      setRole(quickUser.role);
      setIsAuthenticated(true);
      
      // ✅ Profil yüklendi, loading'i kapat
      if (mountedRef.current) {
        setLoading(false);
      }

      // Arka planda profiles'ı al
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, display_name, role, phone, country, user_type")
          .eq("id", supabaseUserData.id)
          .maybeSingle();

        if (profile && mountedRef.current) {
          const finalRole = normalizeRole(profile.role || profile.user_type || quickUser.role);
          setUser({
            ...quickUser,
            fullName: profile.full_name || profile.display_name || quickUser.fullName,
            role: finalRole,
            phone: profile.phone || null,
            country: profile.country || null,
          });
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

  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
        if (mountedRef.current) {
          clearAuth();
          setLoading(false); // ✅ Session yoksa da loading'i kapat
        }
        return;
      }

      await loadUserProfile(session.user);
    } catch (e) {
      console.error("Session check error:", e);
      if (mountedRef.current) {
        clearAuth();
        setLoading(false); // ✅ Hata olsa da loading'i kapat
      }
    }
  }, [loadUserProfile, clearAuth]);

  const refresh = useCallback(async () => {
    await checkSession();
  }, [checkSession]);

  useEffect(() => {
    mountedRef.current = true;

    // ✅ 2 saniye sonra zorla loading'i kapat (emergency fallback)
    const emergencyTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn("⚠️ Auth loading timeout - forcing false");
        setLoading(false);
      }
    }, 2000);

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      console.log("🔐 Auth event:", event);

      if (event === "SIGNED_IN" && session?.user) {
        await loadUserProfile(session.user);
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
    }
  }, [clearAuth]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const nextRole = updates.role ? normalizeRole(updates.role) : user.role;

      await supabase.auth.updateUser({
        data: { role: nextRole, full_name: updates.fullName ?? user.fullName },
      });

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
