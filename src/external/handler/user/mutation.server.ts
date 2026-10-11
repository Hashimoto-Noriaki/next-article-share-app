import { z } from 'zod';
import type { ActionResult } from '@/shared/types/action';
import { ok, fail, validationFail } from '@/shared/lib/action-result';
import { userRepository } from '@/external/repository/user';

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(10, '名前は10文字以内です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type UpdatedProfile = Awaited<ReturnType<typeof userRepository.updateProfile>>;

export async function updateUserProfileHandler({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}): Promise<ActionResult<UpdatedProfile>> {
  const parsed = updateUserSchema.safeParse({ name, email });
  if (!parsed.success) {
    return validationFail(parsed.error);
  }

  // メールアドレス重複チェック
  const existing = await userRepository.findByEmail(email);
  if (existing && existing.id !== userId) {
    return fail('このメールアドレスは既に使用されています');
  }

  const user = await userRepository.updateProfile(userId, {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  return ok(user);
}

export async function updateUserImageHandler({
  userId,
  image,
}: {
  userId: string;
  image: string;
}): Promise<ActionResult> {
  if (!image || typeof image !== 'string') {
    return fail('画像URLが必要です');
  }

  await userRepository.updateImage(userId, image);
  return ok();
}

export async function deleteUserHandler({
  userId,
}: {
  userId: string;
}): Promise<ActionResult> {
  await userRepository.delete(userId);
  return ok();
}
