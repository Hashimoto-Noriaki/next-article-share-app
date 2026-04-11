'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import { OAuthButton } from '@/shared/components/atoms/OAuthButton';
import { loginSchema, LoginInput } from '@/external/dto/auth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // メール/パスワードでログイン
  const onSubmit = async (data: LoginInput) => {
    setServerError('');

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError('メールアドレスまたはパスワードが間違っています');
      return;
    }

    router.push('/articles');
    router.refresh();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">ログイン</h2>

        {serverError && (
          <div className={styles.errorMessage}>{serverError}</div>
        )}

        {/* メール/パスワードフォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            <p className="font-bold mb-3">メールアドレス</p>
            <InputForm
              type="email"
              placeholder="メールアドレス"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <p className="font-bold mb-3">パスワード</p>
            <InputForm
              type="password"
              placeholder="パスワード"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>

        {/* 区切り線 */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-white/50" />
          <span className="text-white text-sm">または</span>
          <hr className="flex-1 border-white/50" />
        </div>

        {/* GitHub と Google のボタン */}
        <div className="flex flex-col gap-3">
          <OAuthButton provider="github" mode="login" />
          <OAuthButton provider="google" mode="login" />
        </div>

        <Link href="/forgot-password" className={styles.link}>
          パスワードをお忘れの方
        </Link>

        <Link href="/signup" className={styles.link}>
          新規登録はこちら
        </Link>
      </div>
    </div>
  );
}
