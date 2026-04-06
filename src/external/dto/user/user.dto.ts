import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(10, '名前は10文字以内にしてください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
