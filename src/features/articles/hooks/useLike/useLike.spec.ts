import { renderHook, act } from '@testing-library/react';
import { useLike } from './useLike';

jest.mock('@/features/articles/actions/like.action', () => ({
  likeArticleAction: jest.fn(),
  unlikeArticleAction: jest.fn(),
}));

import {
  likeArticleAction,
  unlikeArticleAction,
} from '@/features/articles/actions/like.action';

describe('useLike', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態が正しい', () => {
    const { result } = renderHook(() =>
      useLike({ articleId: 'article-1', initialLiked: false, initialCount: 5 }),
    );
    expect(result.current.isLiked).toBe(false);
    expect(result.current.likeCount).toBe(5);
    expect(result.current.isLoading).toBe(false);
  });

  describe('toggleLike', () => {
    it('未いいね状態でtoggleするといいね済みになりcountが増える', async () => {
      (likeArticleAction as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useLike({ articleId: 'article-1', initialLiked: false, initialCount: 5 }),
      );

      await act(async () => {
        await result.current.toggleLike();
      });

      expect(likeArticleAction).toHaveBeenCalledWith({ articleId: 'article-1' });
      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(6);
    });

    it('いいね済み状態でtoggleするといいね解除されcountが減る', async () => {
      (unlikeArticleAction as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useLike({ articleId: 'article-1', initialLiked: true, initialCount: 5 }),
      );

      await act(async () => {
        await result.current.toggleLike();
      });

      expect(unlikeArticleAction).toHaveBeenCalledWith({ articleId: 'article-1' });
      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(4);
    });

    it('actionがエラーを返した場合は状態が変わらない', async () => {
      (likeArticleAction as jest.Mock).mockResolvedValue({
        success: false,
        error: 'エラーが発生しました',
      });
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLike({ articleId: 'article-1', initialLiked: false, initialCount: 5 }),
      );

      await act(async () => {
        await result.current.toggleLike();
      });

      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(5);
    });

    it('処理中はisLoadingがtrueになる', async () => {
      let resolve: (value: unknown) => void;
      (likeArticleAction as jest.Mock).mockReturnValue(
        new Promise((r) => { resolve = r; }),
      );

      const { result } = renderHook(() =>
        useLike({ articleId: 'article-1', initialLiked: false, initialCount: 5 }),
      );

      act(() => {
        result.current.toggleLike();
      });
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolve!({ success: true });
      });
      expect(result.current.isLoading).toBe(false);
    });
  });
});
