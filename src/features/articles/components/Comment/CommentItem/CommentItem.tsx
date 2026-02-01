'use client';

import { useCommentItem } from '../../hooks';

type Props = {
  id: string;
  content: string;
  articleId: string;
  userId: string;
  userName: string;
  createdAt: string;
  isOwner: boolean;
};

export function CommentItem({
  id,
  content,
  articleId,
  userName,
  createdAt,
  isOwner,
}: Props) {
  const {
    isEditing,
    editContent,
    setEditContent,
    isLoading,
    updateComment,
    deleteComment,
    startEditing,
    cancelEditing,
  } = useCommentItem({
    articleId,
    commentId: id,
    initialContent: content,
  });

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold text-gray-800">{userName}</span>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(createdAt).toLocaleDateString('ja-JP')}
          </span>
        </div>
        {isOwner && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={startEditing}
              className="px-3 py-1 text-sm border border-cyan-500 text-cyan-600 rounded-md hover:bg-cyan-50 transition"
            >
              編集
            </button>
            <button
              onClick={deleteComment}
              disabled={isLoading}
              className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition"
            >
              削除
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            placeholder="コメント"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={updateComment}
              disabled={isLoading}
              className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:bg-gray-300 text-sm"
            >
              {isLoading ? '更新中...' : '更新'}
            </button>
            <button
              onClick={cancelEditing}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
}
