import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { createArticleSchema } from '@/shared/lib/validations/article';
import {
  draftArticleSchema,
  DRAFT_LIMIT,
} from '@/shared/lib/validations/draft';
import { z } from 'zod';

const PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * PER_PAGE;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { isDraft: false },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true },
          },
        },
        skip,
        take: PER_PAGE,
      }),
      prisma.article.count({
        where: { isDraft: false },
      }),
    ]);

    return NextResponse.json({
      articles,
      totalPages: Math.ceil(total / PER_PAGE),
      currentPage: page,
    });
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json(
      { message: '記事の取得に失敗しました' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
    }

    const body = await request.json();

    // 下書きの場合、上限チェック
    if (body.isDraft) {
      const draftCount = await prisma.article.count({
        where: {
          authorId: payload.userId,
          isDraft: true,
        },
      });

      if (draftCount >= DRAFT_LIMIT) {
        return NextResponse.json(
          {
            message: `下書きが上限（${DRAFT_LIMIT}件）になりました。この機会に投稿してみませんか？`,
          },
          { status: 400 },
        );
      }
    }

    const schema = body.isDraft ? draftArticleSchema : createArticleSchema;
    const validatedData = schema.parse(body);

    const article = await prisma.article.create({
      data: {
        title: validatedData.title || '',
        content: validatedData.content || '',
        tags: validatedData.tags || [],
        isDraft: validatedData.isDraft ?? false,
        authorId: payload.userId,
      },
    });

    const message = validatedData.isDraft
      ? '下書きを保存しました'
      : '記事を投稿しました';

    return NextResponse.json({ message, article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'バリデーションエラー', errors: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: '記事の投稿に失敗しました' },
      { status: 500 },
    );
  }
}
