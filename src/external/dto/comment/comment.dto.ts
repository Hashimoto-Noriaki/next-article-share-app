import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'コメント内容を入力してください')
    .max(1000, 'コメントは1000文字以内にしてください'),
  articleId: z.string().min(1, '記事IDが必要です'),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'コメント内容を入力してください')
    .max(1000, 'コメントは1000文字以内にしてください'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
