// src/contexts/AuthContext.tsx
// @ts-nocheck
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  if (s === "company") return "corporate";
  if (s === "corporate") return "corporate";
  if (s === "coach") return "coach";
  if (s === "admin" || s === "super_admin") return "admin";
  if (s === "client" || s === "individual" || s === "user") return "user";

  return "user";
}

// ✅ Pending kalan çağrılar loading'i kilitlemesin
const withTimeout = async <T,>(p: Promise<T>, ms = 12000, label = "timeout"): Promise<T> => {
  let t: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    t = setTimeout(() => reject(new Error(label)), ms);
  });
  try {
    return await Promise.race([p, timeoutPromise]);
  } finally {
    clearTimeout(t);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const loadUserProfile = async (supabaseUserData: SupabaseUser) => {
    try {
      setSupabaseUser(supabaseUserData);

      const meta = supabaseUserData.user_metadata || {};
      const metaRole = normalizeRole(meta.role || meta.user_type || meta.userType);

      // ✅ profiles okuması asla “pending” kalıp UI’ı kilitlemesin
      const { data: profile, error } = await withTimeout(
        supabase
          .from("profiles")
          .select("full_name, display_name, role, phone, country, user_type")
          .eq("id", supabaseUserData.id)
          .maybeSingle(),
        12000,
        "profiles_read_timeout"
      );

      let finalRole: Role = metaRole;

      // isim önceliği: profiles.full_name -> profiles.display_name -> metadata -> email prefix
      let fullName =
        profile?.full_name ||
        profile?.display_name ||
        meta.full_name ||
        meta.fullName ||
        meta.display_name ||
        meta.displayName ||
        (supabaseUserData.email ? supabaseUserData.email.split("@")[0] : "User");

      let phone: string | null = profile?.phone ?? null;
      let country: string | null = profile?.country ?? null;

      if (!error && profile) {
        finalRole = normalizeRole(profile.role || profile.user_type || metaRole);
      }

      setRole(finalRole);
      setUser({
        id: supabaseUserData.id,
        email: supabaseUserData.email || "",
        fullName,
        role: finalRole,
        phone,
        country,
      });
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Error loading user profile:", e);
      // ✅ en kötü senaryoda auth'u temizle ve UI kilitlenmesin
      clearAuth();
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      // ✅ getSession de pending kalabilir (token refresh network vs.)
      const { data, error } = await withTimeout(supabase.auth.getSession(), 12000, "getSession_timeout");
      if (error) throw error;

      const u = data?.session?.user;
      if (u) await loadUserProfile(u);
      else clearAuth();
    } catch (e) {
      console.error("Error checking user:", e);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;

    // İlk yük
    refresh();

    // ✅ Tab geri gelince (idle sonrası) auth’u tazele: navbar stuck olmasın
    const onVis = () => {
      if (!alive) return;
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!alive) return;
      setLoading(true);
      try {
        const u = session?.user;

        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && u) {
          await loadUserProfile(u);
        } else if (event === "SIGNED_OUT") {
          clearAuth();
        } else {
          // diğer eventlerde de güvenli davran
          if (u) await loadUserProfile(u);
          else clearAuth();
        }
      } catch (e) {
        console.error("Auth state change error:", e);
        clearAuth();
      } finally {
        if (alive) setLoading(false);
      }
    });

    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVis);
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        12000,
        "login_timeout"
      );
      if (error) return { success: false, message: error.message };

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true, message: "Giriş başarılı!" };
      }
      return { success: false, message: "Giriş başarısız oldu" };
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, message: "Bir hata oluştu" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await withTimeout(supabase.auth.signOut(), 12000, "logout_timeout");
      clearAuth();
    } catch (e) {
      console.error("Logout error:", e);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      const nextRole = updates.role ? normalizeRole(updates.role) : user.role;

      await withTimeout(
        supabase.auth.updateUser({
          data: {
            role: nextRole,
            full_name: updates.fullName ?? user.fullName,
            display_name: updates.fullName ?? user.fullName,
          },
        }),
        12000,
        "auth_update_timeout"
      );

      const { error } = await withTimeout(
        supabase
          .from("profiles")
          .update({
            full_name: updates.fullName ?? user.fullName,
            display_name: updates.fullName ?? user.fullName,
            role: nextRole,
            phone: updates.phone ?? user.phone ?? null,
            country: updates.country ?? user.country ?? null,
          })
          .eq("id", user.id),
        12000,
        "profiles_update_timeout"
      );

      if (error) {
        console.error("profiles update error:", error);
        return false;
      }

      const next: User = { ...user, ...updates, role: nextRole };
      setUser(next);
      setRole(next.role);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      console.error("updateProfile error:", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      supabaseUser,
      role,
      isAuthenticated,
      loading,
      refresh,
      login,
      logout,
      updateProfile,
    }),
    [user, supabaseUser, role, isAuthenticated, loading]
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
