// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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

const SAFE_TIMEOUT = 3000; // 3 saniye yeterli

function normalizeRole(v: any): Role {
  if (!v) return "user";
  const s = String(v).toLowerCase().trim();
  if (s === "company" || s === "corporate") return "corporate";
  if (s === "coach") return "coach";
  if (s === "admin" || s === "super_admin") return "admin";
  return "user";
}

// ✅ KRİTİK: Dışarıda tanımla, her render'da yeniden oluşturma
let globalInitStarted = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ BAŞLANGIÇ: localStorage'dan sync oku (flash önleme)
  const getInitialState = () => {
    try {
      const raw = localStorage.getItem('sb-auth-token');
      if (raw) {
        const parsed = JSON.parse(raw);
        const session = parsed?.currentSession || parsed?.session || parsed;
        if (session?.user) {
          console.log('✅ SYNC INIT: Session found in localStorage');
          return {
            user: null, // Profile async yüklenecek
            supabaseUser: session.user,
            role: normalizeRole(session.user?.user_metadata?.role),
            isAuthenticated: true,
            isLoading: true, // Profile yüklenirken true
            isInitialized: true, // ✅ Hemen initialized true
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

  // ✅ ZORLA TIMEOUT - En kritik kısım
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏱️ FORCE TIMEOUT triggered');
      setState(prev => {
        if (prev.isLoading || !prev.isInitialized) {
          return { ...prev, isLoading: false, isInitialized: true };
        }
        return prev;
      });
    }, SAFE_TIMEOUT);

    return () => clearTimeout(timer);
  }, []); // ✅ Boş dependency - sadece mount'ta çalış

  // ✅ ANA AUTH EFEKTİ
  useEffect(() => {
    // StrictMode double execution önleme
    if (globalInitStarted) {
      console.log('🔄 Skipping duplicate init (StrictMode)');
      return;
    }
    globalInitStarted = true;

    let isActive = true;
    
    const initAuth = async () => {
      try {
        console.log('🔍 Starting auth check...');
        
        // ✅ TIMEOUT WRAPPER - En kritik güvenlik
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('SESSION_TIMEOUT')), 8000)
        );
        
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!isActive) {
          console.log('⚠️ Component unmounted, ignoring result');
          return;
        }

        if (error) {
          console.error('❌ getSession error:', error);
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
          return;
        }

        if (data.session?.user) {
          console.log('✅ Session valid:', data.session.user.id);
          await loadUserProfile(data.session.user);
        } else {
          console.log('❌ No active session');
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      } catch (e) {
        console.error('💥 initAuth error:', e);
        if (isActive) {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      }
    };

    // Eğer sync init yaptıysak (localStorage'dan), profile yükle
    if (state.isAuthenticated && state.supabaseUser && !state.user) {
      console.log('🔄 Loading profile for cached user');
      loadUserProfile(state.supabaseUser);
    } else if (!state.isAuthenticated) {
      initAuth();
    }

    // ✅ LISTENER
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('📡 Auth event:', event);
        
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
  }, []); // ✅ Boş dependency - sadece mount'ta

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
      let fullName = meta.full_name || meta.fullName || meta.display_name || meta.displayName || "User";
      let phone = null;
      let country = null;

      if (!error && profile) {
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
      console.error('loadUserProfile error:', e);
      // Hata olsa bile auth true, profilsiz devam
      setState({
        user: {
          id: supabaseUserData.id,
          email: supabaseUserData.email || "",
          fullName: "User",
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
      console.error("Login error:", e);
      return { success: false, message: "Bir hata oluştu" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        supabaseUser: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    } catch (e) {
      console.error("Logout error:", e);
      setState({
        user: null,
        supabaseUser: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    try {
      const nextRole = updates.role ? normalizeRole(updates.role) : state.user.role;

      await supabase.auth.updateUser({
        data: {
          role: nextRole,
          display_name: updates.fullName ?? state.user.fullName,
        },
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

      if (error) {
        console.error("profiles update error:", error);
        return false;
      }

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates, role: nextRole } : null,
        role: nextRole,
      }));
      return true;
    } catch (e) {
      console.error("updateProfile error:", e);
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
