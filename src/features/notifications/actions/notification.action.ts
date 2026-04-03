'use server';

import { auth } from '@/external/auth';
import {
  markAllNotificationsAsReadHandler,
  markNotificationAsReadHandler,
} from '@/external/handler/notification/mutation.server';
import { listNotificationsHandler } from '@/external/handler/notification/query.server';

export async function listNotificationsAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return listNotificationsHandler({ userId });
}

export async function markAllNotificationsAsReadAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return markAllNotificationsAsReadHandler({ userId });
}

export async function markNotificationAsReadAction({
  notificationId,
}: {
  notificationId: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return markNotificationAsReadHandler({ notificationId, userId });
}
