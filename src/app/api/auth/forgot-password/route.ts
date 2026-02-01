import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/external/email';
import crypto from 'crypto';

// トークンの有効期限（1時間）
const TOKEN_EXPIRY_HOURS = 1;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'メールアドレスを入力してください' },
        { status: 400 },
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: '有効なメールアドレスを入力してください' },
        { status: 400 },
      );
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // ユーザーが存在し、パスワードが設定されている場合のみ処理
    if (user && user.password) {
      // 既存のトークンを削除
      await prisma.passwordResetToken.deleteMany({
        where: { email: email.toLowerCase() },
      });

      // 新しいトークンを生成
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(
        Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
      );

      // トークンをDBに保存
      await prisma.passwordResetToken.create({
        data: {
          email: email.toLowerCase(),
          token,
          expires,
        },
      });

      // メール送信
      const result = await sendPasswordResetEmail({
        email: email.toLowerCase(),
        token,
      });

      if (!result.success) {
        console.error('パスワードリセットメール送信失敗:', result.error);
      }
    }

    // セキュリティのため、ユーザーの存在有無に関わらず同じレスポンス
    return NextResponse.json({
      message:
        '登録されているメールアドレスの場合、パスワードリセットのメールを送信しました。',
    });
  } catch (error) {
    console.error('パスワードリセットリクエストエラー:', error);
    return NextResponse.json(
      { message: 'エラーが発生しました。しばらく経ってからお試しください。' },
      { status: 500 },
    );
  }
}
