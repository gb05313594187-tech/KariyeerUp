import { useNavigate } from 'react-router-dom';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS, fr } from 'date-fns/locale';

export default function NotificationCenter() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const { language } = useLanguage();

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const getLocale = () => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return enUS;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    const opacity = read ? '50' : '100';
    switch (type) {
      case 'warning':
        return `bg-yellow-${opacity}`;
      case 'success':
        return `bg-green-${opacity}`;
      case 'error':
        return `bg-red-${opacity}`;
      default:
        return `bg-blue-${opacity}`;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getNavText('Geri Dön', 'Go Back', 'Retour')}
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-8 w-8" />
                {getNavText('Bildirim Merkezi', 'Notification Center', 'Centre de notifications')}
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0
                  ? getNavText(
                      `${unreadCount} okunmamış bildirim`,
                      `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`,
                      `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                    )
                  : getNavText('Tüm bildirimler okundu', 'All notifications read', 'Toutes les notifications lues')}
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {getNavText('Tümünü Okundu İşaretle', 'Mark All as Read', 'Tout marquer comme lu')}
                </Button>
              )}
              {notifications.length > 0 && (
                <Button onClick={clearAll} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {getNavText('Tümünü Temizle', 'Clear All', 'Tout effacer')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${getNotificationBgColor(notification.type, notification.read)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge className="bg-blue-500">
                            {getNavText('Yeni', 'New', 'Nouveau')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: getLocale()
                          })}
                        </p>
                        <div className="flex gap-2">
                          {notification.actionUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {getNavText('Git', 'Go', 'Aller')}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getNavText('Bildirim Yok', 'No Notifications', 'Aucune notification')}
                </h3>
                <p className="text-gray-600">
                  {getNavText(
                    'Şu anda görüntülenecek bildiriminiz bulunmuyor.',
                    'You have no notifications to display at the moment.',
                    'Vous n\'avez aucune notification à afficher pour le moment.'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}