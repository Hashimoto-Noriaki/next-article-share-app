'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発環境のみ表示、本番ビルドでは自動的に除外される */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
