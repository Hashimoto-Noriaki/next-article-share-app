'use client';

import { useState, useEffect } from 'react';
import { useDropdown } from '@/shared/hooks';
import { NotificationWithRelations } from '@/types';
import {
  listNotificationsAction,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/features/notifications/actions/notification.action';

export function useNotifications() {
  const { isOpen, ref, toggle, close } = useDropdown();
  const [notifications, setNotifications] = useState<
    NotificationWithRelations[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await listNotificationsAction();
      if (result.success) {
        setNotifications(result.notifications as NotificationWithRelations[]);
      }
    } catch (error) {
      console.error('通知取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const result = await markAllNotificationsAsReadAction();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const markAsRead = async (notificationId: string) => {
    const result = await markNotificationAsReadAction({ notificationId });
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    }
  };

  const handleToggle = () => {
    if (!isOpen) fetchNotifications();
    toggle();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    isOpen,
    ref,
    notifications,
    isLoading,
    unreadCount,
    handleToggle,
    markAllAsRead,
    markAsRead,
    close,
  };
}
