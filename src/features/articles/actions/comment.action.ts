'use server';

import { auth } from '@/external/auth';
import {
  createCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '@/external/handler/comment/mutation.server';

export async function createCommentAction({
  articleId,
  content,
}: {
  articleId: string;
  content: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return createCommentHandler({ content, userId, articleId });
}

export async function updateCommentAction({
  commentId,
  content,
}: {
  commentId: string;
  content: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return updateCommentHandler({ commentId, content, userId });
}

export async function deleteCommentAction({
  commentId,
}: {
  commentId: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false as const, error: '認証が必要です' };

  return deleteCommentHandler({ commentId, userId });
}
