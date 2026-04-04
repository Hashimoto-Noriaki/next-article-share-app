'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropdown } from '@/shared/hooks';
import { NotificationWithRelations } from '@/types';
import {
  listNotificationsAction,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/features/notifications/actions/notification.action';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

export function useNotifications() {
  const { isOpen, ref, toggle, close } = useDropdown();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async (): Promise<NotificationWithRelations[]> => {
      const result = await listNotificationsAction();
      if (!result.success) return [];
      return result.notifications as NotificationWithRelations[];
    },
    staleTime: 1 * 60 * 1000,
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: markAllNotificationsAsReadAction,
    onSuccess: () => {
      queryClient.setQueryData(
        notificationKeys.list(),
        (prev: NotificationWithRelations[] = []) =>
          prev.map((n) => ({ ...n, isRead: true })),
      );
    },
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsReadAction({ notificationId }),
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(
        notificationKeys.list(),
        (prev: NotificationWithRelations[] = []) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
      );
    },
  });

  const handleToggle = () => {
    if (!isOpen) {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
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
