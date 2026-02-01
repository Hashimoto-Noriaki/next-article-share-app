import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

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

    const existingStock = await prisma.stock.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });

    if (existingStock) {
      return NextResponse.json(
        { message: '既にストック済みです' },
        { status: 400 },
      );
    }

    await prisma.stock.create({
      data: {
        userId,
        articleId: id,
      },
    });

    return NextResponse.json({
      message: 'ストックしました',
    });
  } catch (error) {
    console.error('ストックエラー:', error);
    return NextResponse.json(
      { message: 'ストックに失敗しました' },
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

    const existingStock = await prisma.stock.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });

    if (!existingStock) {
      return NextResponse.json(
        { message: 'ストックしていません' },
        { status: 400 },
      );
    }

    await prisma.stock.delete({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });

    return NextResponse.json({
      message: 'ストックを解除しました',
    });
  } catch (error) {
    console.error('ストック解除エラー:', error);
    return NextResponse.json(
      { message: 'ストック解除に失敗しました' },
      { status: 500 },
    );
  }
}
