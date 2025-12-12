import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  fullName: string;
  userType: "client" | "coach" | "company" | "admin" | "super_admin";
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    userType: "client" | "coach" | "company" | "admin" | "super_admin"
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  setDemoAdmin: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await loadUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSupabaseUser(null);
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
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

      const metadata = supabaseUserData.user_metadata;

      setUser({
        id: supabaseUserData.id,
        email: supabaseUserData.email || "",
        fullName: metadata.full_name || metadata.fullName || "User",
        userType: metadata.user_type || metadata.userType || "client",
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
    userType: "client" | "coach" | "company" | "admin" | "super_admin"
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

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

      if (error) {
        return { success: false, message: error.message };
      }

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
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName || user.fullName,
          user_type: updates.userType || user.userType,
        },
      });

      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }

      setUser({ ...user, ...updates });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  const setDemoAdmin = (isAdmin: boolean) => {
    if (user) {
      setUser({
        ...user,
        userType: isAdmin ? "super_admin" : "client",
      });
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
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        setDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  // ✅ PROD’DA CRASH ENGELLE (Provider yoksa fallback)
  if (context === undefined) {
    return {
      user: null,
      supabaseUser: null,
      isAuthenticated: false,
      login: async () => ({ success: false, message: "AuthProvider missing" }),
      register: async () => ({ success: false, message: "AuthProvider missing" }),
      logout: async () => {},
      updateProfile: async () => false,
      setDemoAdmin: () => {},
    } as AuthContextType;
  }

  return context;
};
