import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { createArticleSchema } from '@/shared/lib/validations/article';
import { draftArticleSchema } from '@/shared/lib/validations/article';
import { z } from 'zod';

// 記事詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json(
      { message: '記事の取得に失敗しました' },
      { status: 500 },
    );
  }
}

// 記事編集
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 認証チェック
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
    }

    // 記事の存在確認と権限チェック
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    if (existingArticle.authorId !== payload.userId) {
      return NextResponse.json(
        { message: '編集権限がありません' },
        { status: 403 },
      );
    }

    // バリデーション
    const body = await request.json();
    const schema = body.isDraft ? draftArticleSchema : createArticleSchema;
    const validatedData = schema.parse(body);

    // 記事更新
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: validatedData.title || '',
        content: validatedData.content || '',
        tags: validatedData.tags || [],
        isDraft: validatedData.isDraft ?? false,
      },
    });

    const message = validatedData.isDraft
      ? '下書きを保存しました'
      : '記事を公開しました';

    return NextResponse.json({ message, article });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'バリデーションエラー', errors: error.issues },
        { status: 400 },
      );
    }

    console.error('記事更新エラー:', error);
    return NextResponse.json(
      { message: '記事の更新に失敗しました' },
      { status: 500 },
    );
  }
}

// 記事削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 認証チェック
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
    }
    // 記事の存在確認と権限チェック
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    if (existingArticle.authorId !== payload.userId) {
      return NextResponse.json(
        { message: '削除権限がありません' },
        { status: 403 },
      );
    }

    // 記事削除
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      message: '記事を削除しました',
    });
  } catch (error) {
    console.error('記事削除エラー:', error);
    return NextResponse.json(
      { message: '記事の削除に失敗しました' },
      { status: 500 },
    );
  }
}
