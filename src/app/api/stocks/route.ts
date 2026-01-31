import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const stocks = await prisma.stock.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        article: {
          include: {
            author: {
              select: { name: true },
            },
          },
        },
      },
    });

    const articles = stocks.map((stock) => stock.article);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('ストック取得エラー:', error);
    return NextResponse.json(
      { message: 'ストックの取得に失敗しました' },
      { status: 500 },
    );
  }
}
