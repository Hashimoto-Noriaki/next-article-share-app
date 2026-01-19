import { z } from 'zod';

export const DRAFT_LIMIT = 10;

export const draftArticleSchema = z.object({
  title: z
    .string()
    .max(100, 'タイトルは100文字以内にしてください')
    .optional()
    .default(''),
  content: z.string().optional().default(''),
  tags: z
    .array(z.string())
    .max(5, 'タグは5つ以内にしてください')
    .optional()
    .default([]),
  isDraft: z.literal(true),
});

export type DraftArticleInput = z.infer<typeof draftArticleSchema>;
