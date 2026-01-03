import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        articles: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            tags: true,
            likeCount: true,
            createdAt: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return NextResponse.json(
      { message: 'ユーザー情報の取得に失敗しました' },
      { status: 500 },
    );
  }
}
