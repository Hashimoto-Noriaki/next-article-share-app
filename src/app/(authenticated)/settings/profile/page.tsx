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
import { updateUserSchema, UpdateUserInput } from '@/external/dto/user';
import { useCurrentUser } from '@/shared/hooks';
import {
  updateUserProfileAction,
  updateUserImageAction,
} from '@/features/users/actions/user.action';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (isError) {
      router.push('/login');
    }
  }, [isError, router]);

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

      // uploadはRoute Handlerのまま（ファイルアップロードはServer Actionで扱えないため）
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
      const result = await updateUserImageAction({ image: url });
      if (!result.success) {
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

    const result = await updateUserProfileAction({
      name: data.name,
      email: data.email,
    });

    if (!result.success) {
      setServerError(result.error || '更新に失敗しました');
      return;
    }

    setSuccess('プロフィールを更新しました');
    setUserName(data.name || '');
  };

  if (isUserLoading) {
    return (
      <div className={styles.loading}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/articles" className={styles.headerLink}>
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
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>プロフィール</h1>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>プロフィール画像</h2>
          <div className={styles.avatarWrapper}>
            <button
              type="button"
              onClick={handleImageClick}
              disabled={isUploading}
              className={styles.avatarButton}
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className={styles.avatarPlaceholder}>未設定</div>
              )}
              {isUploading && (
                <div className={styles.avatarUploading}>更新中...</div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className={styles.fileInput}
              placeholder="プロフィール"
            />
            <p className={styles.avatarHint}>クリックして画像を変更</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {success && <div className={styles.successMessage}>{success}</div>}
          {serverError && (
            <div className={styles.errorMessage}>{serverError}</div>
          )}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>名前</label>
            <InputForm type="text" placeholder="名前" {...register('name')} />
            {errors.name && (
              <p className={styles.fieldError}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.fieldGroupLast}>
            <label className={styles.label}>メールアドレス</label>
            <InputForm
              type="email"
              placeholder="メールアドレス"
              {...register('email')}
            />
            {errors.email && (
              <p className={styles.fieldError}>{errors.email.message}</p>
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
