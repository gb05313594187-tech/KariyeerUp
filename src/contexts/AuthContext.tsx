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
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    role: Role
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(v: any): Role {
  // eski farklı isimleri tek standarda çevir
  if (v === "client" || v === "individual") return "user";
  if (v === "company") return "corporate";
  if (v === "super_admin") return "admin";
  if (v === "coach") return "coach";
  if (v === "corporate") return "corporate";
  if (v === "admin") return "admin";
  if (v === "user") return "user";
  return "user";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSupabaseUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        await loadUserProfile(data.session.user);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (supabaseUserData: SupabaseUser) => {
    try {
      setSupabaseUser(supabaseUserData);

      const meta = supabaseUserData.user_metadata || {};
      const metaRole = normalizeRole(meta.role || meta.user_type || meta.userType);

      // ✅ Asıl doğruluk kaynağı: profiles tablosu
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, account_type, email")
        .eq("id", supabaseUserData.id)
        .maybeSingle();

      let finalRole: Role = metaRole;
      let fullName = meta.full_name || meta.fullName || "User";
      let email = supabaseUserData.email || "";

      if (!error && profile) {
        finalRole = normalizeRole(profile.account_type);
        fullName = profile.full_name || fullName;
        email = profile.email || email;
      }

      setRole(finalRole);
      setUser({
        id: supabaseUserData.id,
        email,
        fullName,
        role: finalRole,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: Role
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role, // ✅ standart
          },
        },
      });

      if (error) return { success: false, message: error.message };

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true, message: "Kayıt başarılı!" };
      }

      return { success: false, message: "Kayıt başarısız oldu" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Bir hata oluştu" };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { success: false, message: error.message };

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true, message: "Giriş başarılı!" };
      }

      return { success: false, message: "Giriş başarısız oldu" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Bir hata oluştu" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      // ✅ auth metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName ?? user.fullName,
          role: updates.role ?? user.role,
        },
      });

      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }

      // ✅ profiles tablosu (varsa)
      await supabase
        .from("profiles")
        .update({
          full_name: updates.fullName ?? user.fullName,
          account_type: updates.role ?? user.role,
        })
        .eq("id", user.id);

      const next = { ...user, ...updates } as User;
      setUser(next);
      setRole(next.role);
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
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
        register,
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
      register: async () => ({ success: false, message: "AuthProvider missing" }),
      logout: async () => {},
      updateProfile: async () => false,
    } as AuthContextType;
  }

  return context;
};
