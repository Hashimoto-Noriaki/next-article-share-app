/**
 * @jest-environment node
 */
import { uploadImageSchema } from './upload.dto';

const createFile = (size: number, type: string) =>
  new File([new Uint8Array(size)], 'image', { type });

describe('uploadImageSchema', () => {
  describe('folder', () => {
    it.each(['profiles', 'articles'])('%s は許可される', (folder) => {
      const result = uploadImageSchema.safeParse({
        file: createFile(10, 'image/png'),
        folder,
      });
      expect(result.success).toBe(true);
    });

    it.each(['uploads', 'profiles/../other', ''])(
      '許可されていない値（%s）はエラー',
      (folder) => {
        const result = uploadImageSchema.safeParse({
          file: createFile(10, 'image/png'),
          folder,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'アップロード先が不正です',
          );
        }
      },
    );

    it('未指定の場合はエラー', () => {
      const result = uploadImageSchema.safeParse({
        file: createFile(10, 'image/png'),
        folder: null,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('アップロード先が不正です');
      }
    });
  });

  describe('file', () => {
    it('未指定の場合はエラー', () => {
      const result = uploadImageSchema.safeParse({
        file: null,
        folder: 'articles',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'ファイルが選択されていません',
        );
      }
    });

    it('5MBを超える場合はエラー', () => {
      const result = uploadImageSchema.safeParse({
        file: createFile(5 * 1024 * 1024 + 1, 'image/png'),
        folder: 'articles',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'ファイルサイズは5MB以下にしてください',
        );
      }
    });

    it('画像以外の形式はエラー', () => {
      const result = uploadImageSchema.safeParse({
        file: createFile(10, 'application/pdf'),
        folder: 'articles',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'JPEG、PNG、GIF、WebP形式のみアップロード可能です',
        );
      }
    });
  });
});
