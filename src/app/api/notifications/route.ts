import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
        article: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('通知取得エラー:', error);
    return NextResponse.json(
      { message: '通知の取得に失敗しました' },
      { status: 500 },
    );
  }
}

export async function PUT() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ message: '全て既読にしました' });
  } catch (error) {
    console.error('既読更新エラー:', error);
    return NextResponse.json(
      { message: '既読の更新に失敗しました' },
      { status: 500 },
    );
  }
}
