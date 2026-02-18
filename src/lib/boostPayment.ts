// src/lib/boostPayment.ts
// @ts-nocheck
import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/* ───────────────── TYPES ───────────────── */
export interface BoostPrice {
  slug: string;
  duration: number;   // gün
  amount: number;     // kuruş (9900 = 99₺)
}

export interface BoostPackage {
  name: string;
  targetRole: "user" | "coach" | "corporate";
  prices: BoostPrice[];
}

/* ───────────────── PRICING ───────────────── */
export const PRICING: Record<string, BoostPackage> = {
  user_boost: {
    name: "Aday AI Boost",
    targetRole: "user",
    prices: [
      { slug: "user_boost_7",  duration: 7,  amount: 9900  },
      { slug: "user_boost_30", duration: 30, amount: 19900 },
    ],
  },
  coach_boost: {
    name: "Koç Öne Çıkarma",
    targetRole: "coach",
    prices: [
      { slug: "coach_boost_7",  duration: 7,  amount: 19900 },
      { slug: "coach_boost_30", duration: 30, amount: 39900 },
    ],
  },
  corporate_boost: {
    name: "Şirket AI Boost",
    targetRole: "corporate",
    prices: [
      { slug: "corporate_boost_7",  duration: 7,  amount: 29900 },
      { slug: "corporate_boost_30", duration: 30, amount: 49900 },
    ],
  },
};

/* ───────────────── PAYMENT ───────────────── */
export async function initiateBoostPayment(params: {
  userId: string;
  packageSlug: string;
}) {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { success: false as const, error: "Oturum bulunamadı" };

  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/paytr-get-token-boost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package_slug: params.packageSlug,
          user_id: params.userId,
        }),
      }
    );

    const result = await res.json();

    if (result.success && result.token) {
      return {
        success: true as const,
        token: result.token,
        merchantOid: result.merchant_oid,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      };
    }

    return {
      success: false as const,
      error: result.error || "Token alınamadı",
    };
  } catch (err: any) {
    return {
      success: false as const,
      error: err.message || "Bağlantı hatası",
    };
  }
}
