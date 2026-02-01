'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from '@/shared/lib/validations/auth';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('パスワードリセットリクエストエラー:', err);
      setServerError(
        'エラーが発生しました。しばらく経ってからお試しください。',
      );
    }
  };

  // 送信完了画面
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center p-20 max-h-screen">
        <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
          <h1 className="text-2xl flex items-center text-white font-bold">
            <FaLaptopCode />
            テックブログ共有アプリ
          </h1>
          <h2 className="text-xl text-white font-bold mt-3">メール送信完了</h2>

          <div className="w-full rounded-md bg-green-200 border-green-300 text-green-800 px-4 py-3 text-sm text-center shadow-sm mt-5">
            登録されているメールアドレスの場合、パスワードリセットのメールを送信しました。
            メールボックスをご確認ください。
          </div>

          <p className="text-white text-sm mt-5">
            メールが届かない場合は、迷惑メールフォルダをご確認いただくか、
            数分後に再度お試しください。
          </p>

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

  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">
          パスワードをお忘れの方
        </h2>

        <p className="text-white text-sm mt-3">
          登録したメールアドレスを入力してください。
          パスワードリセットのリンクをお送りします。
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

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '送信中...' : 'リセットリンクを送信'}
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
