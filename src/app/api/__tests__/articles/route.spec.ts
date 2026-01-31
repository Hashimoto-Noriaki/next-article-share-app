/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/articles/route';

// モック
jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/jwt', () => ({
  verifyToken: jest.fn(),
}));

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

const mockPrisma = jest.mocked(prisma);
const mockCookies = jest.mocked(cookies);
const mockVerifyToken = jest.mocked(verifyToken);

// ヘルパー関数
function createRequest(
  path: string,
  options?: { method?: string; body?: unknown },
): NextRequest {
  const url = new URL(path, 'http://localhost:3000');

  if (options?.body) {
    return new NextRequest(url, {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options.body),
    });
  }

  return new NextRequest(url, {
    method: options?.method || 'GET',
  });
}

describe('/api/articles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    const mockArticles = [
      {
        id: '1',
        title: '記事1',
        content: '内容1',
        tags: ['tag1'],
        isDraft: false,
        authorId: 'user1',
        createdAt: new Date(),
        author: { name: 'User 1' },
      },
      {
        id: '2',
        title: '記事2',
        content: '内容2',
        tags: ['tag2'],
        isDraft: false,
        authorId: 'user2',
        createdAt: new Date(),
        author: { name: 'User 2' },
      },
    ];

    it('記事一覧を取得できる', async () => {
      (mockPrisma.article.findMany as jest.Mock).mockResolvedValue(
        mockArticles,
      );
      (mockPrisma.article.count as jest.Mock).mockResolvedValue(2);

      const request = createRequest('/api/articles');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.articles).toHaveLength(2);
      expect(data.totalPages).toBe(1);
      expect(data.currentPage).toBe(1);
    });

    it('ページネーションが動作する', async () => {
      (mockPrisma.article.findMany as jest.Mock).mockResolvedValue([
        mockArticles[0],
      ]);
      (mockPrisma.article.count as jest.Mock).mockResolvedValue(15);

      const request = createRequest('/api/articles?page=2');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentPage).toBe(2);
      expect(data.totalPages).toBe(2); // 15件 / 12件 = 2ページ

      // skip が正しく計算されているか
      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 12, // (2 - 1) * 12
          take: 12,
        }),
      );
    });

    it('isDraft: false のみ取得する', async () => {
      (mockPrisma.article.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.article.count as jest.Mock).mockResolvedValue(0);

      const request = createRequest('/api/articles');
      await GET(request);

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDraft: false },
        }),
      );
    });

    it('DBエラー時は500を返す', async () => {
      (mockPrisma.article.findMany as jest.Mock).mockRejectedValue(
        new Error('DB Error'),
      );

      const request = createRequest('/api/articles');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('記事の取得に失敗しました');
    });
  });

  describe('POST', () => {
    const mockUser = { userId: 'user123', email: 'test@example.com' };

    beforeEach(() => {
      // 認証済み状態をデフォルトでセットアップ
      mockCookies.mockResolvedValue({
        get: jest.fn().mockReturnValue({ value: 'valid-token' }),
      } as unknown as Awaited<ReturnType<typeof cookies>>);
      mockVerifyToken.mockResolvedValue(mockUser);
    });

    describe('認証', () => {
      it('トークンがない場合は401を返す', async () => {
        mockCookies.mockResolvedValue({
          get: jest.fn().mockReturnValue(undefined),
        } as unknown as Awaited<ReturnType<typeof cookies>>);

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: { title: 'テスト', content: '内容', tags: [] },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('認証が必要です');
      });

      it('無効なトークンの場合は401を返す', async () => {
        mockVerifyToken.mockResolvedValue(null);

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: { title: 'テスト', content: '内容', tags: [] },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('認証が無効です');
      });
    });

    describe('記事投稿', () => {
      it('記事を投稿できる', async () => {
        const newArticle = {
          id: 'new-id',
          title: 'テスト記事',
          content: 'テスト内容',
          tags: ['tag1', 'tag2'],
          isDraft: false,
          authorId: 'user123',
        };

        (mockPrisma.article.create as jest.Mock).mockResolvedValue(newArticle);

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: {
            title: 'テスト記事',
            content: 'テスト内容',
            tags: ['tag1', 'tag2'],
            isDraft: false,
          },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe('記事を投稿しました');
        expect(data.article).toEqual(newArticle);
      });

      it('authorIdが正しく設定される', async () => {
        (mockPrisma.article.create as jest.Mock).mockResolvedValue({ id: '1' });

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: {
            title: 'テスト記事',
            content: 'テスト内容',
            tags: ['tag1'],
            isDraft: false,
          },
        });

        await POST(request);

        expect(mockPrisma.article.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            authorId: 'user123',
          }),
        });
      });
    });

    describe('下書き保存', () => {
      it('下書きを保存できる', async () => {
        (mockPrisma.article.count as jest.Mock).mockResolvedValue(0);
        (mockPrisma.article.create as jest.Mock).mockResolvedValue({
          id: 'draft-id',
          isDraft: true,
        });

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: {
            title: '下書きタイトル',
            content: '',
            tags: [],
            isDraft: true,
          },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe('下書きを保存しました');
      });

      it('下書き上限に達している場合は400を返す', async () => {
        (mockPrisma.article.count as jest.Mock).mockResolvedValue(50); // DRAFT_LIMIT

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: {
            title: '下書き',
            content: '',
            tags: [],
            isDraft: true,
          },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toContain('下書きが上限');
      });

      it('下書きカウントはauthorIdでフィルタされる', async () => {
        (mockPrisma.article.count as jest.Mock).mockResolvedValue(0);
        (mockPrisma.article.create as jest.Mock).mockResolvedValue({ id: '1' });

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: { title: '', content: '', tags: [], isDraft: true },
        });

        await POST(request);

        expect(mockPrisma.article.count).toHaveBeenCalledWith({
          where: {
            authorId: 'user123',
            isDraft: true,
          },
        });
      });
    });

    describe('バリデーション', () => {
      it('バリデーションエラー時は400を返す', async () => {
        // 投稿時はtags最低1つ必須（createArticleSchema）
        const request = createRequest('/api/articles', {
          method: 'POST',
          body: {
            title: 'テスト記事',
            content: 'テスト内容',
            tags: [], // 空配列はエラー
            isDraft: false,
          },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe('バリデーションエラー');
        expect(data.errors).toBeDefined();
      });
    });

    describe('エラーハンドリング', () => {
      it('DB作成エラー時は500を返す', async () => {
        (mockPrisma.article.create as jest.Mock).mockRejectedValue(
          new Error('DB Error'),
        );

        const request = createRequest('/api/articles', {
          method: 'POST',
          body: {
            title: 'テスト記事',
            content: 'テスト内容',
            tags: ['tag1'],
            isDraft: false,
          },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.message).toBe('記事の投稿に失敗しました');
      });
    });
  });
});
