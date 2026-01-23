import { signupSchema, loginSchema } from '../auth';

describe('signupSchema', () => {
  describe('name', () => {
    it('空の場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: '',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('名前を入力してください');
      }
    });

    it('10文字を超える場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: 'a'.repeat(11),
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '名前は10文字以内にしてください',
        );
      }
    });

    it('10文字以内なら成功', () => {
      const result = signupSchema.safeParse({
        name: 'a'.repeat(10),
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('email', () => {
    it('空の場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: '',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'メールアドレスを入力してください',
        );
      }
    });

    it('無効な形式の場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効なメールアドレスを入力してください',
        );
      }
    });
  });

  describe('password', () => {
    it('空の場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
        password: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードを入力してください',
        );
      }
    });

    it('8文字未満の場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
        password: '1234567',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードは8文字以上にしてください',
        );
      }
    });

    it('50文字を超える場合はエラー', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
        password: 'a'.repeat(51),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードは50文字以内にしてください',
        );
      }
    });

    it('8文字以上50文字以内なら成功', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          name: 'テスト',
          email: 'test@example.com',
          password: 'password123',
        });
      }
    });
  });
});

describe('loginSchema', () => {
  describe('email', () => {
    it('空の場合はエラー', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'メールアドレスを入力してください',
        );
      }
    });

    it('無効な形式の場合はエラー', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効なメールアドレスを入力してください',
        );
      }
    });
  });

  describe('password', () => {
    it('空の場合はエラー', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードを入力してください',
        );
      }
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: 'test@example.com',
          password: 'password123',
        });
      }
    });
  });
});
