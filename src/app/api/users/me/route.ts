import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(10, '名前は10文字以内です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true },
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

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { message: 'このメールアドレスは既に使用されています' },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
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

export async function DELETE() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: '退会が完了しました',
    });
  } catch (error) {
    console.error('退会エラー:', error);
    return NextResponse.json(
      { message: '退会に失敗しました' },
      { status: 500 },
    );
  }
}
