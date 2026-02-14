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

  // ✅ DEĞİŞİKLİK 1: "Sessiz yenileme" için ayrı flag
  // Bu true olduğunda refresh arka planda çalışır ama Navbar loading skeleton'a DÜŞMEZ
  const silentRefreshRef = useRef(false);

  // ✅ KORUNAN: Loading watchdog (kilitlenme önleme)
  const loadingWatchdogRef = useRef<any>(null);
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

  // ✅ DEĞİŞİKLİK 2: Tab focus debounce - spam refresh önleme
  const lastFocusRefreshRef = useRef<number>(0);
  const FOCUS_DEBOUNCE_MS = 30000; // 30 saniye içinde tekrar refresh yapma

  // ✅ DEĞİŞİKLİK 3: İlk yükleme tamamlandı mı? (ilk load'dan sonra skeleton gösterme)
  const initialLoadDoneRef = useRef(false);

  const clearAuth = () => {
    setUser(null);
    setSupabaseUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const loadUserProfile = useCallback(async (supabaseUserData: SupabaseUser) => {
    try {
      setSupabaseUser(supabaseUserData);

      const meta = supabaseUserData.user_metadata || {};
      const metaRole = normalizeRole(meta.role || meta.user_type || meta.userType);

      // ✅ KORUNAN: profiles sorgusu timeout ile güvenli
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

      // KORUNAN: isim önceliği
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

      // KORUNAN: profile alınabildiyse rolü oradan normalize et
      if (!profileError && profile) {
        finalRole = normalizeRole(profile.role || profile.user_type || metaRole);
      } else {
        if (profileError) console.warn("profiles fetch issue:", profileError);
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
  }, []);

  const refresh = useCallback(async () => {
    // ✅ DEĞİŞİKLİK 4: İlk yükleme bittikten sonra refresh çağrıldığında
    // loading'i true yapma (sessiz yenileme)
    const isSilent = initialLoadDoneRef.current;

    if (!isSilent) {
      setLoading(true);
      startLoadingWatchdog(12000);
    }

    try {
      const { data, error } = await withTimeout(supabase.auth.getSession(), 8000, "getSession_timeout");
      if (error) throw error;

      const u = data?.session?.user;
      if (u) await loadUserProfile(u);
      else clearAuth();
    } catch (e) {
      console.error("Error checking user:", e);
      // ✅ DEĞİŞİKLİK 5: Sessiz refresh'te hata olursa mevcut user'ı KORUYORUZ
      // clearAuth yapmıyoruz çünkü sadece network hatası olabilir
      if (!isSilent) {
        clearAuth();
      }
    } finally {
      stopLoadingWatchdog();
      setLoading(false);
      initialLoadDoneRef.current = true;
    }
  }, [loadUserProfile]);

  useEffect(() => {
    let alive = true;

    // KORUNAN: ilk load
    refresh();

    // ✅ DEĞİŞİKLİK 6: Tab focus handler - debounce + sessiz refresh
    const onFocus = () => {
      if (!alive) return;

      const now = Date.now();
      // 30 saniye içinde tekrar refresh yapma
      if (now - lastFocusRefreshRef.current < FOCUS_DEBOUNCE_MS) {
        return;
      }
      lastFocusRefreshRef.current = now;

      // ✅ Sessiz refresh: loading skeleton'a DÜŞMEZ
      // Arka planda session kontrol eder, UI donmaz
      refresh();
    };
    window.addEventListener("focus", onFocus);

    // ✅ DEĞİŞİKLİK 7: onAuthStateChange - ilk load sonrası loading true YAPMAZ
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!alive) return;

      // ✅ INITIAL_SESSION event'ini atla - zaten refresh() ile hallettik
      if (event === "INITIAL_SESSION") {
        return;
      }

      // ✅ TOKEN_REFRESHED için loading gösterme (arka plan işlemi)
      const showLoading = event === "SIGNED_IN" || event === "SIGNED_OUT";

      if (showLoading) {
        setLoading(true);
        startLoadingWatchdog(12000);
      }

      try {
        const u = session?.user;

        if (event === "SIGNED_IN" && u) {
          await loadUserProfile(u);
        } else if (event === "SIGNED_OUT") {
          clearAuth();
        } else if (event === "TOKEN_REFRESHED" && u) {
          // ✅ Sessiz güncelleme - UI titremesin
          await loadUserProfile(u);
        } else if (event === "USER_UPDATED" && u) {
          await loadUserProfile(u);
        } else {
          if (u) await loadUserProfile(u);
          else clearAuth();
        }
      } catch (e) {
        console.error("onAuthStateChange handler error:", e);
        // Sessiz event'lerde clearAuth yapma
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KORUNAN: login fonksiyonu
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

  // KORUNAN: logout fonksiyonu
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      startLoadingWatchdog(12000);

      await withTimeout(supabase.auth.signOut(), 8000, "signOut_timeout");
      clearAuth();
    } catch (e) {
      console.error("Logout error:", e);
      clearAuth();
    } finally {
      stopLoadingWatchdog();
      setLoading(false);
    }
  }, []);

  // KORUNAN: updateProfile fonksiyonu
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
