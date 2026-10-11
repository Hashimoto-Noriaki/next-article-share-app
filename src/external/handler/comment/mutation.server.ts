import type { ActionResult } from '@/shared/types/action';
import { ok, fail, validationFail } from '@/shared/lib/action-result';
import { commentRepository } from '@/external/repository/comment';
import { articleRepository } from '@/external/repository/article';
import { createNotification } from '@/external/service/notification';
import {
  createCommentSchema,
  updateCommentSchema,
} from '@/external/dto/comment/comment.dto';

type Comment = Awaited<ReturnType<typeof commentRepository.create>>;

export async function createCommentHandler({
  content,
  userId,
  articleId,
}: {
  content: string;
  userId: string;
  articleId: string;
}): Promise<ActionResult<Comment>> {
  const parsed = createCommentSchema.safeParse({ content, articleId });
  if (!parsed.success) {
    return validationFail(parsed.error);
  }

  const article = await articleRepository.findAuthorById(articleId);
  if (!article) {
    return fail('記事が見つかりません');
  }

  const comment = await commentRepository.create({
    content: parsed.data.content.trim(),
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

  return ok(comment);
}

export async function updateCommentHandler({
  commentId,
  content,
  userId,
}: {
  commentId: string;
  content: string;
  userId: string;
}): Promise<ActionResult<Comment>> {
  const parsed = updateCommentSchema.safeParse({ content });
  if (!parsed.success) {
    return validationFail(parsed.error);
  }

  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    return fail('コメントが見つかりません');
  }

  if (comment.userId !== userId) {
    return fail('自分のコメントのみ編集できます');
  }

  const updated = await commentRepository.update(
    commentId,
    parsed.data.content.trim(),
  );
  return ok(updated);
}

export async function deleteCommentHandler({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}): Promise<ActionResult> {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    return fail('コメントが見つかりません');
  }

  if (comment.userId !== userId) {
    return fail('自分のコメントのみ削除できます');
  }

  await commentRepository.delete(commentId);
  return ok();
}
