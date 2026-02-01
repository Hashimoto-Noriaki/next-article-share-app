import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notification';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const comments = await prisma.comment.findMany({
      where: { articleId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return NextResponse.json(
      { message: 'コメントの取得に失敗しました' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        articleId: id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    await createNotification({
      type: 'comment',
      userId: article.authorId,
      senderId: userId,
      articleId: id,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('コメント投稿エラー:', error);
    return NextResponse.json(
      { message: 'コメントの投稿に失敗しました' },
      { status: 500 },
    );
  }
}
