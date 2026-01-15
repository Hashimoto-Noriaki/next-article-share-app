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
  /*
   *未指定の場合は空配列にする（タグを必須にしない場合）
   *.default([]),
   */
});

/*
 *Zod のスキーマから TypeScript の型を自動生成
 *バリデーションルールと型定義を常に一致させるため
 */
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
