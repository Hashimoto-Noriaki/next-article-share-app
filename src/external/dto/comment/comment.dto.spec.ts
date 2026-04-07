import { createCommentSchema, updateCommentSchema } from './comment.dto';

describe('createCommentSchema', () => {
  describe('content', () => {
    it('空の場合はエラー', () => {
      const result = createCommentSchema.safeParse({
        content: '',
        articleId: 'article-1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('コメント内容を入力してください');
      }
    });

    it('1000文字を超える場合はエラー', () => {
      const result = createCommentSchema.safeParse({
        content: 'a'.repeat(1001),
        articleId: 'article-1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('コメントは1000文字以内にしてください');
      }
    });
  });

  describe('articleId', () => {
    it('空の場合はエラー', () => {
      const result = createCommentSchema.safeParse({
        content: 'コメント内容',
        articleId: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('記事IDが必要です');
      }
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = createCommentSchema.safeParse({
        content: 'コメント内容',
        articleId: 'article-1',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          content: 'コメント内容',
          articleId: 'article-1',
        });
      }
    });
  });
});

describe('updateCommentSchema', () => {
  describe('content', () => {
    it('空の場合はエラー', () => {
      const result = updateCommentSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('コメント内容を入力してください');
      }
    });

    it('1000文字を超える場合はエラー', () => {
      const result = updateCommentSchema.safeParse({ content: 'a'.repeat(1001) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('コメントは1000文字以内にしてください');
      }
    });
  });

  describe('正常系', () => {
    it('有効な値なら成功', () => {
      const result = updateCommentSchema.safeParse({ content: '更新後のコメント' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ content: '更新後のコメント' });
      }
    });
  });
});
