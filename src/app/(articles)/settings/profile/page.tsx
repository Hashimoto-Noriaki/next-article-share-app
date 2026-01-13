'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import {
  updateUserSchema,
  UpdateUserInput,
} from '@/shared/lib/validations/user';

export default function SettingsPage() {
  const router = useRouter();
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/users/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const user = await res.json();
      setValue('name', user.name || '');
      setValue('email', user.email);
    };

    fetchUser();
  }, [router, setValue]);

  const onSubmit = async (data: UpdateUserInput) => {
    setSuccess('');
    setServerError('');

    const res = await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setServerError(result.message || '更新に失敗しました');
      return;
    }

    setSuccess('プロフィールを更新しました');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
      </header>
      <main className="container mx-auto px-5 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">プロフィール</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded">
              {success}
            </div>
          )}
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
              {serverError}
            </div>
          )}
          <div className="mb-4">
            <label className="block font-bold mb-2">名前</label>
            <InputForm type="text" placeholder="名前" {...register('name')} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block font-bold mb-2">メールアドレス</label>
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
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? '更新中...' : '更新する'}
          </Button>
        </form>
      </main>
    </div>
  );
}
