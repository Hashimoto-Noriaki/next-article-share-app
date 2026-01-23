import { updateUserSchema } from '../user';

describe('updateUserSchema', () => {
  describe('name', () => {
    it('空の場合はエラー', () => {
      const result = updateUserSchema.safeParse({
        name: '',
        email: 'test@example.com',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('名前を入力してください');
      }
    });

    it('10文字を超える場合はエラー', () => {
      const result = updateUserSchema.safeParse({
        name: 'a'.repeat(11),
        email: 'test@example.com',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '名前は10文字以内にしてください',
        );
      }
    });

    it('10文字以内なら成功', () => {
      const result = updateUserSchema.safeParse({
        name: 'a'.repeat(10),
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('email', () => {
    it('空の場合はエラー', () => {
      const result = updateUserSchema.safeParse({
        name: 'テスト',
        email: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'メールアドレスを入力してください',
        );
      }
    });

    it('無効な形式の場合はエラー', () => {
      const result = updateUserSchema.safeParse({
        name: 'テスト',
        email: 'invalid-email',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効なメールアドレスを入力してください',
        );
      }
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = updateUserSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          name: 'テスト',
          email: 'test@example.com',
        });
      }
    });
  });
});
