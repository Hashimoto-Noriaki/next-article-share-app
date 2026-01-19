import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// いいねする
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
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

    // 記事の存在確認
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    // 自分の記事にはいいねできない
    if (article.authorId === payload.userId) {
      return NextResponse.json(
        { message: '自分の記事にはいいねできません' },
        { status: 400 },
      );
    }

    // 既にいいね済みかチェック
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: payload.userId,
          articleId: id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { message: '既にいいね済みです' },
        { status: 400 },
      );
    }

    // いいね作成 & likeCount 更新
    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId: payload.userId,
          articleId: id,
        },
      }),
      prisma.article.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      message: 'いいねしました',
    });
  } catch (error) {
    console.error('いいねエラー:', error);
    return NextResponse.json(
      { message: 'いいねに失敗しました' },
      { status: 500 },
    );
  }
}

// いいね解除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
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

    // いいねの存在確認
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: payload.userId,
          articleId: id,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        { message: 'いいねしていません' },
        { status: 400 },
      );
    }

    // いいね削除 & likeCount 更新
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_articleId: {
            userId: payload.userId,
            articleId: id,
          },
        },
      }),
      prisma.article.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({
      message: 'いいねを解除しました',
    });
  } catch (error) {
    console.error('いいね解除エラー:', error);
    return NextResponse.json(
      { message: 'いいね解除に失敗しました' },
      { status: 500 },
    );
  }
}
