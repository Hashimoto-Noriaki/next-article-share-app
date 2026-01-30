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

    const notifications = await prisma.notification.findMany({
      where: { userId: payload.userId },
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

// 全て既読にする
export async function PUT() {
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

    await prisma.notification.updateMany({
      where: {
        userId: payload.userId,
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
