import { draftArticleSchema } from '../draft';

describe('draftArticleSchema', () => {
  describe('title', () => {
    it('空でも成功', () => {
      const result = draftArticleSchema.safeParse({
        title: '',
        content: '',
        tags: [],
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });

    it('未指定でも成功', () => {
      const result = draftArticleSchema.safeParse({
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });

    it('100文字を超える場合はエラー', () => {
      const result = draftArticleSchema.safeParse({
        title: 'a'.repeat(101),
        isDraft: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('content', () => {
    it('空でも成功', () => {
      const result = draftArticleSchema.safeParse({
        content: '',
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });

    it('未指定でも成功', () => {
      const result = draftArticleSchema.safeParse({
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('tags', () => {
    it('空配列でも成功', () => {
      const result = draftArticleSchema.safeParse({
        tags: [],
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });

    it('未指定でも成功', () => {
      const result = draftArticleSchema.safeParse({
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });

    it('6つ以上の場合はエラー', () => {
      const result = draftArticleSchema.safeParse({
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
        isDraft: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('isDraft', () => {
    it('trueなら成功', () => {
      const result = draftArticleSchema.safeParse({
        isDraft: true,
      });

      expect(result.success).toBe(true);
    });

    it('falseならエラー', () => {
      const result = draftArticleSchema.safeParse({
        isDraft: false,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('正常系', () => {
    it('最小限のデータで成功', () => {
      const result = draftArticleSchema.safeParse({
        isDraft: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('');
        expect(result.data.content).toBe('');
        expect(result.data.tags).toEqual([]);
        expect(result.data.isDraft).toBe(true);
      }
    });

    it('全て入力しても成功', () => {
      const result = draftArticleSchema.safeParse({
        title: '下書きタイトル',
        content: '下書き本文',
        tags: ['draft'],
        isDraft: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          title: '下書きタイトル',
          content: '下書き本文',
          tags: ['draft'],
          isDraft: true,
        });
      }
    });
  });
});
