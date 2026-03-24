'use client';

import { useState } from 'react';
import {
  stockArticleAction,
  unstockArticleAction,
} from '@/features/articles/actions/stock.action';

type UseStockParams = {
  articleId: string;
  initialStocked: boolean;
};

export function useStock({ articleId, initialStocked }: UseStockParams) {
  const [isStocked, setIsStocked] = useState(initialStocked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleStock = async () => {
    setIsLoading(true);
    try {
      const result = isStocked
        ? await unstockArticleAction({ articleId })
        : await stockArticleAction({ articleId });

      if (!result.success) {
        alert(result.error);
        return;
      }

      setIsStocked(!isStocked);
    } catch {
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { isStocked, isLoading, toggleStock };
}
