'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/components/atoms/Button';
import { InputForm } from '@/shared/components/atoms/InputForm';

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const user = await res.json();
        setName(user.name || '');
        setEmail(user.email);
      } catch (err) {
        console.error('ユーザー取得エラー:', err);
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || '更新に失敗しました');
        return;
      }

      setSuccess('プロフィールを更新しました');
    } catch (err) {
      console.error('更新エラー:', err);
      setError('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold mb-8 text-center">設定</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block font-bold mb-2">名前</label>
            <InputForm
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={10}
              placeholder="名前"
            />
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-2">メールアドレス</label>
            <InputForm
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? '更新中...' : '更新する'}
          </Button>
        </form>
      </main>
    </div>
  );
}
