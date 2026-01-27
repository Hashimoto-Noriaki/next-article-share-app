'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  articleId: string;
};

export function CommentForm({ articleId }: Props) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('コメントを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'エラーが発生しました');
        return;
      }

      setContent('');
      router.refresh();
    } catch (error) {
      console.error('コメント投稿エラー:', error);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
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
