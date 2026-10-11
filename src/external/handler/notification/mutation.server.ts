import type { ActionResult } from '@/shared/types/action';
import { ok, fail } from '@/shared/lib/action-result';
import { notificationRepository } from '@/external/repository/notification';

export async function markAllNotificationsAsReadHandler({
  userId,
}: {
  userId: string;
}): Promise<ActionResult> {
  await notificationRepository.markAllAsRead(userId);
  return ok();
}

export async function markNotificationAsReadHandler({
  notificationId,
  userId,
}: {
  notificationId: string;
  userId: string;
}): Promise<ActionResult> {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification || notification.userId !== userId) {
    return fail('通知が見つかりません');
  }

  await notificationRepository.markAsRead(notificationId);
  return ok();
}
