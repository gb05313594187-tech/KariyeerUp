// src/lib/paytr.ts
// @ts-nocheck
import { supabase } from "@/lib/supabase";

/**
 * ✅ Neden bunu yapıyoruz?
 * supabase.functions.invoke() non-2xx döndüğünde çoğu zaman body'yi göstermez ve
 * sende "FunctionsHttpError context {}" görürsün.
 * Bu helper fetch ile çağırır ve Edge Function'un döndürdüğü gerçek JSON body'yi yakalar.
 *
 * ENV:
 * VITE_SUPABASE_URL
 * VITE_SUPABASE_ANON_KEY
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function getPaytrTokenViaFetch(requestId: string): Promise<string> {
  const rid = String(requestId || "").trim();
  if (!rid) {
    const err: any = new Error("requestId missing");
    err.status = 400;
    err.body = { error: "requestId missing" };
    throw err;
  }

  if (!SUPABASE_URL) {
    const err: any = new Error("VITE_SUPABASE_URL missing");
    err.status = 500;
    err.body = { error: "VITE_SUPABASE_URL missing" };
    throw err;
  }

  if (!ANON_KEY) {
    const err: any = new Error("VITE_SUPABASE_ANON_KEY missing");
    err.status = 500;
    err.body = { error: "VITE_SUPABASE_ANON_KEY missing" };
    throw err;
  }

  // ✅ login varsa access token ile çağır, yoksa anon ile (en azından debug gelsin)
  const sessionRes = await supabase.auth.getSession().catch(() => null);
  const accessToken = sessionRes?.data?.session?.access_token || "";

  const url = `${SUPABASE_URL}/functions/v1/paytr-get-token`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ request_id: rid }),
  });

  // ✅ body'yi text olarak al → json parse etmeyi dene
  const raw = await res.text().catch(() => "");
  let body: any = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = { raw };
  }

  // ✅ non-2xx ise: status + body ile fırlat → UI'da net görürsün
  if (!res.ok) {
    const err: any = new Error(`paytr-get-token HTTP ${res.status}`);
    err.name = "PaytrGetTokenHttpError";
    err.status = res.status;
    err.body = body;
    throw err;
  }

  // ✅ success ama token yoksa
  const token = body?.token;
  if (!token) {
    const err: any = new Error("Token missing in response");
    err.name = "PaytrGetTokenTokenMissing";
    err.status = 200;
    err.body = body;
    throw err;
  }

  return String(token);
}
