import { notificationRepository } from '@/external/repository/notification';

export async function listNotificationsHandler({ userId }: { userId: string }) {
  const notifications = await notificationRepository.findManyByUserId(userId);
  return {
    success: true as const,
    notifications: notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
