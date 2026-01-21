'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

type Props = {
  articleId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthor: boolean;
};

export function LikeButton({
  articleId,
  initialLiked,
  initialCount,
  isAuthor,
}: Props) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isAuthor) {
      alert('自分の記事にはいいねできません');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'エラーが発生しました');
        return;
      }

      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      router.refresh();
    } catch (error) {
      console.error('いいねエラー:', error);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isAuthor}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
        isAuthor
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : isLiked
            ? 'bg-red-100 text-red-500 hover:bg-red-200'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {isLiked ? (
        <AiFillHeart className="w-5 h-5" />
      ) : (
        <AiOutlineHeart className="w-5 h-5" />
      )}
      <span>{likeCount}</span>
    </button>
  );
}
