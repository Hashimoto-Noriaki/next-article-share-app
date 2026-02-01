'use client';

import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useLike } from '../../hooks';

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
  const { isLiked, likeCount, isLoading, toggleLike } = useLike({
    articleId,
    initialLiked,
    initialCount,
  });

  const handleClick = () => {
    if (isAuthor) {
      alert('自分の記事にはいいねできません');
      return;
    }
    toggleLike();
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
