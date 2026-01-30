/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/login/route';

// モック
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/jwt', () => ({
  createToken: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockCreateToken = createToken as jest.MockedFunction<typeof createToken>;
const mockBcryptCompare = bcrypt.compare as jest.MockedFunction<
  typeof bcrypt.compare
>;

// ヘルパー関数
function createLoginRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/auth/login', () => {
  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('ログインに成功する', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(true);
      mockCreateToken.mockResolvedValue('jwt-token-123');

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('ログインに成功しました');
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('JWTトークンがCookieに設定される', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(true);
      mockCreateToken.mockResolvedValue('jwt-token-123');

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const cookie = response.cookies.get('token');

      expect(cookie).toBeDefined();
      expect(cookie?.value).toBe('jwt-token-123');
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.path).toBe('/');
    });

    it('createTokenにuserIdが渡される', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(true);
      mockCreateToken.mockResolvedValue('jwt-token-123');

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      await POST(request);

      expect(mockCreateToken).toHaveBeenCalledWith({ userId: mockUser.id });
    });
  });

  describe('認証エラー', () => {
    it('ユーザーが存在しない場合は401を返す', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const request = createLoginRequest({
        email: 'notfound@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe(
        'メールアドレスまたはパスワードが間違っています',
      );
    });

    it('パスワードが間違っている場合は401を返す', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(false);

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe(
        'メールアドレスまたはパスワードが間違っています',
      );
    });

    it('パスワードがnullのユーザー（OAuth登録）は401を返す', async () => {
      const oauthUser = { ...mockUser, password: null };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(oauthUser);

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe(
        'メールアドレスまたはパスワードが間違っています',
      );
      // bcrypt.compare は呼ばれない
      expect(mockBcryptCompare).not.toHaveBeenCalled();
    });
  });

  describe('バリデーションエラー', () => {
    it('メールアドレスが空の場合は400を返す', async () => {
      const request = createLoginRequest({
        email: '',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
      expect(data.errors).toBeDefined();
    });

    it('パスワードが空の場合は400を返す', async () => {
      const request = createLoginRequest({
        email: 'test@example.com',
        password: '',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
    });

    it('メールアドレスの形式が不正な場合は400を返す', async () => {
      const request = createLoginRequest({
        email: 'invalid-email',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
    });

    it('必須フィールドがない場合は400を返す', async () => {
      const request = createLoginRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('バリデーションエラー');
    });
  });

  describe('エラーハンドリング', () => {
    it('DBエラー時は500を返す', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('DB Connection Error'),
      );

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('ログインに失敗しました');
    });

    it('JWT生成エラー時は500を返す', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(true);
      mockCreateToken.mockRejectedValue(new Error('JWT Error'));

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('ログインに失敗しました');
    });
  });

  describe('セキュリティ', () => {
    it('存在しないユーザーと間違ったパスワードで同じエラーメッセージを返す', async () => {
      // ユーザーが存在しない場合
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const request1 = createLoginRequest({
        email: 'notfound@example.com',
        password: 'password123',
      });
      const response1 = await POST(request1);
      const data1 = await response1.json();

      // パスワードが間違っている場合
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(false);
      const request2 = createLoginRequest({
        email: 'test@example.com',
        password: 'wrong-password',
      });
      const response2 = await POST(request2);
      const data2 = await response2.json();

      // 同じメッセージであることを確認（ユーザー列挙攻撃対策）
      expect(data1.message).toBe(data2.message);
    });

    it('レスポンスにパスワードが含まれない', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockBcryptCompare as jest.Mock).mockResolvedValue(true);
      mockCreateToken.mockResolvedValue('jwt-token-123');

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.user).not.toHaveProperty('password');
    });
  });
});
