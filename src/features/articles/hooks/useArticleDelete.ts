import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UseArticleDeleteParams = {
  articleId: string;
};

export function useArticleDelete({ articleId }: UseArticleDeleteParams) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteArticle = async () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '削除に失敗しました');
      }

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

  return {
    isDeleting,
    deleteArticle,
  };
}
