import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with explicit configuration to fix 406 errors
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
});

// AI Analysis interface
interface AIAnalysis {
  severity?: string;
  priority?: string;
  root_cause?: string;
  recommended_actions?: string[];
  estimated_resolution_time?: string;
  raw_response?: string;
}

// Database types - UPDATED to match actual Supabase schema
export interface Subscription {
  id: string;
  user_id: string;
  badge_type: string;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
  auto_renew: boolean;
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

// Helper functions for database operations
export const subscriptionService = {
  async getActiveByUserId(userId: string): Promise<Subscription | null> {
    try {
      console.log('[SubscriptionService] 🔍 Fetching active subscription for user:', userId);
      
      const { data, error } = await supabase
        .from('app_2dff6511da_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('[SubscriptionService] ❌ Error fetching active subscription:', error);
        console.error('[SubscriptionService] Error details:', JSON.stringify(error, null, 2));
        return null;
      }
      
      console.log('[SubscriptionService] ✅ Active subscription found:', data);
      return data;
    } catch (err) {
      console.error('[SubscriptionService] 💥 Exception in getActiveByUserId:', err);
      return null;
    }
  },

  async getAllActiveByUserId(userId: string): Promise<Subscription[]> {
    try {
      console.log('[SubscriptionService] 🚀 FORCING EDGE FUNCTION BYPASS - Skipping RLS');
      console.log('[SubscriptionService] 🔍 Fetching ALL active subscriptions via Edge Function for user:', userId);
      
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('[SubscriptionService] ❌ No session token available');
        return [];
      }

      console.log('[SubscriptionService] 🔑 Session token found, calling edge function...');
      const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_subscriptions`;
      console.log('[SubscriptionService] 🌐 Edge function URL:', edgeUrl);

      const response = await fetch(edgeUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SubscriptionService] ❌ Edge function failed:', response.status, errorText);
        return [];
      }

      const result = await response.json();
      console.log('[SubscriptionService] ✅ Edge function response:', result);
      console.log('[SubscriptionService] 📊 Subscriptions count:', result.subscriptions?.length || 0);
      console.log('[SubscriptionService] 📋 Full subscription data:', JSON.stringify(result.subscriptions, null, 2));
      
      return result.subscriptions || [];
    } catch (err) {
      console.error('[SubscriptionService] 💥 Exception in getAllActiveByUserId:', err);
      console.error('[SubscriptionService] Exception stack:', err instanceof Error ? err.stack : 'No stack trace');
      return [];
    }
  },

  async getByUserId(userId: string): Promise<Subscription[]> {
    try {
      console.log('[SubscriptionService] 🔍 Fetching all subscriptions for user:', userId);
      
      const { data, error } = await supabase
        .from('app_2dff6511da_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[SubscriptionService] ❌ Error fetching subscriptions:', error);
        return [];
      }
      
      console.log('[SubscriptionService] ✅ Found subscriptions:', data?.length || 0);
      return data || [];
    } catch (err) {
      console.error('[SubscriptionService] 💥 Exception in getByUserId:', err);
      return [];
    }
  },

  async create(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_subscriptions')
        .insert(subscription)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating subscription:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in create:', err);
      return null;
    }
  },

  async update(id: string, updates: Partial<Subscription>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_2dff6511da_subscriptions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating subscription:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exception in update:', err);
      return false;
    }
  },

  async cancel(id: string): Promise<boolean> {
    return this.update(id, { status: 'cancelled' });
  },

  async renew(id: string): Promise<boolean> {
    return this.update(id, { 
      status: 'active'
    });
  }
};

export const paymentService = {
  async getByUserId(userId: string): Promise<Payment[]> {
    try {
      console.log('[PaymentService] 🚀 FORCING EDGE FUNCTION BYPASS - Skipping RLS');
      console.log('[PaymentService] 🔍 Fetching payments via Edge Function for user:', userId);
      
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('[PaymentService] ❌ No session token available');
        return [];
      }

      console.log('[PaymentService] 🔑 Session token found, calling edge function...');
      const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_payments`;
      console.log('[PaymentService] 🌐 Edge function URL:', edgeUrl);

      const response = await fetch(edgeUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PaymentService] ❌ Edge function failed:', response.status, errorText);
        return [];
      }

      const result = await response.json();
      console.log('[PaymentService] ✅ Edge function response:', result);
      console.log('[PaymentService] 📊 Payments count:', result.payments?.length || 0);
      console.log('[PaymentService] 📋 Full payment data:', JSON.stringify(result.payments, null, 2));
      
      return result.payments || [];
    } catch (err) {
      console.error('[PaymentService] 💥 Exception in getByUserId:', err);
      console.error('[PaymentService] Exception stack:', err instanceof Error ? err.stack : 'No stack trace');
      return [];
    }
  },

  async create(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_payments')
        .insert(payment)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating payment:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in create:', err);
      return null;
    }
  }
};

export const invoiceService = {
  async getByUserId(userId: string): Promise<Invoice[]> {
    try {
      console.log('[InvoiceService] 🚀 FORCING EDGE FUNCTION BYPASS - Skipping RLS');
      console.log('[InvoiceService] 🔍 Fetching invoices via Edge Function for user:', userId);
      
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('[InvoiceService] ❌ No session token available');
        return [];
      }

      console.log('[InvoiceService] 🔑 Session token found, calling edge function...');
      const edgeUrl = `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_invoices`;
      console.log('[InvoiceService] 🌐 Edge function URL:', edgeUrl);

      const response = await fetch(edgeUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[InvoiceService] ❌ Edge function failed:', response.status, errorText);
        return [];
      }

      const result = await response.json();
      console.log('[InvoiceService] ✅ Edge function response:', result);
      console.log('[InvoiceService] 📊 Invoices count:', result.invoices?.length || 0);
      console.log('[InvoiceService] 📋 Full invoice data:', JSON.stringify(result.invoices, null, 2));
      
      return result.invoices || [];
    } catch (err) {
      console.error('[InvoiceService] 💥 Exception in getByUserId:', err);
      console.error('[InvoiceService] Exception stack:', err instanceof Error ? err.stack : 'No stack trace');
      return [];
    }
  },

  async create(invoice: Omit<Invoice, 'id' | 'created_at'>): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_invoices')
        .insert(invoice)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating invoice:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in create:', err);
      return null;
    }
  },

  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }
};

export const supportTicketService = {
  async create(subject: string, description: string, category: string = 'badge_issue'): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        return { success: false, error: 'No active session' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/app_2dff6511da_create_support_ticket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          description,
          category,
          user_metadata: {
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Support ticket creation failed:', errorText);
        return { success: false, error: 'Failed to create support ticket' };
      }

      const result = await response.json();
      return { success: true, ticket: result.ticket };
    } catch (err) {
      console.error('Exception in create support ticket:', err);
      return { success: false, error: 'An error occurred' };
    }
  },

  async getByUserId(userId: string): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching support tickets:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Exception in getByUserId:', err);
      return [];
    }
  }
};

export const coachService = {
  async getApproved(): Promise<Coach[]> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_coaches')
        .select('*')
        .eq('status', 'approved')
        .order('rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching coaches:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Exception in getApproved:', err);
      return [];
    }
  },

  async getById(id: string): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_coaches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching coach:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in getById:', err);
      return null;
    }
  },

  async getByUserId(userId: string): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_coaches')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching coach by user_id:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in getByUserId:', err);
      return null;
    }
  },

  async create(coach: Omit<Coach, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_reviews'>): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_coaches')
        .insert(coach)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating coach:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in create:', err);
      return null;
    }
  }
};

export const sessionService = {
  async getByCoachId(coachId: string): Promise<Session[]> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_sessions')
        .select('*')
        .eq('coach_id', coachId)
        .order('session_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching coach sessions:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Exception in getByCoachId:', err);
      return [];
    }
  },

  async getByClientId(clientId: string): Promise<Session[]> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_sessions')
        .select('*')
        .eq('client_id', clientId)
        .order('session_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching client sessions:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Exception in getByClientId:', err);
      return [];
    }
  },

  async create(session: Omit<Session, 'id' | 'created_at' | 'updated_at'>): Promise<Session | null> {
    try {
      const { data, error } = await supabase
        .from('app_2dff6511da_sessions')
        .insert(session)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating session:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in create:', err);
      return null;
    }
  }
};