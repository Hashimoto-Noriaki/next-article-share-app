import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { userRepository } from '@/external/repository/user';
import { passwordResetTokenRepository } from '@/external/repository/auth';
import { sendPasswordResetEmail } from '@/external/email';
import { signupSchema } from '@/external/dto/auth';

const TOKEN_EXPIRY_HOURS = 1;

export async function signupHandler(body: unknown) {
  // バリデーション
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.issues };
  }

  const { name, email, password } = parsed.data;

  // 重複チェック
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return {
      success: false as const,
      error: 'このメールアドレスは既に登録されています',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    success: true as const,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function forgotPasswordHandler({ email }: { email: string }) {
  const normalizedEmail = email.toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      success: false as const,
      error: '有効なメールアドレスを入力してください',
    };
  }

  const user = await userRepository.findByEmail(normalizedEmail);

  // ユーザーが存在しpaPasswordが設定されている場合のみ処理
  if (user && user.password) {
    await passwordResetTokenRepository.deleteByEmail(normalizedEmail);

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await passwordResetTokenRepository.create({
      email: normalizedEmail,
      token,
      expires,
    });

    await sendPasswordResetEmail({ email: normalizedEmail, token });
  }

  // セキュリティのため存在有無に関わらず同じレスポンス
  return { success: true as const };
}

export async function validateResetTokenHandler({ token }: { token: string }) {
  const resetToken = await passwordResetTokenRepository.findByToken(token);

  if (!resetToken) {
    return { valid: false as const, error: '無効なリンクです' };
  }
  if (new Date() > resetToken.expires) {
    return { valid: false as const, error: 'リンクの有効期限が切れています' };
  }

  return { valid: true as const };
}

export async function resetPasswordHandler({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  if (password.length < 8) {
    return {
      success: false as const,
      error: 'パスワードは8文字以上で入力してください',
    };
  }
  if (password.length > 50) {
    return {
      success: false as const,
      error: 'パスワードは50文字以内で入力してください',
    };
  }

  const resetToken = await passwordResetTokenRepository.findByToken(token);
  if (!resetToken) {
    return {
      success: false as const,
      error:
        '無効または期限切れのリンクです。再度パスワードリセットをリクエストしてください。',
    };
  }

  if (new Date() > resetToken.expires) {
    await passwordResetTokenRepository.deleteById(resetToken.id);
    return {
      success: false as const,
      error:
        'リンクの有効期限が切れています。再度パスワードリセットをリクエストしてください。',
    };
  }

  const user = await userRepository.findByEmail(resetToken.email);
  if (!user) {
    return { success: false as const, error: 'ユーザーが見つかりませんでした' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await userRepository.updatePassword(user.id, hashedPassword);
  await passwordResetTokenRepository.deleteByEmail(resetToken.email);

  return { success: true as const };
}
