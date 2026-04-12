import { notificationRepository } from '@/external/repository/notification';

export async function markAllNotificationsAsReadHandler({
  userId,
}: {
  userId: string;
}) {
  await notificationRepository.markAllAsRead(userId);
  return { success: true as const };
}

export async function markNotificationAsReadHandler({
  notificationId,
  userId,
}: {
  notificationId: string;
  userId: string;
}) {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification || notification.userId !== userId) {
    return { success: false as const, error: '通知が見つかりません' };
  }

  await notificationRepository.markAsRead(notificationId);
  return { success: true as const };
}
