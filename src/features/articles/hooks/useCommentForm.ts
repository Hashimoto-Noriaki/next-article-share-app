import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UseCommentFormParams = {
  articleId: string;
};

export function useCommentForm({ articleId }: UseCommentFormParams) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitComment = async () => {
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
        throw new Error(data.message || 'エラーが発生しました');
      }

      setContent('');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    content,
    setContent,
    isLoading,
    submitComment,
  };
}
