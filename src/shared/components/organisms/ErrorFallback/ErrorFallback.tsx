'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/atoms/Button';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function ErrorFallback({ error, reset }: Props) {
  useEffect(() => {
    // 想定外の例外。Sentry 導入時はここで captureException する
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-6">
          時間をおいてから、もう一度お試しください。
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6">エラーID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-3">
          <Button onClick={reset}>もう一度試す</Button>
          <Link href="/" className="text-cyan-600 hover:underline">
            トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
