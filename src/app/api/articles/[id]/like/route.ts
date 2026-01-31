import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notification';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    if (article.authorId === userId) {
      return NextResponse.json(
        { message: '自分の記事にはいいねできません' },
        { status: 400 },
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
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

    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          articleId: id,
        },
      }),
      prisma.article.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    await createNotification({
      type: 'like',
      userId: article.authorId,
      senderId: userId,
      articleId: id,
    });

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
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

    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_articleId: {
            userId,
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
