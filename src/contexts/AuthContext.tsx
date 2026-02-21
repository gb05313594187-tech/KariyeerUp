// src/contexts/AuthContext.tsx
// @ts-nocheck

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(v: any): Role {
  if (!v) return "user";
  const s = String(v).toLowerCase().trim();
  if (s === "coach") return "coach";
  if (s === "corporate" || s === "company") return "corporate";
  if (s === "admin") return "admin";
  return "user";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] =
    useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
  };

  const loadUserProfile = async (sbUser: SupabaseUser) => {
    setSupabaseUser(sbUser);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sbUser.id)
      .maybeSingle();

    const finalRole = normalizeRole(profile?.role);

    setUser({
      id: sbUser.id,
      email: sbUser.email || "",
      fullName:
        profile?.full_name ||
        sbUser.user_metadata?.full_name ||
        sbUser.email?.split("@")[0] ||
        "User",
      role: finalRole,
      phone: profile?.phone ?? null,
      country: profile?.country ?? null,
    });

    setRole(finalRole);
  };

  // 🔐 Session kontrolü
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!mounted) return;

        if (data?.session?.user) {
          await loadUserProfile(data.session.user);
        } else {
          clearAuth();
        }
      } catch (err) {
        console.error("Session check error:", err);
        clearAuth();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: subscription } =
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          clearAuth();
        }
        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  // 🔑 LOGIN
  const login = async (email: string, password: string) => {
    console.log("LOGIN CALISTI");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error("LOGIN ERROR:", error);
        return { success: false, message: error.message };
      }

      if (data?.user) {
        await loadUserProfile(data.user);
        return { success: true };
      }

      return { success: false, message: "Login failed." };
    } catch (err: any) {
      console.error("LOGIN EXCEPTION:", err);
      return { success: false, message: "Unexpected error." };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      clearAuth();
    }
  };

  const value = useMemo(
    () => ({
      user,
      supabaseUser,
      role,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, supabaseUser, role, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
};
