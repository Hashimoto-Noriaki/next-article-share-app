import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

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

    if (draft.authorId !== userId) {
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
