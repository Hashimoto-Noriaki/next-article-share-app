'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from '@/shared/lib/validations/auth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
    },
  });

  // トークンの有効性を確認
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();
        setIsTokenValid(data.valid);
      } catch (err) {
        console.error('トークン検証エラー:', err);
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message);
        return;
      }

      setIsSuccess(true);

      // 3秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('パスワードリセットエラー:', err);
      setServerError('エラーが発生しました。しばらく経ってからお試しください。');
    }
  };

  // ローディング中
  if (isValidating) {
    return (
      <div className="flex items-center justify-center p-20 max-h-screen">
        <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
          <h1 className="text-2xl flex items-center text-white font-bold">
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <p className="text-white mt-5">確認中...</p>
        </div>
      </div>
    );
  }

  // トークンが無効な場合
  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center p-20 max-h-screen">
        <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
          <h1 className="text-2xl flex items-center text-white font-bold">
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <h2 className="text-xl text-white font-bold mt-3">無効なリンク</h2>

          <div className="w-full rounded-md bg-rose-200 border-rose-300 text-rose-800 px-4 py-3 text-sm text-center shadow-sm mt-5">
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

  // 成功画面
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center p-20 max-h-screen">
        <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
          <h1 className="text-2xl flex items-center text-white font-bold">
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <h2 className="text-xl text-white font-bold mt-3">パスワード変更完了</h2>

          <div className="w-full rounded-md bg-green-200 border-green-300 text-green-800 px-4 py-3 text-sm text-center shadow-sm mt-5">
            パスワードを変更しました。新しいパスワードでログインできます。
          </div>

          <p className="text-white text-sm mt-5">
            自動的にログインページへ移動します...
          </p>

          <Link
            href="/login"
            className="block text-center underline mt-5 hover:text-cyan-800"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  // パスワード入力フォーム
  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
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
          <div className="w-full rounded-md bg-rose-200 border-rose-300 text-rose-800 px-4 py-2 text-sm text-center shadow-sm mt-3">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 text-left mt-5"
        >
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

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '変更中...' : 'パスワードを変更'}
          </Button>
        </form>

        <Link
          href="/login"
          className="block text-center underline mt-5 hover:text-cyan-800"
        >
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
}

// Suspenseでラップ（useSearchParamsのため）
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-20 max-h-screen">
          <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
            <p className="text-white">読み込み中...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
