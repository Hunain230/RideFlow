import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, AlertCircle, DollarSign, Car } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { driverAPI } from '../../lib/driver';

interface Notification {
  NotificationID: number;
  Title: string;
  Message: string;
  NotificationType: 'RideUpdate' | 'Payment' | 'Promo' | 'Safety' | 'System' | 'Ride' | 'Verification';
  IsRead: boolean;
  CreatedAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await driverAPI.getNotifications();
      const notificationsData = response.data.data || [];
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter((n: Notification) => !n.IsRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await driverAPI.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.NotificationID === notificationId ? { ...n, IsRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'RideUpdate':
      case 'Ride':
        return <Car size={16} className="text-amber-500" />;
      case 'Payment':
        return <DollarSign size={16} className="text-green-500" />;
      case 'Safety':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'Verification':
        return <Check size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <Button
        variant="glass"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <Badge 
            variant="error" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <GlassCard tier={3} className="p-0 max-h-96 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button variant="glass" size="sm" onClick={() => {
                      notifications.forEach(n => !n.IsRead && markAsRead(n.NotificationID));
                    }}>
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.NotificationID}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.IsRead ? 'bg-amber-900/20' : ''
                        }`}
                        onClick={() => !notification.IsRead && markAsRead(notification.NotificationID)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.NotificationType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-white font-medium text-sm truncate">
                                {notification.Title}
                              </p>
                              {!notification.IsRead && (
                                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {notification.Message}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(notification.CreatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close overlay when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
