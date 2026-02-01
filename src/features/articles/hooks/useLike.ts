import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UseLikeParams = {
  articleId: string;
  initialLiked: boolean;
  initialCount: number;
};

export function useLike({
  articleId,
  initialLiked,
  initialCount,
}: UseLikeParams) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'エラーが発生しました');
      }

      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
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
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
  };
}
