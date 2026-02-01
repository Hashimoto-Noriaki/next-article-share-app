/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';

// Prisma をモック
jest.mock('@/lib/prisma', () => ({
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

import { prisma } from '@/lib/prisma';

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  describe('正常系', () => {
    it('新規ユーザーを登録できる', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'テストユーザー',
        email: 'test@example.com',
      });

      const request = createRequest({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('登録が完了しました');
      expect(data.user.email).toBe('test@example.com');
    });
  });

  describe('異常系', () => {
    it('既存のメールアドレスで登録しようとすると400エラー', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      const request = createRequest({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('このメールアドレスは既に登録されています');
    });

    it('名前が空だとバリデーションエラー', async () => {
      const request = createRequest({
        name: '',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
    });

    it('メールアドレスが不正だとバリデーションエラー', async () => {
      const request = createRequest({
        name: 'テストユーザー',
        email: 'invalid-email',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
    });

    it('パスワードが短すぎるとバリデーションエラー', async () => {
      const request = createRequest({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: '123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
    });
  });
});
