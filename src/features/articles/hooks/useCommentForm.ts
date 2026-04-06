'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCommentAction } from '@/features/articles/actions/comment.action';

type UseCommentFormParams = {
  articleId: string;
};

export function useCommentForm({ articleId }: UseCommentFormParams) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitComment = async () => {
    setIsLoading(true);

    try {
      const result = await createCommentAction({ articleId, content });
      console.log('result:', JSON.stringify(result));
      if (!result.success)
        throw new Error(
          'errors' in result
            ? result.errors?.map((e) => e.message).join('\n')
            : result.error,
        );

      setContent('');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'エラーが発生しました';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { content, setContent, isLoading, submitComment };
}
