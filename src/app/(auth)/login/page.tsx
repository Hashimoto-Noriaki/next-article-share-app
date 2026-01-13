'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { FaLaptopCode } from 'react-icons/fa';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import { loginSchema, LoginInput } from '@/shared/lib/validations/auth';

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

  const onSubmit = async (data: LoginInput) => {
    setServerError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setServerError('メールアドレスまたはパスワードが間違っています');
      return;
    }

    router.push('/articles');
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">ログイン</h2>
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
          <Link
            href="/signup"
            className="text-center underline mt-5 hover:text-cyan-800"
          >
            新規登録はこちら
          </Link>
        </form>
      </div>
    </div>
  );
}
