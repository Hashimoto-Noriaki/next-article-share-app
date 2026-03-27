import { commentRepository } from '@/external/repository/comment';
import { articleRepository } from '@/external/repository/article';
import { createNotification } from '@/lib/notification';

export async function createCommentHandler({
  content,
  userId,
  articleId,
}: {
  content: string;
  userId: string;
  articleId: string;
}) {
  if (!content || content.trim() === '') {
    return { success: false as const, error: 'コメント内容を入力してください' };
  }

  const article = await articleRepository.findAuthorById(articleId);
  if (!article) {
    return { success: false as const, error: '記事が見つかりません' };
  }

  const comment = await commentRepository.create({
    content: content.trim(),
    userId,
    articleId,
  });

  // 自分の記事へのコメントは通知しない（likeHandlerと同じ思想）
  if (article.authorId !== userId) {
    await createNotification({
      type: 'comment',
      userId: article.authorId,
      senderId: userId,
      articleId,
    });
  }

  return { success: true as const, comment };
}

export async function updateCommentHandler({
  commentId,
  content,
  userId,
}: {
  commentId: string;
  content: string;
  userId: string;
}) {
  if (!content || content.trim() === '') {
    return { success: false as const, error: 'コメント内容を入力してください' };
  }

  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    return { success: false as const, error: 'コメントが見つかりません' };
  }

  if (comment.userId !== userId) {
    return { success: false as const, error: '自分のコメントのみ編集できます' };
  }

  const updated = await commentRepository.update(commentId, content.trim());
  return { success: true as const, comment: updated };
}

export async function deleteCommentHandler({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    return { success: false as const, error: 'コメントが見つかりません' };
  }

  if (comment.userId !== userId) {
    return { success: false as const, error: '自分のコメントのみ削除できます' };
  }

  await commentRepository.delete(commentId);
  return { success: true as const };
}
