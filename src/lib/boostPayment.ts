// src/lib/boostPayment.ts
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ✅ PRICING sabitini boost_packages tablosundaki slug'larla eşleştir
export const PRICING: Record<
  string,
  { prices: { slug: string; amount: number; duration: number }[] }
> = {
  user_boost: {
    prices: [
      { slug: "profile_boost_7", amount: 9900, duration: 7 },   // 99₺/hafta
      { slug: "profile_boost_30", amount: 29900, duration: 30 }, // 299₺/ay
    ],
  },
  coach_boost: {
    prices: [
      { slug: "coach_boost_7", amount: 14900, duration: 7 },    // 149₺/hafta
      { slug: "coach_boost_30", amount: 39900, duration: 30 },  // 399₺/ay
    ],
  },
  corporate_boost: {
    prices: [
      { slug: "job_boost_7", amount: 19900, duration: 7 },      // 199₺/hafta
      { slug: "job_boost_30", amount: 49900, duration: 30 },    // 499₺/ay
    ],
  },
};

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
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.access_token;

    if (!accessToken) {
      return { success: false, error: "Oturum bulunamadı. Lütfen giriş yapın." };
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
        body: JSON.stringify({
          package_slug: packageSlug,
          user_id: userId,
        }),
      }
    );

    // ✅ Yanıtı önce text olarak al, sonra parse et
    const rawText = await res.text();
    let body: any = {};
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = { raw: rawText };
    }

    if (!res.ok) {
      console.error("paytr-get-token-boost HTTP error:", res.status, body);
      return {
        success: false,
        error:
          body?.error ||
          `Sunucu hatası (HTTP ${res.status}). Lütfen tekrar deneyin.`,
      };
    }

    if (!body?.success) {
      return {
        success: false,
        error: body?.error || "Ödeme başlatılamadı.",
      };
    }

    const token = body?.token;
    if (!token) {
      return { success: false, error: "PayTR token alınamadı." };
    }

    return {
      success: true,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
      merchantOid: body?.merchant_oid,
    };
  } catch (err: any) {
    console.error("initiateBoostPayment error:", err);
    return {
      success: false,
      error: err?.message || "Beklenmeyen bir hata oluştu.",
    };
  }
}
