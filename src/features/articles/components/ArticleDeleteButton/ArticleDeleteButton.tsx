'use client';

import { useArticleDelete } from '../../hooks';

type Props = {
  articleId: string;
};

export function ArticleDeleteButton({ articleId }: Props) {
  const { isDeleting, deleteArticle } = useArticleDelete({ articleId });

  return (
    <button
      onClick={deleteArticle}
      disabled={isDeleting}
      className="inline-flex items-center border border-red-500 text-red-600 text-sm font-medium px-5 py-3 rounded-md hover:bg-red-100 transition"
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  );
}
