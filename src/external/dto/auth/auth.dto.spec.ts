import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetPasswordServerSchema,
} from './auth.dto';

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

    it('不正な形式の場合はエラー', () => {
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
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = signupSchema.safeParse({
        name: 'テスト',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
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

    it('不正な形式の場合はエラー', () => {
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
    });
  });
});

describe('forgotPasswordSchema', () => {
  describe('email', () => {
    it('空の場合はエラー', () => {
      const result = forgotPasswordSchema.safeParse({ email: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'メールアドレスを入力してください',
        );
      }
    });

    it('不正な形式の場合はエラー', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効なメールアドレスを入力してください',
        );
      }
    });
  });

  describe('正常系', () => {
    it('有効なメールアドレスなら成功', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('resetPasswordSchema', () => {
  describe('token', () => {
    it('空の場合はエラー', () => {
      const result = resetPasswordSchema.safeParse({
        token: '',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('トークンが必要です');
      }
    });
  });

  describe('password', () => {
    it('8文字未満の場合はエラー', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: '1234567',
        confirmPassword: '1234567',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードは8文字以上にしてください',
        );
      }
    });

    it('50文字を超える場合はエラー', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'a'.repeat(51),
        confirmPassword: 'a'.repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードは50文字以内にしてください',
        );
      }
    });
  });

  describe('confirmPassword', () => {
    it('passwordと一致しない場合はエラー', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'password123',
        confirmPassword: 'different123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('パスワードが一致しません');
        expect(result.error.issues[0].path).toContain('confirmPassword');
      }
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('resetPasswordServerSchema', () => {
  describe('token', () => {
    it('空の場合はエラー', () => {
      const result = resetPasswordServerSchema.safeParse({
        token: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('トークンが必要です');
      }
    });
  });

  describe('password', () => {
    it('8文字未満の場合はエラー', () => {
      const result = resetPasswordServerSchema.safeParse({
        token: 'valid-token',
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
      const result = resetPasswordServerSchema.safeParse({
        token: 'valid-token',
        password: 'a'.repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'パスワードは50文字以内にしてください',
        );
      }
    });
  });

  describe('正常系', () => {
    it('全て有効な値なら成功', () => {
      const result = resetPasswordServerSchema.safeParse({
        token: 'valid-token',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });
  });
});
