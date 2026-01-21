import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは100文字以内にしてください'),
  content: z.string().min(1, '本文を入力してください'),
  tags: z
    .array(z.string())
    .min(1, 'タグは1つ以上指定してください')
    .max(5, 'タグは5つ以内にしてください'),
  isDraft: z.boolean().optional().default(false),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
