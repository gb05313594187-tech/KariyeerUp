// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      // ✅ apikey kalsın
      apikey: supabaseAnonKey,
      // ❌ Authorization: Bearer ANON_KEY YOK
      // Supabase session varsa kendi access_token'ını otomatik yollar
    },
  },
});

/* =========================================================
   ✅ PREMIUM ENUMS (DB CHECK CONSTRAINT ile UYUMLU TUT)
   ========================================================= */

export const SUBSCRIPTION_TYPES = {
  INDIVIDUAL: "individual",
  CORPORATE: "corporate",
  COACH: "coach",
} as const;

export type SubscriptionType =
  typeof SUBSCRIPTION_TYPES[keyof typeof SUBSCRIPTION_TYPES];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  PENDING: "pending",
} as const;

export type SubscriptionStatus =
  typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

export const BADGE_TYPES = {
  BLUE: "blue_badge",
  GOLD: "gold_badge",
  VERIFIED: "verified_badge",
} as const;

export type BadgeType = typeof BADGE_TYPES[keyof typeof BADGE_TYPES];

/* ---------------- TYPES ---------------- */

interface AIAnalysis {
  severity?: string;
  priority?: string;
  root_cause?: string;
  recommended_actions?: string[];
  estimated_resolution_time?: string;
  raw_response?: string;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;

  // ✅ artık string değil: constraint uyumlu enum
  subscription_type: SubscriptionType;

  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
  auto_renew: boolean;

  // ✅ badge type için de enum (DB’in izinli değerleri farklıysa burayı güncelleriz)
  badge_type: BadgeType | string;

  iyzico_subscription_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  transaction_id?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  payment_id: string;
  invoice_number: string;
  invoice_date: string;
  amount: number;
  currency: string;
  tax_amount: number;
  total_amount: number;
  status: string;
  invoice_sent: boolean;
  invoice_sent_at?: string;
  created_at: string;

  // opsiyonel
  subscription_type?: SubscriptionType | string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  ai_analysis?: AIAnalysis;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface Coach {
  id: string;
  user_id: string;
  full_name: string;
  title: string;
  specialization: string;
  experience_years: number;
  bio?: string;
  hourly_rate: number;
  currency: string;
  rating: number;
  total_reviews: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  coach_id: string;
  client_id: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/* ---------------- HELPERS ---------------- */

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

function nowIso() {
  return new Date().toISOString();
}

/* ---------------- PREMIUM SUBSCRIPTION SERVICE ---------------- */
/**
 * ✅ Tek gerçek kaynak: app_2dff6511da_premium_subscriptions
 */
export const subscriptionService = {
  async getActiveByUserId(userId: string): Promise<PremiumSubscription | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_premium_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", SUBSCRIPTION_STATUS.ACTIVE)
        .gt("end_date", nowIso())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return data as unknown as PremiumSubscription;
    } catch {
      return null;
    }
  },

  async getByUserId(userId: string): Promise<PremiumSubscription[]> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_premium_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return [];
      return (data || []) as unknown as PremiumSubscription[];
    } catch {
      return [];
    }
  },

  // Edge Function (varsa)
  async getMySubscriptionsViaEdge(): Promise<PremiumSubscription[]> {
    try {
      const token = await getAccessToken();
      if (!token) return [];

      const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_subscriptions`;
      const res = await fetch(edgeUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return [];
      const result = await res.json();
      return (result.subscriptions || []) as PremiumSubscription[];
    } catch {
      return [];
    }
  },

  // ✅ create: subscription_type yanlış gönderilemesin diye tip güvenli
  async create(subscription: {
    user_id: string;
    subscription_type: SubscriptionType;
    status: SubscriptionStatus;
    start_date: string;
    end_date: string;
    price: number;
    currency: string;
    auto_renew: boolean;
    badge_type: string; // DB ne kabul ediyorsa
    iyzico_subscription_id?: string | null;
  }): Promise<PremiumSubscription | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_premium_subscriptions")
        .insert(subscription)
        .select()
        .single();

      if (error) return null;
      return data as unknown as PremiumSubscription;
    } catch {
      return null;
    }
  },

  async update(id: string, updates: Partial<PremiumSubscription>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("app_2dff6511da_premium_subscriptions")
        .update({ ...updates, updated_at: nowIso() })
        .eq("id", id);

      return !error;
    } catch {
      return false;
    }
  },

  async cancel(id: string): Promise<boolean> {
    return this.update(id, { status: SUBSCRIPTION_STATUS.CANCELLED } as any);
  },
};

/* ---------------- PAYMENTS ---------------- */

export const paymentService = {
  async getByUserId(userId: string): Promise<Payment[]> {
    try {
      const token = await getAccessToken();
      if (token) {
        const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_payments`;
        const res = await fetch(edgeUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const result = await res.json();
          return (result.payments || []) as Payment[];
        }
      }

      const { data, error } = await supabase
        .from("app_2dff6511da_payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return [];
      return (data || []) as Payment[];
    } catch {
      return [];
    }
  },

  async create(payment: Omit<Payment, "id" | "created_at">): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_payments")
        .insert(payment)
        .select()
        .single();

      if (error) return null;
      return data as Payment;
    } catch {
      return null;
    }
  },
};

/* ---------------- INVOICES ---------------- */

export const invoiceService = {
  async getByUserId(userId: string): Promise<Invoice[]> {
    try {
      const token = await getAccessToken();
      if (token) {
        const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_invoices`;
        const res = await fetch(edgeUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const result = await res.json();
          return (result.invoices || []) as Invoice[];
        }
      }

      const { data, error } = await supabase
        .from("app_2dff6511da_invoices")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return [];
      return (data || []) as Invoice[];
    } catch {
      return [];
    }
  },

  async generatePDF(invoiceId: string): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
      const token = await getAccessToken();
      if (!token) return { success: false, error: "No active session" };

      const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_generate_invoice_pdf`;
      const response = await fetch(edgeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });

      if (!response.ok) return { success: false, error: "Failed to generate PDF" };
      const result = await response.json();
      return { success: true, html: result.html };
    } catch {
      return { success: false, error: "An error occurred while generating PDF" };
    }
  },

  async sendEmail(invoiceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await getAccessToken();
      if (!token) return { success: false, error: "No active session" };

      const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_send_invoice_email`;
      const response = await fetch(edgeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });

      if (!response.ok) return { success: false, error: "Failed to send email" };
      return { success: true };
    } catch {
      return { success: false, error: "An error occurred while sending email" };
    }
  },

  async create(invoice: Omit<Invoice, "id" | "created_at">): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_invoices")
        .insert(invoice)
        .select()
        .single();

      if (error) return null;
      return data as Invoice;
    } catch {
      return null;
    }
  },

  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `INV-${year}${month}-${random}`;
  },
};

/* ---------------- SUPPORT TICKETS ---------------- */

export const supportTicketService = {
  async create(
    subject: string,
    description: string,
    category: string = "badge_issue"
  ): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
    try {
      const token = await getAccessToken();
      if (!token) return { success: false, error: "No active session" };

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return { success: false, error: "User not found" };

      const response = await fetch(
        `${supabaseUrl}/functions/v1/app_2dff6511da_create_support_ticket`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            description,
            category,
            user_metadata: {
              email: user.email,
              fullName: user.user_metadata?.full_name || user.email,
            },
          }),
        }
      );

      if (!response.ok) return { success: false, error: "Failed to create support ticket" };
      const result = await response.json();
      return { success: true, ticket: result.ticket };
    } catch {
      return { success: false, error: "An error occurred" };
    }
  },

  async getByUserId(userId: string): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return [];
      return (data || []) as SupportTicket[];
    } catch {
      return [];
    }
  },
};

/* ---------------- COACHES ---------------- */

export const coachService = {
  async getApproved(): Promise<Coach[]> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("status", "approved")
        .order("rating", { ascending: false });

      if (error) return [];
      return (data || []) as Coach[];
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return null;
      return data as Coach;
    } catch {
      return null;
    }
  },

  async getByUserId(userId: string): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) return null;
      return data as Coach;
    } catch {
      return null;
    }
  },

  async create(
    coach: Omit<Coach, "id" | "created_at" | "updated_at" | "rating" | "total_reviews">
  ): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_coaches")
        .insert(coach)
        .select()
        .single();

      if (error) return null;
      return data as Coach;
    } catch {
      return null;
    }
  },
};

/* ---------------- SESSIONS ---------------- */

export const sessionService = {
  async getByCoachId(coachId: string): Promise<Session[]> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_sessions")
        .select("*")
        .eq("coach_id", coachId)
        .order("session_date", { ascending: false });

      if (error) return [];
      return (data || []) as Session[];
    } catch {
      return [];
    }
  },

  async getByClientId(clientId: string): Promise<Session[]> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_sessions")
        .select("*")
        .eq("client_id", clientId)
        .order("session_date", { ascending: false });

      if (error) return [];
      return (data || []) as Session[];
    } catch {
      return [];
    }
  },

  async create(session: Omit<Session, "id" | "created_at" | "updated_at">): Promise<Session | null> {
    try {
      const { data, error } = await supabase
        .from("app_2dff6511da_sessions")
        .insert(session)
        .select()
        .single();

      if (error) return null;
      return data as Session;
    } catch {
      return null;
    }
  },
};
