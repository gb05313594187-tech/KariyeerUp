import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  subscriptionService, 
  paymentService, 
  invoiceService,
  Subscription,
  Payment,
  Invoice
} from '@/lib/supabase';

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface SubscriptionContextType {
  activeSubscription: Subscription | null;
  activeSubscriptions: Subscription[];
  subscriptions: Subscription[];
  payments: Payment[];
  invoices: Invoice[];
  purchaseBadge: (badgeType: 'blue' | 'gold', paymentMethod: 'credit_card' | 'debit_card', cardDetails: CardDetails) => Promise<{ success: boolean; message: string; subscriptionId?: string }>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
  renewSubscription: (subscriptionId: string) => Promise<boolean>;
  upgradeSubscription: (currentSubId: string, newBadgeType: 'gold') => Promise<boolean>;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    console.log('[SubscriptionContext] 🔄 Starting data refresh...');
    console.log('[SubscriptionContext] 👤 Current user:', user?.id);
    
    if (!user) {
      console.log('[SubscriptionContext] ⚠️ No user found, clearing all data');
      setActiveSubscription(null);
      setActiveSubscriptions([]);
      setSubscriptions([]);
      setPayments([]);
      setInvoices([]);
      return;
    }

    setLoading(true);
    console.log('[SubscriptionContext] 🔄 Loading set to true');
    
    try {
      console.log('[SubscriptionContext] 📡 Fetching data from Supabase...');
      
      const [activeSub, allActiveSubs, allSubs, userPayments, userInvoices] = await Promise.all([
        subscriptionService.getActiveByUserId(user.id),
        subscriptionService.getAllActiveByUserId(user.id),
        subscriptionService.getByUserId(user.id),
        paymentService.getByUserId(user.id),
        invoiceService.getByUserId(user.id),
      ]);

      console.log('[SubscriptionContext] ✅ Data fetched successfully!');
      console.log('[SubscriptionContext] 📊 Active subscription:', activeSub);
      console.log('[SubscriptionContext] 📊 All active subscriptions count:', allActiveSubs.length);
      console.log('[SubscriptionContext] 📊 All active subscriptions:', JSON.stringify(allActiveSubs, null, 2));
      console.log('[SubscriptionContext] 📊 All subscriptions count:', allSubs.length);
      console.log('[SubscriptionContext] 📊 Payments count:', userPayments.length);
      console.log('[SubscriptionContext] 📊 Invoices count:', userInvoices.length);

      setActiveSubscription(activeSub);
      setActiveSubscriptions(allActiveSubs);
      setSubscriptions(allSubs);
      setPayments(userPayments);
      setInvoices(userInvoices);
      
      console.log('[SubscriptionContext] ✅ State updated successfully!');
    } catch (error) {
      console.error('[SubscriptionContext] ❌ Error refreshing data:', error);
      console.error('[SubscriptionContext] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      setLoading(false);
      console.log('[SubscriptionContext] 🔄 Loading set to false');
    }
  };

  useEffect(() => {
    console.log('[SubscriptionContext] 🎬 useEffect triggered, user changed:', user?.id);
    refreshData();
  }, [user]);

  const purchaseBadge = async (
    badgeType: 'blue' | 'gold',
    paymentMethod: 'credit_card' | 'debit_card',
    cardDetails: CardDetails
  ): Promise<{ success: boolean; message: string; subscriptionId?: string }> => {
    if (!user) {
      return { success: false, message: 'Lütfen giriş yapın' };
    }

    // Check if user already has an active subscription
    const existingActiveSub = await subscriptionService.getActiveByUserId(user.id);
    if (existingActiveSub && existingActiveSub.badge_type === 'verified') {
      return { success: false, message: 'Zaten aktif bir doğrulama rozetiniz var' };
    }

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

      // Create subscription with correct schema
      const subscription = await subscriptionService.create({
        user_id: user.id,
        badge_type: badgeType === 'blue' ? 'verified' : 'premium',
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        price: badgeType === 'blue' ? 99.99 : 199.99,
        currency: 'TRY',
        auto_renew: false
      });

      if (!subscription) {
        return { success: false, message: 'Abonelik oluşturulamadı' };
      }

      await refreshData();

      return {
        success: true,
        message: 'Ödeme başarıyla tamamlandı!',
        subscriptionId: subscription.id,
      };
    } catch (error) {
      console.error('Purchase error:', error);
      return {
        success: false,
        message: 'Ödeme işlemi sırasında bir hata oluştu',
      };
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
    const result = await subscriptionService.cancel(subscriptionId);
    if (result) {
      await refreshData();
      return true;
    }
    return false;
  };

  const renewSubscription = async (subscriptionId: string): Promise<boolean> => {
    const result = await subscriptionService.renew(subscriptionId);
    if (result) {
      await refreshData();
      return true;
    }
    return false;
  };

  const upgradeSubscription = async (currentSubId: string, newBadgeType: 'gold'): Promise<boolean> => {
    // Cancel current subscription
    await cancelSubscription(currentSubId);
    
    // This would trigger a new purchase flow
    // In a real app, you'd calculate prorated amount
    return true;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        activeSubscription,
        activeSubscriptions,
        subscriptions,
        payments,
        invoices,
        purchaseBadge,
        cancelSubscription,
        renewSubscription,
        upgradeSubscription,
        refreshData,
        loading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};