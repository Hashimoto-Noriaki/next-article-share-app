import { ok } from '@/shared/lib/action-result';
import { notificationRepository } from '@/external/repository/notification';

export async function listNotificationsHandler({ userId }: { userId: string }) {
  const notifications = await notificationRepository.findManyByUserId(userId);
  return ok(
    notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  );
}
