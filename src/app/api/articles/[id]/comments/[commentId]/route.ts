import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { commentId } = await params;

    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { message: 'コメント内容を入力してください' },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: 'コメントが見つかりません' },
        { status: 404 },
      );
    }

    if (comment.userId !== userId) {
      return NextResponse.json(
        { message: '自分のコメントのみ編集できます' },
        { status: 403 },
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('コメント編集エラー:', error);
    return NextResponse.json(
      { message: 'コメントの編集に失敗しました' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { commentId } = await params;

    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: 'コメントが見つかりません' },
        { status: 404 },
      );
    }

    if (comment.userId !== userId) {
      return NextResponse.json(
        { message: '自分のコメントのみ削除できます' },
        { status: 403 },
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: 'コメントを削除しました' });
  } catch (error) {
    console.error('コメント削除エラー:', error);
    return NextResponse.json(
      { message: 'コメントの削除に失敗しました' },
      { status: 500 },
    );
  }
}
