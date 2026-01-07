// src/contexts/AuthContext.tsx
// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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

  // ✅ UI için gerekli
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ artık dışarı veriyoruz, UI buna göre karar verecek
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

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name, role, phone, country, user_type")
        .eq("id", supabaseUserData.id)
        .maybeSingle();

      let finalRole: Role = metaRole;
      let fullName =
        meta.full_name ||
        meta.fullName ||
        meta.display_name ||
        meta.displayName ||
        "User";

      let phone: string | null = null;
      let country: string | null = null;

      if (!error && profile) {
        finalRole = normalizeRole(profile.role || profile.user_type || metaRole);
        fullName = profile.display_name || fullName;
        phone = profile.phone ?? null;
        country = profile.country ?? null;
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
      clearAuth();
    }
  };

  // ✅ tek otorite: session kontrolü
  const refresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const u = data?.session?.user;
      if (u) {
        await loadUserProfile(u);
      } else {
        clearAuth();
      }
    } catch (e) {
      console.error("Error checking user:", e);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ilk yük
    refresh();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // önemli: auth event geldiğinde UI “giriş yap” diye zıplamasın
      setLoading(true);

      try {
        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          clearAuth();
        } else {
          // başka eventlerde de session state doğru kalsın
          const u = session?.user;
          if (u) await loadUserProfile(u);
          else clearAuth();
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
      await supabase.auth.signOut();
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

      await supabase.auth.updateUser({
        data: {
          role: nextRole,
          display_name: updates.fullName ?? user.fullName,
        },
      });

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: updates.fullName ?? user.fullName,
          role: nextRole,
          phone: updates.phone ?? user.phone ?? null,
          country: updates.country ?? user.country ?? null,
        })
        .eq("id", user.id);

      if (error) {
        console.error("profiles update error:", error);
        return false;
      }

      const next: User = {
        ...user,
        ...updates,
        role: nextRole,
      };
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
