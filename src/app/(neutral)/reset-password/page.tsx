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

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center p-20 max-h-screen">
        <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
          <h1 className="text-2xl flex items-center text-white font-bold">
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <h2 className="text-xl text-white font-bold mt-3">
            パスワード変更完了
          </h2>
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
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || isPending}
          >
            {isPending ? '変更中...' : 'パスワードを変更'}
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
