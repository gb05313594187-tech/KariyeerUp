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

  // ✅ UI için
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

function pickFullName(meta: any, profile: any) {
  // ✅ Tek kaynaktan isim üretelim (öncelik: profiles.display_name)
  const fromProfile = profile?.display_name || profile?.full_name || "";
  if (String(fromProfile || "").trim()) return String(fromProfile).trim();

  const fromMeta =
    meta?.display_name ||
    meta?.displayName ||
    meta?.full_name ||
    meta?.fullName ||
    meta?.name ||
    "";
  if (String(fromMeta || "").trim()) return String(fromMeta).trim();

  return "User";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ UI buna göre davranacak
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const loadUserProfile = async (u: SupabaseUser) => {
    setSupabaseUser(u);

    const meta = u.user_metadata || {};
    const metaRole = normalizeRole(meta.role || meta.user_type || meta.userType);

    // ✅ profiles okunamazsa bile login kalmasın diye try/catch içinde
    let profile: any = null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, full_name, role, phone, country, user_type")
        .eq("id", u.id)
        .maybeSingle();

      if (!error) profile = data || null;
    } catch (e) {
      // RLS / network vs: meta ile devam edeceğiz
      profile = null;
    }

    const finalRole = normalizeRole(profile?.role || profile?.user_type || metaRole);
    const fullName = pickFullName(meta, profile);

    const nextUser: User = {
      id: u.id,
      email: u.email || "",
      fullName,
      role: finalRole,
      phone: profile?.phone ?? null,
      country: profile?.country ?? null,
    };

    setRole(finalRole);
    setUser(nextUser);
    setIsAuthenticated(true);
  };

  // ✅ tek otorite: session kontrolü
  const refresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const u = data?.session?.user || null;
      if (u) await loadUserProfile(u);
      else clearAuth();
    } catch (e) {
      console.error("Auth refresh error:", e);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ilk yük
    refresh();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // ✅ event geldiğinde UI “giriş yap” diye zıplamasın
      setLoading(true);
      try {
        const u = session?.user || null;

        if (event === "SIGNED_OUT") {
          clearAuth();
          return;
        }

        if (u) {
          await loadUserProfile(u);
        } else {
          clearAuth();
        }
      } catch (e) {
        console.error("onAuthStateChange error:", e);
        clearAuth();
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
    setLoading(true);
    try {
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
    setLoading(true);
    try {
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

    setLoading(true);
    try {
      const nextRole = updates.role ? normalizeRole(updates.role) : user.role;
      const nextName = String(updates.fullName ?? user.fullName ?? "").trim() || "User";

      // ✅ auth metadata: hem display_name hem full_name set (geriye dönük uyum)
      await supabase.auth.updateUser({
        data: {
          role: nextRole,
          display_name: nextName,
          full_name: nextName,
        },
      });

      // ✅ DB: display_name ana isim kaynağı
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: nextName,
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
        fullName: nextName,
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
