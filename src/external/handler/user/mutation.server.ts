import { z } from 'zod';
import { userRepository } from '@/external/repository/user';

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(10, '名前は10文字以内です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export async function updateUserProfileHandler({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}) {
  const parsed = updateUserSchema.safeParse({ name, email });
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.issues };
  }

  // メールアドレス重複チェック
  const existing = await userRepository.findByEmail(email);
  if (existing && existing.id !== userId) {
    return {
      success: false as const,
      error: 'このメールアドレスは既に使用されています',
    };
  }

  const user = await userRepository.updateProfile(userId, {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  return { success: true as const, user };
}

export async function updateUserImageHandler({
  userId,
  image,
}: {
  userId: string;
  image: string;
}) {
  if (!image || typeof image !== 'string') {
    return { success: false as const, error: '画像URLが必要です' };
  }

  await userRepository.updateImage(userId, image);
  return { success: true as const };
}

export async function deleteUserHandler({ userId }: { userId: string }) {
  await userRepository.delete(userId);
  return { success: true as const };
}
