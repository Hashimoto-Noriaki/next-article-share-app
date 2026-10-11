'use client';

import { ErrorFallback } from '@/shared/components/organisms/ErrorFallback';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} reset={reset} />;
}
