/**
 * @jest-environment node
 */
import {
  signupHandler,
  forgotPasswordHandler,
  validateResetTokenHandler,
  resetPasswordHandler,
} from '@/external/handler/auth/mutation.server';

// Prisma をモック
jest.mock('@/external/repository/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    passwordResetToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// bcryptjs をモック
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

// メール送信をモック
jest.mock('@/external/email', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

import { prisma } from '@/external/repository/client';
import { sendPasswordResetEmail } from '@/external/email';

describe('signupHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('新規ユーザーを登録できる', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'テストユーザー',
        email: 'test@example.com',
      });

      const result = await signupHandler({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.user.email).toBe('test@example.com');
      }
    });
  });

  describe('異常系', () => {
    it('既存のメールアドレスで登録しようとするとエラー', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      const result = await signupHandler({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'error' in result) {
        expect(result.error).toBe('このメールアドレスは既に登録されています');
      }
    });
  });
});

describe('forgotPasswordHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('ユーザーが存在しパスワードが設定されている場合はメールを送信する', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      (prisma.passwordResetToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 0,
      });
      (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({});

      const result = await forgotPasswordHandler({ email: 'test@example.com' });

      expect(result.success).toBe(true);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('ユーザーが存在しない場合もsuccessを返す（セキュリティのため）', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await forgotPasswordHandler({
        email: 'notfound@example.com',
      });

      expect(result.success).toBe(true);
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('パスワードが設定されていないユーザーはメールを送信しない', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: null,
      });

      const result = await forgotPasswordHandler({ email: 'test@example.com' });

      expect(result.success).toBe(true);
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('異常系', () => {
    it('不正なメールアドレスの場合はエラー', async () => {
      const result = await forgotPasswordHandler({ email: 'invalid-email' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('有効なメールアドレスを入力してください');
      }
    });
  });
});

describe('validateResetTokenHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('有効なトークンの場合はvalidを返す', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        token: 'valid-token',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      const result = await validateResetTokenHandler({ token: 'valid-token' });

      expect(result.valid).toBe(true);
    });
  });

  describe('異常系', () => {
    it('トークンが存在しない場合はエラー', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await validateResetTokenHandler({
        token: 'invalid-token',
      });

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe('無効なリンクです');
      }
    });

    it('トークンが期限切れの場合はエラー', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        token: 'expired-token',
        expires: new Date(Date.now() - 1000),
      });

      const result = await validateResetTokenHandler({
        token: 'expired-token',
      });

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe('リンクの有効期限が切れています');
      }
    });
  });
});

describe('resetPasswordHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('有効なトークンとパスワードでリセットできる', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        token: 'valid-token',
        email: 'test@example.com',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({});
      (prisma.passwordResetToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 1,
      });

      const result = await resetPasswordHandler({
        token: 'valid-token',
        password: 'newpassword123',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('異常系', () => {
    it('トークンが存在しない場合はエラー', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await resetPasswordHandler({
        token: 'invalid-token',
        password: 'newpassword123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'error' in result) {
        expect(result.error).toBe(
          '無効または期限切れのリンクです。再度パスワードリセットをリクエストしてください。',
        );
      }
    });

    it('トークンが期限切れの場合はエラー', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        token: 'expired-token',
        email: 'test@example.com',
        expires: new Date(Date.now() - 1000),
      });
      (prisma.passwordResetToken.delete as jest.Mock).mockResolvedValue({});

      const result = await resetPasswordHandler({
        token: 'expired-token',
        password: 'newpassword123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'error' in result) {
        expect(result.error).toBe(
          'リンクの有効期限が切れています。再度パスワードリセットをリクエストしてください。',
        );
      }
    });

    it('ユーザーが見つからない場合はエラー', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        token: 'valid-token',
        email: 'notfound@example.com',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await resetPasswordHandler({
        token: 'valid-token',
        password: 'newpassword123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'error' in result) {
        expect(result.error).toBe('ユーザーが見つかりませんでした');
      }
    });
  });
});
