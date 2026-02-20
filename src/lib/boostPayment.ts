// src/lib/boostPayment.ts
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ✅ PRICING - Boost.tsx ile uyumlu hale getirildi
export const PRICING = {
  user_boost: {
    name: "Aday AI Boost",
    prices: [
      { slug: "profile_boost_7", label: "7 Gün", amount: 9900, duration: 7 },
      { slug: "profile_boost_30", label: "30 Gün", amount: 29900, duration: 30 },
    ],
  },
  coach_boost: {
    name: "Koç Öne Çıkarma",
    prices: [
      { slug: "coach_boost_7", label: "7 Gün", amount: 14900, duration: 7 },
      { slug: "coach_boost_30", label: "30 Gün", amount: 39900, duration: 30 },
    ],
  },
  corporate_boost: {
    name: "Şirket AI Boost",
    prices: [
      { slug: "job_boost_7", label: "7 Gün", amount: 19900, duration: 7 },
      { slug: "job_boost_30", label: "30 Gün", amount: 49900, duration: 30 },
    ],
  },
} as const;

export type BoostType = keyof typeof PRICING;

// ✅ Timeout ile getSession
async function getAccessTokenSafe(): Promise<string | null> {
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);

    if (!result) {
      console.warn("⚠️ getSession timeout, trying getUser...");
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const keys = Object.keys(localStorage);
        const sessionKey = keys.find((k) => k.includes("auth-token"));
        if (sessionKey) {
          try {
            const raw = localStorage.getItem(sessionKey);
            const parsed = raw ? JSON.parse(raw) : null;
            return parsed?.access_token || null;
          } catch {
            return null;
          }
        }
      }
      return null;
    }

    return (result as { data: { session: { access_token: string } | null } })
      ?.data?.session?.access_token || null;
  } catch (err) {
    console.error("❌ getAccessTokenSafe error:", err);
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

// ✅ Boost.tsx'in beklediği parametreleri kabul ediyor
export async function initiateBoostPayment({
  userId,
  email,
  fullName,
  type,
  amount,
  durationDays,
}: BoostPaymentParams): Promise<BoostPaymentResult> {
  try {
    console.log("🚀 initiateBoostPayment called:", { userId, email, fullName, type, amount, durationDays });

    // Package slug'ı bul
    const packageConfig = PRICING[type];
    if (!packageConfig) {
      return { success: false, error: `Geçersiz paket tipi: ${type}` };
    }

    const priceOption = packageConfig.prices.find((p) => p.duration === durationDays);
    if (!priceOption) {
      return { success: false, error: `Geçersiz süre: ${durationDays} gün` };
    }

    const packageSlug = priceOption.slug;
    console.log("📦 Package slug:", packageSlug);

    const accessToken = await getAccessTokenSafe();
    console.log("🔑 Access token:", accessToken ? "✅ Alındı" : "❌ Alınamadı");

    if (!accessToken) {
      return {
        success: false,
        error: "Oturum bulunamadı. Lütfen sayfayı yenileyip tekrar giriş yapın.",
      };
    }

    console.log("📡 Calling Edge Function: paytr-get-token-boost");

    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/paytr-get-token-boost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          package_slug: packageSlug,
          user_id: userId,
          email: email,
          full_name: fullName,
          amount: amount,
        }),
      }
    );

    const rawText = await res.text();
    console.log("📥 Edge Function response:", res.status, rawText);

    let body: Record<string, unknown> = {};
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = { raw: rawText };
    }

    if (!res.ok) {
      const errorMsg = (body?.error as string) || (body?.detail as string) || `HTTP ${res.status} hatası`;
      console.error("❌ Edge Function error:", errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!body?.success) {
      const errorMsg = (body?.error as string) || "Ödeme başlatılamadı.";
      console.error("❌ Payment initiation failed:", errorMsg);
      return { success: false, error: errorMsg };
    }

    const token = body?.token as string;
    if (!token) {
      console.error("❌ No token in response");
      return { success: false, error: "PayTR token alınamadı." };
    }

    console.log("✅ Payment initiated successfully, token received");

    return {
      success: true,
      token: token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
      merchantOid: body?.merchant_oid as string,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("💥 initiateBoostPayment exception:", msg);
    return { success: false, error: msg };
  }
}
