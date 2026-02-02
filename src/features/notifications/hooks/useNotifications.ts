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
    close,
  };
}

// import { useState, useEffect } from 'react';
// import { useDropdown } from '@/shared/hooks';
// import { NotificationWithRelations } from '@/types';

// export function useNotifications() {
//   const { isOpen, ref, toggle, close } = useDropdown();
//   const [notifications, setNotifications] = useState<NotificationWithRelations[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchNotifications = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('/api/notifications');
//       if (res.ok) {
//         const data = await res.json();
//         setNotifications(data);
//       }
//     } catch (error) {
//       console.error('通知取得エラー:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 初回マウント時に取得
//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const markAllAsRead = async () => {
//     try {
//       const res = await fetch('/api/notifications', { method: 'PUT' });
//       if (res.ok) {
//         setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//       }
//     } catch (error) {
//       console.error('既読更新エラー:', error);
//     }
//   };

//   const handleToggle = () => {
//     if (!isOpen) {
//       fetchNotifications(); // クリック時も最新を取得
//     }
//     toggle();
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return {
//     isOpen,
//     ref,
//     notifications,
//     isLoading,
//     unreadCount,
//     handleToggle,
//     markAllAsRead,
//     close,
//   };
// }
