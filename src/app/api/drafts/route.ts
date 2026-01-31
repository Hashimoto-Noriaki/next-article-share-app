import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const drafts = await prisma.article.findMany({
      where: {
        authorId: userId,
        isDraft: true,
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(drafts);
  } catch (error) {
    console.error('下書き取得エラー:', error);
    return NextResponse.json(
      { message: '下書きの取得に失敗しました' },
      { status: 500 },
    );
  }
}
