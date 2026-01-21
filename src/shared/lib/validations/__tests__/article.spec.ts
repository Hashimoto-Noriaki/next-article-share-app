import { createArticleSchema } from '../article';

describe('createArticleSchema', () => {
  describe('title', () => {
    it('空の場合はエラー', () => {
      const result = createArticleSchema.safeParse({
        title: '',
        content: '本文',
        tags: ['tag1'],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'タイトルを入力してください',
        );
      }
    });

    it('100文字を超える場合はエラー', () => {
      const result = createArticleSchema.safeParse({
        title: 'a'.repeat(101),
        content: '本文',
        tags: ['tag1'],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'タイトルは100文字以内にしてください',
        );
      }
    });

    it('100文字以内なら成功', () => {
      const result = createArticleSchema.safeParse({
        title: 'a'.repeat(100),
        content: '本文',
        tags: ['tag1'],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('content', () => {
    it('空の場合はエラー', () => {
      const result = createArticleSchema.safeParse({
        title: 'タイトル',
        content: '',
        tags: ['tag1'],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('本文を入力してください');
      }
    });
  });

  describe('tags', () => {
    it('空配列の場合はエラー', () => {
      const result = createArticleSchema.safeParse({
        title: 'タイトル',
        content: '本文',
        tags: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'タグは1つ以上指定してください',
        );
      }
    });

    it('6つ以上の場合はエラー', () => {
      const result = createArticleSchema.safeParse({
        title: 'タイトル',
        content: '本文',
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'タグは5つ以内にしてください',
        );
      }
    });

    it('5つ以内なら成功', () => {
      const result = createArticleSchema.safeParse({
        title: 'タイトル',
        content: '本文',
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = createArticleSchema.safeParse({
        title: 'テスト記事',
        content: 'これは本文です',
        tags: ['React', 'TypeScript'],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          title: 'テスト記事',
          content: 'これは本文です',
          tags: ['React', 'TypeScript'],
          isDraft: false,
        });
      }
    });
  });
});
