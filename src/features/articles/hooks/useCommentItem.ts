'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateCommentAction,
  deleteCommentAction,
} from '@/features/articles/actions/comment.action';

type UseCommentItemParams = {
  commentId: string;
  initialContent: string;
};

export function useCommentItem({
  commentId,
  initialContent,
}: UseCommentItemParams) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const updateComment = async () => {
    setIsLoading(true);
    try {
      const result = await updateCommentAction({
        commentId,
        content: editContent,
      });
      if (!result.success)
        throw new Error(
          'errors' in result
            ? result.errors?.map((e) => e.message).join('\n')
            : result.error,
        );
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async () => {
    if (!confirm('コメントを削除しますか？')) return;
    setIsLoading(true);
    try {
      const result = await deleteCommentAction({ commentId });
      if (!result.success) throw new Error(result.error);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    editContent,
    setEditContent,
    isLoading,
    updateComment,
    deleteComment,
    startEditing: () => setIsEditing(true),
    cancelEditing: () => {
      setIsEditing(false);
      setEditContent(initialContent);
    },
  };
}
