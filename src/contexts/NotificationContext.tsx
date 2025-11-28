import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

interface StoredNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`notifications_${user.id}`);
      if (stored) {
        const parsed: StoredNotification[] = JSON.parse(stored);
        setNotifications(parsed.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    }
  }, [user]);

  // Save notifications to localStorage
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Generate mock notifications for demo
  useEffect(() => {
    if (user && notifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Riskli Koç Tespit Edildi',
          message: 'Mehmet Kaya düşük performans gösteriyor. KPI skoru: 58/100',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          actionUrl: '/advanced-analytics'
        },
        {
          id: '2',
          type: 'success',
          title: 'Yeni Rezervasyon',
          message: 'Ahmet Yılmaz için yeni bir seans rezervasyonu yapıldı.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          read: false,
          actionUrl: '/my-bookings'
        },
        {
          id: '3',
          type: 'info',
          title: 'Aylık Rapor Hazır',
          message: 'Kasım ayı performans raporu görüntülemeye hazır.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          actionUrl: '/admin-panel'
        },
        {
          id: '4',
          type: 'error',
          title: 'Ödeme Hatası',
          message: 'Bir kullanıcının ödeme işlemi başarısız oldu.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
          actionUrl: '/admin-panel'
        }
      ];

      if (user.userType === 'admin' || user.userType === 'super_admin') {
        setNotifications(mockNotifications);
      } else if (user.userType === 'coach') {
        setNotifications([mockNotifications[1], mockNotifications[2]]);
      } else {
        setNotifications([mockNotifications[1]]);
      }
    }
  }, [user, notifications.length]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};