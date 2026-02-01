import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UseStockParams = {
  articleId: string;
  initialStocked: boolean;
};

export function useStock({ articleId, initialStocked }: UseStockParams) {
  const router = useRouter();
  const [isStocked, setIsStocked] = useState(initialStocked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleStock = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/stock`, {
        method: isStocked ? 'DELETE' : 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'エラーが発生しました');
      }

      setIsStocked(!isStocked);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isStocked,
    isLoading,
    toggleStock,
  };
}
