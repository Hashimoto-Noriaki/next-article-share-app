import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/shared/lib/validations/auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // 重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'このメールアドレスは既に登録されています' },
        { status: 400 },
      );
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // ユーザー作成のみ。ログインはクライアント側で signIn() を呼ぶ
    return NextResponse.json(
      {
        message: '登録が完了しました',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'バリデーションエラー', errors: error.issues },
        { status: 400 },
      );
    }

    console.error('登録エラー:', error);
    return NextResponse.json(
      { message: '登録に失敗しました' },
      { status: 500 },
    );
  }
}
