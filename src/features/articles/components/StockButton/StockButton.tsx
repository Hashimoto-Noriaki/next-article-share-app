'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

type Props = {
  articleId: string;
  initialStocked: boolean;
};

export function StockButton({ articleId, initialStocked }: Props) {
  const router = useRouter();
  const [isStocked, setIsStocked] = useState(initialStocked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/stock`, {
        method: isStocked ? 'DELETE' : 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'エラーが発生しました');
        return;
      }

      setIsStocked(!isStocked);
      router.refresh();
    } catch (error) {
      console.error('ストックエラー:', error);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
        isStocked
          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {isStocked ? (
        <BsBookmarkFill className="w-5 h-5" />
      ) : (
        <BsBookmark className="w-5 h-5" />
      )}
      <span>{isStocked ? 'ストック済み' : 'ストック'}</span>
    </button>
  );
}