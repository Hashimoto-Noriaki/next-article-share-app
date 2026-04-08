import { renderHook, act } from '@testing-library/react';
import { useArticleDelete } from './useArticleDelete';
import { deleteArticleAction } from '@/features/articles/actions/article.action';

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock('@/features/articles/actions/article.action', () => ({
  deleteArticleAction: jest.fn(),
}));

const mockDeleteArticleAction = deleteArticleAction as jest.MockedFunction<
  typeof deleteArticleAction
>;

describe('useArticleDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn().mockReturnValue(true);
    window.alert = jest.fn();
  });

  it('confirm=falseの場合は何もしない', async () => {
    window.confirm = jest.fn().mockReturnValue(false);

    const { result } = renderHook(() =>
      useArticleDelete({ articleId: 'article-1' }),
    );

    await act(async () => {
      await result.current.deleteArticle();
    });

    expect(mockDeleteArticleAction).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('削除成功時はrouter.push("/articles")とrouter.refresh()が呼ばれる', async () => {
    mockDeleteArticleAction.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useArticleDelete({ articleId: 'article-1' }),
    );

    await act(async () => {
      await result.current.deleteArticle();
    });

    expect(mockPush).toHaveBeenCalledWith('/articles');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('削除失敗時はalertが呼ばれる', async () => {
    mockDeleteArticleAction.mockResolvedValue({
      success: false,
      error: '削除権限がありません',
    });

    const { result } = renderHook(() =>
      useArticleDelete({ articleId: 'article-1' }),
    );

    await act(async () => {
      await result.current.deleteArticle();
    });

    expect(window.alert).toHaveBeenCalledWith('削除権限がありません');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
