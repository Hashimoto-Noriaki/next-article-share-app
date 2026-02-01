'use client';

import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useStock } from '../../hooks';

type Props = {
  articleId: string;
  initialStocked: boolean;
};

export function StockButton({ articleId, initialStocked }: Props) {
  const { isStocked, isLoading, toggleStock } = useStock({
    articleId,
    initialStocked,
  });

  return (
    <button
      onClick={toggleStock}
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
