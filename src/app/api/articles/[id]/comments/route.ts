import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// コメント一覧取得
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

// コメント投稿
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
        userId: payload.userId,
        articleId: id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
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
