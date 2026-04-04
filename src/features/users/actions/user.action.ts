'use server';

import { auth } from '@/external/auth';
import {
  updateUserProfileHandler,
  updateUserImageHandler,
  deleteUserHandler,
} from '@/external/handler/user/mutation.server';

export async function updateUserProfileAction({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return updateUserProfileHandler({ userId, name, email });
}

export async function updateUserImageAction({ image }: { image: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return updateUserImageHandler({ userId, image });
}

export async function deleteUserAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return deleteUserHandler({ userId });
}
