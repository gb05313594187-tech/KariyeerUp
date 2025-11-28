import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS, fr } from 'date-fns/locale';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

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

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{getNavText('Bildirimler', 'Notifications', 'Notifications')}</span>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} {getNavText('yeni', 'new', 'nouveau')}</Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length > 0 ? (
          <>
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                        locale: getLocale()
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-blue-600 cursor-pointer"
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {getNavText('Tümünü Görüntüle', 'View All', 'Voir tout')}
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-gray-600">
            {getNavText('Bildirim yok', 'No notifications', 'Aucune notification')}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}