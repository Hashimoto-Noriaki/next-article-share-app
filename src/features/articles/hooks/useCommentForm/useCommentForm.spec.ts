import { renderHook, act } from '@testing-library/react';
import { useCommentForm } from './useCommentForm';
import { createCommentAction } from '@/features/articles/actions/comment.action';

const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

jest.mock('@/features/articles/actions/comment.action', () => ({
  createCommentAction: jest.fn(),
}));

const mockCreateCommentAction = createCommentAction as jest.MockedFunction<
  typeof createCommentAction
>;

describe('useCommentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  it('投稿成功時はcontentがリセットされrouter.refresh()が呼ばれる', async () => {
    mockCreateCommentAction.mockResolvedValue({
      success: true,
      comment: {
        id: 'comment-1',
        content: 'テストコメント',
        userId: 'user-1',
        articleId: 'article-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 'user-1', name: 'テスト', image: null },
      },
    } as Awaited<ReturnType<typeof createCommentAction>>);

    const { result } = renderHook(() =>
      useCommentForm({ articleId: 'article-1' }),
    );

    act(() => {
      result.current.setContent('テストコメント');
    });

    await act(async () => {
      await result.current.submitComment();
    });

    expect(result.current.content).toBe('');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('投稿失敗時はalertが呼ばれる', async () => {
    mockCreateCommentAction.mockResolvedValue({
      success: false,
      error: '認証が必要です',
    });

    const { result } = renderHook(() =>
      useCommentForm({ articleId: 'article-1' }),
    );

    await act(async () => {
      await result.current.submitComment();
    });

    expect(window.alert).toHaveBeenCalledWith('認証が必要です');
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('バリデーションエラー時はerrorsのmessageがalertに表示される', async () => {
    mockCreateCommentAction.mockResolvedValue({
      success: false,
      errors: [
        {
          message: 'コメント内容を入力してください',
          code: 'too_small',
          minimum: 1,
          inclusive: true,
          path: ['content'],
        },
      ],
    } as Awaited<ReturnType<typeof createCommentAction>>);

    const { result } = renderHook(() =>
      useCommentForm({ articleId: 'article-1' }),
    );

    await act(async () => {
      await result.current.submitComment();
    });

    expect(window.alert).toHaveBeenCalledWith('コメント内容を入力してください');
  });
});
