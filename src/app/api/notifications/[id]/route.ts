import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const { id } = await params;

    // 自分の通知かどうか確認
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { message: '通知が見つかりません' },
        { status: 404 },
      );
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ message: '既読にしました' });
  } catch (error) {
    console.error('既読更新エラー:', error);
    return NextResponse.json(
      { message: '既読の更新に失敗しました' },
      { status: 500 },
    );
  }
}
