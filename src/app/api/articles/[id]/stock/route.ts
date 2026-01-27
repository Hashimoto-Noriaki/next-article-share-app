import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// ストックする
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 認証チェック
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
    }

    // 記事の存在確認
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      );
    }

    // 既にストック済みかチェック
    const existingStock = await prisma.stock.findUnique({
      where: {
        userId_articleId: {
          userId: payload.userId,
          articleId: id,
        },
      },
    });

    if (existingStock) {
      return NextResponse.json(
        { message: '既にストック済みです' },
        { status: 400 },
      );
    }

    // ストック作成
    await prisma.stock.create({
      data: {
        userId: payload.userId,
        articleId: id,
      },
    });

    return NextResponse.json({
      message: 'ストックしました',
    });
  } catch (error) {
    console.error('ストックエラー:', error);
    return NextResponse.json(
      { message: 'ストックに失敗しました' },
      { status: 500 },
    );
  }
}

// ストック解除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 認証チェック
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: '認証が無効です' }, { status: 401 });
    }

    // ストックの存在確認
    const existingStock = await prisma.stock.findUnique({
      where: {
        userId_articleId: {
          userId: payload.userId,
          articleId: id,
        },
      },
    });

    if (!existingStock) {
      return NextResponse.json(
        { message: 'ストックしていません' },
        { status: 400 },
      );
    }

    // ストック削除
    await prisma.stock.delete({
      where: {
        userId_articleId: {
          userId: payload.userId,
          articleId: id,
        },
      },
    });

    return NextResponse.json({
      message: 'ストックを解除しました',
    });
  } catch (error) {
    console.error('ストック解除エラー:', error);
    return NextResponse.json(
      { message: 'ストック解除に失敗しました' },
      { status: 500 },
    );
  }
}
