import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
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

    const stocks = await prisma.stock.findMany({
      where: {
        userId: payload.userId,
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

    // 記事データのみ返す
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
