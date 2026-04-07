import { renderHook, act } from '@testing-library/react';
import { useStock } from './useStock';

jest.mock('@/features/articles/actions/stock.action', () => ({
  stockArticleAction: jest.fn(),
  unstockArticleAction: jest.fn(),
}));

import {
  stockArticleAction,
  unstockArticleAction,
} from '@/features/articles/actions/stock.action';

describe('useStock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態が正しい', () => {
    const { result } = renderHook(() =>
      useStock({ articleId: 'article-1', initialStocked: false }),
    );
    expect(result.current.isStocked).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  describe('toggleStock', () => {
    it('未ストック状態でtoggleするとストック済みになる', async () => {
      (stockArticleAction as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useStock({ articleId: 'article-1', initialStocked: false }),
      );

      await act(async () => {
        await result.current.toggleStock();
      });

      expect(stockArticleAction).toHaveBeenCalledWith({ articleId: 'article-1' });
      expect(result.current.isStocked).toBe(true);
    });

    it('ストック済み状態でtoggleするとストック解除される', async () => {
      (unstockArticleAction as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useStock({ articleId: 'article-1', initialStocked: true }),
      );

      await act(async () => {
        await result.current.toggleStock();
      });

      expect(unstockArticleAction).toHaveBeenCalledWith({ articleId: 'article-1' });
      expect(result.current.isStocked).toBe(false);
    });

    it('actionがエラーを返した場合は状態が変わらない', async () => {
      (stockArticleAction as jest.Mock).mockResolvedValue({
        success: false,
        error: 'エラーが発生しました',
      });
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useStock({ articleId: 'article-1', initialStocked: false }),
      );

      await act(async () => {
        await result.current.toggleStock();
      });

      expect(result.current.isStocked).toBe(false);
    });

    it('処理中はisLoadingがtrueになる', async () => {
      let resolve: (value: unknown) => void;
      (stockArticleAction as jest.Mock).mockReturnValue(
        new Promise((r) => { resolve = r; }),
      );

      const { result } = renderHook(() =>
        useStock({ articleId: 'article-1', initialStocked: false }),
      );

      act(() => {
        result.current.toggleStock();
      });
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolve!({ success: true });
      });
      expect(result.current.isLoading).toBe(false);
    });
  });
});
