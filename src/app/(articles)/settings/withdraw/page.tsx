'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/components/atoms/Button';

export default function WithdrawPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    if (!confirm('本当に退会しますか？投稿した記事も全て削除されます。')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/users/me', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || '退会に失敗しました');
        return;
      }

      router.push('/');
    } catch (err) {
      console.error('退会エラー:', err);
      setError('退会に失敗しました');
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

      <main className="container mx-auto px-5 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">退会</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="mb-4 font-bold text-xl">
            退会すると以下のデータが削除されます：
          </p>
          <ul className="list-disc list-inside mb-6 font-bold">
            <li>アカウント情報</li>
            <li>投稿した記事</li>
          </ul>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleWithdraw}
            disabled={isSubmitting}
            variant="warning"
          >
            {isSubmitting ? '処理中...' : '退会する'}
          </Button>
        </div>
      </main>
    </div>
  );
}
