import { useState, useEffect } from 'react';
import { useDropdown } from '@/shared/hooks';
import { NotificationWithRelations } from '@/types';

export function useNotifications() {
  const { isOpen, ref, toggle, close } = useDropdown();
  const [notifications, setNotifications] = useState<
    NotificationWithRelations[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
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
    try {
      const res = await fetch('/api/notifications', { method: 'PUT' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('既読更新エラー:', error);
    }
  };

  // 個別の通知を既読にする（追加）
  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
      }
    } catch (error) {
      console.error('既読更新エラー:', error);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
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
