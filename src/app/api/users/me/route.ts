import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(10, '名前は10文字以内です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

// ユーザー情報取得
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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return NextResponse.json(
      { message: 'ユーザー情報の取得に失敗しました' },
      { status: 500 },
    );
  }
}

// ユーザー情報更新
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { message: 'このメールアドレスは既に使用されています' },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name: validatedData.name,
        email: validatedData.email,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({
      message: 'ユーザー情報を更新しました',
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'バリデーションエラー', errors: error.issues },
        { status: 400 },
      );
    }

    console.error('ユーザー更新エラー:', error);
    return NextResponse.json(
      { message: 'ユーザー情報の更新に失敗しました' },
      { status: 500 },
    );
  }
}
