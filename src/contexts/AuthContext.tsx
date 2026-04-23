// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

// YASAL GÜNCELLEME: Roller veritabanı ile uyumlu hale getirildi
export type Role = "danisan" | "mentor" | "kurumsal" | "admin";

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
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: true,
  login: async () => ({ success: false, message: "Not initialized" }),
  logout: async () => {},
  updateProfile: async () => false,
});

const SAFE_TIMEOUT = 3000;

// YASAL GÜNCELLEME: Gelen ham veriyi yeni yasal rollere çeviren fonksiyon
function normalizeRole(v: any): Role {
  if (!v) return "danisan";
  const s = String(v).toLowerCase().trim();
  if (s === "company" || s === "corporate" || s === "kurumsal") return "kurumsal";
  if (s === "coach" || s === "mentor") return "mentor";
  if (s === "admin" || s === "super_admin") return "admin";
  return "danisan";
}

let globalInitStarted = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialState = () => {
    try {
      const raw = localStorage.getItem('sb-auth-token');
      if (raw) {
        const parsed = JSON.parse(raw);
        const session = parsed?.currentSession || parsed?.session || parsed;
        if (session?.user) {
          return {
            user: null,
            supabaseUser: session.user,
            role: normalizeRole(session.user?.user_metadata?.role),
            isAuthenticated: true,
            isLoading: true,
            isInitialized: true,
          };
        }
      }
    } catch (e) {
      console.error('localStorage parse error:', e);
    }
    return {
      user: null,
      supabaseUser: null,
      role: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
    };
  };

  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => {
        if (prev.isLoading || !prev.isInitialized) {
          return { ...prev, isLoading: false, isInitialized: true };
        }
        return prev;
      });
    }, SAFE_TIMEOUT);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (globalInitStarted) return;
    globalInitStarted = true;

    let isActive = true;
    
    const initAuth = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('SESSION_TIMEOUT')), 8000)
        );
        
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!isActive) return;

        if (error) {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
          return;
        }

        if (data.session?.user) {
          await loadUserProfile(data.session.user);
        } else {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      } catch (e) {
        if (isActive) {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      }
    };

    if (state.isAuthenticated && state.supabaseUser && !state.user) {
      loadUserProfile(state.supabaseUser);
    } else if (!state.isAuthenticated) {
      initAuth();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isActive) return;

        if (event === "SIGNED_OUT") {
          setState({
            user: null,
            supabaseUser: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        } else if (event === "SIGNED_IN" && session?.user) {
          loadUserProfile(session.user);
        }
      }
    );

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = useCallback(async (supabaseUserData: SupabaseUser) => {
    try {
      const meta = supabaseUserData.user_metadata || {};
      const metaRole = normalizeRole(meta.role || meta.user_type || meta.userType);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name, role, phone, country, user_type")
        .eq("id", supabaseUserData.id)
        .maybeSingle();

      let finalRole = metaRole;
      let fullName = meta.full_name || meta.fullName || meta.display_name || meta.displayName || "Kullanıcı";
      let phone = null;
      let country = null;

      if (!error && profile) {
        // SQL'de yaptığımız mentor, kurumsal, danisan verilerini burada okuyoruz
        finalRole = normalizeRole(profile.role || profile.user_type || metaRole);
        fullName = profile.display_name || fullName;
        phone = profile.phone ?? null;
        country = profile.country ?? null;
      }

      setState({
        user: {
          id: supabaseUserData.id,
          email: supabaseUserData.email || "",
          fullName,
          role: finalRole,
          phone,
          country,
        },
        supabaseUser: supabaseUserData,
        role: finalRole,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (e) {
      setState({
        user: {
          id: supabaseUserData.id,
          email: supabaseUserData.email || "",
          fullName: "Kullanıcı",
          role: normalizeRole(supabaseUserData.user_metadata?.role),
          phone: null,
          country: null,
        },
        supabaseUser: supabaseUserData,
        role: normalizeRole(supabaseUserData.user_metadata?.role),
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    }
  }, []);

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
      return { success: false, message: "Bir hata oluştu" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setState({ user: null, supabaseUser: null, role: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    } catch (e) {
      setState({ user: null, supabaseUser: null, role: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;
    try {
      const nextRole = updates.role ? normalizeRole(updates.role) : state.user.role;
      await supabase.auth.updateUser({
        data: { role: nextRole, display_name: updates.fullName ?? state.user.fullName }
      });

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: updates.fullName ?? state.user.fullName,
          role: nextRole,
          phone: updates.phone ?? state.user.phone ?? null,
          country: updates.country ?? state.user.country ?? null,
        })
        .eq("id", state.user.id);

      if (error) return false;

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates, role: nextRole } : null,
        role: nextRole,
      }));
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        supabaseUser: state.supabaseUser,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
