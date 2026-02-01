import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { message: '画像URLが必要です' },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { image },
    });

    return NextResponse.json({
      message: 'プロフィール画像を更新しました',
    });
  } catch (error) {
    console.error('画像更新エラー:', error);
    return NextResponse.json(
      { message: 'プロフィール画像の更新に失敗しました' },
      { status: 500 },
    );
  }
}
