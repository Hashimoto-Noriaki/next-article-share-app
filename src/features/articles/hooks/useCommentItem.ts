import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UseCommentItemParams = {
  articleId: string;
  commentId: string;
  initialContent: string;
};

export function useCommentItem({
  articleId,
  commentId,
  initialContent,
}: UseCommentItemParams) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const updateComment = async () => {
    if (!editContent.trim()) {
      alert('コメントを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'エラーが発生しました');
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async () => {
    if (!confirm('コメントを削除しますか？')) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'エラーが発生しました');
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setIsEditing(false);
    setEditContent(initialContent);
  };

  return {
    isEditing,
    editContent,
    setEditContent,
    isLoading,
    updateComment,
    deleteComment,
    startEditing,
    cancelEditing,
  };
}
