import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q.trim()) {
      return NextResponse.json([]);
    }

    const articles = await prisma.article.findMany({
      where: {
        isDraft: false,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('検索エラー:', error);
    return NextResponse.json(
      { message: '検索に失敗しました' },
      { status: 500 },
    );
  }
}
