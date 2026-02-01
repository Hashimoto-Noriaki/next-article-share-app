'use client';

import { useCommentForm } from '../../../hooks';

type Props = {
  articleId: string;
};

export function CommentForm({ articleId }: Props) {
  const { content, setContent, isLoading, submitComment } = useCommentForm({
    articleId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを入力..."
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 transition"
        >
          {isLoading ? '投稿中...' : 'コメントする'}
        </button>
      </div>
    </form>
  );
}
