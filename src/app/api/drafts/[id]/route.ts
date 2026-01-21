import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const draft = await prisma.article.findUnique({
      where: { id },
    });

    if (!draft) {
      return NextResponse.json(
        { message: '下書きが見つかりません' },
        { status: 404 },
      );
    }

    if (draft.authorId !== payload.userId) {
      return NextResponse.json(
        { message: '権限がありません' },
        { status: 403 },
      );
    }

    if (!draft.isDraft) {
      return NextResponse.json(
        { message: '公開済みの記事は削除できません' },
        { status: 400 },
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: '下書きを削除しました' });
  } catch (error) {
    console.error('下書き削除エラー:', error);
    return NextResponse.json(
      { message: '下書きの削除に失敗しました' },
      { status: 500 },
    );
  }
}
