import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST: パスワードを更新
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { message: '無効なリクエストです' },
        { status: 400 },
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { message: 'パスワードを入力してください' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'パスワードは8文字以上で入力してください' },
        { status: 400 },
      );
    }

    if (password.length > 50) {
      return NextResponse.json(
        { message: 'パスワードは50文字以内で入力してください' },
        { status: 400 },
      );
    }

    // トークンの検証
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        {
          message:
            '無効または期限切れのリンクです。再度パスワードリセットをリクエストしてください。',
        },
        { status: 400 },
      );
    }

    // トークンの有効期限チェック
    if (new Date() > resetToken.expires) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        {
          message:
            'リンクの有効期限が切れています。再度パスワードリセットをリクエストしてください。',
        },
        { status: 400 },
      );
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりませんでした' },
        { status: 400 },
      );
    }

    // パスワードをハッシュ化して更新
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 使用済みトークンを削除
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });

    return NextResponse.json({
      message:
        'パスワードを変更しました。新しいパスワードでログインしてください。',
    });
  } catch (error) {
    console.error('パスワードリセットエラー:', error);
    return NextResponse.json(
      { message: 'エラーが発生しました。しばらく経ってからお試しください。' },
      { status: 500 },
    );
  }
}

// GET: トークンの有効性を確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'トークンが指定されていません' },
        { status: 400 },
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, message: '無効なリンクです' },
        { status: 400 },
      );
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json(
        { valid: false, message: 'リンクの有効期限が切れています' },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('トークン検証エラー:', error);
    return NextResponse.json(
      { valid: false, message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
}
