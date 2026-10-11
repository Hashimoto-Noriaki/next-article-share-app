'use server';

import { ok, fail } from '@/shared/lib/action-result';
import { auth } from '@/external/auth';
import { getCurrentUserHandler } from '@/external/handler/user/query.server';
import {
  updateUserProfileHandler,
  updateUserImageHandler,
  deleteUserHandler,
} from '@/external/handler/user/mutation.server';

export async function getCurrentUserAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  const user = await getCurrentUserHandler({ userId });
  if (!user) return fail('ユーザーが見つかりません');

  return ok(user);
}

export async function updateUserProfileAction({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  return updateUserProfileHandler({ userId, name, email });
}

export async function updateUserImageAction({ image }: { image: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  return updateUserImageHandler({ userId, image });
}

export async function deleteUserAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail('認証が必要です');

  return deleteUserHandler({ userId });
}
