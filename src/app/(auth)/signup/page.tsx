'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { FaLaptopCode, FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { InputForm } from '@/shared/components/atoms/InputForm';
import { Button } from '@/shared/components/atoms/Button';
import { signupSchema, SignUpInput } from '@/shared/lib/validations/auth';

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

  // メール/パスワードで登録
  const onSubmit = async (data: SignUpInput) => {
    setServerError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setServerError(result.message || '登録に失敗しました');
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

  // GitHub で登録
  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/articles' });
  };

  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-linear-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">新規登録</h2>

        {serverError && (
          <div className="w-full rounded-md bg-rose-200 border-rose-300 text-rose-800 px-4 py-2 text-sm text-center shadow-sm mt-3">
            {serverError}
          </div>
        )}

        {/* メール/パスワードフォーム */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 text-left mt-5"
        >
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

        {/* 区切り線 */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-white/50" />
          <span className="text-white text-sm">または</span>
          <hr className="flex-1 border-white/50" />
        </div>

        {/* GitHub 登録ボタン */}
        <button
          type="button"
          onClick={handleGitHubSignIn}
          className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition font-bold"
        >
          <FaGithub className="text-xl" />
          GitHubで登録
        </button>

        <Link
          href="/login"
          className="block text-center underline mt-5 hover:text-cyan-800"
        >
          ログインはこちら
        </Link>
      </div>
    </div>
  );
}
