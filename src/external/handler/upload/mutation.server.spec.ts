/**
 * @jest-environment node
 */
import { uploadImageHandler } from '@/external/handler/upload/mutation.server';

// Cloudinary をモック
jest.mock('@/external/cloudinary', () => ({
  cloudinary: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

import { cloudinary } from '@/external/cloudinary';

const createFile = () =>
  new File([new Uint8Array(10)], 'image.png', { type: 'image/png' });

describe('uploadImageHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/demo/image.png',
      public_id: 'articles/user-1/image',
    });
  });

  describe('正常系', () => {
    it.each(['profiles', 'articles'])(
      '%s フォルダ配下のユーザーごとのパスにアップロードする',
      async (folder) => {
        const result = await uploadImageHandler({
          userId: 'user-1',
          file: createFile(),
          folder,
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            url: 'https://res.cloudinary.com/demo/image.png',
            publicId: 'articles/user-1/image',
          });
        }
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
          expect.stringMatching(/^data:image\/png;base64,/),
          { folder: `${folder}/user-1`, resource_type: 'image' },
        );
      },
    );
  });

  describe('異常系', () => {
    it('許可されていないフォルダの場合はアップロードしない', async () => {
      const result = await uploadImageHandler({
        userId: 'user-1',
        file: createFile(),
        folder: 'other-folder',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('アップロード先が不正です');
      }
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('フォルダ未指定の場合はアップロードしない', async () => {
      const result = await uploadImageHandler({
        userId: 'user-1',
        file: createFile(),
        folder: null,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('アップロード先が不正です');
      }
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('ファイル未指定の場合はアップロードしない', async () => {
      const result = await uploadImageHandler({
        userId: 'user-1',
        file: null,
        folder: 'articles',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('ファイルが選択されていません');
      }
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });
  });
});
