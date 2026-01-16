import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: '認証が必要です' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: '認証が無効です' },
        { status: 401 }
      );
    }

    const drafts = await prisma.article.findMany({
      where: {
        authorId: payload.userId,
        isDraft: true,
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
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
      { status: 500 }
    );
  }
}