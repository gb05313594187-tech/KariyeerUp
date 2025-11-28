// LocalStorage tabanlı veri yönetim sistemi

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  userType: 'client' | 'coach' | 'company';
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  badgeType: 'blue' | 'gold';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'debit_card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId: string;
  paymentDate: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  paymentId: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'kariyeer_users',
  CURRENT_USER: 'kariyeer_current_user',
  SUBSCRIPTIONS: 'kariyeer_subscriptions',
  PAYMENTS: 'kariyeer_payments',
  INVOICES: 'kariyeer_invoices',
};

// Helper functions
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// User operations
export const userStorage = {
  getAll: (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS),
  
  getById: (id: string): User | null => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.id === id) || null;
  },
  
  getByEmail: (email: string): User | null => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.email === email) || null;
  },
  
  create: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },
  
  update: (id: string, updates: Partial<User>): User | null => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return users[index];
  },
  
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  
  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
};

// Subscription operations
export const subscriptionStorage = {
  getAll: (): Subscription[] => getFromStorage<Subscription>(STORAGE_KEYS.SUBSCRIPTIONS),
  
  getByUserId: (userId: string): Subscription[] => {
    const subscriptions = getFromStorage<Subscription>(STORAGE_KEYS.SUBSCRIPTIONS);
    return subscriptions.filter(s => s.userId === userId);
  },
  
  getActiveByUserId: (userId: string): Subscription | null => {
    const subscriptions = getFromStorage<Subscription>(STORAGE_KEYS.SUBSCRIPTIONS);
    return subscriptions.find(s => s.userId === userId && s.status === 'active') || null;
  },
  
  create: (subData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Subscription => {
    const subscriptions = getFromStorage<Subscription>(STORAGE_KEYS.SUBSCRIPTIONS);
    const newSub: Subscription = {
      ...subData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    subscriptions.push(newSub);
    saveToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
    return newSub;
  },
  
  update: (id: string, updates: Partial<Subscription>): Subscription | null => {
    const subscriptions = getFromStorage<Subscription>(STORAGE_KEYS.SUBSCRIPTIONS);
    const index = subscriptions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    subscriptions[index] = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
    return subscriptions[index];
  },
  
  cancel: (id: string): Subscription | null => {
    return subscriptionStorage.update(id, { status: 'cancelled', autoRenew: false });
  },
  
  renew: (id: string): Subscription | null => {
    const subscription = getFromStorage<Subscription>(STORAGE_KEYS.SUBSCRIPTIONS).find(s => s.id === id);
    if (!subscription) return null;
    
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    
    return subscriptionStorage.update(id, {
      status: 'active',
      endDate: newEndDate.toISOString(),
      autoRenew: true,
    });
  },
};

// Payment operations
export const paymentStorage = {
  getAll: (): Payment[] => getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS),
  
  getByUserId: (userId: string): Payment[] => {
    const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
    return payments.filter(p => p.userId === userId).sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  },
  
  create: (paymentData: Omit<Payment, 'id' | 'createdAt'>): Payment => {
    const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
    const newPayment: Payment = {
      ...paymentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
    return newPayment;
  },
};

// Invoice operations
export const invoiceStorage = {
  getAll: (): Invoice[] => getFromStorage<Invoice>(STORAGE_KEYS.INVOICES),
  
  getByUserId: (userId: string): Invoice[] => {
    const invoices = getFromStorage<Invoice>(STORAGE_KEYS.INVOICES);
    return invoices.filter(i => i.userId === userId).sort((a, b) => 
      new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
    );
  },
  
  getByPaymentId: (paymentId: string): Invoice | null => {
    const invoices = getFromStorage<Invoice>(STORAGE_KEYS.INVOICES);
    return invoices.find(i => i.paymentId === paymentId) || null;
  },
  
  create: (invoiceData: Omit<Invoice, 'id' | 'createdAt'>): Invoice => {
    const invoices = getFromStorage<Invoice>(STORAGE_KEYS.INVOICES);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    invoices.push(newInvoice);
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    return newInvoice;
  },
  
  generateInvoiceNumber: (): string => {
    const invoices = getFromStorage<Invoice>(STORAGE_KEYS.INVOICES);
    const year = new Date().getFullYear();
    const count = invoices.filter(i => i.invoiceNumber.startsWith(`INV-${year}`)).length + 1;
    return `INV-${year}-${String(count).padStart(5, '0')}`;
  },
};