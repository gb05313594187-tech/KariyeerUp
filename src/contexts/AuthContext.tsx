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
  if (s === "company") return "corporate";
  if (s === "corporate") return "corporate";
  if (s === "coach") return "coach";
  if (s === "admin" || s === "super_admin") return "admin";
  if (s === "client" || s === "individual" || s === "user") return "user";
  return "user";
}

async function withTimeout<T>(p: Promise<T>, timeoutMs: number, label = "timeout"): Promise<T> {
  let t: any = null;
  const timeout = new Promise<T>((_, rej) => {
    t = setTimeout(() => rej(new Error(label)), timeoutMs);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (t) clearTimeout(t);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialLoadDoneRef = useRef(false);
  const loadingWatchdogRef = useRef<any>(null);
  const lastFocusRefreshRef = useRef<number>(0);
  const FOCUS_DEBOUNCE_MS = 30000;

  const startLoadingWatchdog = (ms = 12000) => {
    if (loadingWatchdogRef.current) clearTimeout(loadingWatchdogRef.current);
    loadingWatchdogRef.current = setTimeout(() => {
      setLoading(false);
    }, ms);
  };

  const stopLoadingWatchdog = () => {
    if (loadingWatchdogRef.current) clearTimeout(loadingWatchdogRef.current);
    loadingWatchdogRef.current = null;
  };

  // ✅ Auth state'i tamamen temizle
  const clearAuth = useCallback(() => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  // ✅ Kullanıcı profilini yükle
  const loadUserProfile = useCallback(async (supabaseUserData: SupabaseUser) => {
    try {
      setSupabaseUser(supabaseUserData);

      const meta = supabaseUserData.user_metadata || {};
      const metaRole = normalizeRole(meta.role || meta.user_type || meta.userType);

      let profile: any = null;
      let profileError: any = null;

      try {
        const res = await withTimeout(
          supabase
            .from("profiles")
            .select("full_name, display_name, role, phone, country, user_type, email")
            .eq("id", supabaseUserData.id)
            .maybeSingle(),
          8000,
          "profiles_fetch_timeout"
        );
        profile = res?.data ?? null;
        profileError = res?.error ?? null;
      } catch (e) {
        profile = null;
        profileError = e;
      }

      let finalRole: Role = metaRole;

      const fullName =
        profile?.full_name ||
        profile?.display_name ||
        meta.full_name ||
        meta.fullName ||
        meta.display_name ||
        meta.displayName ||
        (supabaseUserData.email ? supabaseUserData.email.split("@")[0] : "User");

      const phone: string | null = profile?.phone ?? null;
      const country: string | null = profile?.country ?? null;

      if (!profileError && profile) {
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
      clearAuth();
    }
  }, [clearAuth]);

  // ✅ Session'ı yenile - DÜZELTME BURADA
  const refresh = useCallback(async () => {
    const isSilent = initialLoadDoneRef.current;

    if (!isSilent) {
      setLoading(true);
      startLoadingWatchdog(12000);
    }

    try {
      // 🔥 ÖNEMLİ: Önce getSession() ile session'ı kontrol et
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn("Session error:", sessionError.message);
        clearAuth();
        return;
      }

      if (!sessionData?.session) {
        console.log("No active session found");
        clearAuth();
        return;
      }

      // Session varsa user'ı al
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.warn("User error:", userError?.message);
        clearAuth();
        return;
      }

      // Kullanıcı profilini yükle
      await loadUserProfile(userData.user);

    } catch (e) {
      console.error("Error checking user:", e);
      if (!isSilent) {
        clearAuth();
      }
    } finally {
      stopLoadingWatchdog();
      setLoading(false);
      initialLoadDoneRef.current = true;
    }
  }, [loadUserProfile, clearAuth]);

  // ✅ İlk yükleme ve event listener'lar
  useEffect(() => {
    let alive = true;

    // İlk yükleme
    refresh();

    // Tab focus olduğunda session'ı yenile
    const onFocus = () => {
      if (!alive) return;
      const now = Date.now();
      if (now - lastFocusRefreshRef.current < FOCUS_DEBOUNCE_MS) return;
      lastFocusRefreshRef.current = now;
      refresh();
    };
    window.addEventListener("focus", onFocus);

    // Auth state değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!alive) return;
      
      console.log("Auth event:", event);

      if (event === "INITIAL_SESSION") {
        // İlk yükleme zaten refresh() ile yapıldı
        return;
      }

      const showLoading = event === "SIGNED_IN" || event === "SIGNED_OUT";
      
      if (showLoading) {
        setLoading(true);
        startLoadingWatchdog(12000);
      }

      try {
        if (event === "SIGNED_IN" && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          clearAuth();
        } else if ((event === "TOKEN_REFRESHED" || event === "USER_UPDATED") && session?.user) {
          await loadUserProfile(session.user);
        } else {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            clearAuth();
          }
        }
      } catch (e) {
        console.error("onAuthStateChange handler error:", e);
        if (showLoading) clearAuth();
      } finally {
        stopLoadingWatchdog();
        if (showLoading) setLoading(false);
      }
    });

    return () => {
      alive = false;
      window.removeEventListener("focus", onFocus);
      stopLoadingWatchdog();
      authListener?.subscription?.unsubscribe();
    };
  }, [refresh, loadUserProfile, clearAuth]);

  // ✅ Login fonksiyonu
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      startLoadingWatchdog(12000);

      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        "signIn_timeout"
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
      stopLoadingWatchdog();
      setLoading(false);
    }
  }, [loadUserProfile]);

  // ✅ LOGOUT - localStorage temizliği eklendi
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      startLoadingWatchdog(12000);
      
      // Supabase logout
      await withTimeout(supabase.auth.signOut(), 8000, "signOut_timeout");
      
      // ✅ Manuel localStorage temizliği (bazen Supabase silmiyor)
      try {
        localStorage.removeItem('kariyeerup-auth-token');
        localStorage.removeItem('kariyerup-profile-data');
        localStorage.removeItem('sb-wzadnstzslxvuwmmjmwn-auth-token'); // Supabase default key
      } catch (e) {
        console.warn("localStorage temizleme hatası:", e);
      }
      
      clearAuth();
    } catch (e) {
      console.error("Logout error:", e);
      
      // ✅ Hata olsa bile temizle
      try {
        localStorage.removeItem('kariyeerup-auth-token');
        localStorage.removeItem('kariyerup-profile-data');
        localStorage.removeItem('sb-wzadnstzslxvuwmmjmwn-auth-token');
      } catch {}
      
      clearAuth();
    } finally {
      stopLoadingWatchdog();
      setLoading(false);
    }
  }, [clearAuth]);

  // ✅ Profil güncelle
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      startLoadingWatchdog(12000);

      const nextRole = updates.role ? normalizeRole(updates.role) : user.role;

      await withTimeout(
        supabase.auth.updateUser({
          data: {
            role: nextRole,
            full_name: updates.fullName ?? user.fullName,
            display_name: updates.fullName ?? user.fullName,
          },
        }),
        10000,
        "updateUser_timeout"
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
        10000,
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
      stopLoadingWatchdog();
      setLoading(false);
    }
  }, [user]);

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
