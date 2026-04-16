'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { InputForm } from '@/shared/components/atoms/InputForm';
import { Button } from '@/shared/components/atoms/Button';
import { OAuthButton } from '@/shared/components/atoms/OAuthButton';
import { signupSchema, SignUpInput } from '@/external/dto/auth';
import { signupAction } from '@/features/auth/actions/auth.action';
import styles from './SignUpPage.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setServerError('');

    const result = await signupAction(data);

    if (!result.success) {
      setServerError(result.error || '登録に失敗しました');
      return;
    }

    const signInResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setServerError('登録は完了しましたが、ログインに失敗しました');
      router.push('/login');
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
        <h2 className="text-xl text-white font-bold mt-3">新規登録</h2>

        {serverError && (
          <div className={styles.errorMessage}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            <p className="font-bold mb-3">名前</p>
            <InputForm
              type="text"
              placeholder="例)山田太郎(ニックネーム可)"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
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
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? '登録中...' : '新規登録'}
          </Button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-white/50" />
          <span className="text-white text-sm">または</span>
          <hr className="flex-1 border-white/50" />
        </div>

        <div className="flex flex-col gap-3">
          <OAuthButton provider="github" mode="signup" />
          <OAuthButton provider="google" mode="signup" />
        </div>
        <Link href="/login" className={styles.link}>
          ログインはこちら
        </Link>
      </div>
    </div>
  );
}
