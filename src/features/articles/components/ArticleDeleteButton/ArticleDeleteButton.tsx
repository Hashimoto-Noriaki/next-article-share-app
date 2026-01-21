'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  articleId: string;
};

export function ArticleDeleteButton({ articleId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
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
        alert(data.message || '削除に失敗しました');
        return;
      }

      router.push('/articles');
      router.refresh();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center border border-red-500 text-red-600 text-sm font-medium px-5 py-3 rounded-md hover:bg-red-100 transition"
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  );
}
