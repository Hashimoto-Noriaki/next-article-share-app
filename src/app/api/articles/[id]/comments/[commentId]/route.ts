import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// コメント編集
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { commentId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
    }

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

    // 自分のコメントのみ編集可能
    if (comment.userId !== payload.userId) {
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

// コメント削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { commentId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
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

    // 自分のコメントのみ削除可能
    if (comment.userId !== payload.userId) {
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
