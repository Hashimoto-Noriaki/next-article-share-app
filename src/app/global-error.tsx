'use client';

import { ErrorFallback } from '@/shared/components/organisms/ErrorFallback';
import './globals.css';

// ルートレイアウト自体で例外が起きたときに表示する。layout.tsx を置き換えるので html / body を持つ
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <ErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}
