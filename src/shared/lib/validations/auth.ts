import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(1, '名前を入力してください').max(10),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上です').max(50),
})

export const loginSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export type SignUpInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
