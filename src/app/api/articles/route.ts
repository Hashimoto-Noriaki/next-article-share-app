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
