import { renderHook, act } from '@testing-library/react';
import { useCommentItem } from './useCommentItem';
import {
  updateCommentAction,
  deleteCommentAction,
} from '@/features/articles/actions/comment.action';

const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

jest.mock('@/features/articles/actions/comment.action', () => ({
  updateCommentAction: jest.fn(),
  deleteCommentAction: jest.fn(),
}));

const mockUpdateCommentAction = updateCommentAction as jest.MockedFunction<
  typeof updateCommentAction
>;
const mockDeleteCommentAction = deleteCommentAction as jest.MockedFunction<
  typeof deleteCommentAction
>;

describe('useCommentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn().mockReturnValue(true);
    window.alert = jest.fn();
  });

  describe('updateComment', () => {
    it('更新成功時はisEditingがfalseになりrouter.refresh()が呼ばれる', async () => {
      mockUpdateCommentAction.mockResolvedValue({
        success: true,
        comment: {
          id: 'comment-1',
          content: '更新後',
          userId: 'user-1',
          articleId: 'article-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 'user-1', name: 'テスト', image: null },
        },
      });

      const { result } = renderHook(() =>
        useCommentItem({
          commentId: 'comment-1',
          initialContent: '元のコメント',
        }),
      );

      act(() => {
        result.current.startEditing();
      });

      await act(async () => {
        await result.current.updateComment();
      });

      expect(result.current.isEditing).toBe(false);
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('更新失敗時はalertが呼ばれる', async () => {
      mockUpdateCommentAction.mockResolvedValue({
        success: false,
        error: '自分のコメントのみ編集できます',
      });

      const { result } = renderHook(() =>
        useCommentItem({
          commentId: 'comment-1',
          initialContent: '元のコメント',
        }),
      );

      await act(async () => {
        await result.current.updateComment();
      });

      expect(window.alert).toHaveBeenCalledWith(
        '自分のコメントのみ編集できます',
      );
    });
  });

  describe('deleteComment', () => {
    it('confirm=falseの場合は何もしない', async () => {
      window.confirm = jest.fn().mockReturnValue(false);

      const { result } = renderHook(() =>
        useCommentItem({
          commentId: 'comment-1',
          initialContent: '元のコメント',
        }),
      );

      await act(async () => {
        await result.current.deleteComment();
      });

      expect(mockDeleteCommentAction).not.toHaveBeenCalled();
    });

    it('削除成功時はrouter.refresh()が呼ばれる', async () => {
      mockDeleteCommentAction.mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useCommentItem({
          commentId: 'comment-1',
          initialContent: '元のコメント',
        }),
      );

      await act(async () => {
        await result.current.deleteComment();
      });

      expect(mockRefresh).toHaveBeenCalled();
    });

    it('削除失敗時はalertが呼ばれる', async () => {
      mockDeleteCommentAction.mockResolvedValue({
        success: false,
        error: '自分のコメントのみ削除できます',
      });

      const { result } = renderHook(() =>
        useCommentItem({
          commentId: 'comment-1',
          initialContent: '元のコメント',
        }),
      );

      await act(async () => {
        await result.current.deleteComment();
      });

      expect(window.alert).toHaveBeenCalledWith(
        '自分のコメントのみ削除できます',
      );
    });
  });

  describe('cancelEditing', () => {
    it('editContentがinitialContentに戻る', () => {
      const { result } = renderHook(() =>
        useCommentItem({
          commentId: 'comment-1',
          initialContent: '元のコメント',
        }),
      );

      act(() => {
        result.current.startEditing();
        result.current.setEditContent('変更後');
      });

      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.editContent).toBe('元のコメント');
      expect(result.current.isEditing).toBe(false);
    });
  });
});
