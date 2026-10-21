import { z } from 'zod';

export const UPLOAD_FOLDERS = ['profiles', 'articles'] as const;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const uploadImageSchema = z.object({
  file: z
    .instanceof(File, { error: 'ファイルが選択されていません' })
    .refine((file) => file.size <= MAX_UPLOAD_SIZE, {
      error: 'ファイルサイズは5MB以下にしてください',
    })
    .refine(
      (file) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
      { error: 'JPEG、PNG、GIF、WebP形式のみアップロード可能です' },
    ),
  folder: z.enum(UPLOAD_FOLDERS, { error: 'アップロード先が不正です' }),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
