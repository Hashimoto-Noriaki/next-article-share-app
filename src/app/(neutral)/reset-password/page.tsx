'use client';

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import { resetPasswordSchema, ResetPasswordInput } from '@/external/dto/auth';
import {
  validateResetTokenAction,
  resetPasswordAction,
} from '@/features/auth/actions/auth.action';
import styles from './ResetPasswordPage.module.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || '' },
  });

  const { isLoading: isValidating, data: tokenData } = useQuery({
    queryKey: ['resetToken', token],
    queryFn: async () => {
      if (!token) return { valid: false };
      return validateResetTokenAction({ token });
    },
    staleTime: Infinity,
    retry: false,
  });

  const isTokenValid = tokenData?.valid ?? false;

  const { mutate: submitReset, isPending } = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      resetPasswordAction({ token: data.token, password: data.password }),
    onSuccess: (result) => {
      if (!result.success) {
        setServerError(result.error ?? 'エラーが発生しました');
        return;
      }
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    },
    onError: () => {
      setServerError(
        'エラーが発生しました。しばらく経ってからお試しください。',
      );
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    setServerError('');
    submitReset(data);
  };

  if (isValidating) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.heading}>
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <p className="text-white mt-5">確認中...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.heading}>
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <h2 className="text-xl text-white font-bold mt-3">無効なリンク</h2>
          <div className={styles.tokenErrorMessage}>
            このパスワードリセットリンクは無効または期限切れです。
            再度パスワードリセットをリクエストしてください。
          </div>
          <Link href="/forgot-password" className="block mt-5">
            <Button variant="primary">パスワードリセットをリクエスト</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.heading}>
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <h2 className="text-xl text-white font-bold mt-3">
            パスワード変更完了
          </h2>
          <div className={styles.successMessage}>
            パスワードを変更しました。新しいパスワードでログインできます。
          </div>
          <p className="text-white text-sm mt-5">
            自動的にログインページへ移動します...
          </p>
          <Link href="/login" className={styles.link}>
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">
          新しいパスワードを設定
        </h2>
        <p className="text-white text-sm mt-3">
          安全な新しいパスワードを入力してください。
        </p>
        {serverError && (
          <div className={styles.errorMessage}>{serverError}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input type="hidden" {...register('token')} />
          <div>
            <p className="font-bold mb-3">新しいパスワード</p>
            <InputForm
              type="password"
              placeholder="8文字以上で入力"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <p className="font-bold mb-3">パスワード（確認）</p>
            <InputForm
              type="password"
              placeholder="もう一度入力"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || isPending}
          >
            {isPending ? '変更中...' : 'パスワードを変更'}
          </Button>
        </form>
        <Link href="/login" className={styles.link}>
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <p className="text-white">読み込み中...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
