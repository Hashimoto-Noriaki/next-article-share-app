import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');

    if (!q.trim()) {
      return NextResponse.json({ articles: [], totalPages: 0, currentPage: 1 });
    }

    const skip = (page - 1) * PER_PAGE;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
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
        skip,
        take: PER_PAGE,
      }),
      prisma.article.count({
        where: {
          isDraft: false,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { tags: { has: q } },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      articles,
      totalPages: Math.ceil(total / PER_PAGE),
      currentPage: page,
    });
  } catch (error) {
    console.error('検索エラー:', error);
    return NextResponse.json(
      { message: '検索に失敗しました' },
      { status: 500 },
    );
  }
}
