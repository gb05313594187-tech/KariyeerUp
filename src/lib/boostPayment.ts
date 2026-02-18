// src/lib/boostPayment.ts
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const PRICING: Record<
  string,
  { prices: { slug: string; amount: number; duration: number }[] }
> = {
  user_boost: {
    prices: [
      { slug: "profile_boost_7", amount: 9900, duration: 7 },
      { slug: "profile_boost_30", amount: 29900, duration: 30 },
    ],
  },
  coach_boost: {
    prices: [
      { slug: "coach_boost_7", amount: 14900, duration: 7 },
      { slug: "coach_boost_30", amount: 39900, duration: 30 },
    ],
  },
  corporate_boost: {
    prices: [
      { slug: "job_boost_7", amount: 19900, duration: 7 },
      { slug: "job_boost_30", amount: 49900, duration: 30 },
    ],
  },
};

// ✅ Timeout ile getSession — "getSession_timeout" hatasını önler
async function getAccessTokenSafe(): Promise<string | null> {
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);

    if (!result) {
      console.warn("getSession timeout, trying getUser...");
      // Fallback: getUser dene
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Token'ı localStorage'dan al
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
    console.error("getAccessTokenSafe error:", err);
    return null;
  }
}

export interface BoostPaymentResult {
  success: boolean;
  iframeUrl?: string;
  merchantOid?: string;
  error?: string;
}

export async function initiateBoostPayment({
  userId,
  packageSlug,
}: {
  userId: string;
  packageSlug: string;
}): Promise<BoostPaymentResult> {
  try {
    const accessToken = await getAccessTokenSafe();

    if (!accessToken) {
      return {
        success: false,
        error: "Oturum bulunamadı. Lütfen sayfayı yenileyip tekrar giriş yapın.",
      };
    }

    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/paytr-get-token-boost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ package_slug: packageSlug, user_id: userId }),
      }
    );

    const rawText = await res.text();
    console.log("paytr-get-token-boost response:", res.status, rawText);

    let body: Record<string, unknown> = {};
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = { raw: rawText };
    }

    if (!res.ok) {
      return {
        success: false,
        error:
          (body?.error as string) ||
          (body?.detail as string) ||
          `HTTP ${res.status} hatası`,
      };
    }

    if (!body?.success) {
      return {
        success: false,
        error: (body?.error as string) || "Ödeme başlatılamadı.",
      };
    }

    const token = body?.token as string;
    if (!token) {
      return { success: false, error: "PayTR token alınamadı." };
    }

    return {
      success: true,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
      merchantOid: body?.merchant_oid as string,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("initiateBoostPayment error:", msg);
    return { success: false, error: msg };
  }
}
