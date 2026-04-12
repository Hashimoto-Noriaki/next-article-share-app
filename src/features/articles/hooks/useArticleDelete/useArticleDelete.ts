'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteArticleAction } from '@/features/articles/actions/article.action';

type UseArticleDeleteParams = {
  articleId: string;
};

export function useArticleDelete({ articleId }: UseArticleDeleteParams) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteArticle = async () => {
    if (!confirm('本当に削除しますか？')) return;

    setIsDeleting(true);
    try {
      const result = await deleteArticleAction({ articleId });
      if (!result.success) throw new Error(result.error);

      router.push('/articles');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '削除に失敗しました';
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteArticle };
}
