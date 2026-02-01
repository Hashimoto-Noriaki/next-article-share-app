import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(10, '名前は10文字以内にしてください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(8, 'パスワードは8文字以上にしてください')
    .max(50, 'パスワードは50文字以内にしてください'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

export type SignUpInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// パスワードリセットリクエスト
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
});

// パスワードリセット
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'トークンが必要です'),
    password: z
      .string()
      .min(1, 'パスワードを入力してください')
      .min(8, 'パスワードは8文字以上にしてください')
      .max(50, 'パスワードは50文字以内にしてください'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
