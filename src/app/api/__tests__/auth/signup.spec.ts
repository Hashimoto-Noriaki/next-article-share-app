/**
 * @jest-environment node
 */
import { signupHandler } from '@/external/handler/auth/mutation.server';

// Prisma をモック
jest.mock('@/external/repository/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// bcryptjs をモック
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

import { prisma } from '@/external/repository/client';

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

    it('名前が空だとバリデーションエラー', async () => {
      const result = await signupHandler({
        name: '',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'errors' in result && result.errors != null) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('メールアドレスが不正だとバリデーションエラー', async () => {
      const result = await signupHandler({
        name: 'テストユーザー',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'errors' in result && result.errors != null) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('パスワードが短すぎるとバリデーションエラー', async () => {
      const result = await signupHandler({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: '123',
      });

      expect(result.success).toBe(false);
      if (!result.success && 'errors' in result && result.errors != null) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
