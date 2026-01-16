import { z } from 'zod';

// 公開用
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
//    *未指定の場合は空配列にする（タグを必須にしない場合）
//    *.default([]),
//    */
});

// 下書き用
export const draftArticleSchema = z.object({
  title: z.string().max(100).optional().default(''),
  content: z.string().optional().default(''),
  tags: z.array(z.string()).max(5).optional().default([]),
  isDraft: z.literal(true),
});

// /*
//  *Zod のスキーマから TypeScript の型を自動生成
//  *バリデーションルールと型定義を常に一致させるため
//  */
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type DraftArticleInput = z.infer<typeof draftArticleSchema>;
