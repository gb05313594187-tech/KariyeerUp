// src/lib/boostPayment.ts
// PayTR ile Boost & Premium ödeme
import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface BoostPaymentParams {
  userId: string;
  email: string;
  fullName: string;
  type: "coach_boost" | "job_boost" | "premium_individual" | "premium_corporate" | "premium_coach" | "ai_match_package";
  targetId?: string; // coach_id veya job_id
  amount: number; // Kuruş cinsinden (örn: 29900 = 299 TL)
  durationDays?: number;
}

// PayTR ödeme başlat
export async function initiateBoostPayment(params: BoostPaymentParams) {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;

  if (!token) return { success: false, error: "Oturum bulunamadı" };

  // Merchant OID oluştur
  const merchantOid = `${params.type}_${params.userId}_${Date.now()}`;

  // PayTR token al
  const res = await fetch(`${SUPABASE_URL}/functions/v1/paytr-get-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: params.userId,
      email: params.email,
      user_name: params.fullName,
      merchant_oid: merchantOid,
      payment_amount: params.amount,
      payment_type: params.type,
      target_id: params.targetId || null,
      duration_days: params.durationDays || 30,
      // Callback bilgileri
      user_basket: JSON.stringify([
        [getProductName(params.type), String(params.amount / 100), 1],
      ]),
    }),
  });

  const result = await res.json();

  if (result.token) {
    // Ödeme kaydı oluştur
    await supabase.from("app_2dff6511da_payments").insert({
      user_id: params.userId,
      amount: params.amount,
      currency: "TRY",
      payment_method: "credit_card",
      payment_status: "pending",
      provider: "paytr",
      merchant_oid: merchantOid,
      payment_date: new Date().toISOString(),
      status: "initiated",
      raw: {
        type: params.type,
        targetId: params.targetId,
        durationDays: params.durationDays,
      },
    });

    return {
      success: true,
      token: result.token,
      merchantOid,
    };
  }

  return { success: false, error: result.error || "Token alınamadı" };
}

function getProductName(type: string): string {
  const names: Record<string, string> = {
    coach_boost: "Koç Öne Çıkarma Paketi",
    job_boost: "İlan Boost Paketi",
    premium_individual: "Bireysel Premium Üyelik",
    premium_corporate: "Kurumsal Premium Üyelik",
    premium_coach: "Koç Premium Üyelik",
    ai_match_package: "AI Eşleşme Paketi",
  };
  return names[type] || "Kariyeer Ödeme";
}

// Fiyat tablosu
export const PRICING = {
  coach_boost: {
    name: "Koç Öne Çıkarma",
    prices: [
      { duration: 7, amount: 14900, label: "1 Hafta" },
      { duration: 14, amount: 24900, label: "2 Hafta" },
      { duration: 30, amount: 39900, label: "1 Ay" },
    ],
  },
  job_boost: {
    name: "İlan Boost",
    prices: [
      { duration: 7, amount: 9900, label: "1 Hafta" },
      { duration: 14, amount: 17900, label: "2 Hafta" },
      { duration: 30, amount: 29900, label: "1 Ay" },
    ],
  },
  premium_individual: {
    name: "Bireysel Premium",
    prices: [
      { duration: 30, amount: 19900, label: "Aylık" },
      { duration: 90, amount: 49900, label: "3 Aylık" },
      { duration: 365, amount: 149900, label: "Yıllık" },
    ],
  },
  premium_corporate: {
    name: "Kurumsal Premium",
    prices: [
      { duration: 30, amount: 79900, label: "Aylık" },
      { duration: 90, amount: 199900, label: "3 Aylık" },
      { duration: 365, amount: 599900, label: "Yıllık" },
    ],
  },
  premium_coach: {
    name: "Koç Premium",
    prices: [
      { duration: 30, amount: 29900, label: "Aylık" },
      { duration: 90, amount: 74900, label: "3 Aylık" },
      { duration: 365, amount: 249900, label: "Yıllık" },
    ],
  },
  ai_match_package: {
    name: "AI Eşleşme Paketi",
    prices: [
      { duration: 1, amount: 4900, label: "Tek Seferlik" },
      { duration: 30, amount: 14900, label: "Aylık Sınırsız" },
      { duration: 365, amount: 99900, label: "Yıllık Sınırsız" },
    ],
  },
} as const;
