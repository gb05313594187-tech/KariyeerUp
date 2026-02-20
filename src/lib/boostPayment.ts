// src/lib/boostPayment.ts
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const PRICING = {
  user_boost: {
    name: "Aday AI Boost",
    prices: [
      { slug: "user_boost_7", label: "7 Gün", amount: 9900, duration: 7 },
      { slug: "user_boost_30", label: "30 Gün", amount: 19900, duration: 30 },
    ],
  },
  coach_boost: {
    name: "Koç Öne Çıkarma",
    prices: [
      { slug: "coach_boost_7", label: "7 Gün", amount: 19900, duration: 7 },
      { slug: "coach_boost_30", label: "30 Gün", amount: 39900, duration: 30 },
    ],
  },
  corporate_boost: {
    name: "Şirket AI Boost",
    prices: [
      { slug: "corporate_boost_7", label: "7 Gün", amount: 29900, duration: 7 },
      { slug: "corporate_boost_30", label: "30 Gün", amount: 49900, duration: 30 },
    ],
  },
} as const;

export type BoostType = keyof typeof PRICING;

async function getAccessTokenSafe(): Promise<string | null> {
  try {
    console.log("🔑 [boostPayment] Getting access token...");

    const storageKey = "kariyeerup-auth-token";
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.access_token) {
          console.log("✅ [boostPayment] Token from localStorage");
          return parsed.access_token;
        }
      }
    } catch (e) {
      console.warn("⚠️ [boostPayment] localStorage read failed:", e);
    }

    try {
      console.log("🔄 [boostPayment] Trying getSession...");
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 2000)
      );

      const result = await Promise.race([sessionPromise, timeoutPromise]);

      if (result && (result as any)?.data?.session?.access_token) {
        console.log("✅ [boostPayment] Token from getSession");
        return (result as any).data.session.access_token;
      } else {
        console.warn("⚠️ [boostPayment] getSession timeout or no session");
      }
    } catch (e) {
      console.warn("⚠️ [boostPayment] getSession failed:", e);
    }

    try {
      console.log("🔄 [boostPayment] Trying refreshSession...");
      const { data, error } = await supabase.auth.refreshSession();

      if (!error && data?.session?.access_token) {
        console.log("✅ [boostPayment] Token from refreshSession");
        return data.session.access_token;
      } else {
        console.warn("⚠️ [boostPayment] refreshSession failed:", error?.message);
      }
    } catch (e) {
      console.warn("⚠️ [boostPayment] refreshSession exception:", e);
    }

    console.error("❌ [boostPayment] All token retrieval methods failed");
    return null;
  } catch (err) {
    console.error("❌ [boostPayment] getAccessTokenSafe error:", err);
    return null;
  }
}

export interface BoostPaymentParams {
  userId: string;
  email: string;
  fullName: string;
  type: BoostType;
  amount: number;
  durationDays: number;
}

export interface BoostPaymentResult {
  success: boolean;
  token?: string;
  iframeUrl?: string;
  merchantOid?: string;
  error?: string;
}

export async function initiateBoostPayment({
  userId,
  email,
  fullName,
  type,
  amount,
  durationDays,
}: BoostPaymentParams): Promise<BoostPaymentResult> {
  try {
    console.log("🚀 [boostPayment] initiateBoostPayment called:", {
      userId,
      email,
      fullName,
      type,
      amount,
      durationDays,
    });

    const packageConfig = PRICING[type];
    if (!packageConfig) {
      console.error("❌ Invalid package type:", type);
      return { success: false, error: `Geçersiz paket tipi: ${type}` };
    }

    const priceOption = packageConfig.prices.find((p) => p.duration === durationDays);
    if (!priceOption) {
      console.error("❌ Invalid duration:", durationDays);
      return { success: false, error: `Geçersiz süre: ${durationDays} gün` };
    }

    const packageSlug = priceOption.slug;
    console.log("📦 [boostPayment] Package slug:", packageSlug);

    const accessToken = await getAccessTokenSafe();

    if (!accessToken) {
      console.error("❌ [boostPayment] No access token");
      return {
        success: false,
        error: "Oturum süresi dolmuş olabilir. Lütfen çıkış yapıp tekrar giriş yapın.",
      };
    }

    console.log("✅ [boostPayment] Token received, calling Edge Function...");

    const requestBody = {
      package_slug: packageSlug,
      user_id: userId,
      email: email,
      full_name: fullName,
      amount: amount,
    };

    console.log("📤 [boostPayment] Request body:", requestBody);

    const res = await fetch(`${SUPABASE_URL}/functions/v1/paytr-get-token-boost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📥 [boostPayment] Response status:", res.status);

    const rawText = await res.text();
    console.log("📥 [boostPayment] Response body:", rawText);

    let body: Record<string, unknown> = {};
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.error("❌ [boostPayment] Failed to parse response");
      return { success: false, error: "Sunucu yanıtı okunamadı." };
    }

    if (!res.ok) {
      const errorMsg =
        (body?.error as string) ||
        (body?.detail as string) ||
        (body?.message as string) ||
        `HTTP ${res.status} hatası`;
      console.error("❌ [boostPayment] Edge Function error:", errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!body?.success) {
      const errorMsg = (body?.error as string) || "Ödeme başlatılamadı.";
      console.error("❌ [boostPayment] Payment initiation failed:", errorMsg);
      return { success: false, error: errorMsg };
    }

    const token = body?.token as string;
    if (!token) {
      console.error("❌ [boostPayment] No token in response");
      return { success: false, error: "PayTR token alınamadı." };
    }

    console.log("✅ [boostPayment] Payment token received");

    return {
      success: true,
      token: token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
      merchantOid: body?.merchant_oid as string,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("💥 [boostPayment] Exception:", msg);
    return { success: false, error: msg };
  }
}
