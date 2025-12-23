import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは100文字以内です'),
  content: z.string().min(1, '本文を入力してください'),
  tags: z
    .array(z.string())
    .min(1, 'タグを1つ以上入力してください')
    .max(5, 'タグは5つまでです'),
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
