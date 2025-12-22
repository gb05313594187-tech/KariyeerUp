// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        clearAuth();
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // token yenilenince profil de güncel kalsın
        await loadUserProfile(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
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

  const login = async (email: string, password: string) => {
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
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
    } catch (e) {
      console.error("Logout error:", e);
      clearAuth();
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
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
      return true;
    } catch (e) {
      console.error("updateProfile error:", e);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        role,
        isAuthenticated,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    return {
      user: null,
      supabaseUser: null,
      role: null,
      isAuthenticated: false,
      login: async () => ({ success: false, message: "AuthProvider missing" }),
      logout: async () => {},
      updateProfile: async () => false,
    } as AuthContextType;
  }

  return context;
};
