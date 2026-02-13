'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';
import { NavigationHeader } from '@/shared/components/molecules/NavigationHeader';
import { Footer } from '../../../../shared/components/organisms/Footer';
import {
  updateUserSchema,
  UpdateUserInput,
} from '@/shared/lib/validations/user';
import { useCurrentUser } from '@/shared/hooks';

export default function SettingsPage() {
  const router = useRouter();
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ユーザー情報（TanStack Query）
  const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  // 認証エラー時はログインページへ
  useEffect(() => {
    if (isError) {
      router.push('/login');
    }
  }, [isError, router]);

  // ユーザー情報をフォームにセット
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setUserName(user.name || '');
      setUserImage(user.image || null);
    }
  }, [user, setValue]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'profiles');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        setServerError(data.message || '画像のアップロードに失敗しました');
        return;
      }

      const { url } = await uploadRes.json();

      // ユーザー情報を更新
      const updateRes = await fetch('/api/users/me/image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: url }),
      });

      if (!updateRes.ok) {
        setServerError('プロフィール画像の更新に失敗しました');
        return;
      }

      setUserImage(url);
      setSuccess('プロフィール画像を更新しました');
    } catch (error) {
      console.error('アップロードエラー:', error);
      setServerError('画像のアップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

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
    setUserName(data.name || '');
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex justify-between items-center">
        <Link
          href="/articles"
          className="text-white font-bold text-xl hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
        {user && (
          <NavigationHeader
            userId={user.id}
            userName={userName}
            userImage={userImage}
          />
        )}
      </header>
      <main className="container mx-auto px-5 py-8 max-w-md grow">
        <h1 className="text-2xl font-bold mb-8 text-center">プロフィール</h1>
        {/* プロフィール画像 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="font-bold mb-4">プロフィール画像</h2>
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleImageClick}
              disabled={isUploading}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 hover:border-cyan-500 transition cursor-pointer"
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  未設定
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
                  更新中...
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
              placeholder="プロフィール"
            />
            <p className="text-sm text-gray-500 mt-2">クリックして画像を変更</p>
          </div>
        </div>
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
      <Footer />
    </div>
  );
}
